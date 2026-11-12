import * as Location from 'expo-location';

export interface CheckInLocationFix {
  latitude: number;
  longitude: number;
  accuracy: number;
  mocked: boolean;
  provider: string;
  timestamp: number;
}

export interface GeofenceSite {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export interface GeofenceEvaluation {
  withinGeofence: boolean;
  distanceMeters: number;
  siteId: string;
}

export const DEFAULT_ACCURACY_THRESHOLD_METERS = 50;
export const DEFAULT_TIMEOUT_MS = 10000;
export const DEFAULT_MAX_RETRIES = 2;

export function haversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const deltaP = ((lat2 - lat1) * Math.PI) / 180;
  const deltaL = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaP / 2) * Math.sin(deltaP / 2) +
    Math.cos(p1) * Math.cos(p2) * Math.sin(deltaL / 2) * Math.sin(deltaL / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export function evaluateGeofence(
  fix: { latitude: number; longitude: number },
  site: GeofenceSite,
): GeofenceEvaluation {
  const distance = haversineDistanceMeters(
    fix.latitude,
    fix.longitude,
    site.latitude,
    site.longitude,
  );
  return {
    withinGeofence: distance <= site.radiusMeters,
    distanceMeters: distance,
    siteId: site.id,
  };
}

export function validateAccuracy(
  accuracy: number | null | undefined,
  thresholdMeters: number = DEFAULT_ACCURACY_THRESHOLD_METERS,
): boolean {
  if (accuracy == null || Number.isNaN(accuracy) || accuracy <= 0) {
    return false;
  }
  return accuracy <= thresholdMeters;
}

export interface GetCheckInFixOptions {
  accuracyThresholdMeters?: number;
  timeoutMs?: number;
  maxRetries?: number;
  onStatusChange?: (
    status:
      | { state: 'acquiring'; attempt: number }
      | { state: 'evaluating'; fix: CheckInLocationFix }
      | { state: 'retrying'; attempt: number; reason: string },
  ) => void;
  // Pluggable location fetcher for dependency injection in tests
  locationFetcher?: () => Promise<Location.LocationObject>;
}

export async function getCheckInFix(
  options: GetCheckInFixOptions = {},
): Promise<CheckInLocationFix> {
  const threshold = options.accuracyThresholdMeters ?? DEFAULT_ACCURACY_THRESHOLD_METERS;
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;

  let lastErrorReason = 'Unknown failure';
  let lastCandidateFix: CheckInLocationFix | null = null;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    options.onStatusChange?.({ state: 'acquiring', attempt });

    try {
      const position = options.locationFetcher
        ? await options.locationFetcher()
        : await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

      const fix: CheckInLocationFix = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy ?? 999,
        mocked: Boolean((position.coords as { mocked?: boolean }).mocked),
        provider: 'balanced',
        timestamp: position.timestamp,
      };

      lastCandidateFix = fix;
      options.onStatusChange?.({ state: 'evaluating', fix });

      if (validateAccuracy(fix.accuracy, threshold)) {
        return fix;
      }

      lastErrorReason = `Accuracy ${Math.round(fix.accuracy)}m exceeds allowed threshold ${threshold}m`;
    } catch (err) {
      lastErrorReason = err instanceof Error ? err.message : 'Failed to acquire GPS fix';
    }

    if (attempt <= maxRetries) {
      options.onStatusChange?.({
        state: 'retrying',
        attempt,
        reason: lastErrorReason,
      });
    }
  }

  if (lastCandidateFix) {
    throw new Error(
      `${lastErrorReason}. Last fix accuracy was ${Math.round(lastCandidateFix.accuracy)}m.`,
    );
  }

  throw new Error(lastErrorReason);
}

