import { type pieDataItem } from 'react-native-gifted-charts';

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
}

export interface LeaveDurationData {
  totalDays: number;
  totalApprovedDays?: number;
  months: MonthSegment[];
  records: LeaveHistoryRecord[];
}

export const DURATION_OPTIONS: DurationOption[] = [
  {
    key: '3months',
    label: 'Last 3 months',
    dateRange: 'Sep-Nov 2026',
    totalDays: 5.5,
  },
  {
    key: '6months',
    label: 'Last 6 months',
    dateRange: 'Jun-Nov 2026',
    totalDays: 10,
  },
  {
    key: '1year',
    label: 'Last 1 year',
    dateRange: 'Dec 2025-Nov 2026',
    totalDays: 16.5,
  },
];

const LEAVE_RECORDS_BY_DURATION: Record<
  DurationKey,
  {
    totalDays: number;
    months: MonthSegment[];
    records: LeaveHistoryRecord[];
  }
> = {
  '3months': {
    totalDays: 5.5,
    months: [
      { key: 'Sep', label: 'Sep', days: 0.5, color: '#93C5FD' },
      { key: 'Oct', label: 'Oct', days: 1, color: '#3B82F6' },
      { key: 'Nov', label: 'Nov', days: 4, color: '#1D4ED8' },
    ],
    records: [
      {
        id: 'leave-1',
        dateDisplay: '20',
        monthDisplay: 'Nov',
        durationDays: 1,
        durationLabel: '1 day',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.........',
        monthKey: 'Nov',
      },
      {
        id: 'leave-2',
        dateDisplay: '11-12',
        monthDisplay: 'Nov',
        durationDays: 2,
        durationLabel: '2 days',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.........',
        monthKey: 'Nov',
      },
      {
        id: 'leave-3',
        dateDisplay: '10',
        monthDisplay: 'Nov',
        durationDays: 1,
        durationLabel: '1 day',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.........',
        monthKey: 'Nov',
      },
      {
        id: 'leave-4',
        dateDisplay: '15',
        monthDisplay: 'Oct',
        durationDays: 1,
        durationLabel: '1 day',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription:
          'Personal appointment and family health checkup session at city medical center.',
        monthKey: 'Oct',
      },
      {
        id: 'leave-5',
        dateDisplay: '28',
        monthDisplay: 'Sep',
        durationDays: 0.5,
        durationLabel: '0.5 days',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription:
          'Half-day afternoon emergency leave for home maintenance and electric inspections.',
        monthKey: 'Sep',
      },
      {
        id: 'leave-6',
        dateDisplay: '05',
        monthDisplay: 'Sep',
        durationDays: 0.5,
        durationLabel: '0.5 days',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription:
          'Official document verification and personal legal errand in the morning.',
        monthKey: 'Sep',
      },
    ],
  },
  '6months': {
    totalDays: 10,
    months: [
      { key: 'Jun', label: 'Jun', days: 1, color: '#DBEAFE' },
      { key: 'Jul', label: 'Jul', days: 1.5, color: '#BFDBFE' },
      { key: 'Aug', label: 'Aug', days: 2, color: '#60A5FA' },
      { key: 'Sep', label: 'Sep', days: 0.5, color: '#93C5FD' },
      { key: 'Oct', label: 'Oct', days: 1, color: '#3B82F6' },
      { key: 'Nov', label: 'Nov', days: 4, color: '#1D4ED8' },
    ],
    records: [
      {
        id: 'leave-1',
        dateDisplay: '20',
        monthDisplay: 'Nov',
        durationDays: 1,
        durationLabel: '1 day',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.........',
        monthKey: 'Nov',
      },
      {
        id: 'leave-2',
        dateDisplay: '11-12',
        monthDisplay: 'Nov',
        durationDays: 2,
        durationLabel: '2 days',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription: 'Attending annual family wedding ceremony out of town.',
        monthKey: 'Nov',
      },
      {
        id: 'leave-3',
        dateDisplay: '10',
        monthDisplay: 'Nov',
        durationDays: 1,
        durationLabel: '1 day',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription: 'Home maintenance work and urgent utility installations.',
        monthKey: 'Nov',
      },
      {
        id: 'leave-4',
        dateDisplay: '15',
        monthDisplay: 'Oct',
        durationDays: 1,
        durationLabel: '1 day',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription: 'Personal appointment and family health checkup session.',
        monthKey: 'Oct',
      },
      {
        id: 'leave-5',
        dateDisplay: '28',
        monthDisplay: 'Sep',
        durationDays: 0.5,
        durationLabel: '0.5 days',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription: 'Half-day afternoon medical visit and prescription review.',
        monthKey: 'Sep',
      },
      {
        id: 'leave-7',
        dateDisplay: '22-23',
        monthDisplay: 'Aug',
        durationDays: 2,
        durationLabel: '2 days',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription: 'Mid-year relaxation break and family visit.',
        monthKey: 'Aug',
      },
      {
        id: 'leave-8',
        dateDisplay: '14-15',
        monthDisplay: 'Jul',
        durationDays: 1.5,
        durationLabel: '1.5 days',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription: 'Domestic apartment shifting and lease registration formalities.',
        monthKey: 'Jul',
      },
      {
        id: 'leave-9',
        dateDisplay: '18',
        monthDisplay: 'Jun',
        durationDays: 1,
        durationLabel: '1 day',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription: 'Attending sibling university graduation ceremony.',
        monthKey: 'Jun',
      },
    ],
  },
  '1year': {
    totalDays: 16.5,
    months: [
      { key: 'Feb', label: 'Feb', days: 2, color: '#E0E7FF' },
      { key: 'May', label: 'May', days: 2.5, color: '#C7D2FE' },
      { key: 'Jun', label: 'Jun', days: 1, color: '#DBEAFE' },
      { key: 'Jul', label: 'Jul', days: 1.5, color: '#BFDBFE' },
      { key: 'Aug', label: 'Aug', days: 2, color: '#60A5FA' },
      { key: 'Sep', label: 'Sep', days: 0.5, color: '#93C5FD' },
      { key: 'Oct', label: 'Oct', days: 1, color: '#3B82F6' },
      { key: 'Nov', label: 'Nov', days: 4, color: '#1D4ED8' },
      { key: 'Dec', label: 'Dec', days: 2, color: '#1E3A8A' },
    ],
    records: [
      {
        id: 'leave-1',
        dateDisplay: '20',
        monthDisplay: 'Nov',
        durationDays: 1,
        durationLabel: '1 day',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.........',
        monthKey: 'Nov',
      },
      {
        id: 'leave-2',
        dateDisplay: '11-12',
        monthDisplay: 'Nov',
        durationDays: 2,
        durationLabel: '2 days',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription: 'Attending annual family wedding ceremony.',
        monthKey: 'Nov',
      },
      {
        id: 'leave-3',
        dateDisplay: '10',
        monthDisplay: 'Nov',
        durationDays: 1,
        durationLabel: '1 day',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription: 'Home maintenance work and urgent utility installations.',
        monthKey: 'Nov',
      },
      {
        id: 'leave-4',
        dateDisplay: '15',
        monthDisplay: 'Oct',
        durationDays: 1,
        durationLabel: '1 day',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription: 'Personal appointment and family health checkup session.',
        monthKey: 'Oct',
      },
      {
        id: 'leave-7',
        dateDisplay: '22-23',
        monthDisplay: 'Aug',
        durationDays: 2,
        durationLabel: '2 days',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription: 'Mid-year summer vacation and travel with family.',
        monthKey: 'Aug',
      },
      {
        id: 'leave-10',
        dateDisplay: '12-14',
        monthDisplay: 'May',
        durationDays: 2.5,
        durationLabel: '2.5 days',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription: 'Traditional annual religious festival and home ceremony.',
        monthKey: 'May',
      },
      {
        id: 'leave-11',
        dateDisplay: '08-09',
        monthDisplay: 'Feb',
        durationDays: 2,
        durationLabel: '2 days',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription: 'Winter medical rest and health recovery.',
        monthKey: 'Feb',
      },
      {
        id: 'leave-12',
        dateDisplay: '24-25',
        monthDisplay: 'Dec',
        durationDays: 2,
        durationLabel: '2 days',
        status: 'Approved',
        reasonTitle: 'Reason requested',
        reasonDescription: 'Year-end Christmas and winter festival holidays.',
        monthKey: 'Dec',
      },
    ],
  },
};

export function getLeaveDataForDuration(duration: DurationKey): LeaveDurationData {
  return LEAVE_RECORDS_BY_DURATION[duration] ?? LEAVE_RECORDS_BY_DURATION['3months'];
}

export interface LeavePieDataItem extends pieDataItem {
  monthKey: string;
  monthLabel: string;
  daysLabel: string;
  showInnerLabel: boolean;
}

export function buildPieChartData(
  months: MonthSegment[],
  selectedMonth: string,
  onSelectMonth: (monthKey: string) => void,
): LeavePieDataItem[] {
  // Preserve chronological order with latest month (Nov) first
  const ordered = [...months].sort((a, b) => {
    if (a.key === 'Nov') return -1;
    if (b.key === 'Nov') return 1;
    return 0;
  });

  const total = ordered.reduce((sum, m) => sum + m.days, 0);

  return ordered.map((m) => {
    const isNov = m.key === 'Nov';
    const isSmall = m.days <= 0.5;
    const percentage = total > 0 ? (m.days / total) * 100 : 0;
    const showInnerLabel = ordered.length <= 4 || (percentage >= 7 && m.days >= 1);

    const daysLabel = isSmall ? `${m.days}d` : `${m.days} ${m.days === 1 ? 'day' : 'days'}`;

    return {
      value: m.days,
      color: m.color,
      text: `${m.label} · ${daysLabel}`,
      textColor:
        m.color === '#93C5FD' ||
        m.color === '#DBEAFE' ||
        m.color === '#E0E7FF' ||
        m.color === '#BFDBFE'
          ? '#0F172A'
          : '#FFFFFF',
      textSize: isNov ? 12 : isSmall ? 9 : 11,
      fontWeight: 'bold',
      focused: false, // Never extrude slice - keeps pie clean and contiguous
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
