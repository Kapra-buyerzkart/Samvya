import { appStorage } from '@/shared/storage';
import { getFeatureFlag } from '@/shared/flags';
import { LocationBreadcrumb, TrackingSessionState } from './types';

const SESSION_STORAGE_KEY = 'hrms-active-tracking-session';
const KILL_SWITCH_STORAGE_KEY = 'hrms-remote-kill-switch';

export function isRemoteKillSwitchActive(): boolean {
  return appStorage.getBoolean(KILL_SWITCH_STORAGE_KEY) ?? false;
}

export function setRemoteKillSwitch(active: boolean): void {
  appStorage.set(KILL_SWITCH_STORAGE_KEY, active);
  if (active) {
    const current = getActiveTrackingSession();
    if (current && current.status === 'tracking') {
      const stopped: TrackingSessionState = {
        ...current,
        status: 'stopped',
        killSwitchActive: true,
      };
      appStorage.set(SESSION_STORAGE_KEY, JSON.stringify(stopped));
    }
  }
}

export function getActiveTrackingSession(): TrackingSessionState | null {
  const raw = appStorage.getString(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TrackingSessionState;
  } catch {
    return null;
  }
}

export function canTrack(): boolean {
  // Guardrail 1: Local feature flag must be enabled
  if (!getFeatureFlag('backgroundTracking')) {
    return false;
  }

  // Guardrail 2: Remote kill switch must NOT be active
  if (isRemoteKillSwitchActive()) {
    return false;
  }

  // Guardrail 3: Tracking ONLY permitted between check-in and check-out (active session)
  const session = getActiveTrackingSession();
  return session !== null && session.status === 'tracking';
}

export function startTrackingSession(
  sessionId: string,
  userId: string,
): TrackingSessionState {
  if (!getFeatureFlag('backgroundTracking')) {
    throw new Error('Background tracking is disabled by feature flag.');
  }

  if (isRemoteKillSwitchActive()) {
    throw new Error('Background tracking is disabled by server kill switch.');
  }

  const session: TrackingSessionState = {
    sessionId,
    userId,
    status: 'tracking',
    startTime: Date.now(),
    lastFix: null,
    killSwitchActive: false,
    pointsRecorded: 0,
  };

  appStorage.set(SESSION_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function stopTrackingSession(): TrackingSessionState | null {
  const current = getActiveTrackingSession();
  if (!current) return null;

  const stopped: TrackingSessionState = {
    ...current,
    status: 'stopped',
  };

  appStorage.set(SESSION_STORAGE_KEY, JSON.stringify(stopped));
  return stopped;
}

export function updateSessionLastFix(
  breadcrumb: LocationBreadcrumb,
): TrackingSessionState | null {
  const current = getActiveTrackingSession();
  if (!current || current.status !== 'tracking') return null;

  const updated: TrackingSessionState = {
    ...current,
    lastFix: breadcrumb,
    pointsRecorded: current.pointsRecorded + 1,
  };

  appStorage.set(SESSION_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function restoreTrackingSessionOnLaunch(): {
  activeSession: TrackingSessionState | null;
  shouldStopNativeTask: boolean;
} {
  const session = getActiveTrackingSession();

  if (!session || session.status !== 'tracking') {
    return { activeSession: null, shouldStopNativeTask: true };
  }

  // Check if kill switch or feature flag revoked tracking while app was dead
  if (!getFeatureFlag('backgroundTracking') || isRemoteKillSwitchActive()) {
    const stopped: TrackingSessionState = {
      ...session,
      status: 'stopped',
      killSwitchActive: isRemoteKillSwitchActive(),
    };
    appStorage.set(SESSION_STORAGE_KEY, JSON.stringify(stopped));
    return { activeSession: null, shouldStopNativeTask: true };
  }

  return { activeSession: session, shouldStopNativeTask: false };
}
