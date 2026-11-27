import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

interface ShimmerBarProps {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  isDark: boolean;
  progress: Animated.Value;
  style?: StyleProp<ViewStyle>;
}

function ShimmerBar({
  width,
  height,
  borderRadius = 8,
  isDark,
  progress,
  style,
}: ShimmerBarProps): React.JSX.Element {
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-140, 220],
  });

  const baseColor = isDark ? '#1E293B' : '#E2E8F0';
  const highlightColors: readonly [string, string, string] = isDark
    ? ['rgba(30,41,59,0)', 'rgba(148,163,184,0.22)', 'rgba(30,41,59,0)']
    : ['rgba(226,232,240,0)', 'rgba(255,255,255,0.75)', 'rgba(226,232,240,0)'];

  return (
    <View
      style={[
        styles.barBase,
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseColor,
        },
        style,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shimmerSweep,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={highlightColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.shimmerGradient}
        />
      </Animated.View>
    </View>
  );
}

function useShimmerProgress(): Animated.Value {
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [progress]);

  return progress;
}

const CHART_SHIMMER_HEIGHTS = [54, 86, 108, 68, 114, 92, 48, 102, 76, 62] as const;

export function MonthlyWorkHoursShimmer({ isDark }: { isDark: boolean }): React.JSX.Element {
  const progress = useShimmerProgress();
  const dividerColor = isDark ? '#334155' : '#E2E8F0';

  return (
    <View
      testID="employment-month-shimmer"
      accessibilityLabel="Loading monthly work hours"
      style={styles.monthWrapper}
    >
      {/* Metrics Row Skeleton */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCol}>
          <ShimmerBar width={86} height={15} borderRadius={6} isDark={isDark} progress={progress} />
        </View>
        <View style={[styles.verticalDivider, { backgroundColor: dividerColor }]} />
        <View style={styles.metricCol}>
          <ShimmerBar
            width={54}
            height={11}
            borderRadius={5}
            isDark={isDark}
            progress={progress}
            style={styles.subLabelBar}
          />
          <ShimmerBar width={72} height={15} borderRadius={6} isDark={isDark} progress={progress} />
        </View>
        <View style={[styles.verticalDivider, { backgroundColor: dividerColor }]} />
        <View style={styles.metricCol}>
          <ShimmerBar width={88} height={15} borderRadius={6} isDark={isDark} progress={progress} />
        </View>
      </View>

      {/* Bar Chart Skeleton */}
      <View style={styles.chartRow}>
        <View style={styles.yAxisCol}>
          {[0, 1, 2, 3, 4].map((tick) => (
            <ShimmerBar
              key={tick}
              width={18}
              height={10}
              borderRadius={4}
              isDark={isDark}
              progress={progress}
            />
          ))}
        </View>

        <View style={styles.barsArea}>
          {CHART_SHIMMER_HEIGHTS.map((barHeight, idx) => (
            <View key={idx} style={styles.barSlot}>
              <ShimmerBar
                width={13}
                height={barHeight}
                borderRadius={7}
                isDark={isDark}
                progress={progress}
              />
              <ShimmerBar
                width={14}
                height={10}
                borderRadius={4}
                isDark={isDark}
                progress={progress}
                style={styles.xTickBar}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Legend Skeleton */}
      <View style={styles.legendRow}>
        {[64, 82, 58].map((w, idx) => (
          <View key={idx} style={styles.legendItem}>
            <ShimmerBar width={13} height={13} borderRadius={3} isDark={isDark} progress={progress} />
            <ShimmerBar width={w} height={11} borderRadius={5} isDark={isDark} progress={progress} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function EmploymentHistoryShimmer({ isDark }: { isDark: boolean }): React.JSX.Element {
  const progress = useShimmerProgress();
  const dividerColor = isDark ? '#1E293B' : '#E2E8F0';

  return (
    <View
      testID="employment-history-shimmer"
      accessibilityLabel="Loading employment history"
    >
      <View style={[styles.horizontalDivider, { backgroundColor: dividerColor }]} />

      {/* Role & Status Section */}
      <ShimmerBar
        width="58%"
        height={22}
        borderRadius={8}
        isDark={isDark}
        progress={progress}
        style={styles.roleBar}
      />

      <View style={styles.badgesRow}>
        <ShimmerBar width={64} height={24} borderRadius={12} isDark={isDark} progress={progress} />
        <ShimmerBar width={70} height={24} borderRadius={12} isDark={isDark} progress={progress} />
        <ShimmerBar width={74} height={14} borderRadius={6} isDark={isDark} progress={progress} />
      </View>

      <ShimmerBar
        width="78%"
        height={14}
        borderRadius={6}
        isDark={isDark}
        progress={progress}
      />

      <View style={[styles.horizontalDivider, { backgroundColor: dividerColor }]} />

      {/* 2-Column Info Grid */}
      <View style={styles.gridRow}>
        <View style={styles.gridCol}>
          <ShimmerBar width={96} height={11} borderRadius={4} isDark={isDark} progress={progress} />
          <ShimmerBar
            width="72%"
            height={16}
            borderRadius={6}
            isDark={isDark}
            progress={progress}
            style={styles.gridValueBar}
          />
        </View>
        <View style={styles.gridCol}>
          <ShimmerBar width={108} height={11} borderRadius={4} isDark={isDark} progress={progress} />
          <ShimmerBar
            width="65%"
            height={16}
            borderRadius={6}
            isDark={isDark}
            progress={progress}
            style={styles.gridValueBar}
          />
        </View>
      </View>

      <View style={[styles.gridRow, styles.gridRowSpaced]}>
        <View style={styles.gridCol}>
          <ShimmerBar width={98} height={11} borderRadius={4} isDark={isDark} progress={progress} />
          <ShimmerBar
            width="84%"
            height={16}
            borderRadius={6}
            isDark={isDark}
            progress={progress}
            style={styles.gridValueBar}
          />
        </View>
        <View style={styles.gridCol}>
          <ShimmerBar width={82} height={11} borderRadius={4} isDark={isDark} progress={progress} />
          <ShimmerBar
            width="78%"
            height={16}
            borderRadius={6}
            isDark={isDark}
            progress={progress}
            style={styles.gridValueBar}
          />
        </View>
      </View>

      <View style={[styles.horizontalDivider, { backgroundColor: dividerColor }]} />

      {/* Footer Dates */}
      <View style={styles.footerRow}>
        <ShimmerBar width={118} height={13} borderRadius={5} isDark={isDark} progress={progress} />
        <ShimmerBar width={132} height={13} borderRadius={5} isDark={isDark} progress={progress} />
      </View>
      <ShimmerBar
        width={112}
        height={13}
        borderRadius={5}
        isDark={isDark}
        progress={progress}
        style={styles.footerSecondBar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  barBase: {
    overflow: 'hidden',
  },
  shimmerSweep: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 120,
  },
  shimmerGradient: {
    flex: 1,
  },
  monthWrapper: {
    paddingTop: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 8,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subLabelBar: {
    marginBottom: 5,
  },
  verticalDivider: {
    width: 1,
    height: 28,
  },
  chartRow: {
    flexDirection: 'row',
    height: 170,
    paddingTop: 12,
    alignItems: 'flex-end',
  },
  yAxisCol: {
    width: 26,
    height: 130,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  barsArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  barSlot: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  xTickBar: {
    marginTop: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  horizontalDivider: {
    height: 1,
    width: '100%',
    marginVertical: 14,
  },
  roleBar: {
    marginBottom: 10,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridRowSpaced: {
    marginTop: 14,
  },
  gridCol: {
    flex: 1,
  },
  gridValueBar: {
    marginTop: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerSecondBar: {
    marginTop: 6,
  },
});
