import { ApiError, resetHttpClientAuthForTests } from '@/shared/api';
import { authApi } from '../authApi';

function createJsonResponse(status: number, body: unknown): Response {
  const serialized = body === null ? '' : JSON.stringify(body);
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ 'content-type': 'application/json' }),
    text: async () => serialized,
  } as unknown as Response;
}

describe('authApi', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    resetHttpClientAuthForTests();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('logs raw sign-in response in dev mode and returns normalized tokens', async () => {
    const rawPayload = {
      token: 'jwt-access-123',
      refreshToken: 'refresh-456',
      requiresOrganizationSelection: false,
      tenantId: 42,
      memberId: 99,
    };
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
      Promise.resolve(createJsonResponse(200, rawPayload)),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await authApi.signIn({
      username: 'backupssajil@gmail.com',
      password: 'Password@123',
    });

    expect(result).toEqual({
      token: 'jwt-access-123',
      refreshToken: 'refresh-456',
      requiresOrganizationSelection: false,
      tenantId: 42,
      memberId: 99,
    });
    expect(logSpy).toHaveBeenCalledWith(
      '[authApi] POST /api/v1/auth/login response:',
      rawPayload,
    );
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('logs API error details and rethrows when sign-in fails', async () => {
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
      Promise.resolve(
        createJsonResponse(401, {
          title: 'Unauthorized',
          status: 401,
          detail: 'Invalid email or password.',
        }),
      ),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      authApi.signIn({
        username: 'backupssajil@gmail.com',
        password: 'wrong',
      }),
    ).rejects.toBeInstanceOf(ApiError);

    expect(logSpy).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(
      '[authApi] POST /api/v1/auth/login error:',
      expect.objectContaining({
        status: 401,
        message: 'Invalid email or password.',
      }),
    );
  });

  it('logs raw response before logging schema validation error when payload shape is invalid', async () => {
    const malformedPayload = { ok: true };
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
      Promise.resolve(createJsonResponse(200, malformedPayload)),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      authApi.signIn({
        username: 'backupssajil@gmail.com',
        password: 'Password@123',
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_AUTH_RESPONSE',
    });

    expect(logSpy).toHaveBeenCalledWith(
      '[authApi] POST /api/v1/auth/login response:',
      malformedPayload,
    );
    expect(errorSpy).toHaveBeenCalledWith(
      '[authApi] POST /api/v1/auth/login error:',
      expect.objectContaining({
        status: 500,
        code: 'INVALID_AUTH_RESPONSE',
      }),
    );
  });

  it('logs raw staff session response in dev mode', async () => {
    const sessionPayload = {
      tenantId: 10,
      memberId: 20,
      employmentId: 30,
      employmentPublicId: 'emp-public-30',
      fullName: 'Sajil Test',
      email: 'backupssajil@gmail.com',
    };
    const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
      Promise.resolve(createJsonResponse(200, sessionPayload)),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const session = await authApi.loadStaffSession('token-abc');

    expect(session.name).toBe('Sajil Test');
    expect(logSpy).toHaveBeenCalledWith(
      '[authApi] GET /api/v1/auth/session response:',
      sessionPayload,
    );
  });

  it('suppresses auth response logs outside dev mode', async () => {
    const devHolder = globalThis as unknown as { __DEV__: boolean };
    const previousDev = devHolder.__DEV__;
    devHolder.__DEV__ = false;

    try {
      const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(() =>
        Promise.resolve(createJsonResponse(200, { token: 'jwt-prod' })),
      );
      global.fetch = mockFetch as unknown as typeof fetch;

      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await authApi.signIn({
        username: 'backupssajil@gmail.com',
        password: 'Password@123',
      });

      expect(logSpy).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();
    } finally {
      devHolder.__DEV__ = previousDev;
    }
  });
});
