import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, ThemedText, ThemedView } from '@/shared/components';
import { useFeatureFlag } from '@/shared/flags';
import { ManualGpsForm } from '@/features/manual-entry';

export default function ManualEntryRoute(): React.JSX.Element {
  const { t } = useTranslation();
  const isManualGpsEnabled = useFeatureFlag('manualGps');

  const handleCancel = (): void => {
    router.back();
  };

  const handleSuccess = (): void => {
    router.replace('/(app)');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText variant="title">{t('manual.title')}</ThemedText>
          <ThemedText variant="subheading">{t('manual.subtitle')}</ThemedText>
        </View>

        {isManualGpsEnabled ? (
          <ManualGpsForm
            userId="usr_current_employee"
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : (
          <View style={styles.content}>
            <Card style={styles.disabledCard}>
              <ThemedText variant="heading" style={styles.disabledTitle}>
                Feature Disabled
              </ThemedText>
              <ThemedText variant="body" style={styles.disabledText}>
                Manual GPS coordinate entry is currently turned off by company policy. Please use hardware GPS for attendance check-in.
              </ThemedText>
              <Button
                title={t('common.cancel')}
                variant="secondary"
                onPress={handleCancel}
                style={styles.cancelBtn}
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  disabledCard: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  disabledTitle: {
    marginBottom: 8,
    color: '#F8FAFC',
  },
  disabledText: {
    textAlign: 'center',
    color: '#94A3B8',
    marginBottom: 20,
  },
  cancelBtn: {
    width: '100%',
  },
});

