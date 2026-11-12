import { z } from 'zod';
import { DEFAULT_MANUAL_POLICY, ManualGpsPolicyConfig } from './types';

export function countDecimalPlaces(value: string | number): number {
  const str = typeof value === 'number' ? value.toString() : value.trim();
  const parts = str.split('.');
  if (parts.length < 2 || !parts[1]) {
    return 0;
  }
  return parts[1].length;
}

export function createManualGpsSchema(policy: ManualGpsPolicyConfig = DEFAULT_MANUAL_POLICY) {
  return z.object({
    latitude: z
      .string()
      .min(1, 'Latitude is required')
      .refine(
        (val) => {
          const num = Number(val);
          return !Number.isNaN(num) && num >= -90 && num <= 90;
        },
        { message: 'Latitude must be a valid number between -90.0 and +90.0' },
      )
      .refine(
        (val) => countDecimalPlaces(val) >= policy.minCoordinatePrecisionDecimals,
        {
          message: `Latitude must have at least ${policy.minCoordinatePrecisionDecimals} decimal places of precision`,
        },
      ),

    longitude: z
      .string()
      .min(1, 'Longitude is required')
      .refine(
        (val) => {
          const num = Number(val);
          return !Number.isNaN(num) && num >= -180 && num <= 180;
        },
        { message: 'Longitude must be a valid number between -180.0 and +180.0' },
      )
      .refine(
        (val) => countDecimalPlaces(val) >= policy.minCoordinatePrecisionDecimals,
        {
          message: `Longitude must have at least ${policy.minCoordinatePrecisionDecimals} decimal places of precision`,
        },
      ),

    reason: z
      .string()
      .trim()
      .min(
        policy.minReasonLength,
        `Reason must be at least ${policy.minReasonLength} characters explaining the GPS failure`,
      )
      .max(
        policy.maxReasonLength,
        `Reason cannot exceed ${policy.maxReasonLength} characters`,
      ),

    photoUri: policy.requirePhoto
      ? z
          .string({ message: 'Photo attachment is required by company policy' })
          .min(1, 'Photo attachment is required by company policy')
      : z.string().optional(),
  });
}

export function parseManualCoordinates(validated: z.infer<ReturnType<typeof createManualGpsSchema>>) {
  return {
    latitude: Number(validated.latitude),
    longitude: Number(validated.longitude),
    reason: validated.reason,
    photoUri: validated.photoUri,
  };
}

export const manualGpsValidationSchema = createManualGpsSchema();
export type ValidatedManualGpsInput = z.infer<typeof manualGpsValidationSchema>;
export type ManualGpsFormValues = ValidatedManualGpsInput;
