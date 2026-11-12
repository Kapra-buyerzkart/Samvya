export type AttendanceType = 'check_in' | 'check_out';

export type AttendanceSource = 'device' | 'manual';

export interface OfficeSite {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export interface AttendanceRecord {
  id: string;
  clientId: string;
  userId: string;
  type: AttendanceType;
  timestamp: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  source: AttendanceSource;
  mocked: boolean;
  synced: boolean;
}

