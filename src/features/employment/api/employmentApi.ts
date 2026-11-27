import { z } from 'zod';
import { apiRequest, isApiError } from '@/shared/api';
import { type EntityId } from '@/features/auth';
import { type EmploymentHistoryItem } from '../domain/types';

const NOT_SPECIFIED = 'Not specified';
const NOT_RECORDED = 'Not recorded';

const idSchema = z.union([z.string(), z.number()]);
const flexFieldSchema = z.unknown().nullable().optional();

const rawEmploymentRecordSchema = z
  .object({
    id: idSchema.nullable().optional(),
    employmentId: idSchema.nullable().optional(),
    employmentPublicId: z.string().nullable().optional(),
    publicId: z.string().nullable().optional(),
    designation: flexFieldSchema,
    designationName: flexFieldSchema,
    jobTitle: flexFieldSchema,
    roleName: flexFieldSchema,
    positionTitle: flexFieldSchema,
    position: flexFieldSchema,
    role: flexFieldSchema,
    title: flexFieldSchema,
    status: flexFieldSchema,
    employmentStatus: flexFieldSchema,
    state: flexFieldSchema,
    isActive: flexFieldSchema,
    isPrimary: flexFieldSchema,
    primary: flexFieldSchema,
    isPrimaryEmployment: flexFieldSchema,
    employeeCode: flexFieldSchema,
    staffCode: flexFieldSchema,
    employeeNumber: flexFieldSchema,
    empCode: flexFieldSchema,
    code: flexFieldSchema,
    organisation: flexFieldSchema,
    organisationName: flexFieldSchema,
    organization: flexFieldSchema,
    organizationName: flexFieldSchema,
    tenant: flexFieldSchema,
    tenantName: flexFieldSchema,
    company: flexFieldSchema,
    companyName: flexFieldSchema,
    employer: flexFieldSchema,
    employerName: flexFieldSchema,
    office: flexFieldSchema,
    officeName: flexFieldSchema,
    branch: flexFieldSchema,
    branchName: flexFieldSchema,
    location: flexFieldSchema,
    locationName: flexFieldSchema,
    workLocation: flexFieldSchema,
    workplace: flexFieldSchema,
    site: flexFieldSchema,
    siteName: flexFieldSchema,
    department: flexFieldSchema,
    departmentName: flexFieldSchema,
    deptName: flexFieldSchema,
    division: flexFieldSchema,
    team: flexFieldSchema,
    employmentType: flexFieldSchema,
    employmentTypeName: flexFieldSchema,
    employmentCategory: flexFieldSchema,
    workerType: flexFieldSchema,
    contractType: flexFieldSchema,
    engagementType: flexFieldSchema,
    category: flexFieldSchema,
    workArrangement: flexFieldSchema,
    workArrangementName: flexFieldSchema,
    workMode: flexFieldSchema,
    workStyle: flexFieldSchema,
    arrangement: flexFieldSchema,
    remoteStatus: flexFieldSchema,
    effectivePeriod: flexFieldSchema,
    effectiveFrom: flexFieldSchema,
    effectiveStartDate: flexFieldSchema,
    startDate: flexFieldSchema,
    validFrom: flexFieldSchema,
    effectiveTo: flexFieldSchema,
    effectiveEndDate: flexFieldSchema,
    endDate: flexFieldSchema,
    validTo: flexFieldSchema,
    confirmation: flexFieldSchema,
    confirmationSummary: flexFieldSchema,
    confirmationStatus: flexFieldSchema,
    confirmationDate: flexFieldSchema,
    confirmedDate: flexFieldSchema,
    confirmedOn: flexFieldSchema,
    confirmedAt: flexFieldSchema,
    probationEndDate: flexFieldSchema,
    isConfirmed: flexFieldSchema,
    confirmed: flexFieldSchema,
    joinedDate: flexFieldSchema,
    joiningDate: flexFieldSchema,
    dateOfJoining: flexFieldSchema,
    hireDate: flexFieldSchema,
    hiredAt: flexFieldSchema,
    lastWorkingDay: flexFieldSchema,
    lastWorkingDate: flexFieldSchema,
    lwd: flexFieldSchema,
    relievedDate: flexFieldSchema,
    relievingDate: flexFieldSchema,
    exitDate: flexFieldSchema,
    separationDate: flexFieldSchema,
    terminationDate: flexFieldSchema,
    offboardingDate: flexFieldSchema,
  })
  .passthrough();

export type RawEmploymentFields = z.infer<typeof rawEmploymentRecordSchema>;

export interface LoadEmploymentHistoryParams {
  memberId?: EntityId | null;
  employmentId?: EntityId | null;
  sessionFallback?: {
    designation?: string | null;
    employeeCode?: string | null;
    department?: string | null;
    joiningDate?: string | null;
  };
}

const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function unwrapObject(raw: unknown): Record<string, unknown> | null {
  let current = raw;
  for (let depth = 0; depth < 2; depth++) {
    if (!isPlainObject(current)) {
      return null;
    }
    const next = current.data ?? current.result ?? current.value ?? current.payload;
    if (isPlainObject(next)) {
      current = next;
      continue;
    }
    return current;
  }
  return isPlainObject(current) ? current : null;
}

function flattenEmploymentObject(obj: Record<string, unknown>): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...obj };
  for (const nestedKey of ['context', 'record', 'item', 'primaryEmployment', 'employment']) {
    const nested = obj[nestedKey];
    if (!isPlainObject(nested)) continue;
    for (const [key, value] of Object.entries(nested)) {
      if (value === undefined || value === null || value === '') continue;
      if (merged[key] === undefined || merged[key] === null || merged[key] === '') {
        merged[key] = value;
      }
    }
  }
  return merged;
}

function extractEmploymentsArray(raw: unknown): unknown[] {
  if (Array.isArray(raw)) {
    return raw;
  }
  const obj = unwrapObject(raw);
  if (!obj) return [];
  for (const key of [
    'employments',
    'employmentHistory',
    'history',
    'items',
    'records',
    'results',
    'list',
    'data',
  ]) {
    if (Array.isArray(obj[key])) {
      return obj[key] as unknown[];
    }
  }
  return [obj];
}

function extractTextValue(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }
  if (isPlainObject(value)) {
    for (const key of ['name', 'displayName', 'title', 'label', 'text', 'value', 'code']) {
      const candidate = value[key];
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate.trim();
      }
    }
  }
  return undefined;
}

function pickFirstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    const text = extractTextValue(value);
    if (text) {
      return text;
    }
  }
  return undefined;
}

function pickBoolean(...values: unknown[]): boolean | undefined {
  for (const value of values) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') {
      if (value === 1) return true;
      if (value === 0) return false;
    }
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
      if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
    }
  }
  return undefined;
}

function formatShortDate(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);
    const monthShort = SHORT_MONTHS[month - 1];
    if (monthShort && day >= 1 && day <= 31) {
      return `${String(day).padStart(2, '0')} ${monthShort} ${year}`;
    }
  }

  return trimmed;
}

function normalizeEmploymentStatus(
  rawStatus: string | null | undefined,
  isActive: boolean | null | undefined,
): EmploymentHistoryItem['status'] {
  const normalized = (rawStatus ?? '').trim().toLowerCase();
  if (normalized.includes('leave')) return 'On Leave';
  if (
    normalized.includes('inact') ||
    normalized.includes('reliev') ||
    normalized.includes('terminat') ||
    normalized.includes('separat') ||
    normalized.includes('exit')
  ) {
    return 'Inactive';
  }
  if (isActive === false) return 'Inactive';
  return 'Active';
}

function parseSingleEmploymentRecord(raw: unknown): RawEmploymentFields | null {
  const unwrapped = unwrapObject(raw);
  const candidate = unwrapped ? flattenEmploymentObject(unwrapped) : raw;
  const parsed = rawEmploymentRecordSchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}

function mergeEmploymentFields(
  base: RawEmploymentFields,
  overlay: RawEmploymentFields | null,
): RawEmploymentFields {
  if (!overlay) return base;
  const merged: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    if (value !== undefined && value !== null && value !== '') {
      merged[key] = value;
    }
  }
  return merged as RawEmploymentFields;
}

function mapToEmploymentHistoryItem(
  fields: RawEmploymentFields,
  index: number,
  fallback?: LoadEmploymentHistoryParams['sessionFallback'],
): EmploymentHistoryItem {
  const rawId =
    fields.employmentId ?? fields.id ?? fields.employmentPublicId ?? fields.publicId ?? index + 1;
  const joinedFormatted =
    formatShortDate(
      pickFirstString(
        fields.joinedDate,
        fields.joiningDate,
        fields.dateOfJoining,
        fields.hireDate,
        fields.hiredAt,
        fields.effectiveFrom,
        fields.effectiveStartDate,
        fields.startDate,
        fallback?.joiningDate,
      ),
    ) ?? NOT_RECORDED;

  const effectiveFromFormatted = formatShortDate(
    pickFirstString(
      fields.effectiveFrom,
      fields.effectiveStartDate,
      fields.startDate,
      fields.validFrom,
      fields.joinedDate,
      fields.joiningDate,
      fields.dateOfJoining,
      fields.hireDate,
    ),
  );
  const effectiveToFormatted = formatShortDate(
    pickFirstString(fields.effectiveTo, fields.effectiveEndDate, fields.endDate, fields.validTo),
  );
  const effectivePeriod =
    pickFirstString(fields.effectivePeriod) ??
    (effectiveFromFormatted
      ? `${effectiveFromFormatted} · ${effectiveToFormatted ?? 'Open ended'}`
      : NOT_RECORDED);

  const isConfirmedFlag = pickBoolean(fields.isConfirmed, fields.confirmed);
  const confirmationDateFormatted = formatShortDate(
    pickFirstString(
      fields.confirmationDate,
      fields.confirmedDate,
      fields.confirmedOn,
      fields.confirmedAt,
      fields.probationEndDate,
    ),
  );
  const explicitConfirmationStatus = pickFirstString(fields.confirmationStatus);
  const confirmationStatusLabel =
    explicitConfirmationStatus ?? (isConfirmedFlag === false ? 'Pending' : 'Confirmed');
  const confirmation =
    pickFirstString(fields.confirmation, fields.confirmationSummary) ??
    (confirmationDateFormatted
      ? `${confirmationStatusLabel} · ${confirmationDateFormatted}`
      : explicitConfirmationStatus
        ? explicitConfirmationStatus
        : typeof isConfirmedFlag === 'boolean'
          ? isConfirmedFlag
            ? 'Confirmed'
            : 'Probation'
          : NOT_RECORDED);

  const lastWorkingDay =
    formatShortDate(pickFirstString(fields.lastWorkingDay, fields.lastWorkingDate, fields.lwd)) ??
    NOT_RECORDED;
  const relievedDate =
    formatShortDate(
      pickFirstString(
        fields.relievedDate,
        fields.relievingDate,
        fields.exitDate,
        fields.separationDate,
        fields.terminationDate,
        fields.offboardingDate,
      ),
    ) ?? NOT_RECORDED;

  const statusText = pickFirstString(fields.status, fields.employmentStatus, fields.state);
  const isActiveFlag = pickBoolean(fields.isActive);
  const isPrimaryFlag = pickBoolean(fields.isPrimary, fields.primary, fields.isPrimaryEmployment);

  return {
    id: String(rawId),
    designation:
      pickFirstString(
        fields.designation,
        fields.designationName,
        fields.jobTitle,
        fields.roleName,
        fields.positionTitle,
        fields.position,
        fields.role,
        fields.title,
        fallback?.designation,
      ) ?? NOT_SPECIFIED,
    status: normalizeEmploymentStatus(statusText, isActiveFlag),
    isPrimary: isPrimaryFlag ?? index === 0,
    employeeCode:
      pickFirstString(
        fields.employeeCode,
        fields.staffCode,
        fields.employeeNumber,
        fields.empCode,
        fields.code,
        fallback?.employeeCode,
      ) ?? '—',
    organisation:
      pickFirstString(
        fields.organisation,
        fields.organisationName,
        fields.organization,
        fields.organizationName,
        fields.tenantName,
        fields.tenant,
        fields.companyName,
        fields.company,
        fields.employerName,
        fields.employer,
      ) ?? NOT_SPECIFIED,
    office:
      pickFirstString(
        fields.office,
        fields.officeName,
        fields.branchName,
        fields.branch,
        fields.locationName,
        fields.location,
        fields.workLocation,
        fields.workplace,
        fields.siteName,
        fields.site,
      ) ?? NOT_SPECIFIED,
    department:
      pickFirstString(
        fields.department,
        fields.departmentName,
        fields.deptName,
        fields.division,
        fields.team,
        fallback?.department,
      ) ?? NOT_SPECIFIED,
    employmentType:
      pickFirstString(
        fields.employmentType,
        fields.employmentTypeName,
        fields.employmentCategory,
        fields.workerType,
        fields.contractType,
        fields.engagementType,
        fields.category,
      ) ?? NOT_SPECIFIED,
    workArrangement:
      pickFirstString(
        fields.workArrangement,
        fields.workArrangementName,
        fields.workMode,
        fields.workStyle,
        fields.arrangement,
        fields.remoteStatus,
      ) ?? NOT_SPECIFIED,
    effectivePeriod,
    confirmation,
    joinedDate: joinedFormatted,
    lastWorkingDay,
    relievedDate,
  };
}

function logEmploymentError(endpoint: string, error: unknown): void {
  if (!__DEV__) return;

  if (isApiError(error)) {
    console.error(`[employmentApi] ${endpoint} error:`, {
      status: error.status,
      code: error.code,
      message: error.message,
      details: error.details,
    });
    return;
  }

  console.error(`[employmentApi] ${endpoint} error:`, error);
}

async function getJson(path: string): Promise<unknown> {
  const endpoint = `GET ${path}`;
  if (__DEV__) {
    console.log(`[employmentApi] ${endpoint}`);
  }
  try {
    const raw = await apiRequest<unknown>(path, { method: 'GET' });
    if (__DEV__) {
      console.log(`[employmentApi] ${endpoint} response:`, raw);
    }
    return raw;
  } catch (error) {
    logEmploymentError(endpoint, error);
    throw error;
  }
}

export const employmentApi = {
  async listMemberEmployments(memberId: EntityId): Promise<RawEmploymentFields[]> {
    const encodedId = encodeURIComponent(String(memberId));
    const raw = await getJson(`/api/v1/members/${encodedId}/employments`);
    const items = extractEmploymentsArray(raw);
    const parsed: RawEmploymentFields[] = [];
    for (const item of items) {
      const rec = parseSingleEmploymentRecord(item);
      if (rec) parsed.push(rec);
    }
    return parsed;
  },

  async getEmploymentRecord(employmentId: EntityId): Promise<RawEmploymentFields | null> {
    const encodedId = encodeURIComponent(String(employmentId));
    const raw = await getJson(`/api/v1/employments/${encodedId}`);
    return parseSingleEmploymentRecord(raw);
  },

  async getEmploymentContext(employmentId: EntityId): Promise<RawEmploymentFields | null> {
    const encodedId = encodeURIComponent(String(employmentId));
    const raw = await getJson(`/api/v1/workforce-access/employment/${encodedId}/context`);
    return parseSingleEmploymentRecord(raw);
  },

  /**
   * Loads employment history from the Postman 03 endpoints in parallel:
   * - GET /api/v1/members/{memberId}/employments
   * - GET /api/v1/employments/{employmentId}
   * - GET /api/v1/workforce-access/employment/{employmentId}/context
   */
  async loadEmploymentHistory(
    params: LoadEmploymentHistoryParams,
  ): Promise<EmploymentHistoryItem[]> {
    const { memberId, employmentId, sessionFallback } = params;
    const hasMemberId = memberId !== null && memberId !== undefined && memberId !== '';
    const hasEmploymentId =
      employmentId !== null && employmentId !== undefined && employmentId !== '';

    if (!hasMemberId && !hasEmploymentId) {
      return [];
    }

    const [listRes, recordRes, contextRes] = await Promise.allSettled([
      hasMemberId ? this.listMemberEmployments(memberId) : Promise.resolve([]),
      hasEmploymentId ? this.getEmploymentRecord(employmentId) : Promise.resolve(null),
      hasEmploymentId ? this.getEmploymentContext(employmentId) : Promise.resolve(null),
    ]);

    const allFailed =
      (!hasMemberId || listRes.status === 'rejected') &&
      (!hasEmploymentId ||
        (recordRes.status === 'rejected' && contextRes.status === 'rejected'));

    if (allFailed) {
      const firstError =
        (listRes.status === 'rejected' && listRes.reason) ||
        (recordRes.status === 'rejected' && recordRes.reason) ||
        (contextRes.status === 'rejected' && contextRes.reason);
      throw firstError;
    }

    const memberList = listRes.status === 'fulfilled' ? listRes.value : [];
    const activeRecord = recordRes.status === 'fulfilled' ? recordRes.value : null;
    const activeContext = contextRes.status === 'fulfilled' ? contextRes.value : null;
    const activeOverlay = mergeEmploymentFields(activeRecord ?? {}, activeContext);

    if (memberList.length > 0) {
      const targetIdStr = hasEmploymentId ? String(employmentId) : null;
      let matchedActive = false;

      const items = memberList.map((entry, idx) => {
        const entryId =
          entry.employmentId ?? entry.id ?? entry.employmentPublicId ?? entry.publicId;
        const isActiveEntry =
          targetIdStr !== null && entryId !== null && entryId !== undefined
            ? String(entryId) === targetIdStr
            : idx === 0;

        if (isActiveEntry) {
          matchedActive = true;
          return mapToEmploymentHistoryItem(
            mergeEmploymentFields(entry, activeOverlay),
            idx,
            sessionFallback,
          );
        }
        return mapToEmploymentHistoryItem(entry, idx);
      });

      if (!matchedActive && hasEmploymentId && (activeRecord || activeContext)) {
        items.unshift(mapToEmploymentHistoryItem(activeOverlay, 0, sessionFallback));
      }

      return items;
    }

    if (!activeRecord && !activeContext) {
      return [];
    }

    return [mapToEmploymentHistoryItem(activeOverlay, 0, sessionFallback)];
  },
};
