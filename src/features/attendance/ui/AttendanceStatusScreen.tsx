import { GlassCard, KeyboardAvoidingScrollView } from '@/shared/components';
import { FontFamily, useAppTheme } from '@/shared/theme';
import { Feather } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CalendarDay {
  dayNumber: number;
  dateKey: string; // YYYY-MM-DD
  isCurrentMonth: boolean;
}

interface DayPunchInfo {
  status: 'approved' | 'pending';
  punchInTime: string;
  punchInPeriod: string;
  punchOutTime: string;
  punchOutPeriod: string;
  subtitle: string;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Predefined attendance record mapping for November 2026
const ATTENDANCE_DATA: Record<number, DayPunchInfo> = {
  19: {
    status: 'approved',
    punchInTime: '09:02 AM',
    punchInPeriod: 'Morning',
    punchOutTime: '05:34 PM',
    punchOutPeriod: 'Evening',
    subtitle: 'Selfies recorded · IST',
  },
  18: {
    status: 'approved',
    punchInTime: '09:05 AM',
    punchInPeriod: 'Morning',
    punchOutTime: '05:30 PM',
    punchOutPeriod: 'Evening',
    subtitle: 'Selfies recorded · IST',
  },
  17: {
    status: 'approved',
    punchInTime: '08:58 AM',
    punchInPeriod: 'Morning',
    punchOutTime: '05:35 PM',
    punchOutPeriod: 'Evening',
    subtitle: 'Selfies recorded · IST',
  },
  16: {
    status: 'approved',
    punchInTime: '09:12 AM',
    punchInPeriod: 'Morning',
    punchOutTime: '05:40 PM',
    punchOutPeriod: 'Evening',
    subtitle: 'Selfies recorded · IST',
  },
  13: {
    status: 'pending',
    punchInTime: '09:30 AM',
    punchInPeriod: 'Morning',
    punchOutTime: '06:15 PM',
    punchOutPeriod: 'Evening',
    subtitle: 'Selfies recorded · IST',
  },
};

export function AttendanceStatusScreen(): React.JSX.Element {
  const theme = useAppTheme();
  const isDark = theme.isDark;

  // Month navigation: default to November 2026 (month index 10)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10);
  const [selectedDay, setSelectedDay] = useState(19);

  const handlePrevMonth = (): void => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = (): void => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(1);
  };

  const handleBack = (): void => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)');
    }
  };

  // Build calendar matrix dynamically
  const calendarDays = useMemo<CalendarDay[]>(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days: CalendarDay[] = [];

    // Empty lead slots before first day
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({
        dayNumber: 0,
        dateKey: `pad-${i}`,
        isCurrentMonth: false,
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const padM = String(currentMonth + 1).padStart(2, '0');
      const padD = String(d).padStart(2, '0');
      days.push({
        dayNumber: d,
        dateKey: `${currentYear}-${padM}-${padD}`,
        isCurrentMonth: true,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Selected day punch details
  const selectedPunchInfo = useMemo<DayPunchInfo>(() => {
    if (currentMonth === 10 && currentYear === 2026 && ATTENDANCE_DATA[selectedDay]) {
      return ATTENDANCE_DATA[selectedDay];
    }

    // Fallback for weekdays vs weekends
    const d = new Date(currentYear, currentMonth, selectedDay);
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (isWeekend) {
      return {
        status: 'approved',
        punchInTime: '—',
        punchInPeriod: 'Weekend',
        punchOutTime: '—',
        punchOutPeriod: 'Rest day',
        subtitle: 'Scheduled off day',
      };
    }

    return {
      status: 'approved',
      punchInTime: '09:00 AM',
      punchInPeriod: 'Morning',
      punchOutTime: '05:30 PM',
      punchOutPeriod: 'Evening',
      subtitle: 'Selfies recorded · IST',
    };
  }, [currentYear, currentMonth, selectedDay]);

  // Format header date string: e.g. "Thu, 19 Nov 2026"
  const formattedSelectedDate = useMemo(() => {
    const d = new Date(currentYear, currentMonth, selectedDay);
    const weekday = WEEKDAY_NAMES[d.getDay()] ?? 'Thu';
    const monthShort = (MONTH_NAMES[currentMonth] ?? 'Nov').slice(0, 3);
    return `${weekday}, ${selectedDay} ${monthShort} ${currentYear}`;
  }, [currentYear, currentMonth, selectedDay]);

  return (
    <ImageBackground
      source={require('../../../../assets/images/background.png')}
      style={[styles.backgroundImage, { backgroundColor: isDark ? '#020617' : '#F8FAFC' }]}
      imageStyle={{ opacity: isDark ? 0.05 : 1 }}
      contentFit="cover"
    >
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: isDark ? '#020617' : 'transparent' }]}
        edges={['top', 'bottom']}
      >
        <KeyboardAvoidingScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
              testID="attendance-status-back-btn"
              accessibilityRole="button"
              accessibilityLabel="Attendance status back"
            >
              <Feather name="chevron-left" size={24} color={isDark ? '#F8FAFC' : '#0F172A'} />
              <Text style={[styles.headerTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Attendance status
              </Text>
            </TouchableOpacity>
          </View>

          {/* 2. Month & Year Navigation Row */}
          <View style={styles.monthHeaderRow}>
            <Text
              style={[styles.monthTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
              testID="current-month-label"
            >
              {MONTH_NAMES[currentMonth]} {currentYear}
            </Text>

            <View style={styles.monthNavButtons}>
              <TouchableOpacity
                onPress={handlePrevMonth}
                style={[
                  styles.navChevronBtn,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                  },
                ]}
                activeOpacity={0.7}
                testID="prev-month-btn"
                accessibilityRole="button"
                accessibilityLabel="Previous month"
              >
                <Feather name="chevron-left" size={18} color={isDark ? '#F8FAFC' : '#0F172A'} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNextMonth}
                style={[
                  styles.navChevronBtn,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                  },
                ]}
                activeOpacity={0.7}
                testID="next-month-btn"
                accessibilityRole="button"
                accessibilityLabel="Next month"
              >
                <Feather name="chevron-right" size={18} color={isDark ? '#F8FAFC' : '#0F172A'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. Calendar Card */}
          <GlassCard
            intensity={20}
            tint={isDark ? 'dark' : 'light'}
            style={[
              styles.card,
              isDark && {
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                borderColor: 'rgba(51, 65, 85, 0.8)',
              },
            ]}
          >
            {/* Weekday Names Header */}
            <View style={styles.weekdaysRow}>
              {WEEKDAY_NAMES.map((w) => (
                <View key={w} style={styles.weekdaySlot}>
                  <Text style={[styles.weekdayText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    {w}
                  </Text>
                </View>
              ))}
            </View>

            {/* Days Grid */}
            <View style={styles.daysGrid}>
              {calendarDays.map((day) => {
                if (!day.isCurrentMonth) {
                  return <View key={day.dateKey} style={styles.daySlot} />;
                }

                const isSelected = selectedDay === day.dayNumber;
                const hasPending =
                  currentMonth === 10 && currentYear === 2026 && day.dayNumber === 13;
                const hasApproved =
                  currentMonth === 10 &&
                  currentYear === 2026 &&
                  (day.dayNumber === 16 ||
                    day.dayNumber === 17 ||
                    day.dayNumber === 18 ||
                    day.dayNumber === 19);

                return (
                  <TouchableOpacity
                    key={day.dateKey}
                    onPress={() => setSelectedDay(day.dayNumber)}
                    activeOpacity={0.7}
                    style={styles.daySlot}
                    testID={`attendance-day-${day.dayNumber}`}
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
                    ) : (
                      <View style={styles.unselectedDayContainer}>
                        <Text
                          style={[styles.dayNumberText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                        >
                          {day.dayNumber}
                        </Text>
                        {hasApproved ? (
                          <Feather
                            name="check"
                            size={11}
                            color="#10B981"
                            style={styles.dayMarkerIcon}
                          />
                        ) : hasPending ? (
                          <View style={styles.pendingDot} />
                        ) : (
                          <View style={styles.emptyDotPlaceholder} />
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Calendar Legend */}
            <View style={[styles.legendRow, { borderTopColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
              <View style={styles.legendItem}>
                <Feather name="check" size={14} color="#10B981" />
                <Text style={[styles.legendText, { color: isDark ? '#94A3B8' : '#475569' }]}>
                  Approved
                </Text>
              </View>

              <View style={styles.legendItem}>
                <View style={styles.pendingLegendDot} />
                <Text style={[styles.legendText, { color: isDark ? '#94A3B8' : '#475569' }]}>
                  Pending review
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* 4. Selected Day Attendance Card (Punch In / Punch Out Status) */}
          <GlassCard
            intensity={20}
            tint={isDark ? 'dark' : 'light'}
            style={[
              styles.card,
              isDark && {
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                borderColor: 'rgba(51, 65, 85, 0.8)',
              },
            ]}
          >
            {/* Top Row: Date and Status Badge */}
            <View style={styles.punchCardHeader}>
              <View style={styles.dateCol}>
                <Text
                  style={[styles.punchCardDate, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                  testID="selected-day-title"
                >
                  {formattedSelectedDate}
                </Text>
                <Text style={[styles.punchCardSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  {selectedPunchInfo.subtitle}
                </Text>
              </View>

              <View style={styles.statusBadge}>
                {selectedPunchInfo.status === 'approved' ? (
                  <>
                    <Feather name="check" size={14} color="#059669" />
                    <Text style={styles.approvedStatusText}>Approved</Text>
                  </>
                ) : (
                  <>
                    <View style={styles.pendingBadgeDot} />
                    <Text style={styles.pendingStatusText}>Pending review</Text>
                  </>
                )}
              </View>
            </View>

            {/* Punch-in Row */}
            <View style={styles.punchItemRow}>
              <View
                style={[
                  styles.punchIconBox,
                  { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
                ]}
              >
                <Feather name="sunrise" size={22} color={isDark ? '#F8FAFC' : '#0F172A'} />
              </View>
              <View style={styles.punchInfoCol}>
                <Text style={[styles.punchTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  Punch-in
                </Text>
                <Text style={[styles.punchPeriod, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  {selectedPunchInfo.punchInPeriod}
                </Text>
              </View>
              <Text
                style={[styles.punchTime, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                testID="punch-in-time"
              >
                {selectedPunchInfo.punchInTime}
              </Text>
            </View>

            {/* Punch-out Row */}
            <View style={styles.punchItemRow}>
              <View
                style={[
                  styles.punchIconBox,
                  { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
                ]}
              >
                <Feather name="moon" size={22} color={isDark ? '#F8FAFC' : '#0F172A'} />
              </View>
              <View style={styles.punchInfoCol}>
                <Text style={[styles.punchTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  Punch-out
                </Text>
                <Text style={[styles.punchPeriod, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  {selectedPunchInfo.punchOutPeriod}
                </Text>
              </View>
              <Text
                style={[styles.punchTime, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                testID="punch-out-time"
              >
                {selectedPunchInfo.punchOutTime}
              </Text>
            </View>
          </GlassCard>
        </KeyboardAvoidingScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 2,
    marginLeft: -4,
  },
  headerTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    letterSpacing: -0.3,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    letterSpacing: -0.3,
  },
  monthNavButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navChevronBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
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
    alignItems: 'center',
    justifyContent: 'center',
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
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
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
  },
  pendingLegendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },
  punchCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dateCol: {
    flex: 1,
  },
  punchCardDate: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    letterSpacing: -0.2,
  },
  punchCardSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 2,
  },
  approvedStatusText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#059669',
  },
  pendingStatusText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#D97706',
  },
  pendingBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },
  punchItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  punchIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  punchInfoCol: {
    flex: 1,
  },
  punchTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    marginBottom: 2,
  },
  punchPeriod: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
  },
  punchTime: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    letterSpacing: -0.2,
  },
});
