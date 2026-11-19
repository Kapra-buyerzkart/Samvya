import { useCallback, useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import {
  calculateShiftMetrics,
  loadShiftState,
  punchInShift,
  punchOutShift,
  resumeShiftWork,
  saveShiftState,
  startShiftBreak,
  subscribeShiftState,
  type PersistedShiftState,
} from '../domain/shiftTimer';
import { syncShiftForegroundService } from '../services/liveActivityService';

export function usePersistentShiftTimer() {
  const [shiftState, setShiftState] = useState<PersistedShiftState>(() => loadShiftState());
  const [now, setNow] = useState<number>(() => Date.now());

  // Calculate live metrics based on current wall-clock time
  const metrics = calculateShiftMetrics(shiftState, now);

  const refreshMetrics = useCallback(() => {
    const loaded = loadShiftState();
    setShiftState(loaded);
    setNow(Date.now());
  }, []);

  // 1. In-memory listener: sync immediately whenever any component changes shift state
  useEffect(() => {
    const unsubscribe = subscribeShiftState((latestState) => {
      setShiftState(latestState);
      setNow(Date.now());
    });
    return unsubscribe;
  }, []);

  // 2. Sync to Live Activity & Foreground Notification
  useEffect(() => {
    syncShiftForegroundService(metrics, shiftState).catch(() => {});
  }, [metrics, shiftState]);

  // 3. AppState listener: immediately recalculate from wall-clock when app is foregrounded
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        refreshMetrics();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [refreshMetrics]);

  // 2. High-precision 1-second tick when foregrounded and actively punched in or on break
  useEffect(() => {
    if (shiftState.status === 'punched_out') return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [shiftState.status]);

  // Actions
  const handlePunchIn = useCallback(
    (
      loc: 'Work from home' | 'Headquarters' | 'Client site' = shiftState.workLocation,
      hours: 'Regular' | 'Overtime' | 'Flexible' = shiftState.hoursType,
    ) => {
      const updated = punchInShift(loc, hours);
      setShiftState(updated);
      setNow(Date.now());
    },
    [shiftState.workLocation, shiftState.hoursType],
  );

  const handleStartBreak = useCallback(() => {
    const updated = startShiftBreak(shiftState);
    setShiftState(updated);
    setNow(Date.now());
  }, [shiftState]);

  const handleResumeWork = useCallback(() => {
    const updated = resumeShiftWork(shiftState);
    setShiftState(updated);
    setNow(Date.now());
  }, [shiftState]);

  const handlePunchOut = useCallback(() => {
    const updated = punchOutShift(shiftState);
    setShiftState(updated);
    setNow(Date.now());
  }, [shiftState]);

  const setHoursType = useCallback(
    (type: 'Regular' | 'Overtime' | 'Flexible') => {
      const updated: PersistedShiftState = { ...shiftState, hoursType: type };
      saveShiftState(updated);
      setShiftState(updated);
    },
    [shiftState],
  );

  const setWorkLocation = useCallback(
    (loc: 'Work from home' | 'Headquarters' | 'Client site') => {
      const updated: PersistedShiftState = { ...shiftState, workLocation: loc };
      saveShiftState(updated);
      setShiftState(updated);
    },
    [shiftState],
  );

  // Formatting helpers
  const workedHours = Math.floor(metrics.workedSeconds / 3600);
  const workedMins = Math.floor((metrics.workedSeconds % 3600) / 60);
  const workedSecs = metrics.workedSeconds % 60;
  const workedDisplay = `${workedHours}h ${workedMins < 10 ? '0' : ''}${workedMins}m ${workedSecs < 10 ? '0' : ''}${workedSecs}s`;

  const remHours = Math.floor(metrics.remainingSeconds / 3600);
  const remMins = Math.floor((metrics.remainingSeconds % 3600) / 60);
  const remainingDisplay = `${remHours}h ${remMins < 10 ? '0' : ''}${remMins}m`;

  const breakMins = Math.floor(metrics.totalBreakSeconds / 60);
  const breakDisplay = `${breakMins}m`;

  return {
    shiftState,
    status: shiftState.status,
    isWorking: shiftState.status === 'punched_in',
    isOnBreak: shiftState.status === 'on_break',
    isPunchedOut: shiftState.status === 'punched_out',
    workedSeconds: metrics.workedSeconds,
    workedHours,
    workedMinutes: workedMins,
    workedSecondsPart: workedSecs,
    workedDisplay,
    remainingDisplay,
    breakDisplay,
    breakMinutes: breakMins,
    progressFraction: metrics.progressFraction,
    hoursType: shiftState.hoursType,
    workLocation: shiftState.workLocation,
    punchIn: handlePunchIn,
    startBreak: handleStartBreak,
    resumeWork: handleResumeWork,
    punchOut: handlePunchOut,
    setHoursType,
    setWorkLocation,
    refreshMetrics,
  };
}
