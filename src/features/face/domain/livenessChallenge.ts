import {
  DEFAULT_QUALITY_CONFIG,
  DetectedFace,
  FaceQualityConfig,
  LivenessChallengeStep,
  LivenessChallengeType,
} from './types';

export interface LivenessChallengeSession {
  type: LivenessChallengeType;
  step: LivenessChallengeStep;
  startTime: number;
  completedTime?: number;
  timeToCompleteMs?: number;
  instruction: string;
}

export function generateRandomChallenge(): LivenessChallengeType {
  const challenges: LivenessChallengeType[] = ['blink', 'turn_left', 'turn_right'];
  const index = Math.floor(Math.random() * challenges.length);
  return challenges[index] ?? 'blink';
}

export function getChallengeInstruction(type: LivenessChallengeType): string {
  switch (type) {
    case 'blink':
      return 'Blink both eyes slowly';
    case 'turn_left':
      return 'Slowly turn your head to the left';
    case 'turn_right':
      return 'Slowly turn your head to the right';
  }
}

export function createChallengeSession(
  type: LivenessChallengeType = generateRandomChallenge(),
): LivenessChallengeSession {
  return {
    type,
    step: 'waiting_for_neutral',
    startTime: Date.now(),
    instruction: getChallengeInstruction(type),
  };
}

export function processLivenessStep(
  session: LivenessChallengeSession,
  face: DetectedFace,
  config: FaceQualityConfig = DEFAULT_QUALITY_CONFIG,
): LivenessChallengeSession {
  if (session.step === 'completed' || session.step === 'failed') {
    return session;
  }

  const now = Date.now();

  // 1. Blink Challenge
  if (session.type === 'blink') {
    const leftEye = face.leftEyeOpenProbability ?? 0.5;
    const rightEye = face.rightEyeOpenProbability ?? 0.5;

    if (session.step === 'waiting_for_neutral') {
      // Step 1: Neutral baseline: both eyes open
      if (leftEye >= config.eyeOpenThreshold && rightEye >= config.eyeOpenThreshold) {
        return {
          ...session,
          step: 'performing_action',
        };
      }
      return session;
    }

    if (session.step === 'performing_action') {
      // Step 2: Eyes closed
      if (leftEye <= config.eyeClosedThreshold && rightEye <= config.eyeClosedThreshold) {
        return {
          ...session,
          step: 'returning_to_neutral',
          instruction: 'Now open your eyes',
        };
      }
      return session;
    }

    if (session.step === 'returning_to_neutral') {
      // Step 3: Eyes open again -> completed!
      if (leftEye >= config.eyeOpenThreshold && rightEye >= config.eyeOpenThreshold) {
        return {
          ...session,
          step: 'completed',
          completedTime: now,
          timeToCompleteMs: now - session.startTime,
          instruction: 'Liveness verified',
        };
      }
      return session;
    }
  }

  // 2. Head Turn Left Challenge
  if (session.type === 'turn_left') {
    if (session.step === 'waiting_for_neutral') {
      if (Math.abs(face.yawAngle) <= 10) {
        return { ...session, step: 'performing_action' };
      }
      return session;
    }

    if (session.step === 'performing_action') {
      // Positive or negative depending on front camera mirror
      if (Math.abs(face.yawAngle) >= config.headTurnAngleThreshold) {
        return {
          ...session,
          step: 'returning_to_neutral',
          instruction: 'Now look back at the camera',
        };
      }
      return session;
    }

    if (session.step === 'returning_to_neutral') {
      if (Math.abs(face.yawAngle) <= 10) {
        return {
          ...session,
          step: 'completed',
          completedTime: now,
          timeToCompleteMs: now - session.startTime,
          instruction: 'Liveness verified',
        };
      }
      return session;
    }
  }

  // 3. Head Turn Right Challenge
  if (session.type === 'turn_right') {
    if (session.step === 'waiting_for_neutral') {
      if (Math.abs(face.yawAngle) <= 10) {
        return { ...session, step: 'performing_action' };
      }
      return session;
    }

    if (session.step === 'performing_action') {
      if (Math.abs(face.yawAngle) >= config.headTurnAngleThreshold) {
        return {
          ...session,
          step: 'returning_to_neutral',
          instruction: 'Now look back at the camera',
        };
      }
      return session;
    }

    if (session.step === 'returning_to_neutral') {
      if (Math.abs(face.yawAngle) <= 10) {
        return {
          ...session,
          step: 'completed',
          completedTime: now,
          timeToCompleteMs: now - session.startTime,
          instruction: 'Liveness verified',
        };
      }
      return session;
    }
  }

  return session;
}
