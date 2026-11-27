import React, { useEffect, useRef, useState } from 'react';
import { type LayoutChangeEvent, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  getActiveSegmentPillStyle,
  getSegmentedContainerStyle,
  getSegmentTabStyle,
  getSegmentTabTextStyle,
  styles,
} from '../LeaveStatusScreen.styles';
import { type LeaveTypeKey, type LeaveTypeTab } from '../useLeaveStatusScreen';

export interface LeaveTypeSegmentedBarProps {
  tabs: LeaveTypeTab[];
  selectedLeaveType: LeaveTypeKey;
  isDark: boolean;
  onSelectLeaveType: (type: LeaveTypeKey) => void;
}

const PILL_SPRING_CONFIG = {
  damping: 19,
  stiffness: 210,
  mass: 0.78,
} as const;

export const LeaveTypeSegmentedBar = React.memo(function LeaveTypeSegmentedBar({
  tabs,
  selectedLeaveType,
  isDark,
  onSelectLeaveType,
}: LeaveTypeSegmentedBarProps): React.JSX.Element {
  const reducedMotion = useReducedMotion();
  const [tabWidth, setTabWidth] = useState(0);

  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.key === selectedLeaveType),
  );
  const hasMeasuredTrackRef = useRef(false);
  const pillX = useSharedValue(0);

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    const measuredWidth = event.nativeEvent.layout.width;
    if (measuredWidth <= 0 || tabs.length === 0) return;

    const nextTabWidth = measuredWidth / tabs.length;
    setTabWidth(nextTabWidth);

    if (!hasMeasuredTrackRef.current) {
      hasMeasuredTrackRef.current = true;
      pillX.value = activeIndex * nextTabWidth;
    }
  };

  useEffect(() => {
    if (tabWidth <= 0) return;
    const targetX = activeIndex * tabWidth;

    if (!hasMeasuredTrackRef.current) {
      hasMeasuredTrackRef.current = true;
      pillX.value = targetX;
      return;
    }

    if (reducedMotion) {
      pillX.value = withTiming(targetX, { duration: 150 });
    } else {
      pillX.value = withSpring(targetX, PILL_SPRING_CONFIG);
    }
  }, [activeIndex, tabWidth, reducedMotion, pillX]);

  const pillAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ translateX: pillX.value }],
    };
  });

  return (
    <View style={getSegmentedContainerStyle(isDark)} testID="leave-type-segmented-bar">
      <View
        style={styles.segmentedTrack}
        onLayout={handleTrackLayout}
        testID="leave-type-segmented-track"
      >
        {tabWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            testID="leave-type-active-pill"
            style={[getActiveSegmentPillStyle(isDark, tabWidth), pillAnimatedStyle]}
          />
        ) : null}

        {tabs.map((tab) => {
          const isActive = selectedLeaveType === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onSelectLeaveType(tab.key)}
              activeOpacity={0.8}
              style={getSegmentTabStyle(isDark, isActive && tabWidth === 0)}
              testID={`leave-type-tab-${tab.key}`}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={getSegmentTabTextStyle(isDark, isActive)} numberOfLines={1}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});
