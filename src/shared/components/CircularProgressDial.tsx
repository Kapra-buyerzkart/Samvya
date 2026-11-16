import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SkiaDialAura } from '@/shared/animations/SkiaDialAura';

interface CircularProgressDialProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 1
  trackColor?: string;
  progressColor?: string;
  knobColor?: string;
  knobBorderColor?: string;
  knobSize?: number;
  isActive?: boolean;
  showAura?: boolean;
  children?: React.ReactNode;
}

export function CircularProgressDial({
  size = 220,
  strokeWidth = 10,
  progress,
  trackColor = '#DDEBFC',
  progressColor = '#1D4ED8',
  knobColor = '#FFFFFF',
  knobBorderColor = '#1D4ED8',
  knobSize = 16,
  isActive = true,
  showAura = true,
  children,
}: CircularProgressDialProps): React.JSX.Element {
  const radius = size / 2;
  const clampedProgress = Math.min(1, Math.max(0, isNaN(progress) ? 0 : progress));
  const angleDeg = clampedProgress * 360;

  // Knob position along center of track (radius - strokeWidth / 2)
  const trackRadius = radius - strokeWidth / 2;
  const knobRad = (angleDeg - 90) * (Math.PI / 180);
  const knobLeft = radius + trackRadius * Math.cos(knobRad) - knobSize / 2;
  const knobTop = radius + trackRadius * Math.sin(knobRad) - knobSize / 2;

  // Semicircle rotation angles
  const rightAngle = Math.min(180, angleDeg) - 45;
  const leftAngle = Math.max(0, angleDeg - 180) - 45;

  const innerDiscSize = size - strokeWidth * 2 - 16;
  const innerDiscRadius = innerDiscSize / 2;

  // Micro-animation: knob halo breathing glow
  const haloScale = useSharedValue(1);
  const haloOpacity = useSharedValue(0.7);

  useEffect(() => {
    if (isActive) {
      haloScale.value = withRepeat(
        withTiming(1.65, {
          duration: 1500,
          easing: Easing.out(Easing.ease),
        }),
        -1,
        false,
      );
      haloOpacity.value = withRepeat(
        withTiming(0, {
          duration: 1500,
          easing: Easing.out(Easing.ease),
        }),
        -1,
        false,
      );
    } else {
      haloScale.value = withTiming(1);
      haloOpacity.value = withTiming(0);
    }
  }, [isActive, haloOpacity, haloScale]);

  const animatedHaloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: haloScale.value }],
    opacity: haloOpacity.value,
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 0. Ambient Skia Radial Aura Glow */}
      {showAura && (
        <View style={styles.auraWrapper}>
          <SkiaDialAura size={size + 32} isActive={isActive} />
        </View>
      )}

      {/* 1. Full Track Circle */}
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: radius,
            borderWidth: strokeWidth,
            borderColor: trackColor,
          },
        ]}
      />

      {/* 2. First Half Arc (0 to 180 deg - Right side) */}
      <View
        style={[
          styles.halfContainer,
          {
            left: radius,
            width: radius,
            height: size,
          },
        ]}
      >
        <View
          style={[
            styles.circle,
            {
              left: -radius,
              width: size,
              height: size,
              borderRadius: radius,
              borderWidth: strokeWidth,
              borderColor: 'transparent',
              borderTopColor: progressColor,
              borderLeftColor: progressColor,
              transform: [{ rotate: `${rightAngle}deg` }],
            },
          ]}
        />
      </View>

      {/* 3. Second Half Arc (180 to 360 deg - Left side) */}
      {angleDeg > 180 && (
        <View
          style={[
            styles.halfContainer,
            {
              left: 0,
              width: radius,
              height: size,
            },
          ]}
        >
          <View
            style={[
              styles.circle,
              {
                left: 0,
                width: size,
                height: size,
                borderRadius: radius,
                borderWidth: strokeWidth,
                borderColor: 'transparent',
                borderBottomColor: progressColor,
                borderRightColor: progressColor,
                transform: [{ rotate: `${leftAngle}deg` }],
              },
            ]}
          />
        </View>
      )}

      {/* 4. Rounded Cap at Start Point (12 o'clock) */}
      {angleDeg > 0 && (
        <View
          style={[
            styles.startCap,
            {
              top: 0,
              left: radius - strokeWidth / 2,
              width: strokeWidth,
              height: strokeWidth,
              borderRadius: strokeWidth / 2,
              backgroundColor: progressColor,
            },
          ]}
        />
      )}

      {/* 5. Interactive Knob Halo Breathing Glow & Knob */}
      {isActive && (
        <Animated.View
          style={[
            styles.knobHalo,
            {
              left: knobLeft,
              top: knobTop,
              width: knobSize,
              height: knobSize,
              borderRadius: knobSize / 2,
              backgroundColor: progressColor,
            },
            animatedHaloStyle,
          ]}
        />
      )}
      <View
        style={[
          styles.knob,
          {
            left: knobLeft,
            top: knobTop,
            width: knobSize,
            height: knobSize,
            borderRadius: knobSize / 2,
            backgroundColor: knobColor,
            borderColor: knobBorderColor,
            borderWidth: 3.5,
          },
        ]}
      />

      {/* 6. Center Disc with Subtle Depth Shadow */}
      <View
        style={[
          styles.centerDisc,
          {
            width: innerDiscSize,
            height: innerDiscSize,
            borderRadius: innerDiscRadius,
            top: radius - innerDiscRadius,
            left: radius - innerDiscRadius,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  auraWrapper: {
    position: 'absolute',
    top: -16,
    left: -16,
    zIndex: 0,
  },
  circle: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  halfContainer: {
    position: 'absolute',
    top: 0,
    overflow: 'hidden',
  },
  startCap: {
    position: 'absolute',
    zIndex: 2,
  },
  knobHalo: {
    position: 'absolute',
    zIndex: 2,
  },
  knob: {
    position: 'absolute',
    zIndex: 3,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  centerDisc: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F1E36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    zIndex: 1,
  },
});
