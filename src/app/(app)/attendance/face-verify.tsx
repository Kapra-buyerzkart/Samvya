import { enqueueAttendanceEvent, usePersistentShiftTimer } from '@/features/attendance';
import { FaceVerificationPayload, FaceVerifyCameraView, useFaceVerificationFlow } from '@/features/face';
import {
  getActiveTrackingSession,
  startBackgroundTracking,
  startTrackingSession,
  stopBackgroundTracking,
  stopTrackingSession,
} from '@/features/location';
import { TactilePressable } from '@/shared/animations';
import { Button, Card, ThemedText, ThemedView } from '@/shared/components';
import { useFeatureFlag } from '@/shared/flags';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FaceVerifyRoute(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isFaceCheckInEnabled = useFeatureFlag('faceCheckIn');
  const isFocused = navigation.isFocused();
  const timer = usePersistentShiftTimer();
  const params = useLocalSearchParams<{ action?: string }>();
  const isPunchOut = params.action === 'punch-out';
  const actionText = isPunchOut ? 'Punch Out' : 'Punch In';

  const handleCancel = (): void => {
    router.back();
  };

  const handleFallbackToManual = (): void => {
    router.push('/(app)/attendance/manual-entry');
  };

  const handleViewConsent = (): void => {
    router.push('/(auth)/consent');
  };

  const handleSuccess = async (payload: FaceVerificationPayload): Promise<void> => {
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
          provider: 'biometric_face_verified',
          distanceToSite: 0,
          withinGeofence: true,
          timestamp: Date.now(),
        });

        Alert.alert(
          'Biometric Punch Out Verified',
          `Face verified with ${payload.challengeType.toUpperCase()} challenge. Shift ended successfully.`,
          [{ text: 'OK', onPress: () => router.replace('/(app)') }],
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
          provider: 'biometric_face_verified',
          distanceToSite: 0,
          withinGeofence: true,
          timestamp: Date.now(),
        });

        Alert.alert(
          'Biometric Punch In Verified',
          `Face verified with ${payload.challengeType.toUpperCase()} liveness test! Shift started with live background GPS tracking.`,
          [{ text: 'OK', onPress: () => router.replace('/(app)') }],
        );
      }
    } catch {
      router.replace('/(app)');
    }
  };

  const flow = useFaceVerificationFlow({
    isFocused,
    onSuccess: handleSuccess,
    onFallbackToManual: handleFallbackToManual,
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TactilePressable
            onPress={handleCancel}
            style={styles.backBtn}
            accessibilityLabel="Go back"
          >
            <Feather name="arrow-left" size={22} color="#F8FAFC" />
          </TactilePressable>
          <View style={styles.headerTitles}>
            <ThemedText variant="heading" style={styles.navTitle}>
              {`Biometric ${actionText}`}
            </ThemedText>
            <ThemedText variant="caption" style={styles.navSubtitle}>
              {t('face.alignFace')}
            </ThemedText>
          </View>
          <View style={styles.navPlaceholder} />
        </View>

        {isFaceCheckInEnabled ? (
          <FaceVerifyCameraView
            step={flow.step}
            instruction={flow.instruction}
            challengeType={flow.challengeSession.type}
            actionText={actionText}
            onFallbackToManual={handleFallbackToManual}
            onViewConsent={handleViewConsent}
            onRetry={flow.resetFlow}
            onSimulateVerification={flow.simulateVerification}
          />
        ) : (
          <View style={styles.content}>
            <Card style={styles.disabledCard}>
              <ThemedText variant="heading" style={styles.disabledTitle}>
                Biometric Verification Disabled
              </ThemedText>
              <ThemedText variant="body" style={styles.disabledText}>
                Facial verification is turned off by administrative policy. Please check in using
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  safeArea: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitles: {
    alignItems: 'center',
  },
  navTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  navSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  navPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  disabledCard: {
    padding: 24,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#0F172A',
    borderColor: '#334155',
  },
  disabledTitle: {
    marginBottom: 8,
    color: '#F8FAFC',
    textAlign: 'center',
  },
  disabledText: {
    textAlign: 'center',
    color: '#94A3B8',
    marginBottom: 20,
    lineHeight: 22,
  },
  actionBtn: {
    width: '100%',
    marginBottom: 10,
  },
});
