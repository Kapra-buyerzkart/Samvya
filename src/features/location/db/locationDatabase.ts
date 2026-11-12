import * as SQLite from 'expo-sqlite';
import { LocationBreadcrumb } from '../domain/types';

export type BreadcrumbSyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface BreadcrumbQueueItem extends LocationBreadcrumb {
  id: number;
  syncStatus: BreadcrumbSyncStatus;
  retryCount: number;
  lastError: string | null;
  createdAt: number;
}

const DB_NAME = 'hrms_attendance.db';
let cachedDb: SQLite.SQLiteDatabase | null = null;

export async function getLocationDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (cachedDb) return cachedDb;
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await initBreadcrumbsTable(db);
  cachedDb = db;
  return db;
}

export async function initBreadcrumbsTable(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS location_breadcrumbs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id TEXT UNIQUE NOT NULL,
      session_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      accuracy REAL NOT NULL,
      speed REAL,
      heading REAL,
      altitude REAL,
      mocked INTEGER NOT NULL,
      provider TEXT NOT NULL,
      is_stationary INTEGER NOT NULL,
      timestamp INTEGER NOT NULL,
      sync_status TEXT NOT NULL DEFAULT 'pending',
      retry_count INTEGER NOT NULL DEFAULT 0,
      last_error TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_breadcrumbs_sync_time 
      ON location_breadcrumbs(sync_status, timestamp ASC);
    CREATE INDEX IF NOT EXISTS idx_breadcrumbs_session 
      ON location_breadcrumbs(session_id);
  `);
}

export async function insertBreadcrumb(
  point: LocationBreadcrumb,
  customDb?: SQLite.SQLiteDatabase,
): Promise<number> {
  const db = customDb ?? (await getLocationDatabase());
  const now = Date.now();

  const result = await db.runAsync(
    `INSERT INTO location_breadcrumbs (
      client_id, session_id, user_id, latitude, longitude,
      accuracy, speed, heading, altitude, mocked,
      provider, is_stationary, timestamp, sync_status,
      retry_count, last_error, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0, NULL, ?)
    ON CONFLICT(client_id) DO NOTHING`,
    [
      point.clientId,
      point.sessionId,
      point.userId,
      point.latitude,
      point.longitude,
      point.accuracy,
      point.speed ?? null,
      point.heading ?? null,
      point.altitude ?? null,
      point.mocked ? 1 : 0,
      point.provider,
      point.isStationary ? 1 : 0,
      point.timestamp,
      now,
    ],
  );

  return result.lastInsertRowId;
}

export async function getPendingBreadcrumbs(
  limit = 25,
  customDb?: SQLite.SQLiteDatabase,
): Promise<BreadcrumbQueueItem[]> {
  const db = customDb ?? (await getLocationDatabase());
  const rows = await db.getAllAsync<{
    id: number;
    client_id: string;
    session_id: string;
    user_id: string;
    latitude: number;
    longitude: number;
    accuracy: number;
    speed: number | null;
    heading: number | null;
    altitude: number | null;
    mocked: number;
    provider: string;
    is_stationary: number;
    timestamp: number;
    sync_status: string;
    retry_count: number;
    last_error: string | null;
    created_at: number;
  }>(
    `SELECT * FROM location_breadcrumbs 
     WHERE sync_status IN ('pending', 'failed') AND retry_count < 5
     ORDER BY timestamp ASC, id ASC 
     LIMIT ?`,
    [limit],
  );

  return rows.map((row) => ({
    id: row.id,
    clientId: row.client_id,
    sessionId: row.session_id,
    userId: row.user_id,
    latitude: row.latitude,
    longitude: row.longitude,
    accuracy: row.accuracy,
    speed: row.speed,
    heading: row.heading,
    altitude: row.altitude,
    mocked: Boolean(row.mocked),
    provider: row.provider,
    isStationary: Boolean(row.is_stationary),
    timestamp: row.timestamp,
    syncStatus: row.sync_status as BreadcrumbSyncStatus,
    retryCount: row.retry_count,
    lastError: row.last_error,
    createdAt: row.created_at,
  }));
}

export async function markBreadcrumbsSynced(
  clientIds: string[],
  customDb?: SQLite.SQLiteDatabase,
): Promise<void> {
  if (clientIds.length === 0) return;
  const db = customDb ?? (await getLocationDatabase());
  const placeholders = clientIds.map(() => '?').join(',');
  await db.runAsync(
    `UPDATE location_breadcrumbs 
     SET sync_status = 'synced', last_error = NULL 
     WHERE client_id IN (${placeholders})`,
    clientIds,
  );
}

export async function markBreadcrumbFailed(
  clientId: string,
  error: string,
  customDb?: SQLite.SQLiteDatabase,
): Promise<void> {
  const db = customDb ?? (await getLocationDatabase());
  await db.runAsync(
    `UPDATE location_breadcrumbs 
     SET sync_status = 'failed', retry_count = retry_count + 1, last_error = ? 
     WHERE client_id = ?`,
    [error, clientId],
  );
}

export async function getUnsyncedBreadcrumbsCount(
  customDb?: SQLite.SQLiteDatabase,
): Promise<number> {
  const db = customDb ?? (await getLocationDatabase());
  const row = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM location_breadcrumbs WHERE sync_status != 'synced'`,
  );
  return row?.count ?? 0;
}
