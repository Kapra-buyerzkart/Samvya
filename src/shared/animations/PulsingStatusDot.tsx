import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface PulsingStatusDotProps {
  color?: string;
  size?: number;
}

export function PulsingStatusDot({
  color = '#2563EB',
  size = 8,
}: PulsingStatusDotProps): React.JSX.Element {
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.65);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(2.4, {
        duration: 1600,
        easing: Easing.out(Easing.ease),
      }),
      -1,
      false,
    );
    pulseOpacity.value = withRepeat(
      withTiming(0, {
        duration: 1600,
        easing: Easing.out(Easing.ease),
      }),
      -1,
      false,
    );
  }, [pulseOpacity, pulseScale]);

  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <View style={[styles.container, { width: size * 2.5, height: size * 2.5 }]}>
      {/* Outer Breathing Halo Ring */}
      <Animated.View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
          animatedRingStyle,
        ]}
      />
      {/* Core Solid Dot */}
      <View
        style={[
          styles.coreDot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
  },
  coreDot: {
    position: 'relative',
    zIndex: 1,
  },
});

