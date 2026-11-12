import {
  evaluateBreadcrumbFilter,
  isStationaryMovement,
  validateAccuracyThreshold,
  validateSpeedJump,
} from '../filters';
import { LocationBreadcrumb } from '../types';

describe('Location Battery & Sanity Filters', () => {
  describe('validateAccuracyThreshold', () => {
    it('accepts fixes with accuracy within the threshold', () => {
      expect(validateAccuracyThreshold(10, 50)).toBe(true);
      expect(validateAccuracyThreshold(50, 50)).toBe(true);
    });

    it('rejects fixes exceeding the threshold or invalid accuracy', () => {
      expect(validateAccuracyThreshold(51, 50)).toBe(false);
      expect(validateAccuracyThreshold(150, 50)).toBe(false);
      expect(validateAccuracyThreshold(null, 50)).toBe(false);
      expect(validateAccuracyThreshold(-5, 50)).toBe(false);
      expect(validateAccuracyThreshold(0, 50)).toBe(false);
    });
  });

  describe('validateSpeedJump', () => {
    it('accepts realistic walking movement', () => {
      const prev = { latitude: 28.6139, longitude: 77.209, timestamp: 1000000 };
      // ~14 meters in 10s = 1.4 m/s (walking pace)
      const next = { latitude: 28.614, longitude: 77.2091, timestamp: 1010000 };

      const result = validateSpeedJump(prev, next, 41.6);
      expect(result.valid).toBe(true);
      expect(result.speedMps).toBeLessThan(5);
    });

    it('accepts vehicular highway movement', () => {
      const prev = { latitude: 28.6139, longitude: 77.209, timestamp: 1000000 };
      // ~200 meters in 10s = 20 m/s (~72 km/h)
      const next = { latitude: 28.6157, longitude: 77.209, timestamp: 1010000 };

      const result = validateSpeedJump(prev, next, 41.6);
      expect(result.valid).toBe(true);
      expect(result.speedMps).toBeGreaterThan(15);
      expect(result.speedMps).toBeLessThan(41.6);
    });

    it('rejects impossible displacement (GPS jump / teleportation)', () => {
      const prev = { latitude: 28.6139, longitude: 77.209, timestamp: 1000000 };
      // ~10 km displacement in 5s (~2000 m/s = 7200 km/h)
      const next = { latitude: 28.7139, longitude: 77.209, timestamp: 1005000 };

      const result = validateSpeedJump(prev, next, 41.6);
      expect(result.valid).toBe(false);
      expect(result.speedMps).toBeGreaterThan(41.6);
    });
  });

  describe('isStationaryMovement', () => {
    it('identifies stationary state when displacement and speed are minimal', () => {
      expect(isStationaryMovement(5, 0.2)).toBe(true);
      expect(isStationaryMovement(10, 0.5)).toBe(true);
    });

    it('identifies active movement when displacement or speed exceeds threshold', () => {
      expect(isStationaryMovement(15, 0.2)).toBe(false);
      expect(isStationaryMovement(5, 1.5)).toBe(false);
    });
  });

  describe('evaluateBreadcrumbFilter', () => {
    const basePoint: Omit<LocationBreadcrumb, 'isStationary'> = {
      clientId: 'test-1',
      sessionId: 'sess-1',
      userId: 'user-1',
      latitude: 28.6139,
      longitude: 77.209,
      accuracy: 15,
      speed: 1.2,
      heading: 90,
      altitude: 200,
      mocked: false,
      provider: 'balanced',
      timestamp: 1000000,
    };

    it('accepts initial fix when accuracy is good', () => {
      const result = evaluateBreadcrumbFilter(basePoint, null);
      expect(result.accepted).toBe(true);
      expect(result.isStationary).toBe(false);
    });

    it('rejects fix with poor accuracy', () => {
      const badAccuracyPoint = { ...basePoint, accuracy: 85 };
      const result = evaluateBreadcrumbFilter(badAccuracyPoint, null);
      expect(result.accepted).toBe(false);
      expect(result.reason).toContain('exceeds allowed');
    });

    it('flags stationary fix when user is sitting at office desk', () => {
      const prev: LocationBreadcrumb = { ...basePoint, isStationary: false };
      const next = {
        ...basePoint,
        clientId: 'test-2',
        latitude: 28.613901, // ~1 meter away
        longitude: 77.209001,
        speed: 0.1,
        timestamp: 1010000,
      };

      const result = evaluateBreadcrumbFilter(next, prev);
      expect(result.accepted).toBe(true);
      expect(result.isStationary).toBe(true);
    });

    it('drops GPS jump between consecutive points', () => {
      const prev: LocationBreadcrumb = { ...basePoint, isStationary: false };
      const next = {
        ...basePoint,
        clientId: 'test-jump',
        latitude: 29.6139, // ~111 km away in 10s
        longitude: 77.209,
        timestamp: 1010000,
      };

      const result = evaluateBreadcrumbFilter(next, prev);
      expect(result.accepted).toBe(false);
      expect(result.reason).toContain('dropped as GPS jump');
    });
  });
});
