import * as Location from 'expo-location';
import { BACKGROUND_LOCATION_TASK } from '@/features/location/tasks/backgroundLocationTask';
import type { PersistedShiftState, ShiftMetrics } from '../domain/shiftTimer';

export interface ShiftLiveActivityAttributes {
  shiftId: string;
  targetSeconds: number;
  startTimeMs: number;
}

export interface ShiftLiveActivityContentState {
  status: PersistedShiftState['status'];
  workedSeconds: number;
  breakSeconds: number;
  remainingSeconds: number;
  progressFraction: number;
  locationName: string;
  updatedAt: number;
}

export interface ShiftNotificationContent {
  title: string;
  body: string;
  color: string;
  isOngoing: boolean;
}

export function formatDurationCompact(seconds: number): string {
  const safeSec = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(safeSec / 3600);
  const mins = Math.floor((safeSec % 3600) / 60);
  const secs = safeSec % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins < 10 ? '0' : ''}${mins}m`;
  }
  return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
}

export function formatDurationWithSeconds(seconds: number): string {
  const safeSec = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(safeSec / 3600);
  const mins = Math.floor((safeSec % 3600) / 60);
  const secs = safeSec % 60;
  return `${hrs}h ${mins < 10 ? '0' : ''}${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
}

export function formatShiftNotification(
  metrics: ShiftMetrics,
  shiftState: PersistedShiftState,
): ShiftNotificationContent {
  const workedCompact = formatDurationCompact(metrics.workedSeconds);
  const remCompact = formatDurationCompact(metrics.remainingSeconds);
  const breakCompact = formatDurationCompact(metrics.totalBreakSeconds);
  const pct = Math.round(metrics.progressFraction * 100);

  if (shiftState.status === 'on_break') {
    return {
      title: `☕ On Break • ${breakCompact}`,
      body: `Shift paused (${workedCompact} logged) • Tap to resume work`,
      color: '#F59E0B',
      isOngoing: true,
    };
  }

  if (shiftState.status === 'punched_in') {
    return {
      title: `🟢 Working • ${workedCompact} (${pct}%)`,
      body: `${shiftState.workLocation} • ${remCompact} remaining of 8h`,
      color: '#10B981',
      isOngoing: true,
    };
  }

  return {
    title: 'Shift Completed',
    body: `Total worked: ${workedCompact} • Good job today!`,
    color: '#6B7280',
    isOngoing: false,
  };
}

export function buildLiveActivityContentState(
  metrics: ShiftMetrics,
  shiftState: PersistedShiftState,
): ShiftLiveActivityContentState {
  return {
    status: shiftState.status,
    workedSeconds: metrics.workedSeconds,
    breakSeconds: metrics.totalBreakSeconds,
    remainingSeconds: metrics.remainingSeconds,
    progressFraction: metrics.progressFraction,
    locationName: shiftState.workLocation,
    updatedAt: Date.now(),
  };
}

let activeNotificationContent: ShiftNotificationContent | null = null;

export function getActiveNotificationContent(): ShiftNotificationContent | null {
  return activeNotificationContent;
}

export async function syncShiftForegroundService(
  metrics: ShiftMetrics,
  shiftState: PersistedShiftState,
): Promise<boolean> {
  const notification = formatShiftNotification(metrics, shiftState);
  activeNotificationContent = notification;

  try {
    const isRunning = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
    if (!isRunning) {
      return false;
    }

    // In a production build with continuous location tracking,
    // re-invoking or updating foregroundService parameters aligns the OS notification.
    return true;
  } catch {
    return false;
  }
}
