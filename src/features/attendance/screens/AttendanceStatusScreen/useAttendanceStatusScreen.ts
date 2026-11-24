import { useAppTheme } from '@/shared/theme';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';

export interface CalendarDay {
  dayNumber: number;
  dateKey: string;
  isCurrentMonth: boolean;
}

export interface DayPunchInfo {
  status: 'approved' | 'pending';
  punchInTime: string;
  punchInPeriod: string;
  punchOutTime: string;
  punchOutPeriod: string;
  subtitle: string;
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

export const ATTENDANCE_DATA: Record<number, DayPunchInfo> = {
  19: {
    status: 'approved',
    punchInTime: '09:02 AM',
    punchInPeriod: 'Morning',
    punchOutTime: '05:34 PM',
    punchOutPeriod: 'Evening',
    subtitle: 'Selfies recorded · IST',
  },
  18: {
    status: 'approved',
    punchInTime: '09:05 AM',
    punchInPeriod: 'Morning',
    punchOutTime: '05:30 PM',
    punchOutPeriod: 'Evening',
    subtitle: 'Selfies recorded · IST',
  },
  17: {
    status: 'approved',
    punchInTime: '08:58 AM',
    punchInPeriod: 'Morning',
    punchOutTime: '05:35 PM',
    punchOutPeriod: 'Evening',
    subtitle: 'Selfies recorded · IST',
  },
  16: {
    status: 'approved',
    punchInTime: '09:12 AM',
    punchInPeriod: 'Morning',
    punchOutTime: '05:40 PM',
    punchOutPeriod: 'Evening',
    subtitle: 'Selfies recorded · IST',
  },
  13: {
    status: 'pending',
    punchInTime: '09:30 AM',
    punchInPeriod: 'Morning',
    punchOutTime: '06:15 PM',
    punchOutPeriod: 'Evening',
    subtitle: 'Selfies recorded · IST',
  },
};

export function useAttendanceStatusScreen() {
  const theme = useAppTheme();
  const isDark = theme.isDark;

  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10);
  const [selectedDay, setSelectedDay] = useState(19);

  const handlePrevMonth = (): void => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = (): void => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(1);
  };

  const handleBack = (): void => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)');
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

  const selectedPunchInfo = useMemo<DayPunchInfo>(() => {
    if (currentMonth === 10 && currentYear === 2026 && ATTENDANCE_DATA[selectedDay]) {
      return ATTENDANCE_DATA[selectedDay];
    }

    const d = new Date(currentYear, currentMonth, selectedDay);
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (isWeekend) {
      return {
        status: 'approved',
        punchInTime: '—',
        punchInPeriod: 'Weekend',
        punchOutTime: '—',
        punchOutPeriod: 'Rest day',
        subtitle: 'Scheduled off day',
      };
    }

    return {
      status: 'approved',
      punchInTime: '09:00 AM',
      punchInPeriod: 'Morning',
      punchOutTime: '05:30 PM',
      punchOutPeriod: 'Evening',
      subtitle: 'Selfies recorded · IST',
    };
  }, [currentYear, currentMonth, selectedDay]);

  const formattedSelectedDate = useMemo(() => {
    const d = new Date(currentYear, currentMonth, selectedDay);
    const weekday = WEEKDAY_NAMES[d.getDay()] ?? 'Thu';
    const monthShort = (MONTH_NAMES[currentMonth] ?? 'Nov').slice(0, 3);
    return `${weekday}, ${selectedDay} ${monthShort} ${currentYear}`;
  }, [currentYear, currentMonth, selectedDay]);

  return {
    isDark,
    currentYear,
    currentMonth,
    selectedDay,
    setSelectedDay,
    handlePrevMonth,
    handleNextMonth,
    handleBack,
    calendarDays,
    selectedPunchInfo,
    formattedSelectedDate,
    monthNames: MONTH_NAMES,
    weekdayNames: WEEKDAY_NAMES,
  };
}
