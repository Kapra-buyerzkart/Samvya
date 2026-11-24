import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { FontFamily } from '@/shared/theme';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
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
    marginBottom: 16,
    paddingVertical: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    marginLeft: 6,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  monthTitle: {
    fontSize: 24,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
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
    fontSize: 13,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    color: '#2563EB',
    marginHorizontal: 5,
  },
  filterDivider: {
    width: 1,
    height: 18,
    marginHorizontal: 10,
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
    fontSize: 13,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    color: '#64748B',
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
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
  },
  pendingLegendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },
  statusCardTitle: {
    fontSize: 22,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
  },
  statusCardSubtitle: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: '#64748B',
    marginTop: 4,
  },
  blueAccentBar: {
    height: 2.5,
    backgroundColor: '#2563EB',
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 16,
  },
  timelineList: {
    gap: 4,
  },
  timelineStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectedIconBadge: {
    backgroundColor: '#FEE2E2',
  },
  timelineStepLabel: {
    fontSize: 15,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    marginLeft: 12,
  },
  timelineDateText: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
    color: '#64748B',
    marginLeft: 'auto',
  },
  verticalConnectorLine: {
    width: 1.5,
    height: 18,
    backgroundColor: '#CBD5E1',
    marginLeft: 15.25,
    marginVertical: 2,
  },
  recordDivider: {
    height: 1,
    marginVertical: 14,
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

export const getFilterPillStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.filterPill,
  {
    backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
    borderColor: isDark ? '#3B82F6' : '#BFDBFE',
  },
];

export const getFilterDividerStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.filterDivider,
  { backgroundColor: isDark ? '#334155' : '#E2E8F0' },
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

export const getDayNumberTextColorStyle = (isDark: boolean): TextStyle[] => [
  styles.dayNumberText,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getLegendRowStyle = (isDark: boolean): (ViewStyle | { borderTopColor: string })[] => [
  styles.legendRow,
  { borderTopColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)' },
];

export const getLegendTextStyle = (isDark: boolean): TextStyle[] => [
  styles.legendText,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getStatusCardTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.statusCardTitle,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getRecordDividerStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.recordDivider,
  { backgroundColor: isDark ? '#334155' : '#F1F5F9' },
];

export const getTimelineStepLabelStyle = (
  isDark: boolean,
  status?: 'approved' | 'rejected',
): TextStyle[] => {
  let color = isDark ? '#F8FAFC' : '#0F172A';
  if (status === 'rejected') {
    color = '#EF4444';
  }
  return [
    styles.timelineStepLabel,
    { color },
  ];
};

export const getTimelineIconBadgeStyle = (isRejected: boolean): ViewStyle[] => {
  const result: ViewStyle[] = [styles.timelineIconBadge];
  if (isRejected) {
    result.push(styles.rejectedIconBadge);
  }
  return result;
};
