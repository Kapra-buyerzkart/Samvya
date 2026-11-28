import { useCallback, useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { type EntityId, useAuthStore } from '@/features/auth';
import { isApiError } from '@/shared/api';
import { useAppTheme } from '@/shared/theme';
import {
  type EligibleLeaveType,
  leaveApi,
  type LeaveBalancesResponse,
  type LeaveCalendarMonthItem,
  type LeaveLedgerEntry,
  type LeaveRequestHistoryItem,
} from '../../api';

export type LeaveTypeKey = 'sick' | 'casual' | 'earned';

export interface LeaveTypeTab {
  key: LeaveTypeKey;
  label: string;
}

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
  status: 'approved' | 'pending' | 'rejected';
  leaveTypeId?: EntityId | null;
  startDate?: string;
  endDate?: string;
  reason?: string;
  duration?: 'Full days' | 'Half day';
  originalRange?: string;
  approverName?: string;
  rejectedReason?: string;
}

export interface CarryForwardInfo {
  leaveTypeLabel: string;
  previousBalance: number;
  carriedForward: number;
  usedDays: number;
  availableDays: number;
  expiresOn: string;
  policyNote: string;
}

export interface LeaveBalanceSummary {
  totalLeaves: number;
  balanceLeaves: number;
  leavesTaken: number;
}

export const LEAVE_TYPE_TABS: LeaveTypeTab[] = [
  { key: 'casual', label: 'Casual leaves' },
  { key: 'sick', label: 'Sick leaves' },
  { key: 'earned', label: 'Earned leave' },
];

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

function formatDateKeyDisplay(dateKey: string | null): string | null {
  if (!dateKey) return null;
  const parts = dateKey.split('-');
  const year = parts[0] ?? '';
  const monthIdx = parseInt(parts[1] ?? '1', 10) - 1;
  const day = parseInt(parts[2] ?? '1', 10);
  if (!year || Number.isNaN(monthIdx) || Number.isNaN(day)) return null;
  const monthShort = (MONTH_NAMES[monthIdx] ?? 'Jan').slice(0, 3);
  return `${day} ${monthShort} ${year}`;
}

function classifyLeaveTypeKey(nameOrCode?: string): LeaveTypeKey | null {
  const lower = (nameOrCode ?? '').toLowerCase();
  if (lower.includes('sick') || lower === 'sl') return 'sick';
  if (lower.includes('casual') || lower === 'cl') return 'casual';
  if (lower.includes('earned') || lower.includes('annual') || lower === 'el') return 'earned';
  return null;
}

function normalizeLeaveStatus(rawStatus: string): 'APPROVED' | 'PENDING' | 'REJECTED' | null {
  const upper = rawStatus.trim().toUpperCase();
  if (upper === 'APPROVED' || upper === 'GRANTED' || upper === 'ACCEPTED') {
    return 'APPROVED';
  }
  if (
    upper === 'PENDING' ||
    upper === 'SUBMITTED' ||
    upper === 'REQUESTED' ||
    upper === 'PENDING_APPROVAL' ||
    upper === 'AWAITING_APPROVAL' ||
    upper === 'IN_REVIEW'
  ) {
    return 'PENDING';
  }
  if (upper === 'REJECTED' || upper === 'DECLINED' || upper === 'DENIED') {
    return 'REJECTED';
  }
  return null;
}

function enumerateDateKeys(startStr?: string, endStr?: string): string[] {
  if (!startStr) return [];
  const startKey = startStr.slice(0, 10);
  const endKey = (endStr ?? startStr).slice(0, 10);
  const [sy, sm, sd] = startKey.split('-').map((v) => parseInt(v, 10));
  const [ey, em, ed] = endKey.split('-').map((v) => parseInt(v, 10));
  if (!sy || !sm || !sd || !ey || !em || !ed) return [startKey];

  const cursor = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);
  const keys: string[] = [];
  let guard = 0;

  while (cursor <= end && guard < 62) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, '0');
    const d = String(cursor.getDate()).padStart(2, '0');
    keys.push(`${y}-${m}-${d}`);
    cursor.setDate(cursor.getDate() + 1);
    guard += 1;
  }

  return keys.length > 0 ? keys : [startKey];
}

export interface UseLeaveStatusScreenResult {
  isDark: boolean;
  hasSession: boolean;
  isLoading: boolean;
  loadError: string | null;
  selectedLeaveType: LeaveTypeKey;
  leaveTypeTabs: LeaveTypeTab[];
  leaveSummary: LeaveBalanceSummary;
  currentYear: number;
  currentMonth: number;
  selectedFilter: StatusFilter;
  selectedDate: string | null;
  formattedSelectedDate: string | null;
  isCarryForwardsOpen: boolean;
  carryForwardInfo: CarryForwardInfo;
  calendarDays: CalendarDay[];
  displayedRecords: LeaveRecord[];
  approvedDates: Set<string>;
  pendingDates: Set<string>;
  rejectedDates: Set<string>;
  handleSelectLeaveType: (type: LeaveTypeKey) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleToggleFilter: () => void;
  handleSelectDatePress: () => void;
  handleDayPress: (dateKey: string) => void;
  handleOpenCarryForwards: () => void;
  handleCloseCarryForwards: () => void;
  handleViewLeaveHistory: () => void;
  handleAttendancePress: () => void;
  handleEditLeaveRequest: (record: LeaveRecord) => void;
  handleRetryLoad: () => void;
  handleBack: () => void;
}

export function useLeaveStatusScreen(): UseLeaveStatusScreenResult {
  const theme = useAppTheme();
  const isDark = theme.isDark;
  const employmentId = useAuthStore((s) => s.session?.employmentId ?? null);
  const hasSession = employmentId !== null && employmentId !== '';

  const initialNow = useMemo(() => new Date(), []);

  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveTypeKey>('casual');
  const [currentYear, setCurrentYear] = useState(initialNow.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialNow.getMonth());
  const [selectedFilter, setSelectedFilter] = useState<StatusFilter>('all');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isCarryForwardsOpen, setIsCarryForwardsOpen] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);

  const [fetchState, setFetchState] = useState<{
    key: string;
    leaveTypes: EligibleLeaveType[];
    balances: LeaveBalancesResponse | null;
    requests: LeaveRequestHistoryItem[];
    monthItems: LeaveCalendarMonthItem[];
    ledgerEntries: LeaveLedgerEntry[];
    error: string | null;
  } | null>(null);

  const requestKey = hasSession
    ? `${employmentId}:${currentYear}:${currentMonth}:${reloadCount}`
    : null;

  useEffect(() => {
    if (!requestKey || employmentId === null || employmentId === '') {
      return;
    }

    let cancelled = false;

    void Promise.allSettled([
      leaveApi.getEligibleLeaveTypes(employmentId),
      leaveApi.getLeaveBalances(employmentId, currentYear),
      leaveApi.getLeaveRequests(employmentId),
      leaveApi.getLeaveCalendarMonth(employmentId, currentYear, currentMonth + 1),
      leaveApi.getLeaveLedger(employmentId, currentYear),
    ]).then(([typesRes, balancesRes, requestsRes, monthRes, ledgerRes]) => {
      if (cancelled) return;

      const allFailed =
        typesRes.status === 'rejected' &&
        balancesRes.status === 'rejected' &&
        requestsRes.status === 'rejected' &&
        monthRes.status === 'rejected' &&
        ledgerRes.status === 'rejected';

      if (allFailed) {
        const err = typesRes.reason ?? balancesRes.reason ?? requestsRes.reason;
        setFetchState({
          key: requestKey,
          leaveTypes: [],
          balances: null,
          requests: [],
          monthItems: [],
          ledgerEntries: [],
          error:
            isApiError(err) && err.message
              ? err.message
              : 'Unable to load leave status right now.',
        });
        return;
      }

      setFetchState({
        key: requestKey,
        leaveTypes: typesRes.status === 'fulfilled' ? typesRes.value : [],
        balances: balancesRes.status === 'fulfilled' ? balancesRes.value : null,
        requests: requestsRes.status === 'fulfilled' ? requestsRes.value : [],
        monthItems: monthRes.status === 'fulfilled' ? monthRes.value : [],
        ledgerEntries: ledgerRes.status === 'fulfilled' ? ledgerRes.value : [],
        error: null,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [requestKey, employmentId, currentYear, currentMonth]);

  const isLoading = Boolean(requestKey && fetchState?.key !== requestKey);
  const loadError = requestKey && fetchState?.key === requestKey ? fetchState.error : null;
  const apiTypes = useMemo(
    () => (requestKey && fetchState?.key === requestKey ? fetchState.leaveTypes : []),
    [requestKey, fetchState],
  );
  const apiBalances = requestKey && fetchState?.key === requestKey ? fetchState.balances : null;
  const apiRequests = useMemo(
    () => (requestKey && fetchState?.key === requestKey ? fetchState.requests : []),
    [requestKey, fetchState],
  );
  const apiMonthItems = useMemo(
    () => (requestKey && fetchState?.key === requestKey ? fetchState.monthItems : []),
    [requestKey, fetchState],
  );
  const apiLedgerEntries = useMemo(
    () => (requestKey && fetchState?.key === requestKey ? fetchState.ledgerEntries : []),
    [requestKey, fetchState],
  );

  const leaveTypeTabs = useMemo<LeaveTypeTab[]>(() => {
    if (apiTypes.length === 0) return LEAVE_TYPE_TABS;
    return LEAVE_TYPE_TABS.map((tab) => {
      const matched = apiTypes.find(
        (t) => classifyLeaveTypeKey(t.name) === tab.key || classifyLeaveTypeKey(t.code) === tab.key,
      );
      return matched ? { key: tab.key, label: matched.name } : tab;
    });
  }, [apiTypes]);

  const leaveSummary = useMemo<LeaveBalanceSummary>(() => {
    if (!hasSession) {
      return { totalLeaves: 0, balanceLeaves: 0, leavesTaken: 0 };
    }

    const matchedBalance = apiBalances?.byType.find(
      (b) =>
        classifyLeaveTypeKey(b.leaveTypeName) === selectedLeaveType ||
        classifyLeaveTypeKey(b.leaveTypeCode) === selectedLeaveType,
    );

    if (matchedBalance) {
      return {
        totalLeaves: Math.max(0, Math.round(matchedBalance.allocated)),
        balanceLeaves: Math.max(0, Math.round(matchedBalance.available)),
        leavesTaken: Math.max(0, Math.round(matchedBalance.taken)),
      };
    }

    const matchedType = apiTypes.find(
      (t) =>
        classifyLeaveTypeKey(t.name) === selectedLeaveType ||
        classifyLeaveTypeKey(t.code) === selectedLeaveType,
    );

    if (matchedType) {
      return {
        totalLeaves: Math.max(0, Math.round(matchedType.allocatedDays ?? 0)),
        balanceLeaves: Math.max(0, Math.round(matchedType.availableDays ?? 0)),
        leavesTaken: Math.max(0, Math.round(matchedType.takenDays ?? 0)),
      };
    }

    return { totalLeaves: 0, balanceLeaves: 0, leavesTaken: 0 };
  }, [hasSession, apiBalances, apiTypes, selectedLeaveType]);

  const { approvedDates, pendingDates, rejectedDates, allRecords } = useMemo(() => {
    const approved = new Set<string>();
    const pending = new Set<string>();
    const rejected = new Set<string>();
    const records: LeaveRecord[] = [];

    if (!hasSession) {
      return {
        approvedDates: approved,
        pendingDates: pending,
        rejectedDates: rejected,
        allRecords: records,
      };
    }

    const typeFiltered = apiRequests.filter((req) => {
      let key = classifyLeaveTypeKey(req.leaveTypeName);
      if (key === null && req.leaveTypeId !== null && req.leaveTypeId !== undefined) {
        const matchedType = apiTypes.find((t) => String(t.id) === String(req.leaveTypeId));
        if (matchedType) {
          key = classifyLeaveTypeKey(matchedType.name) ?? classifyLeaveTypeKey(matchedType.code);
        }
      }
      return key === null || key === selectedLeaveType;
    });

    for (const req of typeFiltered) {
      const normStatus = normalizeLeaveStatus(req.status);
      const dateKeys = enumerateDateKeys(req.startDate, req.endDate);

      if (normStatus === 'APPROVED') {
        for (const k of dateKeys) approved.add(k);
      } else if (normStatus === 'PENDING') {
        for (const k of dateKeys) pending.add(k);
      } else if (normStatus === 'REJECTED') {
        for (const k of dateKeys) rejected.add(k);
      }

      if (normStatus === 'APPROVED' || normStatus === 'PENDING' || normStatus === 'REJECTED') {
        const mappedStatus: LeaveRecord['status'] =
          normStatus === 'APPROVED'
            ? 'approved'
            : normStatus === 'REJECTED'
              ? 'rejected'
              : 'pending';
        const reqDate =
          formatDateKeyDisplay(req.createdAtUtc?.slice(0, 10) ?? req.startDate?.slice(0, 10) ?? null) ??
          '—';
        const actDate =
          mappedStatus === 'pending'
            ? formatDateKeyDisplay(req.decidedAtUtc?.slice(0, 10) ?? null) ?? 'Awaiting review'
            : formatDateKeyDisplay(
                req.decidedAtUtc?.slice(0, 10) ?? req.startDate?.slice(0, 10) ?? null,
              ) ?? reqDate;
        const startLabel = formatDateKeyDisplay(req.startDate?.slice(0, 10) ?? null);
        const endLabel = formatDateKeyDisplay(req.endDate?.slice(0, 10) ?? null);
        const daysCount = req.totalDaysApplied ?? 1;
        const rangePart =
          startLabel && endLabel && startLabel !== endLabel
            ? `${startLabel} – ${endLabel}`
            : startLabel ?? reqDate;
        const originalRange = `${rangePart} · ${daysCount} working ${daysCount === 1 ? 'day' : 'days'}`;

        records.push({
          id: String(req.leaveRequestId ?? `${normStatus}-${records.length + 1}`),
          requestDate: reqDate,
          actionDate: actDate,
          status: mappedStatus,
          leaveTypeId: req.leaveTypeId,
          startDate: req.startDate?.slice(0, 10),
          endDate: req.endDate?.slice(0, 10),
          reason: req.reason,
          duration: req.isHalfDayStart || req.isHalfDayEnd ? 'Half day' : 'Full days',
          originalRange,
          approverName: req.approverName,
          rejectedReason: normStatus === 'REJECTED' ? req.decisionNote : undefined,
        });
      }
    }

    // Merge month calendar API markers for the active leave type
    for (const item of apiMonthItems) {
      let key = classifyLeaveTypeKey(item.leaveTypeName);
      if (key === null && item.leaveTypeId !== null && item.leaveTypeId !== undefined) {
        const matchedType = apiTypes.find((t) => String(t.id) === String(item.leaveTypeId));
        if (matchedType) {
          key = classifyLeaveTypeKey(matchedType.name) ?? classifyLeaveTypeKey(matchedType.code);
        }
      }
      if (key !== null && key !== selectedLeaveType) continue;
      const normStatus = normalizeLeaveStatus(item.status);
      if (normStatus === 'APPROVED') approved.add(item.dateKey);
      else if (normStatus === 'PENDING') pending.add(item.dateKey);
      else if (normStatus === 'REJECTED') rejected.add(item.dateKey);
    }

    return {
      approvedDates: approved,
      pendingDates: pending,
      rejectedDates: rejected,
      allRecords: records,
    };
  }, [hasSession, apiRequests, apiMonthItems, apiTypes, selectedLeaveType]);

  const carryForwardInfo = useMemo<CarryForwardInfo>(() => {
    const activeTab = leaveTypeTabs.find((t) => t.key === selectedLeaveType);
    const label = activeTab?.label ?? 'Leave';
    const carriedForward = apiLedgerEntries
      .filter((entry) => {
        const key = classifyLeaveTypeKey(entry.leaveTypeName);
        const isMatch = key === null || key === selectedLeaveType;
        const typeLower = entry.entryType.toLowerCase();
        return isMatch && (typeLower.includes('carry') || typeLower.includes('opening'));
      })
      .reduce((sum, entry) => sum + Math.max(0, Math.round(entry.days)), 0);

    return {
      leaveTypeLabel: label,
      previousBalance: leaveSummary.totalLeaves,
      carriedForward,
      usedDays: leaveSummary.leavesTaken,
      availableDays: leaveSummary.balanceLeaves,
      expiresOn: `31 Dec ${currentYear}`,
      policyNote: hasSession
        ? `Summary reflects your current ${label.toLowerCase()} allocation and balance for ${currentYear}.`
        : 'Sign in to view your live carry forward and balance details.',
    };
  }, [leaveTypeTabs, selectedLeaveType, leaveSummary, apiLedgerEntries, currentYear, hasSession]);

  const handleSelectLeaveType = useCallback((type: LeaveTypeKey) => {
    setSelectedLeaveType(type);
    setSelectedDate(null);
  }, []);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  }, []);

  const handleToggleFilter = useCallback(() => {
    const cycle: StatusFilter[] = ['all', 'approved', 'pending', 'rejected'];
    setSelectedFilter((prev) => {
      const nextIdx = (cycle.indexOf(prev) + 1) % cycle.length;
      return cycle[nextIdx] ?? 'all';
    });
  }, []);

  const handleSelectDatePress = useCallback(() => {
    setSelectedDate((prev) => {
      if (prev) return null;
      const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-`;
      const firstApprovedInMonth = Array.from(approvedDates).find((d) =>
        d.startsWith(monthPrefix),
      );
      return firstApprovedInMonth ?? `${monthPrefix}01`;
    });
  }, [approvedDates, currentYear, currentMonth]);

  const handleDayPress = useCallback((dateKey: string) => {
    setSelectedDate((prev) => (prev === dateKey ? null : dateKey));
  }, []);

  const handleOpenCarryForwards = useCallback(() => {
    setIsCarryForwardsOpen(true);
  }, []);

  const handleCloseCarryForwards = useCallback(() => {
    setIsCarryForwardsOpen(false);
  }, []);

  const handleViewLeaveHistory = useCallback(() => {
    router.push('/(app)/leave/history');
  }, []);

  const handleAttendancePress = useCallback(() => {
    router.push('/(app)/attendance/history');
  }, []);

  const handleEditLeaveRequest = useCallback(
    (record: LeaveRecord) => {
      router.push({
        pathname: '/(app)/leave/edit',
        params: {
          leaveType: selectedLeaveType,
          requestId: record.id,
          status: record.status,
          submittedDate: record.requestDate,
          ...(record.leaveTypeId !== undefined && record.leaveTypeId !== null
            ? { leaveTypeId: String(record.leaveTypeId) }
            : {}),
          ...(record.startDate ? { startDate: record.startDate } : {}),
          ...(record.endDate ? { endDate: record.endDate } : {}),
          ...(record.reason ? { reason: record.reason } : {}),
          ...(record.duration ? { duration: record.duration } : {}),
          ...(record.originalRange ? { originalRange: record.originalRange } : {}),
          ...(record.approverName ? { approverName: record.approverName } : {}),
          ...(record.rejectedReason ? { rejectedReason: record.rejectedReason } : {}),
        },
      });
    },
    [selectedLeaveType],
  );

  const handleRetryLoad = useCallback(() => {
    setReloadCount((c) => c + 1);
  }, []);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)');
    }
  }, []);

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
    const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    return allRecords.filter((r) => {
      if (selectedFilter !== 'all' && r.status !== selectedFilter) {
        return false;
      }
      if (selectedDate) {
        const keys = enumerateDateKeys(r.startDate, r.endDate);
        return keys.includes(selectedDate);
      }
      const keys = enumerateDateKeys(r.startDate, r.endDate);
      return keys.some((k) => k.startsWith(monthPrefix));
    });
  }, [allRecords, selectedFilter, selectedDate, currentYear, currentMonth]);

  const formattedSelectedDate = useMemo(
    () => formatDateKeyDisplay(selectedDate),
    [selectedDate],
  );

  return {
    isDark,
    hasSession,
    isLoading,
    loadError,
    selectedLeaveType,
    leaveTypeTabs,
    leaveSummary,
    currentYear,
    currentMonth,
    selectedFilter,
    selectedDate,
    formattedSelectedDate,
    isCarryForwardsOpen,
    carryForwardInfo,
    calendarDays,
    displayedRecords,
    approvedDates,
    pendingDates,
    rejectedDates,
    handleSelectLeaveType,
    handlePrevMonth,
    handleNextMonth,
    handleToggleFilter,
    handleSelectDatePress,
    handleDayPress,
    handleOpenCarryForwards,
    handleCloseCarryForwards,
    handleViewLeaveHistory,
    handleAttendancePress,
    handleEditLeaveRequest,
    handleRetryLoad,
    handleBack,
  };
}
