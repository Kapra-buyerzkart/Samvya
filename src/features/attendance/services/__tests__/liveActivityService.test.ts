import {
  formatDurationCompact,
  formatDurationWithSeconds,
  formatShiftNotification,
  buildLiveActivityContentState,
  syncShiftForegroundService,
  getActiveNotificationContent,
} from '../liveActivityService';
import type { PersistedShiftState, ShiftMetrics } from '../../domain/shiftTimer';

describe('liveActivityService', () => {
  const mockMetrics: ShiftMetrics = {
    workedSeconds: 7200, // 2h
    totalBreakSeconds: 1200, // 20m
    remainingSeconds: 21600, // 6h
    progressFraction: 0.25,
  };

  const mockShiftState: PersistedShiftState = {
    status: 'punched_in',
    punchedInAt: Date.now() - 7200 * 1000,
    currentBreakStartedAt: null,
    accumulatedBreakSeconds: 1200,
    shiftTargetSeconds: 28800,
    hoursType: 'Regular',
    workLocation: 'Work from home',
    lastActiveTimestamp: Date.now(),
  };

  describe('Duration formatters', () => {
    it('formats compact durations correctly for hours and minutes', () => {
      expect(formatDurationCompact(3665)).toBe('1h 01m');
      expect(formatDurationCompact(7200)).toBe('2h 00m');
      expect(formatDurationCompact(125)).toBe('2m 05s');
      expect(formatDurationCompact(0)).toBe('0m 00s');
    });

    it('formats full durations with seconds', () => {
      expect(formatDurationWithSeconds(3665)).toBe('1h 01m 05s');
      expect(formatDurationWithSeconds(45)).toBe('0h 00m 45s');
    });
  });

  describe('formatShiftNotification', () => {
    it('formats notification for active on-duty shift', () => {
      const result = formatShiftNotification(mockMetrics, mockShiftState);
      expect(result.title).toContain('Working');
      expect(result.title).toContain('2h 00m');
      expect(result.title).toContain('25%');
      expect(result.body).toContain('Work from home');
      expect(result.color).toBe('#10B981');
      expect(result.isOngoing).toBe(true);
    });

    it('formats notification for shift on break', () => {
      const breakState: PersistedShiftState = {
        ...mockShiftState,
        status: 'on_break',
        currentBreakStartedAt: Date.now(),
      };
      const result = formatShiftNotification(mockMetrics, breakState);
      expect(result.title).toContain('On Break');
      expect(result.title).toContain('20m');
      expect(result.body).toContain('Shift paused');
      expect(result.color).toBe('#F59E0B');
      expect(result.isOngoing).toBe(true);
    });

    it('formats notification for completed/punched out shift', () => {
      const punchedOutState: PersistedShiftState = {
        ...mockShiftState,
        status: 'punched_out',
      };
      const result = formatShiftNotification(mockMetrics, punchedOutState);
      expect(result.title).toBe('Shift Completed');
      expect(result.color).toBe('#6B7280');
      expect(result.isOngoing).toBe(false);
    });
  });

  describe('buildLiveActivityContentState', () => {
    it('creates ActivityKit content state object', () => {
      const state = buildLiveActivityContentState(mockMetrics, mockShiftState);
      expect(state.status).toBe('punched_in');
      expect(state.workedSeconds).toBe(7200);
      expect(state.breakSeconds).toBe(1200);
      expect(state.locationName).toBe('Work from home');
      expect(state.progressFraction).toBe(0.25);
      expect(state.updatedAt).toBeGreaterThan(0);
    });
  });

  describe('syncShiftForegroundService', () => {
    it('caches the active notification content', async () => {
      await syncShiftForegroundService(mockMetrics, mockShiftState);
      const active = getActiveNotificationContent();
      expect(active).not.toBeNull();
      expect(active?.title).toContain('Working');
    });
  });
});
