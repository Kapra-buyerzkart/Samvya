import { FontFamily } from '@/shared/theme';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  docIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    lineHeight: 22,
  },
  headerSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginTop: 18,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricColCenter: {
    flex: 1.2,
    alignItems: 'center',
  },
  metricLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  metricValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 22,
  },
  divider: {
    width: 1,
    height: 38,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 2,
  },
  sectionHeaderTitle: {
    fontFamily: FontFamily.headingMedium,
    fontSize: 15.5,
    lineHeight: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontFamily: FontFamily.medium,
    fontSize: 13.5,
    lineHeight: 18,
    color: '#10B981',
  },
  descriptionBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginTop: 12,
  },
  descriptionText: {
    fontFamily: FontFamily.regular,
    fontSize: 13.5,
    lineHeight: 22,
  },
});

export const getDocIconBoxStyle = (isDark: boolean): ViewStyle => ({
  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.16)' : '#EFF6FF',
  borderColor: isDark ? 'rgba(59, 130, 246, 0.32)' : '#DBEAFE',
});

export const getCloseBtnStyle = (isDark: boolean): ViewStyle => ({
  backgroundColor: isDark ? '#334155' : '#F1F5F9',
});

export const getMetricsBoxStyle = (isDark: boolean): ViewStyle => ({
  backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
  borderColor: isDark ? '#334155' : '#BFDBFE',
});

export const getDividerStyle = (isDark: boolean): ViewStyle => ({
  backgroundColor: isDark ? '#334155' : '#BFDBFE',
});

export const getDescriptionBoxStyle = (isDark: boolean): ViewStyle => ({
  backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
  borderColor: isDark ? '#334155' : '#D0E3FF',
});

export const getTitleTextStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? '#F8FAFC' : '#0F294A',
});

export const getSubtitleTextStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? '#94A3B8' : '#64748B',
});

export const getMetricLabelStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? '#94A3B8' : '#64748B',
});

export const getMetricValueStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? '#F8FAFC' : '#0F294A',
});

export const getSectionTitleStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? '#F8FAFC' : '#0F294A',
});

export const getDescriptionTextStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? '#CBD5E1' : '#64748B',
});
