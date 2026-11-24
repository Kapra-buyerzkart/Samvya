import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useAppTheme } from '@/shared/theme';

export type DurationType = 'full' | 'half';

export interface CalendarDay {
  dayNumber: number;
  dateKey: string;
  isCurrentMonth: boolean;
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

export interface UseRequestLeaveScreenResult {
  isDark: boolean;
  currentYear: number;
  currentMonth: number;
  todayKey: string;
  durationType: DurationType;
  startDate: string | null;
  endDate: string | null;
  reason: string;
  isSubmitting: boolean;
  calendarDays: CalendarDay[];
  requestedDuration: {
    days: number;
    label: string;
    subtitle: string;
  };
  setDurationType: (type: DurationType) => void;
  setReason: (reason: string) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleSelectDay: (dateKey: string) => void;
  formatDateDisplay: (dateStr: string | null) => string;
  handleSubmit: () => void;
  handleApprovalStatus: () => void;
  handleBack: () => void;
  handleStartDatePress: () => void;
  handleEndDatePress: () => void;
}

export function useRequestLeaveScreen(): UseRequestLeaveScreenResult {
  const theme = useAppTheme();
  const isDark = theme.isDark;

  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 0-indexed: 10 = November

  const todayKey = '2026-11-12';

  const [durationType, setDurationType] = useState<DurationType>('full');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSelectDay = (dateKey: string) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(dateKey);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (dateKey < startDate) {
        setEndDate(startDate);
        setStartDate(dateKey);
      } else if (dateKey === startDate) {
        setEndDate(dateKey);
      } else {
        setEndDate(dateKey);
      }
    }
  };

  const formatDateDisplay = (dateStr: string | null) => {
    if (!dateStr) return 'Select date';
    const parts = dateStr.split('-');
    const y = parts[0] ?? '2026';
    const m = parseInt(parts[1] ?? '11', 10) - 1;
    const d = parseInt(parts[2] ?? '1', 10);
    return `${d} ${MONTH_NAMES[m]?.slice(0, 3) ?? ''} ${y}`;
  };

  const requestedDuration = useMemo(() => {
    if (!startDate) {
      return {
        days: 0,
        label: '—',
        subtitle: 'Select dates to view duration.',
      };
    }

    const effectiveEnd = endDate || startDate;
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(effectiveEnd).getTime();
    const diffDays = Math.round(Math.abs(endMs - startMs) / (1000 * 60 * 60 * 24)) + 1;

    const total = durationType === 'half' ? diffDays * 0.5 : diffDays;
    const unit = total === 1 ? 'day' : 'days';

    const fmt = (dStr: string) => {
      const parts = dStr.split('-');
      const y = parts[0] ?? '2026';
      const m = parseInt(parts[1] ?? '11', 10) - 1;
      const d = parseInt(parts[2] ?? '1', 10);
      return `${d} ${MONTH_NAMES[m]?.slice(0, 3) ?? ''} ${y}`;
    };

    const subtitle =
      startDate === effectiveEnd
        ? `${fmt(startDate)}`
        : `${fmt(startDate)} to ${fmt(effectiveEnd)}`;

    return {
      days: total,
      label: `${total} ${unit}`,
      subtitle,
    };
  }, [startDate, endDate, durationType]);

  const handleSubmit = () => {
    if (!startDate) {
      Alert.alert('Missing Date', 'Please select at least a start date for your leave.');
      return;
    }

    if (!reason.trim()) {
      Alert.alert('Reason Required', 'Please enter a reason for your leave request.');
      return;
    }

    setIsSubmitting(true);
    Alert.alert(
      'Request Submitted',
      `Your request for ${requestedDuration.label} (${requestedDuration.subtitle}) has been sent for approval.`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ],
    );
    setIsSubmitting(false);
  };

  const handleApprovalStatus = () => {
    router.push('/(app)/leave/status');
  };

  const handleBack = () => {
    router.back();
  };

  const handleStartDatePress = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleEndDatePress = () => {
    if (startDate && !endDate) {
      setEndDate(startDate);
    }
  };

  return {
    isDark,
    currentYear,
    currentMonth,
    todayKey,
    durationType,
    startDate,
    endDate,
    reason,
    isSubmitting,
    calendarDays,
    requestedDuration,
    setDurationType,
    setReason,
    handlePrevMonth,
    handleNextMonth,
    handleSelectDay,
    formatDateDisplay,
    handleSubmit,
    handleApprovalStatus,
    handleBack,
    handleStartDatePress,
    handleEndDatePress,
  };
}
