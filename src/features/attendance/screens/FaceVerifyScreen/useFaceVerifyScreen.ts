import {
  enqueueAttendanceEvent,
  usePersistentShiftTimer,
} from '@/features/attendance';
import {
  getActiveTrackingSession,
  startBackgroundTracking,
  startTrackingSession,
  stopBackgroundTracking,
  stopTrackingSession,
} from '@/features/location';
import { useFeatureFlag } from '@/shared/flags';
import { router, useIsFocused, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useFaceVerifyScreen() {
  const { t } = useTranslation();
  const isFaceCheckInEnabled = useFeatureFlag('faceCheckIn');
  const isFocused = useIsFocused();
  const timer = usePersistentShiftTimer();
  const params = useLocalSearchParams<{ action?: string }>();
  const isPunchOut = params.action === 'punch-out';
  const actionText = isPunchOut ? 'Punch out' : 'Punch in';
  const [isPunching, setIsPunching] = useState(false);
  const [punchSuccess, setPunchSuccess] = useState<{
    type: 'punch-in' | 'punch-out';
    timestamp: number;
  } | null>(null);

  const navigateBack = (): void => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)');
    }
  };

  const handleCancel = (): void => {
    navigateBack();
  };

  const handleFallbackToManual = (): void => {
    router.push('/(app)/attendance/manual-entry');
  };

  const handlePunch = async (): Promise<void> => {
    if (isPunching) return;
    setIsPunching(true);
    try {
      if (isPunchOut) {
        timer.punchOut();
        stopTrackingSession();
        await stopBackgroundTracking();

        await enqueueAttendanceEvent({
          clientId: `out_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          userId: 'usr_default_employee',
          type: 'check_out',
          latitude: 12.9716,
          longitude: 77.5946,
          accuracy: 5.0,
          mocked: false,
          provider: 'camera_punch',
          distanceToSite: 0,
          withinGeofence: true,
          timestamp: Date.now(),
        });

        setPunchSuccess({ type: 'punch-out', timestamp: Date.now() });
      } else {
        timer.punchIn();
        const current = getActiveTrackingSession();
        if (!current || current.status !== 'tracking') {
          const newSession = startTrackingSession(`sess_${Date.now()}`, 'usr_default_employee');
          await startBackgroundTracking(newSession.sessionId, 'usr_default_employee');
        }

        await enqueueAttendanceEvent({
          clientId: `in_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          userId: 'usr_default_employee',
          type: 'check_in',
          latitude: 12.9716,
          longitude: 77.5946,
          accuracy: 5.0,
          mocked: false,
          provider: 'camera_punch',
          distanceToSite: 0,
          withinGeofence: true,
          timestamp: Date.now(),
        });

        setPunchSuccess({ type: 'punch-in', timestamp: Date.now() });
      }
    } catch {
      setPunchSuccess({ type: isPunchOut ? 'punch-out' : 'punch-in', timestamp: Date.now() });
    } finally {
      setIsPunching(false);
    }
  };

  return {
    t,
    isFaceCheckInEnabled,
    isFocused,
    actionText,
    isPunching,
    punchSuccess,
    navigateBack,
    handleCancel,
    handleFallbackToManual,
    handlePunch,
  };
}
