import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { type EntityId, useAuthStore } from '@/features/auth';
import { isApiError } from '@/shared/api';
import { useAppTheme } from '@/shared/theme';
import {
  type EligibleLeaveType,
  extractLeaveOverlapConfirmation,
  type LeaveBalancesResponse,
  leaveApi,
  type SubmitLeaveRequestPayload,
} from '../../api';

export type DurationType = 'full' | 'half';

export interface CalendarDay {
  dayNumber: number;
  dateKey: string;
  isCurrentMonth: boolean;
}

export interface RequestLeaveSummary {
  allocated: number;
  taken: number;
  pending: number;
  available: number;
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

const FULL_WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export interface BreakdownDayItem {
  dateKey: string;
  monthShort: string;
  dayNumber: string;
  weekdayName: string;
  duration: DurationType;
  daysValue: number;
}

function addDaysToDateKey(dateKey: string, deltaDays: number): string {
  const [y, m, d] = dateKey.split('-').map((v) => parseInt(v, 10));
  const date = new Date(y ?? 2026, (m ?? 1) - 1, (d ?? 1) + deltaDays);
  return formatDateKey(date.getFullYear(), date.getMonth(), date.getDate());
}

function enumerateDateRange(startKey: string, endKey: string): string[] {
  const result: string[] = [];
  let cursor = startKey;
  let guard = 0;
  while (cursor <= endKey && guard < 366) {
    result.push(cursor);
    cursor = addDaysToDateKey(cursor, 1);
    guard += 1;
  }
  return result;
}

const OFFLINE_DEFAULT_SUMMARY: RequestLeaveSummary = {
  allocated: 18,
  taken: 4,
  pending: 0,
  available: 14,
};

function generateClientRequestId(): string {
  const randomUuid = globalThis.crypto?.randomUUID?.();
  if (typeof randomUuid === 'string' && randomUuid.length > 0) {
    return randomUuid;
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const r = Math.floor(Math.random() * 16);
    const v = char === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function formatDateKey(year: number, month0Based: number, day: number): string {
  return `${year}-${String(month0Based + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function formatDaysLabel(count: number): string {
  const rounded = Number.isInteger(count) ? count : Number(count.toFixed(1));
  return `${rounded} ${rounded === 1 ? 'day' : 'days'}`;
}

export interface UseRequestLeaveScreenResult {
  isDark: boolean;
  hasSession: boolean;
  currentYear: number;
  currentMonth: number;
  todayKey: string;
  durationType: DurationType;
  startDate: string | null;
  endDate: string | null;
  reason: string;
  isLoadingData: boolean;
  loadError: string | null;
  isSubmitting: boolean;
  leaveTypes: EligibleLeaveType[];
  selectedLeaveTypeId: EntityId | null;
  selectedLeaveType: EligibleLeaveType | null;
  isLeaveTypeSheetOpen: boolean;
  setIsLeaveTypeSheetOpen: (open: boolean) => void;
  summary: RequestLeaveSummary | null;
  calendarDays: CalendarDay[];
  selectedBreakdown: BreakdownDayItem[];
  requestedDuration: {
    days: number;
    label: string;
    subtitle: string;
  };
  balanceAfterApproval: number;
  setDurationType: (type: DurationType) => void;
  setReason: (reason: string) => void;
  handleSelectLeaveType: (leaveTypeId: EntityId) => void;
  handleToggleBreakdownDuration: (dateKey: string) => void;
  handleRemoveBreakdownDate: (dateKey: string) => void;
  handleAddDatePress: () => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleSelectDay: (dateKey: string) => void;
  formatDateDisplay: (dateStr: string | null) => string;
  handleSubmit: () => void;
  handleRetryLoad: () => void;
  handleApprovalStatus: () => void;
  handleBack: () => void;
  handleStartDatePress: () => void;
  handleEndDatePress: () => void;
}

export function useRequestLeaveScreen(): UseRequestLeaveScreenResult {
  const theme = useAppTheme();
  const isDark = theme.isDark;
  const employmentId = useAuthStore((s) => s.session?.employmentId ?? null);
  const hasSession = employmentId !== null && employmentId !== '';

  const initialPeriod = useMemo(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      todayKey: formatDateKey(now.getFullYear(), now.getMonth(), now.getDate()),
    };
  }, []);

  const [currentYear, setCurrentYear] = useState(initialPeriod.year);
  const [currentMonth, setCurrentMonth] = useState(initialPeriod.month);
  const todayKey = initialPeriod.todayKey;

  const [durationType, setDurationType] = useState<DurationType>('full');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [dayDurations, setDayDurations] = useState<Record<string, DurationType>>({});
  const [excludedDateKeys, setExcludedDateKeys] = useState<Record<string, true>>({});
  const [isLeaveTypeSheetOpen, setIsLeaveTypeSheetOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userSelectedLeaveTypeId, setUserSelectedLeaveTypeId] = useState<EntityId | null>(null);
  const [reloadCount, setReloadCount] = useState(0);
  const [fetchState, setFetchState] = useState<{
    key: string;
    leaveTypes: EligibleLeaveType[];
    balances: LeaveBalancesResponse | null;
    error: string | null;
  } | null>(null);

  const requestKey = hasSession ? `${employmentId}:${currentYear}:${reloadCount}` : null;

  useEffect(() => {
    if (!requestKey || employmentId === null || employmentId === '') {
      if (__DEV__) {
        console.log('[RequestLeaveScreen] Skipping leave API load: missing employmentId in session');
      }
      return;
    }

    let isCancelled = false;
    if (__DEV__) {
      console.log('[RequestLeaveScreen] Loading eligible leave types & balances:', {
        employmentId,
        year: currentYear,
        requestKey,
      });
    }

    void (async () => {
      const [typesRes, balancesRes] = await Promise.allSettled([
        leaveApi.getEligibleLeaveTypes(employmentId),
        leaveApi.getLeaveBalances(employmentId, currentYear),
      ]);

      if (isCancelled) return;

      const bothFailed = typesRes.status === 'rejected' && balancesRes.status === 'rejected';
      if (bothFailed) {
        const err = typesRes.reason ?? balancesRes.reason;
        if (__DEV__) {
          console.error('[RequestLeaveScreen] Failed loading leave types and balances:', err);
        }
        setFetchState({
          key: requestKey,
          leaveTypes: [],
          balances: null,
          error: isApiError(err) ? err.message : 'Unable to load leave balance and types.',
        });
        return;
      }

      const fetchedTypes = typesRes.status === 'fulfilled' ? typesRes.value : [];
      const fetchedBalances = balancesRes.status === 'fulfilled' ? balancesRes.value : null;

      if (__DEV__) {
        console.log('[RequestLeaveScreen] Loaded leave data:', {
          leaveTypesCount: fetchedTypes.length,
          leaveTypesStatus: typesRes.status,
          balancesStatus: balancesRes.status,
          balancesSummary: fetchedBalances
            ? {
                allocated: fetchedBalances.allocated,
                taken: fetchedBalances.taken,
                pending: fetchedBalances.pending,
                available: fetchedBalances.available,
                byTypeCount: fetchedBalances.byType.length,
              }
            : null,
        });
      }

      let resolvedTypes = fetchedTypes;
      if (resolvedTypes.length === 0 && fetchedBalances && fetchedBalances.byType.length > 0) {
        resolvedTypes = fetchedBalances.byType
          .filter((b) => b.leaveTypeId !== null && b.leaveTypeName)
          .map((b) => ({
            id: b.leaveTypeId!,
            name: b.leaveTypeName!,
            code: b.leaveTypeCode,
            allocatedDays: b.allocated,
            takenDays: b.taken,
            pendingDays: b.pending,
            availableDays: b.available,
          }));
      }

      setFetchState({
        key: requestKey,
        leaveTypes: resolvedTypes,
        balances: fetchedBalances,
        error: null,
      });
    })();

    return () => {
      isCancelled = true;
    };
  }, [requestKey, employmentId, currentYear]);

  const activeFetchState =
    requestKey !== null && fetchState?.key === requestKey ? fetchState : null;
  const isLoadingData = requestKey !== null && activeFetchState === null;
  const loadError = activeFetchState?.error ?? null;

  const leaveTypes = useMemo<EligibleLeaveType[]>(
    () => (hasSession ? (activeFetchState?.leaveTypes ?? []) : []),
    [hasSession, activeFetchState],
  );

  const selectedLeaveTypeId = useMemo<EntityId | null>(() => {
    if (leaveTypes.length === 0) return null;
    if (
      userSelectedLeaveTypeId !== null &&
      leaveTypes.some((item) => String(item.id) === String(userSelectedLeaveTypeId))
    ) {
      return userSelectedLeaveTypeId;
    }
    return leaveTypes[0]?.id ?? null;
  }, [leaveTypes, userSelectedLeaveTypeId]);

  const selectedLeaveType = useMemo<EligibleLeaveType | null>(
    () =>
      selectedLeaveTypeId !== null
        ? (leaveTypes.find((item) => String(item.id) === String(selectedLeaveTypeId)) ?? null)
        : null,
    [leaveTypes, selectedLeaveTypeId],
  );

  const summary = useMemo<RequestLeaveSummary | null>(() => {
    if (!hasSession) {
      return OFFLINE_DEFAULT_SUMMARY;
    }
    if (isLoadingData || loadError) {
      return null;
    }
    const balances = activeFetchState?.balances ?? null;
    if (balances && selectedLeaveTypeId !== null) {
      const matched = balances.byType.find(
        (b) => b.leaveTypeId !== null && String(b.leaveTypeId) === String(selectedLeaveTypeId),
      );
      if (matched) {
        return {
          allocated: matched.allocated,
          taken: matched.taken,
          pending: matched.pending,
          available: matched.available,
        };
      }
    }
    if (selectedLeaveType && selectedLeaveType.allocatedDays !== undefined) {
      const allocated = selectedLeaveType.allocatedDays;
      const taken = selectedLeaveType.takenDays ?? 0;
      const pending = selectedLeaveType.pendingDays ?? 0;
      const available =
        selectedLeaveType.availableDays ?? Math.max(0, allocated - taken - pending);
      return { allocated, taken, pending, available };
    }
    if (balances) {
      return {
        allocated: balances.allocated,
        taken: balances.taken,
        pending: balances.pending,
        available: balances.available,
      };
    }
    return { allocated: 0, taken: 0, pending: 0, available: 0 };
  }, [hasSession, isLoadingData, loadError, activeFetchState, selectedLeaveTypeId, selectedLeaveType]);

  const handleSelectLeaveType = useCallback((leaveTypeId: EntityId) => {
    setUserSelectedLeaveTypeId(leaveTypeId);
    setIsLeaveTypeSheetOpen(false);
  }, []);

  const handleRetryLoad = useCallback(() => {
    setReloadCount((c) => c + 1);
  }, []);

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
    setExcludedDateKeys({});
    if (!startDate || (startDate && endDate)) {
      setStartDate(dateKey);
      setEndDate(null);
      setDayDurations({});
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

  const selectedBreakdown = useMemo<BreakdownDayItem[]>(() => {
    if (!startDate) return [];
    const effectiveEnd = endDate || startDate;
    const rangeKeys = enumerateDateRange(startDate, effectiveEnd).filter(
      (k) => !excludedDateKeys[k],
    );

    return rangeKeys.map((dateKey) => {
      const [yStr, mStr, dStr] = dateKey.split('-');
      const y = parseInt(yStr ?? String(currentYear), 10);
      const m = parseInt(mStr ?? '1', 10) - 1;
      const d = parseInt(dStr ?? '1', 10);
      const dateObj = new Date(y, m, d);
      const duration = dayDurations[dateKey] ?? durationType;
      return {
        dateKey,
        monthShort: (MONTH_NAMES[m] ?? '').slice(0, 3).toUpperCase(),
        dayNumber: String(d),
        weekdayName: FULL_WEEKDAY_NAMES[dateObj.getDay()] ?? '',
        duration,
        daysValue: duration === 'half' ? 0.5 : 1,
      };
    });
  }, [startDate, endDate, excludedDateKeys, dayDurations, durationType, currentYear]);

  const handleToggleBreakdownDuration = useCallback(
    (dateKey: string) => {
      setDayDurations((prev) => {
        const current = prev[dateKey] ?? durationType;
        return {
          ...prev,
          [dateKey]: current === 'full' ? 'half' : 'full',
        };
      });
    },
    [durationType],
  );

  const handleRemoveBreakdownDate = useCallback(
    (dateKey: string) => {
      if (selectedBreakdown.length <= 1) {
        setStartDate(null);
        setEndDate(null);
        setDayDurations({});
        setExcludedDateKeys({});
        return;
      }
      setDayDurations((prev) => {
        if (!(dateKey in prev)) return prev;
        const copy = { ...prev };
        delete copy[dateKey];
        return copy;
      });
      const remaining = selectedBreakdown.filter((item) => item.dateKey !== dateKey);
      const firstRemaining = remaining[0]?.dateKey ?? null;
      const lastRemaining = remaining[remaining.length - 1]?.dateKey ?? null;
      if (dateKey === startDate) {
        setStartDate(firstRemaining);
        if (firstRemaining === lastRemaining) {
          setEndDate(null);
        }
      } else if (dateKey === (endDate || startDate)) {
        setEndDate(firstRemaining === lastRemaining ? null : lastRemaining);
      } else {
        setExcludedDateKeys((prev) => ({ ...prev, [dateKey]: true }));
      }
    },
    [selectedBreakdown, startDate, endDate],
  );

  const handleAddDatePress = useCallback(() => {
    if (!startDate) {
      const defaultKey =
        todayKey.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`)
          ? todayKey
          : formatDateKey(currentYear, currentMonth, 1);
      setStartDate(defaultKey);
      setEndDate(null);
      setExcludedDateKeys({});
      return;
    }
    const effectiveEnd = endDate || startDate;
    const nextKey = addDaysToDateKey(effectiveEnd, 1);
    setExcludedDateKeys((prev) => {
      if (!prev[nextKey]) return prev;
      const copy = { ...prev };
      delete copy[nextKey];
      return copy;
    });
    setEndDate(nextKey);
  }, [startDate, endDate, todayKey, currentYear, currentMonth]);

  const formatDateDisplay = (dateStr: string | null) => {
    if (!dateStr) return 'Select date';
    const parts = dateStr.split('-');
    const y = parts[0] ?? String(currentYear);
    const m = parseInt(parts[1] ?? String(currentMonth + 1), 10) - 1;
    const d = parseInt(parts[2] ?? '1', 10);
    return `${d} ${MONTH_NAMES[m]?.slice(0, 3) ?? ''} ${y}`;
  };

  const requestedDuration = useMemo(() => {
    if (selectedBreakdown.length === 0) {
      return {
        days: 0,
        label: '—',
        subtitle: 'Select dates to view duration.',
      };
    }

    const total = selectedBreakdown.reduce((sum, item) => sum + item.daysValue, 0);
    const roundedTotal = Number.isInteger(total) ? total : Number(total.toFixed(1));
    const unit = roundedTotal === 1 ? 'day' : 'days';

    const fmt = (dStr: string) => {
      const parts = dStr.split('-');
      const y = parts[0] ?? String(currentYear);
      const m = parseInt(parts[1] ?? String(currentMonth + 1), 10) - 1;
      const d = parseInt(parts[2] ?? '1', 10);
      return `${d} ${MONTH_NAMES[m]?.slice(0, 3) ?? ''} ${y}`;
    };

    const firstDate = selectedBreakdown[0]!.dateKey;
    const lastDate = selectedBreakdown[selectedBreakdown.length - 1]!.dateKey;
    const subtitle =
      firstDate === lastDate ? `${fmt(firstDate)}` : `${fmt(firstDate)} to ${fmt(lastDate)}`;

    return {
      days: roundedTotal,
      label: `${roundedTotal} ${unit}`,
      subtitle,
    };
  }, [selectedBreakdown, currentYear, currentMonth]);

  const balanceAfterApproval = useMemo(() => {
    const available = summary?.available ?? 0;
    const remaining = Math.max(0, available - requestedDuration.days);
    return Number.isInteger(remaining) ? remaining : Number(remaining.toFixed(1));
  }, [summary, requestedDuration.days]);

  const handleSubmissionSuccess = useCallback(
    (durationSummary: { label: string; subtitle: string }): void => {
      setReloadCount((c) => c + 1);
      setStartDate(null);
      setEndDate(null);
      setDayDurations({});
      setExcludedDateKeys({});
      setReason('');
      setIsSubmitting(false);
      Alert.alert(
        'Request Submitted',
        `Your request for ${durationSummary.label} (${durationSummary.subtitle}) has been sent for approval.`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ],
      );
    },
    [],
  );

  const submitConfirmedLeave = useCallback(
    async (
      payload: SubmitLeaveRequestPayload,
      durationSummary: { label: string; subtitle: string },
    ): Promise<void> => {
      setIsSubmitting(true);
      if (__DEV__) {
        console.log('[RequestLeaveScreen] Resending leave request with overlapConfirmation:', payload);
      }
      try {
        const confirmedRes = await leaveApi.submitLeaveRequest(payload);
        if (__DEV__) {
          console.log('[RequestLeaveScreen] Confirmed leave request succeeded:', confirmedRes);
        }
        handleSubmissionSuccess(durationSummary);
      } catch (error: unknown) {
        setIsSubmitting(false);
        if (__DEV__) {
          console.error('[RequestLeaveScreen] Confirmed leave request failed:', error);
        }
        Alert.alert(
          'Submission Failed',
          isApiError(error) ? error.message : 'Unable to submit leave request right now.',
        );
      }
    },
    [handleSubmissionSuccess],
  );

  const promptOverlapConfirmation = useCallback(
    (
      payload: SubmitLeaveRequestPayload,
      confirmationToken: string,
      durationSummary: { label: string; subtitle: string },
    ): void => {
      if (__DEV__) {
        console.warn('[RequestLeaveScreen] Overlap confirmation required:', confirmationToken);
      }
      Alert.alert(
        'Overlapping Leave Detected',
        'Your selected dates overlap with an existing leave request. Would you like to confirm and submit anyway?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm & Submit',
            onPress: () => {
              void submitConfirmedLeave(
                { ...payload, overlapConfirmation: confirmationToken },
                durationSummary,
              );
            },
          },
        ],
      );
    },
    [submitConfirmedLeave],
  );

  const sendLeaveSubmission = useCallback(
    async (
      payload: SubmitLeaveRequestPayload,
      durationSummary: { label: string; subtitle: string },
    ): Promise<void> => {
      setIsSubmitting(true);
      if (__DEV__) {
        console.log('[RequestLeaveScreen] Submitting leave request:', payload);
      }
      try {
        const res = await leaveApi.submitLeaveRequest(payload);
        if (res.overlapConfirmationRequired) {
          setIsSubmitting(false);
          promptOverlapConfirmation(
            payload,
            res.overlapConfirmationRequired,
            durationSummary,
          );
          return;
        }
        if (__DEV__) {
          console.log('[RequestLeaveScreen] Leave request submitted:', res);
        }
        handleSubmissionSuccess(durationSummary);
      } catch (error: unknown) {
        const overlapToken = extractLeaveOverlapConfirmation(error);
        setIsSubmitting(false);
        if (overlapToken) {
          promptOverlapConfirmation(payload, overlapToken, durationSummary);
          return;
        }

        if (__DEV__) {
          console.error('[RequestLeaveScreen] Leave request submission failed:', error);
        }
        Alert.alert(
          'Submission Failed',
          isApiError(error) ? error.message : 'Unable to submit leave request right now.',
        );
      }
    },
    [handleSubmissionSuccess, promptOverlapConfirmation],
  );

  const handleSubmit = (): void => {
    if (!startDate) {
      Alert.alert('Missing Date', 'Please select at least a start date for your leave.');
      return;
    }

    if (!reason.trim()) {
      Alert.alert('Reason Required', 'Please enter a reason for your leave request.');
      return;
    }

    if (!hasSession || employmentId === null || employmentId === '') {
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
      return;
    }

    if (selectedLeaveTypeId === null) {
      Alert.alert(
        'Leave Type Required',
        'Please select an eligible leave type before submitting.',
      );
      return;
    }

    const firstDay = selectedBreakdown[0];
    const lastDay = selectedBreakdown[selectedBreakdown.length - 1];
    const effectiveStart = firstDay?.dateKey ?? startDate;
    const effectiveEnd = lastDay?.dateKey ?? endDate ?? startDate;
    const isHalfDayStart = firstDay ? firstDay.duration === 'half' : durationType === 'half';
    const isHalfDayEnd =
      lastDay && firstDay && lastDay.dateKey !== firstDay.dateKey
        ? lastDay.duration === 'half'
        : false;

    const payload: SubmitLeaveRequestPayload = {
      employmentId,
      leaveTypeId: selectedLeaveTypeId,
      startDate: effectiveStart,
      endDate: effectiveEnd,
      isHalfDayStart,
      isHalfDayEnd,
      totalDaysApplied: requestedDuration.days,
      reason: reason.trim(),
      requestId: generateClientRequestId(),
    };

    void sendLeaveSubmission(payload, requestedDuration);
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
    hasSession,
    currentYear,
    currentMonth,
    todayKey,
    durationType,
    startDate,
    endDate,
    reason,
    isLoadingData,
    loadError,
    isSubmitting,
    leaveTypes,
    selectedLeaveTypeId,
    selectedLeaveType,
    isLeaveTypeSheetOpen,
    setIsLeaveTypeSheetOpen,
    summary,
    calendarDays,
    selectedBreakdown,
    requestedDuration,
    balanceAfterApproval,
    setDurationType,
    setReason,
    handleSelectLeaveType,
    handleToggleBreakdownDuration,
    handleRemoveBreakdownDate,
    handleAddDatePress,
    handlePrevMonth,
    handleNextMonth,
    handleSelectDay,
    formatDateDisplay,
    handleSubmit,
    handleRetryLoad,
    handleApprovalStatus,
    handleBack,
    handleStartDatePress,
    handleEndDatePress,
  };
}
