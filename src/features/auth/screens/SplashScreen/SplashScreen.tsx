import { ImageBackground } from 'expo-image';
import React from 'react';
import { Animated, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getBadgePillStyle,
  getBackgroundImageImageStyle,
  getBackgroundImageStyle,
  getBrandSubtitleStyle,
  getBrandTextAnimatedStyle,
  getBrandTitleStyle,
  getCopyrightTextStyle,
  getFooterAnimatedStyle,
  getFooterBadgeTextStyle,
  getLogoWrapperAnimatedStyle,
  getRootAnimatedStyle,
  styles,
} from './SplashScreen.styles';
import { useSplashScreen } from './useSplashScreen';

export function SplashScreen(): React.JSX.Element {
  const {
    isDark,
    logoOpacity,
    logoScale,
    textOpacity,
    textTranslateY,
    footerOpacity,
    screenFadeOut,
    handleSkipPress,
  } = useSplashScreen();

  return (
    <Pressable style={styles.pressableRoot} onPress={handleSkipPress}>
      <Animated.View
        style={[
          styles.rootContainer,
          getRootAnimatedStyle(screenFadeOut, isDark),
        ]}
      >
        <ImageBackground
          source={require('../../../../../assets/images/background.png')}
          style={[
            styles.backgroundImage,
            getBackgroundImageStyle(isDark),
          ]}
          imageStyle={getBackgroundImageImageStyle(isDark)}
          resizeMode="cover"
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.centerContent}>
              <Animated.View
                style={[
                  styles.logoWrapper,
                  getLogoWrapperAnimatedStyle(logoOpacity, logoScale, isDark),
                ]}
              >
                <Image
                  source={require('../../../../../assets/images/samavya-logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </Animated.View>

              <Animated.View
                style={[
                  styles.brandTextGroup,
                  getBrandTextAnimatedStyle(textOpacity, textTranslateY),
                ]}
              >
                <Text
                  style={[
                    styles.brandTitle,
                    getBrandTitleStyle(isDark),
                  ]}
                >
                  Samavya
                </Text>
                <Text
                  style={[
                    styles.brandSubtitle,
                    getBrandSubtitleStyle(isDark),
                  ]}
                >
                  Human Resource Management System
                </Text>
              </Animated.View>
            </View>

            <Animated.View style={[styles.footer, getFooterAnimatedStyle(footerOpacity)]}>
              <View
                style={[
                  styles.badgePill,
                  getBadgePillStyle(isDark),
                ]}
              >
                <View style={styles.statusDot} />
                <Text
                  style={[
                    styles.footerBadgeText,
                    getFooterBadgeTextStyle(isDark),
                  ]}
                >
                  Enterprise Edition
                </Text>
              </View>
              <Text
                style={[
                  styles.copyrightText,
                  getCopyrightTextStyle(isDark),
                ]}
              >
                Secure Biometric &amp; Attendance System
              </Text>
            </Animated.View>
          </SafeAreaView>
        </ImageBackground>
      </Animated.View>
    </Pressable>
  );
}

export default SplashScreen;
