import { FontFamily, palette } from '@/shared/theme';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 96,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingTop: 4,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backButton: {
    padding: 4,
    marginLeft: -6,
  },
  navTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    letterSpacing: -0.2,
  },
  availableBadge: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  availableBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
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
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    marginBottom: 3,
  },
  summaryValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 17,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.3,
  },
  summaryDivider: {
    width: 1,
    height: 28,
  },
  leaveTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  leaveTypeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  leaveTypeIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaveTypeTextCol: {
    flex: 1,
  },
  leaveTypeTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 15,
    marginBottom: 2,
  },
  leaveTypeSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12.5,
  },
  sectionSeparator: {
    height: 1,
    marginVertical: 16,
  },
  calendarCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  monthTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayOutlineContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumberText: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
  },
  selectedDayBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.blue700,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.blue700,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedDayNumberText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 15,
    color: palette.white,
    lineHeight: 18,
  },
  selectedCheckIcon: {
    marginTop: 1,
  },
  inRangeContainer: {
    width: '100%',
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inRangeDayNumberText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 14.5,
  },
  breakdownCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  breakdownHeader: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11.5,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  breakdownRowDivider: {
    height: 1,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dateBadge: {
    width: 40,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
  },
  dateBadgeMonthBar: {
    width: '100%',
    backgroundColor: palette.blue600,
    paddingVertical: 2,
    alignItems: 'center',
  },
  dateBadgeMonthText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: palette.white,
    letterSpacing: 0.4,
  },
  dateBadgeDayBody: {
    width: '100%',
    paddingVertical: 3,
    alignItems: 'center',
  },
  dateBadgeDayText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 14,
  },
  breakdownMetaCol: {
    gap: 4,
    alignItems: 'flex-start',
  },
  breakdownWeekday: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
  },
  breakdownDurationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  breakdownDurationText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
  },
  breakdownRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  breakdownDaysValue: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  breakdownRemoveBtn: {
    padding: 4,
  },
  breakdownEmptyText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    marginBottom: 8,
  },
  addDateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    alignSelf: 'flex-start',
  },
  addDateBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13.5,
  },
  reasonSection: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  reasonHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reasonTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 17,
  },
  leaveStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  leaveStatusBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12.5,
  },
  reasonInputContainer: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 92,
  },
  reasonInput: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    minHeight: 72,
  },
  totalsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  totalsCol: {
    flex: 1,
  },
  totalsDivider: {
    width: 1,
    height: 32,
    marginHorizontal: 16,
  },
  totalsLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    marginBottom: 4,
  },
  totalsValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  totalsValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    fontVariant: ['tabular-nums'],
  },
  totalsBalanceValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    fontVariant: ['tabular-nums'],
  },
  totalsLeftLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12.5,
  },
  submitButton: {
    backgroundColor: palette.blue700,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: palette.blue700,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
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
    color: palette.white,
  },
  sheetList: {
    gap: 10,
    paddingTop: 4,
    paddingBottom: 12,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  sheetItemTextCol: {
    flex: 1,
    gap: 2,
  },
  sheetItemTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 15,
  },
  sheetItemSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12.5,
  },
});

export const getSafeAreaStyle = (isDark: boolean): ViewStyle[] => [
  styles.safeArea,
  { backgroundColor: isDark ? palette.slate950 : '#F2F4F8' },
];

export const getNavTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.navTitle,
  { color: isDark ? palette.slate50 : palette.slate900 },
];

export const getAvailableBadgeStyle = (isDark: boolean): ViewStyle[] => [
  styles.availableBadge,
  {
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : palette.white,
    borderColor: isDark ? palette.slate700 : '#BFDBFE',
  },
];

export const getAvailableBadgeTextStyle = (isDark: boolean): TextStyle[] => [
  styles.availableBadgeText,
  { color: isDark ? '#60A5FA' : palette.blue600 },
];

export const getSummaryLabelStyle = (isDark: boolean): TextStyle[] => [
  styles.summaryLabel,
  { color: isDark ? '#60A5FA' : palette.blue600 },
];

export const getSummaryValueStyle = (isDark: boolean): TextStyle[] => [
  styles.summaryValue,
  { color: isDark ? palette.slate50 : palette.slate900 },
];

export const getSummaryDividerStyle = (isDark: boolean): ViewStyle[] => [
  styles.summaryDivider,
  { backgroundColor: isDark ? palette.slate700 : palette.slate200 },
];

export const getSurfaceCardStyle = (isDark: boolean): ViewStyle =>
  isDark
    ? {
        backgroundColor: palette.slate900,
        borderColor: palette.slate800,
        shadowColor: palette.black,
        shadowOpacity: 0.25,
      }
    : {
        backgroundColor: palette.white,
        borderColor: palette.slate200,
        shadowColor: '#0F1E36',
        shadowOpacity: 0.05,
      };

export const getLeaveTypeIconBoxStyle = (isDark: boolean): ViewStyle[] => [
  styles.leaveTypeIconBox,
  { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.18)' : palette.blue50 },
];

export const getLeaveTypeTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.leaveTypeTitle,
  { color: isDark ? palette.slate50 : palette.slate900 },
];

export const getLeaveTypeSubtitleStyle = (isDark: boolean): TextStyle[] => [
  styles.leaveTypeSubtitle,
  { color: isDark ? palette.slate400 : palette.slate500 },
];

export const getSectionSeparatorStyle = (isDark: boolean): ViewStyle[] => [
  styles.sectionSeparator,
  { backgroundColor: isDark ? palette.slate800 : '#DBEAFE' },
];

export const getMonthTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.monthTitle,
  { color: isDark ? palette.slate50 : palette.slate900 },
];

export const getWeekdayTextStyle = (isDark: boolean): TextStyle[] => [
  styles.weekdayText,
  { color: isDark ? '#60A5FA' : palette.blue500 },
];

export const getDayNumberTextStyle = (isDark: boolean): TextStyle[] => [
  styles.dayNumberText,
  { color: isDark ? palette.slate50 : palette.slate900 },
];

export const getTodayOutlineStyle = (isDark: boolean): ViewStyle[] => [
  styles.todayOutlineContainer,
  { borderColor: isDark ? '#60A5FA' : palette.blue600 },
];

export const getInRangeContainerStyle = (isDark: boolean): ViewStyle[] => [
  styles.inRangeContainer,
  { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.2)' : palette.blue50 },
];

export const getInRangeDayNumberTextStyle = (isDark: boolean): TextStyle[] => [
  styles.inRangeDayNumberText,
  { color: isDark ? '#60A5FA' : palette.blue700 },
];

export const getBreakdownHeaderStyle = (isDark: boolean): TextStyle[] => [
  styles.breakdownHeader,
  { color: isDark ? palette.slate400 : palette.slate500 },
];

export const getBreakdownDividerStyle = (isDark: boolean): ViewStyle[] => [
  styles.breakdownRowDivider,
  { backgroundColor: isDark ? palette.slate800 : palette.slate100 },
];

export const getDateBadgeStyle = (isDark: boolean): ViewStyle[] => [
  styles.dateBadge,
  { borderColor: isDark ? palette.slate700 : palette.slate300 },
];

export const getDateBadgeDayBodyStyle = (isDark: boolean): ViewStyle[] => [
  styles.dateBadgeDayBody,
  { backgroundColor: isDark ? palette.slate800 : palette.white },
];

export const getDateBadgeDayTextStyle = (isDark: boolean): TextStyle[] => [
  styles.dateBadgeDayText,
  { color: isDark ? palette.slate50 : palette.slate900 },
];

export const getBreakdownWeekdayStyle = (isDark: boolean): TextStyle[] => [
  styles.breakdownWeekday,
  { color: isDark ? palette.slate50 : palette.slate900 },
];

export const getBreakdownDurationPillStyle = (isDark: boolean): ViewStyle[] => [
  styles.breakdownDurationPill,
  { backgroundColor: isDark ? palette.slate800 : palette.slate100 },
];

export const getBreakdownDurationTextStyle = (isDark: boolean): TextStyle[] => [
  styles.breakdownDurationText,
  { color: isDark ? palette.slate300 : palette.slate600 },
];

export const getBreakdownDaysValueStyle = (isDark: boolean): TextStyle[] => [
  styles.breakdownDaysValue,
  { color: isDark ? palette.slate300 : palette.slate600 },
];

export const getBreakdownEmptyTextStyle = (isDark: boolean): TextStyle[] => [
  styles.breakdownEmptyText,
  { color: isDark ? palette.slate400 : palette.slate500 },
];

export const getAddDateBtnTextStyle = (isDark: boolean): TextStyle[] => [
  styles.addDateBtnText,
  { color: isDark ? '#60A5FA' : palette.blue600 },
];

export const getReasonTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.reasonTitle,
  { color: isDark ? palette.slate50 : palette.slate900 },
];

export const getLeaveStatusBtnStyle = (isDark: boolean): ViewStyle[] => [
  styles.leaveStatusBtn,
  {
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : palette.blue50,
    borderColor: isDark ? palette.slate700 : '#BFDBFE',
  },
];

export const getLeaveStatusBtnTextStyle = (isDark: boolean): TextStyle[] => [
  styles.leaveStatusBtnText,
  { color: isDark ? '#93C5FD' : palette.blue600 },
];

export const getReasonInputContainerStyle = (isDark: boolean): ViewStyle[] => [
  styles.reasonInputContainer,
  {
    backgroundColor: isDark ? palette.slate900 : palette.white,
    borderColor: isDark ? palette.slate700 : palette.slate970,
  },
];

export const getReasonInputStyle = (isDark: boolean): TextStyle[] => [
  styles.reasonInput,
  { color: isDark ? palette.slate50 : palette.slate900 },
];

export const getTotalsLabelStyle = (isDark: boolean): TextStyle[] => [
  styles.totalsLabel,
  { color: isDark ? palette.slate400 : palette.slate500 },
];

export const getTotalsValueStyle = (isDark: boolean): TextStyle[] => [
  styles.totalsValue,
  { color: isDark ? palette.slate50 : palette.slate900 },
];

export const getTotalsBalanceValueStyle = (isDark: boolean): TextStyle[] => [
  styles.totalsBalanceValue,
  { color: isDark ? '#60A5FA' : palette.blue600 },
];

export const getTotalsLeftLabelStyle = (isDark: boolean): TextStyle[] => [
  styles.totalsLeftLabel,
  { color: isDark ? palette.slate400 : palette.slate500 },
];

export const getTotalsDividerStyle = (isDark: boolean): ViewStyle[] => [
  styles.totalsDivider,
  { backgroundColor: isDark ? palette.slate800 : palette.slate200 },
];

export const getSubmitButtonStyle = (isSubmitting: boolean): ViewStyle[] => {
  const result: ViewStyle[] = [styles.submitButton];
  if (isSubmitting) {
    result.push(styles.submitButtonDisabled);
  }
  return result;
};

export const getSheetItemStyle = (isDark: boolean, isSelected: boolean): ViewStyle[] => [
  styles.sheetItem,
  {
    backgroundColor: isSelected
      ? isDark
        ? 'rgba(37, 99, 235, 0.16)'
        : palette.blue50
      : isDark
        ? palette.slate900
        : palette.white,
    borderColor: isSelected
      ? isDark
        ? '#60A5FA'
        : palette.blue600
      : isDark
        ? palette.slate800
        : palette.slate200,
  },
];

export const getSheetItemTitleStyle = (isDark: boolean, isSelected: boolean): TextStyle[] => [
  styles.sheetItemTitle,
  {
    color: isSelected
      ? isDark
        ? '#93C5FD'
        : palette.blue700
      : isDark
        ? palette.slate50
        : palette.slate900,
  },
];

export const getSheetItemSubtitleStyle = (isDark: boolean): TextStyle[] => [
  styles.sheetItemSubtitle,
  { color: isDark ? palette.slate400 : palette.slate500 },
];
