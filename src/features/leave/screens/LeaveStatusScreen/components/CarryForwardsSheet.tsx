import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AppBottomSheet } from '@/shared/components';
import { FontFamily } from '@/shared/theme';
import { type CarryForwardInfo } from '../useLeaveStatusScreen';

export interface CarryForwardsSheetProps {
  isOpen: boolean;
  info: CarryForwardInfo;
  isDark: boolean;
  onClose: () => void;
}

function formatDays(days: number): string {
  return `${days} ${days === 1 ? 'day' : 'days'}`;
}

export const CarryForwardsSheet = React.memo(function CarryForwardsSheet({
  isOpen,
  info,
  isDark,
  onClose,
}: CarryForwardsSheetProps): React.JSX.Element {
  return (
    <AppBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`${info.leaveTypeLabel} · Carry forwards`}
      testID="carry-forwards-bottom-sheet"
    >
      <View style={styles.container}>
        <View style={getMetricsCardStyle(isDark)}>
          <View style={styles.metricCol}>
            <Text style={getMetricLabelStyle(isDark)}>Carried forward</Text>
            <Text style={getMetricValueStyle(isDark)}>{formatDays(info.carriedForward)}</Text>
          </View>

          <View style={getDividerStyle(isDark)} />

          <View style={styles.metricCol}>
            <Text style={getMetricLabelStyle(isDark)}>Used</Text>
            <Text style={getMetricValueStyle(isDark)}>{formatDays(info.usedDays)}</Text>
          </View>

          <View style={getDividerStyle(isDark)} />

          <View style={styles.metricCol}>
            <Text style={getMetricLabelStyle(isDark)}>Available</Text>
            <Text style={getHighlightValueStyle(isDark)}>{formatDays(info.availableDays)}</Text>
          </View>
        </View>

        <View style={getMetaRowStyle(isDark)}>
          <View style={styles.metaItem}>
            <Feather name="layers" size={15} color={isDark ? '#60A5FA' : '#2563EB'} />
            <Text style={getMetaTextStyle(isDark)}>
              Previous cycle balance: {formatDays(info.previousBalance)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="calendar" size={15} color={isDark ? '#60A5FA' : '#2563EB'} />
            <Text style={getMetaTextStyle(isDark)}>Valid until {info.expiresOn}</Text>
          </View>
        </View>

        <View style={getPolicyBoxStyle(isDark)}>
          <Text style={getPolicyTextStyle(isDark)}>{info.policyNote}</Text>
        </View>
      </View>
    </AppBottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 14,
    paddingBottom: 8,
  },
  metricsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
  },
  divider: {
    width: 1,
    height: 30,
  },
  metaRow: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
  },
  policyBox: {
    borderRadius: 12,
    padding: 12,
  },
  policyText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
  },
});

const getMetricsCardStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.metricsCard,
  {
    backgroundColor: isDark ? '#0F172A' : '#EFF6FF',
    borderColor: isDark ? '#334155' : '#BFDBFE',
  },
];

const getMetricLabelStyle = (isDark: boolean): TextStyle[] => [
  styles.metricLabel,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

const getMetricValueStyle = (isDark: boolean): TextStyle[] => [
  styles.metricValue,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

const getHighlightValueStyle = (isDark: boolean): TextStyle[] => [
  styles.metricValue,
  { color: isDark ? '#60A5FA' : '#1D4ED8' },
];

const getDividerStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.divider,
  { backgroundColor: isDark ? '#334155' : '#BFDBFE' },
];

const getMetaRowStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.metaRow,
  {
    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    borderColor: isDark ? '#334155' : '#E2E8F0',
  },
];

const getMetaTextStyle = (isDark: boolean): TextStyle[] => [
  styles.metaText,
  { color: isDark ? '#E2E8F0' : '#334155' },
];

const getPolicyBoxStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.policyBox,
  { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : '#F1F5F9' },
];

const getPolicyTextStyle = (isDark: boolean): TextStyle[] => [
  styles.policyText,
  { color: isDark ? '#94A3B8' : '#475569' },
];
