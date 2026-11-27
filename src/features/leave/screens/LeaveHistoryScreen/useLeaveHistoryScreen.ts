import { useCallback, useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '@/features/auth';
import { isApiError } from '@/shared/api';
import { useAppTheme } from '@/shared/theme';
import { leaveApi, type LeaveRequestHistoryItem } from '../../api/leaveApi';
import {
  buildDurationOptions,
  buildLeaveDataForDuration,
  buildPieChartData,
  type DurationKey,
  type DurationOption,
  type LeaveDurationData,
  type LeaveHistoryRecord,
  type LeavePieDataItem,
} from '../../data/leaveHistoryData';

const ITEMS_PER_PAGE = 3;

export interface UseLeaveHistoryScreenResult {
  isDark: boolean;
  isLoading: boolean;
  loadError: string | null;
  durationKey: DurationKey;
  selectedMonth: string;
  currentPage: number;
  totalPages: number;
  isDurationModalOpen: boolean;
  isLeaveDetailModalOpen: boolean;
  selectedRecord: LeaveHistoryRecord | null;
  durationData: LeaveDurationData;
  currentDurationOption: DurationOption;
  filteredRecords: LeaveHistoryRecord[];
  pagedRecords: LeaveHistoryRecord[];
  pieData: LeavePieDataItem[];
  durationOptions: DurationOption[];
  setIsDurationModalOpen: (open: boolean) => void;
  setIsLeaveDetailModalOpen: (open: boolean) => void;
  handleBack: () => void;
  handleRetryLoad: () => void;
  handleSelectDuration: (key: DurationKey) => void;
  handleSelectMonth: (monthKey: string) => void;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  handleRecordPress: (item: LeaveHistoryRecord) => void;
  handleOpenHeaderHistory: () => void;
  handleCloseRecordDetail: () => void;
}

export function useLeaveHistoryScreen(): UseLeaveHistoryScreenResult {
  const theme = useAppTheme();
  const isDark = theme.isDark;
  const employmentId = useAuthStore((s) => s.session?.employmentId ?? null);

  const [referenceDate] = useState(() => new Date());
  const [durationKey, setDurationKey] = useState<DurationKey>('3months');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDurationModalOpen, setIsDurationModalOpen] = useState<boolean>(false);
  const [isLeaveDetailModalOpen, setIsLeaveDetailModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<LeaveHistoryRecord | null>(null);
  const [reloadCount, setReloadCount] = useState<number>(0);
  const [fetchState, setFetchState] = useState<{
    key: string;
    requests: LeaveRequestHistoryItem[];
    error: string | null;
  } | null>(null);

  const requestKey =
    employmentId !== null && employmentId !== '' ? `${employmentId}:${reloadCount}` : null;

  useEffect(() => {
    if (!requestKey || employmentId === null || employmentId === '') {
      return;
    }

    let isCancelled = false;

    leaveApi
      .getLeaveRequests(employmentId)
      .then((requests) => {
        if (isCancelled) return;
        setFetchState({ key: requestKey, requests, error: null });
      })
      .catch((error: unknown) => {
        if (isCancelled) return;
        setFetchState({
          key: requestKey,
          requests: [],
          error: isApiError(error) ? error.message : 'Unable to load leave history right now.',
        });
      });

    return () => {
      isCancelled = true;
    };
  }, [requestKey, employmentId]);

  const activeFetchState =
    requestKey !== null && fetchState?.key === requestKey ? fetchState : null;
  const isLoading = requestKey !== null && activeFetchState === null;
  const loadError = activeFetchState?.error ?? null;
  const requests = useMemo(() => activeFetchState?.requests ?? [], [activeFetchState]);

  const durationOptions = useMemo(
    () => buildDurationOptions(requests, referenceDate),
    [requests, referenceDate],
  );

  const durationData = useMemo(
    () => buildLeaveDataForDuration(requests, durationKey, referenceDate),
    [requests, durationKey, referenceDate],
  );

  const currentDurationOption = useMemo<DurationOption>(
    () => (durationOptions.find((opt) => opt.key === durationKey) ?? durationOptions[0]) as DurationOption,
    [durationOptions, durationKey],
  );

  const handleBack = (): void => {
    router.back();
  };

  const handleRetryLoad = useCallback((): void => {
    setReloadCount((c) => c + 1);
  }, []);

  const handleSelectDuration = (key: DurationKey): void => {
    setDurationKey(key);
    setIsDurationModalOpen(false);
    setSelectedMonth('all');
    setCurrentPage(1);
  };

  const handleSelectMonth = useCallback((monthKey: string): void => {
    setSelectedMonth(monthKey);
    setCurrentPage(1);
  }, []);

  const filteredRecords = useMemo(() => {
    if (selectedMonth === 'all') return durationData.records;
    const matched = durationData.records.filter((r) => r.monthKey === selectedMonth);
    return matched.length > 0 ? matched : durationData.records;
  }, [durationData.records, selectedMonth]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / ITEMS_PER_PAGE));

  const pagedRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecords.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  const handlePrevPage = (): void => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const handleNextPage = (): void => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  const handleRecordPress = (item: LeaveHistoryRecord): void => {
    setSelectedRecord(item);
    setIsLeaveDetailModalOpen(true);
  };

  const handleOpenHeaderHistory = (): void => {
    const recordToShow = filteredRecords[0] ?? durationData.records[0] ?? null;
    if (!recordToShow) return;
    setSelectedRecord(recordToShow);
    setIsLeaveDetailModalOpen(true);
  };

  const handleCloseRecordDetail = (): void => {
    setIsLeaveDetailModalOpen(false);
  };

  const pieData = useMemo(
    () => buildPieChartData(durationData.months, selectedMonth, handleSelectMonth),
    [durationData.months, selectedMonth, handleSelectMonth],
  );

  return {
    isDark,
    isLoading,
    loadError,
    durationKey,
    selectedMonth,
    currentPage,
    totalPages,
    isDurationModalOpen,
    isLeaveDetailModalOpen,
    selectedRecord,
    durationData,
    currentDurationOption,
    filteredRecords,
    pagedRecords,
    pieData,
    durationOptions,
    setIsDurationModalOpen,
    setIsLeaveDetailModalOpen,
    handleBack,
    handleRetryLoad,
    handleSelectDuration,
    handleSelectMonth,
    handlePrevPage,
    handleNextPage,
    handleRecordPress,
    handleOpenHeaderHistory,
    handleCloseRecordDetail,
  };
}
