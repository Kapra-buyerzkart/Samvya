import { FontFamily } from '@/shared/theme';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  backButtonPlaceholder: {
    width: 38,
  },
  navTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
  },
  profileSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 22,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    marginBottom: 2,
  },
  profileEmail: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    marginBottom: 4,
  },
  viewProfileText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  menuCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    opacity: 0.6,
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextCol: {
    flex: 1,
    marginRight: 8,
  },
  menuTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
  },
  cardSeparator: {
    height: 1,
    marginLeft: 64,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  themeOptionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  themeOptionText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
    marginBottom: 100,
  },
  signOutText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
  },
  disabledTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  disabledBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  disabledBadgeText: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
  },
});

export function getSafeAreaStyle(backgroundColor: string): ViewStyle {
  return {
    backgroundColor,
  };
}

export function getBackButtonStyle(backgroundColor: string, borderColor: string): ViewStyle {
  return {
    backgroundColor,
    borderColor,
  };
}

export function getTextColorStyle(color: string): TextStyle {
  return {
    color,
  };
}

export function getCardSurfaceStyle(backgroundColor: string, borderColor: string): ViewStyle {
  return {
    backgroundColor,
    borderColor,
  };
}

export function getMenuIconWrapperStyle(backgroundColor: string): ViewStyle {
  return {
    backgroundColor,
  };
}

export function getCardSeparatorStyle(backgroundColor: string): ViewStyle {
  return {
    backgroundColor,
  };
}

export function getThemeOptionPillStyle(isSelected: boolean, isDark: boolean): ViewStyle {
  return {
    backgroundColor: isSelected
      ? isDark
        ? '#2563EB'
        : '#1D4ED8'
      : isDark
        ? '#1E293B'
        : '#F1F5F9',
    borderColor: isSelected ? '#3B82F6' : isDark ? '#334155' : '#E2E8F0',
  };
}

export function getThemeOptionTextStyle(isSelected: boolean, defaultColor: string): TextStyle {
  return {
    color: isSelected ? '#FFFFFF' : defaultColor,
    fontWeight: isSelected ? '700' : '500',
  };
}

export function getDisabledBadgeStyle(backgroundColor: string): ViewStyle {
  return {
    backgroundColor,
  };
}

export function getSignOutButtonStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
    borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : 'transparent',
    borderWidth: isDark ? 1 : 0,
  };
}

export function getSignOutTextStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#F87171' : '#DC2626',
  };
}
