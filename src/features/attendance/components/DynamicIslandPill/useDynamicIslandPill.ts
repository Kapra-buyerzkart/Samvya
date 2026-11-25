/* eslint-disable react-hooks/immutability */
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, usePathname } from 'expo-router';
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useAppTheme } from '@/shared/theme';
import { usePersistentShiftTimer } from '../../hooks/usePersistentShiftTimer';
import {
  COLLAPSED_HEIGHT,
  COLLAPSED_WIDTH,
  EXPANDED_HEIGHT,
  EXPANDED_WIDTH,
} from './DynamicIslandPill.styles';

export interface DynamicIslandPillProps {
  /** If true, renders even when off-duty / punched out (useful for preview & testing) */
  forceVisible?: boolean;
}

export function useDynamicIslandPill(forceVisible: boolean) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const theme = useAppTheme();
  const isDark = theme.isDark;
  const timer = usePersistentShiftTimer();

  const [isExpanded, setIsExpanded] = useState(false);
  const expandProgress = useSharedValue(0);
  const pulseAnim = useSharedValue(1);

  // Hide on camera / face verification screens so it doesn't obstruct camera view
  const isFaceVerifyScreen = pathname.includes('attendance/face-verify');
  const shouldRender = forceVisible || (!isFaceVerifyScreen && !timer.isPunchedOut);

  useEffect(() => {
    if (!shouldRender) return;
    const interval = setInterval(() => {
      pulseAnim.value = withTiming(0.4, { duration: 900, easing: Easing.inOut(Easing.ease) }, () => {
        pulseAnim.value = withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) });
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [shouldRender, pulseAnim]);

  const toggleExpand = useCallback(() => {
    const next = !isExpanded;
    setIsExpanded(next);
    expandProgress.value = withSpring(next ? 1 : 0, {
      damping: 18,
      stiffness: 220,
      mass: 0.8,
    });
  }, [isExpanded, expandProgress]);

  const collapse = useCallback(() => {
    setIsExpanded(false);
    expandProgress.value = withSpring(0, {
      damping: 18,
      stiffness: 220,
      mass: 0.8,
    });
  }, [expandProgress]);

  const handleBreakAction = useCallback(() => {
    if (timer.isOnBreak) {
      timer.resumeWork();
    } else {
      timer.startBreak();
    }
  }, [timer]);

  const handlePunchOutAction = useCallback(() => {
    collapse();
    router.push({
      pathname: '/(app)/attendance/face-verify',
      params: { action: 'punch-out' },
    });
  }, [collapse]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const currentWidth = interpolate(
      expandProgress.value,
      [0, 1],
      [COLLAPSED_WIDTH, EXPANDED_WIDTH],
    );
    const currentHeight = interpolate(
      expandProgress.value,
      [0, 1],
      [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
    );
    const radius = interpolate(expandProgress.value, [0, 1], [19, 24]);

    return {
      width: currentWidth,
      height: currentHeight,
      borderRadius: radius,
    };
  });

  const collapsedOpacityStyle = useAnimatedStyle(() => {
    const opacity = interpolate(expandProgress.value, [0, 0.4, 1], [1, 0, 0]);
    return { opacity };
  });

  const expandedOpacityStyle = useAnimatedStyle(() => {
    const opacity = interpolate(expandProgress.value, [0, 0.5, 1], [0, 0, 1]);
    return { opacity };
  });

  const pulseDotStyle = useAnimatedStyle(() => ({
    opacity: pulseAnim.value,
    transform: [{ scale: interpolate(pulseAnim.value, [0.4, 1], [0.82, 1]) }],
  }));

  const topOffset = Math.max(
    insets.top > 0 ? insets.top + (Platform.OS === 'ios' ? 4 : 6) : 10,
    10,
  );
  const isBreak = timer.isOnBreak;
  const statusColor = isBreak ? '#F59E0B' : '#10B981';
  const statusLabel = isBreak ? 'Break' : 'On Duty';
  const percentNumber = Math.min(100, Math.round(timer.progressFraction * 100));

  return {
    isDark,
    timer,
    isExpanded,
    shouldRender,
    topOffset,
    isBreak,
    statusColor,
    statusLabel,
    percentNumber,
    toggleExpand,
    collapse,
    handleBreakAction,
    handlePunchOutAction,
    containerAnimatedStyle,
    collapsedOpacityStyle,
    expandedOpacityStyle,
    pulseDotStyle,
  };
}
