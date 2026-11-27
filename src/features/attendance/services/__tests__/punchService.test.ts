import { ApiError } from '@/shared/api';
import { attendanceApi } from '../../api/attendanceApi';
import {
  enqueueAttendanceEvent,
  replayAttendanceQueue,
} from '../../db/attendanceQueue';
import { submitAttendancePunch } from '../punchService';

jest.mock('../../api/attendanceApi', () => ({
  attendanceApi: {
    punch: jest.fn(),
  },
}));

jest.mock('../../db/attendanceQueue', () => ({
  enqueueAttendanceEvent: jest.fn(),
  replayAttendanceQueue: jest.fn(async () => ({ processed: 0, succeeded: 0, failed: 0 })),
}));

const mockedAttendanceApi = attendanceApi as jest.Mocked<typeof attendanceApi>;
const mockedEnqueue = enqueueAttendanceEvent as jest.MockedFunction<typeof enqueueAttendanceEvent>;
const mockedReplay = replayAttendanceQueue as jest.MockedFunction<typeof replayAttendanceQueue>;

describe('punchService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits IN payload with UTC ISO timestamp and replays pending offline queue', async () => {
    const timestampMs = Date.UTC(2026, 10, 26, 9, 30, 0);
    mockedAttendanceApi.punch.mockResolvedValue({
      id: 77,
      employmentId: 105,
      punchTimeUtc: '2026-11-26T09:30:00.000Z',
      punchType: 'IN',
      raw: {},
    });

    const result = await submitAttendancePunch({
      action: 'punch-in',
      employmentId: 105,
      userId: '42',
      timestampMs,
    });

    expect(mockedAttendanceApi.punch).toHaveBeenCalledWith({
      employmentId: 105,
      punchTimeUtc: '2026-11-26T09:30:00.000Z',
      punchType: 'IN',
    });
    expect(result).toMatchObject({
      synced: true,
      queuedOffline: false,
      punchType: 'IN',
      punchTimeUtc: '2026-11-26T09:30:00.000Z',
      timestampMs,
    });
    expect(mockedEnqueue).not.toHaveBeenCalled();
    expect(mockedReplay).toHaveBeenCalledTimes(1);
  });

  it('queues punch offline when network is unreachable (status 0)', async () => {
    const timestampMs = Date.UTC(2026, 10, 26, 18, 0, 0);
    mockedAttendanceApi.punch.mockRejectedValue(
      new ApiError({
        status: 0,
        code: 'NETWORK_ERROR',
        message: 'Unable to reach server',
      }),
    );

    const result = await submitAttendancePunch({
      action: 'punch-out',
      employmentId: 105,
      userId: '42',
      timestampMs,
      provider: 'quick_punch',
    });

    expect(mockedEnqueue).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: '42',
        type: 'check_out',
        provider: 'quick_punch',
        timestamp: timestampMs,
      }),
    );
    expect(result).toMatchObject({
      synced: false,
      queuedOffline: true,
      punchType: 'OUT',
      punchTimeUtc: '2026-11-26T18:00:00.000Z',
      timestampMs,
    });
  });

  it('rethrows server HTTP errors (4xx/5xx) instead of queueing offline', async () => {
    mockedAttendanceApi.punch.mockRejectedValue(
      new ApiError({
        status: 422,
        message: 'Invalid employmentId',
      }),
    );

    await expect(
      submitAttendancePunch({
        action: 'punch-in',
        employmentId: 105,
        userId: '42',
      }),
    ).rejects.toMatchObject({
      status: 422,
      message: 'Invalid employmentId',
    });
    expect(mockedEnqueue).not.toHaveBeenCalled();
  });
});
