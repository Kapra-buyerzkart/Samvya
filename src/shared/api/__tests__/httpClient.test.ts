import {
  ApiError,
  apiRequest,
  buildApiUrl,
  configureHttpClientAuth,
  normalizeApiOrigin,
  resetHttpClientAuthForTests,
  tokenStorage,
} from '../index';

describe('shared api config & httpClient', () => {
  const originalFetch = global.fetch;

  beforeEach(async () => {
    jest.clearAllMocks();
    resetHttpClientAuthForTests();
    await tokenStorage.clearTokens();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('normalizes API origins and builds /api/v1 URLs cleanly', () => {
    expect(normalizeApiOrigin('https://api.example.com/')).toBe('https://api.example.com');
    expect(normalizeApiOrigin('https://api.example.com/v1')).toBe('https://api.example.com');
    expect(normalizeApiOrigin('https://api.example.com/api/v1/')).toBe('https://api.example.com');
    expect(normalizeApiOrigin(undefined)).toBe('https://hrmsapi.samagra360.com');
    expect(buildApiUrl('/api/v1/auth/login')).toMatch(/\/api\/v1\/auth\/login$/);
  });

  it('chunks large tokens in SecureStore and clears chunk keys cleanly', async () => {
    const longJwt = 'a'.repeat(4000);
    await tokenStorage.setTokens({
      accessToken: longJwt,
      refreshToken: 'short_refresh',
    });

    expect(await tokenStorage.getAccessToken()).toBe(longJwt);
    expect(await tokenStorage.getRefreshToken()).toBe('short_refresh');

    await tokenStorage.clearTokens();
    expect(await tokenStorage.getAccessToken()).toBeNull();
    expect(await tokenStorage.getRefreshToken()).toBeNull();
  });

  it('attaches Bearer token on authenticated requests and omits it when auth is false', async () => {
    await tokenStorage.setTokens({ accessToken: 'tok_123', refreshToken: 'ref_123' });

    const mockFetch = jest.fn((_url: string, _init?: RequestInit) =>
      Promise.resolve(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      ),
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    await apiRequest('/api/v1/auth/session');
    const authHeaders = mockFetch.mock.calls[0]?.[1]?.headers as Headers;
    expect(authHeaders.get('Authorization')).toBe('Bearer tok_123');

    await apiRequest('/api/v1/auth/login', {
      method: 'POST',
      auth: false,
      body: { username: 'staff@example.com', password: 'secret' },
    });
    const noAuthHeaders = mockFetch.mock.calls[1]?.[1]?.headers as Headers;
    expect(noAuthHeaders.get('Authorization')).toBeNull();
  });

  it('coalesces concurrent 401 refreshes into one call and retries original requests', async () => {
    await tokenStorage.setTokens({ accessToken: 'expired_tok', refreshToken: 'ref_tok' });

    const onRefreshToken = jest.fn(async () => {
      await tokenStorage.setTokens({ accessToken: 'fresh_tok', refreshToken: 'ref_tok' });
      return 'fresh_tok';
    });
    const onSessionExpired = jest.fn();

    configureHttpClientAuth({ onRefreshToken, onSessionExpired });

    const mockFetch = jest.fn((_url: string, init?: RequestInit) => {
      const headers = init?.headers as Headers;
      if (headers.get('Authorization') === 'Bearer fresh_tok') {
        return Promise.resolve(
          new Response(JSON.stringify({ data: 'ok' }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          }),
        );
      }
      return Promise.resolve(
        new Response(JSON.stringify({ message: 'Unauthorized' }), {
          status: 401,
          headers: { 'content-type': 'application/json' },
        }),
      );
    });
    global.fetch = mockFetch as unknown as typeof fetch;

    const [r1, r2] = await Promise.all([
      apiRequest<{ data: string }>('/api/v1/auth/session'),
      apiRequest<{ data: string }>('/api/v1/auth/organizations'),
    ]);

    expect(r1).toEqual({ data: 'ok' });
    expect(r2).toEqual({ data: 'ok' });
    expect(onRefreshToken).toHaveBeenCalledTimes(1);
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('triggers onSessionExpired and throws ApiError when refresh fails', async () => {
    await tokenStorage.setTokens({ accessToken: 'expired_tok', refreshToken: 'ref_tok' });

    const onRefreshToken = jest.fn(async () => null);
    const onSessionExpired = jest.fn();
    configureHttpClientAuth({ onRefreshToken, onSessionExpired });

    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'Token expired' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      }),
    ) as unknown as typeof fetch;

    await expect(apiRequest('/api/v1/auth/session')).rejects.toBeInstanceOf(ApiError);
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
  });
});
