import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, ThemedText, ThemedView } from '@/shared/components';
import { useFeatureFlag } from '@/shared/flags';
import { FaceVerifyCameraView, useFaceVerificationFlow } from '@/features/face';

export default function FaceVerifyRoute(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isFaceCheckInEnabled = useFeatureFlag('faceCheckIn');
  const isFocused = navigation.isFocused();

  const handleCancel = (): void => {
    router.back();
  };

  const handleFallbackToManual = (): void => {
    router.push('/(app)/attendance/manual-entry');
  };

  const handleViewConsent = (): void => {
    router.push('/(auth)/consent');
  };

  const flow = useFaceVerificationFlow({
    isFocused,
    onSuccess: () => {
      router.replace('/(app)');
    },
    onFallbackToManual: handleFallbackToManual,
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText variant="title">{t('face.title')}</ThemedText>
          <ThemedText variant="subheading">{t('face.alignFace')}</ThemedText>
        </View>

        {isFaceCheckInEnabled ? (
          <FaceVerifyCameraView
            step={flow.step}
            instruction={flow.instruction}
            challengeType={flow.challengeSession.type}
            onFallbackToManual={handleFallbackToManual}
            onViewConsent={handleViewConsent}
            onRetry={flow.resetFlow}
          />
        ) : (
          <View style={styles.content}>
            <Card style={styles.disabledCard}>
              <ThemedText variant="heading" style={styles.disabledTitle}>
                Biometric Verification Disabled
              </ThemedText>
              <ThemedText variant="body" style={styles.disabledText}>
                Facial verification is turned off by administrative policy. Please check in using hardware GPS or supervisor-approved manual entry.
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
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
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

