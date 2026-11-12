export type ManualApprovalStatus = 'pending' | 'approved' | 'rejected';
export type AttendanceSource = 'device' | 'manual';

export interface DeviceAuditInfo {
  os: string;
  osVersion?: string;
  model?: string;
  appVersion: string;
}

export interface OriginalDeviceFix {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  errorReason?: string;
}

export interface ManualAuditMetadata {
  who: string;
  when: number;
  device: DeviceAuditInfo;
  reason: string;
  originalDeviceFix: OriginalDeviceFix | null;
  reviewedBy: string | null;
  reviewedAt: number | null;
  reviewNote: string | null;
}

export interface ManualGpsRecord {
  id: number;
  clientId: string;
  userId: string;
  latitude: number;
  longitude: number;
  reason: string;
  photoUri: string | null;
  photoQuality: number | null;
  status: ManualApprovalStatus;
  source: 'manual';
  audit: ManualAuditMetadata;
  createdAt: number;
  updatedAt: number;
}

export interface ManualGpsPolicyConfig {
  enabled: boolean;
  maxManualEntriesPerDay: number;
  requirePhoto: boolean;
  minReasonLength: number;
  maxReasonLength: number;
  requireSupervisorApproval: boolean;
  minCoordinatePrecisionDecimals: number;
}

export const DEFAULT_MANUAL_POLICY: ManualGpsPolicyConfig = {
  enabled: true,
  maxManualEntriesPerDay: 2,
  requirePhoto: false,
  minReasonLength: 10,
  maxReasonLength: 500,
  requireSupervisorApproval: true,
  minCoordinatePrecisionDecimals: 4,
};
