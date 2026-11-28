import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { FontFamily } from '@/shared/theme';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 110,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingVertical: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontFamily: FontFamily.headingSemiBold,
    fontWeight: '600',
    marginLeft: 6,
    letterSpacing: -0.2,
  },
  segmentedContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 5,
    marginBottom: 16,
    shadowColor: '#0F1E36',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  segmentedTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  activeSegmentPill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: 12,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  segmentTabText: {
    fontSize: 12.5,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
  },
  segmentTabTextActive: {
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  topSummaryCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    marginBottom: 22,
  },
  summaryMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryMetricItem: {
    alignItems: 'flex-start',
  },
  summaryMetricValue: {
    fontSize: 34,
    lineHeight: 40,
    fontFamily: FontFamily.headingBold,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.8,
  },
  summaryMetricLabel: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
    marginTop: 2,
  },
  summaryMetricDivider: {
    width: 1,
    height: 48,
  },
  topCardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  carryForwardBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  carryForwardBtnText: {
    fontSize: 14,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
  },
  viewHistoryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  viewHistoryBtnText: {
    fontSize: 14,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  monthTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
  },
  errorBannerText: {
    fontFamily: FontFamily.medium,
    fontSize: 12.5,
    color: '#B91C1C',
  },
  monthTitle: {
    fontSize: 22,
    fontFamily: FontFamily.headingBold,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  monthNavButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navChevronBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },
  filterPillText: {
    fontSize: 12.5,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    marginHorizontal: 5,
  },
  filterDivider: {
    width: 1,
    height: 18,
    marginHorizontal: 10,
  },
  calendarCard: {
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 16,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekdaySlot: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 13,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  daySlot: {
    width: '14.28%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  unselectedDayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBadgeBase: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.3,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayCircle: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedDayBadge: {
    backgroundColor: '#1D4ED8',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  dayNumberText: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
  },
  selectedDayNumberText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  selectedCheckIcon: {
    marginTop: 1,
  },
  dayMarkerIcon: {
    marginTop: 2,
  },
  pendingDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#F59E0B',
    marginTop: 4,
  },
  emptyDotPlaceholder: {
    height: 5,
    marginTop: 4,
  },
  approvedDayNumberText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14.5,
    color: '#10B981',
  },
  pendingDayNumberText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14.5,
  },
  rejectedDayNumberText: {
    fontFamily: FontFamily.medium,
    fontSize: 14.5,
  },
  legendAndAttendanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  legendGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  approvedLegendBox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendDivider: {
    width: 1,
    height: 14,
  },
  legendText: {
    fontFamily: FontFamily.medium,
    fontSize: 12.5,
  },
  attendancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 22,
    borderWidth: 1.2,
    paddingHorizontal: 18,
    paddingVertical: 9,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  attendancePillText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
  },
  approvalCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  statusCardTitle: {
    fontSize: 22,
    fontFamily: FontFamily.headingBold,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  statusCardSubtitle: {
    fontSize: 13.5,
    fontFamily: FontFamily.regular,
    marginTop: 4,
  },
  blueAccentBar: {
    height: 2.5,
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 18,
  },
  timelineList: {
    gap: 2,
  },
  timelineStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineStepContent: {
    flex: 1,
    marginLeft: 12,
    paddingTop: 6,
  },
  timelineStepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(29, 78, 216, 0.08)',
  },
  timelineEditText: {
    fontSize: 13,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
  },
  timelineStepInlineLine: {
    height: 1,
    marginTop: 10,
  },
  timelineIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineStepLabel: {
    fontSize: 14.5,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
  },
  timelineActionLabel: {
    fontSize: 14.5,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    marginLeft: 12,
  },
  timelineDateText: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
    marginLeft: 'auto',
  },
  verticalConnectorLine: {
    width: 1.5,
    height: 18,
    marginLeft: 16.25,
    marginVertical: 2,
  },
  recordDivider: {
    height: 1,
    marginVertical: 16,
  },
  emptyTimelineText: {
    fontSize: 13.5,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
    paddingVertical: 14,
  },
});

export const getBackgroundImageStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
  styles.backgroundImage,
  { backgroundColor: isDark ? '#020617' : '#F8FAFF' },
];

export const getSafeAreaStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
  styles.safeArea,
  { backgroundColor: isDark ? '#020617' : 'transparent' },
];

export const getHeaderTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.headerTitle,
  { color: isDark ? '#F8FAFC' : '#0F1E36' },
];

export const getSegmentedContainerStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.segmentedContainer,
  {
    backgroundColor: isDark ? '#0F172A' : '#0F1E36',
    borderColor: isDark ? '#1E293B' : '#0F1E36',
  },
];

export const getActiveSegmentPillStyle = (
  isDark: boolean,
  width: number,
): (ViewStyle | { backgroundColor: string; width: number })[] => [
  styles.activeSegmentPill,
  {
    backgroundColor: isDark ? '#2563EB' : '#1D4ED8',
    width,
  },
];

export const getSegmentTabStyle = (isDark: boolean, isActive: boolean): ViewStyle[] => {
  const result: ViewStyle[] = [styles.segmentTab];
  if (isActive) {
    result.push({ backgroundColor: isDark ? '#2563EB' : '#2E50AB' });
  }
  return result;
};

export const getSegmentTabTextStyle = (isDark: boolean, isActive: boolean): TextStyle[] => {
  if (isActive) {
    return [styles.segmentTabText, styles.segmentTabTextActive];
  }
  return [styles.segmentTabText, { color: isDark ? '#94A3B8' : '#E2E8F0' }];
};

export const getSummaryMetricValueStyle = (isDark: boolean): TextStyle[] => [
  styles.summaryMetricValue,
  { color: isDark ? '#F8FAFC' : '#0F1E36' },
];

export const getSummaryMetricLabelStyle = (isDark: boolean): TextStyle[] => [
  styles.summaryMetricLabel,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getSummaryMetricDividerStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
  styles.summaryMetricDivider,
  { backgroundColor: isDark ? '#334155' : '#E2E8F0' },
];

export const getTopSummaryCardStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.topSummaryCard,
  {
    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
    borderColor: isDark ? '#1E293B' : '#E2E8F0',
  },
];

export const getCarryForwardBtnStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.carryForwardBtn,
  {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderColor: isDark ? '#60A5FA' : '#1D4ED8',
  },
];

export const getCarryForwardBtnTextStyle = (isDark: boolean): TextStyle[] => [
  styles.carryForwardBtnText,
  { color: isDark ? '#93C5FD' : '#1D4ED8' },
];

export const getViewHistoryBtnStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
  styles.viewHistoryBtn,
  { backgroundColor: isDark ? '#2563EB' : '#1D4ED8' },
];

export const getMonthTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.monthTitle,
  { color: isDark ? '#F8FAFC' : '#0F1E36' },
];

export const getNavChevronBtnStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.navChevronBtn,
  {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderColor: isDark ? '#334155' : '#E2E8F0',
  },
];

export const getFilterPillStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.filterPill,
  {
    backgroundColor: isDark ? '#1E293B' : '#EDF2FD',
    borderColor: isDark ? '#334155' : '#D6E2FA',
  },
];

export const getFilterPillTextStyle = (isDark: boolean): TextStyle[] => [
  styles.filterPillText,
  { color: isDark ? '#60A5FA' : '#1D4ED8' },
];

export const getFilterDividerStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
  styles.filterDivider,
  { backgroundColor: isDark ? '#334155' : '#CBD5E1' },
];

export const getCalendarCardStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.calendarCard,
  {
    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
    borderColor: isDark ? '#1E293B' : '#E2E8F0',
  },
];

export const getWeekdayTextStyle = (isDark: boolean): TextStyle[] => [
  styles.weekdayText,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getApprovedDayBoxStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string; borderColor: string; borderWidth: number })[] => [
  styles.dayBadgeBase,
  {
    backgroundColor: isDark ? 'rgba(16, 185, 129, 0.16)' : '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1.3,
  },
];

export const getDayNumberTextColorStyle = (isDark: boolean): TextStyle[] => [
  styles.dayNumberText,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getPendingDayTextStyle = (isDark: boolean): TextStyle[] => [
  styles.pendingDayNumberText,
  { color: isDark ? '#FBBF24' : '#EAB308' },
];

export const getRejectedDayTextStyle = (isDark: boolean): TextStyle[] => [
  styles.rejectedDayNumberText,
  { color: isDark ? '#F87171' : '#EF4444' },
];

export const getApprovedLegendBoxStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
  styles.approvedLegendBox,
  { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.22)' : '#DCFCE7' },
];

export const getLegendDividerStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
  styles.legendDivider,
  { backgroundColor: isDark ? '#334155' : '#CBD5E1' },
];

export const getLegendTextStyle = (isDark: boolean): TextStyle[] => [
  styles.legendText,
  { color: isDark ? '#94A3B8' : '#475569' },
];

export const getAttendancePillStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.attendancePill,
  {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderColor: isDark ? '#334155' : '#E2E8F0',
  },
];

export const getAttendancePillTextStyle = (isDark: boolean): TextStyle[] => [
  styles.attendancePillText,
  { color: isDark ? '#60A5FA' : '#1D4ED8' },
];

export const getApprovalCardStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.approvalCard,
  {
    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
    borderColor: isDark ? '#1E293B' : '#E2E8F0',
  },
];

export const getStatusCardTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.statusCardTitle,
  { color: isDark ? '#F8FAFC' : '#0F1E36' },
];

export const getStatusCardSubtitleStyle = (isDark: boolean): TextStyle[] => [
  styles.statusCardSubtitle,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getBlueAccentBarStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
  styles.blueAccentBar,
  { backgroundColor: isDark ? '#3B82F6' : '#1B47D1' },
];

export const getRequestedIconBadgeStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
  styles.timelineIconBadge,
  { backgroundColor: isDark ? '#1E293B' : '#E8EEF9' },
];

export const getOutcomeIconBadgeStyle = (
  isDark: boolean,
  status: 'approved' | 'pending' | 'rejected',
): (ViewStyle | { backgroundColor: string; borderColor?: string; borderWidth?: number })[] => {
  if (status === 'rejected') {
    return [
      styles.timelineIconBadge,
      { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.18)' : '#FEE2E2' },
    ];
  }
  if (status === 'pending') {
    return [
      styles.timelineIconBadge,
      {
        backgroundColor: isDark ? 'rgba(251, 191, 36, 0.16)' : '#FEF3C7',
        borderColor: '#F59E0B',
        borderWidth: 1.2,
      },
    ];
  }
  return [
    styles.timelineIconBadge,
    {
      backgroundColor: isDark ? 'rgba(16, 185, 129, 0.16)' : '#ECFDF5',
      borderColor: '#34D399',
      borderWidth: 1.2,
    },
  ];
};

export const getTimelineStepLabelStyle = (isDark: boolean): TextStyle[] => [
  styles.timelineStepLabel,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getTimelineActionLabelStyle = (
  isDark: boolean,
  status: 'approved' | 'pending' | 'rejected',
): TextStyle[] => [
  styles.timelineActionLabel,
  {
    color:
      status === 'rejected'
        ? '#EF4444'
        : status === 'pending'
          ? isDark
            ? '#FBBF24'
            : '#D97706'
          : isDark
            ? '#F8FAFC'
            : '#0F172A',
  },
];

export const getTimelineDateTextStyle = (isDark: boolean): TextStyle[] => [
  styles.timelineDateText,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getTimelineEditTextStyle = (isDark: boolean): TextStyle[] => [
  styles.timelineEditText,
  { color: isDark ? '#60A5FA' : '#2563EB' },
];

export const getTimelineInlineLineStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
  styles.timelineStepInlineLine,
  { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' },
];

export const getVerticalConnectorLineStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
  styles.verticalConnectorLine,
  { backgroundColor: isDark ? '#334155' : '#CBD5E1' },
];

export const getRecordDividerStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
  styles.recordDivider,
  { backgroundColor: isDark ? '#334155' : '#E2E8F0' },
];

export const getEmptyTimelineTextStyle = (isDark: boolean): TextStyle[] => [
  styles.emptyTimelineText,
  { color: isDark ? '#94A3B8' : '#64748B' },
];
