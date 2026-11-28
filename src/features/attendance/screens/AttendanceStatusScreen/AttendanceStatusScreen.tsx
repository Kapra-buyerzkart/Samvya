import { AppCalendar, type AppCalendarDay, type AppCalendarDayState } from '@/shared/components';
import { Feather } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
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
    isInitialLoading,
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
    isEditModalOpen,
    editPunchInInput,
    setEditPunchInInput,
    editPunchOutInput,
    setEditPunchOutInput,
    editReasonInput,
    setEditReasonInput,
    editError,
    isSubmittingEdit,
    handleOpenEditModal,
    handleCloseEditModal,
    handleSubmitEdit,
  } = useAttendanceStatusScreen();

  const getDayTestID = useCallback(
    (day: AppCalendarDay) => `attendance-day-${day.dayNumber}`,
    [],
  );

  const getDayState = useCallback(
    (day: AppCalendarDay): AppCalendarDayState => {
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
    },
    [dayStatusByDay, selectedDay],
  );

  const handleDayPress = useCallback(
    (day: AppCalendarDay) => setSelectedDay(day.dayNumber),
    [setSelectedDay],
  );

  const calendarFooter = useMemo(
    () => (
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
    ),
    [isDark],
  );

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

          {isInitialLoading ? (
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
                getDayTestID={getDayTestID}
                getDayState={getDayState}
                onDayPress={handleDayPress}
                footerContent={calendarFooter}
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

                  <View style={styles.headerActionsRow}>
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
                    <TouchableOpacity
                      onPress={handleOpenEditModal}
                      style={[
                        styles.editPunchBtn,
                        {
                          backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                          borderColor: isDark ? '#334155' : '#BFDBFE',
                        },
                      ]}
                      activeOpacity={0.75}
                      testID="edit-punch-btn"
                      accessibilityRole="button"
                      accessibilityLabel="Edit punch times"
                    >
                      <Feather name="edit-2" size={12} color={isDark ? '#93C5FD' : '#1D4ED8'} />
                      <Text
                        style={[
                          styles.editPunchBtnText,
                          { color: isDark ? '#93C5FD' : '#1D4ED8' },
                        ]}
                      >
                        Edit
                      </Text>
                    </TouchableOpacity>
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

        <Modal
          visible={isEditModalOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCloseEditModal}
        >
          <View style={styles.modalBackdrop}>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                  borderColor: isDark ? '#1E293B' : '#E2E8F0',
                },
              ]}
            >
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalTitle, getTextColorStyle(isDark)]}>
                  Edit Attendance ({formattedSelectedDate})
                </Text>
                <TouchableOpacity
                  onPress={handleCloseEditModal}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel="Close edit modal"
                >
                  <Feather name="x" size={18} color={isDark ? '#94A3B8' : '#64748B'} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.modalSubtitle, getPunchCardSubtitleStyle(isDark)]}>
                Times are in IST (e.g. 09:30 AM or 18:15).
              </Text>

              <View>
                <Text style={[styles.modalFieldLabel, getTextColorStyle(isDark)]}>
                  Punch-in (IST)
                </Text>
                <TextInput
                  value={editPunchInInput}
                  onChangeText={setEditPunchInInput}
                  placeholder="09:30 AM"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  style={[
                    styles.modalInput,
                    {
                      color: isDark ? '#F8FAFC' : '#0F172A',
                      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                  testID="edit-punch-in-input"
                />
              </View>

              <View>
                <Text style={[styles.modalFieldLabel, getTextColorStyle(isDark)]}>
                  Punch-out (IST)
                </Text>
                <TextInput
                  value={editPunchOutInput}
                  onChangeText={setEditPunchOutInput}
                  placeholder="06:30 PM"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  style={[
                    styles.modalInput,
                    {
                      color: isDark ? '#F8FAFC' : '#0F172A',
                      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                  testID="edit-punch-out-input"
                />
              </View>

              <View>
                <Text style={[styles.modalFieldLabel, getTextColorStyle(isDark)]}>Reason</Text>
                <TextInput
                  value={editReasonInput}
                  onChangeText={setEditReasonInput}
                  placeholder="Enter reason for attendance correction"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  multiline={true}
                  style={[
                    styles.modalInput,
                    styles.modalReasonInput,
                    {
                      color: isDark ? '#F8FAFC' : '#0F172A',
                      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                  testID="edit-punch-reason-input"
                />
              </View>

              {editError ? <Text style={styles.modalErrorText}>{editError}</Text> : null}

              <View style={styles.modalActionsRow}>
                <TouchableOpacity
                  onPress={handleCloseEditModal}
                  disabled={isSubmittingEdit}
                  style={[
                    styles.modalCancelBtn,
                    { borderColor: isDark ? '#334155' : '#CBD5E1' },
                  ]}
                >
                  <Text style={getTextColorStyle(isDark)}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSubmitEdit}
                  disabled={isSubmittingEdit}
                  style={styles.modalSubmitBtn}
                  testID="submit-punch-edit-btn"
                >
                  <Text style={styles.modalSubmitText}>
                    {isSubmittingEdit ? 'Submitting...' : 'Submit Correction'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

export default AttendanceStatusScreen;
