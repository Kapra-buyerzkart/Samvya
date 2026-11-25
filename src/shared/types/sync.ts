export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface SyncQueueItem {
  id: string;
  clientId: string;
  entityType: 'attendance' | 'location' | 'manual_request';
  payloadJson: string;
  retryCount: number;
  status: SyncStatus;
  lastAttemptAt?: number;
  errorMessage?: string;
  createdAt: number;
}
