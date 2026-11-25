import * as SQLite from 'expo-sqlite';
import type { SyncStatus } from '@/shared/types';

export type { SyncStatus };
export type AttendanceQueueType = 'check_in' | 'check_out';

export interface AttendanceQueueInput {
  clientId: string;
  userId: string;
  type: AttendanceQueueType;
  latitude: number;
  longitude: number;
  accuracy: number;
  mocked: boolean;
  provider: string;
  distanceToSite: number;
  withinGeofence: boolean;
  timestamp: number;
}

export interface AttendanceQueueItem extends AttendanceQueueInput {
  id: number;
  syncStatus: SyncStatus;
  retryCount: number;
  lastError: string | null;
  createdAt: number;
}

const DB_NAME = 'hrms_attendance.db';
let cachedDb: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (cachedDb) return cachedDb;
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await initAttendanceQueueDb(db);
  cachedDb = db;
  return db;
}

export async function initAttendanceQueueDb(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS attendance_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      accuracy REAL NOT NULL,
      mocked INTEGER NOT NULL,
      provider TEXT NOT NULL,
      distance_to_site REAL,
      within_geofence INTEGER NOT NULL,
      timestamp INTEGER NOT NULL,
      sync_status TEXT NOT NULL DEFAULT 'pending',
      retry_count INTEGER NOT NULL DEFAULT 0,
      last_error TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_attendance_queue_status_time 
      ON attendance_queue(sync_status, timestamp ASC);
  `);
}

export async function enqueueAttendanceEvent(
  input: AttendanceQueueInput,
  customDb?: SQLite.SQLiteDatabase,
): Promise<AttendanceQueueItem> {
  const db = customDb ?? (await getDatabase());
  const now = Date.now();

  const result = await db.runAsync(
    `INSERT INTO attendance_queue (
      client_id, user_id, type, latitude, longitude, accuracy,
      mocked, provider, distance_to_site, within_geofence,
      timestamp, sync_status, retry_count, last_error, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0, NULL, ?)
    ON CONFLICT(client_id) DO UPDATE SET
      retry_count = retry_count + 1,
      last_error = 'Re-enqueued duplicate event'`,
    [
      input.clientId,
      input.userId,
      input.type,
      input.latitude,
      input.longitude,
      input.accuracy,
      input.mocked ? 1 : 0,
      input.provider,
      input.distanceToSite,
      input.withinGeofence ? 1 : 0,
      input.timestamp,
      now,
    ],
  );

  return {
    ...input,
    id: result.lastInsertRowId,
    syncStatus: 'pending',
    retryCount: 0,
    lastError: null,
    createdAt: now,
  };
}

export async function getPendingAttendanceEvents(
  limit = 50,
  customDb?: SQLite.SQLiteDatabase,
): Promise<AttendanceQueueItem[]> {
  const db = customDb ?? (await getDatabase());
  const rows = await db.getAllAsync<{
    id: number;
    client_id: string;
    user_id: string;
    type: string;
    latitude: number;
    longitude: number;
    accuracy: number;
    mocked: number;
    provider: string;
    distance_to_site: number;
    within_geofence: number;
    timestamp: number;
    sync_status: string;
    retry_count: number;
    last_error: string | null;
    created_at: number;
  }>(
    `SELECT * FROM attendance_queue 
     WHERE sync_status IN ('pending', 'failed') AND retry_count < 5
     ORDER BY timestamp ASC, id ASC 
     LIMIT ?`,
    [limit],
  );

  return rows.map((row) => ({
    id: row.id,
    clientId: row.client_id,
    userId: row.user_id,
    type: row.type as AttendanceQueueType,
    latitude: row.latitude,
    longitude: row.longitude,
    accuracy: row.accuracy,
    mocked: Boolean(row.mocked),
    provider: row.provider,
    distanceToSite: row.distance_to_site,
    withinGeofence: Boolean(row.within_geofence),
    timestamp: row.timestamp,
    syncStatus: row.sync_status as SyncStatus,
    retryCount: row.retry_count,
    lastError: row.last_error,
    createdAt: row.created_at,
  }));
}

export async function markEventSynced(
  clientId: string,
  customDb?: SQLite.SQLiteDatabase,
): Promise<void> {
  const db = customDb ?? (await getDatabase());
  await db.runAsync(
    `UPDATE attendance_queue SET sync_status = 'synced', last_error = NULL WHERE client_id = ?`,
    [clientId],
  );
}

export async function markEventFailed(
  clientId: string,
  error: string,
  customDb?: SQLite.SQLiteDatabase,
): Promise<void> {
  const db = customDb ?? (await getDatabase());
  await db.runAsync(
    `UPDATE attendance_queue 
     SET sync_status = 'failed', retry_count = retry_count + 1, last_error = ? 
     WHERE client_id = ?`,
    [error, clientId],
  );
}

export interface ReplayReport {
  processed: number;
  succeeded: number;
  failed: number;
}

export async function replayAttendanceQueue(
  sendEvent: (event: AttendanceQueueItem) => Promise<boolean>,
  customDb?: SQLite.SQLiteDatabase,
): Promise<ReplayReport> {
  const items = await getPendingAttendanceEvents(50, customDb);
  let succeeded = 0;
  let failed = 0;

  for (const item of items) {
    try {
      const ok = await sendEvent(item);
      if (ok) {
        await markEventSynced(item.clientId, customDb);
        succeeded++;
      } else {
        await markEventFailed(item.clientId, 'Server rejected payload', customDb);
        failed++;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error during replay';
      await markEventFailed(item.clientId, msg, customDb);
      failed++;
    }
  }

  return {
    processed: items.length,
    succeeded,
    failed,
  };
}

