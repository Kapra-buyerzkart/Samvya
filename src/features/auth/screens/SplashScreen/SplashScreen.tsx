import React from 'react';
import { Animated, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getBrandSubtitleStyle,
  getBrandTextAnimatedStyle,
  getBrandTitleStyle,
  getFooterAnimatedStyle,
  getLoaderFillAnimatedStyle,
  getLoaderTrackStyle,
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
    loaderProgress,
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
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.topSpacer} />

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
              <Text style={[styles.brandTitle, getBrandTitleStyle(isDark)]}>
                Samavya
              </Text>
              <Text style={[styles.brandSubtitle, getBrandSubtitleStyle(isDark)]}>
                Workforce &amp; Attendance
              </Text>
            </Animated.View>
          </View>

          <Animated.View style={[styles.footer, getFooterAnimatedStyle(footerOpacity)]}>
            <View style={[styles.loaderTrack, getLoaderTrackStyle(isDark)]}>
              <Animated.View
                style={[styles.loaderFill, getLoaderFillAnimatedStyle(loaderProgress, isDark)]}
              />
            </View>
          </Animated.View>
        </SafeAreaView>
      </Animated.View>
    </Pressable>
  );
}

export default SplashScreen;
