import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Text as SvgText, TSpan } from 'react-native-svg';
import { type DurationKey, type LeavePieDataItem } from '../model/leaveHistoryData';

export interface AnimatedLeavePieChartProps {
  durationKey: DurationKey;
  selectedMonth: string;
  data: LeavePieDataItem[];
  isDark: boolean;
}

export function AnimatedLeavePieChart({
  durationKey,
  selectedMonth,
  data,
  isDark,
}: AnimatedLeavePieChartProps): React.JSX.Element {
  const chartScale = useSharedValue(0.75);
  const chartOpacity = useSharedValue(0);
  const chartRotation = useSharedValue(-20);

  const auraScale = useSharedValue(0.92);
  const auraOpacity = useSharedValue(0.35);

  useEffect(() => {
    chartScale.value = withSpring(1, { damping: 13, stiffness: 100 });
    chartOpacity.value = withTiming(1, { duration: 550, easing: Easing.out(Easing.cubic) });
    chartRotation.value = withSpring(0, { damping: 14, stiffness: 85 });

    auraScale.value = withRepeat(
      withTiming(1.08, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    auraOpacity.value = withRepeat(
      withTiming(0.65, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [auraOpacity, auraScale, chartOpacity, chartRotation, chartScale]);

  const animatedChartStyle = useAnimatedStyle(() => ({
    opacity: chartOpacity.value,
    transform: [
      { scale: chartScale.value },
      { rotate: `${chartRotation.value}deg` },
    ],
  }));

  const animatedAuraStyle = useAnimatedStyle(() => ({
    transform: [{ scale: auraScale.value }],
    opacity: auraOpacity.value,
  }));

  return (
    <View style={styles.chartContainer} testID="gifted-pie-chart-container">
      <Animated.View
        pointerEvents="none"
        style={[
          styles.chartAuraCircle,
          {
            backgroundColor: isDark
              ? 'rgba(59, 130, 246, 0.18)'
              : 'rgba(59, 130, 246, 0.12)',
          },
          animatedAuraStyle,
        ]}
      />

      <Animated.View style={animatedChartStyle}>
        <PieChart
          key={`pie-${durationKey}`}
          data={data}
          radius={95}
          showText={false}
          labelsPosition="outward"
          strokeColor="#FFFFFF"
          strokeWidth={2}
          initialAngle={-75}
          pieInnerComponent={(item) => {
            const pieItem = item as LeavePieDataItem;
            if (!pieItem?.showInnerLabel) return null;
            return (
              <SvgText
                fill={pieItem.textColor || '#FFFFFF'}
                textAnchor="middle"
              >
                <TSpan
                  x={0}
                  dy="-3"
                  fontSize={pieItem.textSize || 11}
                  fontWeight="bold"
                >
                  {pieItem.monthLabel}
                </TSpan>
                <TSpan
                  x={0}
                  dy="13"
                  fontSize={(pieItem.textSize || 11) - 2}
                  fontWeight="500"
                  fill={pieItem.textColor || '#FFFFFF'}
                  fillOpacity={0.92}
                >
                  {pieItem.daysLabel}
                </TSpan>
              </SvgText>
            );
          }}
          isAnimated
          animationDuration={800}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    position: 'relative',
  },
  chartAuraCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: 'center',
  },
});
