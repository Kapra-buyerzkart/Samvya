import { evaluateFaceCount, evaluateQualityGate } from '../qualityGate';
import { DetectedFace } from '../types';

describe('Face Quality Gate Domain Logic', () => {
  const baseFace: DetectedFace = {
    bounds: {
      x: 350,
      y: 600,
      width: 400,
      height: 550,
    },
    pitchAngle: 2,
    yawAngle: -1,
    rollAngle: 0,
    leftEyeOpenProbability: 0.85,
    rightEyeOpenProbability: 0.88,
    smilingProbability: 0.1,
    frameWidth: 1080,
    frameHeight: 1920,
  };

  describe('evaluateFaceCount', () => {
    it('rejects when zero faces are detected', () => {
      const result = evaluateFaceCount([]);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Position your face inside the guide oval');
    });

    it('rejects when multiple faces are detected', () => {
      const result = evaluateFaceCount([baseFace, { ...baseFace, bounds: { x: 50, y: 50, width: 200, height: 200 } }]);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Multiple faces detected');
    });

    it('accepts single face detection', () => {
      const result = evaluateFaceCount([baseFace]);
      expect(result.valid).toBe(true);
    });
  });

  describe('evaluateQualityGate', () => {
    it('passes for a well-centered, frontal face of adequate size', () => {
      const result = evaluateQualityGate(baseFace, 1080, 1920);
      expect(result.passed).toBe(true);
      expect(result.message).toBe('Face perfectly aligned.');
    });

    it('rejects when head is tilted beyond tolerance (pitch/yaw/roll > 15 deg)', () => {
      const tiltedFace = { ...baseFace, yawAngle: 22 };
      const result = evaluateQualityGate(tiltedFace, 1080, 1920);
      expect(result.passed).toBe(false);
      expect(result.message).toContain('Look straight at the camera');
      expect(result.reason).toContain('Pose angle out of bounds');
    });

    it('rejects when face is too small / too far away (< 18% of frame)', () => {
      const smallFace: DetectedFace = {
        ...baseFace,
        bounds: { x: 450, y: 800, width: 120, height: 160 }, // Area: 19,200 / ~2,000,000 = ~0.9%
      };
      const result = evaluateQualityGate(smallFace, 1080, 1920);
      expect(result.passed).toBe(false);
      expect(result.message).toBe('Move closer to the camera.');
    });

    it('rejects when face is positioned off-center', () => {
      const offCenterFace: DetectedFace = {
        ...baseFace,
        bounds: { x: 50, y: 600, width: 400, height: 550 }, // Left edge
      };
      const result = evaluateQualityGate(offCenterFace, 1080, 1920);
      expect(result.passed).toBe(false);
      expect(result.message).toBe('Center your face within the oval.');
    });
  });
});
