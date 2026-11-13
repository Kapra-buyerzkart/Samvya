import { BlurView, type BlurViewProps } from 'expo-blur';
import React from 'react';
import { StyleSheet, UIManager, View, type ViewProps } from 'react-native';

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
  intensity = 60,
  tint = 'light',
  ...props
}: GlassCardProps): React.JSX.Element {
  if (!isNativeBlurAvailable) {
    return (
      <View style={[styles.fallbackGlass, style]} {...props}>
        {children}
      </View>
    );
  }

  return (
    <BlurView intensity={intensity} tint={tint} style={[styles.glassCard, style]} {...props}>
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  glassCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    overflow: 'hidden',
  },
  fallbackGlass: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    overflow: 'hidden',
  },
});
