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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 2,
    marginLeft: -4,
  },
  headerTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    letterSpacing: -0.3,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calendarIconBubble: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 16,
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
  card: {
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  filterPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterPillTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
  },
  filterPillRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterPillValue: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
  },
  chartPromptText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    marginTop: 14,
    marginBottom: 12,
  },
  monthPillsScrollContent: {
    paddingRight: 4,
  },
  monthPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  monthPill: {
    minWidth: 92,
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  monthPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  monthPillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  monthDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  monthPillName: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
  },
  monthPillNameActive: {
    fontFamily: FontFamily.semiBold,
    color: '#1D4ED8',
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  monthPillDays: {
    fontFamily: FontFamily.headingBold,
    fontSize: 14,
  },
  monthPillDaysActive: {
    color: '#1D4ED8',
  },
  historyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  historyHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  fileIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyHeaderTextCol: {
    flex: 1,
  },
  historyHeaderTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    letterSpacing: -0.2,
  },
  historyHeaderSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    marginTop: 1,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  viewAllText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 14,
  },
  recordsList: {
    gap: 10,
  },
  recordCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  recordTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  dateBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNumberText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    lineHeight: 18,
  },
  dateMonthText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    lineHeight: 13,
  },
  durationCol: {
    flex: 1,
  },
  durationText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    marginBottom: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  approvedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  approvedText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: '#059669',
  },
  reasonHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reasonHeaderTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
  },
  reasonDescription: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 17,
  },
  paginationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 8,
  },
  paginationIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  paginationPillActive: {
    width: 22,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1D4ED8',
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  paginationText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    marginLeft: 6,
  },
  paginationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  pageNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNavBtnDisabled: {
    opacity: 0.4,
  },
  sheetList: {
    paddingBottom: 8,
    gap: 6,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  modalItemTextCol: {
    flex: 1,
  },
  modalItemTitle: {
    fontSize: 16,
    fontFamily: FontFamily.semiBold,
    marginBottom: 2,
  },
  modalItemSubtitle: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
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

export const getHeaderTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.headerTitle,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getCalendarIconBubbleStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.calendarIconBubble,
  { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
];

export const getSummaryTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.summaryTitle,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getSummaryNumberStyle = (isDark: boolean): TextStyle[] => [
  styles.summaryNumber,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getSummarySubtitleStyle = (isDark: boolean): TextStyle[] => [
  styles.summarySubtitle,
  { color: isDark ? '#94A3B8' : '#64748B' },
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

export const getFilterPillStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.filterPill,
  {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderColor: isDark ? '#334155' : '#E2E8F0',
  },
];

export const getFilterPillTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.filterPillTitle,
  { color: isDark ? '#F8FAFC' : '#1E293B' },
];

export const getFilterPillValueStyle = (isDark: boolean): TextStyle[] => [
  styles.filterPillValue,
  { color: isDark ? '#94A3B8' : '#475569' },
];

export const getChartPromptTextStyle = (isDark: boolean): TextStyle[] => [
  styles.chartPromptText,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getMonthPillStyle = (isDark: boolean, isSelected: boolean): ViewStyle[] => {
  const result: ViewStyle[] = [
    styles.monthPill,
    {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderColor: isDark ? '#334155' : '#CBD5E1',
    },
  ];
  if (isSelected) {
    result.push(styles.monthPillActive);
  }
  return result;
};

export const getMonthPillNameStyle = (isDark: boolean, isSelected: boolean): TextStyle[] => {
  const result: TextStyle[] = [
    styles.monthPillName,
    { color: isDark ? '#F8FAFC' : '#0F172A' },
  ];
  if (isSelected) {
    result.push(styles.monthPillNameActive);
  }
  return result;
};

export const getMonthPillDaysStyle = (isDark: boolean, isSelected: boolean): TextStyle[] => {
  const result: TextStyle[] = [
    styles.monthPillDays,
    { color: isDark ? '#F8FAFC' : '#0F172A' },
  ];
  if (isSelected) {
    result.push(styles.monthPillDaysActive);
  }
  return result;
};

export const getFileIconBadgeStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.fileIconBadge,
  { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
];

export const getHistoryHeaderTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.historyHeaderTitle,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getHistoryHeaderSubtitleStyle = (isDark: boolean): TextStyle[] => [
  styles.historyHeaderSubtitle,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getViewAllTextStyle = (isDark: boolean): TextStyle[] => [
  styles.viewAllText,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getRecordCardStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.recordCard,
  {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderColor: isDark ? '#334155' : '#CBD5E1',
  },
];

export const getDateBoxStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.dateBox,
  {
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : '#EFF6FF',
    borderColor: isDark ? '#334155' : '#DBEAFE',
  },
];

export const getDateNumberTextStyle = (isDark: boolean, isLong: boolean): TextStyle[] => {
  const result: TextStyle[] = [
    styles.dateNumberText,
    { color: isDark ? '#60A5FA' : '#1D4ED8' },
  ];
  if (isLong) {
    result.push({ fontSize: 13 });
  }
  return result;
};

export const getDateMonthTextStyle = (isDark: boolean): TextStyle[] => [
  styles.dateMonthText,
  { color: isDark ? '#60A5FA' : '#1D4ED8' },
];

export const getDurationTextStyle = (isDark: boolean): TextStyle[] => [
  styles.durationText,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getReasonHeaderTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.reasonHeaderTitle,
  { color: isDark ? '#F8FAFC' : '#1E293B' },
];

export const getReasonDescriptionStyle = (isDark: boolean): TextStyle[] => [
  styles.reasonDescription,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getPaginationTextStyle = (isDark: boolean): TextStyle[] => [
  styles.paginationText,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getPageNavBtnStyle = (isDark: boolean, isDisabled: boolean): ViewStyle[] => {
  const result: ViewStyle[] = [
    styles.pageNavBtn,
    {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderColor: isDark ? '#334155' : '#CBD5E1',
    },
  ];
  if (isDisabled) {
    result.push(styles.pageNavBtnDisabled);
  }
  return result;
};

export const getModalItemStyle = (isDark: boolean, isSelected: boolean): ViewStyle[] => {
  const result: ViewStyle[] = [styles.modalItem];
  if (isSelected) {
    result.push({
      backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
    });
  }
  return result;
};

export const getModalItemTitleStyle = (isDark: boolean, isSelected: boolean): TextStyle[] => {
  const result: TextStyle[] = [
    styles.modalItemTitle,
    { color: isDark ? '#E2E8F0' : '#1E293B' },
  ];
  if (isSelected) {
    result.push({
      color: isDark ? '#60A5FA' : '#1D4ED8',
      fontWeight: '700',
    });
  }
  return result;
};

export const getModalItemSubtitleStyle = (isDark: boolean): TextStyle[] => [
  styles.modalItemSubtitle,
  { color: isDark ? '#94A3B8' : '#64748B' },
];
