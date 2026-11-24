import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { useAppTheme } from '@/shared/theme';
import { DEFAULT_EMPLOYMENT_HISTORY, getMonthlyWorkHoursData } from '../../data/employmentDataService';
import { EmploymentHistoryItem, MonthlyWorkHoursSummary } from '../../domain/types';

export interface UseEmploymentDetailsScreenResult {
  isDark: boolean;
  monthData: MonthlyWorkHoursSummary;
  selectedDay: number;
  history: EmploymentHistoryItem;
  setSelectedDay: (day: number) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleBack: () => void;
}

export function useEmploymentDetailsScreen(): UseEmploymentDetailsScreenResult {
  const theme = useAppTheme();
  const isDark = theme.isDark;

  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(11);
  const [selectedDay, setSelectedDay] = useState(5);

  const monthData = useMemo(() => {
    return getMonthlyWorkHoursData(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

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

  const handleBack = (): void => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)');
    }
  };

  const history = DEFAULT_EMPLOYMENT_HISTORY;

  return {
    isDark,
    monthData,
    selectedDay,
    history,
    setSelectedDay,
    handlePrevMonth,
    handleNextMonth,
    handleBack,
  };
}
