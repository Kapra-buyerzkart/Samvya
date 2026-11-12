import { Button, Card, ThemedText } from '@/shared/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LivenessChallengeType } from '../domain/types';
import { VerificationFlowStep } from '../hooks/useFaceVerificationFlow';

interface FaceVerifyCameraViewProps {
  step: VerificationFlowStep;
  instruction: string;
  challengeType: LivenessChallengeType;
  onFallbackToManual: () => void;
  onViewConsent: () => void;
  onRetry: () => void;
}

export function FaceVerifyCameraView({
  step,
  instruction,
  challengeType,
  onFallbackToManual,
  onViewConsent,
  onRetry,
}: FaceVerifyCameraViewProps): React.JSX.Element {
  const isChallenging = step === 'challenging';
  const isCompleted = step === 'completed';
  const isError = step === 'error';

  const getRingColor = (): string => {
    if (isCompleted) return '#10B981'; // Green on success
    if (isChallenging) return '#F59E0B'; // Amber during challenge
    if (isError) return '#EF4444'; // Red on error
    return '#3B82F6'; // Blue neutral
  };

  return (
    <View style={styles.container}>
      {/* Top Instruction Banner */}
      <Card style={styles.instructionCard}>
        <ThemedText variant="heading" style={styles.instructionTitle}>
          {instruction}
        </ThemedText>
        {isChallenging ? (
          <ThemedText variant="caption" style={styles.challengeBadge}>
            Active Challenge: {challengeType.toUpperCase().replace('_', ' ')}
          </ThemedText>
        ) : null}
      </Card>

      {/* Center Face Oval Guide */}
      <View style={styles.cameraPlaceholder}>
        <View style={[styles.faceGuideRing, { borderColor: getRingColor() }]}>
          <View style={styles.crosshairH} />
          <View style={styles.crosshairV} />
        </View>

        <ThemedText variant="caption" style={styles.privacyGuarantee}>
          No biometric templates are stored on device (DPDP Act, 2023)
        </ThemedText>
      </View>

      {/* Bottom Fallbacks & Controls */}
      <View style={styles.bottomControls}>
        {isError ? (
          <Button
            title="Retry Face Scan"
            variant="primary"
            onPress={onRetry}
            style={styles.actionBtn}
          />
        ) : null}

        <Button
          title="Use Supervisor Approval (Manual GPS)"
          variant="secondary"
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
  instructionTitle: {
    color: '#F8FAFC',
    textAlign: 'center',
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
    marginVertical: 20,
  },
  faceGuideRing: {
    width: 250,
    height: 330,
    borderRadius: 125,
    borderWidth: 3,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairH: {
    position: 'absolute',
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  crosshairV: {
    position: 'absolute',
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  privacyGuarantee: {
    color: '#94A3B8',
    marginTop: 16,
    fontSize: 11,
    textAlign: 'center',
  },
  bottomControls: {
    gap: 10,
    marginBottom: 10,
  },
  actionBtn: {
    width: '100%',
  },
});
