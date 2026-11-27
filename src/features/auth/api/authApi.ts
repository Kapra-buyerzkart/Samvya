import { z } from 'zod';
import { ApiError, apiRequest, isApiError } from '@/shared/api';

const idSchema = z.union([z.string(), z.number()]);

const authTokenResponseSchema = z.object({
  token: z.string().min(1),
  refreshToken: z.string().nullable().optional(),
  requiresOrganizationSelection: z.boolean().nullable().optional(),
  tenantId: idSchema.nullable().optional(),
  memberId: idSchema.nullable().optional(),
});

const rawOrganizationSchema = z
  .object({
    tenantId: idSchema.optional(),
    id: idSchema.optional(),
    name: z.string().optional(),
    tenantName: z.string().optional(),
    organizationName: z.string().optional(),
    code: z.string().nullable().optional(),
    tenantCode: z.string().nullable().optional(),
    role: z.string().nullable().optional(),
    roleName: z.string().nullable().optional(),
  })
  .passthrough();

const staffSessionResponseSchema = z
  .object({
    tenantId: idSchema.nullable().optional(),
    memberId: idSchema.nullable().optional(),
    employmentId: idSchema.nullable().optional(),
    employmentPublicId: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    fullName: z.string().nullable().optional(),
    displayName: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    username: z.string().nullable().optional(),
    employeeCode: z.string().nullable().optional(),
    department: z.string().nullable().optional(),
    designation: z.string().nullable().optional(),
  })
  .passthrough();

export type EntityId = string | number;

export interface AuthTokenResponse {
  token: string;
  refreshToken: string | null;
  requiresOrganizationSelection: boolean;
  tenantId: EntityId | null;
  memberId: EntityId | null;
}

export interface OrganizationOption {
  tenantId: EntityId;
  name: string;
  code?: string;
  role?: string;
}

export interface StaffSession {
  tenantId: EntityId | null;
  memberId: EntityId | null;
  employmentId: EntityId | null;
  employmentPublicId: string | null;
  name?: string;
  email?: string;
  employeeCode?: string;
  department?: string;
  designation?: string;
}

export interface SignInPayload {
  username: string;
  password: string;
}

function normalizeId(value: EntityId | null | undefined): EntityId | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  return value;
}

function normalizeAuthResponse(raw: unknown): AuthTokenResponse {
  const parsed = authTokenResponseSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ApiError({
      status: 500,
      code: 'INVALID_AUTH_RESPONSE',
      message: 'Unexpected sign-in response from server.',
      details: parsed.error.flatten(),
    });
  }

  return {
    token: parsed.data.token,
    refreshToken: parsed.data.refreshToken || null,
    requiresOrganizationSelection: parsed.data.requiresOrganizationSelection === true,
    tenantId: normalizeId(parsed.data.tenantId),
    memberId: normalizeId(parsed.data.memberId),
  };
}

function extractOrganizationsArray(raw: unknown): unknown[] {
  if (Array.isArray(raw)) {
    return raw;
  }
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.organizations)) return obj.organizations;
    if (Array.isArray(obj.items)) return obj.items;
    if (Array.isArray(obj.data)) return obj.data;
  }
  return [];
}

function parseOrganizationsResponse(raw: unknown): OrganizationOption[] {
  const items = extractOrganizationsArray(raw);
  const result: OrganizationOption[] = [];

  for (const item of items) {
    const parsed = rawOrganizationSchema.safeParse(item);
    if (!parsed.success) continue;
    const tenantId = parsed.data.tenantId ?? parsed.data.id;
    if (tenantId === undefined || tenantId === null || tenantId === '') continue;

    const name =
      parsed.data.name ??
      parsed.data.tenantName ??
      parsed.data.organizationName ??
      `Organization ${tenantId}`;

    result.push({
      tenantId,
      name,
      code: (parsed.data.code ?? parsed.data.tenantCode) || undefined,
      role: (parsed.data.role ?? parsed.data.roleName) || undefined,
    });
  }

  return result;
}

function parseStaffSessionResponse(raw: unknown): StaffSession {
  const parsed = staffSessionResponseSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ApiError({
      status: 500,
      code: 'INVALID_SESSION_RESPONSE',
      message: 'Unexpected staff session response from server.',
      details: parsed.error.flatten(),
    });
  }

  return {
    tenantId: normalizeId(parsed.data.tenantId),
    memberId: normalizeId(parsed.data.memberId),
    employmentId: normalizeId(parsed.data.employmentId),
    employmentPublicId: parsed.data.employmentPublicId || null,
    name:
      parsed.data.fullName ??
      parsed.data.displayName ??
      parsed.data.name ??
      undefined,
    email: parsed.data.email ?? parsed.data.username ?? undefined,
    employeeCode: parsed.data.employeeCode ?? undefined,
    department: parsed.data.department ?? undefined,
    designation: parsed.data.designation ?? undefined,
  };
}

function logAuthError(endpoint: string, error: unknown): void {
  if (!__DEV__) return;

  if (isApiError(error)) {
    console.error(`[authApi] ${endpoint} error:`, {
      status: error.status,
      code: error.code,
      message: error.message,
      details: error.details,
    });
    return;
  }

  console.error(`[authApi] ${endpoint} error:`, error);
}

/**
 * Executes an auth request and logs raw responses/errors in development so
 * payload mismatches and server errors are visible in Metro logs.
 */
async function executeAuthRequest<TRaw, TResult>(
  endpoint: string,
  request: () => Promise<TRaw>,
  transform: (raw: TRaw) => TResult,
): Promise<TResult> {
  try {
    const raw = await request();
    if (__DEV__) {
      console.log(`[authApi] ${endpoint} response:`, raw);
    }
    return transform(raw);
  } catch (error) {
    logAuthError(endpoint, error);
    throw error;
  }
}

export const authApi = {
  async signIn(payload: SignInPayload): Promise<AuthTokenResponse> {
    return executeAuthRequest(
      'POST /api/v1/auth/login',
      () =>
        apiRequest<unknown>('/api/v1/auth/login', {
          method: 'POST',
          auth: false,
          body: {
            username: payload.username,
            password: payload.password,
          },
        }),
      normalizeAuthResponse,
    );
  },

  async listMyOrganizations(accessTokenOverride?: string): Promise<OrganizationOption[]> {
    return executeAuthRequest(
      'GET /api/v1/auth/organizations',
      () =>
        apiRequest<unknown>('/api/v1/auth/organizations', {
          method: 'GET',
          accessTokenOverride,
        }),
      parseOrganizationsResponse,
    );
  },

  async switchOrganization(
    tenantId: EntityId,
    accessTokenOverride?: string,
  ): Promise<AuthTokenResponse> {
    return executeAuthRequest(
      'POST /api/v1/auth/switch-organization',
      () =>
        apiRequest<unknown>('/api/v1/auth/switch-organization', {
          method: 'POST',
          accessTokenOverride,
          body: { tenantId },
        }),
      normalizeAuthResponse,
    );
  },

  async loadStaffSession(accessTokenOverride?: string): Promise<StaffSession> {
    return executeAuthRequest(
      'GET /api/v1/auth/session',
      () =>
        apiRequest<unknown>('/api/v1/auth/session', {
          method: 'GET',
          accessTokenOverride,
        }),
      parseStaffSessionResponse,
    );
  },

  async refreshSession(refreshToken: string): Promise<AuthTokenResponse> {
    return executeAuthRequest(
      'POST /api/v1/auth/refresh',
      () =>
        apiRequest<unknown>('/api/v1/auth/refresh', {
          method: 'POST',
          auth: false,
          skipAuthRefresh: true,
          body: { refreshToken },
        }),
      normalizeAuthResponse,
    );
  },

  async revokeSession(refreshToken: string): Promise<void> {
    return executeAuthRequest(
      'POST /api/v1/auth/revoke-session',
      () =>
        apiRequest<unknown>('/api/v1/auth/revoke-session', {
          method: 'POST',
          auth: false,
          skipAuthRefresh: true,
          timeoutMs: 5000,
          body: { refreshToken },
        }),
      () => undefined,
    );
  },
};
