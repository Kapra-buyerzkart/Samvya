import type * as SQLite from 'expo-sqlite';
import {
  getPendingBreadcrumbs,
  initBreadcrumbsTable,
  insertBreadcrumb,
  markBreadcrumbFailed,
  markBreadcrumbsSynced,
} from '../locationDatabase';
import { LocationBreadcrumb } from '../../domain/types';

interface InMemoryBreadcrumbRow {
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
}

function createMockDatabase(): SQLite.SQLiteDatabase {
  const rows: InMemoryBreadcrumbRow[] = [];
  let nextId = 1;

  const mockDb = {
    execAsync: jest.fn(async () => {}),
    runAsync: jest.fn(async (sql: string, params: unknown[]) => {
      if (sql.includes('INSERT INTO location_breadcrumbs')) {
        const clientId = params[0] as string;
        const existing = rows.find((r) => r.client_id === clientId);

        if (existing) {
          // ON CONFLICT DO NOTHING
          return { lastInsertRowId: existing.id, changes: 0 };
        }

        const newRow: InMemoryBreadcrumbRow = {
          id: nextId++,
          client_id: clientId,
          session_id: params[1] as string,
          user_id: params[2] as string,
          latitude: params[3] as number,
          longitude: params[4] as number,
          accuracy: params[5] as number,
          speed: params[6] as number | null,
          heading: params[7] as number | null,
          altitude: params[8] as number | null,
          mocked: params[9] as number,
          provider: params[10] as string,
          is_stationary: params[11] as number,
          timestamp: params[12] as number,
          sync_status: 'pending',
          retry_count: 0,
          last_error: null,
          created_at: params[13] as number,
        };
        rows.push(newRow);
        return { lastInsertRowId: newRow.id, changes: 1 };
      }

      if (sql.includes('SET sync_status = \'synced\'')) {
        const clientIds = params as string[];
        for (const cid of clientIds) {
          const row = rows.find((r) => r.client_id === cid);
          if (row) {
            row.sync_status = 'synced';
            row.last_error = null;
          }
        }
        return { lastInsertRowId: 0, changes: clientIds.length };
      }

      if (sql.includes('SET sync_status = \'failed\'')) {
        const error = params[0] as string;
        const clientId = params[1] as string;
        const row = rows.find((r) => r.client_id === clientId);
        if (row) {
          row.sync_status = 'failed';
          row.retry_count += 1;
          row.last_error = error;
        }
        return { lastInsertRowId: 0, changes: 1 };
      }

      return { lastInsertRowId: 0, changes: 0 };
    }),
    getAllAsync: jest.fn(async (_sql: string, params: unknown[]) => {
      const limit = (params[0] as number) ?? 25;
      const filtered = rows
        .filter((r) => (r.sync_status === 'pending' || r.sync_status === 'failed') && r.retry_count < 5)
        .sort((a, b) => a.timestamp - b.timestamp);
      return filtered.slice(0, limit);
    }),
    getFirstAsync: jest.fn(async () => {
      const unsynced = rows.filter((r) => r.sync_status !== 'synced').length;
      return { count: unsynced };
    }),
  } as unknown as SQLite.SQLiteDatabase;

  return mockDb;
}

describe('LocationBreadcrumbs SQLite Database', () => {
  let db: SQLite.SQLiteDatabase;

  beforeEach(async () => {
    db = createMockDatabase();
    await initBreadcrumbsTable(db);
  });

  const sampleBreadcrumb: LocationBreadcrumb = {
    clientId: 'crumb-1',
    sessionId: 'sess-1',
    userId: 'user-1',
    latitude: 28.6139,
    longitude: 77.209,
    accuracy: 12,
    speed: 1.5,
    heading: 180,
    altitude: 215,
    mocked: false,
    provider: 'balanced',
    isStationary: false,
    timestamp: 1000,
  };

  it('inserts breadcrumb record into SQLite', async () => {
    const id = await insertBreadcrumb(sampleBreadcrumb, db);
    expect(id).toBe(1);

    const pending = await getPendingBreadcrumbs(10, db);
    expect(pending).toHaveLength(1);
    expect(pending[0]?.clientId).toBe('crumb-1');
    expect(pending[0]?.syncStatus).toBe('pending');
  });

  it('enforces idempotency on duplicate client_id (DO NOTHING)', async () => {
    await insertBreadcrumb(sampleBreadcrumb, db);
    // Duplicate insertion
    await insertBreadcrumb(sampleBreadcrumb, db);

    const pending = await getPendingBreadcrumbs(10, db);
    expect(pending).toHaveLength(1);
  });

  it('marks batched breadcrumbs as synced', async () => {
    await insertBreadcrumb(sampleBreadcrumb, db);
    await insertBreadcrumb({ ...sampleBreadcrumb, clientId: 'crumb-2', timestamp: 1010 }, db);

    let pending = await getPendingBreadcrumbs(10, db);
    expect(pending).toHaveLength(2);

    await markBreadcrumbsSynced(['crumb-1', 'crumb-2'], db);

    pending = await getPendingBreadcrumbs(10, db);
    expect(pending).toHaveLength(0);
  });

  it('records retry count and error message on sync failure', async () => {
    await insertBreadcrumb(sampleBreadcrumb, db);
    await markBreadcrumbFailed('crumb-1', 'Gateway Timeout 504', db);

    const pending = await getPendingBreadcrumbs(10, db);
    expect(pending).toHaveLength(1);
    expect(pending[0]?.syncStatus).toBe('failed');
    expect(pending[0]?.retryCount).toBe(1);
    expect(pending[0]?.lastError).toBe('Gateway Timeout 504');
  });
});
