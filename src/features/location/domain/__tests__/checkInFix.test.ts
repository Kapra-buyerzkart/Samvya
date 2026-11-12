import {
  evaluateGeofence,
  getCheckInFix,
  haversineDistanceMeters,
  validateAccuracy,
  type GeofenceSite,
} from '../checkInFix';

describe('Check-In Fix & Geofence Logic', () => {
  const mockOfficeSite: GeofenceSite = {
    id: 'site_hq',
    name: 'HQ Campus',
    latitude: 28.6139,
    longitude: 77.209,
    radiusMeters: 100,
  };

  describe('validateAccuracy', () => {
    it('accepts accuracy within threshold', () => {
      expect(validateAccuracy(15, 50)).toBe(true);
      expect(validateAccuracy(50, 50)).toBe(true);
    });

    it('rejects accuracy exceeding threshold or invalid values', () => {
      expect(validateAccuracy(51, 50)).toBe(false);
      expect(validateAccuracy(150, 50)).toBe(false);
      expect(validateAccuracy(null, 50)).toBe(false);
      expect(validateAccuracy(undefined, 50)).toBe(false);
      expect(validateAccuracy(0, 50)).toBe(false);
      expect(validateAccuracy(-5, 50)).toBe(false);
    });
  });

  describe('haversineDistanceMeters & evaluateGeofence', () => {
    it('calculates zero distance for identical coordinates', () => {
      const distance = haversineDistanceMeters(28.6139, 77.209, 28.6139, 77.209);
      expect(distance).toBe(0);
    });

    it('evaluates position inside geofence correctly', () => {
      // 20 meters away
      const insideFix = { latitude: 28.61395, longitude: 77.20905 };
      const evaluation = evaluateGeofence(insideFix, mockOfficeSite);
      expect(evaluation.withinGeofence).toBe(true);
      expect(evaluation.distanceMeters).toBeLessThanOrEqual(mockOfficeSite.radiusMeters);
    });

    it('evaluates position outside geofence correctly', () => {
      // ~500 meters away
      const outsideFix = { latitude: 28.6189, longitude: 77.209 };
      const evaluation = evaluateGeofence(outsideFix, mockOfficeSite);
      expect(evaluation.withinGeofence).toBe(false);
      expect(evaluation.distanceMeters).toBeGreaterThan(mockOfficeSite.radiusMeters);
    });
  });

  describe('getCheckInFix', () => {
    it('acquires fix successfully on first attempt when accuracy is good', async () => {
      const mockLocationFetcher = jest.fn().mockResolvedValue({
        coords: {
          latitude: 28.6139,
          longitude: 77.209,
          accuracy: 12.5,
          mocked: false,
        },
        timestamp: 1700000000000,
      });

      const fix = await getCheckInFix({
        accuracyThresholdMeters: 50,
        maxRetries: 2,
        locationFetcher: mockLocationFetcher,
      });

      expect(fix.latitude).toBe(28.6139);
      expect(fix.longitude).toBe(77.209);
      expect(fix.accuracy).toBe(12.5);
      expect(fix.mocked).toBe(false);
      expect(mockLocationFetcher).toHaveBeenCalledTimes(1);
    });

    it('records Android mocked location flag accurately', async () => {
      const mockLocationFetcher = jest.fn().mockResolvedValue({
        coords: {
          latitude: 28.6139,
          longitude: 77.209,
          accuracy: 15,
          mocked: true,
        },
        timestamp: 1700000000000,
      });

      const fix = await getCheckInFix({
        locationFetcher: mockLocationFetcher,
      });

      expect(fix.mocked).toBe(true);
    });

    it('retries when first fix is inaccurate and succeeds when second is accurate', async () => {
      const mockLocationFetcher = jest
        .fn()
        .mockResolvedValueOnce({
          coords: {
            latitude: 28.6139,
            longitude: 77.209,
            accuracy: 120, // inaccurate (> 50m)
            mocked: false,
          },
          timestamp: 1700000000000,
        })
        .mockResolvedValueOnce({
          coords: {
            latitude: 28.6139,
            longitude: 77.209,
            accuracy: 18, // accurate (<= 50m)
            mocked: false,
          },
          timestamp: 1700000005000,
        });

      const onStatusChange = jest.fn();

      const fix = await getCheckInFix({
        accuracyThresholdMeters: 50,
        maxRetries: 2,
        locationFetcher: mockLocationFetcher,
        onStatusChange,
      });

      expect(fix.accuracy).toBe(18);
      expect(mockLocationFetcher).toHaveBeenCalledTimes(2);
      expect(onStatusChange).toHaveBeenCalledWith(
        expect.objectContaining({ state: 'retrying', attempt: 1 }),
      );
    });

    it('fails after exhausting all retries when accuracy threshold cannot be met', async () => {
      const mockLocationFetcher = jest.fn().mockResolvedValue({
        coords: {
          latitude: 28.6139,
          longitude: 77.209,
          accuracy: 95, // exceeds 50m threshold
          mocked: false,
        },
        timestamp: 1700000000000,
      });

      await expect(
        getCheckInFix({
          accuracyThresholdMeters: 50,
          maxRetries: 2,
          locationFetcher: mockLocationFetcher,
        }),
      ).rejects.toThrow(/exceeds allowed threshold/);

      expect(mockLocationFetcher).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
    });
  });
});

