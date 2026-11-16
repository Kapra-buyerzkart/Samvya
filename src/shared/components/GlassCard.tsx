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
  // On Android, native BlurView has severe padding-inset and clipping artifacts.
  // A clean, semi-transparent frosted card provides a consistent, high-performance aesthetic.
  if (Platform.OS === 'android' || !isNativeBlurAvailable) {
    return (
      <View style={[styles.androidGlassCard, style]} {...props}>
        {children}
      </View>
    );
  }

  // On iOS, BlurView renders beautifully with absolute positioning so padding does not inset the blur canvas
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
    padding,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingHorizontal,
    paddingVertical,
  };

  return (
    <View style={[styles.iosContainer, containerStyle]} {...props}>
      <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
      <View style={[styles.contentContainer, contentPaddingStyle]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  androidGlassCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    overflow: 'hidden',
  },
  iosContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 28,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#19326C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    overflow: 'hidden',
  },
  contentContainer: {
    width: '100%',
  },
});
