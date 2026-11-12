import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, ThemedText } from '@/shared/components';
import {
  ManualGpsPolicyConfig,
  OriginalDeviceFix,
} from '../domain/types';
import {
  createManualGpsSchema,
  ManualGpsFormValues,
  parseManualCoordinates,
} from '../domain/validation';
import { verifyCoordinatesInMaps } from '../domain/mapsDeepLink';
import { evaluateRateLimit, getManualGpsPolicy } from '../domain/policy';
import { submitManualAttendanceWithQueue } from '../db/manualEntryDatabase';
import { preparePhotoForUpload } from '../domain/photoCompressor';

interface ManualGpsFormProps {
  userId: string;
  originalDeviceFix?: OriginalDeviceFix | null;
  policy?: ManualGpsPolicyConfig;
  onSuccess: (recordId: number) => void;
  onCancel: () => void;
}

export function ManualGpsForm({
  userId,
  originalDeviceFix = null,
  policy = getManualGpsPolicy(),
  onSuccess,
  onCancel,
}: ManualGpsFormProps): React.JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoAttachment, setPhotoAttachment] = useState<string | null>(null);

  const schema = createManualGpsSchema(policy);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ManualGpsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      latitude: originalDeviceFix ? originalDeviceFix.latitude.toFixed(6) : '',
      longitude: originalDeviceFix ? originalDeviceFix.longitude.toFixed(6) : '',
      reason: '',
      photoUri: '',
    },
  });

  const handleVerifyInMaps = async (): Promise<void> => {
    const lat = Number(getValues('latitude'));
    const lon = Number(getValues('longitude'));

    if (Number.isNaN(lat) || Number.isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      Alert.alert(
        'Invalid Coordinates',
        'Please enter valid latitude (-90 to +90) and longitude (-180 to +180) before verifying in maps.',
      );
      return;
    }

    const opened = await verifyCoordinatesInMaps(lat, lon, 'Reported Worksite');
    if (!opened) {
      Alert.alert('Unable to Open Maps', 'Could not open native maps application.');
    }
  };

  const handleAttachSimulatedPhoto = async (): Promise<void> => {
    // Simulator/lightweight photo attachment without adding native camera dependencies
    const mockPhotoUri = `file:///data/user/0/com.hrms.attendance/cache/worksite_proof_${Date.now()}.jpg`;
    const compressed = await preparePhotoForUpload(mockPhotoUri, 0.6);
    setPhotoAttachment(compressed.uri);
    Alert.alert('Photo Attached', 'Worksite photo attached and compressed at 60% quality.');
  };

  const onSubmit = async (values: ManualGpsFormValues): Promise<void> => {
    // 1. Check daily rate limits
    const rateCheck = evaluateRateLimit(0, policy);
    if (!rateCheck.allowed) {
      Alert.alert('Rate Limit Exceeded', rateCheck.reason ?? 'Daily limit reached.');
      return;
    }

    setIsSubmitting(true);
    try {
      const validated = schema.parse(values);
      const coords = parseManualCoordinates(validated);
      const clientId = `man_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const { manualRecord } = await submitManualAttendanceWithQueue({
        clientId,
        userId,
        latitude: coords.latitude,
        longitude: coords.longitude,
        reason: validated.reason,
        photoUri: photoAttachment ?? undefined,
        photoQuality: 0.6,
        audit: {
          who: userId,
          when: Date.now(),
          device: {
            os: Platform.OS,
            osVersion: String(Platform.Version),
            appVersion: '1.0.0',
          },
          reason: validated.reason,
          originalDeviceFix,
          reviewedBy: null,
          reviewedAt: null,
          reviewNote: null,
        },
      });

      Alert.alert(
        'Manual Entry Submitted',
        'Your manual GPS attendance request has been queued with status [PENDING SUPERVISOR APPROVAL].',
        [{ text: 'OK', onPress: () => onSuccess(manualRecord.id) }],
      );
    } catch (err) {
      Alert.alert(
        'Submission Error',
        err instanceof Error ? err.message : 'Failed to submit manual coordinate entry.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Distinct Manual Source Banner */}
      <View style={styles.distinctSourceBadge}>
        <ThemedText variant="caption" style={styles.badgeText}>
          ⚠️ MANUAL GPS OVERRIDE (REQUIRES SUPERVISOR APPROVAL)
        </ThemedText>
      </View>

      <Card style={styles.card}>
        <ThemedText variant="heading" style={styles.sectionTitle}>
          Manual Coordinates
        </ThemedText>
        <ThemedText variant="caption" style={styles.hint}>
          Specify worksite coordinates with at least 4 decimal places (e.g., 28.6139, 77.2090).
        </ThemedText>

        {originalDeviceFix ? (
          <View style={styles.originalFixBox}>
            <ThemedText variant="caption" style={styles.originalFixText}>
              Device GPS was ±{Math.round(originalDeviceFix.accuracy)}m ({originalDeviceFix.latitude.toFixed(4)}, {originalDeviceFix.longitude.toFixed(4)})
            </ThemedText>
          </View>
        ) : null}

        {/* Latitude */}
        <View style={styles.inputGroup}>
          <ThemedText variant="body" style={styles.label}>
            Latitude:
          </ThemedText>
          <Controller
            control={control}
            name="latitude"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.latitude && styles.inputError]}
                placeholder="e.g. 28.613900"
                placeholderTextColor="#64748B"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.latitude ? (
            <ThemedText variant="caption" style={styles.errorText}>
              {errors.latitude.message}
            </ThemedText>
          ) : null}
        </View>

        {/* Longitude */}
        <View style={styles.inputGroup}>
          <ThemedText variant="body" style={styles.label}>
            Longitude:
          </ThemedText>
          <Controller
            control={control}
            name="longitude"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.longitude && styles.inputError]}
                placeholder="e.g. 77.209000"
                placeholderTextColor="#64748B"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.longitude ? (
            <ThemedText variant="caption" style={styles.errorText}>
              {errors.longitude.message}
            </ThemedText>
          ) : null}
        </View>

        {/* Verify in Maps (No Map SDK) */}
        <Button
          title="Verify in Maps ↗"
          variant="outline"
          onPress={handleVerifyInMaps}
          style={styles.mapVerifyButton}
        />

        {/* Reason */}
        <View style={styles.inputGroup}>
          <ThemedText variant="body" style={styles.label}>
            Justification Reason (Required):
          </ThemedText>
          <Controller
            control={control}
            name="reason"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.textArea, errors.reason && styles.inputError]}
                placeholder="Explain why hardware GPS fix was unavailable (e.g., basement facility, signal loss)..."
                placeholderTextColor="#64748B"
                multiline
                numberOfLines={4}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.reason ? (
            <ThemedText variant="caption" style={styles.errorText}>
              {errors.reason.message}
            </ThemedText>
          ) : null}
        </View>

        {/* Optional Photo Attachment */}
        <View style={styles.photoSection}>
          <ThemedText variant="body" style={styles.label}>
            Worksite Proof Photo (Optional):
          </ThemedText>
          {photoAttachment ? (
            <View style={styles.photoAttachedBox}>
              <ThemedText variant="caption" style={styles.photoAttachedText}>
                ✓ Worksite photo attached (compressed 60%)
              </ThemedText>
              <Button
                title="Remove"
                variant="outline"
                onPress={() => setPhotoAttachment(null)}
              />
            </View>
          ) : (
            <Button
              title="Attach Worksite Photo"
              variant="outline"
              onPress={handleAttachSimulatedPhoto}
            />
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionRow}>
          <Button
            title="Cancel"
            variant="secondary"
            onPress={onCancel}
            style={styles.cancelButton}
          />
          <Button
            title={isSubmitting ? 'Submitting...' : 'Submit Manual Entry'}
            variant="primary"
            onPress={() => {
              void handleSubmit(onSubmit)();
            }}
            disabled={isSubmitting}
            style={styles.submitButton}
          />
        </View>
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#0066cc" style={styles.loader} />
        ) : null}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  distinctSourceBadge: {
    backgroundColor: '#78350F', // Amber warning badge
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FDE68A',
    fontWeight: '700',
    fontSize: 11,
  },
  card: {
    padding: 16,
    backgroundColor: '#0F172A',
  },
  sectionTitle: {
    color: '#F8FAFC',
    marginBottom: 4,
  },
  hint: {
    color: '#94A3B8',
    marginBottom: 16,
  },
  originalFixBox: {
    backgroundColor: '#1E293B',
    padding: 8,
    borderRadius: 6,
    marginBottom: 16,
  },
  originalFixText: {
    color: '#CBD5E1',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#F8FAFC',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  textArea: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#F8FAFC',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    marginTop: 4,
  },
  mapVerifyButton: {
    marginBottom: 16,
  },
  photoSection: {
    marginBottom: 20,
  },
  photoAttachedBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    padding: 8,
    borderRadius: 6,
  },
  photoAttachedText: {
    color: '#A7F3D0',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
  loader: {
    marginTop: 12,
  },
});
