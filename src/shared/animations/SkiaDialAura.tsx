import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BlurMask,
  Canvas,
  Circle,
  RadialGradient,
  vec,
} from '@shopify/react-native-skia';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface SkiaDialAuraProps {
  size: number;
  isActive?: boolean;
}

export function SkiaDialAura({
  size,
  isActive = true,
}: SkiaDialAuraProps): React.JSX.Element {
  const center = size / 2;
  const c = vec(center, center);

  const breath = useSharedValue(0.85);

  useEffect(() => {
    if (isActive) {
      breath.value = withRepeat(
        withTiming(1.12, {
          duration: 2400,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      );
    } else {
      breath.value = withTiming(0.8, { duration: 600 });
    }
  }, [isActive, breath]);

  const auraRadius = useDerivedValue(() => {
    return (size / 2 - 8) * breath.value;
  });

  return (
    <View style={[styles.container, { width: size, height: size }]} pointerEvents="none">
      <Canvas style={styles.canvas}>
        <Circle c={c} r={auraRadius}>
          <RadialGradient
            c={c}
            r={size / 2}
            colors={['rgba(37, 99, 235, 0.22)', 'rgba(59, 130, 246, 0.08)', 'rgba(219, 234, 254, 0)']}
          />
          <BlurMask blur={16} style="normal" />
        </Circle>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  canvas: {
    flex: 1,
  },
});

