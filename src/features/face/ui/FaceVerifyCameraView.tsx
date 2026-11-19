import { TactilePressable } from '@/shared/animations';
import { Button, ThemedText } from '@/shared/components';
import { FontFamily } from '@/shared/theme';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Camera, type CameraRef, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { LivenessChallengeType } from '../domain/types';
import { VerificationFlowStep } from '../hooks/useFaceVerificationFlow';

export interface FaceVerifyCameraViewProps {
  actionText?: string;
  isCameraActive?: boolean;
  isPunching?: boolean;
  onPunch?: () => void | Promise<void>;
  onCancel?: () => void;
  // Backwards-compatible optional props for existing references
  dateText?: string;
  shiftText?: string;
  workModeText?: string;
  step?: VerificationFlowStep;
  instruction?: string;
  challengeType?: LivenessChallengeType;
  onFacesDetected?: (faces: unknown) => void;
  onFallbackToManual?: () => void;
  onViewConsent?: () => void;
  onRetry?: () => void;
  onSimulateVerification?: () => void;
}

// Sample realistic placeholder photo used for simulation and test environments
const SIMULATED_PHOTO_URI =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

interface NativePhotoResult {
  path?: string;
}

interface PhotoCapableCamera {
  takePhoto?: (options?: { flash?: 'on' | 'off' }) => Promise<NativePhotoResult>;
}

export function FaceVerifyCameraView({
  actionText = 'Punch Out',
  isCameraActive = true,
  isPunching = false,
  onPunch,
  onCancel,
  onSimulateVerification,
}: FaceVerifyCameraViewProps): React.JSX.Element {
  const cameraRef = useRef<CameraRef | null>(null);

  // Camera settings state
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('front');
  const [torch, setTorch] = useState<'off' | 'on'>('off');

  // Captured photo preview state
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);

  // Vision Camera hooks
  const device = useCameraDevice(cameraPosition);
  const { hasPermission, requestPermission } = useCameraPermission();

  React.useEffect(() => {
    if (!hasPermission) {
      void requestPermission();
    }
  }, [hasPermission, requestPermission]);

  // Flip between front and back camera
  const handleToggleCamera = (): void => {
    setCameraPosition((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  // Toggle flash/torch
  const handleToggleTorch = (): void => {
    setTorch((prev) => (prev === 'off' ? 'on' : 'off'));
  };

  // Shutter tap: capture photo or simulate
  const handleCapturePhoto = (): void => {
    try {
      const photoCamera = cameraRef.current as unknown as PhotoCapableCamera | null;
      if (
        photoCamera &&
        device &&
        typeof photoCamera.takePhoto === 'function'
      ) {
        void photoCamera
          .takePhoto({ flash: torch })
          .then((photo: NativePhotoResult) => {
            if (photo?.path) {
              setCapturedPhotoUri(`file://${photo.path}`);
            } else {
              setCapturedPhotoUri(SIMULATED_PHOTO_URI);
            }
          })
          .catch(() => {
            setCapturedPhotoUri(SIMULATED_PHOTO_URI);
          });
        return;
      }
      setCapturedPhotoUri(SIMULATED_PHOTO_URI);
    } catch {
      setCapturedPhotoUri(SIMULATED_PHOTO_URI);
    }
  };

  // Discard captured photo and return to camera viewfinder
  const handleRetake = (): void => {
    setCapturedPhotoUri(null);
  };

  // Upload photo and submit punch
  const handleUpload = (): void => {
    if (onPunch) {
      void onPunch();
    } else if (onSimulateVerification) {
      onSimulateVerification();
    }
  };

  // If permission is not yet granted, render permission request card
  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <View style={styles.permissionIconCircle}>
            <Feather name="camera-off" size={36} color="#EF4444" />
          </View>
          <ThemedText variant="heading" style={styles.permissionTitle}>
            Camera Permission Required
          </ThemedText>
          <ThemedText variant="body" style={styles.permissionDescription}>
            HRMS needs camera access to capture your attendance photo when checking in or out.
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

  // -------------------------------------------------------------
  // STATE 1: PHOTO CAPTURED / REVIEW MODE (Image 1)
  // -------------------------------------------------------------
  if (capturedPhotoUri) {
    return (
      <View style={styles.screenContainer}>
        {/* Top Header */}
        <View style={styles.headerBar}>
          <TactilePressable
            onPress={handleRetake}
            style={styles.headerBackBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityLabel="Retake photo"
          >
            <Feather name="chevron-left" size={28} color="#FFFFFF" />
          </TactilePressable>
          <Text style={styles.headerTitle}>Face verification</Text>
        </View>

        {/* Captured Photo Preview Window */}
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: capturedPhotoUri }}
            style={styles.capturedImage}
            contentFit="cover"
            transition={200}
            accessibilityLabel="Captured attendance photo"
          />
        </View>

        {/* Bottom Review Action Buttons: [ Retake ] [ Upload ] */}
        <View style={styles.reviewBottomBar}>
          <TactilePressable
            style={styles.pillButton}
            onPress={handleRetake}
            disabled={isPunching}
            activeScale={0.96}
            accessibilityRole="button"
            accessibilityLabel="Retake"
            testID="retake-photo-btn"
          >
            <Text style={styles.pillButtonText}>Retake</Text>
          </TactilePressable>

          <TactilePressable
            style={styles.pillButton}
            onPress={handleUpload}
            disabled={isPunching}
            activeScale={0.96}
            accessibilityRole="button"
            accessibilityLabel={isPunching ? 'Uploading...' : 'Upload'}
            testID="upload-photo-btn"
          >
            {isPunching ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.pillButtonText}>Upload</Text>
            )}
          </TactilePressable>
        </View>
      </View>
    );
  }

  // -------------------------------------------------------------
  // STATE 2: LIVE CAMERA VIEWFINDER & SHUTTER (Image 2)
  // -------------------------------------------------------------
  return (
    <View style={styles.screenContainer}>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <TactilePressable
          onPress={onCancel}
          style={styles.headerBackBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel="Go back"
        >
          <Feather name="chevron-left" size={28} color="#FFFFFF" />
        </TactilePressable>
        <Text style={styles.headerTitle}>Face verification</Text>
      </View>

      {/* Main Viewfinder Frame with Rounded Bottom Corners */}
      <View style={styles.cameraFrame}>
        {device ? (
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isCameraActive && !capturedPhotoUri}
            torchMode={torch}
          />
        ) : (
          // Simulation / Simulator fallback background
          <View style={styles.simulatedContainer}>
            <LinearGradient
              colors={['#FEF3C7', '#FDE68A', '#FCD34D']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            <View style={styles.simulatedBadge}>
              <Feather name="camera" size={18} color="#78350F" />
              <Text style={styles.simulatedText}>
                {cameraPosition === 'front' ? 'Front Camera (Simulated)' : 'Back Camera (Simulated)'}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Bottom Shutter & Controls Bar: [ Flash ] [ Shutter ] [ Flip ] */}
      <View style={styles.cameraBottomBar}>
        {/* Left: Torch / Flash Toggle */}
        <TactilePressable
          style={[
            styles.roundControlBtn,
            torch === 'on' && styles.roundControlBtnActive,
          ]}
          onPress={handleToggleTorch}
          activeScale={0.92}
          accessibilityRole="button"
          accessibilityLabel={torch === 'on' ? 'Flash On' : 'Flash Off'}
          testID="toggle-torch-btn"
        >
          <Feather
            name={torch === 'on' ? 'zap' : 'zap-off'}
            size={24}
            color="#FFFFFF"
          />
        </TactilePressable>

        {/* Center: Large Shutter Capture Button */}
        <TactilePressable
          style={styles.shutterOuterRing}
          onPress={handleCapturePhoto}
          activeScale={0.92}
          accessibilityRole="button"
          accessibilityLabel="Capture photo"
          testID="shutter-capture-btn"
        >
          <View style={styles.shutterInnerDisc} />
        </TactilePressable>

        {/* Right: Camera Flip (Front <-> Back) */}
        <TactilePressable
          style={styles.roundControlBtn}
          onPress={handleToggleCamera}
          activeScale={0.92}
          accessibilityRole="button"
          accessibilityLabel={cameraPosition === 'front' ? 'Switch to back camera' : 'Switch to front camera'}
          testID="flip-camera-btn"
        >
          <Feather name="refresh-cw" size={24} color="#FFFFFF" />
        </TactilePressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  // Top Header Bar
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#000000',
    gap: 8,
  },
  headerBackBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  headerTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 19,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  // Main Camera Viewfinder Frame
  cameraFrame: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000000',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  simulatedContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simulatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  simulatedText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: '#78350F',
  },
  // Bottom Shutter Controls Bar
  cameraBottomBar: {
    height: 140,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
  },
  roundControlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundControlBtnActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  shutterOuterRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  shutterInnerDisc: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
  },
  // Preview Screen Elements
  previewContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
  },
  reviewBottomBar: {
    height: 120,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    gap: 16,
  },
  pillButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#38383A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  // Permissions State
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 24,
    justifyContent: 'center',
  },
  permissionCard: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0F172A',
    alignItems: 'center',
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
    color: '#F8FAFC',
    marginBottom: 12,
  },
  permissionDescription: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    color: '#94A3B8',
    marginBottom: 24,
  },
  actionBtn: {
    width: '100%',
  },
});
