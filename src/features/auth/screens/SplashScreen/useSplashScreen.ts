import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { useAppTheme } from '@/shared/theme';
import { useAuthStore } from '../../store/authStore';

export function useSplashScreen() {
  const theme = useAppTheme();
  const isDark = theme.isDark;
  const hydrateAuthOnStartup = useAuthStore((s) => s.hydrateAuthOnStartup);

  const [logoOpacity] = useState(() => new Animated.Value(0));
  const [logoScale] = useState(() => new Animated.Value(0.88));
  const [textOpacity] = useState(() => new Animated.Value(0));
  const [textTranslateY] = useState(() => new Animated.Value(14));
  const [footerOpacity] = useState(() => new Animated.Value(0));
  const [screenFadeOut] = useState(() => new Animated.Value(1));

  const hasNavigatedRef = useRef(false);
  const hydrationPromiseRef = useRef<Promise<boolean> | null>(null);

  useEffect(() => {
    hydrationPromiseRef.current = hydrateAuthOnStartup().catch(() => false);

    const navigateNext = async () => {
      if (hasNavigatedRef.current) return;
      hasNavigatedRef.current = true;
      const hydrated = hydrationPromiseRef.current
        ? await hydrationPromiseRef.current
        : useAuthStore.getState().isAuthenticated;
      router.replace(hydrated ? '/(app)' : '/(auth)/login');
    };

    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 550,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6.5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(footerOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(850),
      Animated.timing(screenFadeOut, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    animation.start(() => {
      void navigateNext();
    });

    return () => {
      animation.stop();
    };
  }, [
    hydrateAuthOnStartup,
    logoOpacity,
    logoScale,
    textOpacity,
    textTranslateY,
    footerOpacity,
    screenFadeOut,
  ]);

  const handleSkipPress = async () => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    const hydrated = hydrationPromiseRef.current
      ? await hydrationPromiseRef.current
      : useAuthStore.getState().isAuthenticated;
    router.replace(hydrated ? '/(app)' : '/(auth)/login');
  };

  return {
    isDark,
    logoOpacity,
    logoScale,
    textOpacity,
    textTranslateY,
    footerOpacity,
    screenFadeOut,
    handleSkipPress,
  };
}
