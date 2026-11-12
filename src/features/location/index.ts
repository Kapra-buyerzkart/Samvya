export interface LocationBreadcrumb {
  clientId: string;
  sessionId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  timestamp: number;
  mocked: boolean;
  provider: string;
}

export type LocationPermissionStatus =
  | 'idle'
  | 'requesting_foreground'
  | 'requesting_background'
  | 'granted_foreground'
  | 'granted_background'
  | 'denied'
  | 'blocked'
  | 'approximate_only';

