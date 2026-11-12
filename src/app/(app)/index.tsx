import React, { Suspense, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, ThemedText, ThemedView } from '@/shared/components';
import { useFeatureFlag } from '@/shared/flags';
import {
  BackgroundTrackingBanner,
  getActiveTrackingSession,
  startBackgroundTracking,
  startTrackingSession,
  stopBackgroundTracking,
  stopTrackingSession,
  TrackingSessionState,
} from '@/features/location';

const DEFAULT_OFFICE_SITE = {
  id: 'site_hq_main',
  name: 'Headquarters Main Campus',
  latitude: 28.6139,
  longitude: 77.209,
  radiusMeters: 100,
};

const LazyOneShotCheckInLocation = React.lazy(() =>
  import('@/features/location').then((m) => ({ default: m.OneShotCheckInLocation })),
);

export default function DashboardRoute(): React.JSX.Element {
  const { t } = useTranslation();
  const isLiveLocationEnabled = useFeatureFlag('liveLocation');
  const isBackgroundTrackingEnabled = useFeatureFlag('backgroundTracking');
  const isFaceCheckInEnabled = useFeatureFlag('faceCheckIn');
  const isManualGpsEnabled = useFeatureFlag('manualGps');

  const [session, setSession] = useState<TrackingSessionState | null>(() =>
    getActiveTrackingSession(),
  );

  const isTracking = session !== null && session.status === 'tracking';

  const handleStartDuty = async (): Promise<void> => {
    try {
      const newSession = startTrackingSession(
        `sess_${Date.now()}`,
        'usr_default_employee',
      );
      await startBackgroundTracking(newSession.sessionId, 'usr_default_employee');
      setSession(newSession);
    } catch {
      // Fallback if permission/kill-switch error
    }
  };

  const handleClockOut = async (): Promise<void> => {
    stopTrackingSession();
    await stopBackgroundTracking();
    setSession(null);
  };

  const handleStartFaceCheckIn = (): void => {
    router.push('/(app)/attendance/face-verify');
  };

  const handleManualFallback = (): void => {
    router.push('/(app)/attendance/manual-entry');
  };

  const handleViewHistory = (): void => {
    router.push('/(app)/attendance/history');
  };

  const handleOpenSettings = (): void => {
    router.push('/(app)/settings');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header & Status Indicator */}
          <View style={styles.header}>
            <View>
              <ThemedText variant="title">{t('common.appName')}</ThemedText>
              <ThemedText variant="subheading">
                {isTracking ? '🟢 On Duty • Shift Active' : t('attendance.offDuty')}
              </ThemedText>
            </View>
          </View>

          {/* Active Background Tracking Indicator */}
          {isBackgroundTrackingEnabled && isTracking ? (
            <View style={styles.section}>
              <BackgroundTrackingBanner session={session} />
              <Button
                title="Clock Out & Stop Shift Tracking"
                variant="danger"
                onPress={handleClockOut}
                style={styles.clockOutButton}
              />
            </View>
          ) : isBackgroundTrackingEnabled ? (
            <Card style={styles.dutyCard}>
              <ThemedText variant="heading" style={styles.cardTitle}>
                Work Shift & Live Route Tracking
              </ThemedText>
              <ThemedText variant="caption" style={styles.cardSubtext}>
                Tracking operates strictly between clock-in and clock-out with battery-aware adaptive intervals.
              </ThemedText>
              <Button
                title="Start Work Shift (Clock In)"
                variant="primary"
                onPress={handleStartDuty}
                style={styles.dutyButton}
              />
            </Card>
          ) : null}

          {/* Feature 1: One-Shot Location Capture & Geofencing */}
          {isLiveLocationEnabled ? (
            <View style={styles.section}>
              <Suspense fallback={<ActivityIndicator size="small" />}>
                <LazyOneShotCheckInLocation
                  officeSite={DEFAULT_OFFICE_SITE}
                  onSuccess={() => {
                    if (isBackgroundTrackingEnabled && !isTracking) {
                      void handleStartDuty();
                    }
                  }}
                />
              </Suspense>
            </View>
          ) : null}

          {/* Feature 2: Biometric Face Verification with Active Liveness */}
          {isFaceCheckInEnabled ? (
            <Card style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <ThemedText variant="heading">Biometric Verification</ThemedText>
                <ThemedText variant="caption" style={styles.badgeText}>
                  Active Liveness
                </ThemedText>
              </View>
              <ThemedText variant="body" style={styles.featureDescription}>
                Verify attendance using on-device face detection, randomized challenges (blink/head turn), and zero-retention DPDP privacy compliance.
              </ThemedText>
              <Button
                title="Start Biometric Face Check-In"
                variant="primary"
                onPress={handleStartFaceCheckIn}
                style={styles.actionButton}
              />
            </Card>
          ) : null}

          {/* Feature 3: Manual GPS Coordinate Entry & Approval Workflow */}
          {isManualGpsEnabled ? (
            <Card style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <ThemedText variant="heading">{t('manual.title')}</ThemedText>
                <ThemedText variant="caption" style={styles.badgeText}>
                  Audited Fallback
                </ThemedText>
              </View>
              <ThemedText variant="body" style={styles.featureDescription}>
                Submit coordinates with reason and optional site photo when GPS signal is blocked or indoors. Requires supervisor approval.
              </ThemedText>
              <Button
                title="Submit Manual GPS Entry"
                variant="outline"
                onPress={handleManualFallback}
                style={styles.actionButton}
              />
            </Card>
          ) : null}

          {/* Secondary Utilities & Settings */}
          <View style={styles.utilityActions}>
            <Button
              title={t('attendance.history')}
              variant="secondary"
              onPress={handleViewHistory}
              style={styles.utilityButton}
            />
            <Button
              title="Settings & Privacy Diagnostics"
              variant="secondary"
              onPress={handleOpenSettings}
              style={styles.utilityButton}
            />
          </View>
        </ScrollView>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  dutyCard: {
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  cardTitle: {
    marginBottom: 4,
  },
  cardSubtext: {
    marginBottom: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
  dutyButton: {
    width: '100%',
  },
  clockOutButton: {
    marginTop: 8,
    width: '100%',
  },
  featureCard: {
    padding: 16,
    marginBottom: 16,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeText: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    color: '#38BDF8',
    fontWeight: '600',
  },
  featureDescription: {
    marginBottom: 12,
    color: '#94A3B8',
    lineHeight: 20,
  },
  actionButton: {
    width: '100%',
  },
  utilityActions: {
    gap: 10,
    marginTop: 8,
  },
  utilityButton: {
    width: '100%',
  },
});
