import React, { useEffect, useRef } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { AppCalendar, type AppCalendarMarker } from '@/shared/components';
import { type CalendarDay, type StatusFilter } from '../useLeaveStatusScreen';

const MONTH_TIMING_CONFIG = {
  duration: 280,
  easing: Easing.bezier(0.22, 1, 0.36, 1),
} as const;

export interface LeaveCalendarCardProps {
  currentYear: number;
  currentMonth: number;
  calendarDays: CalendarDay[];
  selectedFilter: StatusFilter;
  selectedDate: string | null;
  approvedDates: Set<string>;
  pendingDates: Set<string>;
  rejectedDates: Set<string>;
  isDark: boolean;
  onDayPress: (dateKey: string) => void;
}

export const LeaveCalendarCard = React.memo(function LeaveCalendarCard({
  currentYear,
  currentMonth,
  calendarDays,
  selectedFilter,
  selectedDate,
  approvedDates,
  pendingDates,
  rejectedDates,
  onDayPress,
}: LeaveCalendarCardProps): React.JSX.Element {
  const reducedMotion = useReducedMotion();
  const numericMonth = currentYear * 12 + currentMonth;
  const prevMonthRef = useRef(numericMonth);
  const monthDir = useSharedValue(0);
  const monthProgress = useSharedValue(1);

  useEffect(() => {
    const prevMonth = prevMonthRef.current;
    if (prevMonth === numericMonth) {
      return;
    }

    monthDir.value = reducedMotion ? 0 : numericMonth > prevMonth ? 1 : -1;
    prevMonthRef.current = numericMonth;
    monthProgress.value = 0;
    monthProgress.value = withTiming(1, MONTH_TIMING_CONFIG);
  }, [numericMonth, reducedMotion, monthDir, monthProgress]);

  const gridAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const p = monthProgress.value;
    return {
      opacity: 0.35 + 0.65 * p,
      transform: [{ translateX: monthDir.value * 22 * (1 - p) }],
    };
  });

  return (
    <Animated.View style={gridAnimatedStyle}>
      <AppCalendar
        days={calendarDays}
        markerVariant="circle"
        getDayTestID={(day) => `status-day-${day.dateKey}`}
        getDayState={(day) => {
          const isSelected = selectedDate === day.dateKey;
          let marker: AppCalendarMarker = null;

          if (!isSelected) {
            if (
              (selectedFilter === 'all' || selectedFilter === 'approved') &&
              approvedDates.has(day.dateKey)
            ) {
              marker = 'approved';
            } else if (
              (selectedFilter === 'all' || selectedFilter === 'pending') &&
              pendingDates.has(day.dateKey)
            ) {
              marker = 'pending';
            } else if (
              (selectedFilter === 'all' || selectedFilter === 'rejected') &&
              rejectedDates.has(day.dateKey)
            ) {
              marker = 'rejected';
            }
          }

          return { isSelected, marker };
        }}
        onDayPress={(day) => onDayPress(day.dateKey)}
      />
    </Animated.View>
  );
});
