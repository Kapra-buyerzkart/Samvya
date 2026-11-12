import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Card, ThemedText } from '@/shared/components';
import { useAppTheme } from '@/shared/theme';
import {
  useCheckInLocation,
} from '../hooks/useCheckInLocation';
import type { GeofenceSite } from '../domain/checkInFix';

export interface OneShotCheckInLocationProps {
  officeSite: GeofenceSite;
  userId?: string;
  onSuccess?: () => void;
}

export function OneShotCheckInLocation({
  officeSite,
  userId = 'usr_default_employee',
  onSuccess,
}: OneShotCheckInLocationProps): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const {
    step,
    permissionState,
    currentFix,
    geofenceResult,
    errorMessage,
    attemptCount,
    startCheckInLocationCapture,
    requestPermission,
    openSettings,
    confirmAndEnqueueCheckIn,
    reset,
  } = useCheckInLocation();

  const handleCapture = async (): Promise<void> => {
    await startCheckInLocationCapture(officeSite);
  };

  const handleConfirm = async (): Promise<void> => {
    await confirmAndEnqueueCheckIn(userId);
    onSuccess?.();
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <ThemedText variant="heading">Location Check-In</ThemedText>
        <ThemedText variant="caption">Site: {officeSite.name}</ThemedText>
      </View>

      {step === 'idle' && (
        <View style={styles.content}>
          <ThemedText variant="body" style={styles.textSpaced}>
            Capture your GPS location to verify attendance at the office site.
          </ThemedText>
          <Button title="Acquire GPS Location" onPress={handleCapture} />
        </View>
      )}

      {step === 'permission_rationale' && (
        <View style={styles.content}>
          <ThemedText variant="body" style={styles.warningText}>
            {permissionState.status === 'blocked'
              ? 'Location permission is permanently blocked in device settings. Please open settings to grant permission.'
              : permissionState.status === 'approximate_only'
                ? 'Approximate location detected. Precise location is required to verify the site geofence.'
                : 'HRMS requires location access to verify attendance check-in.'}
          </ThemedText>
          <View style={styles.buttonRow}>
            {permissionState.status === 'blocked' ? (
              <Button title={t('location.openSettings')} onPress={openSettings} />
            ) : (
              <Button
                title={t('common.retry')}
                onPress={() => requestPermission(officeSite)}
              />
            )}
            <Button title={t('common.cancel')} variant="secondary" onPress={reset} />
          </View>
        </View>
      )}

      {step === 'acquiring' && (
        <View style={styles.content}>
          <ThemedText variant="body">
            Acquiring balanced GPS fix... (Attempt {attemptCount || 1} of 3)
          </ThemedText>
        </View>
      )}

      {step === 'ready' && currentFix && geofenceResult && (
        <View style={styles.content}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: geofenceResult.withinGeofence
                  ? theme.colors.successSurface
                  : theme.colors.warningSurface,
              },
            ]}
          >
            <ThemedText
              variant="body"
              weight="600"
              color={
                geofenceResult.withinGeofence
                  ? theme.colors.success
                  : theme.colors.warning
              }
            >
              {geofenceResult.withinGeofence
                ? `${t('attendance.geofenceValid')} (${geofenceResult.distanceMeters}m)`
                : `${t('attendance.geofenceInvalid')} (${geofenceResult.distanceMeters}m from site)`}
            </ThemedText>
          </View>

          <ThemedText variant="caption" style={styles.fixDetails}>
            Accuracy: ±{Math.round(currentFix.accuracy)}m • Provider: {currentFix.provider}
          </ThemedText>

          {currentFix.mocked && (
            <View
              style={[
                styles.mockWarning,
                { backgroundColor: theme.colors.errorSurface },
              ]}
            >
              <ThemedText variant="caption" color={theme.colors.error}>
                ⚠️ {t('location.mockDetected')} (Audit logged)
              </ThemedText>
            </View>
          )}

          <View style={styles.buttonRow}>
            <Button title="Confirm Check-In" onPress={handleConfirm} />
            <Button
              title="Re-acquire Fix"
              variant="secondary"
              onPress={handleCapture}
            />
          </View>
        </View>
      )}

      {step === 'enqueued' && (
        <View style={styles.content}>
          <ThemedText variant="heading" color={theme.colors.success}>
            ✓ Check-In Saved Offline
          </ThemedText>
          <ThemedText variant="caption">
            Event added to the local SQLite queue and scheduled for server replay.
          </ThemedText>
          <Button title="Done" variant="secondary" onPress={reset} />
        </View>
      )}

      {step === 'error' && (
        <View style={styles.content}>
          <ThemedText variant="body" color={theme.colors.error}>
            {errorMessage || 'Failed to acquire accurate GPS position'}
          </ThemedText>
          <View style={styles.buttonRow}>
            <Button title={t('common.retry')} onPress={handleCapture} />
            <Button title={t('common.cancel')} variant="secondary" onPress={reset} />
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 12,
  },
  header: {
    marginBottom: 12,
  },
  content: {
    gap: 12,
  },
  textSpaced: {
    marginBottom: 8,
  },
  warningText: {
    marginBottom: 8,
    lineHeight: 20,
  },
  buttonRow: {
    gap: 8,
    marginTop: 4,
  },
  badge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  fixDetails: {
    textAlign: 'center',
  },
  mockWarning: {
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
});
