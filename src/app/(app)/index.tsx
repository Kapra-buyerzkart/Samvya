import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, ThemedText, ThemedView } from '@/shared/components';

export default function DashboardRoute(): React.JSX.Element {
  const { t } = useTranslation();

  const handleStartFaceCheckIn = (): void => {
    router.push('/(app)/attendance/face-verify');
  };

  const handleManualFallback = (): void => {
    router.push('/(app)/attendance/manual-entry');
  };

  const handleViewHistory = (): void => {
    router.push('/(app)/attendance/history');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText variant="title">{t('common.appName')}</ThemedText>
          <ThemedText variant="subheading">{t('attendance.offDuty')}</ThemedText>
        </View>

        <Card style={styles.statusCard}>
          <ThemedText variant="heading" style={styles.cardTitle}>
            Shift Status
          </ThemedText>
          <ThemedText variant="body" style={styles.statusDescription}>
            {t('location.offDuty')}
          </ThemedText>
          <View style={styles.actionRow}>
            <Button
              title={t('attendance.checkIn')}
              onPress={handleStartFaceCheckIn}
              style={styles.primaryAction}
            />
          </View>
        </Card>

        <View style={styles.secondaryActions}>
          <Button
            title={t('manual.title')}
            variant="outline"
            onPress={handleManualFallback}
            style={styles.secondaryButton}
          />
          <Button
            title={t('attendance.history')}
            variant="secondary"
            onPress={handleViewHistory}
            style={styles.secondaryButton}
          />
        </View>
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
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  statusCard: {
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    marginBottom: 8,
  },
  statusDescription: {
    marginBottom: 20,
  },
  actionRow: {
    width: '100%',
  },
  primaryAction: {
    width: '100%',
  },
  secondaryActions: {
    gap: 12,
  },
  secondaryButton: {
    width: '100%',
  },
});

