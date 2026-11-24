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
    paddingTop: 12,
    paddingBottom: 110,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 26,
    color: '#0F1E36',
    letterSpacing: -0.4,
  },
  headerDate: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: '#1E293B',
  },
  dropdownsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  dropdownCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  dropdownIconContainer: {
    marginRight: 8,
  },
  dropdownTextCol: {
    flex: 1,
  },
  dropdownLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#64748B',
    marginBottom: 1,
  },
  dropdownValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#0F172A',
  },
  shiftBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(238, 242, 255, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8B4FE',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  shiftLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shiftLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: '#475569',
  },
  shiftDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 12,
  },
  shiftTime: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#0F172A',
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  statusIndicatorText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    color: '#0F172A',
  },
  statusTextBreak: {
    color: '#D97706',
  },
  statusTextOff: {
    color: '#64748B',
  },
  dialWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  workedLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: '#64748B',
    marginBottom: 2,
  },
  workedTime: {
    fontFamily: FontFamily.headingBold,
    fontSize: 28,
    color: '#0F172A',
    letterSpacing: -0.3,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    paddingHorizontal: 6,
  },
  workedTarget: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(238, 242, 255, 0.65)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  infoBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoBarTextMuted: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#64748B',
  },
  infoBarTextBold: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#0F172A',
  },
  infoBarDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  breakButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    height: 50,
    borderRadius: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  breakButtonActive: {
    backgroundColor: '#1D4ED8',
  },
  breakButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  punchOutButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    height: 50,
    borderRadius: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  punchOutButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: '#0F172A',
  },
  punchInStyle: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },
  punchInText: {
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  punchNote: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionDivider: {
    height: 1,
    width: '100%',
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  weeklyCard: {
    marginBottom: 16,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weeklyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  weeklyTitle: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: '#475569',
  },
  weeklyStats: {
    fontFamily: FontFamily.headingBold,
    fontSize: 14,
    color: '#0F172A',
  },
  progressBarTrack: {
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#E0E7FF',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3.5,
    backgroundColor: '#2563EB',
  },
  leaveSection: {
    marginBottom: 20,
  },
  leaveHeaderBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(238, 242, 255, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  leaveHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leaveHeaderTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 15,
    color: '#0F172A',
  },
  leaveMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leaveMetricCol: {
    flex: 1,
    alignItems: 'center',
  },
  leaveMetricNumber: {
    fontFamily: FontFamily.headingBold,
    fontSize: 34,
    color: '#0F172A',
    marginBottom: 2,
    fontVariant: ['tabular-nums'],
  },
  leaveMetricBlue: {
    color: '#1D4ED8',
  },
  leaveMetricLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  metricDivider: {
    width: 1,
    height: 38,
    backgroundColor: '#CBD5E1',
  },
  viewHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1D4ED8',
    height: 52,
    borderRadius: 14,
    marginTop: 6,
    marginBottom: 20,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  viewHistoryButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  sheetList: {
    paddingBottom: 8,
    gap: 4,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  modalItemText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
});

export const getBackgroundImageStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.backgroundImage,
  { backgroundColor: isDark ? '#020617' : '#F8FAFC' },
];

export const getImageStyle = (isDark: boolean) => ({
  opacity: isDark ? 0.05 : 1,
});

export const getScrollContentStyle = (isPunchedOut: boolean): ViewStyle[] => {
  const result: ViewStyle[] = [styles.scrollContent];
  if (!isPunchedOut) {
    result.push({ paddingTop: 40 });
  }
  return result;
};

export const getBrandTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.brandTitle,
  { color: isDark ? '#F8FAFC' : '#0F1E36' },
];

export const getHeaderDateStyle = (isDark: boolean): TextStyle[] => [
  styles.headerDate,
  { color: isDark ? '#94A3B8' : '#1E293B' },
];

export const getDropdownCardStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.dropdownCard,
  {
    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
    borderColor: isDark ? '#1E293B' : '#E2E8F0',
  },
];

export const getDropdownLabelStyle = (isDark: boolean): TextStyle[] => [
  styles.dropdownLabel,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getDropdownValueStyle = (isDark: boolean): TextStyle[] => [
  styles.dropdownValue,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getShiftBannerStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.shiftBanner,
  {
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(238, 242, 255, 0.7)',
    borderColor: isDark ? '#334155' : '#D8B4FE',
  },
];

export const getShiftLabelStyle = (isDark: boolean): TextStyle[] => [
  styles.shiftLabel,
  { color: isDark ? '#94A3B8' : '#475569' },
];

export const getShiftDividerStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.shiftDivider,
  { backgroundColor: isDark ? '#334155' : '#CBD5E1' },
];

export const getShiftTimeStyle = (isDark: boolean): TextStyle[] => [
  styles.shiftTime,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getStatusIndicatorTextStyle = (
  isDark: boolean,
  isOnBreak: boolean,
  isPunchedOut: boolean,
): TextStyle[] => {
  const result: TextStyle[] = [
    styles.statusIndicatorText,
    { color: isDark ? '#F8FAFC' : '#0F172A' },
  ];
  if (isOnBreak) {
    result.push(styles.statusTextBreak);
  }
  if (isPunchedOut) {
    result.push(styles.statusTextOff);
  }
  return result;
};

export const getWorkedLabelStyle = (isDark: boolean): TextStyle[] => [
  styles.workedLabel,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getWorkedTimeStyle = (isDark: boolean): TextStyle[] => [
  styles.workedTime,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getWorkedTargetStyle = (isDark: boolean): TextStyle[] => [
  styles.workedTarget,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getInfoBarStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.infoBar,
  {
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(238, 242, 255, 0.65)',
  },
];

export const getInfoBarTextMutedStyle = (isDark: boolean): TextStyle[] => [
  styles.infoBarTextMuted,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getInfoBarTextBoldStyle = (isDark: boolean): TextStyle[] => [
  styles.infoBarTextBold,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getInfoBarDividerStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.infoBarDivider,
  { backgroundColor: isDark ? '#334155' : '#CBD5E1' },
];

export const getBreakButtonStyle = (isOnBreak: boolean, isPunchedOut: boolean): ViewStyle[] => {
  const result: ViewStyle[] = [styles.breakButton];
  if (isOnBreak) {
    result.push(styles.breakButtonActive);
  }
  if (isPunchedOut) {
    result.push(styles.buttonDisabled);
  }
  return result;
};

export const getPunchOutButtonStyle = (isDark: boolean, isPunchedOut: boolean): ViewStyle[] => {
  const result: ViewStyle[] = [
    styles.punchOutButton,
    {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderColor: isDark ? '#334155' : '#0F172A',
    },
  ];
  if (isPunchedOut) {
    result.push(styles.punchInStyle);
  }
  return result;
};

export const getPunchOutButtonTextStyle = (isDark: boolean, isPunchedOut: boolean): TextStyle[] => {
  const result: TextStyle[] = [
    styles.punchOutButtonText,
    { color: isDark ? '#F8FAFC' : '#0F172A' },
  ];
  if (isPunchedOut) {
    result.push(styles.punchInText);
  }
  return result;
};

export const getPunchNoteStyle = (isDark: boolean): TextStyle[] => [
  styles.punchNote,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getSectionDividerStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.sectionDivider,
  { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' },
];

export const getWeeklyTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.weeklyTitle,
  { color: isDark ? '#F8FAFC' : '#475569' },
];

export const getWeeklyStatsStyle = (isDark: boolean): TextStyle[] => [
  styles.weeklyStats,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getProgressBarTrackStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.progressBarTrack,
  { backgroundColor: isDark ? '#1E293B' : '#E0E7FF' },
];

export const getProgressBarFillStyle = (isDark: boolean): (ViewStyle | { width: string; backgroundColor: string })[] => [
  styles.progressBarFill,
  {
    width: '63.75%',
    backgroundColor: isDark ? '#3B82F6' : '#2563EB',
  },
];

export const getLeaveHeaderBannerStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.leaveHeaderBanner,
  {
    backgroundColor: isDark ? '#0F172A' : 'rgba(238, 242, 255, 0.7)',
    borderColor: isDark ? '#1E293B' : 'transparent',
  },
];

export const getLeaveHeaderTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.leaveHeaderTitle,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getLeaveMetricLabelStyle = (isDark: boolean): TextStyle[] => [
  styles.leaveMetricLabel,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getLeaveMetricAllocatedStyle = (isDark: boolean): TextStyle[] => [
  styles.leaveMetricNumber,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getLeaveMetricDividerStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.metricDivider,
  { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' },
];

export const getViewHistoryButtonStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.viewHistoryButton,
  {
    backgroundColor: isDark ? '#2563EB' : '#1D4ED8',
  },
];

export const getModalItemStyle = (isDark: boolean, isSelected: boolean): ViewStyle[] => {
  const result: ViewStyle[] = [styles.modalItem];
  if (isSelected) {
    result.push({
      backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
    });
  }
  return result;
};

export const getModalItemTextStyle = (isDark: boolean, isSelected: boolean): TextStyle[] => {
  const result: TextStyle[] = [
    styles.modalItemText,
    { color: isDark ? '#E2E8F0' : '#334155' },
  ];
  if (isSelected) {
    result.push({
      color: isDark ? '#60A5FA' : '#1D4ED8',
      fontWeight: '700',
    });
  }
  return result;
};
