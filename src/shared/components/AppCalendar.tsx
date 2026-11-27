import React from 'react';
import {
  type StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FontFamily, useAppTheme } from '@/shared/theme';

export const APP_CALENDAR_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export type AppCalendarMarker = 'approved' | 'pending' | 'rejected' | null;

export interface AppCalendarDay {
  dayNumber: number;
  dateKey: string;
  isCurrentMonth: boolean;
}

export interface AppCalendarDayState {
  isSelected?: boolean;
  isInRange?: boolean;
  isToday?: boolean;
  marker?: AppCalendarMarker;
}

export interface AppCalendarProps {
  days: AppCalendarDay[];
  getDayState: (day: AppCalendarDay) => AppCalendarDayState;
  onDayPress: (day: AppCalendarDay) => void;
  getDayTestID?: (day: AppCalendarDay) => string | undefined;
  markerVariant?: 'icon' | 'circle';
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  withoutCard?: boolean;
  cardStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

const CIRCLE_MARKER_STYLES: Record<
  Exclude<AppCalendarMarker, null>,
  {
    borderColor: string;
    bgLight: string;
    bgDark: string;
    textLight: string;
    textDark: string;
  }
> = {
  approved: {
    borderColor: '#10B981',
    bgLight: '#ECFDF5',
    bgDark: 'rgba(16, 185, 129, 0.16)',
    textLight: '#059669',
    textDark: '#34D399',
  },
  pending: {
    borderColor: '#EAB308',
    bgLight: '#FEFCE8',
    bgDark: 'rgba(234, 179, 8, 0.16)',
    textLight: '#CA8A04',
    textDark: '#FBBF24',
  },
  rejected: {
    borderColor: '#EF4444',
    bgLight: '#FEF2F2',
    bgDark: 'rgba(239, 68, 68, 0.16)',
    textLight: '#DC2626',
    textDark: '#F87171',
  },
};

export function AppCalendar({
  days,
  getDayState,
  onDayPress,
  getDayTestID,
  markerVariant = 'icon',
  headerContent,
  footerContent,
  withoutCard = false,
  cardStyle,
  testID,
}: AppCalendarProps): React.JSX.Element {
  const { isDark } = useAppTheme();

  const containerStyle: StyleProp<ViewStyle> = withoutCard
    ? cardStyle
    : [
        styles.card,
        isDark ? styles.cardDark : styles.cardLight,
        cardStyle,
      ];

  const weekdayColor = isDark ? '#94A3B8' : '#64748B';
  const dayTextColor = isDark ? '#F8FAFC' : '#0F1E36';

  return (
    <View style={containerStyle} testID={testID}>
      {headerContent}

      <View style={styles.weekdaysRow}>
        {APP_CALENDAR_WEEKDAYS.map((w) => (
          <View key={w} style={styles.weekdaySlot}>
            <Text style={[styles.weekdayText, { color: weekdayColor }]}>{w}</Text>
          </View>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {days.map((day, index) => {
          if (!day.isCurrentMonth) {
            return <View key={day.dateKey || `pad-${index}`} style={styles.daySlot} />;
          }

          const { isSelected, isInRange, isToday, marker } = getDayState(day);

          return (
            <TouchableOpacity
              key={day.dateKey}
              onPress={() => onDayPress(day)}
              activeOpacity={0.7}
              style={styles.daySlot}
              testID={getDayTestID?.(day)}
              accessibilityRole="button"
              accessibilityLabel={`Day ${day.dayNumber}`}
            >
              {isSelected ? (
                <View style={styles.selectedCircle}>
                  <Text style={styles.selectedDayNumberText}>{day.dayNumber}</Text>
                  <Feather
                    name="check"
                    size={12}
                    color="#FFFFFF"
                    style={styles.selectedCheckIcon}
                  />
                </View>
              ) : isInRange ? (
                <View
                  style={[
                    styles.inRangeContainer,
                    isDark ? styles.inRangeDark : styles.inRangeLight,
                  ]}
                >
                  <Text
                    style={[
                      styles.inRangeDayNumberText,
                      { color: isDark ? '#93C5FD' : '#1D4ED8' },
                    ]}
                  >
                    {day.dayNumber}
                  </Text>
                </View>
              ) : (
                (() => {
                  const circleTheme =
                    markerVariant === 'circle' && marker ? CIRCLE_MARKER_STYLES[marker] : null;
                  const resolvedDayTextColor = circleTheme
                    ? isDark
                      ? circleTheme.textDark
                      : circleTheme.textLight
                    : dayTextColor;

                  return (
                    <View
                      style={[
                        styles.unselectedDayContainer,
                        circleTheme
                          ? [
                              styles.statusCircle,
                              {
                                borderColor: circleTheme.borderColor,
                                backgroundColor: isDark ? circleTheme.bgDark : circleTheme.bgLight,
                              },
                            ]
                          : isToday
                            ? [
                                styles.todayOutline,
                                { borderColor: isDark ? '#60A5FA' : '#1D4ED8' },
                              ]
                            : null,
                      ]}
                    >
                      <Text style={[styles.dayNumberText, { color: resolvedDayTextColor }]}>
                        {day.dayNumber}
                      </Text>
                      {markerVariant === 'circle' ? null : marker === 'approved' ? (
                        <Feather
                          name="check"
                          size={11}
                          color="#10B981"
                          style={styles.dayMarkerIcon}
                        />
                      ) : marker === 'pending' ? (
                        <View style={styles.pendingDot} />
                      ) : marker === 'rejected' ? (
                        <Feather
                          name="x"
                          size={11}
                          color="#EF4444"
                          style={styles.dayMarkerIcon}
                        />
                      ) : (
                        <View style={styles.emptyDotPlaceholder} />
                      )}
                    </View>
                  );
                })()
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {footerContent}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 3,
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
  },
  cardDark: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekdaySlot: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  daySlot: {
    width: '14.28%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  unselectedDayContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayOutline: {
    borderWidth: 1.5,
  },
  statusCircle: {
    borderWidth: 1.5,
  },
  dayNumberText: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
  },
  dayMarkerIcon: {
    marginTop: 2,
  },
  pendingDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#F59E0B',
    marginTop: 4,
  },
  emptyDotPlaceholder: {
    height: 5,
    marginTop: 4,
  },
  selectedCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedDayNumberText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  selectedCheckIcon: {
    marginTop: 1,
  },
  inRangeContainer: {
    width: '100%',
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inRangeLight: {
    backgroundColor: '#DBEAFE',
  },
  inRangeDark: {
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
  },
  inRangeDayNumberText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 15,
  },
});
