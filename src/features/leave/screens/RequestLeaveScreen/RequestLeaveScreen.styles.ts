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
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    letterSpacing: -0.3,
  },
  monthNavButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navChevronBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 28,
    padding: 20,
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
    fontFamily: FontFamily.medium,
    fontSize: 13,
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
  dayNumberText: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
  },
  emptyDotPlaceholder: {
    height: 5,
    marginTop: 4,
  },
  selectedCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
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
  inRangeContainer: {
    width: '100%',
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inRangeDayNumberText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 15,
    color: '#1D4ED8',
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

export const getMonthTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.monthTitle,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getNavChevronBtnStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.navChevronBtn,
  {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderColor: isDark ? '#334155' : '#E2E8F0',
  },
];

export const getCardStyle = (isDark: boolean): (ViewStyle | { backgroundColor?: string; borderColor?: string })[] => {
  const result: (ViewStyle | { backgroundColor?: string; borderColor?: string })[] = [styles.card];
  if (isDark) {
    result.push({
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      borderColor: 'rgba(51, 65, 85, 0.8)',
    });
  }
  return result;
};

export const getWeekdayTextStyle = (isDark: boolean): TextStyle[] => [
  styles.weekdayText,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getDayNumberTextStyle = (isDark: boolean): TextStyle[] => [
  styles.dayNumberText,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getInRangeContainerStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.inRangeContainer,
  { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.2)' : '#EFF6FF' },
];

export const getInRangeDayNumberTextStyle = (isDark: boolean): TextStyle[] => [
  styles.inRangeDayNumberText,
  { color: isDark ? '#60A5FA' : '#1D4ED8' },
];

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
