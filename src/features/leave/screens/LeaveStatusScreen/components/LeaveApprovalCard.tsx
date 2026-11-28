import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { GlassCard } from '@/shared/components';
import {
  getApprovalCardStyle,
  getBlueAccentBarStyle,
  getEmptyTimelineTextStyle,
  getOutcomeIconBadgeStyle,
  getRecordDividerStyle,
  getRequestedIconBadgeStyle,
  getStatusCardSubtitleStyle,
  getStatusCardTitleStyle,
  getTimelineActionLabelStyle,
  getTimelineDateTextStyle,
  getTimelineEditTextStyle,
  getTimelineInlineLineStyle,
  getTimelineStepLabelStyle,
  getVerticalConnectorLineStyle,
  styles,
} from '../LeaveStatusScreen.styles';
import { type LeaveRecord, type LeaveTypeKey } from '../useLeaveStatusScreen';

export interface LeaveApprovalCardProps {
  records: LeaveRecord[];
  selectedLeaveType: LeaveTypeKey;
  selectedDateLabel?: string | null;
  isDark: boolean;
  onEditRecord?: (record: LeaveRecord) => void;
}

const PAGE_SIZE = 10;

const TAB_INDEX_MAP: Record<LeaveTypeKey, number> = {
  casual: 0,
  sick: 1,
  earned: 2,
};

const TIMELINE_TIMING_CONFIG = {
  duration: 280,
  easing: Easing.bezier(0.22, 1, 0.36, 1),
} as const;

export const LeaveApprovalCard = React.memo(function LeaveApprovalCard({
  records,
  selectedLeaveType,
  selectedDateLabel,
  isDark,
  onEditRecord,
}: LeaveApprovalCardProps): React.JSX.Element {
  const reducedMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const tabIndex = TAB_INDEX_MAP[selectedLeaveType];
  const prevTabIndexRef = useRef(tabIndex);
  const prevRecordsRef = useRef(records);

  const slideDir = useSharedValue(0);
  const progress = useSharedValue(1);

  useEffect(() => {
    const recordsChanged = prevRecordsRef.current !== records;
    const prevTab = prevTabIndexRef.current;

    if (!recordsChanged && prevTab === tabIndex) {
      return;
    }

    const dir = tabIndex === prevTab ? 0 : tabIndex > prevTab ? 1 : -1;
    prevTabIndexRef.current = tabIndex;
    prevRecordsRef.current = records;

    slideDir.value = reducedMotion ? 0 : dir;
    progress.value = 0;
    progress.value = withTiming(1, TIMELINE_TIMING_CONFIG);
  }, [records, tabIndex, reducedMotion, slideDir, progress]);

  const listAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const p = progress.value;
    const translateX = slideDir.value * 14 * (1 - p);
    const translateY = slideDir.value === 0 ? 6 * (1 - p) : 0;
    return {
      opacity: 0.15 + 0.85 * p,
      transform: [{ translateX }, { translateY }],
    };
  });

  return (
    <GlassCard
      intensity={20}
      tint={isDark ? 'dark' : 'light'}
      style={getApprovalCardStyle(isDark)}
    >
      <Text style={getStatusCardTitleStyle(isDark)}>Approval status</Text>
      <Text style={getStatusCardSubtitleStyle(isDark)}>
        {selectedDateLabel
          ? `Showing leaves on ${selectedDateLabel}`
          : 'Approved, pending & rejected leaves status'}
      </Text>

      <View style={getBlueAccentBarStyle(isDark)} />

      <Animated.View style={[styles.timelineList, listAnimatedStyle]}>
        {records.length === 0 ? (
          <Text style={getEmptyTimelineTextStyle(isDark)} testID="approval-empty-state">
            No leave approval records for this filter.
          </Text>
        ) : (
          records.slice(0, visibleCount).map((record, index) => (
            <View key={record.id}>
              {index > 0 && <View style={getRecordDividerStyle(isDark)} />}

              {/* Step 1: Requested */}
              <View style={styles.timelineStepRow}>
                <View style={getRequestedIconBadgeStyle(isDark)}>
                  <Feather
                    name="file-text"
                    size={15}
                    color={isDark ? '#60A5FA' : '#1E3A8A'}
                  />
                </View>
                <View style={styles.timelineStepContent}>
                  <View style={styles.timelineStepHeader}>
                    <Text style={getTimelineStepLabelStyle(isDark)}>Requested</Text>
                    <TouchableOpacity
                      onPress={() => onEditRecord?.(record)}
                      style={styles.timelineEditBtn}
                      activeOpacity={0.7}
                      testID={`edit-leave-request-${record.id}`}
                      accessibilityRole="button"
                      accessibilityLabel={`Edit leave request ${record.requestDate}`}
                    >
                      <Text style={getTimelineEditTextStyle(isDark)}>Edit</Text>
                      <Feather
                        name="chevron-right"
                        size={14}
                        color={isDark ? '#60A5FA' : '#2563EB'}
                      />
                    </TouchableOpacity>
                    <Text style={getTimelineDateTextStyle(isDark)}>{record.requestDate}</Text>
                  </View>
                  <View style={getTimelineInlineLineStyle(isDark)} />
                </View>
              </View>

              {/* Vertical Connector Line */}
              <View style={getVerticalConnectorLineStyle(isDark)} />

              {/* Step 2: Approved / Pending / Rejected */}
              <View style={styles.timelineActionRow}>
                <View style={getOutcomeIconBadgeStyle(isDark, record.status)}>
                  <Feather
                    name={
                      record.status === 'approved'
                        ? 'check'
                        : record.status === 'pending'
                          ? 'clock'
                          : 'x'
                    }
                    size={15}
                    color={
                      record.status === 'approved'
                        ? '#10B981'
                        : record.status === 'pending'
                          ? isDark
                            ? '#FBBF24'
                            : '#D97706'
                          : '#EF4444'
                    }
                  />
                </View>
                <Text style={getTimelineActionLabelStyle(isDark, record.status)}>
                  {record.status === 'approved'
                    ? 'Approved'
                    : record.status === 'pending'
                      ? 'Pending approval'
                      : 'Rejected'}
                </Text>
                <Text style={getTimelineDateTextStyle(isDark)}>{record.actionDate}</Text>
              </View>
            </View>
          ))
        )}
        {records.length > visibleCount ? (
          <TouchableOpacity
            onPress={() => setVisibleCount((c) => c + PAGE_SIZE)}
            activeOpacity={0.75}
            testID="approval-load-more-btn"
            style={{
              marginTop: 12,
              paddingVertical: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: isDark ? '#334155' : '#CBD5E1',
              alignItems: 'center',
            }}
          >
            <Text style={getTimelineEditTextStyle(isDark)}>
              Load more ({records.length - visibleCount} remaining)
            </Text>
          </TouchableOpacity>
        ) : null}
      </Animated.View>
    </GlassCard>
  );
});
