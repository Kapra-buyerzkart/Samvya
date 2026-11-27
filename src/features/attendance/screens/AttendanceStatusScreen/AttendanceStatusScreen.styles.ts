import { FontFamily } from '@/shared/theme';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 110,
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    fontSize: 20,
    letterSpacing: -0.3,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 3,
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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
  punchCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dateCol: {
    flex: 1,
  },
  punchCardDate: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    letterSpacing: -0.2,
  },
  punchCardSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 2,
  },
  approvedStatusText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#059669',
  },
  pendingStatusText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#D97706',
  },
  pendingBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },
  punchItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  punchIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  punchInfoCol: {
    flex: 1,
  },
  punchTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    marginBottom: 2,
  },
  punchPeriod: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
  },
  punchTime: {
    fontFamily: FontFamily.headingBold,
    fontSize: 17,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.3,
  },
  summaryCard: {
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    justifyContent: 'space-between',
  },
  summaryMetric: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
  },
  summaryLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: 32,
  },
  rejectedStatusText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#DC2626',
  },
  emptyStatusText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
  },
  workedHoursPill: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  workedHoursText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
  },
});

export function getBackgroundImageStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#020617' : '#F8FAFF',
  };
}

export function getSafeAreaStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#020617' : 'transparent',
  };
}

export function getTextColor(isDark: boolean): string {
  return isDark ? '#F8FAFC' : '#0F1E36';
}

export function getTextColorStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#F8FAFC' : '#0F1E36',
  };
}

export function getSummaryCardStyle(isDark: boolean): ViewStyle {
  if (isDark) {
    return {
      backgroundColor: 'rgba(30, 41, 59, 0.78)',
      borderColor: '#334155',
    };
  }
  return {
    backgroundColor: '#EDF2FD',
    borderColor: '#D6E2FA',
  };
}

export function getSummaryDividerStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#334155' : '#CBD5E1',
  };
}

export function getNavChevronBtnStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderColor: isDark ? '#334155' : '#E2E8F0',
  };
}

export function getCardStyle(isDark: boolean): ViewStyle {
  if (isDark) {
    return {
      backgroundColor: '#0F172A',
      borderColor: '#1E293B',
      shadowColor: '#000000',
      shadowOpacity: 0.25,
    };
  }
  return {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
  };
}

export function getWeekdayTextStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#94A3B8' : '#64748B',
  };
}

export function getLegendRowStyle(isDark: boolean): ViewStyle {
  return {
    borderTopColor: isDark ? '#1E293B' : '#F1F5F9',
  };
}

export function getLegendTextStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#94A3B8' : '#475569',
  };
}

export function getPunchCardSubtitleStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#94A3B8' : '#64748B',
  };
}

export function getPunchIconBoxStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#DBEAFE',
  };
}

export function getPunchPeriodStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#94A3B8' : '#64748B',
  };
}
