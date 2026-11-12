import {
  DEFAULT_QUALITY_CONFIG,
  DetectedFace,
  FaceQualityConfig,
  QualityGateResult,
} from './types';

export function evaluateFaceCount(faces: DetectedFace[]): {
  valid: boolean;
  message: string;
} {
  if (faces.length === 0) {
    return {
      valid: false,
      message: 'Position your face inside the guide oval.',
    };
  }

  if (faces.length > 1) {
    return {
      valid: false,
      message: 'Multiple faces detected. Only one person is permitted.',
    };
  }

  return {
    valid: true,
    message: 'Face detected.',
  };
}

export function evaluateQualityGate(
  face: DetectedFace,
  frameWidth = face.frameWidth || 1080,
  frameHeight = face.frameHeight || 1920,
  config: FaceQualityConfig = DEFAULT_QUALITY_CONFIG,
): QualityGateResult {
  // 1. Pose Orientation Check (Pitch, Yaw, Roll must be within tolerance)
  const isPitchValid = Math.abs(face.pitchAngle) <= config.maxAngleToleranceDegrees;
  const isYawValid = Math.abs(face.yawAngle) <= config.maxAngleToleranceDegrees;
  const isRollValid = Math.abs(face.rollAngle) <= config.maxAngleToleranceDegrees;

  if (!isPitchValid || !isYawValid || !isRollValid) {
    return {
      passed: false,
      message: 'Look straight at the camera without tilting.',
      reason: `Pose angle out of bounds (pitch: ${Math.round(face.pitchAngle)}°, yaw: ${Math.round(face.yawAngle)}°, roll: ${Math.round(face.rollAngle)}°)`,
    };
  }

  // 2. Minimum Face Size Check (Distance from camera)
  const faceArea = face.bounds.width * face.bounds.height;
  const totalFrameArea = Math.max(1, frameWidth * frameHeight);
  const faceAreaFraction = faceArea / totalFrameArea;

  if (faceAreaFraction < config.minFaceAreaFraction) {
    return {
      passed: false,
      message: 'Move closer to the camera.',
      reason: `Face occupies ${(faceAreaFraction * 100).toFixed(1)}% of frame, minimum required is ${(config.minFaceAreaFraction * 100).toFixed(1)}%`,
    };
  }

  // 3. Centering Check (Face center relative to camera viewport)
  const faceCenterX = face.bounds.x + face.bounds.width / 2;
  const faceCenterY = face.bounds.y + face.bounds.height / 2;
  const normalizedCenterX = faceCenterX / frameWidth;
  const normalizedCenterY = faceCenterY / frameHeight;

  const minX = 0.5 - config.centerToleranceFraction;
  const maxX = 0.5 + config.centerToleranceFraction;
  const minY = 0.5 - config.centerToleranceFraction;
  const maxY = 0.5 + config.centerToleranceFraction;

  const isCenteredX = normalizedCenterX >= minX && normalizedCenterX <= maxX;
  const isCenteredY = normalizedCenterY >= minY && normalizedCenterY <= maxY;

  if (!isCenteredX || !isCenteredY) {
    return {
      passed: false,
      message: 'Center your face within the oval.',
      reason: `Face center (${normalizedCenterX.toFixed(2)}, ${normalizedCenterY.toFixed(2)}) is outside target bounds`,
    };
  }

  return {
    passed: true,
    message: 'Face perfectly aligned.',
  };
}
