import {
  calculateShiftMetrics,
  loadShiftState,
  punchInShift,
  punchOutShift,
  resetShiftState,
  resumeShiftWork,
  saveShiftState,
  startShiftBreak,
  type PersistedShiftState,
} from '../shiftTimer';
import {
  LEGACY_SHIFT_TIMER_STORAGE_KEY,
  SHIFT_TIMER_STORAGE_KEY,
} from '@/shared/constants';
import { appStorage } from '@/shared/storage';

describe('Persistent Shift Timer Domain', () => {
  beforeEach(() => {
    appStorage.clearAll();
  });

  it('initializes default state as punched_out if storage is empty', () => {
    const state = loadShiftState();
    expect(state.status).toBe('punched_out');
    expect(state.punchedInAt).toBeNull();
    expect(state.accumulatedBreakSeconds).toBe(0);
  });

  it('clears legacy punched_in seed and resets active shift back to punched_out', () => {
    appStorage.set(
      LEGACY_SHIFT_TIMER_STORAGE_KEY,
      JSON.stringify({ status: 'punched_in', punchedInAt: 1731410000000 }),
    );
    const loaded = loadShiftState();
    expect(loaded.status).toBe('punched_out');
    expect(appStorage.contains(LEGACY_SHIFT_TIMER_STORAGE_KEY)).toBe(false);
    expect(appStorage.contains(SHIFT_TIMER_STORAGE_KEY)).toBe(true);

    punchInShift('Headquarters', 'Regular', 1731410000000);
    expect(loadShiftState().status).toBe('punched_in');

    const reset = resetShiftState();
    expect(reset.status).toBe('punched_out');
    expect(reset.punchedInAt).toBeNull();
    expect(loadShiftState().status).toBe('punched_out');
  });

  it('computes accurate elapsed time based on wall clock timestamp after simulated app kill', () => {
    const baseTime = 1731410000000;
    const shift = punchInShift('Work from home', 'Regular', baseTime);

    // Simulate app killed for 2 hours (7200 seconds)
    const twoHoursLater = baseTime + 7200 * 1000;
    const metrics = calculateShiftMetrics(shift, twoHoursLater);

    expect(metrics.workedSeconds).toBe(7200);
    expect(metrics.remainingSeconds).toBe(8 * 3600 - 7200);
    expect(metrics.progressFraction).toBe(7200 / 28800);
  });

  it('correctly handles break deduction after app kill during a break', () => {
    const baseTime = 1731410000000;
    let shift = punchInShift('Work from home', 'Regular', baseTime);

    // Worked 1 hour (3600s), then starts break at baseTime + 3600s
    const breakStartTime = baseTime + 3600 * 1000;
    shift = startShiftBreak(shift, breakStartTime);
    expect(shift.status).toBe('on_break');

    // Simulate app killed for 30 minutes while on break
    const thirtyMinutesLater = breakStartTime + 1800 * 1000;
    const metricsOnBreak = calculateShiftMetrics(shift, thirtyMinutesLater);

    // Worked time should freeze at 1 hour (3600s)
    expect(metricsOnBreak.workedSeconds).toBe(3600);
    expect(metricsOnBreak.totalBreakSeconds).toBe(1800);

    // Resume work after 30 minute break
    shift = resumeShiftWork(shift, thirtyMinutesLater);
    expect(shift.status).toBe('punched_in');
    expect(shift.accumulatedBreakSeconds).toBe(1800);

    // Worked another 1 hour after break
    const anotherHourLater = thirtyMinutesLater + 3600 * 1000;
    const metricsResumed = calculateShiftMetrics(shift, anotherHourLater);

    expect(metricsResumed.workedSeconds).toBe(7200); // 1h + 1h = 2h
    expect(metricsResumed.totalBreakSeconds).toBe(1800);
  });

  it('returns 0 worked seconds when punched out', () => {
    const baseTime = 1731410000000;
    let shift = punchInShift('Work from home', 'Regular', baseTime);
    shift = punchOutShift(shift, baseTime + 3600 * 1000);

    const metrics = calculateShiftMetrics(shift, baseTime + 5000 * 1000);
    expect(metrics.workedSeconds).toBe(0);
    expect(shift.status).toBe('punched_out');
  });

  it('persists and reloads from MMKV storage across app restarts', () => {
    const testState: PersistedShiftState = {
      status: 'punched_in',
      punchedInAt: 1731410000000,
      currentBreakStartedAt: null,
      accumulatedBreakSeconds: 600,
      shiftTargetSeconds: 28800,
      hoursType: 'Overtime',
      workLocation: 'Headquarters',
      lastActiveTimestamp: 1731410000000,
    };

    saveShiftState(testState);

    const reloaded = loadShiftState();
    expect(reloaded.hoursType).toBe('Overtime');
    expect(reloaded.workLocation).toBe('Headquarters');
    expect(reloaded.accumulatedBreakSeconds).toBe(600);
  });
});
