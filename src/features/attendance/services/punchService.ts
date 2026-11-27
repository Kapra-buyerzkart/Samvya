import { type EntityId } from '@/features/auth';
import {
  getCheckInFix,
  type CheckInLocationFix,
} from '@/features/location/domain/checkInFix';
import { checkLocationPermission } from '@/features/location/domain/permissionMachine';
import {
  getActiveTrackingSession,
  startTrackingSession,
  stopTrackingSession,
} from '@/features/location/domain/trackingSession';
import {
  startBackgroundTracking,
  stopBackgroundTracking,
} from '@/features/location/tasks/backgroundLocationTask';
import { isApiError } from '@/shared/api';
import { Alert } from 'react-native';
import { attendanceApi, type PunchResponse, type PunchType } from '../api/attendanceApi';
import {
  enqueueAttendanceEvent,
  replayAttendanceQueue,
  type AttendanceQueueType,
  type ReplayReport,
} from '../db/attendanceQueue';

export type PunchActionKind = 'punch-in' | 'punch-out';

export interface SubmitAttendancePunchInput {
  action: PunchActionKind;
  employmentId: EntityId;
  userId: string;
  provider?: string;
  timestampMs?: number;
  locationFix?: CheckInLocationFix | null;
}

export interface SubmitAttendancePunchResult {
  synced: boolean;
  queuedOffline: boolean;
  timestampMs: number;
  punchType: PunchType;
  punchTimeUtc: string;
  response: PunchResponse | null;
  offlineErrorMessage?: string;
}

export function actionToPunchType(action: PunchActionKind): PunchType {
  return action === 'punch-in' ? 'IN' : 'OUT';
}

export function actionToQueueType(action: PunchActionKind): AttendanceQueueType {
  return action === 'punch-in' ? 'check_in' : 'check_out';
}

export function queueTypeToPunchType(type: AttendanceQueueType): PunchType {
  return type === 'check_in' ? 'IN' : 'OUT';
}

export async function captureBestEffortLocationFix(): Promise<CheckInLocationFix | null> {
  try {
    const permission = await checkLocationPermission();
    if (permission.status !== 'granted') {
      return null;
    }
    return await getCheckInFix({ maxRetries: 0 });
  } catch {
    return null;
  }
}

export async function replayPendingAttendancePunches(
  employmentId: EntityId,
): Promise<ReplayReport> {
  return replayAttendanceQueue(async (event) => {
    await attendanceApi.punch({
      employmentId,
      punchTimeUtc: new Date(event.timestamp).toISOString(),
      punchType: queueTypeToPunchType(event.type),
    });
    return true;
  });
}

export async function syncLocationTrackingForPunch(
  action: PunchActionKind,
  userId: string,
): Promise<void> {
  try {
    if (action === 'punch-out') {
      stopTrackingSession();
      await stopBackgroundTracking();
      return;
    }

    const current = getActiveTrackingSession();
    if (!current || current.status !== 'tracking') {
      const newSession = startTrackingSession(`sess_${Date.now()}`, userId);
      await startBackgroundTracking(newSession.sessionId, userId);
    }
  } catch {
    // Location background tracking may be restricted by permissions/kill switch; punch still succeeds
  }
}

/**
 * Submits a punch-in or punch-out event to `/api/v1/attendance/punch`.
 * Re-throws server HTTP rejections (4xx/5xx) so the UI surfaces the failure,
 * and queues locally in SQLite only when offline / unreachable (`status === 0`).
 */
export async function submitAttendancePunch(
  input: SubmitAttendancePunchInput,
): Promise<SubmitAttendancePunchResult> {
  const timestampMs = input.timestampMs ?? Date.now();
  const punchType = actionToPunchType(input.action);
  const punchTimeUtc = new Date(timestampMs).toISOString();

  try {
    const response = await attendanceApi.punch({
      employmentId: input.employmentId,
      punchTimeUtc,
      punchType,
    });

    // Best-effort replay of any previously queued offline punches now that network succeeded
    void replayPendingAttendancePunches(input.employmentId).catch(() => {});

    return {
      synced: true,
      queuedOffline: false,
      timestampMs,
      punchType,
      punchTimeUtc,
      response,
    };
  } catch (error) {
    if (isApiError(error) && error.status === 0) {
      const prefix = input.action === 'punch-in' ? 'in' : 'out';
      await enqueueAttendanceEvent({
        clientId: `${prefix}_${timestampMs}_${Math.random().toString(36).substring(2, 7)}`,
        userId: input.userId,
        type: actionToQueueType(input.action),
        latitude: input.locationFix?.latitude ?? 0,
        longitude: input.locationFix?.longitude ?? 0,
        accuracy: input.locationFix?.accuracy ?? 999,
        mocked: input.locationFix?.mocked ?? false,
        provider: input.locationFix?.provider ?? input.provider ?? 'punch_api',
        distanceToSite: 0,
        withinGeofence: true,
        timestamp: timestampMs,
      });

      return {
        synced: false,
        queuedOffline: true,
        timestampMs,
        punchType,
        punchTimeUtc,
        response: null,
        offlineErrorMessage: error.message,
      };
    }

    throw error;
  }
}

export interface RunAttendancePunchFlowOptions {
  action: PunchActionKind;
  employmentId: EntityId | null | undefined;
  userId: string;
  provider?: string;
  captureLocation?: boolean;
  onUpdateShiftState: (timestampMs: number) => void;
  onSuccess: (result: SubmitAttendancePunchResult) => void;
}

export function getPunchErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Unable to record punch right now. Please try again.';
}

/**
 * Shared UI orchestration helper for HomeScreen quick punch and FaceVerifyScreen
 * camera punch: validates employment session, submits punch, updates shift state
 * and location tracking, and surfaces network/server errors uniformly.
 */
export async function runAttendancePunchFlow(
  options: RunAttendancePunchFlowOptions,
): Promise<boolean> {
  const { employmentId } = options;
  if (employmentId === null || employmentId === undefined || employmentId === '') {
    Alert.alert(
      'Employment Session Missing',
      'Unable to find your active employment ID. Please sign out and sign in again.',
    );
    return false;
  }

  try {
    const locationFix = options.captureLocation ? await captureBestEffortLocationFix() : null;
    const result = await submitAttendancePunch({
      action: options.action,
      employmentId,
      userId: options.userId,
      locationFix,
      provider: options.provider,
    });

    options.onUpdateShiftState(result.timestampMs);
    await syncLocationTrackingForPunch(options.action, options.userId);

    if (result.queuedOffline) {
      Alert.alert(
        'Saved Offline',
        'Unable to reach server. Your punch was saved locally and will sync when back online.',
        [{ text: 'OK', onPress: () => options.onSuccess(result) }],
      );
    } else {
      options.onSuccess(result);
    }

    return true;
  } catch (error) {
    Alert.alert(
      options.action === 'punch-in' ? 'Punch In Failed' : 'Punch Out Failed',
      getPunchErrorMessage(error),
    );
    return false;
  }
}
