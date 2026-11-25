import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { useAppTheme } from '@/shared/theme';
import {
  buildPieChartData,
  DURATION_OPTIONS,
  type DurationKey,
  type DurationOption,
  getLeaveDataForDuration,
  type LeaveDurationData,
  type LeaveHistoryRecord,
  type LeavePieDataItem,
} from '../../data/leaveHistoryData';

const ITEMS_PER_PAGE = 3;

export interface UseLeaveHistoryScreenResult {
  isDark: boolean;
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

  const [durationKey, setDurationKey] = useState<DurationKey>('3months');
  const [selectedMonth, setSelectedMonth] = useState<string>('Nov');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDurationModalOpen, setIsDurationModalOpen] = useState<boolean>(false);
  const [isLeaveDetailModalOpen, setIsLeaveDetailModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<LeaveHistoryRecord | null>(null);

  const durationData = useMemo(() => getLeaveDataForDuration(durationKey), [durationKey]);

  const currentDurationOption = useMemo<DurationOption>(
    () => (DURATION_OPTIONS.find((opt) => opt.key === durationKey) ?? DURATION_OPTIONS[0]) as DurationOption,
    [durationKey],
  );

  const handleBack = (): void => {
    router.back();
  };

  const handleSelectDuration = (key: DurationKey): void => {
    setDurationKey(key);
    setIsDurationModalOpen(false);
    setSelectedMonth('Nov');
    setCurrentPage(1);
  };

  const handleSelectMonth = (monthKey: string): void => {
    setSelectedMonth(monthKey);
    setCurrentPage(1);
  };

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
    const recordToShow =
      filteredRecords.find((r) => r.id === 'leave-2') ||
      filteredRecords[0] ||
      durationData.records[0] ||
      null;
    setSelectedRecord(recordToShow);
    setIsLeaveDetailModalOpen(true);
  };

  const handleCloseRecordDetail = (): void => {
    setIsLeaveDetailModalOpen(false);
  };

  const pieData = useMemo(
    () => buildPieChartData(durationData.months, selectedMonth, (m) => handleSelectMonth(m)),
    [durationData.months, selectedMonth],
  );

  return {
    isDark,
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
    durationOptions: DURATION_OPTIONS,
    setIsDurationModalOpen,
    setIsLeaveDetailModalOpen,
    handleBack,
    handleSelectDuration,
    handleSelectMonth,
    handlePrevPage,
    handleNextPage,
    handleRecordPress,
    handleOpenHeaderHistory,
    handleCloseRecordDetail,
  };
}
