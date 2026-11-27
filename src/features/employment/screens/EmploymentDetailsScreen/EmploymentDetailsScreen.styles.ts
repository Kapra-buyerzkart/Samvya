import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { FontFamily } from '@/shared/theme';

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  navBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 116,
    flexGrow: 1,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 14,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  monthErrorBanner: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  monthErrorText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#B91C1C',
  },
  headerIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    flex: 1,
  },
  counterPill: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterPillText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 13,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  navArrowBtn: {
    width: 42,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthPill: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  monthPillText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 15,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 8,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricSubLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    marginBottom: 2,
  },
  metricLargeText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 14,
    textAlign: 'center',
  },
  verticalDivider: {
    width: 1,
    height: 28,
  },
  horizontalDivider: {
    height: 1,
    width: '100%',
    marginVertical: 14,
  },
  historyRoleSection: {
    paddingVertical: 2,
  },
  roleHeading: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    marginBottom: 8,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusPillText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
  },
  empCodeText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
  },
  subOrganisationText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    marginTop: 2,
  },
  infoGrid: {
    paddingVertical: 2,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridCol: {
    flex: 1,
  },
  fieldLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  fieldValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 15,
  },
  footerSection: {
    paddingTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerDateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
  },
  emptyStateBox: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    textAlign: 'center',
  },
});

export const getBackgroundStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
  styles.screenContainer,
  { backgroundColor: isDark ? '#020617' : '#F4F6FA' },
];

export const getNavTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.navTitle,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getCardStyle = (
  isDark: boolean,
  hasMarginTop?: boolean,
): (ViewStyle | {
  backgroundColor: string;
  borderColor: string;
  shadowColor: string;
  shadowOpacity: number;
  marginTop?: number;
})[] => {
  const result: (ViewStyle | {
    backgroundColor: string;
    borderColor: string;
    shadowColor: string;
    shadowOpacity: number;
    marginTop?: number;
  })[] = [
    styles.card,
    isDark
      ? {
          backgroundColor: '#0F172A',
          borderColor: '#1E293B',
          shadowColor: '#000000',
          shadowOpacity: 0.25,
        }
      : {
          backgroundColor: '#FFFFFF',
          borderColor: '#E2E8F0',
          shadowColor: '#0F1E36',
          shadowOpacity: 0.06,
        },
  ];
  if (hasMarginTop) {
    result.push({ marginTop: 18 });
  }
  return result;
};

export const getHeaderIconBadgeStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.headerIconBadge,
  {
    backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
    borderColor: isDark ? '#334155' : '#DBEAFE',
  },
];

export const getHistoryHeaderIconBadgeStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.headerIconBadge,
  {
    backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
    borderColor: isDark ? '#334155' : '#DBEAFE',
  },
];

export const getCardTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.cardTitle,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getCounterPillStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.counterPill,
  {
    backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
    borderColor: isDark ? '#334155' : '#BFDBFE',
  },
];

export const getCounterPillTextStyle = (isDark: boolean): TextStyle[] => [
  styles.counterPillText,
  { color: isDark ? '#60A5FA' : '#1D4ED8' },
];

export const getMonthNavBtnStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.navArrowBtn,
  {
    backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
    borderColor: isDark ? '#334155' : '#E2E8F0',
  },
];

export const getMonthPillStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.monthPill,
  {
    backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
    borderColor: isDark ? '#334155' : '#E2E8F0',
  },
];

export const getMonthPillTextStyle = (isDark: boolean): TextStyle[] => [
  styles.monthPillText,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getMetricLargeTextStyle = (isDark: boolean): TextStyle[] => [
  styles.metricLargeText,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getMetricSubLabelStyle = (isDark: boolean): TextStyle[] => [
  styles.metricSubLabel,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getVerticalDividerStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.verticalDivider,
  { backgroundColor: isDark ? '#334155' : '#CBD5E1' },
];

export const getHorizontalDividerStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string })[] => [
  styles.horizontalDivider,
  { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' },
];

export const getRoleHeadingStyle = (isDark: boolean): TextStyle[] => [
  styles.roleHeading,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getStatusPillStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.statusPill,
  {
    backgroundColor: isDark ? '#064E3B' : '#ECFDF5',
    borderColor: isDark ? '#059669' : '#A7F3D0',
  },
];

export const getStatusPillTextStyle = (isDark: boolean): TextStyle[] => [
  styles.statusPillText,
  { color: isDark ? '#34D399' : '#047857' },
];

export const getPrimaryPillStyle = (isDark: boolean): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.statusPill,
  {
    backgroundColor: isDark ? '#1E1B4B' : '#EEF2FF',
    borderColor: isDark ? '#4338CA' : '#C7D2FE',
  },
];

export const getPrimaryPillTextStyle = (isDark: boolean): TextStyle[] => [
  styles.statusPillText,
  { color: isDark ? '#A5B4FC' : '#4338CA' },
];

export const getEmpCodeTextStyle = (isDark: boolean): TextStyle[] => [
  styles.empCodeText,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getSubOrganisationTextStyle = (isDark: boolean): TextStyle[] => [
  styles.subOrganisationText,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getFieldLabelStyle = (isDark: boolean): TextStyle[] => [
  styles.fieldLabel,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getFieldValueStyle = (isDark: boolean): TextStyle[] => [
  styles.fieldValue,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getGridRowSpacingStyle = (): ViewStyle[] => [
  styles.gridRow,
  { marginTop: 14 },
];

export const getFooterTextStyle = (isDark: boolean, hasMarginTop?: boolean): TextStyle[] => {
  const result: TextStyle[] = [
    styles.footerText,
    { color: isDark ? '#94A3B8' : '#64748B' },
  ];
  if (hasMarginTop) {
    result.push({ marginTop: 4 });
  }
  return result;
};

export const getEmptyStateTextStyle = (isDark: boolean): TextStyle[] => [
  styles.emptyStateText,
  { color: isDark ? '#94A3B8' : '#64748B' },
];
