import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { TactilePressable } from '@/shared/animations';
import { Button, ThemedText } from '@/shared/components';
import { styles } from './FaceVerifyCameraView.styles';
import {
  type FaceVerifyCameraViewProps,
  useFaceVerifyCameraView,
} from './useFaceVerifyCameraView';

export type { FaceVerifyCameraViewProps };

export function FaceVerifyCameraView({
  isCameraActive = true,
  isPunching = false,
  onPunch,
  onCancel,
  onSimulateVerification,
}: FaceVerifyCameraViewProps): React.JSX.Element {
  const {
    cameraRef,
    device,
    hasPermission,
    requestPermission,
    cameraPosition,
    torch,
    capturedPhotoUri,
    handleToggleCamera,
    handleToggleTorch,
    handleCapturePhoto,
    handleRetake,
    handleUpload,
  } = useFaceVerifyCameraView({ onPunch, onSimulateVerification });

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

  if (capturedPhotoUri) {
    return (
      <View style={styles.screenContainer}>
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

        <View style={styles.previewContainer}>
          <Image
            source={{ uri: capturedPhotoUri }}
            style={styles.capturedImage}
            contentFit="cover"
            transition={200}
            accessibilityLabel="Captured attendance photo"
          />
        </View>

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

  return (
    <View style={styles.screenContainer}>
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

      <View style={styles.cameraBottomBar}>
        <TactilePressable
          style={[styles.roundControlBtn, torch === 'on' && styles.roundControlBtnActive]}
          onPress={handleToggleTorch}
          activeScale={0.92}
          accessibilityRole="button"
          accessibilityLabel={torch === 'on' ? 'Flash On' : 'Flash Off'}
          testID="toggle-torch-btn"
        >
          <Feather name={torch === 'on' ? 'zap' : 'zap-off'} size={24} color="#FFFFFF" />
        </TactilePressable>

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
