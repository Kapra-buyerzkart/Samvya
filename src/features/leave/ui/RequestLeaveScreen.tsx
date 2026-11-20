import React, { useMemo, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageBackground } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FontFamily, useAppTheme } from '@/shared/theme';
import { TactilePressable } from '@/shared/animations';
import { KeyboardAvoidingScrollView } from '@/shared/components';

type DurationType = 'full' | 'half';

interface CalendarDay {
  dayNumber: number;
  dateKey: string; // YYYY-MM-DD
  isCurrentMonth: boolean;
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

export function RequestLeaveScreen(): React.JSX.Element {
  const theme = useAppTheme();
  const isDark = theme.isDark;

  // Calendar month/year navigation state - defaults to November 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 0-indexed: 10 = November

  // Reference today key (12 Nov 2026 as per reference design)
  const todayKey = '2026-11-12';

  const [durationType, setDurationType] = useState<DurationType>('full');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Month navigation
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

  // Build calendar matrix dynamically for active month & year
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

  // Interactive date selection
  const handleSelectDay = (dateKey: string) => {
    if (!startDate || (startDate && endDate)) {
      // First selection or resetting range
      setStartDate(dateKey);
      setEndDate(null);
    } else if (startDate && !endDate) {
      // Second selection
      if (dateKey < startDate) {
        setEndDate(startDate);
        setStartDate(dateKey);
      } else if (dateKey === startDate) {
        // Tapped same date again -> single day selection
        setEndDate(dateKey);
      } else {
        setEndDate(dateKey);
      }
    }
  };

  const formatDateDisplay = (dateStr: string | null) => {
    if (!dateStr) return 'Select date';
    const parts = dateStr.split('-');
    const y = parts[0] ?? '2026';
    const m = parseInt(parts[1] ?? '11', 10) - 1;
    const d = parseInt(parts[2] ?? '1', 10);
    return `${d} ${MONTH_NAMES[m]?.slice(0, 3) ?? ''} ${y}`;
  };

  // Calculate duration summary
  const requestedDuration = useMemo(() => {
    if (!startDate) {
      return {
        days: 0,
        label: '—',
        subtitle: 'Select dates to view duration.',
      };
    }

    const effectiveEnd = endDate || startDate;
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(effectiveEnd).getTime();
    const diffDays = Math.round(Math.abs(endMs - startMs) / (1000 * 60 * 60 * 24)) + 1;

    const total = durationType === 'half' ? diffDays * 0.5 : diffDays;
    const unit = total === 1 ? 'day' : 'days';

    const fmt = (dStr: string) => {
      const parts = dStr.split('-');
      const y = parts[0] ?? '2026';
      const m = parseInt(parts[1] ?? '11', 10) - 1;
      const d = parseInt(parts[2] ?? '1', 10);
      return `${d} ${MONTH_NAMES[m]?.slice(0, 3) ?? ''} ${y}`;
    };

    const subtitle =
      startDate === effectiveEnd
        ? `${fmt(startDate)}`
        : `${fmt(startDate)} to ${fmt(effectiveEnd)}`;

    return {
      days: total,
      label: `${total} ${unit}`,
      subtitle,
    };
  }, [startDate, endDate, durationType]);

  const handleSubmit = () => {
    if (!startDate) {
      Alert.alert('Missing Date', 'Please select at least a start date for your leave.');
      return;
    }

    if (!reason.trim()) {
      Alert.alert('Reason Required', 'Please enter a reason for your leave request.');
      return;
    }

    setIsSubmitting(true);
    Alert.alert(
      'Request Submitted',
      `Your request for ${requestedDuration.label} (${requestedDuration.subtitle}) has been sent for approval.`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ],
    );
    setIsSubmitting(false);
  };

  const handleApprovalStatus = () => {
    router.push('/(app)/leave/status');
  };

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
      <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#020617' : 'transparent' }]}>
        <KeyboardAvoidingScrollView contentContainerStyle={styles.scrollContent}>
          {/* 1. Header Navigation Bar */}
          <View style={styles.navBar}>
            <View style={styles.navLeft}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
                activeOpacity={0.7}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Feather name="chevron-left" size={24} color={isDark ? '#F8FAFC' : '#0F172A'} />
              </TouchableOpacity>
              <Text style={[styles.navTitle, { color: isDark ? '#F8FAFC' : '#0F1E36' }]}>
                Request leave
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleApprovalStatus}
              style={[
                styles.approvalStatusBtn,
                {
                  backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(239, 246, 255, 0.85)',
                  borderColor: isDark ? '#334155' : '#BFDBFE',
                },
              ]}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Approval status"
              testID="approval-status-btn"
            >
              <Text style={[styles.approvalStatusBtnText, { color: isDark ? '#93C5FD' : '#2563EB' }]}>
                Approval status
              </Text>
              <Feather name="chevron-right" size={14} color={isDark ? '#93C5FD' : '#2563EB'} />
            </TouchableOpacity>
          </View>

          {/* 2. Leave Summary Card (Allocated / Taken / Pending) */}
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(219, 234, 254, 0.55)',
                borderColor: isDark ? '#334155' : '#BFDBFE',
              },
            ]}
          >
            <View style={styles.summaryCol}>
              <Text style={[styles.summaryLabel, { color: isDark ? '#60A5FA' : '#2563EB' }]}>
                Allocated
              </Text>
              <Text style={[styles.summaryValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                18 days
              </Text>
            </View>

            <View style={[styles.summaryDivider, { backgroundColor: isDark ? '#334155' : '#BFDBFE' }]} />

            <View style={styles.summaryCol}>
              <Text style={[styles.summaryLabel, { color: isDark ? '#60A5FA' : '#2563EB' }]}>
                Taken
              </Text>
              <Text style={[styles.summaryValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                4 days
              </Text>
            </View>

            <View style={[styles.summaryDivider, { backgroundColor: isDark ? '#334155' : '#BFDBFE' }]} />

            <View style={styles.summaryCol}>
              <Text style={[styles.summaryLabel, { color: isDark ? '#60A5FA' : '#2563EB' }]}>
                Pending
              </Text>
              <Text style={[styles.summaryValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                0 days
              </Text>
            </View>
          </View>

          {/* 3. Duration Segment Toggle (Full day / Half day) */}
          <View style={styles.durationRow}>
            <View
              style={[
                styles.durationToggleContainer,
                {
                  backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                  borderColor: isDark ? '#334155' : '#BFDBFE',
                },
              ]}
            >
              <TactilePressable
                style={[
                  styles.durationToggleBtn,
                  durationType === 'full' && [
                    styles.durationToggleBtnActive,
                    { backgroundColor: '#1D4ED8' },
                  ],
                ]}
                onPress={() => setDurationType('full')}
                activeScale={0.96}
                accessibilityRole="button"
                accessibilityState={{ selected: durationType === 'full' }}
                testID="duration-full-btn"
              >
                <Text
                  style={[
                    styles.durationToggleText,
                    { color: isDark ? '#94A3B8' : '#0F172A' },
                    durationType === 'full' && styles.durationToggleTextActive,
                  ]}
                >
                  Full day
                </Text>
              </TactilePressable>

              <TactilePressable
                style={[
                  styles.durationToggleBtn,
                  durationType === 'half' && [
                    styles.durationToggleBtnActive,
                    { backgroundColor: '#1D4ED8' },
                  ],
                ]}
                onPress={() => setDurationType('half')}
                activeScale={0.96}
                accessibilityRole="button"
                accessibilityState={{ selected: durationType === 'half' }}
                testID="duration-half-btn"
              >
                <Text
                  style={[
                    styles.durationToggleText,
                    { color: isDark ? '#94A3B8' : '#0F172A' },
                    durationType === 'half' && styles.durationToggleTextActive,
                  ]}
                >
                  Half day
                </Text>
              </TactilePressable>
            </View>
          </View>

          {/* 4. Start Date & End Date Row */}
          <View style={styles.datesRowCard}>
            {/* Start Date Column */}
            <TouchableOpacity
              style={styles.datePickerCol}
              onPress={() => {
                setStartDate(null);
                setEndDate(null);
              }}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Select start date"
              testID="start-date-picker"
            >
              <Feather name="calendar" size={20} color={isDark ? '#60A5FA' : '#2563EB'} />
              <View style={styles.datePickerTextCol}>
                <Text style={[styles.datePickerLabel, { color: isDark ? '#60A5FA' : '#2563EB' }]}>
                  Start date
                </Text>
                <Text style={[styles.datePickerValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  {formatDateDisplay(startDate)}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.datesVerticalDivider, { backgroundColor: isDark ? '#334155' : '#CBD5E1' }]} />

            {/* End Date Column */}
            <TouchableOpacity
              style={styles.datePickerCol}
              onPress={() => {
                if (startDate && !endDate) {
                  setEndDate(startDate);
                }
              }}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Select end date"
              testID="end-date-picker"
            >
              <Feather name="calendar" size={20} color={isDark ? '#60A5FA' : '#2563EB'} />
              <View style={styles.datePickerTextCol}>
                <Text style={[styles.datePickerLabel, { color: isDark ? '#60A5FA' : '#2563EB' }]}>
                  End date
                </Text>
                <Text style={[styles.datePickerValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  {formatDateDisplay(endDate)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Divider below Date Pickers */}
          <View style={[styles.sectionSeparator, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]} />

          {/* 5. Month Calendar Grid Card */}
          <View
            style={[
              styles.calendarContainer,
              {
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.65)' : 'rgba(238, 242, 255, 0.45)',
                borderColor: isDark ? '#334155' : '#CBD5E1',
              },
            ]}
          >
            {/* Month Header with Navigation Arrows */}
            <View style={styles.calendarHeaderRow}>
              <Text style={[styles.calendarMonthTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                {MONTH_NAMES[currentMonth]} {currentYear}
              </Text>
              <View style={styles.calendarArrowsRow}>
                <TactilePressable
                  onPress={handlePrevMonth}
                  style={styles.arrowButton}
                  activeScale={0.88}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel="Previous month"
                  testID="prev-month-btn"
                >
                  <Feather name="chevron-left" size={20} color={isDark ? '#60A5FA' : '#1D4ED8'} />
                </TactilePressable>
                <TactilePressable
                  onPress={handleNextMonth}
                  style={styles.arrowButton}
                  activeScale={0.88}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel="Next month"
                  testID="next-month-btn"
                >
                  <Feather name="chevron-right" size={20} color={isDark ? '#60A5FA' : '#1D4ED8'} />
                </TactilePressable>
              </View>
            </View>

            {/* Day of Week Labels */}
            <View style={styles.weekdaysRow}>
              {WEEKDAY_NAMES.map((name) => (
                <Text
                  key={name}
                  style={[
                    styles.weekdayLabel,
                    { color: isDark ? '#60A5FA' : '#3B82F6' },
                  ]}
                >
                  {name}
                </Text>
              ))}
            </View>

            {/* Days Matrix */}
            <View style={styles.daysGrid}>
              {calendarDays.map((item, index) => {
                if (!item.isCurrentMonth) {
                  return <View key={item.dateKey || `pad-${index}`} style={styles.daySlotEmpty} />;
                }

                const isStart = startDate === item.dateKey;
                const isEnd = endDate === item.dateKey;
                const isInRange =
                  startDate &&
                  endDate &&
                  item.dateKey > startDate &&
                  item.dateKey < endDate;

                // Reference selected day in design (either todayKey when unselected or explicitly picked)
                const isSingleSelected = isStart && (!endDate || startDate === endDate);
                const isHighlightedRef = !startDate && item.dateKey === todayKey;

                return (
                  <TactilePressable
                    key={item.dateKey}
                    style={[
                      styles.daySlot,
                      isInRange && [
                        styles.daySlotInRange,
                        { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.3)' : '#DBEAFE' },
                      ],
                      (isStart || isEnd) && !isSingleSelected && styles.daySlotEndpoint,
                      (isSingleSelected || isHighlightedRef) && [
                        styles.daySlotSelectedPill,
                        {
                          borderColor: isDark ? '#60A5FA' : '#2563EB',
                          backgroundColor: isDark ? 'rgba(37, 99, 235, 0.35)' : '#DBEAFE',
                        },
                      ],
                    ]}
                    onPress={() => handleSelectDay(item.dateKey)}
                    activeScale={0.9}
                    testID={`day-slot-${item.dateKey}`}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        { color: isDark ? '#F8FAFC' : '#0F172A' },
                        (isStart || isEnd) && !isSingleSelected && styles.dayTextEndpoint,
                        (isSingleSelected || isHighlightedRef) && styles.dayTextSelectedPill,
                      ]}
                    >
                      {item.dayNumber}
                    </Text>
                  </TactilePressable>
                );
              })}
            </View>
          </View>

          {/* Divider below Calendar Card */}
          <View style={[styles.sectionSeparator, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]} />

          {/* 6. Reason Section with Days Available Badge */}
          <View style={styles.reasonSection}>
            <View style={styles.reasonHeaderRow}>
              <Text style={[styles.reasonTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Reason
              </Text>
              <View
                style={[
                  styles.availableBadge,
                  {
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : '#EFF6FF',
                    borderColor: isDark ? '#334155' : '#BFDBFE',
                  },
                ]}
              >
                <Text style={[styles.availableBadgeText, { color: isDark ? '#93C5FD' : '#1D4ED8' }]}>
                  14 days available
                </Text>
              </View>
            </View>

            <View style={styles.reasonInputContainer}>
              <TextInput
                style={[
                  styles.reasonInput,
                  { color: isDark ? '#F8FAFC' : '#0F172A' },
                ]}
                placeholder="Add a reason for your leave"
                placeholderTextColor={isDark ? '#64748B' : '#3B82F6'}
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                testID="reason-input"
              />
            </View>
          </View>

          {/* 7. Submit Request Button */}
          <TactilePressable
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeScale={0.96}
            accessibilityRole="button"
            accessibilityLabel="Submit request"
            testID="submit-request-btn"
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit request'}
            </Text>
            <Feather name="arrow-right" size={20} color="#FFFFFF" />
          </TactilePressable>
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
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 96,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 6,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backButton: {
    padding: 2,
    marginLeft: -6,
  },
  navTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    letterSpacing: -0.2,
  },
  approvalStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  approvalStatusBtnText: {
    fontFamily: FontFamily.medium,
    fontSize: 12.5,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    marginBottom: 3,
  },
  summaryValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    fontVariant: ['tabular-nums'],
  },
  summaryDivider: {
    width: 1,
    height: 28,
  },
  durationRow: {
    marginBottom: 14,
  },
  durationToggleContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 3,
  },
  durationToggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationToggleBtnActive: {
    backgroundColor: '#1D4ED8',
  },
  durationToggleText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
  },
  durationToggleTextActive: {
    fontFamily: FontFamily.semiBold,
    color: '#FFFFFF',
  },
  datesRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  datePickerCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  datePickerTextCol: {
    flex: 1,
  },
  datePickerLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    marginBottom: 2,
  },
  datePickerValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 14.5,
  },
  datesVerticalDivider: {
    width: 1,
    height: 30,
    marginHorizontal: 12,
  },
  sectionSeparator: {
    height: 1,
    marginVertical: 12,
  },
  calendarContainer: {
    borderRadius: 22,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calendarMonthTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 17,
  },
  calendarArrowsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  arrowButton: {
    padding: 4,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekdayLabel: {
    width: '14.28%',
    textAlign: 'center',
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 6,
  },
  daySlotEmpty: {
    width: '14.28%',
    height: 36,
  },
  daySlot: {
    width: '14.28%',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySlotSelectedPill: {
    borderWidth: 1.5,
    borderRadius: 12,
  },
  daySlotEndpoint: {
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
  },
  daySlotInRange: {
    borderRadius: 6,
  },
  dayText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14.5,
    fontVariant: ['tabular-nums'],
  },
  dayTextSelectedPill: {
    fontFamily: FontFamily.semiBold,
  },
  dayTextEndpoint: {
    color: '#FFFFFF',
  },
  reasonSection: {
    marginBottom: 16,
  },
  reasonHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reasonTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16.5,
  },
  availableBadge: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  availableBadgeText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
  },
  reasonInputContainer: {
    paddingHorizontal: 0,
    paddingVertical: 4,
    minHeight: 46,
  },
  reasonInput: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    minHeight: 40,
  },
  submitButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
