import React, { useMemo, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

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
  // Default to November 2026 to match client reference design
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 0-indexed, 10 = November

  const [durationType, setDurationType] = useState<DurationType>('full');
  const [startDate, setStartDate] = useState<string | null>('2026-11-12');
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

  // Build calendar matrix
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

    // Actual month days
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

  // Date selection handler
  const handleSelectDay = (dateKey: string) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(dateKey);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (dateKey < startDate) {
        setEndDate(startDate);
        setStartDate(dateKey);
      } else if (dateKey === startDate) {
        // Tapped same date again -> 1 day selection
        setEndDate(dateKey);
      } else {
        setEndDate(dateKey);
      }
    }
  };

  // Calculate requested duration
  const requestedDuration = useMemo(() => {
    if (!startDate) return { days: 0, label: '—', subtitle: 'Select dates to view duration.' };

    const effectiveEnd = endDate || startDate;
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(effectiveEnd).getTime();
    const diffDays = Math.round(Math.abs(endMs - startMs) / (1000 * 60 * 60 * 24)) + 1;

    const total = durationType === 'half' ? diffDays * 0.5 : diffDays;
    const unit = total === 1 ? 'day' : 'days';

    const fmtDate = (dStr: string) => {
      const parts = dStr.split('-');
      const y = parts[0] ?? '2026';
      const m = parseInt(parts[1] ?? '11', 10) - 1;
      const d = parseInt(parts[2] ?? '1', 10);
      return `${d} ${MONTH_NAMES[m]?.slice(0, 3) ?? ''} ${y}`;
    };

    const subtitle =
      startDate === effectiveEnd
        ? `${fmtDate(startDate)}`
        : `${fmtDate(startDate)} to ${fmtDate(effectiveEnd)}`;

    return {
      days: total,
      label: `${total} ${unit}`,
      subtitle,
    };
  }, [startDate, endDate, durationType]);

  const formatDateDisplay = (dateStr: string | null) => {
    if (!dateStr) return 'Select date';
    const parts = dateStr.split('-');
    const y = parts[0] ?? '2026';
    const m = parseInt(parts[1] ?? '11', 10) - 1;
    const d = parseInt(parts[2] ?? '1', 10);
    return `${d} ${MONTH_NAMES[m]?.slice(0, 3) ?? ''} ${y}`;
  };

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
    setTimeout(() => {
      setIsSubmitting(false);
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
    }, 400);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexOne}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Top Navigation Bar */}
            <View style={styles.navBar}>
              <View style={styles.navLeft}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.backButton}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather name="chevron-left" size={26} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Request leave</Text>
              </View>

              <View style={styles.availableBadge}>
                <Text style={styles.availableBadgeText}>14 days available</Text>
              </View>
            </View>

            {/* Allocated / Taken / Pending Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>Allocated</Text>
                <Text style={styles.summaryValue}>18 days</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>Taken</Text>
                <Text style={styles.summaryValue}>4 days</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>Pending</Text>
                <Text style={styles.summaryValue}>0 days</Text>
              </View>
            </View>

            {/* Duration Selector */}
            <View style={styles.durationRow}>
              <Text style={styles.sectionTitle}>Duration</Text>
              <View style={styles.durationToggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.durationToggleBtn,
                    durationType === 'full' && styles.durationToggleBtnActive,
                  ]}
                  onPress={() => setDurationType('full')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.durationToggleText,
                      durationType === 'full' && styles.durationToggleTextActive,
                    ]}
                  >
                    Full day
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.durationToggleBtn,
                    durationType === 'half' && styles.durationToggleBtnActive,
                  ]}
                  onPress={() => setDurationType('half')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.durationToggleText,
                      durationType === 'half' && styles.durationToggleTextActive,
                    ]}
                  >
                    Half day
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Date Pickers Row */}
            <View style={styles.datesRowCard}>
              {/* Start Date */}
              <TouchableOpacity
                style={styles.datePickerCol}
                onPress={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
                activeOpacity={0.7}
              >
                <Feather name="calendar" size={18} color="#2563EB" />
                <View style={styles.datePickerTextCol}>
                  <Text style={styles.datePickerLabel}>Start date</Text>
                  <Text style={styles.datePickerValue}>{formatDateDisplay(startDate)}</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.datesVerticalDivider} />

              {/* End Date */}
              <TouchableOpacity
                style={styles.datePickerCol}
                onPress={() => {
                  if (startDate && !endDate) {
                    setEndDate(startDate);
                  }
                }}
                activeOpacity={0.7}
              >
                <Feather name="calendar" size={18} color="#2563EB" />
                <View style={styles.datePickerTextCol}>
                  <Text style={styles.datePickerLabel}>End date</Text>
                  <Text style={styles.datePickerValue}>
                    {formatDateDisplay(endDate || (startDate ? startDate : null))}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionSeparator} />

            {/* Month Calendar Card */}
            <View style={styles.calendarContainer}>
              {/* Month Header with Arrows */}
              <View style={styles.calendarHeaderRow}>
                <Text style={styles.calendarMonthTitle}>
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </Text>
                <View style={styles.calendarArrowsRow}>
                  <TouchableOpacity
                    onPress={handlePrevMonth}
                    style={styles.arrowButton}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name="chevron-left" size={20} color="#2563EB" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleNextMonth}
                    style={styles.arrowButton}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name="chevron-right" size={20} color="#2563EB" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Day of Week Headers */}
              <View style={styles.weekdaysRow}>
                {WEEKDAY_NAMES.map((name) => (
                  <Text key={name} style={styles.weekdayLabel}>
                    {name}
                  </Text>
                ))}
              </View>

              {/* Days Grid */}
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

                  const isSingleSelected = isStart && (!endDate || startDate === endDate);

                  return (
                    <TouchableOpacity
                      key={item.dateKey}
                      style={[
                        styles.daySlot,
                        isInRange && styles.daySlotInRange,
                        (isStart || isEnd) && !isSingleSelected && styles.daySlotEndpoint,
                        isSingleSelected && styles.daySlotSingleBorder,
                      ]}
                      onPress={() => handleSelectDay(item.dateKey)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          (isStart || isEnd) && !isSingleSelected && styles.dayTextEndpoint,
                          isSingleSelected && styles.dayTextSingle,
                        ]}
                      >
                        {item.dayNumber}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Reason Section */}
            <View style={styles.reasonSection}>
              <Text style={styles.sectionTitle}>Reason</Text>
              <View style={styles.reasonInputContainer}>
                <TextInput
                  style={styles.reasonInput}
                  placeholder="Add a reason for your leave"
                  placeholderTextColor="#64748B"
                  value={reason}
                  onChangeText={setReason}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Requested Duration Summary */}
            <View style={styles.durationSummaryRow}>
              <View style={styles.durationSummaryLeft}>
                <Feather name="clock" size={20} color="#0F172A" />
                <View style={styles.durationSummaryTextCol}>
                  <Text style={styles.durationSummaryTitle}>Requested duration</Text>
                  <Text style={styles.durationSummarySubtitle}>
                    {requestedDuration.subtitle}
                  </Text>
                </View>
              </View>
              <Text style={styles.durationSummaryValue}>{requestedDuration.label}</Text>
            </View>

            {/* Submit Request Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Submitting...' : 'Submit request'}
              </Text>
              <Feather name="arrow-right" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flexOne: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 36,
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
    gap: 8,
  },
  backButton: {
    padding: 2,
    marginLeft: -4,
  },
  navTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  availableBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#93C5FD',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  availableBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(238, 242, 255, 0.7)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2563EB',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#CBD5E1',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  durationToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 3,
  },
  durationToggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationToggleBtnActive: {
    backgroundColor: '#1D4ED8',
  },
  durationToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  durationToggleTextActive: {
    color: '#FFFFFF',
  },
  datesRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  datePickerCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  datePickerTextCol: {
    flex: 1,
  },
  datePickerLabel: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
    marginBottom: 2,
  },
  datePickerValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  datesVerticalDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 18,
  },
  calendarContainer: {
    marginBottom: 24,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calendarMonthTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
  },
  calendarArrowsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  arrowButton: {
    padding: 4,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  weekdayLabel: {
    width: 40,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
  },
  daySlotEmpty: {
    width: '14.28%',
    height: 38,
  },
  daySlot: {
    width: '14.28%',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySlotSingleBorder: {
    borderWidth: 2,
    borderColor: '#1D4ED8',
    borderRadius: 10,
  },
  daySlotEndpoint: {
    backgroundColor: '#1D4ED8',
    borderRadius: 10,
  },
  daySlotInRange: {
    backgroundColor: '#DBEAFE',
  },
  dayText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0F172A',
  },
  dayTextSingle: {
    fontWeight: '700',
    color: '#0F172A',
  },
  dayTextEndpoint: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reasonSection: {
    marginBottom: 20,
  },
  reasonInputContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 8,
    minHeight: 84,
  },
  reasonInput: {
    fontSize: 14,
    color: '#0F172A',
    minHeight: 60,
  },
  durationSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 4,
  },
  durationSummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  durationSummaryTextCol: {
    flex: 1,
  },
  durationSummaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  durationSummarySubtitle: {
    fontSize: 12,
    color: '#2563EB',
    marginTop: 2,
  },
  durationSummaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  submitButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 28,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
