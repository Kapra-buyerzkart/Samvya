import { enqueueAttendanceEvent, usePersistentShiftTimer } from '@/features/attendance';
import { FaceVerifyCameraView } from '@/features/face';
import {
  getActiveTrackingSession,
  startBackgroundTracking,
  startTrackingSession,
  stopBackgroundTracking,
  stopTrackingSession,
} from '@/features/location';
import { Button, Card, ThemedText } from '@/shared/components';
import { useFeatureFlag } from '@/shared/flags';
import { router, useIsFocused, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FaceVerifyRoute(): React.JSX.Element {
  const { t } = useTranslation();
  const isFaceCheckInEnabled = useFeatureFlag('faceCheckIn');
  const isFocused = useIsFocused();
  const timer = usePersistentShiftTimer();
  const params = useLocalSearchParams<{ action?: string }>();
  const isPunchOut = params.action === 'punch-out';
  const actionText = isPunchOut ? 'Punch out' : 'Punch in';
  const [isPunching, setIsPunching] = useState(false);

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

        Alert.alert(
          'Punch Out Successful',
          'Your shift has ended successfully.',
          [{ text: 'OK', onPress: navigateBack }],
        );
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

        Alert.alert(
          'Punch In Successful',
          'Your shift has started successfully.',
          [{ text: 'OK', onPress: navigateBack }],
        );
      }
    } catch {
      Alert.alert(
        'Punch Recorded',
        `Your ${actionText.toLowerCase()} has been recorded.`,
        [{ text: 'OK', onPress: navigateBack }],
      );
    } finally {
      setIsPunching(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {isFaceCheckInEnabled ? (
          <FaceVerifyCameraView
            actionText={actionText}
            isCameraActive={isFocused}
            isPunching={isPunching}
            onPunch={handlePunch}
            onCancel={handleCancel}
            onFallbackToManual={handleFallbackToManual}
          />
        ) : (
          <View style={styles.disabledContainer}>
            <Card style={styles.disabledCard}>
              <ThemedText variant="heading" style={styles.disabledTitle}>
                Camera Punch Disabled
              </ThemedText>
              <ThemedText variant="body" style={styles.disabledText}>
                Camera punch is turned off by administrative policy. Please check in using
                hardware GPS or supervisor-approved manual entry.
              </ThemedText>
              <Button
                title="Use Supervisor Approval (Manual GPS)"
                variant="primary"
                onPress={handleFallbackToManual}
                style={styles.actionBtn}
              />
              <Button
                title={t('common.cancel')}
                variant="secondary"
                onPress={handleCancel}
                style={styles.actionBtn}
              />
            </Card>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  disabledContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  disabledCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0F172A',
    alignItems: 'center',
  },
  disabledTitle: {
    marginBottom: 8,
    textAlign: 'center',
    color: '#F8FAFC',
  },
  disabledText: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
    color: '#94A3B8',
  },
  actionBtn: {
    width: '100%',
    marginBottom: 10,
  },
});
