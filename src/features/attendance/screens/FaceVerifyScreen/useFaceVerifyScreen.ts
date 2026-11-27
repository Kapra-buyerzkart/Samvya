import { useAuthStore } from '@/features/auth';
import { useFeatureFlag } from '@/shared/flags';
import { router, useIsFocused, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePersistentShiftTimer } from '../../hooks/usePersistentShiftTimer';
import {
  runAttendancePunchFlow,
  type PunchActionKind,
} from '../../services/punchService';

export function useFaceVerifyScreen() {
  const { t } = useTranslation();
  const isFaceCheckInEnabled = useFeatureFlag('faceCheckIn');
  const isFocused = useIsFocused();
  const timer = usePersistentShiftTimer();
  const authSession = useAuthStore((s) => s.session);
  const authUser = useAuthStore((s) => s.user);
  const params = useLocalSearchParams<{ action?: string }>();
  const isPunchOut = params.action === 'punch-out';
  const action: PunchActionKind = isPunchOut ? 'punch-out' : 'punch-in';
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

    const employmentId = authSession?.employmentId;
    const userId = String(authSession?.memberId ?? employmentId ?? authUser?.id ?? 'staff');
    setIsPunching(true);
    try {
      await runAttendancePunchFlow({
        action,
        employmentId,
        userId,
        provider: 'camera_punch',
        captureLocation: true,
        onUpdateShiftState: (timestampMs) => {
          if (isPunchOut) {
            timer.punchOut(timestampMs);
          } else {
            timer.punchIn(timer.workLocation, timer.hoursType, timestampMs);
          }
        },
        onSuccess: (result) => {
          setPunchSuccess({ type: action, timestamp: result.timestampMs });
        },
      });
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
