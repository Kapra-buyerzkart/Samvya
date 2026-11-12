export interface LocationBreadcrumb {
  clientId: string;
  sessionId: string;
  userId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number | null;
  heading: number | null;
  altitude: number | null;
  mocked: boolean;
  provider: string;
  isStationary: boolean;
  timestamp: number;
}

export type TrackingStatus = 'idle' | 'tracking' | 'paused' | 'stopped';

export interface TrackingSessionState {
  sessionId: string;
  userId: string;
  status: TrackingStatus;
  startTime: number;
  lastFix: LocationBreadcrumb | null;
  killSwitchActive: boolean;
  pointsRecorded: number;
}

export interface FilterResult {
  accepted: boolean;
  reason?: string;
  isStationary: boolean;
  calculatedSpeedMps?: number;
}

export interface TrackingBatteryConfig {
  accuracyThresholdMeters: number;
  maxSpeedMps: number;
  stationaryDisplacementMeters: number;
  stationarySpeedMps: number;
  timeIntervalMs: number;
  distanceIntervalMeters: number;
}

export const DEFAULT_TRACKING_CONFIG: TrackingBatteryConfig = {
  accuracyThresholdMeters: 50,
  maxSpeedMps: 41.6, // ~150 km/h sanity threshold for physical transport vs GPS jump
  stationaryDisplacementMeters: 10,
  stationarySpeedMps: 0.5,
  timeIntervalMs: 10000, // 10 seconds
  distanceIntervalMeters: 15, // 15 meters
};
