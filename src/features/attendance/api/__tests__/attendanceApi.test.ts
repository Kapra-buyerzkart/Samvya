import { resetHttpClientAuthForTests, tokenStorage } from '@/shared/api';
import {
  attendanceApi,
  getMonthDateRange,
  getWeekDateRange,
} from '../attendanceApi';

function createJsonResponse(status: number, body: unknown): Response {
  const serialized = body === null ? '' : JSON.stringify(body);
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ 'content-type': 'application/json' }),
    text: async () => serialized,
  } as unknown as Response;
}

describe('attendanceApi', () => {
  const originalFetch = global.fetch;

  beforeEach(async () => {
    resetHttpClientAuthForTests();
    await tokenStorage.setTokens({ accessToken: 'acc_test_token', refreshToken: 'ref_test_token' });
  });

  afterEach(async () => {
    global.fetch = originalFetch;
    await tokenStorage.clearTokens();
    jest.restoreAllMocks();
  });

  it('posts IN payload to /api/v1/attendance/punch with Bearer auth', async () => {
    const mockResponse = {
      id: 901,
      employmentId: 105,
      punchTimeUtc: '2026-11-26T09:45:00.000Z',
      punchType: 'IN',
      status: 'RECORDED',
    };
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
      Promise.resolve(createJsonResponse(200, mockResponse)),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    const result = await attendanceApi.punch({
      employmentId: 105,
      punchTimeUtc: '2026-11-26T09:45:00.000Z',
      punchType: 'IN',
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0]!;
    expect(String(url)).toMatch(/\/api\/v1\/attendance\/punch$/);
    expect(init?.method).toBe('POST');
    expect((init?.headers as Headers).get('Authorization')).toBe('Bearer acc_test_token');
    expect(JSON.parse(String(init?.body))).toEqual({
      employmentId: 105,
      punchTimeUtc: '2026-11-26T09:45:00.000Z',
      punchType: 'IN',
    });

    expect(result).toMatchObject({
      id: 901,
      employmentId: 105,
      punchTimeUtc: '2026-11-26T09:45:00.000Z',
      punchType: 'IN',
      status: 'RECORDED',
    });
  });

  it('posts OUT payload and handles 204 empty responses cleanly', async () => {
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
      Promise.resolve(createJsonResponse(204, null)),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    const result = await attendanceApi.punch({
      employmentId: 105,
      punchTimeUtc: '2026-11-26T18:15:00.000Z',
      punchType: 'OUT',
    });

    const [, init] = mockFetch.mock.calls[0]!;
    expect(JSON.parse(String(init?.body))).toEqual({
      employmentId: 105,
      punchTimeUtc: '2026-11-26T18:15:00.000Z',
      punchType: 'OUT',
    });
    expect(result).toMatchObject({
      id: null,
      employmentId: 105,
      punchTimeUtc: '2026-11-26T18:15:00.000Z',
      punchType: 'OUT',
    });
  });

  it('throws ApiError when backend rejects punch request', async () => {
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
      Promise.resolve(
        createJsonResponse(400, {
          status: 400,
          detail: 'Employee is already punched in for this shift.',
        }),
      ),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      attendanceApi.punch({
        employmentId: 105,
        punchTimeUtc: '2026-11-26T09:45:00.000Z',
        punchType: 'IN',
      }),
    ).rejects.toMatchObject({
      name: 'ApiError',
      status: 400,
      message: 'Employee is already punched in for this shift.',
    });
  });

  it('fetches monthly attendance with year & month params and builds full month summary', async () => {
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
      Promise.resolve(
        createJsonResponse(200, {
          workingDays: 21,
          days: [
            { date: '2026-11-02', workedMinutes: 480, status: 'recorded' },
            { date: '2026-11-03', workedHours: 5.5, status: 'lesser' },
          ],
        }),
      ),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    expect(getMonthDateRange(2026, 11)).toEqual({
      fromDate: '2026-11-01',
      toDate: '2026-11-30',
    });

    const summary = await attendanceApi.getEmploymentMonthlyAttendance({
      employmentId: 105,
      year: 2026,
      month: 11,
    });

    const [url, init] = mockFetch.mock.calls[0]!;
    expect(String(url)).toMatch(
      /\/api\/v1\/attendance\/employment\/105\/month\?year=2026&month=11$/,
    );
    expect(init?.method).toBe('GET');
    expect((init?.headers as Headers).get('Authorization')).toBe('Bearer acc_test_token');

    expect(summary.monthName).toBe('November 2026');
    expect(summary.workingDays).toBe(21);
    expect(summary.daysRecorded).toBe(2);
    expect(summary.totalHoursFormatted).toBe('13hrs 30m');
    expect(summary.dailyRecords).toHaveLength(30);
    expect(summary.dailyRecords[1]).toMatchObject({
      day: 2,
      hours: 8,
      formattedHours: '8h',
      status: 'recorded',
    });
    expect(summary.dailyRecords[2]).toMatchObject({
      day: 3,
      hours: 5.5,
      formattedHours: '5h 30m',
      status: 'lesser',
    });
  });

  it('fetches attendance date range and groups raw IN/OUT punches by date', async () => {
    const inIso = new Date(2026, 10, 19, 9, 5, 0).toISOString();
    const outIso = new Date(2026, 10, 19, 17, 35, 0).toISOString();
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
      Promise.resolve(
        createJsonResponse(200, {
          items: [
            { punchType: 'IN', punchTimeUtc: inIso },
            { punchType: 'OUT', punchTimeUtc: outIso },
            {
              date: '2026-11-18',
              punchInTimeUtc: new Date(2026, 10, 18, 9, 0, 0).toISOString(),
              status: 'pending',
            },
          ],
        }),
      ),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    const records = await attendanceApi.getEmploymentAttendanceRange({
      employmentId: 105,
      fromDate: '2026-11-01',
      toDate: '2026-11-30',
    });

    const [url, init] = mockFetch.mock.calls[0]!;
    expect(String(url)).toMatch(
      /\/api\/v1\/attendance\/employment\/105\?fromDate=2026-11-01&toDate=2026-11-30$/,
    );
    expect(init?.method).toBe('GET');

    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({
      dateKey: '2026-11-18',
      status: 'pending',
      punchInDisplay: '09:00 AM',
      punchOutDisplay: '—',
    });
    expect(records[1]).toMatchObject({
      dateKey: '2026-11-19',
      status: 'approved',
      punchInDisplay: '09:05 AM',
      punchOutDisplay: '05:35 PM',
      workedMinutes: 510,
    });
  });

  it('maps Postman days array with businessDate, punchInUtc, punchOutUtc, and non-punch statuses', async () => {
    const in19 = new Date(2026, 10, 19, 9, 10, 0).toISOString();
    const out19 = new Date(2026, 10, 19, 17, 40, 0).toISOString();
    const in18 = new Date(2026, 10, 18, 9, 0, 0).toISOString();

    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
      Promise.resolve(
        createJsonResponse(200, {
          data: {
            days: [
              {
                businessDate: '2026-11-15T00:00:00Z',
                isWeekend: true,
                status: 'WEEKEND',
                punchInUtc: null,
                punchOutUtc: null,
                workedMinutes: 0,
              },
              {
                businessDate: '2026-11-17',
                status: 'ABSENT',
                punchInUtc: null,
                punchOutUtc: null,
                workedMinutes: 0,
              },
              {
                businessDate: '2026-11-18',
                status: 'OPEN',
                punchInUtc: in18,
                punchOutUtc: null,
              },
              {
                businessDate: '2026-11-19',
                status: 'PRESENT',
                punchInUtc: in19,
                punchOutUtc: out19,
              },
              {
                businessDate: '2026-11-20',
                logs: [
                  { direction: 'IN', occurredAtUtc: new Date(2026, 10, 20, 10, 0, 0).toISOString() },
                  { direction: 'OUT', occurredAtUtc: new Date(2026, 10, 20, 18, 0, 0).toISOString() },
                ],
              },
            ],
          },
        }),
      ),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    const records = await attendanceApi.getEmploymentAttendanceRange({
      employmentId: 105,
      fromDate: '2026-11-01',
      toDate: '2026-11-30',
    });

    expect(records).toHaveLength(5);
    expect(records[0]).toMatchObject({
      dateKey: '2026-11-15',
      hasAttendanceData: false,
      isWeekend: true,
      punchInDisplay: '—',
      subtitle: 'Scheduled off day',
    });
    expect(records[1]).toMatchObject({
      dateKey: '2026-11-17',
      hasAttendanceData: false,
      punchInDisplay: '—',
    });
    expect(records[2]).toMatchObject({
      dateKey: '2026-11-18',
      status: 'pending',
      hasAttendanceData: true,
      punchInDisplay: '09:00 AM',
      punchOutDisplay: '—',
    });
    expect(records[3]).toMatchObject({
      dateKey: '2026-11-19',
      status: 'approved',
      hasAttendanceData: true,
      punchInDisplay: '09:10 AM',
      punchOutDisplay: '05:40 PM',
      workedMinutes: 510,
    });
    expect(records[4]).toMatchObject({
      dateKey: '2026-11-20',
      status: 'approved',
      hasAttendanceData: true,
      workedMinutes: 480,
    });
  });

  it('computes monthly work hours from days array with businessDate and punchInUtc/punchOutUtc', async () => {
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
      Promise.resolve(
        createJsonResponse(200, {
          days: [
            {
              businessDate: '2026-11-04',
              punchInUtc: new Date(2026, 10, 4, 9, 0, 0).toISOString(),
              punchOutUtc: new Date(2026, 10, 4, 17, 30, 0).toISOString(),
              status: 'PRESENT',
            },
            {
              businessDate: '2026-11-05',
              hoursWorked: '6',
              status: 'PARTIAL',
            },
          ],
        }),
      ),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    const summary = await attendanceApi.getEmploymentMonthlyAttendance({
      employmentId: 105,
      year: 2026,
      month: 11,
    });

    expect(summary.daysRecorded).toBe(2);
    expect(summary.totalHoursFormatted).toBe('14hrs 30m');
    expect(summary.dailyRecords[3]).toMatchObject({
      day: 4,
      hours: 8.5,
      formattedHours: '8h 30m',
      status: 'recorded',
    });
    expect(summary.dailyRecords[4]).toMatchObject({
      day: 5,
      hours: 6,
      formattedHours: '6h',
      status: 'lesser',
    });
  });

  it('computes Monday-Sunday week date range cleanly', () => {
    // Thursday, 26 Nov 2026
    const week = getWeekDateRange(new Date(2026, 10, 26));
    expect(week.fromDate).toBe('2026-11-23');
    expect(week.toDate).toBe('2026-11-29');
    expect(week.todayDayId).toBe('thu');
    expect(week.days).toHaveLength(7);
  });
});
