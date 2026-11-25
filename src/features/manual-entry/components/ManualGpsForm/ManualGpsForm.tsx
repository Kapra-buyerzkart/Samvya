import React from 'react';
import { ActivityIndicator, TextInput, View } from 'react-native';
import { Controller } from 'react-hook-form';
import { Button, Card, KeyboardAvoidingScrollView, ThemedText } from '@/shared/components';
import { getManualGpsPolicy } from '../../domain/policy';
import {
  getCardStyle,
  getHintStyle,
  getInputStyle,
  getLabelStyle,
  getOriginalFixBoxStyle,
  getOriginalFixTextStyle,
  getPhotoAttachedBoxStyle,
  getPhotoAttachedTextStyle,
  getSectionTitleStyle,
  getTextAreaStyle,
  styles,
} from './ManualGpsForm.styles';
import { type ManualGpsFormProps, useManualGpsForm } from './useManualGpsForm';

export type { ManualGpsFormProps };

export function ManualGpsForm({
  userId,
  originalDeviceFix = null,
  policy = getManualGpsPolicy(),
  onSuccess,
  onCancel,
}: ManualGpsFormProps): React.JSX.Element {
  const {
    isDark,
    control,
    errors,
    isSubmitting,
    photoAttachment,
    setPhotoAttachment,
    handleVerifyInMaps,
    handleAttachSimulatedPhoto,
    submitForm,
  } = useManualGpsForm({ userId, originalDeviceFix, policy, onSuccess });

  return (
    <KeyboardAvoidingScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.distinctSourceBadge}>
        <ThemedText variant="caption" style={styles.badgeText}>
          ⚠️ MANUAL GPS OVERRIDE (REQUIRES SUPERVISOR APPROVAL)
        </ThemedText>
      </View>

      <Card style={getCardStyle(isDark)}>
        <ThemedText variant="heading" style={getSectionTitleStyle(isDark)}>
          Manual Coordinates
        </ThemedText>
        <ThemedText variant="caption" style={getHintStyle(isDark)}>
          Specify worksite coordinates with at least 4 decimal places (e.g., 28.6139, 77.2090).
        </ThemedText>

        {originalDeviceFix ? (
          <View style={getOriginalFixBoxStyle(isDark)}>
            <ThemedText variant="caption" style={getOriginalFixTextStyle(isDark)}>
              Device GPS was ±{Math.round(originalDeviceFix.accuracy)}m ({originalDeviceFix.latitude.toFixed(4)}, {originalDeviceFix.longitude.toFixed(4)})
            </ThemedText>
          </View>
        ) : null}

        <View style={styles.inputGroup}>
          <ThemedText variant="body" style={getLabelStyle(isDark)}>
            Latitude:
          </ThemedText>
          <Controller
            control={control}
            name="latitude"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={getInputStyle(isDark, Boolean(errors.latitude))}
                placeholder="e.g. 28.613900"
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
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

        <View style={styles.inputGroup}>
          <ThemedText variant="body" style={getLabelStyle(isDark)}>
            Longitude:
          </ThemedText>
          <Controller
            control={control}
            name="longitude"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={getInputStyle(isDark, Boolean(errors.longitude))}
                placeholder="e.g. 77.209000"
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
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

        <Button
          title="Verify in Maps ↗"
          variant="outline"
          onPress={handleVerifyInMaps}
          style={styles.mapVerifyButton}
        />

        <View style={styles.inputGroup}>
          <ThemedText variant="body" style={getLabelStyle(isDark)}>
            Justification Reason (Required):
          </ThemedText>
          <Controller
            control={control}
            name="reason"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={getTextAreaStyle(isDark, Boolean(errors.reason))}
                placeholder="Explain why hardware GPS fix was unavailable (e.g., basement facility, signal loss)..."
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
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

        <View style={styles.photoSection}>
          <ThemedText variant="body" style={getLabelStyle(isDark)}>
            Worksite Proof Photo (Optional):
          </ThemedText>
          {photoAttachment ? (
            <View style={getPhotoAttachedBoxStyle(isDark)}>
              <ThemedText variant="caption" style={getPhotoAttachedTextStyle(isDark)}>
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
              void submitForm();
            }}
            disabled={isSubmitting}
            style={styles.submitButton}
          />
        </View>
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#0066cc" style={styles.loader} />
        ) : null}
      </Card>
    </KeyboardAvoidingScrollView>
  );
}
