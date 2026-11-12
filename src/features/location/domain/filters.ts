import { haversineDistanceMeters } from './checkInFix';
import {
  DEFAULT_TRACKING_CONFIG,
  FilterResult,
  LocationBreadcrumb,
  TrackingBatteryConfig,
} from './types';

export function validateAccuracyThreshold(
  accuracy: number | null | undefined,
  thresholdMeters: number = DEFAULT_TRACKING_CONFIG.accuracyThresholdMeters,
): boolean {
  if (accuracy == null || Number.isNaN(accuracy) || accuracy <= 0) {
    return false;
  }
  return accuracy <= thresholdMeters;
}

export function calculateSpeedMps(
  prev: { latitude: number; longitude: number; timestamp: number },
  next: { latitude: number; longitude: number; timestamp: number },
): { distanceMeters: number; timeDeltaSeconds: number; speedMps: number } {
  const distanceMeters = haversineDistanceMeters(
    prev.latitude,
    prev.longitude,
    next.latitude,
    next.longitude,
  );

  const timeDeltaSeconds = Math.max(0.1, (next.timestamp - prev.timestamp) / 1000);
  const speedMps = distanceMeters / timeDeltaSeconds;

  return { distanceMeters, timeDeltaSeconds, speedMps };
}

export function validateSpeedJump(
  prev: { latitude: number; longitude: number; timestamp: number },
  next: { latitude: number; longitude: number; timestamp: number },
  maxSpeedMps: number = DEFAULT_TRACKING_CONFIG.maxSpeedMps,
): { valid: boolean; speedMps: number; distanceMeters: number } {
  const { distanceMeters, speedMps } = calculateSpeedMps(prev, next);

  // If displacement implies speed exceeding maximum physical vehicle speed, flag as jump
  return {
    valid: speedMps <= maxSpeedMps,
    speedMps,
    distanceMeters,
  };
}

export function isStationaryMovement(
  distanceMeters: number,
  speedMps: number,
  config: TrackingBatteryConfig = DEFAULT_TRACKING_CONFIG,
): boolean {
  return (
    distanceMeters <= config.stationaryDisplacementMeters &&
    speedMps <= config.stationarySpeedMps
  );
}

export function evaluateBreadcrumbFilter(
  nextPoint: Omit<LocationBreadcrumb, 'isStationary'>,
  previousPoint: LocationBreadcrumb | null,
  config: TrackingBatteryConfig = DEFAULT_TRACKING_CONFIG,
): FilterResult {
  if (!validateAccuracyThreshold(nextPoint.accuracy, config.accuracyThresholdMeters)) {
    return {
      accepted: false,
      reason: `Accuracy ${Math.round(nextPoint.accuracy)}m exceeds allowed ${config.accuracyThresholdMeters}m threshold`,
      isStationary: false,
    };
  }

  if (!previousPoint) {
    // First fix of a session is always accepted once accuracy passes
    return {
      accepted: true,
      isStationary: false,
    };
  }

  const { valid, speedMps, distanceMeters } = validateSpeedJump(
    previousPoint,
    nextPoint,
    config.maxSpeedMps,
  );

  if (!valid) {
    return {
      accepted: false,
      reason: `Unrealistic displacement ${distanceMeters}m in ${(nextPoint.timestamp - previousPoint.timestamp) / 1000}s (${Math.round(speedMps * 3.6)} km/h) dropped as GPS jump`,
      isStationary: false,
      calculatedSpeedMps: speedMps,
    };
  }

  const isStationary = isStationaryMovement(
    distanceMeters,
    nextPoint.speed ?? speedMps,
    config,
  );

  return {
    accepted: true,
    isStationary,
    calculatedSpeedMps: speedMps,
  };
}
