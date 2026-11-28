import { FontFamily } from '@/shared/theme';
import { Animated, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
  pressableRoot: {
    flex: 1,
  },
  rootContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  topSpacer: {
    height: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    width: 96,
    height: 96,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 22,
  },
  logoImage: {
    width: 58,
    height: 56,
  },
  brandTextGroup: {
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 32,
    letterSpacing: -1,
  },
  brandSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 13.5,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  loaderTrack: {
    width: 48,
    height: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  loaderFill: {
    height: '100%',
    borderRadius: 999,
  },
});

export function getRootAnimatedStyle(
  screenFadeOut: Animated.Value,
  isDark: boolean,
): Animated.WithAnimatedValue<ViewStyle> {
  return {
    opacity: screenFadeOut,
    backgroundColor: isDark ? '#020617' : '#FFFFFF',
  };
}

export function getLogoWrapperAnimatedStyle(
  logoOpacity: Animated.Value,
  logoScale: Animated.Value,
  isDark: boolean,
): Animated.WithAnimatedValue<ViewStyle> {
  return {
    opacity: logoOpacity,
    transform: [{ scale: logoScale }],
    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    borderColor: isDark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(15, 23, 42, 0.08)',
  };
}

export function getBrandTextAnimatedStyle(
  textOpacity: Animated.Value,
  textTranslateY: Animated.Value,
): Animated.WithAnimatedValue<ViewStyle> {
  return {
    opacity: textOpacity,
    transform: [{ translateY: textTranslateY }],
  };
}

export function getBrandTitleStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#F8FAFC' : '#0F172A',
  };
}

export function getBrandSubtitleStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#64748B' : '#64748B',
  };
}

export function getFooterAnimatedStyle(
  footerOpacity: Animated.Value,
): Animated.WithAnimatedValue<ViewStyle> {
  return {
    opacity: footerOpacity,
  };
}

export function getLoaderTrackStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(15, 23, 42, 0.08)',
  };
}

export function getLoaderFillAnimatedStyle(
  loaderProgress: Animated.Value,
  isDark: boolean,
): Animated.WithAnimatedValue<ViewStyle> {
  return {
    backgroundColor: isDark ? '#60A5FA' : '#2563EB',
    width: loaderProgress.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
  };
}
