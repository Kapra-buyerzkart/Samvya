export type ManualApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ManualLocationRequest {
  clientId: string;
  userId: string;
  latitude: number;
  longitude: number;
  reason: string;
  photoUri?: string;
  originalLatitude?: number;
  originalLongitude?: number;
  originalAccuracy?: number;
  status: ManualApprovalStatus;
  timestamp: number;
}
