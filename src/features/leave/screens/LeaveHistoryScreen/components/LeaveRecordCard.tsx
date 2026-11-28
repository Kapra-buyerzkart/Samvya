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
  const isRange = item.dateDisplay.length > 2;
  const badgeDay = isRange ? item.dateDisplay.slice(0, 2) : item.dateDisplay;

  const statusTone =
    item.status === 'Rejected'
      ? {
          color: isDark ? '#F87171' : '#DC2626',
          bg: isDark ? 'rgba(239, 68, 68, 0.16)' : '#FEF2F2',
          border: isDark ? 'rgba(248, 113, 113, 0.3)' : '#FECACA',
        }
      : item.status === 'Pending'
        ? {
            color: isDark ? '#FBBF24' : '#D97706',
            bg: isDark ? 'rgba(245, 158, 11, 0.16)' : '#FFFBEB',
            border: isDark ? 'rgba(251, 191, 36, 0.3)' : '#FDE68A',
          }
        : {
            color: isDark ? '#34D399' : '#059669',
            bg: isDark ? 'rgba(16, 185, 129, 0.16)' : '#ECFDF5',
            border: isDark ? 'rgba(52, 211, 153, 0.3)' : '#A7F3D0',
          };

  const titleText = item.leaveType?.trim() || item.reasonTitle;
  const dateRangeLabel = isRange
    ? `${item.dateDisplay.replace('-', ' – ')} · ${item.durationLabel}`
    : `${item.dateDisplay} ${item.monthDisplay} · ${item.durationLabel}`;

  return (
    <TouchableOpacity
      style={getRecordCardStyle(isDark)}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
      testID={`leave-record-${item.id}`}
      accessibilityRole="button"
      accessibilityLabel={`Leave record for ${item.dateDisplay} ${item.monthDisplay}`}
    >
      {/* Top row: Date Badge + Leave Type / Duration + Status Pill */}
      <View style={styles.recordTopRow}>
        <View style={getDateBoxStyle(isDark)}>
          <Text style={getDateNumberTextStyle(isDark)} numberOfLines={1}>
            {badgeDay}
          </Text>
          <Text style={getDateMonthTextStyle(isDark)} numberOfLines={1}>
            {item.monthDisplay}
          </Text>
        </View>

        <View style={styles.durationCol}>
          <Text style={getTitleTextStyle(isDark)} numberOfLines={1}>
            {titleText}
          </Text>
          <Text style={getDateRangeSubtitleStyle(isDark)} numberOfLines={1}>
            {dateRangeLabel}
          </Text>
        </View>

        <View style={styles.rightCluster}>
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: statusTone.bg,
                borderColor: statusTone.border,
              },
            ]}
          >
            <View style={[styles.statusDot, { backgroundColor: statusTone.color }]} />
            <Text style={[styles.statusText, { color: statusTone.color }]}>{item.status}</Text>
          </View>
          <Feather
            name="chevron-right"
            size={16}
            color={isDark ? '#64748B' : '#94A3B8'}
          />
        </View>
      </View>

      {/* Bottom row: Reason description */}
      {item.reasonDescription ? (
        <Text style={getReasonDescriptionStyle(isDark)} numberOfLines={2}>
          {item.reasonDescription}
        </Text>
      ) : null}
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
  },
  dateBox: {
    width: 46,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNumberText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    lineHeight: 19,
  },
  dateMonthText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    lineHeight: 13,
  },
  durationCol: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14.5,
    marginBottom: 2,
  },
  dateRangeSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
  },
  rightCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11.5,
  },
  reasonDescription: {
    fontFamily: FontFamily.regular,
    fontSize: 12.5,
    lineHeight: 17,
    marginTop: 10,
    paddingLeft: 58,
  },
});

export const getRecordCardStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.recordCard,
  {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderColor: isDark ? '#334155' : '#E2E8F0',
  },
];

export const getDateBoxStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.dateBox,
  {
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : '#EFF6FF',
    borderColor: isDark ? '#334155' : '#BFDBFE',
  },
];

export const getDateNumberTextStyle = (
  isDark: boolean,
): (TextStyle | { color: string })[] => [
  styles.dateNumberText,
  { color: isDark ? '#60A5FA' : '#1D4ED8' },
];

export const getDateMonthTextStyle = (isDark: boolean): (TextStyle | { color: string })[] => [
  styles.dateMonthText,
  { color: isDark ? '#93C5FD' : '#2563EB' },
];

export const getTitleTextStyle = (isDark: boolean): (TextStyle | { color: string })[] => [
  styles.cardTitle,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getDateRangeSubtitleStyle = (isDark: boolean): (TextStyle | { color: string })[] => [
  styles.dateRangeSubtitle,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getReasonDescriptionStyle = (isDark: boolean): (TextStyle | { color: string })[] => [
  styles.reasonDescription,
  { color: isDark ? '#94A3B8' : '#475569' },
];
