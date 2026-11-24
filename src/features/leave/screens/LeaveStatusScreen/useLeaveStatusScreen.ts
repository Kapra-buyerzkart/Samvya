import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { useAppTheme } from '@/shared/theme';

export interface CalendarDay {
  dayNumber: number;
  dateKey: string;
  isCurrentMonth: boolean;
}

export type StatusFilter = 'all' | 'approved' | 'pending' | 'rejected';

export interface LeaveRecord {
  id: string;
  requestDate: string;
  actionDate: string;
  status: 'approved' | 'rejected';
}

export const MONTH_NAMES = [
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
];

export const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const LEAVE_RECORDS: LeaveRecord[] = [
  {
    id: 'req-1',
    requestDate: '19 Nov 2026',
    actionDate: '20 Nov 2026',
    status: 'approved',
  },
  {
    id: 'req-2',
    requestDate: '10 Oct 2026',
    actionDate: '12 Oct 2026',
    status: 'rejected',
  },
];

export const APPROVED_DATES = new Set(['2026-11-23', '2026-11-24']);
export const PENDING_DATES = new Set(['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12']);

export interface UseLeaveStatusScreenResult {
  isDark: boolean;
  currentYear: number;
  currentMonth: number;
  selectedFilter: StatusFilter;
  selectedDate: string | null;
  calendarDays: CalendarDay[];
  displayedRecords: LeaveRecord[];
  approvedDates: Set<string>;
  pendingDates: Set<string>;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleToggleFilter: () => void;
  handleSelectDatePress: () => void;
  handleDayPress: (dateKey: string) => void;
  handleBack: () => void;
}

export function useLeaveStatusScreen(): UseLeaveStatusScreenResult {
  const theme = useAppTheme();
  const isDark = theme.isDark;

  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState<StatusFilter>('all');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToggleFilter = () => {
    const cycle: StatusFilter[] = ['all', 'approved', 'pending', 'rejected'];
    const nextIdx = (cycle.indexOf(selectedFilter) + 1) % cycle.length;
    setSelectedFilter(cycle[nextIdx] ?? 'all');
  };

  const handleSelectDatePress = () => {
    if (selectedDate) {
      setSelectedDate(null);
    } else {
      setSelectedDate('2026-11-23');
    }
  };

  const handleDayPress = (dateKey: string) => {
    setSelectedDate(dateKey === selectedDate ? null : dateKey);
  };

  const handleBack = () => {
    router.back();
  };

  const calendarDays = useMemo<CalendarDay[]>(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days: CalendarDay[] = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push({
        dayNumber: 0,
        dateKey: `pad-${i}`,
        isCurrentMonth: false,
      });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const padM = String(currentMonth + 1).padStart(2, '0');
      const padD = String(d).padStart(2, '0');
      days.push({
        dayNumber: d,
        dateKey: `${currentYear}-${padM}-${padD}`,
        isCurrentMonth: true,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  const displayedRecords = useMemo(() => {
    if (selectedFilter === 'all') return LEAVE_RECORDS;
    if (selectedFilter === 'approved') {
      return LEAVE_RECORDS.filter((r) => r.status === 'approved');
    }
    if (selectedFilter === 'rejected') {
      return LEAVE_RECORDS.filter((r) => r.status === 'rejected');
    }
    return [];
  }, [selectedFilter]);

  return {
    isDark,
    currentYear,
    currentMonth,
    selectedFilter,
    selectedDate,
    calendarDays,
    displayedRecords,
    approvedDates: APPROVED_DATES,
    pendingDates: PENDING_DATES,
    handlePrevMonth,
    handleNextMonth,
    handleToggleFilter,
    handleSelectDatePress,
    handleDayPress,
    handleBack,
  };
}
