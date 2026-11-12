import type * as SQLite from 'expo-sqlite';
import {
  enqueueAttendanceEvent,
  getPendingAttendanceEvents,
  initAttendanceQueueDb,
  replayAttendanceQueue,
  type AttendanceQueueInput,
  type AttendanceQueueItem,
} from '../attendanceQueue';

interface InMemoryRow {
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
  const rows: InMemoryRow[] = [];
  let nextId = 1;

  const mockDb = {
    execAsync: jest.fn(async () => {}),
    runAsync: jest.fn(async (sql: string, params: unknown[]) => {
      if (sql.includes('INSERT INTO attendance_queue')) {
        const clientId = params[0] as string;
        const existing = rows.find((r) => r.client_id === clientId);

        if (existing) {
          existing.retry_count += 1;
          existing.last_error = 'Re-enqueued duplicate event';
          return { lastInsertRowId: existing.id, changes: 1 };
        }

        const newRow: InMemoryRow = {
          id: nextId++,
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
        rows.push(newRow);
        return { lastInsertRowId: newRow.id, changes: 1 };
      }

      if (sql.includes("SET sync_status = 'synced'")) {
        const clientId = params[0] as string;
        const target = rows.find((r) => r.client_id === clientId);
        if (target) {
          target.sync_status = 'synced';
          target.last_error = null;
        }
        return { lastInsertRowId: 0, changes: 1 };
      }

      if (sql.includes("SET sync_status = 'failed'")) {
        const error = params[0] as string;
        const clientId = params[1] as string;
        const target = rows.find((r) => r.client_id === clientId);
        if (target) {
          target.sync_status = 'failed';
          target.retry_count += 1;
          target.last_error = error;
        }
        return { lastInsertRowId: 0, changes: 1 };
      }

      return { lastInsertRowId: 0, changes: 0 };
    }),
    getAllAsync: jest.fn(async (sql: string, params: unknown[]) => {
      if (sql.includes('FROM attendance_queue')) {
        const limit = (params[0] as number) ?? 50;
        const pending = rows
          .filter((r) => ['pending', 'failed'].includes(r.sync_status) && r.retry_count < 5)
          .sort((a, b) => a.timestamp - b.timestamp || a.id - b.id)
          .slice(0, limit);
        return pending;
      }
      return [];
    }),
  } as unknown as SQLite.SQLiteDatabase;

  return mockDb;
}

describe('Attendance SQLite Offline Queue', () => {
  let db: SQLite.SQLiteDatabase;

  beforeEach(async () => {
    db = createMockDatabase();
    await initAttendanceQueueDb(db);
  });

  const sampleEvent1: AttendanceQueueInput = {
    clientId: 'uuid-1',
    userId: 'usr-1',
    type: 'check_in',
    latitude: 28.6139,
    longitude: 77.209,
    accuracy: 14.2,
    mocked: false,
    provider: 'balanced',
    distanceToSite: 25,
    withinGeofence: true,
    timestamp: 1000,
  };

  const sampleEvent2: AttendanceQueueInput = {
    clientId: 'uuid-2',
    userId: 'usr-1',
    type: 'check_out',
    latitude: 28.614,
    longitude: 77.2091,
    accuracy: 16.5,
    mocked: false,
    provider: 'balanced',
    distanceToSite: 30,
    withinGeofence: true,
    timestamp: 2000,
  };

  it('enqueues an event and retrieves it in pending status', async () => {
    const enqueued = await enqueueAttendanceEvent(sampleEvent1, db);
    expect(enqueued.clientId).toBe('uuid-1');
    expect(enqueued.syncStatus).toBe('pending');

    const pending = await getPendingAttendanceEvents(10, db);
    expect(pending).toHaveLength(1);
    expect(pending[0]?.clientId).toBe('uuid-1');
  });

  it('preserves idempotency on duplicate clientId submission', async () => {
    await enqueueAttendanceEvent(sampleEvent1, db);
    // Duplicate insertion with the exact same clientId
    await enqueueAttendanceEvent(sampleEvent1, db);

    const pending = await getPendingAttendanceEvents(10, db);
    expect(pending).toHaveLength(1);
    expect(pending[0]?.clientId).toBe('uuid-1');
    expect(pending[0]?.retryCount).toBe(1);
  });

  it('replays pending events in strictly chronological FIFO order', async () => {
    // Insert event 2 (timestamp 2000) then event 1 (timestamp 1000)
    await enqueueAttendanceEvent(sampleEvent2, db);
    await enqueueAttendanceEvent(sampleEvent1, db);

    const replayedIds: string[] = [];
    const report = await replayAttendanceQueue(async (event: AttendanceQueueItem) => {
      replayedIds.push(event.clientId);
      return true;
    }, db);

    expect(report.processed).toBe(2);
    expect(report.succeeded).toBe(2);
    // Event 1 must be replayed BEFORE Event 2 because 1000 < 2000
    expect(replayedIds).toEqual(['uuid-1', 'uuid-2']);

    const remaining = await getPendingAttendanceEvents(10, db);
    expect(remaining).toHaveLength(0);
  });

  it('marks failed events and increments retry count on rejection', async () => {
    await enqueueAttendanceEvent(sampleEvent1, db);

    const report = await replayAttendanceQueue(async () => {
      return false; // Server rejects
    }, db);

    expect(report.processed).toBe(1);
    expect(report.failed).toBe(1);

    const pending = await getPendingAttendanceEvents(10, db);
    expect(pending).toHaveLength(1);
    expect(pending[0]?.syncStatus).toBe('failed');
    expect(pending[0]?.retryCount).toBe(1);
  });
});
