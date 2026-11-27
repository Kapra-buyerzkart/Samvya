import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

export interface ShimmerBarProps {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  isDark: boolean;
  progress: Animated.Value;
  style?: StyleProp<ViewStyle>;
}

export function ShimmerBar({
  width,
  height,
  borderRadius = 8,
  isDark,
  progress,
  style,
}: ShimmerBarProps): React.JSX.Element {
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-140, 240],
  });

  const baseColor = isDark ? '#1E293B' : '#E2E8F0';
  const highlightColors: readonly [string, string, string] = isDark
    ? ['rgba(30,41,59,0)', 'rgba(148,163,184,0.22)', 'rgba(30,41,59,0)']
    : ['rgba(226,232,240,0)', 'rgba(255,255,255,0.8)', 'rgba(226,232,240,0)'];

  return (
    <View
      style={[
        styles.barBase,
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseColor,
        },
        style,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shimmerSweep,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={highlightColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.shimmerGradient}
        />
      </Animated.View>
    </View>
  );
}

export function useShimmerProgress(): Animated.Value {
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [progress]);

  return progress;
}

const styles = StyleSheet.create({
  barBase: {
    overflow: 'hidden',
  },
  shimmerSweep: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 120,
  },
  shimmerGradient: {
    flex: 1,
  },
});
