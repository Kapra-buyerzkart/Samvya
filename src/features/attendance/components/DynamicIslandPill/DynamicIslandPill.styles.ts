import { Dimensions, Platform, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { FontFamily } from '@/shared/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const COLLAPSED_WIDTH = Math.min(SCREEN_WIDTH * 0.52, 204);
export const COLLAPSED_HEIGHT = 38;
export const EXPANDED_WIDTH = Math.min(SCREEN_WIDTH - 24, 384);
export const EXPANDED_HEIGHT = 208;

export const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  islandCard: {
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
  },
  collapsedRow: {
    flex: 1,
    justifyContent: 'center',
  },
  collapsedPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  pillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotSmall: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusText: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    letterSpacing: 0.1,
  },
  pillDivider: {
    width: 1,
    height: 14,
    marginHorizontal: 4,
  },
  pillRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillTimerText: {
    fontSize: 12.5,
    fontFamily: FontFamily.headingBold,
    fontVariant: ['tabular-nums'],
  },
  pillMiniPercent: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  pillPercentText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
  },
  expandedContent: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 11,
    paddingBottom: 11,
    justifyContent: 'space-between',
  },
  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerStatusText: {
    fontSize: 13.5,
    fontFamily: FontFamily.headingBold,
  },
  headerLocationText: {
    fontSize: 11.5,
    fontFamily: FontFamily.medium,
  },
  collapseButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 3,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10.5,
    fontFamily: FontFamily.medium,
  },
  metricValuePrimary: {
    fontSize: 13.5,
    fontFamily: FontFamily.headingBold,
    fontVariant: ['tabular-nums'],
  },
  metricValueSecondary: {
    fontSize: 13,
    fontFamily: FontFamily.headingBold,
    fontVariant: ['tabular-nums'],
  },
  metricValueBreak: {
    fontSize: 13,
    fontFamily: FontFamily.headingBold,
    fontVariant: ['tabular-nums'],
  },
  progressContainer: {
    marginVertical: 1,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  progressTargetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressFooterText: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
  },
  hoursTypeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  hoursTypeText: {
    fontSize: 10,
    fontFamily: FontFamily.semiBold,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 1,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionButtonBreak: {},
  actionButtonResume: {},
  actionButtonPunchOut: {},
  actionButtonText: {
    fontSize: 12.5,
    fontFamily: FontFamily.semiBold,
  },
});

export const getIslandCardStyle = (isDark: boolean): ViewStyle => ({
  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.92)',
  borderColor: isDark ? '#334155' : '#E2E8F0',
  shadowColor: isDark ? '#000000' : '#1E3A8A',
  shadowOpacity: isDark ? 0.45 : 0.12,
});

export const getStatusTextStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? '#F8FAFC' : '#0F172A',
});

export const getPillDividerStyle = (isDark: boolean): ViewStyle => ({
  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.1)',
});

export const getPillTimerTextStyle = (isDark: boolean, isBreak: boolean): TextStyle => ({
  color: isDark ? '#E2E8F0' : isBreak ? '#D97706' : '#1D4ED8',
});

export const getPillMiniPercentStyle = (isDark: boolean, isBreak: boolean): ViewStyle => ({
  backgroundColor: isDark
    ? 'rgba(37, 99, 235, 0.25)'
    : isBreak
      ? '#FEF3C7'
      : '#EFF6FF',
  borderColor: isDark
    ? 'rgba(59, 130, 246, 0.4)'
    : isBreak
      ? '#FDE68A'
      : '#BFDBFE',
});

export const getPillPercentTextStyle = (isDark: boolean, isBreak: boolean): TextStyle => ({
  color: isDark ? '#93C5FD' : isBreak ? '#D97706' : '#2563EB',
});

export const getHeaderStatusTextStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? '#F8FAFC' : '#0F172A',
});

export const getHeaderLocationTextStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? '#94A3B8' : '#64748B',
});

export const getCollapseButtonStyle = (isDark: boolean): ViewStyle => ({
  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
  borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0',
});

export const getMetricCardStyle = (isDark: boolean): ViewStyle => ({
  backgroundColor: isDark ? 'rgba(30, 41, 59, 0.65)' : '#F8FAFC',
  borderColor: isDark ? '#334155' : '#E2E8F0',
});

export const getMetricLabelStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? '#94A3B8' : '#64748B',
});

export const getMetricValuePrimaryStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? '#60A5FA' : '#1D4ED8',
});

export const getMetricValueSecondaryStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? '#F1F5F9' : '#0F172A',
});

export const getMetricValueBreakStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? '#FBBF24' : '#D97706',
});

export const getProgressTrackStyle = (isDark: boolean): ViewStyle => ({
  backgroundColor: isDark ? '#1E293B' : '#E0E7FF',
});

export const getProgressColors = (
  isDark: boolean,
  isBreak: boolean,
): readonly [string, string, ...string[]] => {
  if (isBreak) {
    return isDark ? ['#D97706', '#F59E0B'] : ['#F59E0B', '#F97316'];
  }
  return isDark ? ['#2563EB', '#38BDF8'] : ['#1D4ED8', '#2563EB', '#3B82F6'];
};

export const getProgressFooterTextStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? '#94A3B8' : '#64748B',
});

export const getHoursTypeBadgeStyle = (isDark: boolean): ViewStyle => ({
  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#EFF6FF',
  borderColor: isDark ? '#334155' : '#DBEAFE',
});

export const getHoursTypeTextStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? '#CBD5E1' : '#1D4ED8',
});

export const getActionBreakStyle = (isDark: boolean, isBreak: boolean): ViewStyle => {
  if (isBreak) {
    return {
      backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#DCFCE7',
      borderColor: isDark ? 'rgba(16, 185, 129, 0.35)' : '#86EFAC',
    };
  }
  return {
    backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7',
    borderColor: isDark ? 'rgba(245, 158, 11, 0.35)' : '#FCD34D',
  };
};

export const getActionBreakColor = (isDark: boolean, isBreak: boolean): string => {
  if (isBreak) {
    return isDark ? '#34D399' : '#059669';
  }
  return isDark ? '#FBBF24' : '#D97706';
};

export const getActionPunchOutStyle = (isDark: boolean): ViewStyle => ({
  backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FFF1F2',
  borderColor: isDark ? 'rgba(239, 68, 68, 0.35)' : '#FECDD3',
});

export const getActionPunchOutColor = (isDark: boolean): string =>
  isDark ? '#F87171' : '#E11D48';
