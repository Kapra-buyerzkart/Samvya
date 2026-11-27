import { resetHttpClientAuthForTests, tokenStorage } from '@/shared/api';
import { employmentApi } from '../employmentApi';

function createJsonResponse(status: number, body: unknown): Response {
  const serialized = body === null ? '' : JSON.stringify(body);
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ 'content-type': 'application/json' }),
    text: async () => serialized,
  } as unknown as Response;
}

describe('employmentApi', () => {
  const originalFetch = global.fetch;

  beforeEach(async () => {
    resetHttpClientAuthForTests();
    await tokenStorage.setTokens({ accessToken: 'acc_emp_tok', refreshToken: 'ref_emp_tok' });
  });

  afterEach(async () => {
    global.fetch = originalFetch;
    await tokenStorage.clearTokens();
    jest.restoreAllMocks();
  });

  it('loads member employments, active employment record, and context and merges them', async () => {
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>((url) => {
      const urlStr = String(url);
      if (urlStr.endsWith('/api/v1/members/42/employments')) {
        return Promise.resolve(
          createJsonResponse(200, {
            employments: [
              {
                employmentId: 105,
                designation: 'Principal Engineer',
                status: 'Active',
                isPrimary: true,
                employeeCode: 'SAM-105',
                joinedDate: '2025-04-15',
              },
              {
                employmentId: 88,
                designation: 'Senior Engineer',
                status: 'Inactive',
                isPrimary: false,
                employeeCode: 'SAM-088',
                organisationName: 'Samavya Labs',
                officeName: 'Bengaluru HQ',
                departmentName: 'Engineering',
                employmentType: 'Full-Time',
                workArrangement: 'Hybrid',
                joinedDate: '2023-01-10',
                lastWorkingDay: '2025-04-14',
                relievedDate: '2025-04-14',
              },
            ],
          }),
        );
      }
      if (urlStr.endsWith('/api/v1/employments/105')) {
        return Promise.resolve(
          createJsonResponse(200, {
            employmentId: 105,
            employmentType: 'Permanent',
            workArrangement: 'Remote',
            effectiveFrom: '2025-04-15',
            confirmationDate: '2025-10-15',
            isConfirmed: true,
          }),
        );
      }
      if (urlStr.endsWith('/api/v1/workforce-access/employment/105/context')) {
        return Promise.resolve(
          createJsonResponse(200, {
            organizationName: 'Samavya Tech',
            officeName: 'Kochi Hub',
            departmentName: 'Platform Core',
          }),
        );
      }
      return Promise.resolve(createJsonResponse(404, { message: 'Not found' }));
    });
    global.fetch = mockFetch as unknown as typeof fetch;

    const history = await employmentApi.loadEmploymentHistory({
      memberId: 42,
      employmentId: 105,
    });

    expect(mockFetch).toHaveBeenCalledTimes(3);
    const urls = mockFetch.mock.calls.map(([u]) => String(u));
    expect(urls.some((u) => u.endsWith('/api/v1/members/42/employments'))).toBe(true);
    expect(urls.some((u) => u.endsWith('/api/v1/employments/105'))).toBe(true);
    expect(urls.some((u) => u.endsWith('/api/v1/workforce-access/employment/105/context'))).toBe(
      true,
    );

    expect(history).toHaveLength(2);
    expect(history[0]).toMatchObject({
      id: '105',
      designation: 'Principal Engineer',
      status: 'Active',
      isPrimary: true,
      employeeCode: 'SAM-105',
      organisation: 'Samavya Tech',
      office: 'Kochi Hub',
      department: 'Platform Core',
      employmentType: 'Permanent',
      workArrangement: 'Remote',
      effectivePeriod: '15 Apr 2025 · Open ended',
      confirmation: 'Confirmed · 15 Oct 2025',
      joinedDate: '15 Apr 2025',
      lastWorkingDay: 'Not recorded',
      relievedDate: 'Not recorded',
    });
    expect(history[1]).toMatchObject({
      id: '88',
      designation: 'Senior Engineer',
      status: 'Inactive',
      isPrimary: false,
      employeeCode: 'SAM-088',
      joinedDate: '10 Jan 2023',
      lastWorkingDay: '14 Apr 2025',
      relievedDate: '14 Apr 2025',
    });
  });

  it('continues gracefully when context endpoint fails as long as employment record succeeds', async () => {
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>((url) => {
      const urlStr = String(url);
      if (urlStr.endsWith('/api/v1/employments/105')) {
        return Promise.resolve(
          createJsonResponse(200, {
            employmentId: 105,
            designationName: 'QA Architect',
            organizationName: 'Samavya Corp',
            departmentName: 'Quality',
            employeeCode: 'QA-01',
          }),
        );
      }
      return Promise.resolve(createJsonResponse(403, { detail: 'Forbidden' }));
    });
    global.fetch = mockFetch as unknown as typeof fetch;

    jest.spyOn(console, 'error').mockImplementation(() => {});

    const history = await employmentApi.loadEmploymentHistory({
      memberId: 42,
      employmentId: 105,
    });

    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({
      designation: 'QA Architect',
      organisation: 'Samavya Corp',
      department: 'Quality',
      employeeCode: 'QA-01',
    });
  });

  it('throws when all employment API requests fail', async () => {
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
      Promise.resolve(createJsonResponse(500, { detail: 'Internal Server Error' })),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      employmentApi.loadEmploymentHistory({
        memberId: 42,
        employmentId: 105,
      }),
    ).rejects.toMatchObject({
      status: 500,
      message: 'Internal Server Error',
    });
  });

  it('maps nested entity objects and wrapped context responses into employment history', async () => {
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>((url) => {
      const urlStr = String(url);
      if (urlStr.endsWith('/api/v1/members/42/employments')) {
        return Promise.resolve(
          createJsonResponse(200, {
            data: {
              employments: [
                {
                  employment: {
                    id: 105,
                    employeeNumber: 'SMV-105',
                    hireDate: '2025-05-01',
                    effectiveStartDate: '2025-05-01',
                    confirmedOn: '2025-11-01',
                    isPrimaryEmployment: true,
                    status: { id: 1, name: 'Active' },
                  },
                  designation: { id: 2, title: 'Engineering Lead' },
                },
              ],
            },
          }),
        );
      }
      if (urlStr.endsWith('/api/v1/employments/105')) {
        return Promise.resolve(
          createJsonResponse(200, {
            result: {
              id: 105,
              employmentType: { id: 1, name: 'Full-Time' },
              workArrangement: { id: 2, name: 'Hybrid' },
              confirmationStatus: 'Confirmed',
            },
          }),
        );
      }
      if (urlStr.endsWith('/api/v1/workforce-access/employment/105/context')) {
        return Promise.resolve(
          createJsonResponse(200, {
            context: {
              organization: { id: 10, name: 'Samavya Holdings' },
              branch: { id: 4, name: 'Trivandrum Technopark' },
              department: { id: 9, name: 'Mobile Engineering' },
            },
          }),
        );
      }
      return Promise.resolve(createJsonResponse(404, { message: 'Not found' }));
    });
    global.fetch = mockFetch as unknown as typeof fetch;

    const history = await employmentApi.loadEmploymentHistory({
      memberId: 42,
      employmentId: 105,
    });

    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({
      id: '105',
      designation: 'Engineering Lead',
      status: 'Active',
      isPrimary: true,
      employeeCode: 'SMV-105',
      organisation: 'Samavya Holdings',
      office: 'Trivandrum Technopark',
      department: 'Mobile Engineering',
      employmentType: 'Full-Time',
      workArrangement: 'Hybrid',
      effectivePeriod: '01 May 2025 · Open ended',
      confirmation: 'Confirmed · 01 Nov 2025',
      joinedDate: '01 May 2025',
      lastWorkingDay: 'Not recorded',
      relievedDate: 'Not recorded',
    });
  });
});
