import { appStorage } from '@/shared/storage';

export type ShiftStatus = 'punched_out' | 'punched_in' | 'on_break';

export interface PersistedShiftState {
  status: ShiftStatus;
  punchedInAt: number | null; // Unix timestamp in ms
  currentBreakStartedAt: number | null; // Unix timestamp in ms
  accumulatedBreakSeconds: number; // Completed break seconds
  shiftTargetSeconds: number; // Default 8h = 28800s
  hoursType: 'Regular' | 'Overtime' | 'Flexible';
  workLocation: 'Work from home' | 'Headquarters' | 'Client site';
  lastActiveTimestamp: number;
}

export interface ShiftMetrics {
  workedSeconds: number;
  totalBreakSeconds: number;
  remainingSeconds: number;
  progressFraction: number;
}

export const SHIFT_TIMER_STORAGE_KEY = 'samavya-persisted-shift-timer';

export const DEFAULT_SHIFT_TARGET_SECONDS = 8 * 3600; // 8 hours

export function getDefaultShiftState(): PersistedShiftState {
  const defaultStartTime = Date.now() - 5400 * 1000; // Default 1h 30m worked
  return {
    status: 'punched_in',
    punchedInAt: defaultStartTime,
    currentBreakStartedAt: null,
    accumulatedBreakSeconds: 20 * 60, // 20m break
    shiftTargetSeconds: DEFAULT_SHIFT_TARGET_SECONDS,
    hoursType: 'Regular',
    workLocation: 'Work from home',
    lastActiveTimestamp: Date.now(),
  };
}

export function loadShiftState(): PersistedShiftState {
  const raw = appStorage.getString(SHIFT_TIMER_STORAGE_KEY);
  if (!raw) {
    const initialState = getDefaultShiftState();
    saveShiftState(initialState);
    return initialState;
  }
  try {
    const parsed = JSON.parse(raw) as PersistedShiftState;
    return parsed;
  } catch {
    const fallback = getDefaultShiftState();
    saveShiftState(fallback);
    return fallback;
  }
}

type ShiftStateListener = (state: PersistedShiftState) => void;
const shiftListeners = new Set<ShiftStateListener>();

export function subscribeShiftState(listener: ShiftStateListener): () => void {
  shiftListeners.add(listener);
  return () => {
    shiftListeners.delete(listener);
  };
}

export function saveShiftState(state: PersistedShiftState): void {
  appStorage.set(SHIFT_TIMER_STORAGE_KEY, JSON.stringify(state));
  shiftListeners.forEach((listener) => {
    try {
      listener(state);
    } catch {
      // safe swallow
    }
  });
}

export function calculateShiftMetrics(
  state: PersistedShiftState,
  nowMs: number = Date.now(),
): {
  workedSeconds: number;
  totalBreakSeconds: number;
  remainingSeconds: number;
  progressFraction: number;
} {
  if (state.status === 'punched_out' || !state.punchedInAt) {
    return {
      workedSeconds: 0,
      totalBreakSeconds: state.accumulatedBreakSeconds,
      remainingSeconds: state.shiftTargetSeconds,
      progressFraction: 0,
    };
  }

  // Calculate ongoing break if on break
  let ongoingBreakSeconds = 0;
  if (state.status === 'on_break' && state.currentBreakStartedAt) {
    ongoingBreakSeconds = Math.max(
      0,
      Math.floor((nowMs - state.currentBreakStartedAt) / 1000),
    );
  }

  const totalBreakSeconds = state.accumulatedBreakSeconds + ongoingBreakSeconds;

  // Total gross time elapsed since punch in
  const grossElapsedSeconds = Math.max(
    0,
    Math.floor((nowMs - state.punchedInAt) / 1000),
  );

  // Net worked seconds = gross time - total break
  const workedSeconds = Math.max(0, grossElapsedSeconds - totalBreakSeconds);

  // Remaining seconds
  const remainingSeconds = Math.max(0, state.shiftTargetSeconds - workedSeconds);

  // Progress fraction (0 to 1)
  const progressFraction = Math.min(
    1,
    workedSeconds / (state.shiftTargetSeconds || 1),
  );

  return {
    workedSeconds,
    totalBreakSeconds,
    remainingSeconds,
    progressFraction,
  };
}

export function punchInShift(
  location: 'Work from home' | 'Headquarters' | 'Client site' = 'Work from home',
  hoursType: 'Regular' | 'Overtime' | 'Flexible' = 'Regular',
  nowMs: number = Date.now(),
): PersistedShiftState {
  const newState: PersistedShiftState = {
    status: 'punched_in',
    punchedInAt: nowMs,
    currentBreakStartedAt: null,
    accumulatedBreakSeconds: 0,
    shiftTargetSeconds: DEFAULT_SHIFT_TARGET_SECONDS,
    hoursType,
    workLocation: location,
    lastActiveTimestamp: nowMs,
  };
  saveShiftState(newState);
  return newState;
}

export function startShiftBreak(
  currentState: PersistedShiftState,
  nowMs: number = Date.now(),
): PersistedShiftState {
  if (currentState.status !== 'punched_in') {
    return currentState;
  }
  const updated: PersistedShiftState = {
    ...currentState,
    status: 'on_break',
    currentBreakStartedAt: nowMs,
    lastActiveTimestamp: nowMs,
  };
  saveShiftState(updated);
  return updated;
}

export function resumeShiftWork(
  currentState: PersistedShiftState,
  nowMs: number = Date.now(),
): PersistedShiftState {
  if (currentState.status !== 'on_break') {
    return currentState;
  }

  const addedBreakSec = currentState.currentBreakStartedAt
    ? Math.max(0, Math.floor((nowMs - currentState.currentBreakStartedAt) / 1000))
    : 0;

  const updated: PersistedShiftState = {
    ...currentState,
    status: 'punched_in',
    currentBreakStartedAt: null,
    accumulatedBreakSeconds: currentState.accumulatedBreakSeconds + addedBreakSec,
    lastActiveTimestamp: nowMs,
  };
  saveShiftState(updated);
  return updated;
}

export function punchOutShift(
  currentState: PersistedShiftState,
  nowMs: number = Date.now(),
): PersistedShiftState {
  // Finalize any ongoing break
  let finalBreakSec = currentState.accumulatedBreakSeconds;
  if (currentState.status === 'on_break' && currentState.currentBreakStartedAt) {
    finalBreakSec += Math.max(
      0,
      Math.floor((nowMs - currentState.currentBreakStartedAt) / 1000),
    );
  }

  const updated: PersistedShiftState = {
    ...currentState,
    status: 'punched_out',
    currentBreakStartedAt: null,
    accumulatedBreakSeconds: finalBreakSec,
    lastActiveTimestamp: nowMs,
  };
  saveShiftState(updated);
  return updated;
}

