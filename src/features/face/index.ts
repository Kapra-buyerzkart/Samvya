export type LivenessChallengeType = 'blink' | 'turn_left' | 'turn_right';

export interface FaceDetectionMetrics {
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  yawAngle: number;
  pitchAngle: number;
  rollAngle: number;
  leftEyeOpenProbability?: number;
  rightEyeOpenProbability?: number;
  smilingProbability?: number;
  trackingId?: number;
}

export interface FaceDetectionPort {
  evaluateQuality(face: FaceDetectionMetrics, frameSize: { width: number; height: number }): boolean;
}

