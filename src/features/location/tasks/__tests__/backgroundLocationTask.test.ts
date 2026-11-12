import * as Location from 'expo-location';
import { useFeatureFlagStore } from '@/shared/flags';
import {
  BACKGROUND_LOCATION_TASK,
  isBackgroundTrackingActive,
  startBackgroundTracking,
  stopBackgroundTracking,
  syncPendingBreadcrumbsBatch,
} from '../backgroundLocationTask';
import { setRemoteKillSwitch } from '../../domain/trackingSession';

jest.mock('expo-location', () => {
  let isRunning = false;
  return {
    Accuracy: {
      Balanced: 3,
    },
    ActivityType: {
      Other: 1,
    },
    hasStartedLocationUpdatesAsync: jest.fn(async () => isRunning),
    startLocationUpdatesAsync: jest.fn(async () => {
      isRunning = true;
    }),
    stopLocationUpdatesAsync: jest.fn(async () => {
      isRunning = false;
    }),
    getCurrentPositionAsync: jest.fn(),
    getForegroundPermissionsAsync: jest.fn(),
    requestForegroundPermissionsAsync: jest.fn(),
    getBackgroundPermissionsAsync: jest.fn(),
    requestBackgroundPermissionsAsync: jest.fn(),
  };
});

jest.mock('expo-task-manager', () => ({
  defineTask: jest.fn(),
}));

jest.mock('../../db/locationDatabase', () => ({
  getPendingBreadcrumbs: jest.fn(async () => []),
  insertBreadcrumb: jest.fn(async () => 1),
  markBreadcrumbsSynced: jest.fn(async () => {}),
  markBreadcrumbFailed: jest.fn(async () => {}),
}));

describe('Background Location Task Lifecycle', () => {
  beforeEach(async () => {
    useFeatureFlagStore.getState().resetFlags();
    setRemoteKillSwitch(false);
    await stopBackgroundTracking();
    jest.clearAllMocks();
  });

  it('exports valid task identifier', () => {
    expect(BACKGROUND_LOCATION_TASK).toBe('hrms-background-location-task');
  });

  it('registers and starts native location updates when on-duty and flag is enabled', async () => {
    useFeatureFlagStore.getState().setFlag('backgroundTracking', true);

    const started = await startBackgroundTracking('sess-active-1', 'user-1');
    expect(started).toBe(true);
    expect(Location.startLocationUpdatesAsync).toHaveBeenCalledWith(
      BACKGROUND_LOCATION_TASK,
      expect.objectContaining({
        accuracy: Location.Accuracy.Balanced,
        showsBackgroundLocationIndicator: true,
        timeInterval: 10000,
        distanceInterval: 15,
      }),
    );
  });

  it('stops native location updates cleanly on clock-out', async () => {
    useFeatureFlagStore.getState().setFlag('backgroundTracking', true);
    await startBackgroundTracking('sess-active-1', 'user-1');

    await stopBackgroundTracking();
    expect(Location.stopLocationUpdatesAsync).toHaveBeenCalledWith(
      BACKGROUND_LOCATION_TASK,
    );

    const active = await isBackgroundTrackingActive();
    expect(active).toBe(false);
  });

  it('handles batch sync with zero pending items gracefully', async () => {
    const report = await syncPendingBreadcrumbsBatch();
    expect(report.processed).toBe(0);
    expect(report.succeeded).toBe(0);
    expect(report.failed).toBe(0);
  });
});
