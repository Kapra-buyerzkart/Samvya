import {
  createChallengeSession,
  generateRandomChallenge,
  getChallengeInstruction,
  processLivenessStep,
} from '../livenessChallenge';
import { DetectedFace } from '../types';

describe('Active Liveness Challenge State Machine', () => {
  const baseFace: DetectedFace = {
    bounds: { x: 350, y: 600, width: 400, height: 550 },
    pitchAngle: 0,
    yawAngle: 0,
    rollAngle: 0,
    leftEyeOpenProbability: 0.9,
    rightEyeOpenProbability: 0.9,
    smilingProbability: 0.1,
    frameWidth: 1080,
    frameHeight: 1920,
  };

  it('generates valid challenge type and user instructions', () => {
    const type = generateRandomChallenge();
    expect(['blink', 'turn_left', 'turn_right']).toContain(type);

    expect(getChallengeInstruction('blink')).toBe('Blink both eyes slowly');
    expect(getChallengeInstruction('turn_left')).toBe('Slowly turn your head to the left');
    expect(getChallengeInstruction('turn_right')).toBe('Slowly turn your head to the right');
  });

  describe('Blink Challenge Transitions', () => {
    it('progresses through waiting_for_neutral -> performing_action -> returning_to_neutral -> completed', () => {
      let session = createChallengeSession('blink');
      expect(session.step).toBe('waiting_for_neutral');

      // Step 1: Open eyes (neutral baseline)
      session = processLivenessStep(session, baseFace);
      expect(session.step).toBe('performing_action');

      // Step 2: Eyes closed (blink action)
      const closedEyesFace: DetectedFace = {
        ...baseFace,
        leftEyeOpenProbability: 0.1,
        rightEyeOpenProbability: 0.15,
      };
      session = processLivenessStep(session, closedEyesFace);
      expect(session.step).toBe('returning_to_neutral');
      expect(session.instruction).toBe('Now open your eyes');

      // Step 3: Eyes open again (return to neutral)
      session = processLivenessStep(session, baseFace);
      expect(session.step).toBe('completed');
      expect(session.timeToCompleteMs).toBeDefined();
      expect(session.timeToCompleteMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Head Turn Challenge Transitions', () => {
    it('progresses through turn_left action and return to center', () => {
      let session = createChallengeSession('turn_left');
      expect(session.step).toBe('waiting_for_neutral');

      // Step 1: Center neutral
      session = processLivenessStep(session, baseFace);
      expect(session.step).toBe('performing_action');

      // Step 2: Turn head left (> 20 deg)
      const turnedLeftFace: DetectedFace = {
        ...baseFace,
        yawAngle: 25,
      };
      session = processLivenessStep(session, turnedLeftFace);
      expect(session.step).toBe('returning_to_neutral');

      // Step 3: Return to center
      session = processLivenessStep(session, baseFace);
      expect(session.step).toBe('completed');
    });
  });
});
