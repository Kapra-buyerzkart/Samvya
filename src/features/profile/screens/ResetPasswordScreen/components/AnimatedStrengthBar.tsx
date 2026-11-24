import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { styles } from '../ResetPasswordScreen.styles';

export function AnimatedStrengthBar({
  filled,
  color,
}: {
  filled: boolean;
  color: string;
}): React.JSX.Element {
  const scaleY = useSharedValue(1);

  useEffect(() => {
    if (filled) {
      scaleY.value = withSpring(1.25, { damping: 12, stiffness: 300 }, () => {
        scaleY.value = withSpring(1);
      });
    }
  }, [filled, scaleY]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: scaleY.value }],
    opacity: withTiming(filled ? 1 : 0.35, { duration: 200 }),
  }));

  return (
    <Animated.View style={[styles.strengthBar, filled ? { backgroundColor: color } : undefined, animStyle]} />
  );
}
