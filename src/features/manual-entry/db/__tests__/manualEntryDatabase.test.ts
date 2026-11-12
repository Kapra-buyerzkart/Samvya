import type * as SQLite from 'expo-sqlite';
import {
  CreateManualRequestInput,
  getTodayManualRequestCount,
  initManualRequestsTable,
  insertManualRequest,
  submitManualAttendanceWithQueue,
  updateManualRequestStatus,
} from '../manualEntryDatabase';

interface InMemoryManualRow {
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
}

interface InMemoryAttendanceQueueRow {
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
}

function createMockDatabase(): SQLite.SQLiteDatabase {
  const manualRows: InMemoryManualRow[] = [];
  const queueRows: InMemoryAttendanceQueueRow[] = [];
  let nextManualId = 1;
  let nextQueueId = 1;

  const mockDb = {
    execAsync: jest.fn(async () => {}),
    runAsync: jest.fn(async (sql: string, params: unknown[]) => {
      if (sql.includes('INSERT INTO manual_attendance_requests')) {
        const clientId = params[0] as string;
        const existing = manualRows.find((r) => r.client_id === clientId);

        if (existing) {
          existing.updated_at = params[8] as number;
          return { lastInsertRowId: existing.id, changes: 1 };
        }

        const newRow: InMemoryManualRow = {
          id: nextManualId++,
          client_id: clientId,
          user_id: params[1] as string,
          latitude: params[2] as number,
          longitude: params[3] as number,
          reason: params[4] as string,
          photo_uri: params[5] as string | null,
          photo_quality: params[6] as number | null,
          status: 'pending',
          source: 'manual',
          audit_json: params[7] as string,
          created_at: params[8] as number,
          updated_at: params[9] as number,
        };
        manualRows.push(newRow);
        return { lastInsertRowId: newRow.id, changes: 1 };
      }

      if (sql.includes('INSERT INTO attendance_queue')) {
        const clientId = params[0] as string;
        const newQueueRow: InMemoryAttendanceQueueRow = {
          id: nextQueueId++,
          client_id: clientId,
          user_id: params[1] as string,
          type: params[2] as string,
          latitude: params[3] as number,
          longitude: params[4] as number,
          accuracy: params[5] as number,
          mocked: params[6] as number,
          provider: params[7] as string,
          distance_to_site: params[8] as number,
          within_geofence: params[9] as number,
          timestamp: params[10] as number,
          sync_status: 'pending',
          retry_count: 0,
          last_error: null,
          created_at: params[11] as number,
        };
        queueRows.push(newQueueRow);
        return { lastInsertRowId: newQueueRow.id, changes: 1 };
      }

      if (sql.includes('UPDATE manual_attendance_requests')) {
        const status = params[0] as string;
        const auditJson = params[1] as string;
        const updatedAt = params[2] as number;
        const clientId = params[3] as string;

        const row = manualRows.find((r) => r.client_id === clientId);
        if (row) {
          row.status = status;
          row.audit_json = auditJson;
          row.updated_at = updatedAt;
        }
        return { lastInsertRowId: 0, changes: 1 };
      }

      return { lastInsertRowId: 0, changes: 0 };
    }),
    getFirstAsync: jest.fn(async (sql: string, params: unknown[]) => {
      if (sql.includes('COUNT(*) as count FROM manual_attendance_requests')) {
        const userId = params[0] as string;
        const minTime = params[1] as number;
        const matching = manualRows.filter(
          (r) => r.user_id === userId && r.created_at >= minTime,
        );
        return { count: matching.length };
      }
      return null;
    }),
    getAllAsync: jest.fn(async () => manualRows),
  } as unknown as SQLite.SQLiteDatabase;

  return mockDb;
}

describe('Manual Attendance Requests SQLite Database', () => {
  let db: SQLite.SQLiteDatabase;

  beforeEach(async () => {
    db = createMockDatabase();
    await initManualRequestsTable(db);
  });

  const sampleInput: CreateManualRequestInput = {
    clientId: 'man-req-1',
    userId: 'emp-202',
    latitude: 28.6139,
    longitude: 77.209,
    reason: 'Basement conference hall GPS attenuation.',
    photoUri: 'file:///cache/worksite.jpg',
    photoQuality: 0.6,
    audit: {
      who: 'emp-202',
      when: 1000000,
      device: {
        os: 'android',
        appVersion: '1.0.0',
      },
      reason: 'Basement conference hall GPS attenuation.',
      originalDeviceFix: null,
      reviewedBy: null,
      reviewedAt: null,
      reviewNote: null,
    },
  };

  it('inserts manual request with status pending and source manual', async () => {
    const record = await insertManualRequest(sampleInput, db);
    expect(record.id).toBe(1);
    expect(record.status).toBe('pending');
    expect(record.source).toBe('manual');
    expect(record.audit.who).toBe('emp-202');
  });

  it('submits manual entry with queue integration', async () => {
    const result = await submitManualAttendanceWithQueue(sampleInput, db);
    expect(result.manualRecord.status).toBe('pending');
    expect(result.manualRecord.source).toBe('manual');
    expect(result.queueId).toBe(1);
  });

  it('updates manual request approval status', async () => {
    await insertManualRequest(sampleInput, db);

    const updatedAudit = {
      ...sampleInput.audit,
      reviewedBy: 'mgr-50',
      reviewedAt: 1050000,
      reviewNote: 'Approved after verifying client badge scan.',
    };

    await updateManualRequestStatus('man-req-1', 'approved', updatedAudit, db);

    const count = await getTodayManualRequestCount('emp-202', 0, db);
    expect(count).toBe(1);
  });
});
