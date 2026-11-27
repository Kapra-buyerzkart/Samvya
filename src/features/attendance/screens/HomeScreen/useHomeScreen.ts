import { useAuthStore } from '@/features/auth';
import { leaveApi } from '@/features/leave';
import { useAppTheme } from '@/shared/theme';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { attendanceApi, getWeekDateRange } from '../../api/attendanceApi';
import { usePersistentShiftTimer } from '../../hooks/usePersistentShiftTimer';
import { runAttendancePunchFlow, type PunchActionKind } from '../../services/punchService';
import {
  formatHomeHeaderDate,
  formatMinutesAsHoursMinutes,
  getGreetingForDate,
  HOME_HOLIDAY_CALENDAR,
  HOME_LEAVE_RINGS,
  LATEST_PAYSLIP_PREVIEW,
  mapLeaveBalancesToHomeData,
  WEEKLY_DAILY_RECORDS,
  WEEKLY_WORK_LOGGED_MINUTES,
  WEEKLY_WORK_TARGET_HOURS,
  type HolidayItem,
  type LeaveBalanceRingItem,
  type PayslipPreviewSummary,
  type WeeklyDayWorkItem,
} from './homeData';

export const HOURS_OPTIONS = ['Regular', 'Overtime', 'Flexible'] as const;
export type HoursTypeOption = (typeof HOURS_OPTIONS)[number];

export const LOCATION_OPTIONS = ['Work from home', 'Headquarters', 'Client site'] as const;
export type LocationOption = (typeof LOCATION_OPTIONS)[number];

export interface UseHomeScreenResult {
  timer: ReturnType<typeof usePersistentShiftTimer>;
  isDark: boolean;
  isPunchSubmitting: boolean;
  greetingLabel: string;
  displayName: string;
  formattedDateLabel: string;
  showHoursModal: boolean;
  isRefreshing: boolean;
  showLocationModal: boolean;
  showHolidayModal: boolean;
  showPayslipModal: boolean;
  showTeamModal: boolean;
  hoursOptions: typeof HOURS_OPTIONS;
  locationOptions: typeof LOCATION_OPTIONS;
  weeklyLoggedDisplay: string;
  weeklyTargetHours: number;
  weeklyProgressPercent: number;
  weeklyDays: WeeklyDayWorkItem[];
  selectedWeeklyDayId: string;
  leaveRings: LeaveBalanceRingItem[];
  holidays: HolidayItem[];
  holidayRemainingCount: number;
  holidayObservedCount: number;
  holidayTotalCount: number;
  leaveHistoryTotal: number;
  leaveDaysTaken: number;
  leaveDaysLeft: number;
  payslipPreview: PayslipPreviewSummary;
  setShowHoursModal: (show: boolean) => void;
  setShowLocationModal: (show: boolean) => void;
  setShowHolidayModal: (show: boolean) => void;
  setShowPayslipModal: (show: boolean) => void;
  setShowTeamModal: (show: boolean) => void;
  setSelectedWeeklyDayId: (dayId: string) => void;
  handleToggleBreak: () => void;
  handlePunchOut: () => void;
  handlePunchIn: () => void;
  handleApplyLeave: () => void;
  handleOpenTimeSheet: () => void;
  handleOpenPayslip: () => void;
  handleOpenTeam: () => void;
  handleLeaveStatus: () => void;
  handleViewLeaveHistory: () => void;
  handleOpenWeeklyDetails: () => void;
  handleOpenHolidayCalendar: () => void;
  handleSelectHoursType: (type: HoursTypeOption) => void;
  handleSelectLocation: (loc: LocationOption) => void;
  handleRefresh: () => void;
}

export function useHomeScreen(): UseHomeScreenResult {
  const timer = usePersistentShiftTimer();
  const theme = useAppTheme();
  const isDark = theme.isDark;
  const authUser = useAuthStore((s) => s.user);
  const authSession = useAuthStore((s) => s.session);

  const [isPunchSubmitting, setIsPunchSubmitting] = useState(false);
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedWeeklyDayId, setSelectedWeeklyDayId] = useState('wed');

  const nowDate = useMemo(() => new Date(), []);
  const weekRange = useMemo(() => getWeekDateRange(nowDate), [nowDate]);
  const greetingLabel = useMemo(() => getGreetingForDate(nowDate), [nowDate]);
  const formattedDateLabel = useMemo(() => formatHomeHeaderDate(nowDate), [nowDate]);
  const displayName = (authUser?.name || authSession?.name || 'Peter S').trim() || 'Peter S';
  const employmentId = authSession?.employmentId ?? null;

  const [weeklyRefreshCount, setWeeklyRefreshCount] = useState(0);
  const [leaveRefreshCount, setLeaveRefreshCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [weeklyFetchState, setWeeklyFetchState] = useState<{
    key: string;
    days: WeeklyDayWorkItem[];
    loggedMinutes: number;
  } | null>(null);
  const [leaveFetchState, setLeaveFetchState] = useState<{
    key: string;
    leaveRings: LeaveBalanceRingItem[];
    leaveHistoryTotal: number;
    leaveDaysTaken: number;
    leaveDaysLeft: number;
  } | null>(null);

  const currentYear = nowDate.getFullYear();
  const leaveRequestKey =
    employmentId !== null && employmentId !== ''
      ? `${employmentId}:${currentYear}:${leaveRefreshCount}`
      : null;

  useEffect(() => {
    if (!leaveRequestKey || employmentId === null || employmentId === '') {
      return;
    }

    let isCancelled = false;
    leaveApi
      .getLeaveBalances(employmentId, currentYear)
      .then((balances) => {
        if (isCancelled) return;
        const mapped = mapLeaveBalancesToHomeData(balances);
        if (__DEV__) {
          console.log('[HomeScreen] Mapped leave balances for Home:', mapped);
        }
        setLeaveFetchState({
          key: leaveRequestKey,
          ...mapped,
        });
      })
      .catch(() => {
        // Keep existing leave rings if offline or request fails
      });

    return () => {
      isCancelled = true;
    };
  }, [leaveRequestKey, employmentId, currentYear]);

  const activeLeaveState =
    leaveRequestKey !== null && leaveFetchState?.key === leaveRequestKey ? leaveFetchState : null;
  const leaveRings = activeLeaveState?.leaveRings ?? HOME_LEAVE_RINGS;
  const leaveHistoryTotal = activeLeaveState?.leaveHistoryTotal ?? 6;
  const leaveDaysTaken = activeLeaveState?.leaveDaysTaken ?? 4;
  const leaveDaysLeft = activeLeaveState?.leaveDaysLeft ?? 14;

  const weeklyRequestKey =
    employmentId !== null && employmentId !== ''
      ? `${employmentId}:${weekRange.fromDate}:${weekRange.toDate}:${weeklyRefreshCount}`
      : null;

  useEffect(() => {
    if (!weeklyRequestKey || employmentId === null || employmentId === '') {
      return;
    }

    let isCancelled = false;
    attendanceApi
      .getEmploymentAttendanceRange({
        employmentId,
        fromDate: weekRange.fromDate,
        toDate: weekRange.toDate,
      })
      .then((records) => {
        if (isCancelled || !Array.isArray(records)) return;
        const byDate = new Map(records.map((r) => [r.dateKey, r]));
        let totalMins = 0;
        const nextDays: WeeklyDayWorkItem[] = weekRange.days.map((dayInfo) => {
          const rec = byDate.get(dayInfo.dateKey);
          const mins = rec?.workedMinutes ?? 0;
          totalMins += mins;
          const hours = Number((mins / 60).toFixed(2));
          const status: WeeklyDayWorkItem['status'] =
            mins >= 480 ? 'recorded' : mins > 0 ? 'partial' : 'upcoming';
          return {
            id: dayInfo.id,
            shortLabel: dayInfo.shortLabel,
            dateLabel: dayInfo.dateLabel,
            hours,
            formattedHours: formatMinutesAsHoursMinutes(mins),
            status,
          };
        });
        setWeeklyFetchState({
          key: weeklyRequestKey,
          days: nextDays,
          loggedMinutes: totalMins,
        });
        setSelectedWeeklyDayId(weekRange.todayDayId);
      })
      .catch(() => {
        // Keep existing weekly display if offline or request fails
      });

    return () => {
      isCancelled = true;
    };
  }, [weeklyRequestKey, employmentId, weekRange]);

  const weeklyScopePrefix =
    employmentId !== null && employmentId !== ''
      ? `${employmentId}:${weekRange.fromDate}:${weekRange.toDate}:`
      : null;
  const activeWeeklyState =
    weeklyScopePrefix !== null && weeklyFetchState?.key.startsWith(weeklyScopePrefix)
      ? weeklyFetchState
      : null;
  const weeklyDays = activeWeeklyState?.days ?? WEEKLY_DAILY_RECORDS;
  const weeklyLoggedMinutes = activeWeeklyState?.loggedMinutes ?? WEEKLY_WORK_LOGGED_MINUTES;

  const refreshWeeklyAttendance = useCallback(() => {
    setWeeklyRefreshCount((c) => c + 1);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setLeaveRefreshCount((c) => c + 1);
    setWeeklyRefreshCount((c) => c + 1);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  }, []);

  const weeklyLoggedDisplay = useMemo(
    () => formatMinutesAsHoursMinutes(weeklyLoggedMinutes),
    [weeklyLoggedMinutes],
  );
  const weeklyProgressPercent = useMemo(
    () => Math.min(100, Math.round((weeklyLoggedMinutes / (WEEKLY_WORK_TARGET_HOURS * 60)) * 100)),
    [weeklyLoggedMinutes],
  );

  const holidayObservedCount = useMemo(
    () => HOME_HOLIDAY_CALENDAR.filter((item) => item.observed).length,
    [],
  );
  const holidayRemainingCount = HOME_HOLIDAY_CALENDAR.length - holidayObservedCount;

  const handleToggleBreak = (): void => {
    if (!timer.isOnBreak) {
      timer.startBreak();
      Alert.alert('Break Started', 'You are now on break. Work timer is paused.');
    } else {
      timer.resumeWork();
      Alert.alert('Break Ended', 'Welcome back! Work timer has resumed.');
    }
  };

  const executeQuickPunch = async (action: PunchActionKind): Promise<void> => {
    if (isPunchSubmitting) return;

    const employmentId = authSession?.employmentId;
    const userId = String(authSession?.memberId ?? employmentId ?? authUser?.id ?? 'staff');
    setIsPunchSubmitting(true);
    try {
      await runAttendancePunchFlow({
        action,
        employmentId,
        userId,
        provider: 'quick_punch',
        onUpdateShiftState: (timestampMs) => {
          if (action === 'punch-out') {
            timer.punchOut(timestampMs);
          } else {
            timer.punchIn(timer.workLocation, timer.hoursType, timestampMs);
          }
        },
        onSuccess: (result) => {
          refreshWeeklyAttendance();
          router.push({
            pathname: '/(app)/attendance/punch-success',
            params: {
              action,
              timestamp: String(result.timestampMs),
            },
          });
        },
      });
    } finally {
      setIsPunchSubmitting(false);
    }
  };

  const handlePunchOut = (): void => {
    Alert.alert(
      'Punch Out Verification',
      'Punch-out requires face verification and location check.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Quick Punch Out',
          style: 'destructive',
          onPress: () => {
            void executeQuickPunch('punch-out');
          },
        },
        {
          text: 'Verify Face & Location',
          onPress: () => {
            router.push({
              pathname: '/(app)/attendance/face-verify',
              params: { action: 'punch-out' },
            });
          },
        },
      ],
    );
  };

  const handlePunchIn = (): void => {
    Alert.alert(
      'Punch In Verification',
      'Punch-in requires face verification and location check.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Quick Punch In',
          onPress: () => {
            void executeQuickPunch('punch-in');
          },
        },
        {
          text: 'Verify Face & Location',
          onPress: () => {
            router.push({
              pathname: '/(app)/attendance/face-verify',
              params: { action: 'punch-in' },
            });
          },
        },
      ],
    );
  };

  const handleApplyLeave = (): void => {
    router.push('/(app)/leave/request');
  };

  const handleOpenTimeSheet = (): void => {
    router.push('/(app)/attendance/history');
  };

  const handleOpenPayslip = (): void => {
    setShowPayslipModal(true);
  };

  const handleOpenTeam = (): void => {
    setShowTeamModal(true);
  };

  const handleLeaveStatus = (): void => {
    router.push('/(app)/leave/status');
  };

  const handleViewLeaveHistory = (): void => {
    router.push('/(app)/leave/history');
  };

  const handleOpenWeeklyDetails = (): void => {
    router.push('/(app)/employment');
  };

  const handleOpenHolidayCalendar = (): void => {
    setShowHolidayModal(true);
  };

  const handleSelectHoursType = (type: HoursTypeOption): void => {
    timer.setHoursType(type);
    setShowHoursModal(false);
  };

  const handleSelectLocation = (loc: LocationOption): void => {
    timer.setWorkLocation(loc);
    setShowLocationModal(false);
  };

  return {
    timer,
    isDark,
    isPunchSubmitting,
    isRefreshing,
    greetingLabel,
    displayName,
    formattedDateLabel,
    showHoursModal,
    showLocationModal,
    showHolidayModal,
    showPayslipModal,
    showTeamModal,
    hoursOptions: HOURS_OPTIONS,
    locationOptions: LOCATION_OPTIONS,
    weeklyLoggedDisplay,
    weeklyTargetHours: WEEKLY_WORK_TARGET_HOURS,
    weeklyProgressPercent,
    weeklyDays,
    selectedWeeklyDayId,
    leaveRings,
    holidays: HOME_HOLIDAY_CALENDAR,
    holidayRemainingCount,
    holidayObservedCount,
    holidayTotalCount: HOME_HOLIDAY_CALENDAR.length,
    leaveHistoryTotal,
    leaveDaysTaken,
    leaveDaysLeft,
    payslipPreview: LATEST_PAYSLIP_PREVIEW,
    setShowHoursModal,
    setShowLocationModal,
    setShowHolidayModal,
    setShowPayslipModal,
    setShowTeamModal,
    setSelectedWeeklyDayId,
    handleToggleBreak,
    handlePunchOut,
    handlePunchIn,
    handleApplyLeave,
    handleOpenTimeSheet,
    handleOpenPayslip,
    handleOpenTeam,
    handleLeaveStatus,
    handleViewLeaveHistory,
    handleOpenWeeklyDetails,
    handleOpenHolidayCalendar,
    handleSelectHoursType,
    handleSelectLocation,
    handleRefresh,
  };
}
