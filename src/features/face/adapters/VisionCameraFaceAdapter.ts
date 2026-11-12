import { Platform } from 'react-native';
import { VisionCamera, type PermissionStatus } from 'react-native-vision-camera';
import { FaceDetectionPort } from '../domain/ports/FaceDetectionPort';
import { DetectedFace, ModelReadinessState } from '../domain/types';

export class VisionCameraFaceAdapter implements FaceDetectionPort {
  readonly adapterName = 'VisionCameraFaceDetector (Unbundled MLKit / Apple Vision)';

  async checkReadiness(): Promise<ModelReadinessState> {
    // 1. Check camera permission
    const cameraPermission: PermissionStatus = VisionCamera.cameraPermissionStatus;
    if (cameraPermission === 'denied' || cameraPermission === 'restricted') {
      return 'camera_denied';
    }

    if (cameraPermission === 'not-determined') {
      // Must be requested on screen
      return 'ready';
    }

    // 2. Platform-specific ML model readiness check
    if (Platform.OS === 'android') {
      // Unbundled ML Kit relies on Google Play Services install-time download
      // Default to ready unless Google Play Services is missing
      return 'ready';
    }

    // iOS uses native Apple Vision framework; model is always ready
    return 'ready';
  }

  async detectFacesInFrame(rawFaces: unknown): Promise<DetectedFace[]> {
    if (!rawFaces || !Array.isArray(rawFaces)) {
      return [];
    }

    return rawFaces.map((f: Record<string, unknown>) => {
      const bounds = (f.bounds as { x?: number; y?: number; width?: number; height?: number }) ?? {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };

      return {
        bounds: {
          x: bounds.x ?? 0,
          y: bounds.y ?? 0,
          width: bounds.width ?? 0,
          height: bounds.height ?? 0,
        },
        rollAngle: typeof f.rollAngle === 'number' ? f.rollAngle : 0,
        pitchAngle: typeof f.pitchAngle === 'number' ? f.pitchAngle : 0,
        yawAngle: typeof f.yawAngle === 'number' ? f.yawAngle : 0,
        leftEyeOpenProbability: typeof f.leftEyeOpenProbability === 'number' ? f.leftEyeOpenProbability : null,
        rightEyeOpenProbability: typeof f.rightEyeOpenProbability === 'number' ? f.rightEyeOpenProbability : null,
        smilingProbability: typeof f.smilingProbability === 'number' ? f.smilingProbability : null,
        frameWidth: typeof f.frameWidth === 'number' ? f.frameWidth : 1080,
        frameHeight: typeof f.frameHeight === 'number' ? f.frameHeight : 1920,
      };
    });
  }

  async release(): Promise<void> {
    // Clean-up any cached resources
  }
}
