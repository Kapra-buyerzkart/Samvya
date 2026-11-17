import { Button, ThemedText } from '@/shared/components';
import { useAppTheme } from '@/shared/theme';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { LivenessChallengeType } from '../domain/types';
import { VerificationFlowStep } from '../hooks/useFaceVerificationFlow';

export interface FaceVerifyCameraViewProps {
  actionText?: string;
  isCameraActive?: boolean;
  isPunching?: boolean;
  onPunch?: () => void | Promise<void>;
  // Backwards-compatible optional props for existing references
  step?: VerificationFlowStep;
  instruction?: string;
  challengeType?: LivenessChallengeType;
  onFacesDetected?: (faces: unknown) => void;
  onFallbackToManual?: () => void;
  onViewConsent?: () => void;
  onRetry?: () => void;
  onSimulateVerification?: () => void;
}

export function FaceVerifyCameraView({
  actionText = 'Punch In',
  isCameraActive = true,
  isPunching = false,
  onPunch,
  onSimulateVerification,
}: FaceVerifyCameraViewProps): React.JSX.Element {
  const theme = useAppTheme();
  const isDark = theme.isDark;

  // Exclusively lock to the front camera
  const frontDevice = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();

  const handlePunchPress = (): void => {
    if (onPunch) {
      void onPunch();
    } else if (onSimulateVerification) {
      onSimulateVerification();
    }
  };

  // If permission is not yet granted, render permission request card
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.permissionCard,
            {
              backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
              borderColor: isDark ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          <View style={styles.permissionIconCircle}>
            <Feather name="camera-off" size={36} color="#EF4444" />
          </View>
          <ThemedText
            variant="heading"
            style={[
              styles.permissionTitle,
              { color: isDark ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            Camera Permission Required
          </ThemedText>
          <ThemedText
            variant="body"
            style={[
              styles.permissionDescription,
              { color: isDark ? '#94A3B8' : '#64748B' },
            ]}
          >
            HRMS needs front camera access to capture your attendance photo when checking in or out.
          </ThemedText>
          <Button
            title="Grant Camera Access"
            variant="primary"
            onPress={requestPermission}
            style={styles.actionBtn}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Viewfinder Window (Front Camera Only) */}
      <View style={styles.viewfinderContainer}>
        {frontDevice && isCameraActive ? (
          <Camera
            style={StyleSheet.absoluteFill}
            device={frontDevice}
            isActive={isCameraActive}
          />
        ) : (
          <View style={styles.noCameraPlaceholder}>
            <Feather name="video-off" size={48} color="#64748B" />
            <ThemedText variant="heading" style={styles.noCameraTitle}>
              Front Camera Viewfinder
            </ThemedText>
            <ThemedText variant="caption" style={styles.noCameraSubtitle}>
              {!frontDevice
                ? 'No front camera detected on this device/simulator. Tap punch below to proceed.'
                : 'Front camera is currently paused.'}
            </ThemedText>
          </View>
        )}

        {/* Viewfinder Overlay Guide */}
        <View style={styles.overlay} pointerEvents="box-none">
          <View style={styles.faceOvalGuide}>
            <View style={styles.crosshairH} />
            <View style={styles.crosshairV} />
          </View>
        </View>

        {/* Framing guidance */}
        <View style={styles.hintBadge}>
          <ThemedText variant="caption" style={styles.hintText}>
            Align face in front camera & tap button below
          </ThemedText>
        </View>
      </View>

      {/* Bottom Punch Controls */}
      <View style={styles.bottomBar}>
        <Button
          title={isPunching ? 'Recording Punch...' : actionText}
          variant="primary"
          loading={isPunching}
          onPress={handlePunchPress}
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
  permissionCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
  },
  permissionIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  permissionTitle: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 12,
  },
  permissionDescription: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  viewfinderContainer: {
    flex: 1,
    backgroundColor: '#0B0F19',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  noCameraPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  noCameraTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    marginTop: 8,
  },
  noCameraSubtitle: {
    color: '#94A3B8',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceOvalGuide: {
    width: 250,
    height: 330,
    borderRadius: 125,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairH: {
    position: 'absolute',
    width: 32,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  crosshairV: {
    position: 'absolute',
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  hintBadge: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  hintText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '500',
  },
  bottomBar: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  actionBtn: {
    width: '100%',
  },
});
