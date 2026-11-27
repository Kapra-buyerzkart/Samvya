import { buildApiUrl } from './config';
import { ApiError, parseApiError } from './errors';
import { tokenStorage } from './tokenStorage';

export interface HttpAuthHandlers {
  onRefreshToken: () => Promise<string | null>;
  onSessionExpired: () => Promise<void> | void;
}

let authHandlers: HttpAuthHandlers | null = null;
let inFlightRefresh: Promise<string | null> | null = null;

export function configureHttpClientAuth(handlers: HttpAuthHandlers): void {
  authHandlers = handlers;
}

export function resetHttpClientAuthForTests(): void {
  authHandlers = null;
  inFlightRefresh = null;
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  auth?: boolean;
  accessTokenOverride?: string;
  skipAuthRefresh?: boolean;
  timeoutMs?: number;
  body?: BodyInit | Record<string, unknown> | unknown[] | string | null;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';
  const text = await response.text();
  if (!text) {
    return null;
  }

  if (contentType.includes('application/json') || text.startsWith('{') || text.startsWith('[')) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }

  return text;
}

async function refreshAccessTokenSingleFlight(): Promise<string | null> {
  if (!authHandlers) {
    return null;
  }

  if (!inFlightRefresh) {
    inFlightRefresh = authHandlers
      .onRefreshToken()
      .catch(() => null)
      .finally(() => {
        inFlightRefresh = null;
      });
  }

  return inFlightRefresh;
}

function serializeRequestBody(
  body: ApiRequestOptions['body'],
  headers: Headers,
): BodyInit | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    return body;
  }

  if (typeof body === 'string') {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    return body;
  }

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  return JSON.stringify(body);
}

async function executeFetch(
  path: string,
  options: ApiRequestOptions,
  token: string | null,
): Promise<{ response: Response; payload: unknown }> {
  const headers = new Headers(options.headers);
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (options.auth !== false && token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const serializedBody = serializeRequestBody(options.body, headers);
  const timeoutMs = options.timeoutMs ?? 15000;
  const controller = typeof AbortController !== 'undefined' && !options.signal
    ? new AbortController()
    : null;
  const timerId =
    controller && timeoutMs > 0
      ? setTimeout(() => controller.abort(), timeoutMs)
      : null;

  try {
    const response = await fetch(buildApiUrl(path), {
      ...options,
      headers,
      body: serializedBody,
      signal: options.signal ?? controller?.signal,
    });

    const payload = await parseResponseBody(response);
    return { response, payload };
  } finally {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const requiresAuth = options.auth !== false;
  const initialToken = requiresAuth
    ? (options.accessTokenOverride ?? (await tokenStorage.getAccessToken()))
    : null;

  let result: { response: Response; payload: unknown };
  try {
    result = await executeFetch(path, options, initialToken);
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? `Unable to reach server: ${error.message}`
        : 'Unable to reach server. Check your connection and try again.';
    throw new ApiError({ status: 0, code: 'NETWORK_ERROR', message, details: error });
  }

  if (
    result.response.status === 401 &&
    requiresAuth &&
    !options.skipAuthRefresh &&
    !options.accessTokenOverride
  ) {
    const refreshedToken = await refreshAccessTokenSingleFlight();
    if (refreshedToken) {
      const retried = await executeFetch(path, options, refreshedToken);
      if (retried.response.ok) {
        return retried.payload as T;
      }
      if (retried.response.status === 401) {
        await authHandlers?.onSessionExpired();
      }
      throw parseApiError(retried.response.status, retried.payload, retried.response.statusText);
    }

    await authHandlers?.onSessionExpired();
  }

  if (!result.response.ok) {
    throw parseApiError(result.response.status, result.payload, result.response.statusText);
  }

  return result.payload as T;
}
