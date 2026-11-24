import { FontFamily } from '@/shared/theme';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    marginLeft: 10,
  },
  contentBody: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  graphicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    marginTop: 4,
  },
  outerDashedCircle: {
    width: 126,
    height: 126,
    borderRadius: 63,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerHalo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginRight: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.8,
  },
  titleText: {
    fontSize: 26,
    fontFamily: FontFamily.bold,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
    marginBottom: 16,
  },
  summaryCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1.5,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  timeLoggedLabel: {
    fontSize: 12,
    letterSpacing: 1.2,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  timeDigits: {
    fontSize: 40,
    fontFamily: FontFamily.bold,
    fontWeight: '800',
    lineHeight: 46,
  },
  timePeriod: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    color: '#2563EB',
    marginLeft: 6,
    marginBottom: 6,
  },
  cardHorizontalDivider: {
    height: 1,
    marginVertical: 14,
    marginHorizontal: -18,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    letterSpacing: 0.8,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
  },
  cardVerticalDivider: {
    width: 1,
    height: 36,
    marginHorizontal: 14,
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  homeButton: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  homeButtonText: {
    fontSize: 16,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  countdownText: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
    color: '#64748B',
    marginLeft: 6,
  },
  countdownBold: {
    fontWeight: '700',
  },
});

export function getSafeAreaStyle(isDark: boolean, insets: EdgeInsets): ViewStyle {
  return {
    backgroundColor: isDark ? '#020617' : '#FFFFFF',
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
  };
}

export function getHeaderRowStyle(isDark: boolean): ViewStyle {
  return {
    borderBottomColor: isDark ? '#1E293B' : '#F1F5F9',
  };
}

export function getTextColor(isDark: boolean): string {
  return isDark ? '#F8FAFC' : '#0F172A';
}

export function getTextColorStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#F8FAFC' : '#0F172A',
  };
}

export function getOuterDashedCircleStyle(isDark: boolean): ViewStyle {
  return {
    borderColor: isDark ? '#38BDF8' : '#93C5FD',
  };
}

export function getMiddleRingStyle(isDark: boolean): ViewStyle {
  return {
    borderColor: isDark ? '#1E293B' : '#DBEAFE',
    backgroundColor: isDark ? '#0F12A' : '#F8FAFC',
  };
}

export function getInnerHaloStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
  };
}

export function getStatusBadgeStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
    borderColor: isDark ? '#3B82F6' : '#DBEAFE',
  };
}

export function getSummaryCardStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderColor: isDark ? '#334155' : '#DBEAFE',
  };
}

export function getCardDividerStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#334155' : '#F1F5F9',
  };
}

export function getCountdownBoldStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#F8FAFC' : '#0F172A',
  };
}
