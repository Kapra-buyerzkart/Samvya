import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FontFamily } from '@/shared/theme';

interface LeaveSummaryMetricProps {
  totalDays: number;
  isDark: boolean;
}

export function LeaveSummaryMetric({
  totalDays,
  isDark,
}: LeaveSummaryMetricProps): React.JSX.Element {
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryLeft}>
        <Feather name="calendar" size={20} color={isDark ? '#60A5FA' : '#2563EB'} />
        <Text style={getSummaryTitleStyle(isDark)}>
          Leave by month
        </Text>
      </View>

      <View style={styles.summaryRight}>
        <Text style={getSummaryNumberStyle(isDark)} testID="summary-total-days">
          {totalDays} days
        </Text>
        <Text style={getSummarySubtitleStyle(isDark)}>
          Approved leave taken
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    letterSpacing: -0.2,
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  summaryNumber: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    letterSpacing: -0.3,
  },
  summarySubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    marginTop: 2,
  },
});

export const getSummaryTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.summaryTitle,
  { color: isDark ? '#F8FAFC' : '#0F294A' },
];

export const getSummaryNumberStyle = (isDark: boolean): TextStyle[] => [
  styles.summaryNumber,
  { color: isDark ? '#F8FAFC' : '#0F294A' },
];

export const getSummarySubtitleStyle = (isDark: boolean): TextStyle[] => [
  styles.summarySubtitle,
  { color: isDark ? '#94A3B8' : '#64748B' },
];
