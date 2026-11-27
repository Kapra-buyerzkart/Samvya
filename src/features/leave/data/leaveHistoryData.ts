import { type pieDataItem } from 'react-native-gifted-charts';
import { type LeaveRequestHistoryItem } from '../api/leaveApi';

export type DurationKey = '3months' | '6months' | '1year';

export interface DurationOption {
  key: DurationKey;
  label: string;
  dateRange: string;
  totalDays: number;
}

export interface MonthSegment {
  key: string;
  label: string;
  days: number;
  color: string;
}

export interface LeaveHistoryRecord {
  id: string;
  dateDisplay: string;
  monthDisplay: string;
  durationDays: number;
  durationLabel: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  reasonTitle: string;
  reasonDescription: string;
  monthKey: string;
  leaveType?: string;
}

export interface LeaveDurationData {
  totalDays: number;
  totalApprovedDays?: number;
  months: MonthSegment[];
  records: LeaveHistoryRecord[];
}

export interface LeavePieDataItem extends pieDataItem {
  monthKey: string;
  monthLabel: string;
  daysLabel: string;
  showInnerLabel: boolean;
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

const MONTH_COLORS = [
  '#E0E7FF',
  '#C7D2FE',
  '#DBEAFE',
  '#BFDBFE',
  '#93C5FD',
  '#60A5FA',
  '#3B82F6',
  '#2563EB',
  '#1D4ED8',
  '#1E40AF',
  '#1E3A8A',
  '#172554',
] as const;

const LIGHT_SLICE_COLORS = new Set(['#93C5FD', '#DBEAFE', '#E0E7FF', '#C7D2FE', '#BFDBFE']);

function getWindowBounds(
  duration: DurationKey,
  referenceDate: Date,
): { start: Date; end: Date; monthCount: number } {
  const monthCount = duration === '3months' ? 3 : duration === '6months' ? 6 : 12;
  const end = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59, 999);
  const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - (monthCount - 1), 1, 0, 0, 0, 0);
  return { start, end, monthCount };
}

function formatWindowRangeLabel(start: Date, end: Date): string {
  const startMonth = SHORT_MONTHS[start.getMonth()] ?? 'Jan';
  const endMonth = SHORT_MONTHS[end.getMonth()] ?? 'Dec';
  if (start.getFullYear() === end.getFullYear()) {
    return `${startMonth}-${endMonth} ${end.getFullYear()}`;
  }
  return `${startMonth} ${start.getFullYear()}-${endMonth} ${end.getFullYear()}`;
}

function parseItemDate(raw: string | undefined): Date | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  const ymdMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (ymdMatch) {
    const year = Number(ymdMatch[1]);
    const month = Number(ymdMatch[2]);
    const day = Number(ymdMatch[3]);
    if (Number.isInteger(year) && Number.isInteger(month) && Number.isInteger(day)) {
      return new Date(year, month - 1, day);
    }
  }
  const ms = Date.parse(trimmed);
  return Number.isFinite(ms) ? new Date(ms) : null;
}

function normalizeStatus(rawStatus: string): 'Approved' | 'Pending' | 'Rejected' {
  const normalized = rawStatus.trim().toLowerCase();
  if (
    normalized.includes('reject') ||
    normalized.includes('declin') ||
    normalized.includes('deni') ||
    normalized.includes('cancel') ||
    normalized.includes('withdraw')
  ) {
    return 'Rejected';
  }
  if (normalized.includes('approv')) {
    return 'Approved';
  }
  return 'Pending';
}

function formatDateDisplay(start: Date, end: Date | null): string {
  const startDay = String(start.getDate()).padStart(2, '0');
  if (!end || (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth() && start.getDate() === end.getDate())) {
    return startDay;
  }
  const endDay = String(end.getDate()).padStart(2, '0');
  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
    return `${startDay}-${endDay}`;
  }
  const startMon = SHORT_MONTHS[start.getMonth()] ?? '';
  const endMon = SHORT_MONTHS[end.getMonth()] ?? '';
  return `${startDay} ${startMon}-${endDay} ${endMon}`;
}

function formatDurationLabel(days: number): string {
  const rounded = Number(days.toFixed(1));
  return `${rounded} ${rounded === 1 ? 'day' : 'days'}`;
}

export function buildDurationOptions(
  requests: LeaveRequestHistoryItem[],
  referenceDate: Date = new Date(),
): DurationOption[] {
  const configs: { key: DurationKey; label: string }[] = [
    { key: '3months', label: 'Last 3 months' },
    { key: '6months', label: 'Last 6 months' },
    { key: '1year', label: 'Last 1 year' },
  ];

  return configs.map(({ key, label }) => {
    const { start, end } = getWindowBounds(key, referenceDate);
    let approvedDays = 0;

    for (const item of requests) {
      const itemDate = parseItemDate(item.startDate) ?? parseItemDate(item.createdAtUtc);
      if (!itemDate || itemDate < start || itemDate > end) continue;
      if (normalizeStatus(item.status) === 'Approved') {
        approvedDays += item.totalDaysApplied ?? 0;
      }
    }

    return {
      key,
      label,
      dateRange: formatWindowRangeLabel(start, end),
      totalDays: Number(approvedDays.toFixed(1)),
    };
  });
}

export function buildLeaveDataForDuration(
  requests: LeaveRequestHistoryItem[],
  duration: DurationKey,
  referenceDate: Date = new Date(),
): LeaveDurationData {
  const { start, end, monthCount } = getWindowBounds(duration, referenceDate);

  const inWindow: { item: LeaveRequestHistoryItem; date: Date }[] = [];
  for (const item of requests) {
    const date = parseItemDate(item.startDate) ?? parseItemDate(item.createdAtUtc);
    if (!date || date < start || date > end) continue;
    inWindow.push({ item, date });
  }

  inWindow.sort((a, b) => b.date.getTime() - a.date.getTime());

  const monthBuckets = new Map<string, { label: string; days: number; order: number }>();
  for (let i = 0; i < monthCount; i++) {
    const mDate = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const key = `${mDate.getFullYear()}-${String(mDate.getMonth() + 1).padStart(2, '0')}`;
    const label = SHORT_MONTHS[mDate.getMonth()] ?? 'Jan';
    monthBuckets.set(key, { label, days: 0, order: i });
  }

  let totalApprovedDays = 0;
  const records: LeaveHistoryRecord[] = inWindow.map(({ item, date }, idx) => {
    const endDate = parseItemDate(item.endDate);
    const status = normalizeStatus(item.status);
    const durationDays = item.totalDaysApplied ?? 1;
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthDisplay = SHORT_MONTHS[date.getMonth()] ?? 'Jan';

    if (status === 'Approved') {
      totalApprovedDays += durationDays;
    }

    const bucket = monthBuckets.get(monthKey);
    if (bucket && status !== 'Rejected') {
      bucket.days += durationDays;
    }

    return {
      id: item.leaveRequestId !== null && item.leaveRequestId !== undefined
        ? String(item.leaveRequestId)
        : `leave-${idx}`,
      dateDisplay: formatDateDisplay(date, endDate),
      monthDisplay,
      durationDays,
      durationLabel: formatDurationLabel(durationDays),
      status,
      reasonTitle: 'Reason requested',
      reasonDescription: item.reason?.trim() || 'No reason provided',
      monthKey,
      leaveType: item.leaveTypeName,
    };
  });

  const activeBuckets = Array.from(monthBuckets.entries()).filter(([, b]) => b.days > 0);
  const months: MonthSegment[] = activeBuckets.map(([key, b], idx) => {
    const colorIndex = Math.min(
      MONTH_COLORS.length - 1,
      Math.max(0, MONTH_COLORS.length - activeBuckets.length + idx),
    );
    return {
      key,
      label: b.label,
      days: Number(b.days.toFixed(1)),
      color: MONTH_COLORS[colorIndex] ?? '#1D4ED8',
    };
  });

  const roundedApproved = Number(totalApprovedDays.toFixed(1));
  return {
    totalDays: roundedApproved,
    totalApprovedDays: roundedApproved,
    months,
    records,
  };
}

export function buildPieChartData(
  months: MonthSegment[],
  selectedMonth: string,
  onSelectMonth: (monthKey: string) => void,
): LeavePieDataItem[] {
  const ordered = [...months].reverse();
  const total = ordered.reduce((sum, m) => sum + m.days, 0);

  return ordered.map((m, idx) => {
    const isLatest = idx === 0;
    const isSmall = m.days <= 0.5;
    const percentage = total > 0 ? (m.days / total) * 100 : 0;
    const showInnerLabel = ordered.length <= 4 || (percentage >= 7 && m.days >= 1);

    const daysLabel = isSmall ? `${m.days}d` : `${m.days} ${m.days === 1 ? 'day' : 'days'}`;

    return {
      value: m.days,
      color: m.color,
      text: `${m.label} · ${daysLabel}`,
      textColor: LIGHT_SLICE_COLORS.has(m.color) ? '#0F172A' : '#FFFFFF',
      textSize: isLatest || m.key === selectedMonth ? 12 : isSmall ? 9 : 11,
      fontWeight: 'bold',
      focused: false,
      monthKey: m.key,
      monthLabel: m.label,
      daysLabel,
      showInnerLabel,
      strokeWidth: 2,
      strokeColor: '#FFFFFF',
      onPress: () => onSelectMonth(m.key),
    };
  });
}
