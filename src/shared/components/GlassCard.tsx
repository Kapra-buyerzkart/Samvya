import { BlurView, type BlurViewProps } from 'expo-blur';
import React from 'react';
import {
  Platform,
  StyleSheet,
  UIManager,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

// Check if native BlurView module is linked in the running binary
const isNativeBlurAvailable = Boolean(
  UIManager.getViewManagerConfig?.('ExpoBlurView') ||
  UIManager.getViewManagerConfig?.('ViewManagerAdapter_ExpoBlur_ExpoBlurView'),
);

export interface GlassCardProps extends ViewProps {
  intensity?: number;
  tint?: BlurViewProps['tint'];
}

export function GlassCard({
  children,
  style,
  intensity = 50,
  tint = 'light',
  ...props
}: GlassCardProps): React.JSX.Element {
  const flattenedStyle = StyleSheet.flatten(style) || {};
  const {
    padding,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingHorizontal,
    paddingVertical,
    ...containerStyle
  } = flattenedStyle as ViewStyle;

  const contentPaddingStyle: ViewStyle = {
    padding: padding ?? 24,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingHorizontal,
    paddingVertical,
  };

  if (Platform.OS === 'android') {
    // On Android, elevation causes dark shadows to bleed through semi-transparent views.
    // A clean, translucent white surface (rgba(255, 255, 255, 0.68)) with high-contrast
    // white border delivers the exact frosted glass aesthetic from the reference design.
    return (
      <View style={[styles.androidGlassCard, containerStyle]} {...props}>
        <View style={contentPaddingStyle}>{children}</View>
      </View>
    );
  }

  // On iOS, BlurView renders native frosted blur behind content
  return (
    <View style={[styles.iosContainer, containerStyle]} {...props}>
      {isNativeBlurAvailable ? (
        <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
      ) : null}
      <View style={contentPaddingStyle}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  androidGlassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    overflow: 'hidden',
  },
  iosContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    overflow: 'hidden',
  },
});
