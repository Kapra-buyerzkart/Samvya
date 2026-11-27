export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(options: {
    status: number;
    message: string;
    code?: string;
    details?: unknown;
  }) {
    super(options.message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function parseApiError(status: number, payload: unknown, fallbackMessage?: string): ApiError {
  if (typeof payload === 'string' && payload.trim()) {
    return new ApiError({
      status,
      message: payload.trim(),
      details: payload,
    });
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const rawCode =
      typeof record.code === 'string'
        ? record.code
        : typeof record.errorCode === 'string'
          ? record.errorCode
          : undefined;
    const rawMessage =
      (typeof record.message === 'string' && record.message) ||
      (typeof record.detail === 'string' && record.detail) ||
      (typeof record.title === 'string' && record.title) ||
      (typeof record.error === 'string' && record.error) ||
      fallbackMessage ||
      `Request failed with status ${status}`;

    return new ApiError({
      status,
      message: rawMessage,
      code: rawCode,
      details: payload,
    });
  }

  return new ApiError({
    status,
    message: fallbackMessage || `Request failed with status ${status}`,
    details: payload,
  });
}
