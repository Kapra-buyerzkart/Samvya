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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 96,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 4,
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
  emptyStateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyStateText: {
    fontFamily: FontFamily.medium,
    fontSize: 13.5,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 2,
    marginLeft: -4,
  },
  headerTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    letterSpacing: -0.3,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 16,
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
    gap: 8,
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
    fontSize: 12.5,
    marginTop: 14,
    marginBottom: 12,
  },
  monthPillsRowFitted: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
  },
  monthPillsScrollContent: {
    paddingRight: 4,
  },
  monthPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  historyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  historyHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  fileIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyHeaderTextCol: {
    flex: 1,
  },
  historyHeaderTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 17.5,
    letterSpacing: -0.2,
  },
  historyHeaderSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12.5,
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
    fontSize: 13.5,
  },
  recordsList: {
    gap: 2,
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
  { color: isDark ? '#F8FAFC' : '#0F294A' },
];

export const getCardStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.card,
  {
    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.75)',
    borderColor: isDark ? 'rgba(51, 65, 85, 0.8)' : '#BFDBFE',
  },
];

export const getFilterPillStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.filterPill,
  {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderColor: isDark ? '#334155' : '#CBD5E1',
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

export const getFileIconBadgeStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.fileIconBadge,
  {
    backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
    borderColor: isDark ? '#334155' : '#BFDBFE',
  },
];

export const getHistoryHeaderTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.historyHeaderTitle,
  { color: isDark ? '#F8FAFC' : '#0F294A' },
];

export const getHistoryHeaderSubtitleStyle = (isDark: boolean): TextStyle[] => [
  styles.historyHeaderSubtitle,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getViewAllTextStyle = (isDark: boolean): TextStyle[] => [
  styles.viewAllText,
  { color: isDark ? '#F8FAFC' : '#0F294A' },
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
