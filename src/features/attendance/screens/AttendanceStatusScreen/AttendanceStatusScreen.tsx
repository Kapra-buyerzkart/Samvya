import { AppCalendar } from '@/shared/components';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getBackgroundImageStyle,
  getCardStyle,
  getLegendRowStyle,
  getLegendTextStyle,
  getNavChevronBtnStyle,
  getPunchCardSubtitleStyle,
  getPunchIconBoxStyle,
  getPunchPeriodStyle,
  getSafeAreaStyle,
  getSummaryCardStyle,
  getSummaryDividerStyle,
  getTextColor,
  getTextColorStyle,
  styles,
} from './AttendanceStatusScreen.styles';
import { AttendanceStatusShimmer } from './components/AttendanceStatusShimmer';
import { useAttendanceStatusScreen } from './useAttendanceStatusScreen';

export function AttendanceStatusScreen(): React.JSX.Element {
  const {
    isDark,
    currentYear,
    currentMonth,
    selectedDay,
    isLoading,
    loadError,
    monthlySummary,
    dayStatusByDay,
    setSelectedDay,
    handlePrevMonth,
    handleNextMonth,
    handleRetryLoad,
    handleBack,
    calendarDays,
    selectedPunchInfo,
    formattedSelectedDate,
    monthNames,
  } = useAttendanceStatusScreen();

  console.log(monthlySummary, 'monthlySummary=====monthlySummary');

  return (
    <View style={[styles.backgroundImage, getBackgroundImageStyle(isDark)]}>
      <SafeAreaView style={[styles.safeArea, getSafeAreaStyle(isDark)]} edges={['top', 'bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRetryLoad}
              tintColor={isDark ? '#60A5FA' : '#1D4ED8'}
              colors={['#1D4ED8']}
            />
          }
        >
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
              testID="attendance-status-back-btn"
              accessibilityRole="button"
              accessibilityLabel="Attendance status back"
            >
              <Feather name="chevron-left" size={24} color={getTextColor(isDark)} />
              <Text style={[styles.headerTitle, getTextColorStyle(isDark)]}>Attendance status</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.monthHeaderRow}>
            <View style={styles.monthTitleRow}>
              <Text
                style={[styles.monthTitle, getTextColorStyle(isDark)]}
                testID="current-month-label"
              >
                {monthNames[currentMonth]} {currentYear}
              </Text>
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={isDark ? '#60A5FA' : '#1D4ED8'}
                  testID="attendance-loading-indicator"
                />
              ) : null}
            </View>

            <View style={styles.monthNavButtons}>
              <TouchableOpacity
                onPress={handlePrevMonth}
                style={[styles.navChevronBtn, getNavChevronBtnStyle(isDark)]}
                activeOpacity={0.7}
                testID="prev-month-btn"
                accessibilityRole="button"
                accessibilityLabel="Previous month"
              >
                <Feather name="chevron-left" size={18} color={getTextColor(isDark)} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNextMonth}
                style={[styles.navChevronBtn, getNavChevronBtnStyle(isDark)]}
                activeOpacity={0.7}
                testID="next-month-btn"
                accessibilityRole="button"
                accessibilityLabel="Next month"
              >
                <Feather name="chevron-right" size={18} color={getTextColor(isDark)} />
              </TouchableOpacity>
            </View>
          </View>

          {loadError ? (
            <TouchableOpacity
              style={styles.errorBanner}
              onPress={handleRetryLoad}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Retry loading attendance records"
              testID="attendance-retry-banner"
            >
              <Text style={styles.errorBannerText}>{loadError} Tap to retry.</Text>
            </TouchableOpacity>
          ) : null}

          {isLoading ? (
            <AttendanceStatusShimmer isDark={isDark} />
          ) : (
            <>
              <View
                style={[styles.summaryCard, getSummaryCardStyle(isDark)]}
                testID="attendance-summary-card"
              >
                <View style={styles.summaryRow}>
                  <View style={styles.summaryMetric}>
                    <Text
                      style={[styles.summaryValue, getTextColorStyle(isDark)]}
                      testID="monthly-total-hours"
                    >
                      {monthlySummary?.totalHoursFormatted ?? '—'}
                    </Text>
                    <Text style={[styles.summaryLabel, getPunchCardSubtitleStyle(isDark)]}>
                      Total hours
                    </Text>
                  </View>

                  <View style={[styles.summaryDivider, getSummaryDividerStyle(isDark)]} />

                  <View style={styles.summaryMetric}>
                    <Text
                      style={[styles.summaryValue, getTextColorStyle(isDark)]}
                      testID="monthly-days-recorded"
                    >
                      {monthlySummary ? String(monthlySummary.daysRecorded) : '—'}
                    </Text>
                    <Text style={[styles.summaryLabel, getPunchCardSubtitleStyle(isDark)]}>
                      Days recorded
                    </Text>
                  </View>

                  <View style={[styles.summaryDivider, getSummaryDividerStyle(isDark)]} />

                  <View style={styles.summaryMetric}>
                    <Text
                      style={[styles.summaryValue, getTextColorStyle(isDark)]}
                      testID="monthly-working-days"
                    >
                      {monthlySummary ? String(monthlySummary.workingDays) : '—'}
                    </Text>
                    <Text style={[styles.summaryLabel, getPunchCardSubtitleStyle(isDark)]}>
                      Working days
                    </Text>
                  </View>
                </View>
              </View>

              <AppCalendar
                testID="attendance-calendar-card"
                days={calendarDays}
                getDayTestID={(day) => `attendance-day-${day.dayNumber}`}
                getDayState={(day) => {
                  const dayStatus = dayStatusByDay[day.dayNumber];
                  return {
                    isSelected: selectedDay === day.dayNumber,
                    marker:
                      dayStatus === 'approved'
                        ? 'approved'
                        : dayStatus === 'pending'
                          ? 'pending'
                          : null,
                  };
                }}
                onDayPress={(day) => setSelectedDay(day.dayNumber)}
                footerContent={
                  <View style={[styles.legendRow, getLegendRowStyle(isDark)]}>
                    <View style={styles.legendItem}>
                      <Feather name="check" size={14} color="#10B981" />
                      <Text style={[styles.legendText, getLegendTextStyle(isDark)]}>Approved</Text>
                    </View>

                    <View style={styles.legendItem}>
                      <View style={styles.pendingLegendDot} />
                      <Text style={[styles.legendText, getLegendTextStyle(isDark)]}>
                        Pending review
                      </Text>
                    </View>
                  </View>
                }
              />

              <View style={[styles.card, getCardStyle(isDark)]} testID="attendance-punch-card">
                <View style={styles.punchCardHeader}>
                  <View style={styles.dateCol}>
                    <Text
                      style={[styles.punchCardDate, getTextColorStyle(isDark)]}
                      testID="selected-day-title"
                    >
                      {formattedSelectedDate}
                    </Text>
                    <Text style={[styles.punchCardSubtitle, getPunchCardSubtitleStyle(isDark)]}>
                      {selectedPunchInfo.subtitle}
                    </Text>
                    {selectedPunchInfo.workedHoursLabel ? (
                      <View
                        style={[styles.workedHoursPill, getPunchIconBoxStyle(isDark)]}
                        testID="selected-day-worked-hours"
                      >
                        <Text
                          style={[
                            styles.workedHoursText,
                            { color: isDark ? '#93C5FD' : '#1D4ED8' },
                          ]}
                        >
                          {selectedPunchInfo.workedHoursLabel} worked
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.statusBadge}>
                    {selectedPunchInfo.status === 'approved' ? (
                      <>
                        <Feather name="check" size={14} color="#059669" />
                        <Text style={styles.approvedStatusText}>Approved</Text>
                      </>
                    ) : selectedPunchInfo.status === 'pending' ? (
                      <>
                        <View style={styles.pendingBadgeDot} />
                        <Text style={styles.pendingStatusText}>Pending review</Text>
                      </>
                    ) : selectedPunchInfo.status === 'rejected' ? (
                      <>
                        <Feather name="x-circle" size={14} color="#DC2626" />
                        <Text style={styles.rejectedStatusText}>Rejected</Text>
                      </>
                    ) : (
                      <Text style={[styles.emptyStatusText, getPunchCardSubtitleStyle(isDark)]}>
                        No log
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.punchItemRow}>
                  <View style={[styles.punchIconBox, getPunchIconBoxStyle(isDark)]}>
                    <Feather name="sunrise" size={22} color={getTextColor(isDark)} />
                  </View>
                  <View style={styles.punchInfoCol}>
                    <Text style={[styles.punchTitle, getTextColorStyle(isDark)]}>Punch-in</Text>
                    <Text style={[styles.punchPeriod, getPunchPeriodStyle(isDark)]}>
                      {selectedPunchInfo.punchInPeriod}
                    </Text>
                  </View>
                  <Text
                    style={[styles.punchTime, getTextColorStyle(isDark)]}
                    testID="punch-in-time"
                  >
                    {selectedPunchInfo.punchInTime}
                  </Text>
                </View>

                <View style={styles.punchItemRow}>
                  <View style={[styles.punchIconBox, getPunchIconBoxStyle(isDark)]}>
                    <Feather name="moon" size={22} color={getTextColor(isDark)} />
                  </View>
                  <View style={styles.punchInfoCol}>
                    <Text style={[styles.punchTitle, getTextColorStyle(isDark)]}>Punch-out</Text>
                    <Text style={[styles.punchPeriod, getPunchPeriodStyle(isDark)]}>
                      {selectedPunchInfo.punchOutPeriod}
                    </Text>
                  </View>
                  <Text
                    style={[styles.punchTime, getTextColorStyle(isDark)]}
                    testID="punch-out-time"
                  >
                    {selectedPunchInfo.punchOutTime}
                  </Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export default AttendanceStatusScreen;
