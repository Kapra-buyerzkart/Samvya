import { TactilePressable } from '@/shared/animations';
import { FontFamily } from '@/shared/theme';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { type WeeklyDayWorkItem } from '../homeData';

export interface WeeklyWorkCardProps {
  isDark: boolean;
  loggedDisplay: string;
  targetHours: number;
  progressPercent: number;
  days: WeeklyDayWorkItem[];
  selectedDayId: string;
  onSelectDay: (dayId: string) => void;
  onOpenEmploymentDetails: () => void;
}

const MAX_DAILY_HOURS = 8;

export function WeeklyWorkCard({
  isDark,
  loggedDisplay,
  targetHours,
  progressPercent,
  days,
  selectedDayId,
  onSelectDay,
  onOpenEmploymentDetails,
}: WeeklyWorkCardProps): React.JSX.Element {
  const selectedDay = days.find((d) => d.id === selectedDayId) ?? days[2] ?? days[0];
  const clampedPercent = Math.min(100, Math.max(0, progressPercent));

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
          borderColor: isDark ? '#1E293B' : '#E7EEFC',
        },
      ]}
      testID="weekly-work-card"
    >
      {/* Header row -> navigates to Employment Details */}
      <TactilePressable
        style={styles.headerRow}
        onPress={onOpenEmploymentDetails}
        activeScale={0.98}
        accessibilityRole="button"
        accessibilityLabel="View employment details and weekly work hours"
        testID="weekly-work-header-btn"
      >
        <View style={styles.titleRow}>
          <Feather name="calendar" size={15} color={isDark ? '#94A3B8' : '#475569'} />
          <Text style={[styles.title, { color: isDark ? '#CBD5E1' : '#334155' }]}>
            Weekly work
          </Text>
        </View>
        <View style={styles.detailsLinkRow}>
          <Text style={[styles.detailsLinkText, { color: isDark ? '#60A5FA' : '#1D4ED8' }]}>
            Details
          </Text>
          <Feather name="chevron-right" size={14} color={isDark ? '#60A5FA' : '#1D4ED8'} />
        </View>
      </TactilePressable>

      {/* Hero logged hours */}
      <View style={styles.metricRow}>
        <Text style={[styles.loggedValue, { color: isDark ? '#F8FAFC' : '#0F1E36' }]}>
          {loggedDisplay}
        </Text>
        <Text style={[styles.targetText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
          {' '}/ {targetHours} hrs
        </Text>
      </View>

      {/* Weekly progress track */}
      <View style={[styles.progressTrack, { backgroundColor: isDark ? '#1E293B' : '#DFE7FC' }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${clampedPercent}%`,
              backgroundColor: isDark ? '#3B82F6' : '#1D4ED8',
            },
          ]}
        />
      </View>

      {/* Selected Day summary row */}
      {selectedDay && (
        <View style={styles.selectedDayRow}>
          <View style={styles.selectedDayLeft}>
            <View style={[styles.selectedDot, { backgroundColor: isDark ? '#60A5FA' : '#1D4ED8' }]} />
            <Text style={[styles.selectedDateText, { color: isDark ? '#CBD5E1' : '#334155' }]}>
              {selectedDay.dateLabel}
            </Text>
          </View>
          <Text style={[styles.selectedHoursText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            {selectedDay.formattedHours}
          </Text>
        </View>
      )}

      {/* Compact Mon-Sun mini daily bars */}
      <View style={styles.barsRow}>
        {days.map((day) => {
          const isSelected = day.id === selectedDay?.id;
          const fillHeight = day.hours > 0 ? Math.max(10, Math.round((day.hours / MAX_DAILY_HOURS) * 44)) : 5;
          const barColor = isSelected
            ? isDark
              ? '#60A5FA'
              : '#1D4ED8'
            : day.hours > 0
              ? isDark
                ? '#334155'
                : '#B6CBF7'
              : isDark
                ? '#1E293B'
                : '#E2E8F0';

          return (
            <TouchableOpacity
              key={day.id}
              style={styles.barCol}
              onPress={() => onSelectDay(day.id)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={`${day.dateLabel}, ${day.formattedHours}`}
              testID={`weekly-bar-${day.id}`}
            >
              <View style={styles.barTrackArea}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: fillHeight,
                      backgroundColor: barColor,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.barLabel,
                  {
                    color: isSelected
                      ? isDark
                        ? '#60A5FA'
                        : '#1D4ED8'
                      : isDark
                        ? '#94A3B8'
                        : '#64748B',
                    fontFamily: isSelected ? FontFamily.semiBold : FontFamily.regular,
                  },
                ]}
              >
                {day.shortLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontFamily: FontFamily.medium,
    fontSize: 13.5,
  },
  detailsLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailsLinkText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  loggedValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 25,
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },
  targetText: {
    fontFamily: FontFamily.regular,
    fontSize: 13.5,
  },
  progressTrack: {
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  selectedDayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  selectedDayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  selectedDateText: {
    fontFamily: FontFamily.medium,
    fontSize: 12.5,
  },
  selectedHoursText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(148, 163, 184, 0.25)',
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  barTrackArea: {
    height: 46,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 5,
  },
  barFill: {
    width: 14,
    borderRadius: 5,
  },
  barLabel: {
    fontSize: 11,
  },
});
