import React from 'react';
import { StyleSheet, View } from 'react-native';

interface CircularProgressDialProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 1
  trackColor?: string;
  progressColor?: string;
  knobColor?: string;
  knobBorderColor?: string;
  knobSize?: number;
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
  // With base rotation of -45°, at angleDeg = 0 the colored half is strictly in [180°, 360°] (outside right container).
  // Rotating clockwise by angleDeg brings exactly [0°, rightAngle] into the right container.
  const rightAngle = Math.min(180, angleDeg) - 45;
  // Left half sweeps from 180 to 360 deg
  const leftAngle = Math.max(0, angleDeg - 180) - 45;

  const innerDiscSize = size - strokeWidth * 2 - 16;
  const innerDiscRadius = innerDiscSize / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
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

      {/* 5. Interactive Knob at Progress End Point */}
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
  circle: {
    position: 'absolute',
    top: 0,
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
  knob: {
    position: 'absolute',
    zIndex: 5,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  centerDisc: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    zIndex: 1,
  },
});

