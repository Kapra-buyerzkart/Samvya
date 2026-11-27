import { z } from 'zod';
import { apiRequest, isApiError } from '@/shared/api';
import { type EntityId } from '@/features/auth';

export interface EligibleLeaveType {
  id: EntityId;
  name: string;
  code?: string;
  allocatedDays?: number;
  takenDays?: number;
  pendingDays?: number;
  availableDays?: number;
  allowHalfDay?: boolean;
}

export interface LeaveTypeBalance {
  leaveTypeId: EntityId | null;
  leaveTypeName?: string;
  leaveTypeCode?: string;
  allocated: number;
  taken: number;
  pending: number;
  available: number;
}

export interface LeaveBalancesResponse {
  allocated: number;
  taken: number;
  pending: number;
  available: number;
  byType: LeaveTypeBalance[];
}

export interface SubmitLeaveRequestPayload {
  employmentId: EntityId;
  leaveTypeId: EntityId;
  startDate: string;
  endDate: string;
  isHalfDayStart: boolean;
  isHalfDayEnd: boolean;
  totalDaysApplied: number;
  reason: string;
  requestId: string;
  overlapConfirmation?: string;
  replacesRequestId?: EntityId;
  appealsRequestId?: EntityId;
}

export interface SubmitLeaveResponse {
  leaveRequestId: EntityId | null;
  status?: string;
  message?: string;
  overlapConfirmationRequired?: string;
  raw: unknown;
}

export interface LeaveRequestHistoryItem {
  leaveRequestId: EntityId | null;
  leaveTypeId: EntityId | null;
  leaveTypeName?: string;
  startDate?: string;
  endDate?: string;
  totalDaysApplied?: number;
  isHalfDayStart?: boolean;
  isHalfDayEnd?: boolean;
  status: string;
  reason?: string;
  createdAtUtc?: string;
  decidedAtUtc?: string;
  approverName?: string;
  decisionNote?: string;
}

export interface LeaveCalendarMonthItem {
  dateKey: string;
  status: string;
  leaveTypeId?: EntityId | null;
  leaveTypeName?: string;
}

export interface LeaveLedgerEntry {
  id: EntityId | null;
  leaveTypeId: EntityId | null;
  leaveTypeName?: string;
  entryType: string;
  days: number;
  createdAtUtc?: string;
}

const idSchema = z.union([z.string(), z.number()]);
const numericOrStringSchema = z.union([z.number(), z.string()]).nullable().optional();

const rawLeaveTypeSchema = z
  .object({
    id: idSchema.nullable().optional(),
    leaveTypeId: idSchema.nullable().optional(),
    typeId: idSchema.nullable().optional(),
    name: z.string().nullable().optional(),
    leaveTypeName: z.string().nullable().optional(),
    displayName: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    label: z.string().nullable().optional(),
    code: z.string().nullable().optional(),
    leaveTypeCode: z.string().nullable().optional(),
    allocated: numericOrStringSchema,
    allocatedDays: numericOrStringSchema,
    totalDays: numericOrStringSchema,
    taken: numericOrStringSchema,
    takenDays: numericOrStringSchema,
    usedDays: numericOrStringSchema,
    pending: numericOrStringSchema,
    pendingDays: numericOrStringSchema,
    available: numericOrStringSchema,
    availableDays: numericOrStringSchema,
    balance: numericOrStringSchema,
    balanceDays: numericOrStringSchema,
    allowHalfDay: z.boolean().nullable().optional(),
    supportsHalfDay: z.boolean().nullable().optional(),
  })
  .passthrough();

const rawBalanceItemSchema = z
  .object({
    leaveTypeId: idSchema.nullable().optional(),
    id: idSchema.nullable().optional(),
    typeId: idSchema.nullable().optional(),
    leaveTypeName: z.string().nullable().optional(),
    leaveTypeTitle: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    label: z.string().nullable().optional(),
    leaveTypeCode: z.string().nullable().optional(),
    shortCode: z.string().nullable().optional(),
    code: z.string().nullable().optional(),
    allocated: numericOrStringSchema,
    allocatedDays: numericOrStringSchema,
    totalDays: numericOrStringSchema,
    totalLeaves: numericOrStringSchema,
    entitledDays: numericOrStringSchema,
    entitlement: numericOrStringSchema,
    entitlementDays: numericOrStringSchema,
    quota: numericOrStringSchema,
    totalQuota: numericOrStringSchema,
    totalEntitlement: numericOrStringSchema,
    annualQuota: numericOrStringSchema,
    openingBalance: numericOrStringSchema,
    accrued: numericOrStringSchema,
    accruedDays: numericOrStringSchema,
    carriedForward: numericOrStringSchema,
    carryForwardDays: numericOrStringSchema,
    carriedOverDays: numericOrStringSchema,
    taken: numericOrStringSchema,
    takenDays: numericOrStringSchema,
    used: numericOrStringSchema,
    usedDays: numericOrStringSchema,
    consumed: numericOrStringSchema,
    consumedDays: numericOrStringSchema,
    leavesTaken: numericOrStringSchema,
    approved: numericOrStringSchema,
    approvedDays: numericOrStringSchema,
    availed: numericOrStringSchema,
    availedDays: numericOrStringSchema,
    utilized: numericOrStringSchema,
    utilizedDays: numericOrStringSchema,
    deductedDays: numericOrStringSchema,
    pending: numericOrStringSchema,
    pendingDays: numericOrStringSchema,
    pendingApprovalDays: numericOrStringSchema,
    requestedDays: numericOrStringSchema,
    awaitingApprovalDays: numericOrStringSchema,
    reservedDays: numericOrStringSchema,
    available: numericOrStringSchema,
    availableDays: numericOrStringSchema,
    availableBalance: numericOrStringSchema,
    balance: numericOrStringSchema,
    balanceDays: numericOrStringSchema,
    balanceLeaves: numericOrStringSchema,
    closingBalance: numericOrStringSchema,
    currentBalance: numericOrStringSchema,
    netBalance: numericOrStringSchema,
    remaining: numericOrStringSchema,
    remainingDays: numericOrStringSchema,
    remainingBalance: numericOrStringSchema,
    leftDays: numericOrStringSchema,
    daysLeft: numericOrStringSchema,
  })
  .passthrough();

const rawLeaveRequestSchema = z
  .object({
    leaveRequestId: idSchema.nullable().optional(),
    id: idSchema.nullable().optional(),
    leaveTypeId: idSchema.nullable().optional(),
    leaveTypeName: z.string().nullable().optional(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
    totalDaysApplied: numericOrStringSchema,
    isHalfDayStart: z.boolean().nullable().optional(),
    isHalfDayEnd: z.boolean().nullable().optional(),
    status: z.string().nullable().optional(),
    reason: z.string().nullable().optional(),
    createdAtUtc: z.string().nullable().optional(),
    decidedAtUtc: z.string().nullable().optional(),
    approvedAtUtc: z.string().nullable().optional(),
    rejectedAtUtc: z.string().nullable().optional(),
    updatedAtUtc: z.string().nullable().optional(),
    approverName: z.string().nullable().optional(),
    reviewerName: z.string().nullable().optional(),
    decidedByName: z.string().nullable().optional(),
    decisionNote: z.string().nullable().optional(),
    rejectionReason: z.string().nullable().optional(),
    rejectReason: z.string().nullable().optional(),
  })
  .passthrough();

const rawSubmitResponseSchema = z
  .object({
    leaveRequestId: idSchema.nullable().optional(),
    id: idSchema.nullable().optional(),
    requestId: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    message: z.string().nullable().optional(),
    code: z.string().nullable().optional(),
    overlapConfirmation: z.string().nullable().optional(),
  })
  .passthrough();

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function unwrapPayload(raw: unknown): unknown {
  let current = raw;
  for (let depth = 0; depth < 2; depth++) {
    if (!isPlainRecord(current)) {
      return current;
    }
    const next = current.data ?? current.result ?? current.value ?? current.payload;
    if (next !== undefined && next !== null && typeof next === 'object') {
      current = next;
      continue;
    }
    return current;
  }
  return current;
}

function extractArray(raw: unknown, preferredKeys: string[]): unknown[] {
  const unwrapped = unwrapPayload(raw);
  if (Array.isArray(unwrapped)) {
    return unwrapped;
  }
  if (isPlainRecord(unwrapped)) {
    for (const key of preferredKeys) {
      if (Array.isArray(unwrapped[key])) {
        return unwrapped[key] as unknown[];
      }
    }
  }
  return [];
}

function toNumber(value: string | number | null | undefined): number | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function pickText(...values: unknown[]): string | undefined {
  for (const val of values) {
    if (typeof val === 'string' && val.trim()) {
      return val.trim();
    }
    if (isPlainRecord(val)) {
      for (const key of ['name', 'displayName', 'title', 'label', 'code']) {
        const candidate = val[key];
        if (typeof candidate === 'string' && candidate.trim()) {
          return candidate.trim();
        }
      }
    }
  }
  return undefined;
}

function extractOverlapTokenFromValue(value: unknown): string | null {
  if (typeof value === 'string') {
    const match = /LEAVE_OVERLAP:([^\s"',}]+)/i.exec(value);
    if (match?.[1]) {
      return match[1];
    }
    return null;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const token = extractOverlapTokenFromValue(item);
      if (token) return token;
    }
    return null;
  }
  if (isPlainRecord(value)) {
    if (
      typeof value.overlapConfirmation === 'string' &&
      value.overlapConfirmation.trim()
    ) {
      return value.overlapConfirmation.trim();
    }
    for (const val of Object.values(value)) {
      const token = extractOverlapTokenFromValue(val);
      if (token) return token;
    }
  }
  return null;
}

export function extractLeaveOverlapConfirmation(errorOrPayload: unknown): string | null {
  if (isApiError(errorOrPayload)) {
    return (
      extractOverlapTokenFromValue(errorOrPayload.code) ??
      extractOverlapTokenFromValue(errorOrPayload.message) ??
      extractOverlapTokenFromValue(errorOrPayload.details)
    );
  }
  return extractOverlapTokenFromValue(errorOrPayload);
}

function normalizeBalanceEntry(raw: Record<string, unknown>): LeaveTypeBalance | null {
  const nestedType = isPlainRecord(raw.leaveType) ? raw.leaveType : null;
  const merged = nestedType ? { ...nestedType, ...raw } : raw;
  const parsed = rawBalanceItemSchema.safeParse(merged);
  if (!parsed.success) return null;
  const data = parsed.data;

  const leaveTypeId =
    data.leaveTypeId ??
    data.typeId ??
    (nestedType ? (nestedType.id as EntityId | undefined) : undefined) ??
    data.id ??
    null;
  const leaveTypeName = pickText(
    data.leaveTypeName,
    data.leaveTypeTitle,
    nestedType?.name,
    nestedType?.title,
    data.name,
    data.title,
    data.label,
  );
  const leaveTypeCode = pickText(
    data.leaveTypeCode,
    data.shortCode,
    nestedType?.code,
    data.code,
  );

  const explicitAllocated =
    toNumber(data.allocated) ??
    toNumber(data.allocatedDays) ??
    toNumber(data.totalDays) ??
    toNumber(data.totalLeaves) ??
    toNumber(data.entitledDays) ??
    toNumber(data.entitlement) ??
    toNumber(data.entitlementDays) ??
    toNumber(data.quota) ??
    toNumber(data.totalQuota) ??
    toNumber(data.totalEntitlement) ??
    toNumber(data.annualQuota);

  const opening = toNumber(data.openingBalance) ?? 0;
  const accrued = toNumber(data.accrued) ?? toNumber(data.accruedDays) ?? 0;
  const carried =
    toNumber(data.carriedForward) ??
    toNumber(data.carryForwardDays) ??
    toNumber(data.carriedOverDays) ??
    0;
  const hasOpeningParts =
    data.openingBalance !== undefined ||
    data.accrued !== undefined ||
    data.accruedDays !== undefined ||
    data.carriedForward !== undefined ||
    data.carryForwardDays !== undefined ||
    data.carriedOverDays !== undefined;

  const taken =
    toNumber(data.taken) ??
    toNumber(data.takenDays) ??
    toNumber(data.used) ??
    toNumber(data.usedDays) ??
    toNumber(data.consumed) ??
    toNumber(data.consumedDays) ??
    toNumber(data.leavesTaken) ??
    toNumber(data.approved) ??
    toNumber(data.approvedDays) ??
    toNumber(data.availed) ??
    toNumber(data.availedDays) ??
    toNumber(data.utilized) ??
    toNumber(data.utilizedDays) ??
    toNumber(data.deductedDays) ??
    0;

  const pending =
    toNumber(data.pending) ??
    toNumber(data.pendingDays) ??
    toNumber(data.pendingApprovalDays) ??
    toNumber(data.requestedDays) ??
    toNumber(data.awaitingApprovalDays) ??
    toNumber(data.reservedDays) ??
    0;

  const explicitAvailable =
    toNumber(data.available) ??
    toNumber(data.availableDays) ??
    toNumber(data.availableBalance) ??
    toNumber(data.balance) ??
    toNumber(data.balanceDays) ??
    toNumber(data.balanceLeaves) ??
    toNumber(data.closingBalance) ??
    toNumber(data.currentBalance) ??
    toNumber(data.netBalance) ??
    toNumber(data.remaining) ??
    toNumber(data.remainingDays) ??
    toNumber(data.remainingBalance) ??
    toNumber(data.leftDays) ??
    toNumber(data.daysLeft);

  let allocated =
    explicitAllocated ?? (hasOpeningParts ? opening + accrued + carried : 0);
  const available = explicitAvailable ?? Math.max(0, allocated - taken - pending);

  if (explicitAllocated === undefined && !hasOpeningParts && (available > 0 || taken > 0 || pending > 0)) {
    allocated = taken + pending + available;
  }

  return {
    leaveTypeId,
    leaveTypeName,
    leaveTypeCode,
    allocated,
    taken,
    pending,
    available,
  };
}

function logLeaveRequest(endpoint: string, payload?: unknown): number {
  const startedAt = Date.now();
  if (__DEV__) {
    if (payload !== undefined) {
      console.log(`[leaveApi] -> ${endpoint} request:`, payload);
    } else {
      console.log(`[leaveApi] -> ${endpoint}`);
    }
  }
  return startedAt;
}

function logLeaveResponse(
  endpoint: string,
  startedAt: number,
  raw: unknown,
  normalized?: unknown,
): void {
  if (!__DEV__) return;
  const durationMs = Date.now() - startedAt;
  console.log(`[leaveApi] <- ${endpoint} (${durationMs}ms) raw response:`, raw);
  if (normalized !== undefined) {
    console.log(`[leaveApi] <- ${endpoint} normalized:`, normalized);
  }
}

function logLeaveError(endpoint: string, startedAt: number, error: unknown): void {
  if (!__DEV__) return;
  const durationMs = Date.now() - startedAt;
  if (isApiError(error)) {
    console.error(`[leaveApi] !! ${endpoint} (${durationMs}ms) error:`, {
      status: error.status,
      code: error.code,
      message: error.message,
      details: error.details,
    });
    return;
  }
  console.error(`[leaveApi] !! ${endpoint} (${durationMs}ms) error:`, error);
}

export const leaveApi = {
  async getEligibleLeaveTypes(employmentId: EntityId): Promise<EligibleLeaveType[]> {
    const encodedId = encodeURIComponent(String(employmentId));
    const path = `/api/v1/workforce-access/employment/${encodedId}/leave-types`;
    const endpoint = `GET ${path}`;
    const startedAt = logLeaveRequest(endpoint);

    try {
      const raw = await apiRequest<unknown>(path, { method: 'GET' });

      const items = extractArray(raw, ['leaveTypes', 'items', 'records', 'results', 'data']);
      const normalized: EligibleLeaveType[] = [];

      for (const item of items) {
        if (!isPlainRecord(item)) continue;
        const nested = isPlainRecord(item.leaveType) ? item.leaveType : null;
        const candidate = nested ? { ...nested, ...item } : item;
        const parsed = rawLeaveTypeSchema.safeParse(candidate);
        if (!parsed.success) continue;
        const data = parsed.data;
        const id = data.leaveTypeId ?? data.id ?? data.typeId;
        const name = pickText(data.leaveTypeName, data.name, data.displayName, data.title, data.label);
        if (id === null || id === undefined || id === '' || !name) continue;

        normalized.push({
          id,
          name,
          code: pickText(data.leaveTypeCode, data.code),
          allocatedDays:
            toNumber(data.allocated) ?? toNumber(data.allocatedDays) ?? toNumber(data.totalDays),
          takenDays: toNumber(data.taken) ?? toNumber(data.takenDays) ?? toNumber(data.usedDays),
          pendingDays: toNumber(data.pending) ?? toNumber(data.pendingDays),
          availableDays:
            toNumber(data.available) ??
            toNumber(data.availableDays) ??
            toNumber(data.balance) ??
            toNumber(data.balanceDays),
          allowHalfDay: data.allowHalfDay ?? data.supportsHalfDay ?? undefined,
        });
      }

      logLeaveResponse(endpoint, startedAt, raw, normalized);
      return normalized;
    } catch (error) {
      logLeaveError(endpoint, startedAt, error);
      throw error;
    }
  },

  async getLeaveBalances(
    employmentId: EntityId,
    year: number = new Date().getFullYear(),
  ): Promise<LeaveBalancesResponse> {
    const encodedId = encodeURIComponent(String(employmentId));
    const path = `/api/v1/leaves/employment/${encodedId}/balances?year=${encodeURIComponent(String(year))}`;
    const endpoint = `GET ${path}`;
    const startedAt = logLeaveRequest(endpoint);

    try {
      const raw = await apiRequest<unknown>(path, { method: 'GET' });

      const rawArray = extractArray(raw, [
        'balances',
        'leaveBalances',
        'leaveTypes',
        'typeBalances',
        'entitlements',
        'summaries',
        'entries',
        'items',
        'records',
        'results',
        'data',
      ]);
      const byType: LeaveTypeBalance[] = [];

      for (const entry of rawArray) {
        if (!isPlainRecord(entry)) continue;
        const parsed = normalizeBalanceEntry(entry);
        if (parsed) {
          byType.push(parsed);
        }
      }

      const unwrapped = unwrapPayload(raw);
      if (byType.length === 0 && isPlainRecord(unwrapped)) {
        const single = normalizeBalanceEntry(unwrapped);
        if (single) {
          const singleSummary: LeaveBalancesResponse = {
            allocated: single.allocated,
            taken: single.taken,
            pending: single.pending,
            available: single.available,
            byType: single.leaveTypeId !== null || single.leaveTypeName ? [single] : [],
          };
          logLeaveResponse(endpoint, startedAt, raw, singleSummary);
          return singleSummary;
        }
      }

      const rootObj = isPlainRecord(unwrapped) ? unwrapped : {};
      const allocated =
        toNumber(rootObj.totalAllocated as string | number | null | undefined) ??
        toNumber(rootObj.allocated as string | number | null | undefined) ??
        byType.reduce((sum, item) => sum + item.allocated, 0);
      const taken =
        toNumber(rootObj.totalTaken as string | number | null | undefined) ??
        toNumber(rootObj.taken as string | number | null | undefined) ??
        byType.reduce((sum, item) => sum + item.taken, 0);
      const pending =
        toNumber(rootObj.totalPending as string | number | null | undefined) ??
        toNumber(rootObj.pending as string | number | null | undefined) ??
        byType.reduce((sum, item) => sum + item.pending, 0);
      const available =
        toNumber(rootObj.totalAvailable as string | number | null | undefined) ??
        toNumber(rootObj.available as string | number | null | undefined) ??
        byType.reduce((sum, item) => sum + item.available, 0);

      const summary: LeaveBalancesResponse = {
        allocated,
        taken,
        pending,
        available,
        byType,
      };
      logLeaveResponse(endpoint, startedAt, raw, summary);
      return summary;
    } catch (error) {
      logLeaveError(endpoint, startedAt, error);
      throw error;
    }
  },

  async getLeaveRequests(employmentId: EntityId): Promise<LeaveRequestHistoryItem[]> {
    const encodedId = encodeURIComponent(String(employmentId));
    const path = `/api/v1/leaves/employment/${encodedId}/requests`;
    const endpoint = `GET ${path}`;
    const startedAt = logLeaveRequest(endpoint);

    try {
      const raw = await apiRequest<unknown>(path, { method: 'GET' });

      const items = extractArray(raw, [
        'requests',
        'leaveRequests',
        'entries',
        'items',
        'records',
        'data',
      ]);
      const normalized: LeaveRequestHistoryItem[] = [];

      for (const entry of items) {
        if (!isPlainRecord(entry)) continue;
        const parsed = rawLeaveRequestSchema.safeParse(entry);
        if (!parsed.success) continue;
        const data = parsed.data;
        normalized.push({
          leaveRequestId: data.leaveRequestId ?? data.id ?? null,
          leaveTypeId: data.leaveTypeId ?? null,
          leaveTypeName: pickText(data.leaveTypeName, entry.leaveType),
          startDate: data.startDate ?? undefined,
          endDate: data.endDate ?? undefined,
          totalDaysApplied: toNumber(data.totalDaysApplied),
          isHalfDayStart: data.isHalfDayStart ?? undefined,
          isHalfDayEnd: data.isHalfDayEnd ?? undefined,
          status: (
            pickText(data.status, entry.requestState, entry.leaveStatus, entry.approvalStatus) ??
            'PENDING'
          ).trim(),
          reason: data.reason ?? undefined,
          createdAtUtc: pickText(data.createdAtUtc, entry.requestDate) ?? undefined,
          decidedAtUtc:
            pickText(
              data.decidedAtUtc,
              data.approvedAtUtc,
              data.rejectedAtUtc,
              data.updatedAtUtc,
            ) ?? undefined,
          approverName:
            pickText(
              data.approverName,
              data.reviewerName,
              data.decidedByName,
              entry.approvedBy,
              entry.approver,
              entry.reviewer,
            ) ?? undefined,
          decisionNote:
            pickText(
              data.decisionNote,
              data.rejectionReason,
              data.rejectReason,
              entry.approverNote,
              entry.comment,
              entry.remarks,
            ) ?? undefined,
        });
      }

      logLeaveResponse(endpoint, startedAt, raw, normalized);
      return normalized;
    } catch (error) {
      logLeaveError(endpoint, startedAt, error);
      throw error;
    }
  },

  async getLeaveCalendarMonth(
    employmentId: EntityId,
    year: number,
    month: number,
  ): Promise<LeaveCalendarMonthItem[]> {
    const encodedId = encodeURIComponent(String(employmentId));
    const path = `/api/v1/leaves/employment/${encodedId}/month?year=${encodeURIComponent(String(year))}&month=${encodeURIComponent(String(month))}`;
    const endpoint = `GET ${path}`;
    const startedAt = logLeaveRequest(endpoint);

    try {
      const raw = await apiRequest<unknown>(path, { method: 'GET' });
      const items = extractArray(raw, [
        'entries',
        'days',
        'calendar',
        'items',
        'records',
        'leaves',
        'data',
      ]);
      const normalized: LeaveCalendarMonthItem[] = [];
      const monthPrefix = `${year}-${String(month).padStart(2, '0')}-`;

      for (const entry of items) {
        if (!isPlainRecord(entry)) continue;
        const status = pickText(
          entry.status,
          entry.requestState,
          entry.leaveStatus,
          entry.approvalStatus,
        );
        if (!status) continue;

        const leaveTypeId = (entry.leaveTypeId ?? entry.typeId ?? null) as EntityId | null;
        const leaveTypeName = pickText(entry.leaveTypeName, entry.leaveType);
        const trimmedStatus = status.trim();

        const rawStart = pickText(entry.startDate, entry.fromDate);
        const rawEnd = pickText(entry.endDate, entry.toDate);
        if (rawStart) {
          const startKey = rawStart.slice(0, 10);
          const endKey = (rawEnd ?? rawStart).slice(0, 10);
          const [sy, sm, sd] = startKey.split('-').map((v) => parseInt(v, 10));
          const [ey, em, ed] = endKey.split('-').map((v) => parseInt(v, 10));
          if (sy && sm && sd && ey && em && ed) {
            const cursor = new Date(sy, sm - 1, sd);
            const end = new Date(ey, em - 1, ed);
            let guard = 0;
            while (cursor <= end && guard < 62) {
              const dk = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
              if (dk.startsWith(monthPrefix)) {
                normalized.push({
                  dateKey: dk,
                  status: trimmedStatus,
                  leaveTypeId,
                  leaveTypeName,
                });
              }
              cursor.setDate(cursor.getDate() + 1);
              guard += 1;
            }
            continue;
          }
        }

        const rawDate = pickText(entry.date, entry.dateKey, entry.leaveDate, entry.dayDate);
        const dayNum = toNumber(entry.day as string | number | undefined);
        const dateKey =
          rawDate?.slice(0, 10) ??
          (dayNum !== undefined
            ? `${year}-${String(month).padStart(2, '0')}-${String(Math.round(dayNum)).padStart(2, '0')}`
            : undefined);
        if (!dateKey) continue;

        normalized.push({
          dateKey,
          status: trimmedStatus,
          leaveTypeId,
          leaveTypeName,
        });
      }

      logLeaveResponse(endpoint, startedAt, raw, normalized);
      return normalized;
    } catch (error) {
      logLeaveError(endpoint, startedAt, error);
      throw error;
    }
  },

  async getLeaveLedger(
    employmentId: EntityId,
    year: number = new Date().getFullYear(),
  ): Promise<LeaveLedgerEntry[]> {
    const encodedId = encodeURIComponent(String(employmentId));
    const path = `/api/v1/leaves/employment/${encodedId}/ledger?year=${encodeURIComponent(String(year))}`;
    const endpoint = `GET ${path}`;
    const startedAt = logLeaveRequest(endpoint);

    try {
      const raw = await apiRequest<unknown>(path, { method: 'GET' });
      const items = extractArray(raw, ['entries', 'ledger', 'items', 'records', 'data']);
      const normalized: LeaveLedgerEntry[] = [];

      for (const entry of items) {
        if (!isPlainRecord(entry)) continue;
        const entryType = pickText(entry.entryType, entry.transactionType, entry.type, entry.reason);
        const days = toNumber(
          (entry.days ?? entry.deltaDays ?? entry.amount ?? entry.change) as
            | string
            | number
            | undefined,
        );
        if (!entryType && days === undefined) continue;

        normalized.push({
          id: (entry.ledgerEntryId ?? entry.id ?? null) as EntityId | null,
          leaveTypeId: (entry.leaveTypeId ?? entry.typeId ?? null) as EntityId | null,
          leaveTypeName: pickText(entry.leaveTypeName, entry.leaveType),
          entryType: entryType ?? 'ADJUSTMENT',
          days: days ?? 0,
          createdAtUtc: pickText(entry.createdAtUtc, entry.effectiveDate),
        });
      }

      logLeaveResponse(endpoint, startedAt, raw, normalized);
      return normalized;
    } catch (error) {
      logLeaveError(endpoint, startedAt, error);
      throw error;
    }
  },

  async submitLeaveRequest(payload: SubmitLeaveRequestPayload): Promise<SubmitLeaveResponse> {
    const endpoint = 'POST /api/v1/leaves/submit';
    const body: Record<string, unknown> = {
      employmentId: payload.employmentId,
      leaveTypeId: payload.leaveTypeId,
      startDate: payload.startDate,
      endDate: payload.endDate,
      isHalfDayStart: payload.isHalfDayStart,
      isHalfDayEnd: payload.isHalfDayEnd,
      totalDaysApplied: payload.totalDaysApplied,
      reason: payload.reason,
      requestId: payload.requestId,
    };
    if (payload.overlapConfirmation) {
      body.overlapConfirmation = payload.overlapConfirmation;
    }
    if (payload.replacesRequestId !== undefined && payload.replacesRequestId !== null) {
      body.replacesRequestId = payload.replacesRequestId;
    }
    if (payload.appealsRequestId !== undefined && payload.appealsRequestId !== null) {
      body.appealsRequestId = payload.appealsRequestId;
    }

    const startedAt = logLeaveRequest(endpoint, body);

    try {
      const raw = await apiRequest<unknown>('/api/v1/leaves/submit', {
        method: 'POST',
        body,
      });

      const overlapToken = extractOverlapTokenFromValue(raw);
      const unwrapped = unwrapPayload(raw);
      const parsed = rawSubmitResponseSchema.safeParse(unwrapped);

      if (!parsed.success) {
        const result: SubmitLeaveResponse = {
          leaveRequestId: null,
          overlapConfirmationRequired: overlapToken ?? undefined,
          raw,
        };
        logLeaveResponse(endpoint, startedAt, raw, {
          leaveRequestId: result.leaveRequestId,
          overlapConfirmationRequired: result.overlapConfirmationRequired,
        });
        return result;
      }

      const data = parsed.data;
      const result: SubmitLeaveResponse = {
        leaveRequestId: data.leaveRequestId ?? data.id ?? null,
        status: data.status ?? undefined,
        message: data.message ?? undefined,
        overlapConfirmationRequired: overlapToken ?? undefined,
        raw,
      };
      logLeaveResponse(endpoint, startedAt, raw, {
        leaveRequestId: result.leaveRequestId,
        status: result.status,
        message: result.message,
        overlapConfirmationRequired: result.overlapConfirmationRequired,
      });
      return result;
    } catch (error) {
      logLeaveError(endpoint, startedAt, error);
      throw error;
    }
  },

  async withdrawLeaveRequest(leaveRequestId: EntityId, reason: string): Promise<void> {
    const encodedId = encodeURIComponent(String(leaveRequestId));
    const path = `/api/v1/leaves/${encodedId}/withdraw`;
    const endpoint = `POST ${path}`;
    const body = { reason };
    const startedAt = logLeaveRequest(endpoint, body);

    try {
      const raw = await apiRequest<unknown>(path, {
        method: 'POST',
        body,
      });
      logLeaveResponse(endpoint, startedAt, raw);
    } catch (error) {
      logLeaveError(endpoint, startedAt, error);
      throw error;
    }
  },

  async cancelLeaveRequest(
    leaveRequestId: EntityId,
    requestId: string,
    reason: string,
  ): Promise<void> {
    const encodedId = encodeURIComponent(String(leaveRequestId));
    const path = `/api/v1/leaves/${encodedId}/cancel`;
    const endpoint = `POST ${path}`;
    const body = { requestId, reason };
    const startedAt = logLeaveRequest(endpoint, body);

    try {
      const raw = await apiRequest<unknown>(path, {
        method: 'POST',
        body,
      });
      logLeaveResponse(endpoint, startedAt, raw);
    } catch (error) {
      logLeaveError(endpoint, startedAt, error);
      throw error;
    }
  },
};
