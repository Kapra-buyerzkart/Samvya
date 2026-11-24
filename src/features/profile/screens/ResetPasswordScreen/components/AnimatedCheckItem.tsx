import { Feather } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { getCheckTextStyle, styles } from '../ResetPasswordScreen.styles';

export function AnimatedCheckItem({
  checked,
  label,
  isDark = false,
}: {
  checked: boolean;
  label: string;
  isDark?: boolean;
}): React.JSX.Element {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (checked) {
      scale.value = withSpring(1.25, { damping: 10, stiffness: 350 }, () => {
        scale.value = withSpring(1);
      });
    }
  }, [checked, scale]);

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.checkItem}>
      <Animated.View style={iconAnimStyle}>
        <Feather
          name={checked ? 'check-circle' : 'circle'}
          size={15}
          color={checked ? (isDark ? '#4ADE80' : '#16A34A') : isDark ? '#64748B' : '#94A3B8'}
        />
      </Animated.View>
      <Text style={getCheckTextStyle(checked, isDark)}>
        {label}
      </Text>
    </View>
  );
}
