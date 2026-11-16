import React, { useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TactilePressableProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  activeScale?: number;
  friction?: number;
  tension?: number;
  children?: React.ReactNode;
}

export function TactilePressable({
  style,
  activeScale = 0.96,
  friction = 6,
  tension = 180,
  children,
  onPressIn,
  onPressOut,
  ...rest
}: TactilePressableProps): React.JSX.Element {
  const [scale] = useState(() => new Animated.Value(1));

  const handlePressIn = (e: GestureResponderEvent): void => {
    Animated.spring(scale, {
      toValue: activeScale,
      useNativeDriver: true,
      friction,
      tension,
    }).start();
    onPressIn?.(e);
  };

  const handlePressOut = (e: GestureResponderEvent): void => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction,
      tension,
    }).start();
    onPressOut?.(e);
  };

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, { transform: [{ scale }] }]}
    >
      {children}
    </AnimatedPressable>
  );
}
