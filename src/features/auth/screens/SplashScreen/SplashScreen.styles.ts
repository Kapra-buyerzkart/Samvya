import { FontFamily } from '@/shared/theme';
import { Animated, type ImageStyle, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
  pressableRoot: {
    flex: 1,
  },
  rootContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
  },
  logoImage: {
    width: 82,
    height: 78,
  },
  brandTextGroup: {
    alignItems: 'center',
  },
  brandTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 38,
    color: '#0F1E36',
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  brandSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: '#475569',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    gap: 8,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
  },
  footerBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#1D4ED8',
    letterSpacing: 0.3,
  },
  copyrightText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#64748B',
  },
});

export function getRootAnimatedStyle(screenFadeOut: Animated.Value, isDark: boolean): Animated.WithAnimatedValue<ViewStyle> {
  return {
    opacity: screenFadeOut,
    backgroundColor: isDark ? '#020617' : '#FFFFFF',
  };
}

export function getBackgroundImageStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#020617' : '#FFFFFF',
  };
}

export function getBackgroundImageImageStyle(isDark: boolean): ImageStyle {
  return {
    opacity: isDark ? 0.05 : 1,
  };
}

export function getLogoWrapperAnimatedStyle(
  logoOpacity: Animated.Value,
  logoScale: Animated.Value,
  isDark: boolean
): Animated.WithAnimatedValue<ViewStyle> {
  return {
    opacity: logoOpacity,
    transform: [{ scale: logoScale }],
    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    borderColor: isDark ? 'rgba(51, 65, 85, 0.6)' : 'rgba(255, 255, 255, 0.9)',
  };
}

export function getBrandTextAnimatedStyle(
  textOpacity: Animated.Value,
  textTranslateY: Animated.Value
): Animated.WithAnimatedValue<ViewStyle> {
  return {
    opacity: textOpacity,
    transform: [{ translateY: textTranslateY }],
  };
}

export function getBrandTitleStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#F8FAFC' : '#0F1E36',
  };
}

export function getBrandSubtitleStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#94A3B8' : '#475569',
  };
}

export function getFooterAnimatedStyle(footerOpacity: Animated.Value): Animated.WithAnimatedValue<ViewStyle> {
  return {
    opacity: footerOpacity,
  };
}

export function getBadgePillStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#1E293B' : 'rgba(255, 255, 255, 0.85)',
    borderColor: isDark ? '#334155' : '#BFDBFE',
  };
}

export function getFooterBadgeTextStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#60A5FA' : '#1D4ED8',
  };
}

export function getCopyrightTextStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#64748B' : '#64748B',
  };
}
