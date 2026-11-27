import { resetHttpClientAuthForTests, tokenStorage } from '@/shared/api';
import { extractLeaveOverlapConfirmation, leaveApi } from '../leaveApi';

function createJsonResponse(status: number, body: unknown): Response {
  const serialized = body === null ? '' : JSON.stringify(body);
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ 'content-type': 'application/json' }),
    text: async () => serialized,
  } as unknown as Response;
}

describe('leaveApi', () => {
  const originalFetch = global.fetch;

  beforeEach(async () => {
    resetHttpClientAuthForTests();
    await tokenStorage.setTokens({ accessToken: 'acc_leave_tok', refreshToken: 'ref_leave_tok' });
  });

  afterEach(async () => {
    global.fetch = originalFetch;
    await tokenStorage.clearTokens();
    jest.restoreAllMocks();
  });

  it('loads eligible leave types from workforce-access endpoint', async () => {
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
      Promise.resolve(
        createJsonResponse(200, {
          leaveTypes: [
            { leaveTypeId: 1, name: 'Casual Leave', code: 'CL', allowHalfDay: true },
            { leaveType: { id: 2, name: 'Sick Leave', code: 'SL' }, availableDays: 6 },
          ],
        }),
      ),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    const types = await leaveApi.getEligibleLeaveTypes(105);

    const [url, init] = mockFetch.mock.calls[0]!;
    expect(String(url)).toMatch(/\/api\/v1\/workforce-access\/employment\/105\/leave-types$/);
    expect(init?.method).toBe('GET');
    expect((init?.headers as Headers).get('Authorization')).toBe('Bearer acc_leave_tok');
    expect(types).toEqual([
      {
        id: 1,
        name: 'Casual Leave',
        code: 'CL',
        allocatedDays: undefined,
        takenDays: undefined,
        pendingDays: undefined,
        availableDays: undefined,
        allowHalfDay: true,
      },
      {
        id: 2,
        name: 'Sick Leave',
        code: 'SL',
        allocatedDays: undefined,
        takenDays: undefined,
        pendingDays: undefined,
        availableDays: 6,
        allowHalfDay: undefined,
      },
    ]);
  });

  it('loads and aggregates leave balances by employmentId and year', async () => {
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
      Promise.resolve(
        createJsonResponse(200, {
          data: {
            balances: [
              {
                leaveTypeId: 1,
                leaveTypeName: 'Casual Leave',
                allocatedDays: 12,
                takenDays: 3,
                pendingDays: 1,
              },
              {
                leaveTypeId: 2,
                leaveTypeName: 'Sick Leave',
                allocatedDays: 6,
                usedDays: 1,
                pendingApprovalDays: 0,
                availableDays: 5,
              },
            ],
          },
        }),
      ),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    const balances = await leaveApi.getLeaveBalances(105, 2026);

    const [url] = mockFetch.mock.calls[0]!;
    expect(String(url)).toMatch(/\/api\/v1\/leaves\/employment\/105\/balances\?year=2026$/);
    expect(balances.allocated).toBe(18);
    expect(balances.taken).toBe(4);
    expect(balances.pending).toBe(1);
    expect(balances.available).toBe(13);
    expect(balances.byType).toHaveLength(2);
    expect(balances.byType[0]).toMatchObject({
      leaveTypeId: 1,
      allocated: 12,
      taken: 3,
      pending: 1,
      available: 8,
    });
  });

  it('submits leave request payload to /api/v1/leaves/submit', async () => {
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
      Promise.resolve(
        createJsonResponse(200, {
          leaveRequestId: 501,
          status: 'PENDING',
        }),
      ),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    const res = await leaveApi.submitLeaveRequest({
      employmentId: 105,
      leaveTypeId: 1,
      startDate: '2026-11-28',
      endDate: '2026-11-29',
      isHalfDayStart: false,
      isHalfDayEnd: false,
      totalDaysApplied: 2,
      reason: 'Family function',
      requestId: 'req-uuid-123',
    });

    const [url, init] = mockFetch.mock.calls[0]!;
    expect(String(url)).toMatch(/\/api\/v1\/leaves\/submit$/);
    expect(init?.method).toBe('POST');
    expect(JSON.parse(String(init?.body))).toEqual({
      employmentId: 105,
      leaveTypeId: 1,
      startDate: '2026-11-28',
      endDate: '2026-11-29',
      isHalfDayStart: false,
      isHalfDayEnd: false,
      totalDaysApplied: 2,
      reason: 'Family function',
      requestId: 'req-uuid-123',
    });
    expect(res).toMatchObject({
      leaveRequestId: 501,
      status: 'PENDING',
    });
  });

  it('extracts LEAVE_OVERLAP confirmation token from API errors cleanly', async () => {
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
      Promise.resolve(
        createJsonResponse(409, {
          status: 409,
          detail: 'LEAVE_OVERLAP:confirm_token_987',
        }),
      ),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    jest.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await leaveApi.submitLeaveRequest({
        employmentId: 105,
        leaveTypeId: 1,
        startDate: '2026-11-28',
        endDate: '2026-11-28',
        isHalfDayStart: true,
        isHalfDayEnd: false,
        totalDaysApplied: 0.5,
        reason: 'Medical checkup',
        requestId: 'req-uuid-456',
      });
      throw new Error('Expected rejection');
    } catch (err) {
      expect(extractLeaveOverlapConfirmation(err)).toBe('confirm_token_987');
    }
  });

  it('logs and posts withdraw and cancel leave requests', async () => {
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
      Promise.resolve(createJsonResponse(200, { status: 'OK' })),
    );
    global.fetch = mockFetch as unknown as typeof fetch;
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await leaveApi.withdrawLeaveRequest(501, 'Changed travel plans');
    await leaveApi.cancelLeaveRequest(502, 'req-cancel-1', 'Work coverage changed');

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(String(mockFetch.mock.calls[0]?.[0])).toMatch(/\/api\/v1\/leaves\/501\/withdraw$/);
    expect(String(mockFetch.mock.calls[1]?.[0])).toMatch(/\/api\/v1\/leaves\/502\/cancel$/);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('[leaveApi] -> POST /api/v1/leaves/501/withdraw request:'),
      { reason: 'Changed travel plans' },
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('[leaveApi] -> POST /api/v1/leaves/502/cancel request:'),
      { requestId: 'req-cancel-1', reason: 'Work coverage changed' },
    );
  });

  it('derives allocated balance when backend provides used and remaining without allocated', async () => {
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
      Promise.resolve(
        createJsonResponse(200, {
          balances: [
            {
              typeId: 7,
              leaveTypeTitle: 'Annual Leave',
              usedDays: 2,
              pendingDays: 1,
              remainingDays: 9,
            },
          ],
        }),
      ),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    const balances = await leaveApi.getLeaveBalances(15, 2026);
    expect(balances).toEqual({
      allocated: 12,
      taken: 2,
      pending: 1,
      available: 9,
      byType: [
        {
          leaveTypeId: 7,
          leaveTypeName: 'Annual Leave',
          leaveTypeCode: undefined,
          allocated: 12,
          taken: 2,
          pending: 1,
          available: 9,
        },
      ],
    });
  });

  it('forwards replacesRequestId and appealsRequestId when submitting leave requests', async () => {
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
      Promise.resolve(createJsonResponse(200, { leaveRequestId: 501, status: 'PENDING' })),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    await leaveApi.submitLeaveRequest({
      employmentId: 105,
      leaveTypeId: 2,
      startDate: '2026-11-30',
      endDate: '2026-12-02',
      isHalfDayStart: false,
      isHalfDayEnd: false,
      totalDaysApplied: 3,
      reason: 'Urgent Family meeting',
      requestId: 'req-appeal-1',
      appealsRequestId: 88,
    });

    const firstBody = JSON.parse(String(mockFetch.mock.calls[0]?.[1]?.body));
    expect(firstBody.appealsRequestId).toBe(88);
    expect(firstBody.replacesRequestId).toBeUndefined();

    await leaveApi.submitLeaveRequest({
      employmentId: 105,
      leaveTypeId: 2,
      startDate: '2026-12-01',
      endDate: '2026-12-02',
      isHalfDayStart: false,
      isHalfDayEnd: false,
      totalDaysApplied: 2,
      reason: 'Got postponed',
      requestId: 'req-replace-1',
      replacesRequestId: 89,
    });

    const secondBody = JSON.parse(String(mockFetch.mock.calls[1]?.[1]?.body));
    expect(secondBody.replacesRequestId).toBe(89);
    expect(secondBody.appealsRequestId).toBeUndefined();
  });

  it('loads leave calendar month and leave balance ledger', async () => {
    const mockFetch = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValueOnce(
        createJsonResponse(200, {
          days: [{ date: '2026-11-23', status: 'APPROVED', leaveTypeId: 2, leaveTypeName: 'Casual Leave' }],
        }),
      )
      .mockResolvedValueOnce(
        createJsonResponse(200, {
          entries: [
            { id: 10, leaveTypeId: 2, leaveTypeName: 'Casual Leave', entryType: 'CARRY_FORWARD', days: 2 },
          ],
        }),
      );
    global.fetch = mockFetch as unknown as typeof fetch;

    const monthItems = await leaveApi.getLeaveCalendarMonth(105, 2026, 11);
    expect(String(mockFetch.mock.calls[0]?.[0])).toMatch(
      /\/api\/v1\/leaves\/employment\/105\/month\?year=2026&month=11$/,
    );
    expect(monthItems).toEqual([
      { dateKey: '2026-11-23', status: 'APPROVED', leaveTypeId: 2, leaveTypeName: 'Casual Leave' },
    ]);

    const ledgerEntries = await leaveApi.getLeaveLedger(105, 2026);
    expect(String(mockFetch.mock.calls[1]?.[0])).toMatch(
      /\/api\/v1\/leaves\/employment\/105\/ledger\?year=2026$/,
    );
    expect(ledgerEntries).toEqual([
      {
        id: 10,
        leaveTypeId: 2,
        leaveTypeName: 'Casual Leave',
        entryType: 'CARRY_FORWARD',
        days: 2,
        createdAtUtc: undefined,
      },
    ]);
  });

  it('expands entries range payloads with requestState in getLeaveCalendarMonth', async () => {
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>().mockResolvedValueOnce(
      createJsonResponse(200, {
        month: '2026-12-01T00:00:00',
        entries: [
          {
            leaveRequestId: 23,
            leaveTypeName: 'Sick Leave',
            startDate: '2026-12-02T00:00:00',
            endDate: '2026-12-05T00:00:00',
            isHalfDayStart: false,
            isHalfDayEnd: false,
            totalDaysApplied: 4,
            requestState: 'Submitted',
            requestDate: '2026-11-27T11:18:52.3033333',
            leaveTypeId: 3,
          },
        ],
      }),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    const monthItems = await leaveApi.getLeaveCalendarMonth(15, 2026, 12);
    expect(monthItems).toEqual([
      { dateKey: '2026-12-02', status: 'Submitted', leaveTypeId: 3, leaveTypeName: 'Sick Leave' },
      { dateKey: '2026-12-03', status: 'Submitted', leaveTypeId: 3, leaveTypeName: 'Sick Leave' },
      { dateKey: '2026-12-04', status: 'Submitted', leaveTypeId: 3, leaveTypeName: 'Sick Leave' },
      { dateKey: '2026-12-05', status: 'Submitted', leaveTypeId: 3, leaveTypeName: 'Sick Leave' },
    ]);
  });
});
