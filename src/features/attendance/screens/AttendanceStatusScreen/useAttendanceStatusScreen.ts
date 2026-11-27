import { useAuthStore } from '@/features/auth';
import { type DayWorkHours, type MonthlyWorkHoursSummary } from '@/features/employment/domain/types';
import { isApiError } from '@/shared/api';
import { useAppTheme } from '@/shared/theme';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  attendanceApi,
  getMonthDateRange,
  type AttendanceRangeRecord,
} from '../../api/attendanceApi';

export interface CalendarDay {
  dayNumber: number;
  dateKey: string;
  isCurrentMonth: boolean;
}

export interface DayPunchInfo {
  status: 'approved' | 'pending' | 'rejected' | 'empty';
  punchInTime: string;
  punchInPeriod: string;
  punchOutTime: string;
  punchOutPeriod: string;
  workedHoursLabel: string | null;
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

function formatWorkedMinutes(minutes: number): string {
  const safe = Math.max(0, Math.round(minutes));
  if (safe === 0) return '0h';
  const hrs = Math.floor(safe / 60);
  const mins = safe % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export function useAttendanceStatusScreen() {
  const theme = useAppTheme();
  const isDark = theme.isDark;
  const employmentId = useAuthStore((s) => s.session?.employmentId ?? null);

  const [initialDate] = useState(() => new Date());
  const [currentYear, setCurrentYear] = useState(() => initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => initialDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(() => initialDate.getDate());
  const [reloadCount, setReloadCount] = useState(0);
  const [fetchState, setFetchState] = useState<{
    key: string;
    recordsByDay: Record<number, AttendanceRangeRecord>;
    monthlySummary: MonthlyWorkHoursSummary | null;
    error: string | null;
  } | null>(null);

  const requestKey =
    employmentId !== null && employmentId !== ''
      ? `${employmentId}:${currentYear}:${currentMonth}:${reloadCount}`
      : null;

  useEffect(() => {
    if (!requestKey || employmentId === null || employmentId === '') {
      return;
    }

    let isCancelled = false;
    const month1Based = currentMonth + 1;
    const { fromDate, toDate } = getMonthDateRange(currentYear, month1Based);

    Promise.allSettled([
      attendanceApi.getEmploymentAttendanceRange({
        employmentId,
        fromDate,
        toDate,
      }),
      attendanceApi.getEmploymentMonthlyAttendance({
        employmentId,
        year: currentYear,
        month: month1Based,
      }),
    ]).then(([rangeResult, monthResult]) => {
      if (isCancelled) return;

      const recordsByDay: Record<number, AttendanceRangeRecord> = {};
      if (rangeResult.status === 'fulfilled') {
        for (const rec of rangeResult.value) {
          const parts = rec.dateKey.split('-');
          const recYear = Number(parts[0]);
          const recMonth = Number(parts[1]);
          const recDay = Number(parts[2]);
          if (recYear === currentYear && recMonth === month1Based && Number.isInteger(recDay)) {
            recordsByDay[recDay] = rec;
          }
        }
      }

      const monthlySummary =
        monthResult.status === 'fulfilled' ? monthResult.value : null;

      let error: string | null = null;
      if (rangeResult.status === 'rejected') {
        error = isApiError(rangeResult.reason)
          ? rangeResult.reason.message
          : 'Unable to load attendance logs right now.';
      } else if (monthResult.status === 'rejected') {
        error = isApiError(monthResult.reason)
          ? monthResult.reason.message
          : 'Unable to load monthly attendance summary right now.';
      }

      setFetchState({
        key: requestKey,
        recordsByDay,
        monthlySummary,
        error,
      });
    });

    return () => {
      isCancelled = true;
    };
  }, [requestKey, employmentId, currentYear, currentMonth]);

  const activeFetchState =
    requestKey !== null && fetchState?.key === requestKey ? fetchState : null;
  const isLoading = requestKey !== null && activeFetchState === null;
  const loadError = activeFetchState?.error ?? null;
  const apiRecordsByDay = useMemo(() => activeFetchState?.recordsByDay ?? {}, [activeFetchState]);
  const monthlySummary = activeFetchState?.monthlySummary ?? null;

  const monthlyDayByDay = useMemo<Record<number, DayWorkHours>>(() => {
    const map: Record<number, DayWorkHours> = {};
    if (!monthlySummary) return map;
    for (const dayRec of monthlySummary.dailyRecords) {
      map[dayRec.day] = dayRec;
    }
    return map;
  }, [monthlySummary]);

  const handleRetryLoad = useCallback((): void => {
    setReloadCount((c) => c + 1);
  }, []);

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

  const dayStatusByDay = useMemo<Record<number, 'approved' | 'pending' | 'rejected'>>(() => {
    if (employmentId === null || employmentId === '') {
      return {};
    }

    const result: Record<number, 'approved' | 'pending' | 'rejected'> = {};
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const record = apiRecordsByDay[dayNum];
      if (record) {
        const hasActivity =
          record.hasAttendanceData ??
          (record.punchInTimeUtc !== null ||
            record.punchOutTimeUtc !== null ||
            record.workedMinutes > 0 ||
            record.status === 'pending' ||
            record.status === 'rejected');
        if (hasActivity) {
          result[dayNum] = record.status;
          continue;
        }
      }

      const monthlyDay = monthlyDayByDay[dayNum];
      if (
        monthlyDay &&
        (monthlyDay.status === 'recorded' || monthlyDay.status === 'lesser' || monthlyDay.hours > 0)
      ) {
        result[dayNum] = 'approved';
      }
    }

    return result;
  }, [employmentId, apiRecordsByDay, monthlyDayByDay, currentYear, currentMonth]);

  const selectedPunchInfo = useMemo<DayPunchInfo>(() => {
    if (employmentId === null || employmentId === '') {
      return {
        status: 'empty',
        punchInTime: '—',
        punchInPeriod: 'No punch',
        punchOutTime: '—',
        punchOutPeriod: 'No punch',
        workedHoursLabel: null,
        subtitle: 'No active employment selected',
      };
    }

    const apiRecord = apiRecordsByDay[selectedDay];
    const monthlyDay = monthlyDayByDay[selectedDay];
    const d = new Date(currentYear, currentMonth, selectedDay);
    const dayOfWeek = d.getDay();
    const defaultWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (apiRecord) {
      const hasActivity =
        apiRecord.hasAttendanceData ??
        (apiRecord.punchInTimeUtc !== null ||
          apiRecord.punchOutTimeUtc !== null ||
          apiRecord.workedMinutes > 0 ||
          apiRecord.status === 'pending');

      if (!hasActivity && !(monthlyDay && (monthlyDay.hours > 0 || monthlyDay.status !== 'no_entry'))) {
        const isWeekend = apiRecord.isWeekend ?? monthlyDay?.isWeekend ?? defaultWeekend;
        const isHoliday = apiRecord.isHoliday ?? monthlyDay?.isHoliday ?? false;
        return {
          status: 'empty',
          punchInTime: apiRecord.punchInDisplay,
          punchInPeriod: isHoliday ? 'Holiday' : isWeekend ? 'Weekend' : 'No punch',
          punchOutTime: apiRecord.punchOutDisplay,
          punchOutPeriod: isHoliday ? 'Holiday' : isWeekend ? 'Rest day' : 'No punch',
          workedHoursLabel: null,
          subtitle: apiRecord.subtitle,
        };
      }

      const workedHoursLabel =
        apiRecord.workedMinutes > 0
          ? formatWorkedMinutes(apiRecord.workedMinutes)
          : monthlyDay && monthlyDay.hours > 0
            ? monthlyDay.formattedHours
            : null;

      return {
        status:
          apiRecord.status === 'pending'
            ? 'pending'
            : apiRecord.status === 'rejected'
              ? 'rejected'
              : 'approved',
        punchInTime: apiRecord.punchInDisplay,
        punchInPeriod: apiRecord.punchInPeriod,
        punchOutTime: apiRecord.punchOutDisplay,
        punchOutPeriod: apiRecord.punchOutPeriod,
        workedHoursLabel,
        subtitle: apiRecord.subtitle,
      };
    }

    if (monthlyDay && (monthlyDay.hours > 0 || monthlyDay.status === 'recorded' || monthlyDay.status === 'lesser')) {
      return {
        status: 'approved',
        punchInTime: '—',
        punchInPeriod: 'Not recorded',
        punchOutTime: '—',
        punchOutPeriod: 'Not recorded',
        workedHoursLabel: monthlyDay.formattedHours,
        subtitle: `${monthlyDay.formattedHours} worked`,
      };
    }

    const isWeekend = monthlyDay?.isWeekend ?? defaultWeekend;
    const isHoliday = monthlyDay?.isHoliday ?? false;

    return {
      status: 'empty',
      punchInTime: '—',
      punchInPeriod: isHoliday ? 'Holiday' : isWeekend ? 'Weekend' : 'No punch',
      punchOutTime: '—',
      punchOutPeriod: isHoliday ? 'Holiday' : isWeekend ? 'Rest day' : 'No punch',
      workedHoursLabel: null,
      subtitle: isHoliday
        ? 'Public holiday'
        : isWeekend
          ? 'Scheduled off day'
          : 'No attendance log recorded',
    };
  }, [employmentId, apiRecordsByDay, monthlyDayByDay, currentYear, currentMonth, selectedDay]);

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
    isLoading,
    loadError,
    monthlySummary,
    dayStatusByDay,
    setSelectedDay,
    handlePrevMonth,
    handleNextMonth,
    handleRetryLoad,
    handleBack,
    calendarDays,
    selectedPunchInfo,
    formattedSelectedDate,
    monthNames: MONTH_NAMES,
    weekdayNames: WEEKDAY_NAMES,
  };
}
