import { FontFamily } from '@/shared/theme';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

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
    paddingBottom: 112,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  greetingCol: {
    flex: 1,
    paddingRight: 12,
  },
  greetingText: {
    fontFamily: FontFamily.medium,
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: 1,
  },
  greetingName: {
    fontFamily: FontFamily.headingBold,
    fontSize: 21,
    color: '#0F1E36',
    letterSpacing: -0.3,
  },
  headerDate: {
    fontFamily: FontFamily.medium,
    fontSize: 12.5,
    color: '#334155',
    paddingBottom: 2,
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  dropdownIconContainer: {
    marginRight: 8,
  },
  dropdownTextCol: {
    flex: 1,
  },
  dropdownLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 1,
  },
  dropdownValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13.5,
    color: '#0F172A',
  },
  shiftBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E4ECFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D6E2FA',
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  shiftLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shiftLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 13.5,
    color: '#475569',
  },
  shiftDivider: {
    width: 1,
    height: 15,
    backgroundColor: '#B8C7E0',
    marginHorizontal: 12,
  },
  shiftTime: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13.5,
    color: '#0F172A',
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
  },
  statusDotOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusIndicatorText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16.5,
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
    marginVertical: 18,
  },
  workedLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12.5,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 2,
  },
  workedTime: {
    fontFamily: FontFamily.headingBold,
    fontSize: 30,
    color: '#FFFFFF',
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  workedTarget: {
    fontFamily: FontFamily.regular,
    fontSize: 12.5,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDF2FD',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  infoBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoBarTextMuted: {
    fontFamily: FontFamily.regular,
    fontSize: 12.5,
    color: '#64748B',
  },
  infoBarTextBold: {
    fontFamily: FontFamily.bold,
    fontSize: 12.5,
    color: '#0F172A',
  },
  infoBarDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
    zIndex: 10,
    elevation: 4,
  },
  breakButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1D4ED8',
    height: 46,
    borderRadius: 11,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  breakButtonActive: {
    backgroundColor: '#1E40AF',
  },
  breakButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14.5,
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
    borderColor: '#1E293B',
    height: 46,
    borderRadius: 11,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  punchOutButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14.5,
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
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionDivider: {
    height: 1,
    width: '100%',
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  leaveStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 12,
  },
  leaveStatusIconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaveStatusTextCol: {
    flex: 1,
  },
  leaveStatusTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
  },
  leaveStatusSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    marginTop: 1,
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

export const getBackgroundImageStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
  styles.backgroundImage,
  { backgroundColor: isDark ? '#020617' : '#F8FAFF' },
];

export const getImageStyle = (isDark: boolean) => ({
  opacity: isDark ? 0.05 : 0.9,
});

export const getScrollContentStyle = (isPunchedOut: boolean): ViewStyle[] => [
  styles.scrollContent,
  { paddingTop: isPunchedOut ? 12 : 14 },
];

export const getGreetingTextStyle = (isDark: boolean): TextStyle[] => [
  styles.greetingText,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getGreetingNameStyle = (isDark: boolean): TextStyle[] => [
  styles.greetingName,
  { color: isDark ? '#F8FAFC' : '#0F1E36' },
];

export const getHeaderDateStyle = (isDark: boolean): TextStyle[] => [
  styles.headerDate,
  { color: isDark ? '#CBD5E1' : '#334155' },
];

export const getDropdownCardStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
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

export const getShiftBannerStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.shiftBanner,
  {
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.78)' : '#E4ECFC',
    borderColor: isDark ? '#334155' : '#D6E2FA',
  },
];

export const getShiftLabelStyle = (isDark: boolean): TextStyle[] => [
  styles.shiftLabel,
  { color: isDark ? '#94A3B8' : '#475569' },
];

export const getShiftDividerStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
  styles.shiftDivider,
  { backgroundColor: isDark ? '#334155' : '#B8C7E0' },
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

export const getInfoBarStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.infoBar,
  {
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.78)' : '#EDF2FD',
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

export const getInfoBarDividerStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
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

export const getPunchOutButtonStyle = (
  isDark: boolean,
  isPunchedOut: boolean,
  isDisabled = false,
): ViewStyle[] => {
  const result: ViewStyle[] = [
    styles.punchOutButton,
    {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderColor: isDark ? '#334155' : '#1E293B',
    },
  ];
  if (isPunchedOut) {
    result.push(styles.punchInStyle);
  }
  if (isDisabled) {
    result.push(styles.buttonDisabled);
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

export const getSectionDividerStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
  styles.sectionDivider,
  { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' },
];

export const getLeaveStatusCardStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.leaveStatusCard,
  {
    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
    borderColor: isDark ? '#1E293B' : '#E7EEFC',
  },
];

export const getLeaveStatusIconBoxStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
  styles.leaveStatusIconBox,
  { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.2)' : '#EFF4FF' },
];

export const getLeaveStatusTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.leaveStatusTitle,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getLeaveStatusSubtitleStyle = (isDark: boolean): TextStyle[] => [
  styles.leaveStatusSubtitle,
  { color: isDark ? '#94A3B8' : '#64748B' },
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
  const result: TextStyle[] = [styles.modalItemText, { color: isDark ? '#E2E8F0' : '#334155' }];
  if (isSelected) {
    result.push({
      color: isDark ? '#60A5FA' : '#1D4ED8',
      fontWeight: '700',
    });
  }
  return result;
};
