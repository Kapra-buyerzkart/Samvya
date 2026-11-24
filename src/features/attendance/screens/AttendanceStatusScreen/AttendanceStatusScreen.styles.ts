import { FontFamily } from '@/shared/theme';
import { type ImageStyle, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

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
    fontSize: 16,
    letterSpacing: -0.2,
  },
});

export function getBackgroundImageStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#020617' : '#F8FAFC',
  };
}

export function getBackgroundImageProps(isDark: boolean): ImageStyle {
  return {
    opacity: isDark ? 0.05 : 1,
  };
}

export function getSafeAreaStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#020617' : 'transparent',
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

export function getNavChevronBtnStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderColor: isDark ? '#334155' : '#E2E8F0',
  };
}

export function getCardStyle(isDark: boolean): ViewStyle | undefined {
  if (isDark) {
    return {
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      borderColor: 'rgba(51, 65, 85, 0.8)',
    };
  }
  return undefined;
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
  };
}

export function getPunchPeriodStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#94A3B8' : '#64748B',
  };
}
