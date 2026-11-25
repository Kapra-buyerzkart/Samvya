import * as SQLite from 'expo-sqlite';
import { ManualApprovalStatus, ManualAuditMetadata, ManualGpsRecord } from '../domain/types';
import { enqueueAttendanceEvent } from '@/features/attendance';

const DB_NAME = 'hrms_attendance.db';
let cachedDb: SQLite.SQLiteDatabase | null = null;

export async function getManualDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (cachedDb) return cachedDb;
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await initManualRequestsTable(db);
  cachedDb = db;
  return db;
}

export async function initManualRequestsTable(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS manual_attendance_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      reason TEXT NOT NULL,
      photo_uri TEXT,
      photo_quality REAL,
      status TEXT NOT NULL DEFAULT 'pending',
      source TEXT NOT NULL DEFAULT 'manual',
      audit_json TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_manual_status 
      ON manual_attendance_requests(status, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_manual_user_date 
      ON manual_attendance_requests(user_id, created_at);
  `);
}

export interface CreateManualRequestInput {
  clientId: string;
  userId: string;
  latitude: number;
  longitude: number;
  reason: string;
  photoUri?: string | null;
  photoQuality?: number | null;
  audit: ManualAuditMetadata;
}

export async function insertManualRequest(
  input: CreateManualRequestInput,
  customDb?: SQLite.SQLiteDatabase,
): Promise<ManualGpsRecord> {
  const db = customDb ?? (await getManualDatabase());
  const now = Date.now();

  const result = await db.runAsync(
    `INSERT INTO manual_attendance_requests (
      client_id, user_id, latitude, longitude, reason,
      photo_uri, photo_quality, status, source, audit_json,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'manual', ?, ?, ?)
    ON CONFLICT(client_id) DO UPDATE SET
      updated_at = ?`,
    [
      input.clientId,
      input.userId,
      input.latitude,
      input.longitude,
      input.reason,
      input.photoUri ?? null,
      input.photoQuality ?? null,
      JSON.stringify(input.audit),
      now,
      now,
      now,
    ],
  );

  return {
    id: result.lastInsertRowId,
    clientId: input.clientId,
    userId: input.userId,
    latitude: input.latitude,
    longitude: input.longitude,
    reason: input.reason,
    photoUri: input.photoUri ?? null,
    photoQuality: input.photoQuality ?? null,
    status: 'pending',
    source: 'manual',
    audit: input.audit,
    createdAt: now,
    updatedAt: now,
  };
}

export async function submitManualAttendanceWithQueue(
  input: CreateManualRequestInput,
  customDb?: SQLite.SQLiteDatabase,
): Promise<{ manualRecord: ManualGpsRecord; queueId: number }> {
  const db = customDb ?? (await getManualDatabase());

  // 1. Insert into manual requests table with audit trail
  const manualRecord = await insertManualRequest(input, db);

  // 2. Enqueue into attendance sync queue with source = 'manual'
  const queueItem = await enqueueAttendanceEvent(
    {
      clientId: input.clientId,
      userId: input.userId,
      type: 'check_in',
      latitude: input.latitude,
      longitude: input.longitude,
      accuracy: 0, // 0 signifies manually declared coordinates
      mocked: false,
      provider: 'manual_entry',
      distanceToSite: 0,
      withinGeofence: true,
      timestamp: input.audit.when,
    },
    db,
  );

  return {
    manualRecord,
    queueId: queueItem.id,
  };
}

export async function updateManualRequestStatus(
  clientId: string,
  status: ManualApprovalStatus,
  audit: ManualAuditMetadata,
  customDb?: SQLite.SQLiteDatabase,
): Promise<void> {
  const db = customDb ?? (await getManualDatabase());
  const now = Date.now();
  await db.runAsync(
    `UPDATE manual_attendance_requests 
     SET status = ?, audit_json = ?, updated_at = ?
     WHERE client_id = ?`,
    [status, JSON.stringify(audit), now, clientId],
  );
}

export async function getTodayManualRequestCount(
  userId: string,
  startOfDayMs: number,
  customDb?: SQLite.SQLiteDatabase,
): Promise<number> {
  const db = customDb ?? (await getManualDatabase());
  const row = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM manual_attendance_requests 
     WHERE user_id = ? AND created_at >= ?`,
    [userId, startOfDayMs],
  );
  return row?.count ?? 0;
}

export async function getManualRequests(
  limit = 20,
  customDb?: SQLite.SQLiteDatabase,
): Promise<ManualGpsRecord[]> {
  const db = customDb ?? (await getManualDatabase());
  const rows = await db.getAllAsync<{
    id: number;
    client_id: string;
    user_id: string;
    latitude: number;
    longitude: number;
    reason: string;
    photo_uri: string | null;
    photo_quality: number | null;
    status: string;
    source: string;
    audit_json: string;
    created_at: number;
    updated_at: number;
  }>(
    `SELECT * FROM manual_attendance_requests 
     ORDER BY created_at DESC 
     LIMIT ?`,
    [limit],
  );

  return rows.map((row) => ({
    id: row.id,
    clientId: row.client_id,
    userId: row.user_id,
    latitude: row.latitude,
    longitude: row.longitude,
    reason: row.reason,
    photoUri: row.photo_uri,
    photoQuality: row.photo_quality,
    status: row.status as ManualApprovalStatus,
    source: 'manual',
    audit: JSON.parse(row.audit_json) as ManualAuditMetadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}
