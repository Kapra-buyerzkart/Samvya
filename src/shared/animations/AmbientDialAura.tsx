import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface AmbientDialAuraProps {
  size: number;
  isActive?: boolean;
}

export function AmbientDialAura({
  size,
  isActive = true,
}: AmbientDialAuraProps): React.JSX.Element {
  const breathScale = useSharedValue(0.92);
  const breathOpacity = useSharedValue(0.55);

  useEffect(() => {
    if (isActive) {
      breathScale.value = withRepeat(
        withTiming(1.08, {
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      );
      breathOpacity.value = withRepeat(
        withTiming(0.9, {
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      );
    } else {
      breathScale.value = withTiming(0.9, { duration: 500 });
      breathOpacity.value = withTiming(0.2, { duration: 500 });
    }
  }, [isActive, breathOpacity, breathScale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathScale.value }],
    opacity: breathOpacity.value,
  }));

  const radius = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]} pointerEvents="none">
      <Animated.View style={[styles.haloContainer, animatedStyle]}>
        {/* Soft Ambient Radial Blur Gradient */}
        <LinearGradient
          colors={[
            'rgba(37, 99, 235, 0.24)',
            'rgba(59, 130, 246, 0.12)',
            'rgba(239, 246, 255, 0.0)',
          ]}
          start={{ x: 0.5, y: 0.1 }}
          end={{ x: 0.5, y: 0.95 }}
          style={[
            styles.gradientCircle,
            {
              width: size,
              height: size,
              borderRadius: radius,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  haloContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientCircle: {
    position: 'absolute',
  },
});

