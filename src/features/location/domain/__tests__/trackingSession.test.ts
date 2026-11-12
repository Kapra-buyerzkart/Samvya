import { useFeatureFlagStore } from '@/shared/flags';
import {
  canTrack,
  getActiveTrackingSession,
  isRemoteKillSwitchActive,
  restoreTrackingSessionOnLaunch,
  setRemoteKillSwitch,
  startTrackingSession,
  stopTrackingSession,
  updateSessionLastFix,
} from '../trackingSession';
import { LocationBreadcrumb } from '../types';

describe('TrackingSession State & Invariants', () => {
  beforeEach(() => {
    useFeatureFlagStore.getState().resetFlags();
    setRemoteKillSwitch(false);
    stopTrackingSession();
  });

  it('prohibits tracking when backgroundTracking feature flag is off', () => {
    useFeatureFlagStore.getState().setFlag('backgroundTracking', false);
    expect(canTrack()).toBe(false);
    expect(() => startTrackingSession('sess-1', 'user-1')).toThrow(
      'Background tracking is disabled by feature flag.',
    );
  });

  it('prohibits tracking when remote kill switch is active', () => {
    useFeatureFlagStore.getState().setFlag('backgroundTracking', true);
    setRemoteKillSwitch(true);

    expect(isRemoteKillSwitchActive()).toBe(true);
    expect(canTrack()).toBe(false);
    expect(() => startTrackingSession('sess-1', 'user-1')).toThrow(
      'Background tracking is disabled by server kill switch.',
    );
  });

  it('starts and stops tracking session strictly between check-in and check-out', () => {
    useFeatureFlagStore.getState().setFlag('backgroundTracking', true);

    // Off-duty: cannot track
    expect(canTrack()).toBe(false);

    // Clock in: starts tracking
    const session = startTrackingSession('sess-1', 'user-1');
    expect(session.status).toBe('tracking');
    expect(session.sessionId).toBe('sess-1');
    expect(canTrack()).toBe(true);

    // Clock out: stops tracking immediately
    const stopped = stopTrackingSession();
    expect(stopped?.status).toBe('stopped');
    expect(canTrack()).toBe(false);
  });

  it('terminates active session immediately when kill switch is tripped', () => {
    useFeatureFlagStore.getState().setFlag('backgroundTracking', true);
    startTrackingSession('sess-1', 'user-1');
    expect(canTrack()).toBe(true);

    // Server trips remote kill switch
    setRemoteKillSwitch(true);

    expect(canTrack()).toBe(false);
    const active = getActiveTrackingSession();
    expect(active?.status).toBe('stopped');
    expect(active?.killSwitchActive).toBe(true);
  });

  it('updates session last fix and breadcrumb count', () => {
    useFeatureFlagStore.getState().setFlag('backgroundTracking', true);
    startTrackingSession('sess-1', 'user-1');

    const fix: LocationBreadcrumb = {
      clientId: 'c-1',
      sessionId: 'sess-1',
      userId: 'user-1',
      latitude: 28.6139,
      longitude: 77.209,
      accuracy: 10,
      speed: 1.0,
      heading: 90,
      altitude: 200,
      mocked: false,
      provider: 'balanced',
      isStationary: false,
      timestamp: Date.now(),
    };

    const updated = updateSessionLastFix(fix);
    expect(updated?.pointsRecorded).toBe(1);
    expect(updated?.lastFix?.latitude).toBe(28.6139);
  });

  it('restores active session on relaunch or signals teardown if off-duty', () => {
    useFeatureFlagStore.getState().setFlag('backgroundTracking', true);

    // If stopped, should signal to stop native task
    const offDutyResult = restoreTrackingSessionOnLaunch();
    expect(offDutyResult.activeSession).toBeNull();
    expect(offDutyResult.shouldStopNativeTask).toBe(true);

    // If active during launch
    startTrackingSession('sess-restore', 'user-1');
    const onDutyResult = restoreTrackingSessionOnLaunch();
    expect(onDutyResult.activeSession?.sessionId).toBe('sess-restore');
    expect(onDutyResult.shouldStopNativeTask).toBe(false);
  });
});
