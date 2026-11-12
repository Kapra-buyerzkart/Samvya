import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import {
  canTrack,
  getActiveTrackingSession,
  restoreTrackingSessionOnLaunch,
  startTrackingSession,
  stopTrackingSession,
  updateSessionLastFix,
} from '../domain/trackingSession';
import { evaluateBreadcrumbFilter } from '../domain/filters';
import {
  DEFAULT_TRACKING_CONFIG,
  LocationBreadcrumb,
} from '../domain/types';
import {
  getPendingBreadcrumbs,
  insertBreadcrumb,
  markBreadcrumbFailed,
  markBreadcrumbsSynced,
} from '../db/locationDatabase';

export const BACKGROUND_LOCATION_TASK = 'hrms-background-location-task';

function generateClientId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `loc_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// Module top-level task definition required by expo-task-manager
TaskManager.defineTask(
  BACKGROUND_LOCATION_TASK,
  async ({ data, error }: { data: unknown; error: TaskManager.TaskManagerError | null }) => {
    if (error) {
      return;
    }

    // Invariant: Never track off duty or when kill switch / flag disables tracking
    if (!canTrack()) {
      try {
        const isRegistered = await Location.hasStartedLocationUpdatesAsync(
          BACKGROUND_LOCATION_TASK,
        );
        if (isRegistered) {
          await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
        }
      } catch {
        // Safe swallow if already stopped
      }
      return;
    }

    const session = getActiveTrackingSession();
    if (!session || session.status !== 'tracking') {
      return;
    }

    const taskData = data as { locations?: Location.LocationObject[] } | undefined;
    const locations = taskData?.locations;
    if (!locations || locations.length === 0) {
      return;
    }

    for (const loc of locations) {
      const candidate: Omit<LocationBreadcrumb, 'isStationary'> = {
        clientId: generateClientId(),
        sessionId: session.sessionId,
        userId: session.userId,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracy: loc.coords.accuracy ?? 999,
        speed: loc.coords.speed,
        heading: loc.coords.heading,
        altitude: loc.coords.altitude,
        mocked: Boolean((loc.coords as { mocked?: boolean }).mocked),
        provider: 'balanced',
        timestamp: loc.timestamp,
      };

      const filterResult = evaluateBreadcrumbFilter(
        candidate,
        session.lastFix,
        DEFAULT_TRACKING_CONFIG,
      );

      if (!filterResult.accepted) {
        continue;
      }

      const point: LocationBreadcrumb = {
        ...candidate,
        isStationary: filterResult.isStationary,
      };

      // 1. Write to SQLite first
      await insertBreadcrumb(point);

      // 2. Update in-memory session fix in MMKV
      updateSessionLastFix(point);
    }
  },
);

export async function startBackgroundTracking(
  sessionId: string,
  userId: string,
): Promise<boolean> {
  const session = startTrackingSession(sessionId, userId);

  const hasStarted = await Location.hasStartedLocationUpdatesAsync(
    BACKGROUND_LOCATION_TASK,
  );

  if (hasStarted) {
    return true;
  }

  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: DEFAULT_TRACKING_CONFIG.timeIntervalMs, // 10 seconds
    distanceInterval: DEFAULT_TRACKING_CONFIG.distanceIntervalMeters, // 15 meters
    deferredUpdatesInterval: 30000, // 30 seconds batching during Doze / screen off
    deferredUpdatesDistance: 15,
    showsBackgroundLocationIndicator: true, // Visible indicator on iOS status bar
    pausesUpdatesAutomatically: true, // Pause GPS when stationary on iOS
    activityType: Location.ActivityType.Other,
    foregroundService: {
      notificationTitle: 'HRMS Live Tracking Active',
      notificationBody: 'Recording location for active on-duty work shift.',
      notificationColor: '#0066cc',
      killServiceOnDestroy: false,
    },
  });

  return session.status === 'tracking';
}

export async function stopBackgroundTracking(): Promise<void> {
  stopTrackingSession();

  const isRunning = await Location.hasStartedLocationUpdatesAsync(
    BACKGROUND_LOCATION_TASK,
  );

  if (isRunning) {
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  }
}

export async function isBackgroundTrackingActive(): Promise<boolean> {
  const nativeStarted = await Location.hasStartedLocationUpdatesAsync(
    BACKGROUND_LOCATION_TASK,
  );
  return nativeStarted && canTrack();
}

export async function initializeTrackingOnStartup(): Promise<void> {
  const { activeSession, shouldStopNativeTask } = restoreTrackingSessionOnLaunch();

  const nativeStarted = await Location.hasStartedLocationUpdatesAsync(
    BACKGROUND_LOCATION_TASK,
  );

  if (shouldStopNativeTask && nativeStarted) {
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  } else if (activeSession && !nativeStarted) {
    // Re-register if process was killed while in an active shift
    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: DEFAULT_TRACKING_CONFIG.timeIntervalMs,
      distanceInterval: DEFAULT_TRACKING_CONFIG.distanceIntervalMeters,
      deferredUpdatesInterval: 30000,
      deferredUpdatesDistance: 15,
      showsBackgroundLocationIndicator: true,
      pausesUpdatesAutomatically: true,
      activityType: Location.ActivityType.Other,
      foregroundService: {
        notificationTitle: 'HRMS Live Tracking Active',
        notificationBody: 'Recording location for active on-duty work shift.',
        notificationColor: '#0066cc',
        killServiceOnDestroy: false,
      },
    });
  }
}

export interface BatchSyncReport {
  processed: number;
  succeeded: number;
  failed: number;
}

export async function syncPendingBreadcrumbsBatch(
  apiSender?: (points: LocationBreadcrumb[]) => Promise<boolean>,
  batchSize = 25,
): Promise<BatchSyncReport> {
  const pending = await getPendingBreadcrumbs(batchSize);
  if (pending.length === 0) {
    return { processed: 0, succeeded: 0, failed: 0 };
  }

  if (!apiSender) {
    // If no custom sender provided, skip network sync until API layer is configured
    return { processed: pending.length, succeeded: 0, failed: 0 };
  }

  try {
    const success = await apiSender(pending);
    if (success) {
      const clientIds = pending.map((p) => p.clientId);
      await markBreadcrumbsSynced(clientIds);
      return { processed: pending.length, succeeded: pending.length, failed: 0 };
    } else {
      for (const item of pending) {
        await markBreadcrumbFailed(item.clientId, 'Server rejected breadcrumbs batch');
      }
      return { processed: pending.length, succeeded: 0, failed: pending.length };
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Network failure syncing breadcrumbs';
    for (const item of pending) {
      await markBreadcrumbFailed(item.clientId, errorMsg);
    }
    return { processed: pending.length, succeeded: 0, failed: pending.length };
  }
}
