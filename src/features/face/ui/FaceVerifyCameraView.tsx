import { Button, Card, ThemedText } from '@/shared/components';
import { TactilePressable } from '@/shared/animations';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LivenessChallengeType } from '../domain/types';
import { VerificationFlowStep } from '../hooks/useFaceVerificationFlow';

export interface FaceVerifyCameraViewProps {
  step: VerificationFlowStep;
  instruction: string;
  challengeType: LivenessChallengeType;
  actionText?: string;
  onFallbackToManual: () => void;
  onViewConsent: () => void;
  onRetry: () => void;
  onSimulateVerification?: () => void;
}

export function FaceVerifyCameraView({
  step,
  instruction,
  challengeType,
  actionText = 'Punch In',
  onFallbackToManual,
  onViewConsent,
  onRetry,
  onSimulateVerification,
}: FaceVerifyCameraViewProps): React.JSX.Element {
  const isChallenging = step === 'challenging';
  const isCapturing = step === 'capturing';
  const isCompleted = step === 'completed';
  const isError = step === 'error';
  const isProcessing = isChallenging || isCapturing;

  const getRingColor = (): string => {
    if (isCompleted) return '#10B981'; // Green on success
    if (isChallenging) return '#F59E0B'; // Amber during challenge
    if (isCapturing) return '#6366F1'; // Indigo during photo capture
    if (isError) return '#EF4444'; // Red on error
    return '#3B82F6'; // Blue neutral
  };

  const getStatusIcon = (): keyof typeof Feather.glyphMap => {
    if (isCompleted) return 'check-circle';
    if (isError) return 'alert-circle';
    if (isProcessing) return 'loader';
    return 'camera';
  };

  return (
    <View style={styles.container}>
      {/* Top Instruction Banner */}
      <Card style={styles.instructionCard}>
        <View style={styles.instructionHeader}>
          <Feather name={getStatusIcon()} size={20} color={getRingColor()} />
          <ThemedText variant="heading" style={styles.instructionTitle}>
            {instruction}
          </ThemedText>
        </View>
        {isChallenging ? (
          <ThemedText variant="caption" style={styles.challengeBadge}>
            Active Challenge: {challengeType.toUpperCase().replace('_', ' ')}
          </ThemedText>
        ) : null}
      </Card>

      {/* Center Face Oval Guide */}
      <View style={styles.cameraPlaceholder}>
        <TactilePressable
          onPress={onSimulateVerification}
          disabled={isProcessing || isCompleted}
          style={[styles.faceGuideRing, { borderColor: getRingColor() }]}
          accessibilityLabel="Face alignment oval. Tap to verify face."
        >
          <View style={styles.crosshairH} />
          <View style={styles.crosshairV} />

          <View style={styles.ringCenterContent}>
            <Feather
              name={isCompleted ? 'check' : isProcessing ? 'refresh-cw' : 'smile'}
              size={48}
              color={getRingColor()}
            />
            {onSimulateVerification && !isCompleted && !isProcessing ? (
              <ThemedText variant="caption" style={styles.tapToScanText}>
                Tap to Scan Face
              </ThemedText>
            ) : null}
          </View>
        </TactilePressable>

        <ThemedText variant="caption" style={styles.privacyGuarantee}>
          No biometric templates are stored on device (DPDP Act, 2023)
        </ThemedText>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {onSimulateVerification && !isCompleted ? (
          <Button
            title={
              isProcessing
                ? 'Verifying Liveness...'
                : `Verify Face & ${actionText}`
            }
            variant="primary"
            loading={isProcessing}
            onPress={onSimulateVerification}
            style={styles.actionBtn}
          />
        ) : null}

        {isError ? (
          <Button
            title="Retry Face Scan"
            variant="secondary"
            onPress={onRetry}
            style={styles.actionBtn}
          />
        ) : null}

        <Button
          title="Use Supervisor Approval (Manual GPS)"
          variant="outline"
          onPress={onFallbackToManual}
          style={styles.actionBtn}
        />

        <Button
          title="Biometric Notice & Privacy Rights"
          variant="outline"
          onPress={onViewConsent}
          style={styles.actionBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  instructionCard: {
    backgroundColor: '#0F172A',
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  instructionTitle: {
    color: '#F8FAFC',
    textAlign: 'center',
    fontSize: 16,
  },
  challengeBadge: {
    color: '#FDE68A',
    marginTop: 6,
    fontWeight: '700',
  },
  cameraPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  faceGuideRing: {
    width: 240,
    height: 310,
    borderRadius: 120,
    borderWidth: 3,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  ringCenterContent: {
    alignItems: 'center',
    gap: 8,
  },
  tapToScanText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  crosshairH: {
    position: 'absolute',
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  crosshairV: {
    position: 'absolute',
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  privacyGuarantee: {
    color: '#94A3B8',
    marginTop: 16,
    fontSize: 11,
    textAlign: 'center',
  },
  bottomControls: {
    gap: 8,
    marginBottom: 8,
  },
  actionBtn: {
    width: '100%',
  },
});
