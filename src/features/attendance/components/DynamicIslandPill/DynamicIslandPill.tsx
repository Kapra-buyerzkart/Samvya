import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { TactilePressable } from '@/shared/animations';
import {
  getActionBreakColor,
  getActionBreakStyle,
  getActionPunchOutColor,
  getActionPunchOutStyle,
  getCollapseButtonStyle,
  getHeaderLocationTextStyle,
  getHeaderStatusTextStyle,
  getHoursTypeBadgeStyle,
  getHoursTypeTextStyle,
  getIslandCardStyle,
  getMetricCardStyle,
  getMetricLabelStyle,
  getMetricValueBreakStyle,
  getMetricValuePrimaryStyle,
  getMetricValueSecondaryStyle,
  getPillDividerStyle,
  getPillMiniPercentStyle,
  getPillPercentTextStyle,
  getPillTimerTextStyle,
  getProgressColors,
  getProgressFooterTextStyle,
  getProgressTrackStyle,
  getStatusTextStyle,
  styles,
} from './DynamicIslandPill.styles';
import { type DynamicIslandPillProps, useDynamicIslandPill } from './useDynamicIslandPill';

export type { DynamicIslandPillProps };

export function DynamicIslandPill({
  forceVisible = false,
}: DynamicIslandPillProps): React.JSX.Element | null {
  const {
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
  } = useDynamicIslandPill(forceVisible);

  if (!shouldRender) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={[styles.outerContainer, { top: topOffset }]}
      testID="dynamic-island-container"
    >
      {isExpanded && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={collapse}
          testID="dynamic-island-backdrop"
        />
      )}

      <Animated.View
        style={[styles.islandCard, getIslandCardStyle(isDark), containerAnimatedStyle]}
      >
        <BlurView
          intensity={Platform.OS === 'ios' ? (isDark ? 80 : 70) : 0}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />

        {!isExpanded ? (
          <Animated.View style={[styles.collapsedRow, collapsedOpacityStyle]}>
            <TactilePressable
              style={styles.collapsedPressable}
              onPress={toggleExpand}
              activeScale={0.96}
              accessibilityRole="button"
              accessibilityLabel={`Dynamic Island: ${statusLabel}, ${timer.workedDisplay}`}
              testID="dynamic-island-pill"
            >
              <View style={styles.pillLeft}>
                <Animated.View
                  style={[styles.statusDot, { backgroundColor: statusColor }, pulseDotStyle]}
                />
                <Text style={[styles.statusText, getStatusTextStyle(isDark)]}>
                  {statusLabel}
                </Text>
              </View>

              <View style={[styles.pillDivider, getPillDividerStyle(isDark)]} />

              <View style={styles.pillRight}>
                <Text style={[styles.pillTimerText, getPillTimerTextStyle(isDark, isBreak)]}>
                  {isBreak
                    ? timer.breakDisplay
                    : `${timer.workedHours}h ${timer.workedMinutes < 10 ? '0' : ''}${timer.workedMinutes}m`}
                </Text>
                <View style={[styles.pillMiniPercent, getPillMiniPercentStyle(isDark, isBreak)]}>
                  <Text style={[styles.pillPercentText, getPillPercentTextStyle(isDark, isBreak)]}>
                    {percentNumber}%
                  </Text>
                </View>
              </View>
            </TactilePressable>
          </Animated.View>
        ) : (
          <Animated.View
            style={[styles.expandedContent, expandedOpacityStyle]}
            testID="dynamic-island-expanded"
          >
            <View style={styles.expandedHeader}>
              <View style={styles.headerBadge}>
                <Animated.View
                  style={[styles.statusDotSmall, { backgroundColor: statusColor }, pulseDotStyle]}
                />
                <Text style={[styles.headerStatusText, getHeaderStatusTextStyle(isDark)]}>
                  {isBreak ? 'Break in Progress' : 'Active Shift'}
                </Text>
                <Text style={[styles.headerLocationText, getHeaderLocationTextStyle(isDark)]}>
                  • {timer.workLocation || timer.shiftState?.workLocation || 'Office'}
                </Text>
              </View>

              <TactilePressable
                onPress={collapse}
                hitSlop={8}
                activeScale={0.9}
                style={[styles.collapseButton, getCollapseButtonStyle(isDark)]}
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

            <View style={styles.metricsRow}>
              <View style={[styles.metricCard, getMetricCardStyle(isDark)]}>
                <View style={styles.metricLabelRow}>
                  <Feather name="clock" size={10} color={isDark ? '#60A5FA' : '#2563EB'} />
                  <Text style={[styles.metricLabel, getMetricLabelStyle(isDark)]}>
                    Time Logged
                  </Text>
                </View>
                <Text style={[styles.metricValuePrimary, getMetricValuePrimaryStyle(isDark)]}>
                  {timer.workedDisplay}
                </Text>
              </View>

              <View style={[styles.metricCard, getMetricCardStyle(isDark)]}>
                <View style={styles.metricLabelRow}>
                  <Feather name="compass" size={10} color={isDark ? '#94A3B8' : '#475569'} />
                  <Text style={[styles.metricLabel, getMetricLabelStyle(isDark)]}>
                    Remaining
                  </Text>
                </View>
                <Text style={[styles.metricValueSecondary, getMetricValueSecondaryStyle(isDark)]}>
                  {timer.remainingDisplay}
                </Text>
              </View>

              <View style={[styles.metricCard, getMetricCardStyle(isDark)]}>
                <View style={styles.metricLabelRow}>
                  <Feather name="coffee" size={10} color={isDark ? '#FBBF24' : '#D97706'} />
                  <Text style={[styles.metricLabel, getMetricLabelStyle(isDark)]}>
                    Total Break
                  </Text>
                </View>
                <Text style={[styles.metricValueBreak, getMetricValueBreakStyle(isDark)]}>
                  {timer.breakDisplay}
                </Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={[styles.progressTrack, getProgressTrackStyle(isDark)]}>
                <LinearGradient
                  colors={getProgressColors(isDark, isBreak)}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBarFill, { width: `${Math.max(5, percentNumber)}%` }]}
                />
              </View>
              <View style={styles.progressFooter}>
                <View style={styles.progressTargetLeft}>
                  <Feather name="target" size={11} color={isDark ? '#60A5FA' : '#2563EB'} />
                  <Text style={[styles.progressFooterText, getProgressFooterTextStyle(isDark)]}>
                    {percentNumber}% of 8-hour shift target
                  </Text>
                </View>
                <View style={[styles.hoursTypeBadge, getHoursTypeBadgeStyle(isDark)]}>
                  <Text style={[styles.hoursTypeText, getHoursTypeTextStyle(isDark)]}>
                    {timer.shiftState.hoursType} Hours
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <TactilePressable
                onPress={handleBreakAction}
                activeScale={0.96}
                style={[
                  styles.actionButton,
                  isBreak ? styles.actionButtonResume : styles.actionButtonBreak,
                  getActionBreakStyle(isDark, isBreak),
                ]}
                accessibilityRole="button"
                accessibilityLabel={isBreak ? 'Resume Work' : 'Take Break'}
                testID="dynamic-island-break-toggle"
              >
                <Feather
                  name={isBreak ? 'play' : 'coffee'}
                  size={14}
                  color={getActionBreakColor(isDark, isBreak)}
                />
                <Text
                  style={[
                    styles.actionButtonText,
                    { color: getActionBreakColor(isDark, isBreak) },
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
                  getActionPunchOutStyle(isDark),
                ]}
                accessibilityRole="button"
                accessibilityLabel="Punch Out"
                testID="dynamic-island-punch-out"
              >
                <Feather name="log-out" size={14} color={getActionPunchOutColor(isDark)} />
                <Text
                  style={[
                    styles.actionButtonText,
                    { color: getActionPunchOutColor(isDark) },
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
