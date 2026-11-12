import {
  countDecimalPlaces,
  createManualGpsSchema,
  manualGpsValidationSchema,
  parseManualCoordinates,
} from '../validation';

describe('Manual GPS Zod Validation Schema', () => {
  const validPayload = {
    latitude: '28.613900',
    longitude: '77.209000',
    reason: 'Hardware GPS fix failed inside basement parking facility level B2.',
  };

  describe('countDecimalPlaces', () => {
    it('accurately counts decimal precision', () => {
      expect(countDecimalPlaces('28.6139')).toBe(4);
      expect(countDecimalPlaces('77.209000')).toBe(6);
      expect(countDecimalPlaces('28.6')).toBe(1);
      expect(countDecimalPlaces('28')).toBe(0);
      expect(countDecimalPlaces(28.6139)).toBe(4);
    });
  });

  describe('Schema Validation', () => {
    it('accepts valid coordinates, precision, and justification', () => {
      const parsed = manualGpsValidationSchema.parse(validPayload);
      const coords = parseManualCoordinates(parsed);
      expect(coords.latitude).toBe(28.6139);
      expect(coords.longitude).toBe(77.209);
      expect(parsed.reason).toBe(validPayload.reason);
    });

    it('rejects latitude out of range (> 90 or < -90)', () => {
      expect(() =>
        manualGpsValidationSchema.parse({ ...validPayload, latitude: '91.0000' }),
      ).toThrow('Latitude must be a valid number between -90.0 and +90.0');

      expect(() =>
        manualGpsValidationSchema.parse({ ...validPayload, latitude: '-95.5000' }),
      ).toThrow('Latitude must be a valid number between -90.0 and +90.0');
    });

    it('rejects longitude out of range (> 180 or < -180)', () => {
      expect(() =>
        manualGpsValidationSchema.parse({ ...validPayload, longitude: '181.0000' }),
      ).toThrow('Longitude must be a valid number between -180.0 and +180.0');

      expect(() =>
        manualGpsValidationSchema.parse({ ...validPayload, longitude: '-185.0000' }),
      ).toThrow('Longitude must be a valid number between -180.0 and +180.0');
    });

    it('rejects coordinates with insufficient precision (< 4 decimals)', () => {
      expect(() =>
        manualGpsValidationSchema.parse({ ...validPayload, latitude: '28.61' }),
      ).toThrow('Latitude must have at least 4 decimal places of precision');

      expect(() =>
        manualGpsValidationSchema.parse({ ...validPayload, longitude: '77.2' }),
      ).toThrow('Longitude must have at least 4 decimal places of precision');
    });

    it('rejects justification reason shorter than 10 characters', () => {
      expect(() =>
        manualGpsValidationSchema.parse({ ...validPayload, reason: 'No GPS' }),
      ).toThrow('Reason must be at least 10 characters');
    });

    it('rejects justification reason exceeding 500 characters', () => {
      const longReason = 'A'.repeat(501);
      expect(() =>
        manualGpsValidationSchema.parse({ ...validPayload, reason: longReason }),
      ).toThrow('Reason cannot exceed 500 characters');
    });

    it('enforces required photo when policy specifies requirePhoto: true', () => {
      const strictSchema = createManualGpsSchema({
        enabled: true,
        maxManualEntriesPerDay: 2,
        requirePhoto: true,
        minReasonLength: 10,
        maxReasonLength: 500,
        requireSupervisorApproval: true,
        minCoordinatePrecisionDecimals: 4,
      });

      expect(() => strictSchema.parse(validPayload)).toThrow(
        'Photo attachment is required by company policy',
      );

      const withPhoto = strictSchema.parse({
        ...validPayload,
        photoUri: 'file:///data/cache/proof.jpg',
      });
      expect(withPhoto.photoUri).toBe('file:///data/cache/proof.jpg');
    });
  });
});
