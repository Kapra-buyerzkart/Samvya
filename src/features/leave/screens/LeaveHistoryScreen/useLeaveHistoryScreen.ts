import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
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
} from '../../model/leaveHistoryData';

const ITEMS_PER_PAGE = 3;

export interface UseLeaveHistoryScreenResult {
  isDark: boolean;
  durationKey: DurationKey;
  selectedMonth: string;
  currentPage: number;
  totalPages: number;
  isDurationModalOpen: boolean;
  durationData: LeaveDurationData;
  currentDurationOption: DurationOption;
  filteredRecords: LeaveHistoryRecord[];
  pagedRecords: LeaveHistoryRecord[];
  pieData: LeavePieDataItem[];
  durationOptions: DurationOption[];
  setIsDurationModalOpen: (open: boolean) => void;
  handleBack: () => void;
  handleSelectDuration: (key: DurationKey) => void;
  handleSelectMonth: (monthKey: string) => void;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  handleRecordPress: (item: LeaveHistoryRecord) => void;
}

export function useLeaveHistoryScreen(): UseLeaveHistoryScreenResult {
  const theme = useAppTheme();
  const isDark = theme.isDark;

  const [durationKey, setDurationKey] = useState<DurationKey>('3months');
  const [selectedMonth, setSelectedMonth] = useState<string>('Nov');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);

  const durationData = useMemo(() => getLeaveDataForDuration(durationKey), [durationKey]);
  const currentDurationOption = useMemo(
    () => DURATION_OPTIONS.find((o) => o.key === durationKey) ?? DURATION_OPTIONS[0]!,
    [durationKey],
  );

  const handleBack = (): void => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)');
    }
  };

  const handleSelectDuration = (key: DurationKey): void => {
    setDurationKey(key);
    const newDurationData = getLeaveDataForDuration(key);
    const hasNov = newDurationData.months.some((m) => m.key === 'Nov');
    setSelectedMonth(hasNov ? 'Nov' : (newDurationData.months[0]?.key ?? 'all'));
    setCurrentPage(1);
    setIsDurationModalOpen(false);
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
    Alert.alert(
      `${item.dateDisplay} ${item.monthDisplay} (${item.durationLabel})`,
      `${item.status}\n\n${item.reasonDescription}`,
    );
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
    durationData,
    currentDurationOption,
    filteredRecords,
    pagedRecords,
    pieData,
    durationOptions: DURATION_OPTIONS,
    setIsDurationModalOpen,
    handleBack,
    handleSelectDuration,
    handleSelectMonth,
    handlePrevPage,
    handleNextPage,
    handleRecordPress,
  };
}
