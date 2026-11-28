import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { Circle, G, Path, Svg, Text as SvgText, TSpan } from 'react-native-svg';
import { type DurationKey, type LeavePieDataItem } from '../../data/leaveHistoryData';
import { getChartAuraBgStyle, styles } from './PieChart.styles';
import {
  buildArcPath,
  usePieChartAnimation,
  type ComputedSlice,
} from './usePieChartAnimation';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

interface AnimatedPieSliceProps {
  slice: ComputedSlice;
  progress: SharedValue<number>;
  radius: number;
}

function AnimatedPieSlice({
  slice,
  progress,
  radius,
}: AnimatedPieSliceProps): React.JSX.Element {
  const animatedProps = useAnimatedProps(() => {
    'worklet';
    const p = progress.value;

    if (p <= slice.startFrac) {
      return { d: '' };
    }

    if (p >= slice.endFrac || p >= 1) {
      return { d: slice.staticD };
    }

    const sliceSpan = slice.endFrac - slice.startFrac;
    const localProgress = sliceSpan > 0 ? (p - slice.startFrac) / sliceSpan : 1;
    const currentAngle =
      slice.startAngle + localProgress * (slice.endAngle - slice.startAngle);

    return {
      d: buildArcPath(0, 0, radius, slice.startAngle, currentAngle),
    };
  });

  const animatedLabelProps = useAnimatedProps(() => {
    'worklet';
    const p = progress.value;

    if (p < slice.startFrac) {
      return { opacity: 0 };
    }

    if (p >= slice.endFrac || p >= 1) {
      return { opacity: 1 };
    }

    const sliceSpan = slice.endFrac - slice.startFrac;
    const localProgress = sliceSpan > 0 ? (p - slice.startFrac) / sliceSpan : 1;
    const opacity = localProgress > 0.5 ? (localProgress - 0.5) / 0.5 : 0;

    return { opacity };
  });

  return (
    <G>
      <AnimatedPath
        animatedProps={animatedProps}
        fill={slice.color}
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {slice.showInnerLabel ? (
        <AnimatedG animatedProps={animatedLabelProps} pointerEvents="none">
          <SvgText
            x={slice.labelX}
            y={slice.labelY}
            fill={slice.textColor}
            textAnchor="middle"
          >
            <TSpan
              x={slice.labelX}
              dy="-3"
              fontSize={slice.textSize}
              fontWeight="bold"
            >
              {slice.monthLabel}
            </TSpan>
            <TSpan
              x={slice.labelX}
              dy="13"
              fontSize={Math.max(slice.textSize - 2, 8)}
              fontWeight="500"
              fill={slice.textColor}
              fillOpacity={0.92}
            >
              {slice.daysLabel}
            </TSpan>
          </SvgText>
        </AnimatedG>
      ) : null}
    </G>
  );
}

export interface AnimatedLeavePieChartProps {
  durationKey: DurationKey;
  selectedMonth: string;
  data: LeavePieDataItem[];
  isDark: boolean;
}

export function AnimatedLeavePieChart({
  data,
  isDark,
}: AnimatedLeavePieChartProps): React.JSX.Element {
  const chartRadius = 95;
  const viewPadding = 3;
  const viewSize = (chartRadius + viewPadding) * 2;
  const viewRadius = chartRadius + viewPadding;

  const { progress, auraScale, auraOpacity, computedSlices, radius } =
    usePieChartAnimation(data, chartRadius);

  const animatedAuraStyle = useAnimatedStyle(() => ({
    transform: [{ scale: auraScale.value }],
    opacity: auraOpacity.value,
  }));

  const totalValue = data.reduce((sum, item) => sum + (item.value ?? 0), 0);
  const totalDaysLabel = `${Number(totalValue.toFixed(1))} ${totalValue === 1 ? 'day' : 'days'}`;

  return (
    <View style={styles.chartContainer} testID="gifted-pie-chart-container">
      <Animated.View
        pointerEvents="none"
        style={[styles.chartAuraCircle, getChartAuraBgStyle(isDark), animatedAuraStyle]}
      />

      <Svg
        width={viewSize}
        height={viewSize}
        viewBox={`-${viewRadius} -${viewRadius} ${viewSize} ${viewSize}`}
        style={styles.svgContainer}
      >
        {computedSlices.map((slice) => (
          <AnimatedPieSlice
            key={`pie-slice-${slice.monthLabel}-${slice.index}`}
            slice={slice}
            progress={progress}
            radius={radius}
          />
        ))}
        <Circle
          cx={0}
          cy={0}
          r={52}
          fill={isDark ? '#0F172A' : '#FFFFFF'}
        />
        <SvgText
          x={0}
          y={-4}
          fill={isDark ? '#F8FAFC' : '#0F172A'}
          fontSize="16"
          fontWeight="700"
          textAnchor="middle"
        >
          {totalDaysLabel}
        </SvgText>
        <SvgText
          x={0}
          y={14}
          fill={isDark ? '#94A3B8' : '#64748B'}
          fontSize="11"
          fontWeight="500"
          textAnchor="middle"
        >
          Approved
        </SvgText>
      </Svg>
    </View>
  );
}
