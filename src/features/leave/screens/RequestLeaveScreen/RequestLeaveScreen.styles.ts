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
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 96,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 6,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backButton: {
    padding: 2,
    marginLeft: -6,
  },
  navTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    letterSpacing: -0.2,
  },
  approvalStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  approvalStatusBtnText: {
    fontFamily: FontFamily.medium,
    fontSize: 12.5,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    marginBottom: 3,
  },
  summaryValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    fontVariant: ['tabular-nums'],
  },
  summaryDivider: {
    width: 1,
    height: 28,
  },
  durationRow: {
    marginBottom: 14,
  },
  durationToggleContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 3,
  },
  durationToggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationToggleBtnActive: {
    backgroundColor: '#1D4ED8',
  },
  durationToggleText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
  },
  durationToggleTextActive: {
    fontFamily: FontFamily.semiBold,
    color: '#FFFFFF',
  },
  datesRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  datePickerCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  datePickerTextCol: {
    flex: 1,
  },
  datePickerLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    marginBottom: 2,
  },
  datePickerValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 14.5,
  },
  datesVerticalDivider: {
    width: 1,
    height: 30,
    marginHorizontal: 12,
  },
  sectionSeparator: {
    height: 1,
    marginVertical: 12,
  },
  calendarContainer: {
    borderRadius: 22,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calendarMonthTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 17,
  },
  calendarArrowsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  arrowButton: {
    padding: 4,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekdayLabel: {
    width: '14.28%',
    textAlign: 'center',
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 6,
  },
  daySlotEmpty: {
    width: '14.28%',
    height: 36,
  },
  daySlot: {
    width: '14.28%',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySlotSelectedPill: {
    borderWidth: 1.5,
    borderRadius: 12,
  },
  daySlotEndpoint: {
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
  },
  daySlotInRange: {
    borderRadius: 6,
  },
  dayText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14.5,
    fontVariant: ['tabular-nums'],
  },
  dayTextSelectedPill: {
    fontFamily: FontFamily.semiBold,
  },
  dayTextEndpoint: {
    color: '#FFFFFF',
  },
  reasonSection: {
    marginBottom: 16,
  },
  reasonHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reasonTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16.5,
  },
  availableBadge: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  availableBadgeText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
  },
  reasonInputContainer: {
    paddingHorizontal: 0,
    paddingVertical: 4,
    minHeight: 46,
  },
  reasonInput: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    minHeight: 40,
  },
  submitButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export const getBackgroundImageStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.backgroundImage,
  { backgroundColor: isDark ? '#020617' : '#F8FAFC' },
];

export const getImageStyle = (isDark: boolean) => ({
  opacity: isDark ? 0.05 : 1,
});

export const getSafeAreaStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.safeArea,
  { backgroundColor: isDark ? '#020617' : 'transparent' },
];

export const getNavTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.navTitle,
  { color: isDark ? '#F8FAFC' : '#0F1E36' },
];

export const getApprovalStatusBtnStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.approvalStatusBtn,
  {
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(239, 246, 255, 0.85)',
    borderColor: isDark ? '#334155' : '#BFDBFE',
  },
];

export const getApprovalStatusBtnTextStyle = (isDark: boolean): TextStyle[] => [
  styles.approvalStatusBtnText,
  { color: isDark ? '#93C5FD' : '#2563EB' },
];

export const getSummaryCardStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.summaryCard,
  {
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(219, 234, 254, 0.55)',
    borderColor: isDark ? '#334155' : '#BFDBFE',
  },
];

export const getSummaryLabelStyle = (isDark: boolean): TextStyle[] => [
  styles.summaryLabel,
  { color: isDark ? '#60A5FA' : '#2563EB' },
];

export const getSummaryValueStyle = (isDark: boolean): TextStyle[] => [
  styles.summaryValue,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getSummaryDividerStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.summaryDivider,
  { backgroundColor: isDark ? '#334155' : '#BFDBFE' },
];

export const getDurationToggleContainerStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.durationToggleContainer,
  {
    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
    borderColor: isDark ? '#334155' : '#BFDBFE',
  },
];

export const getDurationToggleBtnStyle = (isActive: boolean): ViewStyle[] => {
  const result: ViewStyle[] = [styles.durationToggleBtn];
  if (isActive) {
    result.push(styles.durationToggleBtnActive);
    result.push({ backgroundColor: '#1D4ED8' });
  }
  return result;
};

export const getDurationToggleTextStyle = (isDark: boolean, isActive: boolean): TextStyle[] => {
  const result: TextStyle[] = [
    styles.durationToggleText,
    { color: isDark ? '#94A3B8' : '#0F172A' },
  ];
  if (isActive) {
    result.push(styles.durationToggleTextActive);
  }
  return result;
};

export const getDatePickerLabelStyle = (isDark: boolean): TextStyle[] => [
  styles.datePickerLabel,
  { color: isDark ? '#60A5FA' : '#2563EB' },
];

export const getDatePickerValueStyle = (isDark: boolean): TextStyle[] => [
  styles.datePickerValue,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getDatesVerticalDividerStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.datesVerticalDivider,
  { backgroundColor: isDark ? '#334155' : '#CBD5E1' },
];

export const getSectionSeparatorStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.sectionSeparator,
  { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' },
];

export const getCalendarContainerStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.calendarContainer,
  {
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.65)' : 'rgba(238, 242, 255, 0.45)',
    borderColor: isDark ? '#334155' : '#CBD5E1',
  },
];

export const getCalendarMonthTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.calendarMonthTitle,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getWeekdayLabelStyle = (isDark: boolean): TextStyle[] => [
  styles.weekdayLabel,
  { color: isDark ? '#60A5FA' : '#3B82F6' },
];

export const getDaySlotStyle = (
  isDark: boolean,
  isInRange: boolean,
  isStartOrEnd: boolean,
  isSingleSelected: boolean,
  isHighlightedRef: boolean,
): (ViewStyle | { backgroundColor?: string; borderColor?: string })[] => {
  const result: (ViewStyle | { backgroundColor?: string; borderColor?: string })[] = [styles.daySlot];
  if (isInRange) {
    result.push(styles.daySlotInRange);
    result.push({ backgroundColor: isDark ? 'rgba(37, 99, 235, 0.3)' : '#DBEAFE' });
  }
  if (isStartOrEnd && !isSingleSelected) {
    result.push(styles.daySlotEndpoint);
  }
  if (isSingleSelected || isHighlightedRef) {
    result.push(styles.daySlotSelectedPill);
    result.push({
      borderColor: isDark ? '#60A5FA' : '#2563EB',
      backgroundColor: isDark ? 'rgba(37, 99, 235, 0.35)' : '#DBEAFE',
    });
  }
  return result;
};

export const getDayTextStyle = (
  isDark: boolean,
  isStartOrEnd: boolean,
  isSingleSelected: boolean,
  isHighlightedRef: boolean,
): TextStyle[] => {
  const result: TextStyle[] = [
    styles.dayText,
    { color: isDark ? '#F8FAFC' : '#0F172A' },
  ];
  if (isStartOrEnd && !isSingleSelected) {
    result.push(styles.dayTextEndpoint);
  }
  if (isSingleSelected || isHighlightedRef) {
    result.push(styles.dayTextSelectedPill);
  }
  return result;
};

export const getReasonTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.reasonTitle,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getAvailableBadgeStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.availableBadge,
  {
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : '#EFF6FF',
    borderColor: isDark ? '#334155' : '#BFDBFE',
  },
];

export const getAvailableBadgeTextStyle = (isDark: boolean): TextStyle[] => [
  styles.availableBadgeText,
  { color: isDark ? '#93C5FD' : '#1D4ED8' },
];

export const getReasonInputStyle = (isDark: boolean): TextStyle[] => [
  styles.reasonInput,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getSubmitButtonStyle = (isSubmitting: boolean): ViewStyle[] => {
  const result: ViewStyle[] = [styles.submitButton];
  if (isSubmitting) {
    result.push(styles.submitButtonDisabled);
  }
  return result;
};
