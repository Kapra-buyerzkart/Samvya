import { attendanceApi } from '@/features/attendance/api/attendanceApi';
import { useAuthStore } from '@/features/auth';
import { isApiError } from '@/shared/api';
import { useAppTheme } from '@/shared/theme';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { employmentApi } from '../../api/employmentApi';
import { getMonthName } from '../../data/employmentDataService';
import { EmploymentHistoryItem, MonthlyWorkHoursSummary } from '../../domain/types';

export interface UseEmploymentDetailsScreenResult {
  isDark: boolean;
  monthLabel: string;
  monthData: MonthlyWorkHoursSummary | null;
  selectedDay: number;
  history: EmploymentHistoryItem | null;
  historyItems: EmploymentHistoryItem[];
  isLoadingMonth: boolean;
  monthError: string | null;
  isLoadingHistory: boolean;
  historyError: string | null;
  setSelectedDay: (day: number) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleRetryMonth: () => void;
  handleRetryHistory: () => void;
  handleBack: () => void;
}

export function useEmploymentDetailsScreen(): UseEmploymentDetailsScreenResult {
  const theme = useAppTheme();
  const isDark = theme.isDark;
  const authSession = useAuthStore((s) => s.session);
  const authUser = useAuthStore((s) => s.user);
  const employmentId = authSession?.employmentId ?? null;
  const memberId = authSession?.memberId ?? null;

  const initialPeriod = useMemo(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
  }, []);

  const [currentYear, setCurrentYear] = useState(initialPeriod.year);
  const [currentMonth, setCurrentMonth] = useState(initialPeriod.month);
  const [selectedDay, setSelectedDay] = useState(initialPeriod.day);
  const [reloadCount, setReloadCount] = useState(0);
  const [historyReloadCount, setHistoryReloadCount] = useState(0);
  const [fetchState, setFetchState] = useState<{
    key: string;
    data: MonthlyWorkHoursSummary | null;
    error: string | null;
  } | null>(null);
  const [historyFetchState, setHistoryFetchState] = useState<{
    key: string;
    items: EmploymentHistoryItem[] | null;
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

    void (async () => {
      try {
        const summary = await attendanceApi.getEmploymentMonthlyAttendance({
          employmentId,
          year: currentYear,
          month: currentMonth,
        });
        if (!isCancelled) {
          setFetchState({ key: requestKey, data: summary ?? null, error: null });
        }
      } catch (error: unknown) {
        if (!isCancelled) {
          setFetchState({
            key: requestKey,
            data: null,
            error: isApiError(error)
              ? error.message
              : 'Unable to load monthly attendance right now.',
          });
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [requestKey, employmentId, currentYear, currentMonth]);

  const activeFetchState =
    requestKey !== null && fetchState?.key === requestKey ? fetchState : null;
  const isLoadingMonth = requestKey !== null && activeFetchState === null;
  const monthError = activeFetchState?.error ?? null;

  const monthLabel = useMemo(
    () => getMonthName(currentYear, currentMonth),
    [currentYear, currentMonth],
  );

  const monthData = useMemo(() => {
    if (
      activeFetchState?.data &&
      activeFetchState.data.year === currentYear &&
      activeFetchState.data.month === currentMonth
    ) {
      return activeFetchState.data;
    }
    return null;
  }, [activeFetchState, currentYear, currentMonth]);

  const handlePrevMonth = (): void => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = (): void => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(1);
  };

  const handleRetryMonth = useCallback((): void => {
    setReloadCount((c) => c + 1);
  }, []);

  const handleRetryHistory = useCallback((): void => {
    setHistoryReloadCount((c) => c + 1);
  }, []);

  const hasEmploymentIdentity =
    (employmentId !== null && employmentId !== '') || (memberId !== null && memberId !== '');
  const historyRequestKey = hasEmploymentIdentity
    ? `${memberId ?? ''}:${employmentId ?? ''}:${historyReloadCount}`
    : null;

  useEffect(() => {
    if (!historyRequestKey) {
      return;
    }

    let isCancelled = false;
    void (async () => {
      try {
        const items = await employmentApi.loadEmploymentHistory({
          memberId,
          employmentId,
          sessionFallback: {
            designation: authSession?.designation ?? authUser?.designation,
            employeeCode: authSession?.employeeCode ?? authUser?.employeeCode,
            department: authSession?.department ?? authUser?.department,
            joiningDate: authUser?.joiningDate,
          },
        });
        if (!isCancelled) {
          setHistoryFetchState({ key: historyRequestKey, items, error: null });
        }
      } catch (error: unknown) {
        if (!isCancelled) {
          setHistoryFetchState({
            key: historyRequestKey,
            items: null,
            error: isApiError(error)
              ? error.message
              : 'Unable to load employment history right now.',
          });
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [historyRequestKey, memberId, employmentId, authSession, authUser]);

  const activeHistoryFetchState =
    historyRequestKey !== null && historyFetchState?.key === historyRequestKey
      ? historyFetchState
      : null;
  const isLoadingHistory = historyRequestKey !== null && activeHistoryFetchState === null;
  const historyError = activeHistoryFetchState?.error ?? null;

  const handleBack = (): void => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)');
    }
  };

  const historyItems = useMemo<EmploymentHistoryItem[]>(
    () => activeHistoryFetchState?.items ?? [],
    [activeHistoryFetchState],
  );

  const history = historyItems[0] ?? null;

  return {
    isDark,
    monthLabel,
    monthData,
    selectedDay,
    history,
    historyItems,
    isLoadingMonth,
    monthError,
    isLoadingHistory,
    historyError,
    setSelectedDay,
    handlePrevMonth,
    handleNextMonth,
    handleRetryMonth,
    handleRetryHistory,
    handleBack,
  };
}
