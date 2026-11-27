import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { type EntityId, useAuthStore } from '@/features/auth';
import { isApiError } from '@/shared/api';
import { useAppTheme } from '@/shared/theme';
import {
  type EligibleLeaveType,
  extractLeaveOverlapConfirmation,
  leaveApi,
  type SubmitLeaveRequestPayload,
} from '../../api';

export type EditLeaveStatus = 'approved' | 'pending' | 'rejected';

export type EditLeaveTypeOption = 'Sick leave' | 'Casual leave' | 'Earned leave';

export type EditDurationOption = 'Full days' | 'Half day';

export const EDIT_LEAVE_TYPE_OPTIONS: EditLeaveTypeOption[] = [
  'Sick leave',
  'Casual leave',
  'Earned leave',
];

export const EDIT_DURATION_OPTIONS: EditDurationOption[] = ['Full days', 'Half day'];

const MONTH_SHORT = [
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
];

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const FULL_MONTHS = [
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

function mapLeaveTypeParam(param?: string): EditLeaveTypeOption {
  if (!param) return 'Casual leave';
  const lower = param.toLowerCase();
  if (lower.includes('sick')) return 'Sick leave';
  if (lower.includes('earned')) return 'Earned leave';
  return 'Casual leave';
}

function generateRequestId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function calculateInclusiveDays(startKey: string, endKey: string): number {
  const [sy, sm, sd] = startKey.split('-').map((n) => parseInt(n, 10));
  const [ey, em, ed] = endKey.split('-').map((n) => parseInt(n, 10));
  const start = new Date(sy ?? 2026, (sm ?? 1) - 1, sd ?? 1);
  const end = new Date(ey ?? 2026, (em ?? 1) - 1, ed ?? 1);
  const diffMs = end.getTime() - start.getTime();
  const days = Math.floor(diffMs / 86_400_000) + 1;
  return days > 0 ? days : 1;
}

export function formatPickerDateLabel(dateKey: string): string {
  const [yStr, mStr, dStr] = dateKey.split('-');
  const year = parseInt(yStr ?? '2026', 10);
  const monthIdx = parseInt(mStr ?? '11', 10) - 1;
  const day = parseInt(dStr ?? '30', 10);
  const dt = new Date(year, monthIdx, day);
  const weekday = WEEKDAY_SHORT[dt.getDay()] ?? 'Mon';
  const month = MONTH_SHORT[monthIdx] ?? 'Nov';
  return `${weekday}, ${day} ${month} ${year}`;
}

export interface EditCalendarDay {
  dayNumber: number;
  dateKey: string;
  isCurrentMonth: boolean;
}

function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'NA';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
}

export interface UseEditLeaveRequestScreenResult {
  isDark: boolean;
  requestId: string;
  status: EditLeaveStatus;
  isRejected: boolean;
  isPending: boolean;
  isApproved: boolean;
  submittedDate: string;
  originalRangeLabel: string;
  approverName: string;
  approverInitials: string;
  rejectedReason: string;
  leaveType: string;
  leaveTypeOptions: string[];
  startDate: string;
  endDate: string;
  formattedStartDate: string;
  formattedEndDate: string;
  duration: EditDurationOption;
  reason: string;
  secondaryReason: string;
  secondaryReasonError: string | null;
  isSaving: boolean;
  isCancelling: boolean;
  isLeaveTypeSheetOpen: boolean;
  isDurationSheetOpen: boolean;
  activeDatePicker: 'start' | 'end' | null;
  pickerYear: number;
  pickerMonth: number;
  pickerMonthLabel: string;
  pickerCalendarDays: EditCalendarDay[];
  setReason: (val: string) => void;
  setSecondaryReason: (val: string) => void;
  setIsLeaveTypeSheetOpen: (open: boolean) => void;
  setIsDurationSheetOpen: (open: boolean) => void;
  openDatePicker: (which: 'start' | 'end') => void;
  closeDatePicker: () => void;
  handlePickerPrevMonth: () => void;
  handlePickerNextMonth: () => void;
  handlePickCalendarDate: (dateKey: string) => void;
  handleSelectLeaveType: (type: string) => void;
  handleSelectDuration: (dur: EditDurationOption) => void;
  handleCancelLeave: () => void;
  handleSaveChanges: () => void;
  handleBack: () => void;
}

export function useEditLeaveRequestScreen(): UseEditLeaveRequestScreenResult {
  const theme = useAppTheme();
  const isDark = theme.isDark;
  const employmentId = useAuthStore((s) => s.session?.employmentId ?? null);
  const hasSession = employmentId !== null && employmentId !== '';

  const params = useLocalSearchParams<{
    requestId?: string;
    status?: string;
    leaveType?: string;
    leaveTypeId?: string;
    submittedDate?: string;
    originalRange?: string;
    startDate?: string;
    endDate?: string;
    duration?: string;
    reason?: string;
    rejectedReason?: string;
    approverName?: string;
    approverInitials?: string;
  }>();

  const requestId = params.requestId ?? 'req-1';
  const rawStatusParam = params.status?.trim().toLowerCase();
  const initialStatus: EditLeaveStatus =
    rawStatusParam === 'rejected'
      ? 'rejected'
      : rawStatusParam === 'pending' || rawStatusParam === 'submitted'
        ? 'pending'
        : 'approved';
  const [status, setStatus] = useState<EditLeaveStatus>(initialStatus);
  const isRejected = status === 'rejected';
  const isPending = status === 'pending';
  const isApproved = status === 'approved';

  const [submittedDate, setSubmittedDate] = useState<string>(params.submittedDate ?? '—');
  const [originalRangeLabel, setOriginalRangeLabel] = useState<string>(
    params.originalRange ?? '—',
  );
  const [approverName, setApproverName] = useState<string>(params.approverName ?? '');
  const approverInitials = useMemo(
    () => params.approverInitials ?? (approverName ? computeInitials(approverName) : ''),
    [params.approverInitials, approverName],
  );
  const [rejectedReason, setRejectedReason] = useState<string>(params.rejectedReason ?? '');

  const todayKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  const [eligibleLeaveTypes, setEligibleLeaveTypes] = useState<EligibleLeaveType[]>([]);
  const [leaveType, setLeaveType] = useState<string>(() => mapLeaveTypeParam(params.leaveType));
  const [selectedLeaveTypeId, setSelectedLeaveTypeId] = useState<EntityId | null>(
    params.leaveTypeId ?? null,
  );
  const [startDate, setStartDate] = useState<string>(params.startDate ?? todayKey);
  const [endDate, setEndDate] = useState<string>(params.endDate ?? params.startDate ?? todayKey);
  const [duration, setDuration] = useState<EditDurationOption>(
    params.duration === 'Half day' ? 'Half day' : 'Full days',
  );
  const [reason, setReason] = useState<string>(params.reason ?? '');
  const [secondaryReason, setSecondaryReason] = useState<string>('');
  const [secondaryReasonError, setSecondaryReasonError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [isLeaveTypeSheetOpen, setIsLeaveTypeSheetOpen] = useState(false);
  const [isDurationSheetOpen, setIsDurationSheetOpen] = useState(false);
  const [activeDatePicker, setActiveDatePicker] = useState<'start' | 'end' | null>(null);
  const [pickerYear, setPickerYear] = useState(2026);
  const [pickerMonth, setPickerMonth] = useState(10); // November 2026

  useEffect(() => {
    if (!hasSession || employmentId === null || employmentId === '') return;

    let cancelled = false;
    void Promise.allSettled([
      leaveApi.getEligibleLeaveTypes(employmentId),
      leaveApi.getLeaveRequests(employmentId),
    ]).then(([typesRes, requestsRes]) => {
      if (cancelled) return;

      if (typesRes.status === 'fulfilled' && typesRes.value.length > 0) {
        const types = typesRes.value;
        setEligibleLeaveTypes(types);

        const matchedById =
          params.leaveTypeId !== undefined
            ? types.find((t) => String(t.id) === String(params.leaveTypeId))
            : undefined;
        const initialTypeName = mapLeaveTypeParam(params.leaveType);
        const matchedByName = types.find((t) =>
          t.name.toLowerCase().includes(initialTypeName.split(' ')[0]?.toLowerCase() ?? ''),
        );
        const resolved = matchedById ?? matchedByName ?? types[0];
        if (resolved) {
          setSelectedLeaveTypeId(resolved.id);
          setLeaveType(resolved.name);
        }
      }

      if (requestsRes.status === 'fulfilled') {
        const matchedReq = requestsRes.value.find(
          (r) => r.leaveRequestId !== null && String(r.leaveRequestId) === String(requestId),
        );
        if (matchedReq) {
          const reqNorm = matchedReq.status.trim().toUpperCase();
          if (reqNorm === 'REJECTED' || reqNorm === 'DECLINED' || reqNorm === 'DENIED') {
            setStatus('rejected');
          } else if (
            reqNorm === 'PENDING' ||
            reqNorm === 'SUBMITTED' ||
            reqNorm === 'REQUESTED' ||
            reqNorm === 'PENDING_APPROVAL'
          ) {
            setStatus('pending');
          } else if (reqNorm === 'APPROVED') {
            setStatus('approved');
          }

          if (matchedReq.leaveTypeId !== null) {
            setSelectedLeaveTypeId(matchedReq.leaveTypeId);
          }
          if (matchedReq.leaveTypeName) {
            setLeaveType(matchedReq.leaveTypeName);
          }
          if (matchedReq.startDate) {
            setStartDate(matchedReq.startDate.slice(0, 10));
          }
          if (matchedReq.endDate) {
            setEndDate(matchedReq.endDate.slice(0, 10));
          }
          if (matchedReq.isHalfDayStart || matchedReq.isHalfDayEnd) {
            setDuration('Half day');
          }
          if (matchedReq.reason) {
            setReason(matchedReq.reason);
          }
          if (matchedReq.approverName) {
            setApproverName(matchedReq.approverName);
          }
          if (matchedReq.decisionNote) {
            setRejectedReason(matchedReq.decisionNote);
          }
          if (matchedReq.createdAtUtc) {
            const dKey = matchedReq.createdAtUtc.slice(0, 10);
            const [yStr, mStr, dStr] = dKey.split('-');
            const mIdx = parseInt(mStr ?? '1', 10) - 1;
            const dNum = parseInt(dStr ?? '1', 10);
            if (yStr && !Number.isNaN(mIdx) && !Number.isNaN(dNum)) {
              setSubmittedDate(`${dNum} ${MONTH_SHORT[mIdx] ?? 'Jan'} ${yStr}`);
            }
          }
          if (matchedReq.startDate) {
            const sKey = matchedReq.startDate.slice(0, 10);
            const eKey = (matchedReq.endDate ?? matchedReq.startDate).slice(0, 10);
            const days = matchedReq.totalDaysApplied ?? calculateInclusiveDays(sKey, eKey);
            setOriginalRangeLabel(
              `${sKey}${eKey !== sKey ? ` – ${eKey}` : ''} · ${days} working ${days === 1 ? 'day' : 'days'}`,
            );
          }
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [hasSession, employmentId, params.leaveTypeId, params.leaveType, requestId]);

  const leaveTypeOptions = useMemo(() => {
    if (eligibleLeaveTypes.length > 0) {
      return eligibleLeaveTypes.map((t) => t.name);
    }
    return EDIT_LEAVE_TYPE_OPTIONS;
  }, [eligibleLeaveTypes]);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/leave/status');
    }
  }, []);

  const openDatePicker = useCallback(
    (which: 'start' | 'end') => {
      const targetKey = which === 'start' ? startDate : endDate;
      const [yStr, mStr] = targetKey.split('-');
      const y = parseInt(yStr ?? '2026', 10);
      const m = parseInt(mStr ?? '11', 10) - 1;
      if (!Number.isNaN(y) && !Number.isNaN(m)) {
        setPickerYear(y);
        setPickerMonth(m);
      }
      setActiveDatePicker(which);
    },
    [startDate, endDate],
  );

  const closeDatePicker = useCallback(() => {
    setActiveDatePicker(null);
  }, []);

  const handlePickerPrevMonth = useCallback(() => {
    setPickerMonth((prev) => {
      if (prev === 0) {
        setPickerYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }, []);

  const handlePickerNextMonth = useCallback(() => {
    setPickerMonth((prev) => {
      if (prev === 11) {
        setPickerYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  const handlePickCalendarDate = useCallback(
    (dateKey: string) => {
      if (activeDatePicker === 'start') {
        setStartDate(dateKey);
        if (dateKey > endDate) {
          setEndDate(dateKey);
        }
      } else if (activeDatePicker === 'end') {
        if (dateKey < startDate) {
          setStartDate(dateKey);
        }
        setEndDate(dateKey);
      }
      setActiveDatePicker(null);
    },
    [activeDatePicker, startDate, endDate],
  );

  const handleSelectLeaveType = useCallback(
    (typeName: string) => {
      setLeaveType(typeName);
      const matched = eligibleLeaveTypes.find((t) => t.name === typeName);
      if (matched) {
        setSelectedLeaveTypeId(matched.id);
      }
      setIsLeaveTypeSheetOpen(false);
    },
    [eligibleLeaveTypes],
  );

  const handleSelectDuration = useCallback((dur: EditDurationOption) => {
    setDuration(dur);
    setIsDurationSheetOpen(false);
  }, []);

  const handleSecondaryReasonChange = useCallback((val: string) => {
    setSecondaryReason(val);
    if (val.trim().length > 0) {
      setSecondaryReasonError(null);
    }
  }, []);

  const executeCancelLeave = useCallback(async () => {
    setIsCancelling(true);
    try {
      const cancelReason =
        secondaryReason.trim() ||
        reason.trim() ||
        (isPending ? 'Withdrawn by employee' : 'Cancelled by employee');

      if (hasSession) {
        if (isPending) {
          await leaveApi.withdrawLeaveRequest(requestId, cancelReason);
        } else {
          await leaveApi.cancelLeaveRequest(requestId, generateRequestId(), cancelReason);
        }
      }
      setIsCancelling(false);
      Alert.alert(
        isPending ? 'Request Withdrawn' : 'Leave Cancelled',
        isPending
          ? 'Your pending leave request has been withdrawn.'
          : 'Your approved leave request has been cancelled.',
        [{ text: 'OK', onPress: handleBack }],
      );
    } catch (error) {
      setIsCancelling(false);
      Alert.alert(
        isPending ? 'Withdrawal Failed' : 'Cancellation Failed',
        isApiError(error)
          ? error.message
          : isPending
            ? 'Unable to withdraw this leave request right now.'
            : 'Unable to cancel this leave request right now.',
      );
    }
  }, [hasSession, isPending, requestId, secondaryReason, reason, handleBack]);

  const handleCancelLeave = useCallback(() => {
    Alert.alert(
      isPending ? 'Withdraw pending leave' : 'Cancel approved leave',
      isPending
        ? 'Are you sure you want to withdraw this pending leave request?'
        : 'Are you sure you want to cancel this approved leave request? Your leave balance will be restored.',
      [
        { text: 'Keep leave', style: 'cancel' },
        {
          text: isPending ? 'Withdraw request' : 'Cancel leave',
          style: 'destructive',
          onPress: () => {
            void executeCancelLeave();
          },
        },
      ],
    );
  }, [isPending, executeCancelLeave]);

  const submitConfirmedEdit = useCallback(
    async (payload: SubmitLeaveRequestPayload) => {
      setIsSaving(true);
      try {
        await leaveApi.submitLeaveRequest(payload);
        setIsSaving(false);
        const title = isRejected ? 'Reapplication Submitted' : 'Changes Saved';
        const message = isRejected
          ? 'Your leave request has been reapplied with your updated reason.'
          : 'Your updated leave request has been saved.';
        Alert.alert(title, message, [{ text: 'OK', onPress: handleBack }]);
      } catch (error) {
        setIsSaving(false);
        Alert.alert(
          'Submission Failed',
          isApiError(error) ? error.message : 'Unable to update leave request right now.',
        );
      }
    },
    [isRejected, handleBack],
  );

  const submitEditRequest = useCallback(
    async (payload: SubmitLeaveRequestPayload) => {
      setIsSaving(true);
      try {
        const res = await leaveApi.submitLeaveRequest(payload);
        if (res.overlapConfirmationRequired) {
          setIsSaving(false);
          Alert.alert(
            'Overlapping Leave Detected',
            'Your updated dates overlap with an existing leave request. Do you want to proceed?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Confirm & Submit',
                onPress: () => {
                  void submitConfirmedEdit({
                    ...payload,
                    overlapConfirmation: res.overlapConfirmationRequired,
                  });
                },
              },
            ],
          );
          return;
        }
        setIsSaving(false);
        const title = isRejected ? 'Reapplication Submitted' : 'Changes Saved';
        const message = isRejected
          ? 'Your leave request has been reapplied with your updated reason.'
          : 'Your updated leave request has been saved.';
        Alert.alert(title, message, [{ text: 'OK', onPress: handleBack }]);
      } catch (error) {
        const overlapToken = extractLeaveOverlapConfirmation(error);
        setIsSaving(false);
        if (overlapToken) {
          Alert.alert(
            'Overlapping Leave Detected',
            'Your updated dates overlap with an existing leave request. Do you want to proceed?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Confirm & Submit',
                onPress: () => {
                  void submitConfirmedEdit({
                    ...payload,
                    overlapConfirmation: overlapToken,
                  });
                },
              },
            ],
          );
          return;
        }
        Alert.alert(
          'Submission Failed',
          isApiError(error) ? error.message : 'Unable to update leave request right now.',
        );
      }
    },
    [isRejected, handleBack, submitConfirmedEdit],
  );

  const handleSaveChanges = useCallback(() => {
    if (isRejected && secondaryReason.trim().length < 3) {
      setSecondaryReasonError('Please enter a valid reason to reapply.');
      return;
    }

    setSecondaryReasonError(null);

    const effectiveReason = isRejected
      ? secondaryReason.trim()
      : secondaryReason.trim()
        ? `${reason.trim()} (${secondaryReason.trim()})`
        : reason.trim();

    if (hasSession && employmentId !== null && employmentId !== '' && selectedLeaveTypeId !== null) {
      const isHalf = duration === 'Half day';
      const totalDaysApplied = isHalf ? 0.5 : calculateInclusiveDays(startDate, endDate);
      const payload: SubmitLeaveRequestPayload = {
        employmentId,
        leaveTypeId: selectedLeaveTypeId,
        startDate,
        endDate,
        isHalfDayStart: isHalf,
        isHalfDayEnd: false,
        totalDaysApplied,
        reason: effectiveReason || 'Leave request update',
        requestId: generateRequestId(),
        ...(isRejected ? { appealsRequestId: requestId } : { replacesRequestId: requestId }),
      };
      void submitEditRequest(payload);
      return;
    }

    setIsSaving(true);
    const title = isRejected ? 'Reapplication Submitted' : 'Changes Saved';
    const message = isRejected
      ? 'Your leave request has been reapplied with your updated reason.'
      : 'Your updated leave request has been saved.';

    Alert.alert(title, message, [
      {
        text: 'OK',
        onPress: () => {
          setIsSaving(false);
          handleBack();
        },
      },
    ]);
  }, [
    isRejected,
    secondaryReason,
    reason,
    hasSession,
    employmentId,
    selectedLeaveTypeId,
    duration,
    startDate,
    endDate,
    requestId,
    submitEditRequest,
    handleBack,
  ]);

  const pickerCalendarDays = useMemo<EditCalendarDay[]>(() => {
    const firstDayIndex = new Date(pickerYear, pickerMonth, 1).getDay();
    const daysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
    const days: EditCalendarDay[] = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: 0, dateKey: `pad-${i}`, isCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const mPad = String(pickerMonth + 1).padStart(2, '0');
      const dPad = String(d).padStart(2, '0');
      days.push({
        dayNumber: d,
        dateKey: `${pickerYear}-${mPad}-${dPad}`,
        isCurrentMonth: true,
      });
    }
    return days;
  }, [pickerYear, pickerMonth]);

  const formattedStartDate = useMemo(() => formatPickerDateLabel(startDate), [startDate]);
  const formattedEndDate = useMemo(() => formatPickerDateLabel(endDate), [endDate]);
  const pickerMonthLabel = `${FULL_MONTHS[pickerMonth] ?? 'November'} ${pickerYear}`;

  return {
    isDark,
    requestId,
    status,
    isRejected,
    isPending,
    isApproved,
    submittedDate,
    originalRangeLabel,
    approverName,
    approverInitials,
    rejectedReason,
    leaveType,
    leaveTypeOptions,
    startDate,
    endDate,
    formattedStartDate,
    formattedEndDate,
    duration,
    reason,
    secondaryReason,
    secondaryReasonError,
    isSaving,
    isCancelling,
    isLeaveTypeSheetOpen,
    isDurationSheetOpen,
    activeDatePicker,
    pickerYear,
    pickerMonth,
    pickerMonthLabel,
    pickerCalendarDays,
    setReason,
    setSecondaryReason: handleSecondaryReasonChange,
    setIsLeaveTypeSheetOpen,
    setIsDurationSheetOpen,
    openDatePicker,
    closeDatePicker,
    handlePickerPrevMonth,
    handlePickerNextMonth,
    handlePickCalendarDate,
    handleSelectLeaveType,
    handleSelectDuration,
    handleCancelLeave,
    handleSaveChanges,
    handleBack,
  };
}
