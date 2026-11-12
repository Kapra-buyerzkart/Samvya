export interface FaceBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetectedFace {
  bounds: FaceBounds;
  rollAngle: number;
  pitchAngle: number;
  yawAngle: number;
  leftEyeOpenProbability: number | null;
  rightEyeOpenProbability: number | null;
  smilingProbability: number | null;
  frameWidth: number;
  frameHeight: number;
}

export type LivenessChallengeType = 'blink' | 'turn_left' | 'turn_right';

export type LivenessChallengeStep =
  | 'waiting_for_neutral'
  | 'performing_action'
  | 'returning_to_neutral'
  | 'completed'
  | 'failed';

export interface QualityGateResult {
  passed: boolean;
  message: string;
  reason?: string;
}

export type ModelReadinessState =
  | 'ready'
  | 'downloading_model' // Play Services unbundled model first-run download
  | 'play_services_missing' // AOSP / de-Googled devices lacking Play Services
  | 'camera_denied'
  | 'unsupported';

export interface FaceAuditMetadata {
  challengeType: LivenessChallengeType;
  timeToCompleteMs: number;
  pitch: number;
  yaw: number;
  roll: number;
  timestamp: number;
}

export interface FaceVerificationPayload {
  photoUri: string;
  challengeType: LivenessChallengeType;
  challengeCompleted: boolean;
  timeToCompleteMs: number;
  audit: FaceAuditMetadata;
}

export interface FaceQualityConfig {
  maxAngleToleranceDegrees: number;
  minFaceAreaFraction: number;
  centerToleranceFraction: number;
  eyeClosedThreshold: number;
  eyeOpenThreshold: number;
  headTurnAngleThreshold: number;
}

export const DEFAULT_QUALITY_CONFIG: FaceQualityConfig = {
  maxAngleToleranceDegrees: 15,
  minFaceAreaFraction: 0.08, // Face must occupy at least 8% of 9:16 portrait viewport
  centerToleranceFraction: 0.25, // Within 25% of center
  eyeClosedThreshold: 0.25,
  eyeOpenThreshold: 0.7,
  headTurnAngleThreshold: 20,
};
