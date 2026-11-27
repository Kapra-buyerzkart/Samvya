import { type LeaveBalancesResponse } from '@/features/leave';

export interface WeeklyDayWorkItem {
  id: string;
  shortLabel: string;
  dateLabel: string;
  hours: number;
  formattedHours: string;
  status: 'recorded' | 'partial' | 'upcoming';
}

export interface LeaveBalanceRingItem {
  key: 'sick' | 'earned' | 'casual' | string;
  label: string;
  remaining: number;
  total: number;
  formattedRemaining: string;
  targetLabel: string;
  progress: number;
  ringColor: string;
}

export interface HolidayItem {
  id: string;
  name: string;
  dateLabel: string;
  dayName: string;
  type: 'Public Holiday' | 'Company Holiday';
  observed: boolean;
}

export interface PayslipPreviewSummary {
  monthLabel: string;
  netPay: string;
  grossEarnings: string;
  deductions: string;
  payDate: string;
  status: 'Scheduled' | 'Processed';
}

export const WEEKLY_WORK_TARGET_HOURS = 40;
export const WEEKLY_WORK_LOGGED_MINUTES = 15 * 60 + 48; // 15h 48m

export const WEEKLY_DAILY_RECORDS: WeeklyDayWorkItem[] = [
  { id: 'mon', shortLabel: 'Mon', dateLabel: 'Mon, 06 Nov', hours: 6.2, formattedHours: '6h 12m', status: 'recorded' },
  { id: 'tue', shortLabel: 'Tue', dateLabel: 'Tue, 07 Nov', hours: 6.6, formattedHours: '6h 36m', status: 'recorded' },
  { id: 'wed', shortLabel: 'Wed', dateLabel: 'Wed, 08 Nov', hours: 3.0, formattedHours: '3h 00m', status: 'partial' },
  { id: 'thu', shortLabel: 'Thu', dateLabel: 'Thu, 09 Nov', hours: 0, formattedHours: '0h 00m', status: 'upcoming' },
  { id: 'fri', shortLabel: 'Fri', dateLabel: 'Fri, 10 Nov', hours: 0, formattedHours: '0h 00m', status: 'upcoming' },
  { id: 'sat', shortLabel: 'Sat', dateLabel: 'Sat, 11 Nov', hours: 0, formattedHours: '0h 00m', status: 'upcoming' },
  { id: 'sun', shortLabel: 'Sun', dateLabel: 'Sun, 12 Nov', hours: 0, formattedHours: '0h 00m', status: 'upcoming' },
];

export const HOME_LEAVE_RINGS: LeaveBalanceRingItem[] = [
  {
    key: 'sick',
    label: 'Sick leaves',
    remaining: 3,
    total: 5,
    formattedRemaining: '03',
    targetLabel: 'Of 5 days',
    progress: 3 / 5,
    ringColor: '#F59E0B',
  },
  {
    key: 'earned',
    label: 'Earned leaves',
    remaining: 10,
    total: 10,
    formattedRemaining: '10',
    targetLabel: 'Of 10 days',
    progress: 1,
    ringColor: '#00B86B',
  },
  {
    key: 'casual',
    label: 'Casual leaves',
    remaining: 1,
    total: 5,
    formattedRemaining: '01',
    targetLabel: 'Of 5 days',
    progress: 1 / 5,
    ringColor: '#EF4444',
  },
];

export const HOME_HOLIDAY_CALENDAR: HolidayItem[] = [
  { id: 'hol-12', name: 'Christmas Day', dateLabel: '25 Dec 2026', dayName: 'Fri', type: 'Public Holiday', observed: false },
  { id: 'hol-11', name: 'Year-End Company Day', dateLabel: '31 Dec 2026', dayName: 'Thu', type: 'Company Holiday', observed: false },
  { id: 'hol-10', name: 'Winter Founders Day', dateLabel: '24 Nov 2026', dayName: 'Tue', type: 'Company Holiday', observed: false },
  { id: 'hol-9', name: 'Diwali', dateLabel: '08 Nov 2026', dayName: 'Sun', type: 'Public Holiday', observed: true },
  { id: 'hol-8', name: 'Gandhi Jayanti', dateLabel: '02 Oct 2026', dayName: 'Fri', type: 'Public Holiday', observed: true },
  { id: 'hol-7', name: 'Onam / Mid-Year Break', dateLabel: '26 Aug 2026', dayName: 'Wed', type: 'Company Holiday', observed: true },
  { id: 'hol-6', name: 'Independence Day', dateLabel: '15 Aug 2026', dayName: 'Sat', type: 'Public Holiday', observed: true },
  { id: 'hol-5', name: 'May Day', dateLabel: '01 May 2026', dayName: 'Fri', type: 'Public Holiday', observed: true },
  { id: 'hol-4', name: 'Vishu / Spring Festival', dateLabel: '14 Apr 2026', dayName: 'Tue', type: 'Company Holiday', observed: true },
  { id: 'hol-3', name: 'Good Friday', dateLabel: '03 Apr 2026', dayName: 'Fri', type: 'Public Holiday', observed: true },
  { id: 'hol-2', name: 'Republic Day', dateLabel: '26 Jan 2026', dayName: 'Mon', type: 'Public Holiday', observed: true },
  { id: 'hol-1', name: 'New Year Day', dateLabel: '01 Jan 2026', dayName: 'Thu', type: 'Public Holiday', observed: true },
];

export const LATEST_PAYSLIP_PREVIEW: PayslipPreviewSummary = {
  monthLabel: 'October 2026',
  netPay: 'Available soon in Payroll module',
  grossEarnings: '₹84,500',
  deductions: '₹7,250',
  payDate: '31 Oct 2026',
  status: 'Processed',
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export function getGreetingForDate(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function formatHomeHeaderDate(date: Date = new Date()): string {
  const weekday = WEEKDAYS[date.getDay()] ?? 'Thu';
  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTHS[date.getMonth()] ?? 'Nov';
  const year = date.getFullYear();
  return `${weekday} ${day} ${month} ${year}`;
}

export function formatMinutesAsHoursMinutes(totalMinutes: number): string {
  const safe = Math.max(0, Math.round(totalMinutes));
  const hrs = Math.floor(safe / 60);
  const mins = safe % 60;
  return `${hrs}h ${String(mins).padStart(2, '0')}m`;
}

const LEAVE_RING_PALETTE = ['#F59E0B', '#00B86B', '#EF4444', '#2563EB'] as const;

function pickLeaveRingColor(nameOrCode: string, fallbackIndex: number): string {
  const lower = nameOrCode.toLowerCase();
  if (lower.includes('sick') || lower.includes('medical') || lower === 'sl') {
    return '#F59E0B';
  }
  if (
    lower.includes('earned') ||
    lower.includes('annual') ||
    lower.includes('privilege') ||
    lower.includes('vacation') ||
    lower === 'el' ||
    lower === 'pl'
  ) {
    return '#00B86B';
  }
  if (lower.includes('casual') || lower === 'cl') {
    return '#EF4444';
  }
  return LEAVE_RING_PALETTE[fallbackIndex % LEAVE_RING_PALETTE.length] ?? '#2563EB';
}

function formatRingValue(value: number): string {
  const safe = Math.max(0, value);
  if (Number.isInteger(safe)) {
    return safe < 10 ? String(safe).padStart(2, '0') : String(safe);
  }
  return String(Number(safe.toFixed(1)));
}

function roundLeaveNumber(value: number): number {
  const safe = Math.max(0, value);
  return Number.isInteger(safe) ? safe : Number(safe.toFixed(1));
}

export function mapLeaveBalancesToHomeData(balances: LeaveBalancesResponse): {
  leaveRings: LeaveBalanceRingItem[];
  leaveHistoryTotal: number;
  leaveDaysTaken: number;
  leaveDaysLeft: number;
} {
  const rings: LeaveBalanceRingItem[] = balances.byType.slice(0, 3).map((item, idx) => {
    const label = item.leaveTypeName || item.leaveTypeCode || `Leave ${idx + 1}`;
    const total =
      item.allocated > 0 ? item.allocated : item.taken + item.pending + item.available;
    const totalRounded = roundLeaveNumber(total);
    const remaining = Math.max(0, item.available);

    return {
      key: String(item.leaveTypeId ?? `leave-${idx}`),
      label,
      remaining,
      total: totalRounded,
      formattedRemaining: formatRingValue(remaining),
      targetLabel: `Of ${totalRounded} ${totalRounded === 1 ? 'day' : 'days'}`,
      progress: total > 0 ? Math.min(1, Math.max(0, remaining / total)) : 0,
      ringColor: pickLeaveRingColor(`${label} ${item.leaveTypeCode ?? ''}`, idx),
    };
  });

  if (rings.length === 0) {
    const total =
      balances.allocated > 0
        ? balances.allocated
        : balances.taken + balances.pending + balances.available;
    const totalRounded = roundLeaveNumber(total);
    const remaining = Math.max(0, balances.available);
    rings.push({
      key: 'total',
      label: 'Leave balance',
      remaining,
      total: totalRounded,
      formattedRemaining: formatRingValue(remaining),
      targetLabel: `Of ${totalRounded} ${totalRounded === 1 ? 'day' : 'days'}`,
      progress: total > 0 ? Math.min(1, Math.max(0, remaining / total)) : 0,
      ringColor: '#2563EB',
    });
  }

  return {
    leaveRings: rings,
    leaveHistoryTotal: roundLeaveNumber(balances.allocated),
    leaveDaysTaken: roundLeaveNumber(balances.taken),
    leaveDaysLeft: roundLeaveNumber(balances.available),
  };
}
