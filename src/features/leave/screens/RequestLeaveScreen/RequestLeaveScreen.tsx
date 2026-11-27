import { TactilePressable } from '@/shared/animations';
import { AppBottomSheet, AppCalendar, KeyboardAvoidingScrollView } from '@/shared/components';
import { RequestLeaveShimmer } from '../../components/LeaveShimmers';
import { palette } from '@/shared/theme';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getAddDateBtnTextStyle,
  getAvailableBadgeStyle,
  getAvailableBadgeTextStyle,
  getBreakdownDaysValueStyle,
  getBreakdownDividerStyle,
  getBreakdownDurationPillStyle,
  getBreakdownDurationTextStyle,
  getBreakdownEmptyTextStyle,
  getBreakdownHeaderStyle,
  getBreakdownWeekdayStyle,
  getDateBadgeDayBodyStyle,
  getDateBadgeDayTextStyle,
  getDateBadgeStyle,
  getLeaveStatusBtnStyle,
  getLeaveStatusBtnTextStyle,
  getLeaveTypeIconBoxStyle,
  getLeaveTypeSubtitleStyle,
  getLeaveTypeTitleStyle,
  getMonthTitleStyle,
  getNavTitleStyle,
  getReasonInputContainerStyle,
  getReasonInputStyle,
  getReasonTitleStyle,
  getSafeAreaStyle,
  getSheetItemStyle,
  getSheetItemSubtitleStyle,
  getSheetItemTitleStyle,
  getSubmitButtonStyle,
  getSummaryDividerStyle,
  getSummaryLabelStyle,
  getSummaryValueStyle,
  getSurfaceCardStyle,
  getTotalsBalanceValueStyle,
  getTotalsDividerStyle,
  getTotalsLabelStyle,
  getTotalsLeftLabelStyle,
  getTotalsValueStyle,
  styles,
} from './RequestLeaveScreen.styles';
import {
  formatDaysLabel,
  MONTH_NAMES,
  useRequestLeaveScreen,
} from './useRequestLeaveScreen';

export function RequestLeaveScreen(): React.JSX.Element {
  const {
    isDark,
    hasSession,
    currentYear,
    currentMonth,
    todayKey,
    startDate,
    endDate,
    reason,
    isLoadingData,
    loadError,
    isSubmitting,
    leaveTypes,
    selectedLeaveTypeId,
    selectedLeaveType,
    isLeaveTypeSheetOpen,
    setIsLeaveTypeSheetOpen,
    summary,
    calendarDays,
    selectedBreakdown,
    requestedDuration,
    balanceAfterApproval,
    setReason,
    handleSelectLeaveType,
    handleToggleBreakdownDuration,
    handleRemoveBreakdownDate,
    handleAddDatePress,
    handlePrevMonth,
    handleNextMonth,
    handleSelectDay,
    handleSubmit,
    handleRetryLoad,
    handleApprovalStatus,
    handleBack,
  } = useRequestLeaveScreen();

  const surfaceCardStyle = getSurfaceCardStyle(isDark);
  const leaveTypeDisplayName =
    selectedLeaveType?.name ?? (hasSession ? 'Select leave type' : 'Earned Leaves');

  return (
    <SafeAreaView style={getSafeAreaStyle(isDark)}>
      <KeyboardAvoidingScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        nestedScrollEnabled
        refreshControl={
          <RefreshControl
            refreshing={isLoadingData}
            onRefresh={handleRetryLoad}
            tintColor={isDark ? '#60A5FA' : '#1D4ED8'}
            colors={['#1D4ED8']}
          />
        }
      >
        {/* 1. Header Navigation Bar */}
        <View style={styles.navBar}>
          <View style={styles.navLeft}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Feather
                name="chevron-left"
                size={24}
                color={isDark ? palette.slate50 : palette.slate900}
              />
            </TouchableOpacity>
            <Text style={getNavTitleStyle(isDark)}>Request leave</Text>
            {isLoadingData ? (
              <ActivityIndicator
                size="small"
                color={isDark ? '#60A5FA' : palette.blue600}
                testID="request-leave-loading"
              />
            ) : null}
          </View>

          <View style={getAvailableBadgeStyle(isDark)}>
            <Text style={getAvailableBadgeTextStyle(isDark)} testID="available-days-badge">
              {summary ? `${formatDaysLabel(summary.available)} available` : '—'}
            </Text>
          </View>
        </View>

        {loadError ? (
          <TouchableOpacity
            style={styles.errorBanner}
            onPress={handleRetryLoad}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Retry loading leave balance and types"
            testID="request-leave-retry"
          >
            <Text style={styles.errorBannerText}>{loadError} Tap to retry.</Text>
          </TouchableOpacity>
        ) : null}

        {isLoadingData ? (
          <RequestLeaveShimmer isDark={isDark} />
        ) : (
          <>
            {/* 2. Leave Summary Metrics Card (Allocated / Taken / Pending) */}
            <View style={[styles.summaryRow, surfaceCardStyle]}>
          <View style={styles.summaryCol}>
            <Text style={getSummaryLabelStyle(isDark)}>Allocated</Text>
            <Text style={getSummaryValueStyle(isDark)} testID="summary-allocated-value">
              {summary ? formatDaysLabel(summary.allocated) : '—'}
            </Text>
          </View>

          <View style={getSummaryDividerStyle(isDark)} />

          <View style={styles.summaryCol}>
            <Text style={getSummaryLabelStyle(isDark)}>Taken</Text>
            <Text style={getSummaryValueStyle(isDark)} testID="summary-taken-value">
              {summary ? formatDaysLabel(summary.taken) : '—'}
            </Text>
          </View>

          <View style={getSummaryDividerStyle(isDark)} />

          <View style={styles.summaryCol}>
            <Text style={getSummaryLabelStyle(isDark)}>Pending</Text>
            <Text style={getSummaryValueStyle(isDark)} testID="summary-pending-value">
              {summary ? formatDaysLabel(summary.pending) : '—'}
            </Text>
          </View>
        </View>

        {/* 3. Leave Type Dropdown Card */}
        <TactilePressable
          style={[styles.leaveTypeCard, surfaceCardStyle]}
          onPress={() => {
            if (leaveTypes.length > 0) {
              setIsLeaveTypeSheetOpen(true);
            }
          }}
          activeScale={0.98}
          accessibilityRole="button"
          accessibilityLabel="Select leave type"
          testID="leave-type-dropdown"
        >
          <View style={styles.leaveTypeLeft}>
            <View style={getLeaveTypeIconBoxStyle(isDark)}>
              <Feather name="calendar" size={20} color={isDark ? '#60A5FA' : palette.blue600} />
            </View>
            <View style={styles.leaveTypeTextCol}>
              <Text style={getLeaveTypeTitleStyle(isDark)} testID="selected-leave-type-name">
                {leaveTypeDisplayName}
              </Text>
              <Text style={getLeaveTypeSubtitleStyle(isDark)}>
                {summary ? `${formatDaysLabel(summary.available)} available` : '—'}
              </Text>
            </View>
          </View>

          <Feather
            name="chevron-down"
            size={18}
            color={isDark ? palette.slate400 : palette.slate500}
          />
        </TactilePressable>
          </>
        )}

        {/* 4. Calendar Card */}
        <AppCalendar
          testID="request-leave-calendar-card"
          days={calendarDays}
          getDayTestID={(day) => `day-slot-${day.dateKey}`}
          getDayState={(day) => {
            const isStart = startDate === day.dateKey;
            const isEnd = endDate === day.dateKey;
            const isInRange = Boolean(
              startDate && endDate && day.dateKey > startDate && day.dateKey < endDate,
            );
            const isSingleSelected = isStart && (!endDate || startDate === endDate);
            const isSelected = isStart || isEnd || isSingleSelected;
            return {
              isSelected,
              isInRange: !isSelected && isInRange,
              isToday: day.dateKey === todayKey,
            };
          }}
          onDayPress={(day) => handleSelectDay(day.dateKey)}
          headerContent={
            <View style={styles.monthHeaderRow}>
              <Text style={getMonthTitleStyle(isDark)} testID="current-month-label">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </Text>
              <View style={styles.monthNavButtons}>
                <TactilePressable
                  onPress={handlePrevMonth}
                  style={styles.navChevronBtn}
                  activeScale={0.88}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel="Previous month"
                  testID="prev-month-btn"
                >
                  <Feather
                    name="chevron-left"
                    size={20}
                    color={isDark ? '#60A5FA' : palette.blue600}
                  />
                </TactilePressable>
                <TactilePressable
                  onPress={handleNextMonth}
                  style={styles.navChevronBtn}
                  activeScale={0.88}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel="Next month"
                  testID="next-month-btn"
                >
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={isDark ? '#60A5FA' : palette.blue600}
                  />
                </TactilePressable>
              </View>
            </View>
          }
        />

        {/* 5. Selected Breakdown Card */}
        <View style={[styles.breakdownCard, surfaceCardStyle]} testID="selected-breakdown-card">
          <Text style={getBreakdownHeaderStyle(isDark)}>SELECTED BREAKDOWN</Text>

          {selectedBreakdown.length > 0 ? (
            selectedBreakdown.map((item, idx) => (
              <React.Fragment key={item.dateKey}>
                {idx > 0 ? <View style={getBreakdownDividerStyle(isDark)} /> : null}
                <View style={styles.breakdownRow} testID={`breakdown-row-${item.dateKey}`}>
                  <View style={styles.breakdownLeft}>
                    <View style={getDateBadgeStyle(isDark)}>
                      <View style={styles.dateBadgeMonthBar}>
                        <Text style={styles.dateBadgeMonthText}>{item.monthShort}</Text>
                      </View>
                      <View style={getDateBadgeDayBodyStyle(isDark)}>
                        <Text style={getDateBadgeDayTextStyle(isDark)}>{item.dayNumber}</Text>
                      </View>
                    </View>

                    <View style={styles.breakdownMetaCol}>
                      <Text style={getBreakdownWeekdayStyle(isDark)}>{item.weekdayName}</Text>
                      <TouchableOpacity
                        style={getBreakdownDurationPillStyle(isDark)}
                        onPress={() => handleToggleBreakdownDuration(item.dateKey)}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel={`Toggle duration for ${item.dateKey}`}
                        testID={`breakdown-duration-${item.dateKey}`}
                      >
                        <Text style={getBreakdownDurationTextStyle(isDark)}>
                          {item.duration === 'half' ? 'Half day' : 'Full day'}
                        </Text>
                        <Feather
                          name="chevron-down"
                          size={13}
                          color={isDark ? palette.slate400 : palette.slate500}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.breakdownRight}>
                    <Text
                      style={getBreakdownDaysValueStyle(isDark)}
                      testID={`breakdown-days-${item.dateKey}`}
                    >
                      {item.daysValue.toFixed(1)} day
                    </Text>
                    <TouchableOpacity
                      style={styles.breakdownRemoveBtn}
                      onPress={() => handleRemoveBreakdownDate(item.dateKey)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${item.dateKey}`}
                      testID={`breakdown-remove-${item.dateKey}`}
                    >
                      <Feather
                        name="x"
                        size={16}
                        color={isDark ? palette.slate500 : palette.slate400}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </React.Fragment>
            ))
          ) : (
            <Text style={getBreakdownEmptyTextStyle(isDark)} testID="breakdown-empty-text">
              Tap dates on the calendar above to select your leave days.
            </Text>
          )}

          <TouchableOpacity
            style={styles.addDateBtn}
            onPress={handleAddDatePress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Add a date"
            testID="add-date-btn"
          >
            <Feather name="plus" size={15} color={isDark ? '#60A5FA' : palette.blue600} />
            <Text style={getAddDateBtnTextStyle(isDark)}>Add a date</Text>
          </TouchableOpacity>
        </View>

        {/* 6. Reason Card with Leave status pill */}
        <View style={[styles.reasonSection, surfaceCardStyle]}>
          <View style={styles.reasonHeaderRow}>
            <Text style={getReasonTitleStyle(isDark)}>Reason</Text>
            <TouchableOpacity
              onPress={handleApprovalStatus}
              style={getLeaveStatusBtnStyle(isDark)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Leave status"
              testID="approval-status-btn"
            >
              <Text style={getLeaveStatusBtnTextStyle(isDark)}>Leave status</Text>
              <Feather
                name="chevron-right"
                size={14}
                color={isDark ? '#93C5FD' : palette.blue600}
              />
            </TouchableOpacity>
          </View>

          <View style={getReasonInputContainerStyle(isDark)}>
            <TextInput
              style={getReasonInputStyle(isDark)}
              placeholder="Add a reason for your leave"
              placeholderTextColor={isDark ? palette.slate500 : palette.slate970}
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              testID="reason-input"
            />
          </View>
        </View>

        {/* 7. Total Requested & Balance After Approval Summary Card */}
        <View style={[styles.totalsCard, surfaceCardStyle]} testID="request-totals-card">
          <View style={styles.totalsCol}>
            <Text style={getTotalsLabelStyle(isDark)}>Total requested</Text>
            <Text style={getTotalsValueStyle(isDark)} testID="total-requested-value">
              {formatDaysLabel(requestedDuration.days)}
            </Text>
          </View>

          <View style={getTotalsDividerStyle(isDark)} />

          <View style={styles.totalsCol}>
            <Text style={getTotalsLabelStyle(isDark)}>Balance after approval</Text>
            <View style={styles.totalsValueRow}>
              <Text
                style={getTotalsBalanceValueStyle(isDark)}
                testID="balance-after-approval-value"
              >
                {summary ? formatDaysLabel(balanceAfterApproval) : '—'}
              </Text>
              {summary ? <Text style={getTotalsLeftLabelStyle(isDark)}>left</Text> : null}
            </View>
          </View>
        </View>

        {/* 8. Submit Request Button */}
        <TactilePressable
          style={getSubmitButtonStyle(isSubmitting)}
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
          <Feather name="arrow-right" size={20} color={palette.white} />
        </TactilePressable>
      </KeyboardAvoidingScrollView>

      {/* Leave Type Selector Bottom Sheet */}
      <AppBottomSheet
        isOpen={isLeaveTypeSheetOpen}
        onClose={() => setIsLeaveTypeSheetOpen(false)}
        title="Select Leave Type"
        testID="leave-type-sheet"
      >
        <View style={styles.sheetList}>
          {leaveTypes.map((type) => {
            const isSelected =
              selectedLeaveTypeId !== null && String(selectedLeaveTypeId) === String(type.id);
            return (
              <TouchableOpacity
                key={String(type.id)}
                style={getSheetItemStyle(isDark, isSelected)}
                onPress={() => handleSelectLeaveType(type.id)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                testID={`leave-type-pill-${String(type.id)}`}
              >
                <View style={styles.sheetItemTextCol}>
                  <Text style={getSheetItemTitleStyle(isDark, isSelected)}>{type.name}</Text>
                  {type.availableDays !== undefined ? (
                    <Text style={getSheetItemSubtitleStyle(isDark)}>
                      {formatDaysLabel(type.availableDays)} available
                    </Text>
                  ) : null}
                </View>

                {isSelected ? (
                  <Feather name="check" size={18} color={isDark ? '#60A5FA' : palette.blue700} />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </AppBottomSheet>
    </SafeAreaView>
  );
}
