import { z } from 'zod';
import { apiRequest, isApiError } from '@/shared/api';
import { type EntityId } from '@/features/auth';
import {
  type AttendanceBarStatus,
  type DayWorkHours,
  type MonthlyWorkHoursSummary,
} from '@/features/employment/domain/types';

export type PunchType = 'IN' | 'OUT';

export interface PunchRequestPayload {
  employmentId: EntityId;
  punchTimeUtc: string;
  punchType: PunchType;
}

export interface PunchResponse {
  id: EntityId | null;
  employmentId: EntityId | null;
  punchTimeUtc: string;
  punchType: PunchType;
  status?: string;
  message?: string;
  raw: unknown;
}

export interface EmploymentDateRangeQuery {
  employmentId: EntityId;
  fromDate: string;
  toDate: string;
}

export interface EmploymentMonthlyAttendanceQuery {
  employmentId: EntityId;
  year: number;
  month: number; // 1-12
}

export interface AttendanceRangeRecord {
  dateKey: string; // YYYY-MM-DD
  status: 'approved' | 'pending' | 'rejected';
  hasAttendanceData?: boolean;
  isWeekend?: boolean;
  isHoliday?: boolean;
  punchInTimeUtc: string | null;
  punchOutTimeUtc: string | null;
  punchInDisplay: string;
  punchInPeriod: string;
  punchOutDisplay: string;
  punchOutPeriod: string;
  workedMinutes: number;
  subtitle: string;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'] as const;

export function formatLocalDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function getMonthDateRange(
  year: number,
  month: number,
): { fromDate: string; toDate: string } {
  const daysInMonth = new Date(year, month, 0).getDate();
  return {
    fromDate: formatLocalDateKey(year, month, 1),
    toDate: formatLocalDateKey(year, month, daysInMonth),
  };
}

export function getWeekDateRange(referenceDate: Date = new Date()): {
  fromDate: string;
  toDate: string;
  days: { id: string; shortLabel: string; dateLabel: string; dateKey: string }[];
  todayDayId: string;
} {
  const WEEK_IDS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
  const SHORT_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
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

  const currentDay = referenceDate.getDay();
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate() + diffToMonday,
  );

  const days = WEEK_IDS.map((id, idx) => {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + idx);
    const shortLabel = SHORT_LABELS[idx] ?? 'Mon';
    const dayStr = String(d.getDate()).padStart(2, '0');
    const monthStr = SHORT_MONTHS[d.getMonth()] ?? 'Jan';
    return {
      id,
      shortLabel,
      dateLabel: `${shortLabel}, ${dayStr} ${monthStr}`,
      dateKey: formatLocalDateKey(d.getFullYear(), d.getMonth() + 1, d.getDate()),
    };
  });

  const todayIndex = currentDay === 0 ? 6 : currentDay - 1;
  return {
    fromDate: days[0]!.dateKey,
    toDate: days[6]!.dateKey,
    days,
    todayDayId: WEEK_IDS[todayIndex] ?? 'mon',
  };
}

const idSchema = z.union([z.string(), z.number()]);

const rawPunchResponseSchema = z
  .object({
    id: idSchema.nullable().optional(),
    punchId: idSchema.nullable().optional(),
    attendancePunchId: idSchema.nullable().optional(),
    employmentId: idSchema.nullable().optional(),
    punchTimeUtc: z.string().nullable().optional(),
    punchType: z.enum(['IN', 'OUT']).nullable().optional(),
    status: z.string().nullable().optional(),
    message: z.string().nullable().optional(),
  })
  .passthrough();

const numericOrStringSchema = z.union([z.number(), z.string()]).nullable().optional();

const rawNestedPunchSchema = z
  .object({
    punchType: z.string().nullable().optional(),
    type: z.string().nullable().optional(),
    direction: z.string().nullable().optional(),
    eventType: z.string().nullable().optional(),
    punchTimeUtc: z.string().nullable().optional(),
    punchTime: z.string().nullable().optional(),
    timeUtc: z.string().nullable().optional(),
    time: z.string().nullable().optional(),
    occurredAtUtc: z.string().nullable().optional(),
    timestamp: z.union([z.string(), z.number()]).nullable().optional(),
  })
  .passthrough();

const rawAttendanceRecordSchema = z
  .object({
    day: numericOrStringSchema,
    dayOfMonth: numericOrStringSchema,
    dayNumber: numericOrStringSchema,
    businessDate: z.string().nullable().optional(),
    date: z.string().nullable().optional(),
    attendanceDate: z.string().nullable().optional(),
    workDate: z.string().nullable().optional(),
    punchDate: z.string().nullable().optional(),
    dayDate: z.string().nullable().optional(),
    calendarDate: z.string().nullable().optional(),
    logDate: z.string().nullable().optional(),
    punchTimeUtc: z.string().nullable().optional(),
    punchTime: z.string().nullable().optional(),
    punchType: z.string().nullable().optional(),
    punchInUtc: z.string().nullable().optional(),
    punchInTimeUtc: z.string().nullable().optional(),
    firstPunchInUtc: z.string().nullable().optional(),
    firstInUtc: z.string().nullable().optional(),
    inTimeUtc: z.string().nullable().optional(),
    checkInTimeUtc: z.string().nullable().optional(),
    punchIn: z.string().nullable().optional(),
    inTime: z.string().nullable().optional(),
    firstIn: z.string().nullable().optional(),
    checkInTime: z.string().nullable().optional(),
    checkIn: z.string().nullable().optional(),
    startTime: z.string().nullable().optional(),
    punchOutUtc: z.string().nullable().optional(),
    punchOutTimeUtc: z.string().nullable().optional(),
    lastPunchOutUtc: z.string().nullable().optional(),
    lastOutUtc: z.string().nullable().optional(),
    outTimeUtc: z.string().nullable().optional(),
    checkOutTimeUtc: z.string().nullable().optional(),
    punchOut: z.string().nullable().optional(),
    outTime: z.string().nullable().optional(),
    lastOut: z.string().nullable().optional(),
    checkOutTime: z.string().nullable().optional(),
    checkOut: z.string().nullable().optional(),
    endTime: z.string().nullable().optional(),
    workedHours: numericOrStringSchema,
    hoursWorked: numericOrStringSchema,
    netHours: numericOrStringSchema,
    netWorkedHours: numericOrStringSchema,
    totalWorkedHours: numericOrStringSchema,
    effectiveHours: numericOrStringSchema,
    loggedHours: numericOrStringSchema,
    totalHours: numericOrStringSchema,
    hours: numericOrStringSchema,
    workedMinutes: numericOrStringSchema,
    minutesWorked: numericOrStringSchema,
    netMinutes: numericOrStringSchema,
    netWorkedMinutes: numericOrStringSchema,
    totalWorkedMinutes: numericOrStringSchema,
    payableMinutes: numericOrStringSchema,
    effectiveMinutes: numericOrStringSchema,
    loggedMinutes: numericOrStringSchema,
    totalMinutes: numericOrStringSchema,
    durationMinutes: numericOrStringSchema,
    workedSeconds: numericOrStringSchema,
    secondsWorked: numericOrStringSchema,
    netSeconds: numericOrStringSchema,
    netWorkedSeconds: numericOrStringSchema,
    totalSeconds: numericOrStringSchema,
    durationSeconds: numericOrStringSchema,
    workedDuration: z.string().nullable().optional(),
    totalDuration: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    approvalStatus: z.string().nullable().optional(),
    attendanceStatus: z.string().nullable().optional(),
    dayStatus: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    isPresent: z.boolean().nullable().optional(),
    isAbsent: z.boolean().nullable().optional(),
    isLeave: z.boolean().nullable().optional(),
    isHoliday: z.boolean().nullable().optional(),
    isWeekend: z.boolean().nullable().optional(),
    isToday: z.boolean().nullable().optional(),
    holidayName: z.string().nullable().optional(),
    note: z.string().nullable().optional(),
    subtitle: z.string().nullable().optional(),
    remarks: z.string().nullable().optional(),
    comment: z.string().nullable().optional(),
    punchCount: numericOrStringSchema,
    punches: z.array(rawNestedPunchSchema).nullable().optional(),
    logs: z.array(rawNestedPunchSchema).nullable().optional(),
    punchLogs: z.array(rawNestedPunchSchema).nullable().optional(),
    entries: z.array(rawNestedPunchSchema).nullable().optional(),
  })
  .passthrough();

type RawAttendanceRecord = z.infer<typeof rawAttendanceRecordSchema>;

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

function extractRecordsArray(raw: unknown): unknown[] {
  const unwrapped = unwrapPayload(raw);
  if (Array.isArray(unwrapped)) {
    return unwrapped;
  }
  if (isPlainRecord(unwrapped)) {
    for (const key of [
      'days',
      'dailyRecords',
      'records',
      'items',
      'attendances',
      'entries',
      'punches',
      'results',
      'data',
    ]) {
      if (Array.isArray(unwrapped[key])) {
        return unwrapped[key] as unknown[];
      }
    }
  }
  return [];
}

function toFiniteNumber(value: string | number | null | undefined): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function parseDurationStringMinutes(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const hmsMatch = /^(\d{1,3}):(\d{1,2})(?::(\d{1,2}))?$/.exec(trimmed);
  if (hmsMatch) {
    const hrs = Number(hmsMatch[1]);
    const mins = Number(hmsMatch[2]);
    const secs = hmsMatch[3] ? Number(hmsMatch[3]) : 0;
    if (Number.isFinite(hrs) && Number.isFinite(mins) && Number.isFinite(secs)) {
      return Math.max(0, Math.round(hrs * 60 + mins + secs / 60));
    }
  }

  const hmTextMatch = /^(?:(\d+)\s*h(?:rs?|ours?)?)?\s*(?:(\d+)\s*m(?:ins?|inutes?)?)?$/i.exec(
    trimmed,
  );
  if (hmTextMatch && (hmTextMatch[1] || hmTextMatch[2])) {
    const hrs = Number(hmTextMatch[1] ?? 0);
    const mins = Number(hmTextMatch[2] ?? 0);
    if (Number.isFinite(hrs) && Number.isFinite(mins)) {
      return Math.max(0, Math.round(hrs * 60 + mins));
    }
  }

  return null;
}

function parseTimestampMs(
  raw: string | number | null | undefined,
  fallbackDateKey?: string | null,
): number | null {
  if (raw === null || raw === undefined || raw === '') return null;
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? raw : null;
  }
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const timeOnlyMatch = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(trimmed);
  if (timeOnlyMatch && fallbackDateKey) {
    const dateParts = fallbackDateKey.split('-');
    const year = Number(dateParts[0]);
    const month = Number(dateParts[1]);
    const day = Number(dateParts[2]);
    const hours = Number(timeOnlyMatch[1]);
    const mins = Number(timeOnlyMatch[2]);
    const secs = timeOnlyMatch[3] ? Number(timeOnlyMatch[3]) : 0;
    if (
      Number.isInteger(year) &&
      Number.isInteger(month) &&
      Number.isInteger(day) &&
      hours >= 0 &&
      hours <= 23 &&
      mins >= 0 &&
      mins <= 59
    ) {
      return new Date(year, month - 1, day, hours, mins, secs).getTime();
    }
  }

  const parsed = Date.parse(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseCalendarDateKey(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  const datePrefixMatch = /^(\d{4}-\d{2}-\d{2})(?:$|T00:00:00(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$| )/.exec(
    trimmed,
  );
  if (datePrefixMatch?.[1]) {
    return datePrefixMatch[1];
  }
  return parseDateKeyFromString(trimmed);
}

function parseDateKeyFromString(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  const datePrefixMatch = /^(\d{4}-\d{2}-\d{2})/.exec(trimmed);
  if (datePrefixMatch && !trimmed.includes('T')) {
    return datePrefixMatch[1] ?? null;
  }
  const ms = Date.parse(trimmed);
  if (!Number.isFinite(ms)) {
    return datePrefixMatch?.[1] ?? null;
  }
  const d = new Date(ms);
  return formatLocalDateKey(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

function parseDayNumberField(raw: string | number | null | undefined): number | null {
  if (typeof raw === 'number') {
    return Number.isInteger(raw) && raw >= 1 && raw <= 31 ? raw : null;
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (/^\d{1,2}$/.test(trimmed)) {
      const n = Number(trimmed);
      return n >= 1 && n <= 31 ? n : null;
    }
  }
  return null;
}

function collectRecordPunches(
  rec: RawAttendanceRecord,
  dateKey?: string | null,
): { inMs: number | null; outMs: number | null } {
  const rawIn =
    rec.punchInUtc ??
    rec.punchInTimeUtc ??
    rec.firstPunchInUtc ??
    rec.firstInUtc ??
    rec.inTimeUtc ??
    rec.checkInTimeUtc ??
    rec.punchIn ??
    rec.inTime ??
    rec.firstIn ??
    rec.checkInTime ??
    rec.checkIn ??
    rec.startTime;
  const rawOut =
    rec.punchOutUtc ??
    rec.punchOutTimeUtc ??
    rec.lastPunchOutUtc ??
    rec.lastOutUtc ??
    rec.outTimeUtc ??
    rec.checkOutTimeUtc ??
    rec.punchOut ??
    rec.outTime ??
    rec.lastOut ??
    rec.checkOutTime ??
    rec.checkOut ??
    rec.endTime;

  let inMs = parseTimestampMs(rawIn, dateKey);
  let outMs = parseTimestampMs(rawOut, dateKey);

  const singlePunchTime = rec.punchTimeUtc ?? rec.punchTime;
  if (singlePunchTime && rec.punchType) {
    const punchMs = parseTimestampMs(singlePunchTime, dateKey);
    const upperType = rec.punchType.toUpperCase();
    if (upperType === 'IN' && punchMs !== null && inMs === null) {
      inMs = punchMs;
    } else if (upperType === 'OUT' && punchMs !== null && outMs === null) {
      outMs = punchMs;
    }
  }

  const punchLists = [rec.punches, rec.logs, rec.punchLogs, rec.entries];
  for (const list of punchLists) {
    if (!Array.isArray(list)) continue;
    for (const p of list) {
      const pMs = parseTimestampMs(
        p.punchTimeUtc ?? p.punchTime ?? p.timeUtc ?? p.occurredAtUtc ?? p.timestamp ?? p.time,
        dateKey,
      );
      const upperType = (p.punchType ?? p.type ?? p.direction ?? p.eventType ?? '').toUpperCase();
      if (pMs === null) continue;
      if ((upperType === 'IN' || upperType === 'CHECK_IN') && (inMs === null || pMs < inMs)) {
        inMs = pMs;
      }
      if ((upperType === 'OUT' || upperType === 'CHECK_OUT') && (outMs === null || pMs > outMs)) {
        outMs = pMs;
      }
    }
  }

  return { inMs, outMs };
}

function resolveRecordDateKey(
  rec: RawAttendanceRecord,
  fallbackRange?: { fromDate: string; toDate: string },
): string | null {
  const stringDayField =
    typeof rec.day === 'string' && /^\d{4}-\d{2}-\d{2}/.test(rec.day.trim()) ? rec.day : null;
  const calendarDate = parseCalendarDateKey(
    rec.businessDate ??
      rec.date ??
      rec.attendanceDate ??
      rec.workDate ??
      rec.punchDate ??
      rec.dayDate ??
      rec.calendarDate ??
      rec.logDate ??
      stringDayField,
  );
  if (calendarDate) {
    return calendarDate;
  }

  const timestampDate = parseDateKeyFromString(
    rec.punchInUtc ??
      rec.punchInTimeUtc ??
      rec.firstPunchInUtc ??
      rec.firstInUtc ??
      rec.inTimeUtc ??
      rec.checkInTimeUtc ??
      rec.punchTimeUtc ??
      rec.punchTime ??
      rec.punchIn ??
      rec.checkInTime,
  );
  if (timestampDate) {
    return timestampDate;
  }

  for (const list of [rec.punches, rec.logs, rec.punchLogs, rec.entries]) {
    if (!Array.isArray(list)) continue;
    for (const p of list) {
      const punchDate = parseDateKeyFromString(
        p.punchTimeUtc ?? p.punchTime ?? p.timeUtc ?? p.occurredAtUtc,
      );
      if (punchDate) return punchDate;
    }
  }

  const dayNum =
    parseDayNumberField(rec.day) ??
    parseDayNumberField(rec.dayOfMonth) ??
    parseDayNumberField(rec.dayNumber);
  if (dayNum !== null && fallbackRange) {
    const fromPrefix = fallbackRange.fromDate.slice(0, 7);
    const toPrefix = fallbackRange.toDate.slice(0, 7);
    if (fromPrefix === toPrefix && /^\d{4}-\d{2}$/.test(fromPrefix)) {
      const [yStr, mStr] = fromPrefix.split('-');
      return formatLocalDateKey(Number(yStr), Number(mStr), dayNum);
    }
  }

  return null;
}

function formatWorkedMinutesCompact(totalMinutes: number): string {
  const safe = Math.max(0, Math.round(totalMinutes));
  if (safe === 0) return '0h';
  const hrs = Math.floor(safe / 60);
  const mins = safe % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

function formatTotalMonthlyHours(totalMinutes: number): string {
  const safe = Math.max(0, Math.round(totalMinutes));
  if (safe === 0) return '0hrs';
  const hrs = Math.floor(safe / 60);
  const mins = safe % 60;
  return mins > 0 ? `${hrs}hrs ${mins}m` : `${hrs}hrs`;
}

function formatTimeDisplay12h(ms: number | null): { time: string; period: string } {
  if (ms === null) {
    return { time: '—', period: 'Not recorded' };
  }
  const dateObj = new Date(ms);
  const rawHours = dateObj.getHours();
  const mins = String(dateObj.getMinutes()).padStart(2, '0');
  const ampm = rawHours >= 12 ? 'PM' : 'AM';
  const hours12 = String(rawHours % 12 || 12).padStart(2, '0');
  const period = rawHours < 12 ? 'Morning' : rawHours < 17 ? 'Afternoon' : 'Evening';
  return {
    time: `${hours12}:${mins} ${ampm}`,
    period,
  };
}

function mapApprovalStatus(
  rawStatus: string | null | undefined,
  hasIn: boolean,
  hasOut: boolean,
): 'approved' | 'pending' | 'rejected' {
  const normalized = (rawStatus ?? '').trim().toLowerCase();
  if (
    normalized.includes('reject') ||
    normalized.includes('declin') ||
    normalized.includes('deni')
  ) {
    return 'rejected';
  }
  if (
    normalized.includes('pend') ||
    normalized.includes('open') ||
    normalized.includes('review') ||
    normalized.includes('in_progress') ||
    normalized.includes('incomplete') ||
    normalized.includes('missing_out') ||
    normalized.includes('checked_in') ||
    normalized.includes('punched_in')
  ) {
    return 'pending';
  }
  if (hasIn && !hasOut) return 'pending';
  return 'approved';
}

function inferHasAttendanceData(
  rec: RawAttendanceRecord,
  hasIn: boolean,
  hasOut: boolean,
  workedMinutes: number,
  approvalStatus: 'approved' | 'pending' | 'rejected',
): boolean {
  if (hasIn || hasOut || workedMinutes > 0 || rec.isPresent === true) {
    return true;
  }
  const punchCount = toFiniteNumber(rec.punchCount);
  if (punchCount !== null && punchCount > 0) {
    return true;
  }
  if (rec.isAbsent === true || rec.isLeave === true || rec.isWeekend === true || rec.isHoliday === true) {
    return false;
  }
  const rawStatus = (
    rec.approvalStatus ??
    rec.attendanceStatus ??
    rec.dayStatus ??
    rec.status ??
    rec.state ??
    ''
  )
    .trim()
    .toLowerCase();

  if (
    !rawStatus ||
    rawStatus.includes('absent') ||
    rawStatus.includes('no_entry') ||
    rawStatus.includes('no_punch') ||
    rawStatus.includes('weekend') ||
    rawStatus.includes('holiday') ||
    rawStatus.includes('leave') ||
    rawStatus.includes('unmarked') ||
    rawStatus.includes('rest') ||
    rawStatus === 'off' ||
    rawStatus === 'none'
  ) {
    return false;
  }

  return (
    approvalStatus === 'pending' ||
    rawStatus.includes('present') ||
    rawStatus.includes('approv') ||
    rawStatus.includes('record') ||
    rawStatus.includes('complet') ||
    rawStatus.includes('regular') ||
    rawStatus.includes('on_time') ||
    rawStatus.includes('late') ||
    rawStatus.includes('half') ||
    rawStatus.includes('partial') ||
    rawStatus === 'full'
  );
}

function mapMonthlyBarStatus(
  rawStatus: string | null | undefined,
  workedMinutes: number,
): AttendanceBarStatus {
  const normalized = (rawStatus ?? '').trim().toLowerCase();
  if (
    normalized === 'absent' ||
    normalized === 'no_entry' ||
    normalized === 'no_punch' ||
    normalized === 'weekend' ||
    normalized === 'holiday' ||
    normalized === 'leave' ||
    normalized === 'off' ||
    normalized === 'none'
  ) {
    return 'no_entry';
  }
  if (
    normalized === 'lesser' ||
    normalized === 'partial' ||
    normalized === 'half_day' ||
    normalized === 'short' ||
    normalized === 'incomplete' ||
    normalized === 'pending'
  ) {
    return workedMinutes > 0 ? 'lesser' : 'no_entry';
  }
  if (
    normalized === 'recorded' ||
    normalized === 'present' ||
    normalized === 'full' ||
    normalized === 'approved' ||
    normalized === 'completed' ||
    normalized === 'regularized' ||
    normalized === 'on_time'
  ) {
    if (workedMinutes >= 480) return 'recorded';
    return workedMinutes > 0 ? 'lesser' : 'no_entry';
  }
  if (workedMinutes >= 480) return 'recorded';
  if (workedMinutes > 0) return 'lesser';
  return 'no_entry';
}

function extractWorkedMinutes(record: RawAttendanceRecord, dateKey?: string | null): number {
  const rawMinutes =
    toFiniteNumber(record.workedMinutes) ??
    toFiniteNumber(record.minutesWorked) ??
    toFiniteNumber(record.netWorkedMinutes) ??
    toFiniteNumber(record.totalWorkedMinutes) ??
    toFiniteNumber(record.netMinutes) ??
    toFiniteNumber(record.payableMinutes) ??
    toFiniteNumber(record.effectiveMinutes) ??
    toFiniteNumber(record.loggedMinutes) ??
    toFiniteNumber(record.totalMinutes) ??
    toFiniteNumber(record.durationMinutes);
  if (rawMinutes !== null) {
    return Math.max(0, Math.round(rawMinutes));
  }

  const rawSeconds =
    toFiniteNumber(record.workedSeconds) ??
    toFiniteNumber(record.secondsWorked) ??
    toFiniteNumber(record.netWorkedSeconds) ??
    toFiniteNumber(record.netSeconds) ??
    toFiniteNumber(record.totalSeconds) ??
    toFiniteNumber(record.durationSeconds);
  if (rawSeconds !== null) {
    return Math.max(0, Math.round(rawSeconds / 60));
  }

  const rawHours =
    toFiniteNumber(record.workedHours) ??
    toFiniteNumber(record.hoursWorked) ??
    toFiniteNumber(record.netWorkedHours) ??
    toFiniteNumber(record.totalWorkedHours) ??
    toFiniteNumber(record.netHours) ??
    toFiniteNumber(record.effectiveHours) ??
    toFiniteNumber(record.loggedHours) ??
    toFiniteNumber(record.totalHours) ??
    toFiniteNumber(record.hours);
  if (rawHours !== null) {
    return Math.max(0, Math.round(rawHours * 60));
  }

  const parsedDuration =
    parseDurationStringMinutes(record.workedDuration) ??
    parseDurationStringMinutes(record.totalDuration);
  if (parsedDuration !== null) {
    return parsedDuration;
  }

  const { inMs, outMs } = collectRecordPunches(record, dateKey);
  if (inMs !== null && outMs !== null && outMs > inMs) {
    return Math.round((outMs - inMs) / 60000);
  }

  return 0;
}

function normalizePunchResponse(raw: unknown, sent: PunchRequestPayload): PunchResponse {
  const unwrapped = unwrapPayload(raw);
  const parsed = rawPunchResponseSchema.safeParse(unwrapped);

  if (!parsed.success) {
    return {
      id: null,
      employmentId: sent.employmentId,
      punchTimeUtc: sent.punchTimeUtc,
      punchType: sent.punchType,
      message: typeof raw === 'string' && raw.trim() ? raw.trim() : undefined,
      raw,
    };
  }

  const data = parsed.data;
  return {
    id: data.id ?? data.punchId ?? data.attendancePunchId ?? null,
    employmentId: data.employmentId ?? sent.employmentId,
    punchTimeUtc: data.punchTimeUtc || sent.punchTimeUtc,
    punchType: data.punchType ?? sent.punchType,
    status: data.status ?? undefined,
    message: data.message ?? undefined,
    raw,
  };
}

function normalizeMonthlyAttendanceResponse(
  raw: unknown,
  query: EmploymentMonthlyAttendanceQuery,
): MonthlyWorkHoursSummary {
  const unwrapped = unwrapPayload(raw);
  const rootObj =
    unwrapped && typeof unwrapped === 'object' && !Array.isArray(unwrapped)
      ? (unwrapped as Record<string, unknown>)
      : {};

  const items = extractRecordsArray(raw);
  const dayMap = new Map<number, RawAttendanceRecord>();

  for (const item of items) {
    const parsed = rawAttendanceRecordSchema.safeParse(item);
    if (!parsed.success) continue;
    const rec = parsed.data;

    let dayNum =
      parseDayNumberField(rec.day) ??
      parseDayNumberField(rec.dayOfMonth) ??
      parseDayNumberField(rec.dayNumber);
    if (dayNum === null) {
      const dateKey = resolveRecordDateKey(rec);
      if (dateKey) {
        const parts = dateKey.split('-');
        const parsedYear = Number(parts[0]);
        const parsedMonth = Number(parts[1]);
        const parsedDay = Number(parts[2]);
        if (
          parsedYear === query.year &&
          parsedMonth === query.month &&
          Number.isInteger(parsedDay)
        ) {
          dayNum = parsedDay;
        }
      }
    }

    if (dayNum !== null && dayNum >= 1 && dayNum <= 31) {
      dayMap.set(dayNum, rec);
    }
  }

  const daysInMonth = new Date(query.year, query.month, 0).getDate();
  const today = new Date();
  const dailyRecords: DayWorkHours[] = [];
  let computedWorkingDays = 0;
  let computedDaysRecorded = 0;
  let computedTotalMinutes = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(query.year, query.month - 1, day);
    const dayKey = formatLocalDateKey(query.year, query.month, day);
    const dayOfWeek = DAY_NAMES[date.getDay()] ?? 'Mon';
    const defaultWeekend = date.getDay() === 0 || date.getDay() === 6;
    const defaultIsToday =
      today.getFullYear() === query.year &&
      today.getMonth() + 1 === query.month &&
      today.getDate() === day;

    const apiDay = dayMap.get(day);
    const isWeekend = apiDay?.isWeekend ?? defaultWeekend;
    const isHoliday = apiDay?.isHoliday ?? false;
    const isToday = apiDay?.isToday ?? defaultIsToday;

    if (!isWeekend && !isHoliday) {
      computedWorkingDays++;
    }

    const minutes = apiDay ? extractWorkedMinutes(apiDay, dayKey) : 0;
    const hours = Number((minutes / 60).toFixed(2));
    if (minutes > 0) {
      computedTotalMinutes += minutes;
      computedDaysRecorded++;
    }

    dailyRecords.push({
      day,
      dayOfWeek,
      hours,
      formattedHours: formatWorkedMinutesCompact(minutes),
      status: mapMonthlyBarStatus(
        apiDay?.attendanceStatus ?? apiDay?.dayStatus ?? apiDay?.status,
        minutes,
      ),
      isToday,
      isHoliday,
      isWeekend,
    });
  }

  const serverWorkingDays =
    typeof rootObj.workingDays === 'number'
      ? rootObj.workingDays
      : typeof rootObj.workingDaysCount === 'number'
        ? rootObj.workingDaysCount
        : computedWorkingDays;
  const serverDaysRecorded =
    typeof rootObj.daysRecorded === 'number'
      ? rootObj.daysRecorded
      : typeof rootObj.recordedDaysCount === 'number'
        ? rootObj.recordedDaysCount
        : typeof rootObj.presentDays === 'number'
          ? rootObj.presentDays
          : computedDaysRecorded;

  let serverTotalMinutes = computedTotalMinutes;
  const rootTotalMinutes =
    toFiniteNumber(rootObj.totalMinutes as string | number | null | undefined) ??
    toFiniteNumber(rootObj.totalWorkedMinutes as string | number | null | undefined) ??
    toFiniteNumber(rootObj.totalMinutesWorked as string | number | null | undefined);
  const rootTotalSeconds =
    toFiniteNumber(rootObj.totalSeconds as string | number | null | undefined) ??
    toFiniteNumber(rootObj.totalWorkedSeconds as string | number | null | undefined);
  const rootTotalHours =
    toFiniteNumber(rootObj.totalHours as string | number | null | undefined) ??
    toFiniteNumber(rootObj.totalWorkedHours as string | number | null | undefined) ??
    toFiniteNumber(rootObj.totalHoursWorked as string | number | null | undefined);

  if (rootTotalMinutes !== null) {
    serverTotalMinutes = Math.max(0, Math.round(rootTotalMinutes));
  } else if (rootTotalSeconds !== null) {
    serverTotalMinutes = Math.max(0, Math.round(rootTotalSeconds / 60));
  } else if (rootTotalHours !== null) {
    serverTotalMinutes = Math.max(0, Math.round(rootTotalHours * 60));
  }

  const totalHoursFormatted =
    typeof rootObj.totalHoursFormatted === 'string' && rootObj.totalHoursFormatted.trim()
      ? rootObj.totalHoursFormatted
      : formatTotalMonthlyHours(serverTotalMinutes);

  const monthName = `${MONTH_NAMES[query.month - 1] ?? 'November'} ${query.year}`;

  return {
    year: query.year,
    month: query.month,
    monthName,
    workingDays: serverWorkingDays,
    totalHoursFormatted,
    daysRecorded: serverDaysRecorded,
    dailyRecords,
  };
}

function normalizeAttendanceRangeResponse(
  raw: unknown,
  fallbackRange?: { fromDate: string; toDate: string },
): AttendanceRangeRecord[] {
  const items = extractRecordsArray(raw);
  const grouped = new Map<
    string,
    {
      inMs: number | null;
      outMs: number | null;
      explicitMinutes: number | null;
      statusRaw: string | null;
      subtitle: string | null;
      holidayName: string | null;
      isWeekend: boolean | undefined;
      isHoliday: boolean | undefined;
      hasAttendanceData: boolean;
      latestRec: RawAttendanceRecord;
    }
  >();

  for (const item of items) {
    const parsed = rawAttendanceRecordSchema.safeParse(item);
    if (!parsed.success) continue;
    const rec = parsed.data;

    const dateKey = resolveRecordDateKey(rec, fallbackRange);
    if (!dateKey) continue;

    const existing = grouped.get(dateKey) ?? {
      inMs: null,
      outMs: null,
      explicitMinutes: null,
      statusRaw: null,
      subtitle: null,
      holidayName: null,
      isWeekend: undefined,
      isHoliday: undefined,
      hasAttendanceData: false,
      latestRec: rec,
    };

    const { inMs, outMs } = collectRecordPunches(rec, dateKey);

    if (inMs !== null && (existing.inMs === null || inMs < existing.inMs)) {
      existing.inMs = inMs;
    }
    if (outMs !== null && (existing.outMs === null || outMs > existing.outMs)) {
      existing.outMs = outMs;
    }

    const extractedMins = extractWorkedMinutes(rec, dateKey);
    if (extractedMins > 0) {
      existing.explicitMinutes = Math.max(existing.explicitMinutes ?? 0, extractedMins);
    }

    const recStatusRaw =
      rec.approvalStatus ?? rec.attendanceStatus ?? rec.dayStatus ?? rec.status ?? rec.state;
    if (recStatusRaw) {
      existing.statusRaw = recStatusRaw;
    }
    existing.subtitle = rec.subtitle ?? rec.note ?? rec.remarks ?? rec.comment ?? existing.subtitle;
    existing.holidayName = rec.holidayName ?? existing.holidayName;
    if (typeof rec.isWeekend === 'boolean') {
      existing.isWeekend = rec.isWeekend;
    }
    if (typeof rec.isHoliday === 'boolean') {
      existing.isHoliday = rec.isHoliday;
    }
    existing.latestRec = rec;
    grouped.set(dateKey, existing);
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, agg]) => {
      const inFmt = formatTimeDisplay12h(agg.inMs);
      const outFmt = formatTimeDisplay12h(agg.outMs);
      const computedMinutes =
        agg.explicitMinutes !== null
          ? agg.explicitMinutes
          : agg.inMs !== null && agg.outMs !== null && agg.outMs > agg.inMs
            ? Math.round((agg.outMs - agg.inMs) / 60000)
            : 0;

      const status = mapApprovalStatus(agg.statusRaw, agg.inMs !== null, agg.outMs !== null);
      const hasAttendanceData = inferHasAttendanceData(
        agg.latestRec,
        agg.inMs !== null,
        agg.outMs !== null,
        computedMinutes,
        status,
      );

      let subtitle = agg.subtitle;
      if (!subtitle) {
        if (agg.isHoliday && !hasAttendanceData) {
          subtitle = agg.holidayName ?? 'Public holiday';
        } else if (agg.isWeekend && !hasAttendanceData) {
          subtitle = 'Scheduled off day';
        } else if (!hasAttendanceData) {
          subtitle = 'No attendance log recorded';
        } else if (computedMinutes > 0 && agg.inMs === null && agg.outMs === null) {
          subtitle = `${formatWorkedMinutesCompact(computedMinutes)} worked`;
        } else if (agg.inMs !== null && agg.outMs === null) {
          subtitle = 'Punch-out pending';
        } else {
          subtitle = 'Recorded via HRMS';
        }
      }

      return {
        dateKey,
        status,
        hasAttendanceData,
        isWeekend: agg.isWeekend,
        isHoliday: agg.isHoliday,
        punchInTimeUtc: agg.inMs !== null ? new Date(agg.inMs).toISOString() : null,
        punchOutTimeUtc: agg.outMs !== null ? new Date(agg.outMs).toISOString() : null,
        punchInDisplay: inFmt.time,
        punchInPeriod: inFmt.period,
        punchOutDisplay: outFmt.time,
        punchOutPeriod: outFmt.period,
        workedMinutes: computedMinutes,
        subtitle,
      };
    });
}

function logAttendanceError(endpoint: string, error: unknown): void {
  if (!__DEV__) return;

  if (isApiError(error)) {
    console.error(`[attendanceApi] ${endpoint} error:`, {
      status: error.status,
      code: error.code,
      message: error.message,
      details: error.details,
    });
    return;
  }

  console.error(`[attendanceApi] ${endpoint} error:`, error);
}

export const attendanceApi = {
  async punch(payload: PunchRequestPayload): Promise<PunchResponse> {
    const endpoint = 'POST /api/v1/attendance/punch';
    if (__DEV__) {
      console.log(`[attendanceApi] ${endpoint} request:`, payload);
    }

    try {
      const raw = await apiRequest<unknown>('/api/v1/attendance/punch', {
        method: 'POST',
        body: {
          employmentId: payload.employmentId,
          punchTimeUtc: payload.punchTimeUtc,
          punchType: payload.punchType,
        },
      });

      if (__DEV__) {
        console.log(`[attendanceApi] ${endpoint} response:`, raw);
      }

      return normalizePunchResponse(raw, payload);
    } catch (error) {
      logAttendanceError(endpoint, error);
      throw error;
    }
  },

  async getEmploymentMonthlyAttendance(
    query: EmploymentMonthlyAttendanceQuery,
  ): Promise<MonthlyWorkHoursSummary> {
    const encodedId = encodeURIComponent(String(query.employmentId));
    const search = `year=${encodeURIComponent(String(query.year))}&month=${encodeURIComponent(String(query.month))}`;
    const path = `/api/v1/attendance/employment/${encodedId}/month?${search}`;
    const endpoint = `GET ${path}`;

    if (__DEV__) {
      console.log(`[attendanceApi] ${endpoint}`);
    }

    try {
      const raw = await apiRequest<unknown>(path, { method: 'GET' });
      if (__DEV__) {
        console.log(`[attendanceApi] ${endpoint} response:`, raw);
      }
      return normalizeMonthlyAttendanceResponse(raw, query);
    } catch (error) {
      logAttendanceError(endpoint, error);
      throw error;
    }
  },

  async getEmploymentAttendanceRange(
    query: EmploymentDateRangeQuery,
  ): Promise<AttendanceRangeRecord[]> {
    const encodedId = encodeURIComponent(String(query.employmentId));
    const search = `fromDate=${encodeURIComponent(query.fromDate)}&toDate=${encodeURIComponent(query.toDate)}`;
    const path = `/api/v1/attendance/employment/${encodedId}?${search}`;
    const endpoint = `GET ${path}`;

    if (__DEV__) {
      console.log(`[attendanceApi] ${endpoint}`);
    }

    try {
      const raw = await apiRequest<unknown>(path, { method: 'GET' });
      if (__DEV__) {
        console.log(`[attendanceApi] ${endpoint} response:`, raw);
      }
      return normalizeAttendanceRangeResponse(raw, {
        fromDate: query.fromDate,
        toDate: query.toDate,
      });
    } catch (error) {
      logAttendanceError(endpoint, error);
      throw error;
    }
  },
};
