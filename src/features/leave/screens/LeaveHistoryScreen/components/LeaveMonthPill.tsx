import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FontFamily } from '@/shared/theme';
import { MonthSegment } from '../../../model/leaveHistoryData';

interface LeaveMonthPillProps {
  month: MonthSegment;
  isSelected: boolean;
  isDark: boolean;
  isFitted?: boolean;
  onPress: () => void;
}

export function LeaveMonthPill({
  month,
  isSelected,
  isDark,
  isFitted = false,
  onPress,
}: LeaveMonthPillProps): React.JSX.Element {
  return (
    <TouchableOpacity
      style={getMonthPillStyle(isDark, isSelected, isFitted)}
      onPress={onPress}
      activeOpacity={0.7}
      testID={`month-btn-${month.key.toLowerCase()}`}
      accessibilityRole="button"
      accessibilityLabel={`Select ${month.label}`}
    >
      <View style={styles.monthPillHeader}>
        <View style={styles.headerLeftGroup}>
          <View style={[styles.monthDot, { backgroundColor: month.color }]} />
          <Text style={getMonthPillNameStyle(isDark, isSelected)}>
            {month.label}
          </Text>
        </View>
        {isSelected && (
          <Feather
            name="check"
            size={14}
            color="#1D4ED8"
            style={styles.checkIcon}
          />
        )}
      </View>
      <Text style={getMonthPillDaysStyle(isDark, isSelected)}>
        {month.days} {month.days === 1 ? 'day' : 'days'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  monthPill: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  monthPillFitted: {
    flex: 1,
    minWidth: 0,
  },
  monthPillScrollable: {
    minWidth: 96,
    flexShrink: 0,
  },
  monthPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
    borderWidth: 1.5,
  },
  monthPillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  monthPillName: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
  },
  monthPillNameActive: {
    fontFamily: FontFamily.semiBold,
    color: '#1D4ED8',
  },
  checkIcon: {
    marginLeft: 4,
  },
  monthPillDays: {
    fontFamily: FontFamily.headingBold,
    fontSize: 14,
  },
  monthPillDaysActive: {
    color: '#1D4ED8',
  },
});

export const getMonthPillStyle = (
  isDark: boolean,
  isSelected: boolean,
  isFitted: boolean = false,
): ViewStyle[] => {
  const result: ViewStyle[] = [
    styles.monthPill,
    isFitted ? styles.monthPillFitted : styles.monthPillScrollable,
    {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderColor: isDark ? '#334155' : '#CBD5E1',
    },
  ];
  if (isSelected) {
    result.push(styles.monthPillActive);
  }
  return result;
};

export const getMonthPillNameStyle = (isDark: boolean, isSelected: boolean): TextStyle[] => {
  const result: TextStyle[] = [
    styles.monthPillName,
    { color: isDark ? '#F8FAFC' : '#1E293B' },
  ];
  if (isSelected) {
    result.push(styles.monthPillNameActive);
  }
  return result;
};

export const getMonthPillDaysStyle = (isDark: boolean, isSelected: boolean): TextStyle[] => {
  const result: TextStyle[] = [
    styles.monthPillDays,
    { color: isDark ? '#F8FAFC' : '#0F294A' },
  ];
  if (isSelected) {
    result.push(styles.monthPillDaysActive);
  }
  return result;
};
