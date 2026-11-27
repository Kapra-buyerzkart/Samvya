import React from 'react';
import { ActivityIndicator, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { GlassCard, KeyboardAvoidingScrollView } from '@/shared/components';
import { LeaveStatusShimmer } from '../../components/LeaveShimmers';
import { AnimatedCounterDigits } from './components/AnimatedCounterDigits';
import { CarryForwardsSheet } from './components/CarryForwardsSheet';
import { LeaveApprovalCard } from './components/LeaveApprovalCard';
import { LeaveCalendarCard } from './components/LeaveCalendarCard';
import { LeaveTypeSegmentedBar } from './components/LeaveTypeSegmentedBar';
import { MONTH_NAMES, useLeaveStatusScreen } from './useLeaveStatusScreen';
import {
  styles,
  getBackgroundImageStyle,
  getSafeAreaStyle,
  getHeaderTitleStyle,
  getTopSummaryCardStyle,
  getSummaryMetricValueStyle,
  getSummaryMetricLabelStyle,
  getSummaryMetricDividerStyle,
  getCarryForwardBtnStyle,
  getCarryForwardBtnTextStyle,
  getViewHistoryBtnStyle,
  getMonthTitleStyle,
  getNavChevronBtnStyle,
  getFilterPillStyle,
  getFilterPillTextStyle,
  getFilterDividerStyle,
  getApprovedLegendBoxStyle,
  getLegendDividerStyle,
  getLegendTextStyle,
  getAttendancePillStyle,
  getAttendancePillTextStyle,
} from './LeaveStatusScreen.styles';

export function LeaveStatusScreen(): React.JSX.Element {
  const {
    isDark,
    isLoading,
    loadError,
    selectedLeaveType,
    leaveTypeTabs,
    leaveSummary,
    currentYear,
    currentMonth,
    selectedFilter,
    selectedDate,
    formattedSelectedDate,
    isCarryForwardsOpen,
    carryForwardInfo,
    calendarDays,
    displayedRecords,
    approvedDates,
    pendingDates,
    rejectedDates,
    handleSelectLeaveType,
    handlePrevMonth,
    handleNextMonth,
    handleToggleFilter,
    handleSelectDatePress,
    handleDayPress,
    handleOpenCarryForwards,
    handleCloseCarryForwards,
    handleViewLeaveHistory,
    handleAttendancePress,
    handleEditLeaveRequest,
    handleRetryLoad,
    handleBack,
  } = useLeaveStatusScreen();

  return (
    <View style={getBackgroundImageStyle(isDark)}>
      <SafeAreaView style={getSafeAreaStyle(isDark)} edges={['top', 'bottom']}>
        <KeyboardAvoidingScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRetryLoad}
              tintColor={isDark ? '#60A5FA' : '#1D4ED8'}
              colors={['#1D4ED8']}
            />
          }
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
              testID="leave-status-back-btn"
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Feather name="chevron-left" size={24} color={isDark ? '#F8FAFC' : '#0F172A'} />
              <Text style={getHeaderTitleStyle(isDark)}>Leave status</Text>
            </TouchableOpacity>
          </View>

          {loadError ? (
            <TouchableOpacity
              style={styles.errorBanner}
              onPress={handleRetryLoad}
              activeOpacity={0.75}
              testID="leave-status-retry-banner"
              accessibilityRole="button"
              accessibilityLabel="Retry loading leave status"
            >
              <Text style={styles.errorBannerText}>{loadError} Tap to retry.</Text>
            </TouchableOpacity>
          ) : null}

          {/* Leave Type Segmented Switcher */}
          <LeaveTypeSegmentedBar
            tabs={leaveTypeTabs}
            selectedLeaveType={selectedLeaveType}
            isDark={isDark}
            onSelectLeaveType={handleSelectLeaveType}
          />

          {isLoading ? (
            <LeaveStatusShimmer isDark={isDark} />
          ) : (
            <>
              {/* Top Summary & Actions Card */}
              <GlassCard
                intensity={20}
                tint={isDark ? 'dark' : 'light'}
                style={getTopSummaryCardStyle(isDark)}
              >
            <View style={styles.summaryMetricsRow}>
              <View style={styles.summaryMetricItem}>
                <AnimatedCounterDigits
                  value={leaveSummary.totalLeaves}
                  textStyle={getSummaryMetricValueStyle(isDark)}
                  testID="summary-total-leaves"
                />
                <Text style={getSummaryMetricLabelStyle(isDark)}>Total leaves</Text>
              </View>

              <View style={getSummaryMetricDividerStyle(isDark)} />

              <View style={styles.summaryMetricItem}>
                <AnimatedCounterDigits
                  value={leaveSummary.balanceLeaves}
                  textStyle={getSummaryMetricValueStyle(isDark)}
                  testID="summary-balance-leaves"
                />
                <Text style={getSummaryMetricLabelStyle(isDark)}>Balance leaves</Text>
              </View>

              <View style={getSummaryMetricDividerStyle(isDark)} />

              <View style={styles.summaryMetricItem}>
                <AnimatedCounterDigits
                  value={leaveSummary.leavesTaken}
                  textStyle={getSummaryMetricValueStyle(isDark)}
                  testID="summary-leaves-taken"
                />
                <Text style={getSummaryMetricLabelStyle(isDark)}>Leaves taken</Text>
              </View>
            </View>

            <View style={styles.topCardActionsRow}>
              <TouchableOpacity
                style={getCarryForwardBtnStyle(isDark)}
                onPress={handleOpenCarryForwards}
                activeOpacity={0.75}
                testID="carry-forwards-btn"
                accessibilityRole="button"
                accessibilityLabel="Carry forwards"
              >
                <Text style={getCarryForwardBtnTextStyle(isDark)} numberOfLines={1}>
                  Carry forwards
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={getViewHistoryBtnStyle(isDark)}
                onPress={handleViewLeaveHistory}
                activeOpacity={0.8}
                testID="view-leave-history-btn"
                accessibilityRole="button"
                accessibilityLabel="view leave history"
              >
                <Text style={styles.viewHistoryBtnText} numberOfLines={1}>
                  view leave history
                </Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* Month & Year Navigation Row */}
          <View style={styles.monthHeaderRow}>
            <View style={styles.monthTitleRow}>
              <Text style={getMonthTitleStyle(isDark)} testID="current-month-label">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </Text>
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={isDark ? '#60A5FA' : '#1D4ED8'}
                  testID="leave-status-loading"
                />
              ) : null}
            </View>

            <View style={styles.monthNavButtons}>
              <TouchableOpacity
                onPress={handlePrevMonth}
                style={getNavChevronBtnStyle(isDark)}
                activeOpacity={0.7}
                testID="prev-month-btn"
                accessibilityRole="button"
                accessibilityLabel="Previous month"
              >
                <Feather name="chevron-left" size={18} color={isDark ? '#F8FAFC' : '#0F172A'} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNextMonth}
                style={getNavChevronBtnStyle(isDark)}
                activeOpacity={0.7}
                testID="next-month-btn"
                accessibilityRole="button"
                accessibilityLabel="Next month"
              >
                <Feather name="chevron-right" size={18} color={isDark ? '#F8FAFC' : '#0F172A'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Filters Row */}
          <View style={styles.filtersRow}>
            <TouchableOpacity
              style={getFilterPillStyle(isDark)}
              onPress={handleToggleFilter}
              activeOpacity={0.7}
              testID="filter-by-status-btn"
              accessibilityRole="button"
            >
              <Feather name="filter" size={13} color={isDark ? '#60A5FA' : '#2563EB'} />
              <Text style={getFilterPillTextStyle(isDark)}>
                {selectedFilter === 'all'
                  ? 'Filter by status'
                  : `Status: ${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}`}
              </Text>
              <Feather name="chevron-down" size={13} color={isDark ? '#60A5FA' : '#2563EB'} />
            </TouchableOpacity>

            <View style={getFilterDividerStyle(isDark)} />

            <TouchableOpacity
              style={getFilterPillStyle(isDark)}
              onPress={handleSelectDatePress}
              activeOpacity={0.7}
              testID="select-date-btn"
              accessibilityRole="button"
            >
              <Feather name="calendar" size={13} color={isDark ? '#60A5FA' : '#2563EB'} />
              <Text style={getFilterPillTextStyle(isDark)}>
                {formattedSelectedDate ?? 'Select date'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Calendar Card */}
          <LeaveCalendarCard
            currentYear={currentYear}
            currentMonth={currentMonth}
            calendarDays={calendarDays}
            selectedFilter={selectedFilter}
            selectedDate={selectedDate}
            approvedDates={approvedDates}
            pendingDates={pendingDates}
            rejectedDates={rejectedDates}
            isDark={isDark}
            onDayPress={handleDayPress}
          />

          {/* Status Legend + Attendance Navigation Pill Row */}
          <View style={styles.legendAndAttendanceRow}>
            <View style={styles.legendGroup}>
              <View style={styles.legendItem}>
                <View style={getApprovedLegendBoxStyle(isDark)}>
                  <Feather name="check" size={12} color="#10B981" />
                </View>
                <Text style={getLegendTextStyle(isDark)}>Approved</Text>
              </View>

              <View style={getLegendDividerStyle(isDark)} />

              <View style={styles.legendItem}>
                <Feather name="clock" size={15} color={isDark ? '#FBBF24' : '#EAB308'} />
                <Text style={getLegendTextStyle(isDark)}>Pending</Text>
              </View>
            </View>

            <TouchableOpacity
              style={getAttendancePillStyle(isDark)}
              onPress={handleAttendancePress}
              activeOpacity={0.75}
              testID="attendance-nav-btn"
              accessibilityRole="button"
              accessibilityLabel="Attendance"
            >
              <Text style={getAttendancePillTextStyle(isDark)}>Attendance</Text>
              <Feather name="chevron-right" size={15} color={isDark ? '#60A5FA' : '#1D5BD8'} />
            </TouchableOpacity>
          </View>

          {/* Approval Status Card */}
          <LeaveApprovalCard
            records={displayedRecords}
            selectedLeaveType={selectedLeaveType}
            isDark={isDark}
            onEditRecord={handleEditLeaveRequest}
          />
            </>
          )}
        </KeyboardAvoidingScrollView>
      </SafeAreaView>

      <CarryForwardsSheet
        isOpen={isCarryForwardsOpen}
        info={carryForwardInfo}
        isDark={isDark}
        onClose={handleCloseCarryForwards}
      />
    </View>
  );
}
