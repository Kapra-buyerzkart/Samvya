import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FontFamily } from '@/shared/theme';
import { LeaveHistoryRecord } from '../../../data/leaveHistoryData';

interface LeaveRecordCardProps {
  item: LeaveHistoryRecord;
  isDark: boolean;
  onPress: (item: LeaveHistoryRecord) => void;
}

export function LeaveRecordCard({
  item,
  isDark,
  onPress,
}: LeaveRecordCardProps): React.JSX.Element {
  const isDateLong = item.dateDisplay.length > 2;

  return (
    <TouchableOpacity
      style={getRecordCardStyle(isDark)}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
      testID={`leave-record-${item.id}`}
      accessibilityRole="button"
      accessibilityLabel={`Leave record for ${item.dateDisplay} ${item.monthDisplay}`}
    >
      {/* Top row: Date Box and Duration + Status */}
      <View style={styles.recordTopRow}>
        <View style={getDateBoxStyle(isDark)}>
          <Text style={getDateNumberTextStyle(isDark, isDateLong)}>
            {item.dateDisplay}
          </Text>
          <Text style={getDateMonthTextStyle(isDark)}>
            {item.monthDisplay}
          </Text>
        </View>

        <View style={styles.durationCol}>
          <Text style={getDurationTextStyle(isDark)}>
            {item.durationLabel}
          </Text>
          <View style={styles.statusRow}>
            <View style={styles.approvedDot} />
            <Text style={styles.approvedText}>{item.status}</Text>
          </View>
        </View>
      </View>

      {/* Middle row: Reason requested + chevron */}
      <View style={styles.reasonHeaderRow}>
        <Text style={getReasonHeaderTitleStyle(isDark)}>
          {item.reasonTitle}
        </Text>
        <Feather
          name="chevron-right"
          size={18}
          color={isDark ? '#60A5FA' : '#2563EB'}
        />
      </View>

      {/* Bottom row: Description snippet */}
      <Text
        style={getReasonDescriptionStyle(isDark)}
        numberOfLines={2}
      >
        {item.reasonDescription}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  recordCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  recordTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  dateBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNumberText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    lineHeight: 18,
  },
  dateMonthText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    lineHeight: 13,
  },
  durationCol: {
    flex: 1,
  },
  durationText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    marginBottom: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  approvedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  approvedText: {
    fontFamily: FontFamily.medium,
    fontSize: 12.5,
    color: '#059669',
  },
  reasonHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reasonHeaderTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14.5,
  },
  reasonDescription: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 17,
  },
});

export const getRecordCardStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.recordCard,
  {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderColor: isDark ? '#334155' : '#BFDBFE',
  },
];

export const getDateBoxStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.dateBox,
  {
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : '#EFF6FF',
    borderColor: isDark ? '#334155' : '#BFDBFE',
  },
];

export const getDateNumberTextStyle = (isDark: boolean, isLong: boolean): TextStyle[] => {
  const result: TextStyle[] = [
    styles.dateNumberText,
    { color: isDark ? '#60A5FA' : '#1D4ED8' },
  ];
  if (isLong) {
    result.push({ fontSize: 13 });
  }
  return result;
};

export const getDateMonthTextStyle = (isDark: boolean): TextStyle[] => [
  styles.dateMonthText,
  { color: isDark ? '#60A5FA' : '#1D4ED8' },
];

export const getDurationTextStyle = (isDark: boolean): TextStyle[] => [
  styles.durationText,
  { color: isDark ? '#F8FAFC' : '#0F294A' },
];

export const getReasonHeaderTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.reasonHeaderTitle,
  { color: isDark ? '#F8FAFC' : '#0F294A' },
];

export const getReasonDescriptionStyle = (isDark: boolean): TextStyle[] => [
  styles.reasonDescription,
  { color: isDark ? '#94A3B8' : '#64748B' },
];
