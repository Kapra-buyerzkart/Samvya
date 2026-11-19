/* eslint-disable react-hooks/immutability */
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname, router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useAppTheme, FontFamily } from '@/shared/theme';
import { TactilePressable } from '@/shared/animations';
import { usePersistentShiftTimer } from '../hooks/usePersistentShiftTimer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLLAPSED_WIDTH = Math.min(SCREEN_WIDTH * 0.52, 204);
const COLLAPSED_HEIGHT = 38;
const EXPANDED_WIDTH = Math.min(SCREEN_WIDTH - 24, 384);
const EXPANDED_HEIGHT = 208;

interface DynamicIslandPillProps {
  /** If true, renders even when off-duty / punched out (useful for preview & testing) */
  forceVisible?: boolean;
}

export function DynamicIslandPill({
  forceVisible = false,
}: DynamicIslandPillProps): React.JSX.Element | null {
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

  // Subtle pulsing animation for active shift dot
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

  if (!shouldRender) {
    return null;
  }

  const topOffset = Math.max(insets.top > 0 ? insets.top + (Platform.OS === 'ios' ? 4 : 6) : 10, 10);
  const isBreak = timer.isOnBreak;
  const statusColor = isBreak ? '#F59E0B' : '#10B981';
  const statusLabel = isBreak ? 'Break' : 'On Duty';
  const percentNumber = Math.min(100, Math.round(timer.progressFraction * 100));

  return (
    <View
      pointerEvents="box-none"
      style={[styles.outerContainer, { top: topOffset }]}
      testID="dynamic-island-container"
    >
      {/* Tap-outside backdrop to dismiss expanded state */}
      {isExpanded && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={collapse}
          testID="dynamic-island-backdrop"
        />
      )}

      <Animated.View
        style={[
          styles.islandCard,
          {
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.92)',
            borderColor: isDark ? '#334155' : '#E2E8F0',
            shadowColor: isDark ? '#000000' : '#1E3A8A',
            shadowOpacity: isDark ? 0.45 : 0.12,
          },
          containerAnimatedStyle,
        ]}
      >
        {/* Frosted Glass Blur Background */}
        <BlurView
          intensity={Platform.OS === 'ios' ? (isDark ? 80 : 70) : 0}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />

        {!isExpanded ? (
          /* ========================================================= */
          /* COLLAPSED PILL VIEW                                      */
          /* ========================================================= */
          <Animated.View style={[styles.collapsedRow, collapsedOpacityStyle]}>
            <TactilePressable
              style={styles.collapsedPressable}
              onPress={toggleExpand}
              activeScale={0.96}
              accessibilityRole="button"
              accessibilityLabel={`Dynamic Island: ${statusLabel}, ${timer.workedDisplay}`}
              testID="dynamic-island-pill"
            >
              {/* Left status badge */}
              <View style={styles.pillLeft}>
                <Animated.View
                  style={[
                    styles.statusDot,
                    { backgroundColor: statusColor },
                    pulseDotStyle,
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: isDark ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  {statusLabel}
                </Text>
              </View>

              {/* Subtle vertical divider */}
              <View
                style={[
                  styles.pillDivider,
                  { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.1)' },
                ]}
              />

              {/* Right timer & progress */}
              <View style={styles.pillRight}>
                <Text
                  style={[
                    styles.pillTimerText,
                    { color: isDark ? '#E2E8F0' : isBreak ? '#D97706' : '#1D4ED8' },
                  ]}
                >
                  {isBreak
                    ? timer.breakDisplay
                    : `${timer.workedHours}h ${timer.workedMinutes < 10 ? '0' : ''}${timer.workedMinutes}m`}
                </Text>
                <View
                  style={[
                    styles.pillMiniPercent,
                    {
                      backgroundColor: isDark
                        ? 'rgba(37, 99, 235, 0.25)'
                        : isBreak
                          ? '#FEF3C7'
                          : '#EFF6FF',
                      borderColor: isDark
                        ? 'rgba(59, 130, 246, 0.4)'
                        : isBreak
                          ? '#FDE68A'
                          : '#BFDBFE',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.pillPercentText,
                      { color: isDark ? '#93C5FD' : isBreak ? '#D97706' : '#2563EB' },
                    ]}
                  >
                    {percentNumber}%
                  </Text>
                </View>
              </View>
            </TactilePressable>
          </Animated.View>
        ) : (
          /* ========================================================= */
          /* EXPANDED LIVE ACTIVITY CARD VIEW                          */
          /* ========================================================= */
          <Animated.View
            style={[styles.expandedContent, expandedOpacityStyle]}
            testID="dynamic-island-expanded"
          >
            {/* 1. Header Row */}
            <View style={styles.expandedHeader}>
              <View style={styles.headerBadge}>
                <Animated.View
                  style={[
                    styles.statusDotSmall,
                    { backgroundColor: statusColor },
                    pulseDotStyle,
                  ]}
                />
                <Text
                  style={[
                    styles.headerStatusText,
                    { color: isDark ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  {isBreak ? 'Break in Progress' : 'Active Shift'}
                </Text>
                <Text
                  style={[
                    styles.headerLocationText,
                    { color: isDark ? '#94A3B8' : '#64748B' },
                  ]}
                >
                  • {timer.workLocation || timer.shiftState?.workLocation || 'Office'}
                </Text>
              </View>

              <TactilePressable
                onPress={collapse}
                hitSlop={8}
                activeScale={0.9}
                style={[
                  styles.collapseButton,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0',
                  },
                ]}
                accessibilityLabel="Collapse Shift Island"
                testID="dynamic-island-collapse-btn"
              >
                <Feather
                  name="chevron-up"
                  size={16}
                  color={isDark ? '#CBD5E1' : '#475569'}
                />
              </TactilePressable>
            </View>

            {/* 2. Metrics 3-Card Row */}
            <View style={styles.metricsRow}>
              {/* Card 1: Time Logged */}
              <View
                style={[
                  styles.metricCard,
                  {
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.65)' : '#F8FAFC',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                  },
                ]}
              >
                <View style={styles.metricLabelRow}>
                  <Feather name="clock" size={10} color={isDark ? '#60A5FA' : '#2563EB'} />
                  <Text
                    style={[
                      styles.metricLabel,
                      { color: isDark ? '#94A3B8' : '#64748B' },
                    ]}
                  >
                    Time Logged
                  </Text>
                </View>
                <Text
                  style={[
                    styles.metricValuePrimary,
                    { color: isDark ? '#60A5FA' : '#1D4ED8' },
                  ]}
                >
                  {timer.workedDisplay}
                </Text>
              </View>

              {/* Card 2: Remaining */}
              <View
                style={[
                  styles.metricCard,
                  {
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.65)' : '#F8FAFC',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                  },
                ]}
              >
                <View style={styles.metricLabelRow}>
                  <Feather name="compass" size={10} color={isDark ? '#94A3B8' : '#475569'} />
                  <Text
                    style={[
                      styles.metricLabel,
                      { color: isDark ? '#94A3B8' : '#64748B' },
                    ]}
                  >
                    Remaining
                  </Text>
                </View>
                <Text
                  style={[
                    styles.metricValueSecondary,
                    { color: isDark ? '#F1F5F9' : '#0F172A' },
                  ]}
                >
                  {timer.remainingDisplay}
                </Text>
              </View>

              {/* Card 3: Total Break */}
              <View
                style={[
                  styles.metricCard,
                  {
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.65)' : '#F8FAFC',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                  },
                ]}
              >
                <View style={styles.metricLabelRow}>
                  <Feather name="coffee" size={10} color={isDark ? '#FBBF24' : '#D97706'} />
                  <Text
                    style={[
                      styles.metricLabel,
                      { color: isDark ? '#94A3B8' : '#64748B' },
                    ]}
                  >
                    Total Break
                  </Text>
                </View>
                <Text
                  style={[
                    styles.metricValueBreak,
                    { color: isDark ? '#FBBF24' : '#D97706' },
                  ]}
                >
                  {timer.breakDisplay}
                </Text>
              </View>
            </View>

            {/* 3. Progress Bar & Targets */}
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressTrack,
                  { backgroundColor: isDark ? '#1E293B' : '#E0E7FF' },
                ]}
              >
                <LinearGradient
                  colors={
                    isBreak
                      ? isDark
                        ? ['#D97706', '#F59E0B']
                        : ['#F59E0B', '#F97316']
                      : isDark
                        ? ['#2563EB', '#38BDF8']
                        : ['#1D4ED8', '#2563EB', '#3B82F6']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressBarFill,
                    { width: `${Math.max(5, percentNumber)}%` },
                  ]}
                />
              </View>
              <View style={styles.progressFooter}>
                <View style={styles.progressTargetLeft}>
                  <Feather
                    name="target"
                    size={11}
                    color={isDark ? '#60A5FA' : '#2563EB'}
                  />
                  <Text
                    style={[
                      styles.progressFooterText,
                      { color: isDark ? '#94A3B8' : '#64748B' },
                    ]}
                  >
                    {percentNumber}% of 8-hour shift target
                  </Text>
                </View>
                <View
                  style={[
                    styles.hoursTypeBadge,
                    {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#EFF6FF',
                      borderColor: isDark ? '#334155' : '#DBEAFE',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.hoursTypeText,
                      { color: isDark ? '#CBD5E1' : '#1D4ED8' },
                    ]}
                  >
                    {timer.shiftState.hoursType} Hours
                  </Text>
                </View>
              </View>
            </View>

            {/* 4. Action Buttons */}
            <View style={styles.actionsRow}>
              <TactilePressable
                onPress={handleBreakAction}
                activeScale={0.96}
                style={[
                  styles.actionButton,
                  isBreak
                    ? [
                        styles.actionButtonResume,
                        {
                          backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#DCFCE7',
                          borderColor: isDark ? 'rgba(16, 185, 129, 0.35)' : '#86EFAC',
                        },
                      ]
                    : [
                        styles.actionButtonBreak,
                        {
                          backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7',
                          borderColor: isDark ? 'rgba(245, 158, 11, 0.35)' : '#FCD34D',
                        },
                      ],
                ]}
                accessibilityRole="button"
                accessibilityLabel={isBreak ? 'Resume Work' : 'Take Break'}
                testID="dynamic-island-break-toggle"
              >
                <Feather
                  name={isBreak ? 'play' : 'coffee'}
                  size={14}
                  color={
                    isBreak
                      ? isDark
                        ? '#34D399'
                        : '#059669'
                      : isDark
                        ? '#FBBF24'
                        : '#D97706'
                  }
                />
                <Text
                  style={[
                    styles.actionButtonText,
                    {
                      color: isBreak
                        ? isDark
                          ? '#34D399'
                          : '#059669'
                        : isDark
                          ? '#FBBF24'
                          : '#D97706',
                    },
                  ]}
                >
                  {isBreak ? 'Resume Work' : 'Take Break'}
                </Text>
              </TactilePressable>

              <TactilePressable
                onPress={handlePunchOutAction}
                activeScale={0.96}
                style={[
                  styles.actionButton,
                  styles.actionButtonPunchOut,
                  {
                    backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FFF1F2',
                    borderColor: isDark ? 'rgba(239, 68, 68, 0.35)' : '#FECDD3',
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Punch Out"
                testID="dynamic-island-punch-out"
              >
                <Feather
                  name="log-out"
                  size={14}
                  color={isDark ? '#F87171' : '#E11D48'}
                />
                <Text
                  style={[
                    styles.actionButtonText,
                    { color: isDark ? '#F87171' : '#E11D48' },
                  ]}
                >
                  Punch Out
                </Text>
              </TactilePressable>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  islandCard: {
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
  },
  collapsedRow: {
    flex: 1,
    justifyContent: 'center',
  },
  collapsedPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  pillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotSmall: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusText: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    letterSpacing: 0.1,
  },
  pillDivider: {
    width: 1,
    height: 14,
    marginHorizontal: 4,
  },
  pillRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillTimerText: {
    fontSize: 12.5,
    fontFamily: FontFamily.headingBold,
    fontVariant: ['tabular-nums'],
  },
  pillMiniPercent: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  pillPercentText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
  },
  expandedContent: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 11,
    paddingBottom: 11,
    justifyContent: 'space-between',
  },
  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerStatusText: {
    fontSize: 13.5,
    fontFamily: FontFamily.headingBold,
  },
  headerLocationText: {
    fontSize: 11.5,
    fontFamily: FontFamily.medium,
  },
  collapseButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 3,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10.5,
    fontFamily: FontFamily.medium,
  },
  metricValuePrimary: {
    fontSize: 13.5,
    fontFamily: FontFamily.headingBold,
    fontVariant: ['tabular-nums'],
  },
  metricValueSecondary: {
    fontSize: 13,
    fontFamily: FontFamily.headingBold,
    fontVariant: ['tabular-nums'],
  },
  metricValueBreak: {
    fontSize: 13,
    fontFamily: FontFamily.headingBold,
    fontVariant: ['tabular-nums'],
  },
  progressContainer: {
    marginVertical: 1,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  progressTargetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressFooterText: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
  },
  hoursTypeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  hoursTypeText: {
    fontSize: 10,
    fontFamily: FontFamily.semiBold,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 1,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionButtonBreak: {},
  actionButtonResume: {},
  actionButtonPunchOut: {},
  actionButtonText: {
    fontSize: 12.5,
    fontFamily: FontFamily.semiBold,
  },
});
