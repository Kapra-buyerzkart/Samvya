import React, { useRef } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FontFamily } from '@/shared/theme';
import { DayWorkHours } from '../domain/types';

interface MonthlyWorkHoursChartProps {
  dailyRecords: DayWorkHours[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
  isDark?: boolean;
}

const CHART_HEIGHT = 130;
const Y_AXIS_LABELS = ['8h', '6h', '4h', '2h', '0h'];
const BAR_WIDTH = 13;
const COLUMN_WIDTH = 26;

export function MonthlyWorkHoursChart({
  dailyRecords,
  selectedDay,
  onSelectDay,
  isDark = false,
}: MonthlyWorkHoursChartProps): React.JSX.Element {
  const scrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  return (
    <View style={styles.container}>
      {/* Chart Plot Area with Y-axis */}
      <View style={styles.plotContainer}>
        {/* Left Y-Axis labels */}
        <View style={styles.yAxisColumn}>
          {Y_AXIS_LABELS.map((label) => (
            <Text
              key={label}
              style={[
                styles.yAxisLabel,
                { color: isDark ? '#94A3B8' : '#64748B' },
              ]}
            >
              {label}
            </Text>
          ))}
        </View>

        {/* Scrollable Bar Grid Area */}
        <View style={styles.chartWrapper}>
          {/* Horizontal dotted gridlines */}
          <View style={styles.gridlinesLayer} pointerEvents="none">
            {Y_AXIS_LABELS.map((label, index) => (
              <View
                key={label}
                style={[
                  styles.gridline,
                  {
                    top: (index * CHART_HEIGHT) / (Y_AXIS_LABELS.length - 1),
                    borderColor: isDark ? '#1E293B' : '#E2E8F0',
                  },
                ]}
              />
            ))}
          </View>

          {/* Horizontally scrollable bars */}
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {dailyRecords.map((item) => {
              const isSelected = item.day === selectedDay;
              const hasHours = item.hours > 0;
              const barHeight = Math.min(
                Math.max((item.hours / 8) * CHART_HEIGHT, 0),
                CHART_HEIGHT,
              );
              const isRecorded = item.status === 'recorded';

              // Format text for tooltip
              const tooltipText = `${item.dayOfWeek}. ${item.hours % 1 === 0 ? `${item.hours}h` : item.formattedHours}`;

              return (
                <Pressable
                  key={item.day}
                  style={styles.barColumn}
                  onPress={() => onSelectDay(item.day)}
                  accessibilityRole="button"
                  accessibilityLabel={`Day ${item.day}, ${item.dayOfWeek}, ${item.hours} hours`}
                >
                  {/* Bar and Markers Container */}
                  <View style={styles.barTrackArea}>
                    {/* "Today" Marker */}
                    {item.isToday && (
                      <View style={styles.todayMarkerContainer} pointerEvents="none">
                        <View
                          style={[
                            styles.todayBadge,
                            {
                              backgroundColor: isDark ? '#1E293B' : '#DBEAFE',
                              borderColor: isDark ? '#3B82F6' : '#93C5FD',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.todayBadgeText,
                              { color: isDark ? '#60A5FA' : '#1D4ED8' },
                            ]}
                          >
                            Today
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.todayDashedLine,
                            { borderColor: isDark ? '#3B82F6' : '#2563EB' },
                          ]}
                        />
                        <View
                          style={[
                            styles.todayBaseDot,
                            { backgroundColor: isDark ? '#3B82F6' : '#2563EB' },
                          ]}
                        />
                      </View>
                    )}

                    {/* Active Selected Tooltip */}
                    {isSelected && (
                      <View
                        style={[
                          styles.tooltipWrapper,
                          {
                            bottom: hasHours ? barHeight + 6 : 30,
                          },
                        ]}
                        pointerEvents="none"
                      >
                        <View
                          style={[
                            styles.tooltipBubble,
                            {
                              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                              borderColor: isDark ? '#334155' : '#CBD5E1',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.tooltipText,
                              { color: isDark ? '#F8FAFC' : '#0F172A' },
                            ]}
                            numberOfLines={1}
                          >
                            {tooltipText}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tooltipPointer,
                            {
                              borderTopColor: isDark ? '#334155' : '#CBD5E1',
                            },
                          ]}
                        />
                        {/* Anchor Dot on top of the bar */}
                        {hasHours && (
                          <View
                            style={[
                              styles.anchorDot,
                              {
                                borderColor: isDark ? '#3B82F6' : '#1D4ED8',
                                backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                              },
                            ]}
                          />
                        )}
                      </View>
                    )}

                    {/* The Bar */}
                    {hasHours ? (
                      <View
                        style={[
                          styles.solidBar,
                          {
                            height: Math.max(barHeight, 10),
                            backgroundColor: isRecorded
                              ? isDark
                                ? '#2563EB'
                                : '#1D4ED8'
                              : isDark
                                ? '#3B82F6'
                                : '#4F85EB',
                          },
                          isSelected && styles.barSelectedRing,
                        ]}
                      />
                    ) : (
                      <View
                        style={[
                          styles.noEntryBar,
                          {
                            borderColor: isDark ? '#334155' : '#BFDBFE',
                          },
                          isSelected && styles.barSelectedRing,
                        ]}
                      />
                    )}
                  </View>

                  {/* X-Axis Day Number */}
                  <View style={styles.xAxisLabelContainer}>
                    <Text
                      style={[
                        styles.xAxisLabel,
                        {
                          color: item.isHoliday
                            ? '#EF4444' // Red holiday/leave indicator from design
                            : isSelected
                              ? isDark
                                ? '#60A5FA'
                                : '#1D4ED8'
                              : isDark
                                ? '#94A3B8'
                                : '#475569',
                          fontFamily: isSelected
                            ? FontFamily.headingBold
                            : FontFamily.medium,
                        },
                      ]}
                    >
                      {item.day}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Chart Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendSquare,
              { backgroundColor: isDark ? '#2563EB' : '#1D4ED8' },
            ]}
          />
          <Text
            style={[
              styles.legendText,
              { color: isDark ? '#94A3B8' : '#475569' },
            ]}
          >
            Recorded
          </Text>
        </View>

        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendSquare,
              { backgroundColor: isDark ? '#3B82F6' : '#4F85EB' },
            ]}
          />
          <Text
            style={[
              styles.legendText,
              { color: isDark ? '#94A3B8' : '#475569' },
            ]}
          >
            Lesser than 8h
          </Text>
        </View>

        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDashedSquare,
              { borderColor: isDark ? '#475569' : '#93C5FD' },
            ]}
          />
          <Text
            style={[
              styles.legendText,
              { color: isDark ? '#94A3B8' : '#475569' },
            ]}
          >
            No entry
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 12,
  },
  plotContainer: {
    flexDirection: 'row',
    height: CHART_HEIGHT + 48,
    position: 'relative',
  },
  yAxisColumn: {
    width: 26,
    height: CHART_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 2,
  },
  yAxisLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    lineHeight: 12,
  },
  chartWrapper: {
    flex: 1,
    position: 'relative',
    height: CHART_HEIGHT + 36,
  },
  gridlinesLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: CHART_HEIGHT,
  },
  gridline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderWidth: 0.5,
    borderStyle: 'dashed',
  },
  scrollContent: {
    paddingHorizontal: 4,
    alignItems: 'flex-end',
    height: CHART_HEIGHT + 36,
  },
  barColumn: {
    width: COLUMN_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: CHART_HEIGHT + 36,
  },
  barTrackArea: {
    height: CHART_HEIGHT,
    width: COLUMN_WIDTH,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  solidBar: {
    width: BAR_WIDTH,
    borderRadius: 7,
  },
  noEntryBar: {
    width: BAR_WIDTH,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  barSelectedRing: {
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  xAxisLabelContainer: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  xAxisLabel: {
    fontSize: 12,
  },
  tooltipWrapper: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 20,
    width: 80,
  },
  tooltipBubble: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  tooltipText: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 11,
  },
  tooltipPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  anchorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 1.5,
    marginTop: 2,
  },
  todayMarkerContainer: {
    position: 'absolute',
    top: -24,
    bottom: 0,
    alignItems: 'center',
    zIndex: 10,
    width: COLUMN_WIDTH,
  },
  todayBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  todayBadgeText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 9,
    letterSpacing: 0.2,
  },
  todayDashedLine: {
    flex: 1,
    width: 1,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    marginVertical: 2,
  },
  todayBaseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 1,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'transparent',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendSquare: {
    width: 13,
    height: 13,
    borderRadius: 3,
  },
  legendDashedSquare: {
    width: 13,
    height: 13,
    borderRadius: 3,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  legendText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
  },
});
