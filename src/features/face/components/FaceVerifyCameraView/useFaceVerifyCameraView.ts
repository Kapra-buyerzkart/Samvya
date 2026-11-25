import { useEffect, useRef, useState } from 'react';
import { type CameraRef, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { LivenessChallengeType } from '../../domain/types';
import { VerificationFlowStep } from '../../hooks/useFaceVerificationFlow';

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

const SIMULATED_PHOTO_URI =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

interface NativePhotoResult {
  path?: string;
}

interface PhotoCapableCamera {
  takePhoto?: (options?: { flash?: 'on' | 'off' }) => Promise<NativePhotoResult>;
}

export function useFaceVerifyCameraView({
  onPunch,
  onSimulateVerification,
}: Pick<FaceVerifyCameraViewProps, 'onPunch' | 'onSimulateVerification'>) {
  const cameraRef = useRef<CameraRef | null>(null);
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('front');
  const [torch, setTorch] = useState<'off' | 'on'>('off');
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);

  const device = useCameraDevice(cameraPosition);
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) {
      void requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const handleToggleCamera = (): void => {
    setCameraPosition((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  const handleToggleTorch = (): void => {
    setTorch((prev) => (prev === 'off' ? 'on' : 'off'));
  };

  const handleCapturePhoto = (): void => {
    try {
      const photoCamera = cameraRef.current as unknown as PhotoCapableCamera | null;
      if (photoCamera && device && typeof photoCamera.takePhoto === 'function') {
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

  const handleRetake = (): void => {
    setCapturedPhotoUri(null);
  };

  const handleUpload = (): void => {
    if (onPunch) {
      void onPunch();
    } else if (onSimulateVerification) {
      onSimulateVerification();
    }
  };

  return {
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
  };
}
