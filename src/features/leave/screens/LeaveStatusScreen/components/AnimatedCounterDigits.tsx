import React, { useEffect, useState } from 'react';
import { StyleSheet, View, type StyleProp, type TextStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

export interface AnimatedCounterDigitsProps {
  value: number;
  textStyle: StyleProp<TextStyle>;
  testID?: string;
}

interface CounterTransitionState {
  currentValue: number;
  currentFormatted: string;
  previousFormatted: string | null;
  direction: 1 | -1;
}

const DIGIT_TIMING_CONFIG = {
  duration: 320,
  easing: Easing.bezier(0.22, 1, 0.36, 1),
} as const;

export const AnimatedCounterDigits = React.memo(function AnimatedCounterDigits({
  value,
  textStyle,
  testID,
}: AnimatedCounterDigitsProps): React.JSX.Element {
  const reducedMotion = useReducedMotion();
  const formatted = String(value).padStart(2, '0');

  const [transition, setTransition] = useState<CounterTransitionState>({
    currentValue: value,
    currentFormatted: formatted,
    previousFormatted: null,
    direction: 1,
  });

  if (transition.currentFormatted !== formatted) {
    setTransition({
      currentValue: value,
      currentFormatted: formatted,
      previousFormatted: transition.currentFormatted,
      direction: value >= transition.currentValue ? 1 : -1,
    });
  }

  const tensChar = formatted[0] ?? '0';
  const unitsChar = formatted[1] ?? '0';
  const prevTens = transition.previousFormatted?.[0] ?? null;
  const prevUnits = transition.previousFormatted?.[1] ?? null;

  const tensChanged = prevTens !== null && prevTens !== tensChar;
  const unitsChanged = prevUnits !== null && prevUnits !== unitsChar;

  const direction = useSharedValue<number>(transition.direction);
  const tensProgress = useSharedValue(1);
  const unitsProgress = useSharedValue(1);

  useEffect(() => {
    if (!transition.previousFormatted) {
      return;
    }

    direction.value = reducedMotion ? 0 : transition.direction;

    if (tensChanged) {
      tensProgress.value = 0;
      tensProgress.value = withTiming(1, DIGIT_TIMING_CONFIG);
    }

    if (unitsChanged) {
      unitsProgress.value = 0;
      const anim = withTiming(1, DIGIT_TIMING_CONFIG);
      unitsProgress.value = tensChanged ? withDelay(35, anim) : anim;
    }
  }, [
    transition.currentFormatted,
    transition.previousFormatted,
    transition.direction,
    tensChanged,
    unitsChanged,
    reducedMotion,
    direction,
    tensProgress,
    unitsProgress,
  ]);

  const tensInStyle = useAnimatedStyle(() => {
    'worklet';
    const p = tensProgress.value;
    return {
      opacity: p,
      transform: [{ translateY: direction.value * 22 * (1 - p) }],
    };
  });

  const tensOutStyle = useAnimatedStyle(() => {
    'worklet';
    const p = tensProgress.value;
    return {
      opacity: 1 - p,
      transform: [{ translateY: -direction.value * 22 * p }],
    };
  });

  const unitsInStyle = useAnimatedStyle(() => {
    'worklet';
    const p = unitsProgress.value;
    return {
      opacity: p,
      transform: [{ translateY: direction.value * 22 * (1 - p) }],
    };
  });

  const unitsOutStyle = useAnimatedStyle(() => {
    'worklet';
    const p = unitsProgress.value;
    return {
      opacity: 1 - p,
      transform: [{ translateY: -direction.value * 22 * p }],
    };
  });

  return (
    <View style={styles.clipContainer}>
      {transition.previousFormatted ? (
        <View
          style={[styles.digitsRow, styles.outgoingLayer]}
          pointerEvents="none"
          importantForAccessibility="no-hide-descendants"
        >
          <Animated.Text
            style={[textStyle, tensChanged ? tensOutStyle : styles.hiddenChar]}
          >
            {prevTens}
          </Animated.Text>
          <Animated.Text
            style={[textStyle, unitsChanged ? unitsOutStyle : styles.hiddenChar]}
          >
            {prevUnits}
          </Animated.Text>
        </View>
      ) : null}

      <View style={styles.digitsRow} testID={testID} accessibilityLabel={formatted}>
        <Animated.Text style={[textStyle, tensInStyle]}>{tensChar}</Animated.Text>
        <Animated.Text style={[textStyle, unitsInStyle]}>{unitsChar}</Animated.Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  clipContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  digitsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outgoingLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  hiddenChar: {
    opacity: 0,
  },
});
