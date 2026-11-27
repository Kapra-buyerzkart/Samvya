import React, { useRef } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { FontFamily } from '@/shared/theme';
import { DayWorkHours } from '../../domain/types';
import {
  CHART_HEIGHT,
  styles,
  Y_AXIS_LABELS,
} from './MonthlyWorkHoursChart.styles';

export interface MonthlyWorkHoursChartProps {
  dailyRecords: DayWorkHours[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
  isDark?: boolean;
}

export function MonthlyWorkHoursChart({
  dailyRecords,
  selectedDay,
  onSelectDay,
  isDark = false,
}: MonthlyWorkHoursChartProps): React.JSX.Element {
  const scrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  return (
    <View style={styles.container}>
      <View style={styles.plotContainer}>
        <View style={styles.yAxisColumn}>
          {Y_AXIS_LABELS.map((label) => (
            <Text
              key={label}
              style={[styles.yAxisLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}
            >
              {label}
            </Text>
          ))}
        </View>

        <View style={styles.chartWrapper}>
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

          <ScrollView
            ref={scrollRef}
            horizontal
            nestedScrollEnabled
            directionalLockEnabled
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
              const tooltipText = `${item.dayOfWeek}. ${item.hours % 1 === 0 ? `${item.hours}h` : item.formattedHours}`;

              return (
                <Pressable
                  key={item.day}
                  style={styles.barColumn}
                  onPress={() => onSelectDay(item.day)}
                  accessibilityRole="button"
                  accessibilityLabel={`Day ${item.day}, ${item.dayOfWeek}, ${item.hours} hours`}
                >
                  <View style={styles.barTrackArea}>
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

                    {isSelected && (
                      <View
                        style={[
                          styles.tooltipWrapper,
                          { bottom: hasHours ? barHeight + 6 : 30 },
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
                            { borderTopColor: isDark ? '#334155' : '#CBD5E1' },
                          ]}
                        />
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
                          { borderColor: isDark ? '#334155' : '#BFDBFE' },
                          isSelected && styles.barSelectedRing,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.xAxisLabelContainer}>
                    <Text
                      style={[
                        styles.xAxisLabel,
                        {
                          color: item.isHoliday
                            ? '#EF4444'
                            : isSelected
                              ? isDark
                                ? '#60A5FA'
                                : '#1D4ED8'
                              : isDark
                                ? '#94A3B8'
                                : '#475569',
                          fontFamily: isSelected ? FontFamily.headingBold : FontFamily.medium,
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

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendSquare,
              { backgroundColor: isDark ? '#2563EB' : '#1D4ED8' },
            ]}
          />
          <Text style={[styles.legendText, { color: isDark ? '#94A3B8' : '#475569' }]}>
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
          <Text style={[styles.legendText, { color: isDark ? '#94A3B8' : '#475569' }]}>
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
          <Text style={[styles.legendText, { color: isDark ? '#94A3B8' : '#475569' }]}>
            No entry
          </Text>
        </View>
      </View>
    </View>
  );
}
