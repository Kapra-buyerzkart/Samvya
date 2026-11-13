import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/features/auth';
import { FontFamily } from '@/shared/theme';

export default function SplashScreen(): React.JSX.Element {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Stable animation values without ref-in-render violations (React 19 / Compiler compliant)
  const [logoOpacity] = useState(() => new Animated.Value(0));
  const [logoScale] = useState(() => new Animated.Value(0.88));
  const [textOpacity] = useState(() => new Animated.Value(0));
  const [textTranslateY] = useState(() => new Animated.Value(14));
  const [footerOpacity] = useState(() => new Animated.Value(0));
  const [screenFadeOut] = useState(() => new Animated.Value(1));

  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    const navigateNext = () => {
      if (hasNavigatedRef.current) return;
      hasNavigatedRef.current = true;
      router.replace(isAuthenticated ? '/(app)' : '/(auth)/login');
    };

    // Sequence of smooth, premium entry animations
    const animation = Animated.sequence([
      // 1. Logo entrance
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
      // 2. Brand text entrance
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
      // 3. Display pause (850ms)
      Animated.delay(850),
      // 4. Subtle exit fade
      Animated.timing(screenFadeOut, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    animation.start(() => {
      navigateNext();
    });

    return () => {
      animation.stop();
    };
  }, [
    isAuthenticated,
    logoOpacity,
    logoScale,
    textOpacity,
    textTranslateY,
    footerOpacity,
    screenFadeOut,
  ]);

  const handleSkipPress = () => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    router.replace(isAuthenticated ? '/(app)' : '/(auth)/login');
  };

  return (
    <Pressable style={styles.pressableRoot} onPress={handleSkipPress}>
      <Animated.View style={[styles.rootContainer, { opacity: screenFadeOut }]}>
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.centerContent}>
              {/* Animated Samavya Logo */}
              <Animated.View
                style={[
                  styles.logoWrapper,
                  {
                    opacity: logoOpacity,
                    transform: [{ scale: logoScale }],
                  },
                ]}
              >
                <Image
                  source={require('../../assets/images/samavya-logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </Animated.View>

              {/* Animated Brand Typography */}
              <Animated.View
                style={[
                  styles.brandTextGroup,
                  {
                    opacity: textOpacity,
                    transform: [{ translateY: textTranslateY }],
                  },
                ]}
              >
                <Text style={styles.brandTitle}>Samavya</Text>
                <Text style={styles.brandSubtitle}>
                  Human Resource Management System
                </Text>
              </Animated.View>
            </View>

            {/* Bottom Footer Details */}
            <Animated.View style={[styles.footer, { opacity: footerOpacity }]}>
              <View style={styles.badgePill}>
                <View style={styles.statusDot} />
                <Text style={styles.footerBadgeText}>Enterprise Edition</Text>
              </View>
              <Text style={styles.copyrightText}>
                Secure Biometric &amp; Attendance System
              </Text>
            </Animated.View>
          </SafeAreaView>
        </ImageBackground>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
