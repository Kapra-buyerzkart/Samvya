import { TactilePressable } from '@/shared/animations';
import { CircularProgressDial } from '@/shared/components';
import { FontFamily } from '@/shared/theme';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { type LeaveBalanceRingItem } from '../homeData';

export interface HomeLeaveInsightsProps {
  isDark: boolean;
  leaveRings: LeaveBalanceRingItem[];
  holidayRemainingCount: number;
  holidayObservedCount: number;
  holidayTotalCount: number;
  leaveHistoryTotal: number;
  leaveDaysTaken: number;
  leaveDaysLeft: number;
  onOpenEmploymentDetails: () => void;
  onOpenLeaveStatus: () => void;
  onOpenHolidayCalendar: () => void;
  onOpenLeaveHistory: () => void;
}

export function HomeLeaveInsights({
  isDark,
  leaveRings,
  holidayRemainingCount,
  holidayObservedCount,
  holidayTotalCount,
  leaveHistoryTotal,
  leaveDaysTaken,
  leaveDaysLeft,
  onOpenEmploymentDetails,
  onOpenLeaveStatus,
  onOpenHolidayCalendar,
  onOpenLeaveHistory,
}: HomeLeaveInsightsProps): React.JSX.Element {
  const holidayProgress =
    holidayTotalCount > 0 ? Math.min(100, Math.round((holidayObservedCount / holidayTotalCount) * 100)) : 0;
  const leaveTotalDays = leaveDaysTaken + leaveDaysLeft;
  const leaveProgress =
    leaveTotalDays > 0 ? Math.min(100, Math.round((leaveDaysTaken / leaveTotalDays) * 100)) : 0;

  return (
    <View>
      {/* Employment details card */}
      <TactilePressable
        style={[
          styles.employmentCard,
          {
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
            borderColor: isDark ? '#1E293B' : '#E7EEFC',
          },
        ]}
        onPress={onOpenEmploymentDetails}
        activeScale={0.98}
        accessibilityRole="button"
        accessibilityLabel="Employment details"
        testID="card-employment-details"
      >
        <View
          style={[
            styles.employmentIconBox,
            { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.2)' : '#EFF4FF' },
          ]}
        >
          <Feather name="calendar" size={18} color={isDark ? '#60A5FA' : '#2563EB'} />
        </View>
        <View style={styles.employmentTextCol}>
          <Text style={[styles.employmentTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            Employment details
          </Text>
          <Text style={[styles.employmentSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Monthly work hours & employment history
          </Text>
        </View>
        <Feather name="chevron-right" size={18} color={isDark ? '#60A5FA' : '#2563EB'} />
      </TactilePressable>

      {/* 3 Leave Type Rings Row -> opens Leave Status */}
      <TactilePressable
        style={styles.ringsRow}
        onPress={onOpenLeaveStatus}
        activeScale={0.98}
        accessibilityRole="button"
        accessibilityLabel="View detailed leave status"
        testID="leave-rings-row"
      >
        {leaveRings.map((ring, index) => (
          <React.Fragment key={ring.key}>
            {index > 0 && (
              <View
                style={[
                  styles.ringDivider,
                  { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' },
                ]}
              />
            )}
            <View style={styles.ringCol}>
              <View style={styles.ringWrapper}>
                <CircularProgressDial
                  size={68}
                  strokeWidth={6}
                  progress={ring.progress}
                  trackColor={isDark ? '#1E293B' : '#E2E8F0'}
                  progressColor={ring.ringColor}
                  showKnob={false}
                  showAura={false}
                  isActive={false}
                  centerDiscGap={2}
                  showCenterShadow={false}
                  centerDiscColor={isDark ? '#0F172A' : '#FFFFFF'}
                >
                  <Text style={[styles.ringNumber, { color: isDark ? '#F8FAFC' : '#0F1E36' }]}>
                    {ring.formattedRemaining}
                  </Text>
                </CircularProgressDial>
              </View>
              <Text
                style={[styles.ringTitle, { color: isDark ? '#E2E8F0' : '#0F172A' }]}
                numberOfLines={1}
              >
                {ring.label}
              </Text>
              <Text style={[styles.ringSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                {ring.targetLabel}
              </Text>
            </View>
          </React.Fragment>
        ))}
      </TactilePressable>

      {/* Bottom Bento Pair: Holiday Calendar + Leave History */}
      <View style={styles.bentoRow}>
        {/* Holiday Calendar Card */}
        <TactilePressable
          style={[
            styles.bentoCard,
            {
              backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
              borderColor: isDark ? '#1E293B' : '#E7EEFC',
            },
          ]}
          onPress={onOpenHolidayCalendar}
          activeScale={0.97}
          accessibilityRole="button"
          accessibilityLabel={`Holiday Calendar, view all ${holidayTotalCount} list`}
          testID="card-holiday-calendar"
        >
          <View style={styles.bentoHeader}>
            <Text
              style={[styles.bentoTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
              numberOfLines={1}
            >
              Holiday Calendar
            </Text>
            <View
              style={[
                styles.totalBadge,
                { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.22)' : '#EAF1FF' },
              ]}
            >
              <Text style={[styles.totalBadgeText, { color: isDark ? '#60A5FA' : '#2563EB' }]}>
                {holidayTotalCount} total
              </Text>
            </View>
          </View>

          <View style={styles.bentoStatsRow}>
            <Text style={[styles.bentoStatBold, { color: isDark ? '#E2E8F0' : '#0F172A' }]}>
              {holidayRemainingCount} remaining
            </Text>
            <Text style={[styles.bentoStatMuted, { color: isDark ? '#94A3B8' : '#94A3B8' }]}>
              {holidayObservedCount} observed
            </Text>
          </View>

          <View style={[styles.bentoTrack, { backgroundColor: isDark ? '#1E293B' : '#DFE7FC' }]}>
            <View
              style={[
                styles.bentoFill,
                {
                  width: `${holidayProgress}%`,
                  backgroundColor: isDark ? '#3B82F6' : '#1D4ED8',
                },
              ]}
            />
          </View>

          <View
            style={[
              styles.bentoCtaPill,
              { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.16)' : '#EFF4FF' },
            ]}
          >
            <Text
              style={[styles.bentoCtaText, { color: isDark ? '#60A5FA' : '#2563EB' }]}
              numberOfLines={1}
            >
              View all {holidayTotalCount} list
            </Text>
            <Feather name="chevron-right" size={14} color={isDark ? '#60A5FA' : '#2563EB'} />
          </View>
        </TactilePressable>

        {/* Leave History Card */}
        <TactilePressable
          style={[
            styles.bentoCard,
            {
              backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
              borderColor: isDark ? '#1E293B' : '#E7EEFC',
            },
          ]}
          onPress={onOpenLeaveHistory}
          activeScale={0.97}
          accessibilityRole="button"
          accessibilityLabel={`Leave History, view all ${leaveHistoryTotal} history`}
          testID="card-leave-history"
        >
          <View style={styles.bentoHeader}>
            <View style={styles.bentoTitleWithIcon}>
              <Feather name="file-text" size={12} color={isDark ? '#94A3B8' : '#475569'} />
              <Text
                style={[styles.bentoTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                numberOfLines={1}
              >
                Leave History
              </Text>
            </View>
            <Text style={[styles.totalTextInline, { color: isDark ? '#60A5FA' : '#2563EB' }]}>
              {leaveHistoryTotal} total
            </Text>
          </View>

          <View style={styles.bentoStatsRow}>
            <Text style={[styles.bentoStatBold, { color: isDark ? '#E2E8F0' : '#0F172A' }]}>
              {leaveDaysTaken}d taken
            </Text>
            <Text style={[styles.bentoStatMuted, { color: isDark ? '#94A3B8' : '#94A3B8' }]}>
              {leaveDaysLeft}d left
            </Text>
          </View>

          <View style={[styles.bentoTrack, { backgroundColor: isDark ? '#1E293B' : '#DFE7FC' }]}>
            <View
              style={[
                styles.bentoFill,
                {
                  width: `${leaveProgress}%`,
                  backgroundColor: isDark ? '#3B82F6' : '#1D4ED8',
                },
              ]}
            />
          </View>

          <View
            style={[
              styles.bentoCtaPill,
              { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.16)' : '#EFF4FF' },
            ]}
          >
            <Text
              style={[styles.bentoCtaText, { color: isDark ? '#60A5FA' : '#2563EB' }]}
              numberOfLines={1}
            >
              View all {leaveHistoryTotal} history
            </Text>
            <Feather name="chevron-right" size={14} color={isDark ? '#60A5FA' : '#2563EB'} />
          </View>
        </TactilePressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  employmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 20,
    shadowColor: '#0F1E36',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  employmentIconBox: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  employmentTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  employmentTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 14,
    marginBottom: 2,
  },
  employmentSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  ringsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
    paddingHorizontal: 2,
  },
  ringCol: {
    flex: 1,
    alignItems: 'center',
  },
  ringWrapper: {
    marginBottom: 8,
  },
  ringNumber: {
    fontFamily: FontFamily.headingBold,
    fontSize: 21,
    fontVariant: ['tabular-nums'],
  },
  ringTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    marginBottom: 2,
    textAlign: 'center',
  },
  ringSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    textAlign: 'center',
  },
  ringDivider: {
    width: 1,
    height: 52,
    marginHorizontal: 4,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  bentoCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    shadowColor: '#0F1E36',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bentoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 4,
  },
  bentoTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  bentoTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 12,
    flexShrink: 1,
  },
  totalBadge: {
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  totalBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
  },
  totalTextInline: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10.5,
  },
  bentoStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bentoStatBold: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
  },
  bentoStatMuted: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
  },
  bentoTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  bentoFill: {
    height: '100%',
    borderRadius: 2,
  },
  bentoCtaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  bentoCtaText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    flexShrink: 1,
  },
});
