import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageBackground } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FontFamily, useAppTheme } from '@/shared/theme';

interface CalendarDay {
  dayNumber: number;
  dateKey: string; // YYYY-MM-DD
  isCurrentMonth: boolean;
}

type StatusFilter = 'all' | 'approved' | 'pending' | 'rejected';

interface LeaveRecord {
  id: string;
  requestDate: string;
  actionDate: string;
  status: 'approved' | 'rejected';
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

// Predefined leave history matching the reference design
const LEAVE_RECORDS: LeaveRecord[] = [
  {
    id: 'req-1',
    requestDate: '19 Nov 2026',
    actionDate: '20 Nov 2026',
    status: 'approved',
  },
  {
    id: 'req-2',
    requestDate: '10 Oct 2026',
    actionDate: '12 Oct 2026',
    status: 'rejected',
  },
];

// Highlighted leave dates for November 2026
// Approved: 23, 24 Nov 2026
const APPROVED_DATES = new Set(['2026-11-23', '2026-11-24']);
// Pending: 9, 10, 11, 12 Nov 2026
const PENDING_DATES = new Set(['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12']);

export function LeaveStatusScreen(): React.JSX.Element {
  const theme = useAppTheme();
  const isDark = theme.isDark;

  // Month navigation: default to November 2026 (month index 10)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState<StatusFilter>('all');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToggleFilter = () => {
    const cycle: StatusFilter[] = ['all', 'approved', 'pending', 'rejected'];
    const nextIdx = (cycle.indexOf(selectedFilter) + 1) % cycle.length;
    setSelectedFilter(cycle[nextIdx] ?? 'all');
  };

  const handleSelectDatePress = () => {
    if (selectedDate) {
      setSelectedDate(null);
    } else {
      setSelectedDate('2026-11-23');
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

  // Filtered records
  const displayedRecords = useMemo(() => {
    if (selectedFilter === 'all') return LEAVE_RECORDS;
    if (selectedFilter === 'approved') {
      return LEAVE_RECORDS.filter((r) => r.status === 'approved');
    }
    if (selectedFilter === 'rejected') {
      return LEAVE_RECORDS.filter((r) => r.status === 'rejected');
    }
    return [];
  }, [selectedFilter]);

  return (
    <ImageBackground
      source={require('../../../../assets/images/background_home.png')}
      style={[
        styles.backgroundImage,
        { backgroundColor: isDark ? '#020617' : '#F8FAFC' },
      ]}
      imageStyle={{ opacity: isDark ? 0.05 : 1 }}
      contentFit="cover"
    >
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: isDark ? '#020617' : 'transparent' }]}
        edges={['top', 'bottom']}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.7}
              testID="leave-status-back-btn"
              accessibilityLabel="Go back"
            >
              <Feather
                name="chevron-left"
                size={24}
                color={isDark ? '#F8FAFC' : '#0F172A'}
              />
              <Text
                style={[
                  styles.headerTitle,
                  { color: isDark ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                Leave status
              </Text>
            </TouchableOpacity>
          </View>

          {/* Month & Year Navigation Row */}
          <View style={styles.monthHeaderRow}>
            <Text
              style={[
                styles.monthTitle,
                { color: isDark ? '#F8FAFC' : '#0F172A' },
              ]}
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
                accessibilityLabel="Previous month"
              >
                <Feather
                  name="chevron-left"
                  size={18}
                  color={isDark ? '#F8FAFC' : '#0F172A'}
                />
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
                accessibilityLabel="Next month"
              >
                <Feather
                  name="chevron-right"
                  size={18}
                  color={isDark ? '#F8FAFC' : '#0F172A'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Filters Row */}
          <View style={styles.filtersRow}>
            <TouchableOpacity
              style={[
                styles.filterPill,
                {
                  backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                  borderColor: isDark ? '#3B82F6' : '#BFDBFE',
                },
              ]}
              onPress={handleToggleFilter}
              activeOpacity={0.7}
              testID="filter-by-status-btn"
            >
              <Feather name="filter" size={13} color="#2563EB" />
              <Text style={styles.filterPillText}>
                {selectedFilter === 'all'
                  ? 'Filter by status'
                  : `Status: ${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}`}
              </Text>
              <Feather name="chevron-down" size={13} color="#2563EB" />
            </TouchableOpacity>

            <View style={[styles.filterDivider, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]} />

            <TouchableOpacity
              style={[
                styles.filterPill,
                {
                  backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                  borderColor: isDark ? '#3B82F6' : '#BFDBFE',
                },
              ]}
              onPress={handleSelectDatePress}
              activeOpacity={0.7}
              testID="select-date-btn"
            >
              <Feather name="calendar" size={13} color="#2563EB" />
              <Text style={styles.filterPillText}>
                {selectedDate ? '23 Nov 2026' : 'Select date'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Calendar Card */}
          <View
            style={[
              styles.calendarCard,
              {
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: isDark ? '#334155' : '#BFDBFE',
              },
            ]}
          >
            {/* Weekday Names Header */}
            <View style={styles.weekdaysRow}>
              {WEEKDAY_NAMES.map((w) => (
                <View key={w} style={styles.weekdaySlot}>
                  <Text style={styles.weekdayText}>{w}</Text>
                </View>
              ))}
            </View>

            {/* Days Grid */}
            <View style={styles.daysGrid}>
              {calendarDays.map((day) => {
                if (!day.isCurrentMonth) {
                  return <View key={day.dateKey} style={styles.daySlot} />;
                }

                const isApproved =
                  (selectedFilter === 'all' || selectedFilter === 'approved') &&
                  APPROVED_DATES.has(day.dateKey);

                const isPending =
                  (selectedFilter === 'all' || selectedFilter === 'pending') &&
                  PENDING_DATES.has(day.dateKey);

                const isSelected = selectedDate === day.dateKey;

                return (
                  <TouchableOpacity
                    key={day.dateKey}
                    onPress={() => setSelectedDate(day.dateKey === selectedDate ? null : day.dateKey)}
                    activeOpacity={0.7}
                    style={styles.daySlot}
                    testID={`status-day-${day.dateKey}`}
                  >
                    <View
                      style={[
                        styles.dayNumberContainer,
                        isApproved && styles.approvedDayPill,
                        isSelected && !isApproved && styles.selectedDayPill,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayNumberText,
                          { color: isDark ? '#F8FAFC' : '#0F172A' },
                          isPending && styles.pendingDayText,
                          isApproved && styles.approvedDayText,
                          isSelected && !isApproved && styles.selectedDayText,
                        ]}
                      >
                        {day.dayNumber}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Status Legend Row */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={styles.approvedIconBox}>
                <Feather name="check" size={13} color="#16A34A" />
              </View>
              <Text style={[styles.legendText, { color: isDark ? '#CBD5E1' : '#334155' }]}>
                Approved
              </Text>
            </View>

            <View style={[styles.legendDivider, { backgroundColor: isDark ? '#334155' : '#CBD5E1' }]} />

            <View style={styles.legendItem}>
              <Feather name="clock" size={14} color="#EA580C" />
              <Text style={[styles.legendText, { color: isDark ? '#CBD5E1' : '#334155' }]}>
                Pending
              </Text>
            </View>
          </View>

          {/* Approval Status Card */}
          <View
            style={[
              styles.statusCard,
              {
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: isDark ? '#334155' : '#BFDBFE',
              },
            ]}
          >
            <Text
              style={[
                styles.statusCardTitle,
                { color: isDark ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              Approval status
            </Text>
            <Text style={styles.statusCardSubtitle}>
              Approved / rejected leaves status
            </Text>

            {/* Blue accent horizontal separator line */}
            <View style={styles.blueAccentBar} />

            {/* Timeline Records */}
            <View style={styles.timelineList}>
              {displayedRecords.map((record, index) => (
                <View key={record.id}>
                  {index > 0 && <View style={[styles.recordDivider, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]} />}

                  {/* Step 1: Requested */}
                  <View style={styles.timelineStepRow}>
                    <View style={styles.timelineIconBadge}>
                      <Feather name="file-text" size={15} color="#2563EB" />
                    </View>
                    <Text
                      style={[
                        styles.timelineStepLabel,
                        { color: isDark ? '#F8FAFC' : '#0F172A' },
                      ]}
                    >
                      Requested
                    </Text>
                    <Text style={styles.timelineDateText}>
                      {record.requestDate}
                    </Text>
                  </View>

                  {/* Vertical Connector Line */}
                  <View style={styles.verticalConnectorLine} />

                  {/* Step 2: Approved / Rejected */}
                  <View style={styles.timelineStepRow}>
                    <View
                      style={[
                        styles.timelineIconBadge,
                        record.status === 'rejected' && styles.rejectedIconBadge,
                      ]}
                    >
                      <Feather
                        name={record.status === 'approved' ? 'check' : 'x'}
                        size={15}
                        color={record.status === 'approved' ? '#2563EB' : '#EF4444'}
                      />
                    </View>
                    <Text
                      style={[
                        styles.timelineStepLabel,
                        {
                          color:
                            record.status === 'approved'
                              ? isDark
                                ? '#F8FAFC'
                                : '#0F172A'
                              : '#EF4444',
                        },
                      ]}
                    >
                      {record.status === 'approved' ? 'Approved' : 'Rejected'}
                    </Text>
                    <Text style={styles.timelineDateText}>
                      {record.actionDate}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 96,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    marginLeft: 6,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  monthTitle: {
    fontSize: 24,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
  },
  monthNavButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navChevronBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },
  filterPillText: {
    fontSize: 13,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    color: '#2563EB',
    marginHorizontal: 5,
  },
  filterDivider: {
    width: 1,
    height: 18,
    marginHorizontal: 10,
  },
  calendarCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
    fontSize: 13,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    color: '#64748B',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
  },
  daySlot: {
    width: '14.28%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  dayNumberContainer: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNumberText: {
    fontSize: 14,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
  },
  pendingDayText: {
    color: '#D97706',
    fontWeight: '700',
  },
  approvedDayPill: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1.5,
    borderColor: '#22C55E',
    borderRadius: 9,
  },
  approvedDayText: {
    color: '#15803D',
    fontWeight: '700',
  },
  selectedDayPill: {
    borderWidth: 1.5,
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
    borderRadius: 9,
  },
  selectedDayText: {
    color: '#2563EB',
    fontWeight: '700',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    paddingHorizontal: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  approvedIconBox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
  },
  legendText: {
    fontSize: 13,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    marginLeft: 6,
  },
  legendDivider: {
    width: 1,
    height: 14,
    marginHorizontal: 12,
  },
  statusCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 18,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  statusCardTitle: {
    fontSize: 22,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
  },
  statusCardSubtitle: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: '#64748B',
    marginTop: 4,
  },
  blueAccentBar: {
    height: 2.5,
    backgroundColor: '#2563EB',
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 16,
  },
  timelineList: {
    gap: 4,
  },
  timelineStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectedIconBadge: {
    backgroundColor: '#FEE2E2',
  },
  timelineStepLabel: {
    fontSize: 15,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    marginLeft: 12,
  },
  timelineDateText: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
    color: '#64748B',
    marginLeft: 'auto',
  },
  verticalConnectorLine: {
    width: 1.5,
    height: 18,
    backgroundColor: '#CBD5E1',
    marginLeft: 15.25,
    marginVertical: 2,
  },
  recordDivider: {
    height: 1,
    marginVertical: 14,
  },
});
