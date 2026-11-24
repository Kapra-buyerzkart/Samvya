import { useEffect, useMemo } from 'react';
import {
  Easing,
  type SharedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { type LeavePieDataItem } from '../model/leaveHistoryData';

export interface ComputedSlice {
  index: number;
  dataItem: LeavePieDataItem;
  value: number;
  color: string;
  startFrac: number;
  endFrac: number;
  startAngle: number;
  endAngle: number;
  midAngle: number;
  labelX: number;
  labelY: number;
  showInnerLabel: boolean;
  monthLabel: string;
  daysLabel: string;
  textColor: string;
  textSize: number;
  staticD: string;
}

export interface PieChartAnimationReturn {
  progress: SharedValue<number>;
  auraScale: SharedValue<number>;
  auraOpacity: SharedValue<number>;
  computedSlices: ComputedSlice[];
  radius: number;
}

export function buildArcPath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  'worklet';
  const sweep = endAngle - startAngle;
  if (sweep <= 0.0001) {
    return '';
  }
  if (sweep >= 2 * Math.PI - 0.0001) {
    return `M ${cx} ${cy - radius} A ${radius} ${radius} 0 1 1 ${cx} ${cy + radius} A ${radius} ${radius} 0 1 1 ${cx} ${cy - radius} Z`;
  }
  const x1 = cx + radius * Math.sin(startAngle);
  const y1 = cy - radius * Math.cos(startAngle);
  const x2 = cx + radius * Math.sin(endAngle);
  const y2 = cy - radius * Math.cos(endAngle);
  const largeArcFlag = sweep > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
}

export function usePieChartAnimation(
  data: LeavePieDataItem[],
  radius: number = 95,
): PieChartAnimationReturn {
  const progress = useSharedValue(0);
  const auraScale = useSharedValue(0.92);
  const auraOpacity = useSharedValue(0.35);

  useEffect(() => {
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
  }, [auraOpacity, auraScale]);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [data, progress]);

  const computedSlices = useMemo(() => {
    const validItems = data.filter((item) => (item?.value ?? 0) > 0);
    const total = validItems.reduce((sum, item) => sum + item.value, 0);

    if (total <= 0 || validItems.length === 0) {
      return [];
    }

    let accumulatedFrac = 0;
    const labelRadius = radius * 0.65;

    return validItems.map((item, index) => {
      const frac = item.value / total;
      const startFrac = accumulatedFrac;
      const endFrac = index === validItems.length - 1 ? 1 : accumulatedFrac + frac;
      accumulatedFrac = endFrac;

      const startAngle = startFrac * 2 * Math.PI;
      const endAngle = endFrac * 2 * Math.PI;
      const midAngle = (startAngle + endAngle) / 2;

      const labelX = labelRadius * Math.sin(midAngle);
      const labelY = -labelRadius * Math.cos(midAngle);

      const staticD = buildArcPath(0, 0, radius, startAngle, endAngle);

      return {
        index,
        dataItem: item,
        value: item.value,
        color: item.color || '#3B82F6',
        startFrac,
        endFrac,
        startAngle,
        endAngle,
        midAngle,
        labelX,
        labelY,
        showInnerLabel: Boolean(item.showInnerLabel),
        monthLabel: item.monthLabel || '',
        daysLabel: item.daysLabel || '',
        textColor: item.textColor || '#FFFFFF',
        textSize: item.textSize || 11,
        staticD,
      };
    });
  }, [data, radius]);

  return {
    progress,
    auraScale,
    auraOpacity,
    computedSlices,
    radius,
  };
}
