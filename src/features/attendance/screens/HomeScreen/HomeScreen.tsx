import { TactilePressable } from '@/shared/animations';
import { CircularProgressDial } from '@/shared/components';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeLeaveInsights } from './components/HomeLeaveInsights';
import { HomeModals } from './components/HomeModals';
import { HomeQuickActions } from './components/HomeQuickActions';
import { WeeklyWorkCard } from './components/WeeklyWorkCard';
import {
  getBackgroundImageStyle,
  getBreakButtonStyle,
  getDropdownCardStyle,
  getDropdownLabelStyle,
  getDropdownValueStyle,
  getGreetingNameStyle,
  getGreetingTextStyle,
  getHeaderDateStyle,
  getInfoBarDividerStyle,
  getInfoBarStyle,
  getInfoBarTextBoldStyle,
  getInfoBarTextMutedStyle,
  getLeaveStatusCardStyle,
  getLeaveStatusIconBoxStyle,
  getLeaveStatusSubtitleStyle,
  getLeaveStatusTitleStyle,
  getPunchNoteStyle,
  getPunchOutButtonStyle,
  getPunchOutButtonTextStyle,
  getScrollContentStyle,
  getSectionDividerStyle,
  getShiftBannerStyle,
  getShiftDividerStyle,
  getShiftLabelStyle,
  getShiftTimeStyle,
  getStatusIndicatorTextStyle,
  styles,
} from './HomeScreen.styles';
import { useHomeScreen } from './useHomeScreen';

export function HomeScreen(): React.JSX.Element {
  const {
    timer,
    isDark,
    isPunchSubmitting,
    isRefreshing,
    greetingLabel,
    displayName,
    formattedDateLabel,
    showHoursModal,
    showLocationModal,
    showHolidayModal,
    showPayslipModal,
    showTeamModal,
    hoursOptions,
    locationOptions,
    weeklyLoggedDisplay,
    weeklyTargetHours,
    weeklyProgressPercent,
    weeklyDays,
    selectedWeeklyDayId,
    leaveRings,
    holidays,
    holidayRemainingCount,
    holidayObservedCount,
    holidayTotalCount,
    leaveHistoryTotal,
    leaveDaysTaken,
    leaveDaysLeft,
    payslipPreview,
    setShowHoursModal,
    setShowLocationModal,
    setShowHolidayModal,
    setShowPayslipModal,
    setShowTeamModal,
    setSelectedWeeklyDayId,
    handleToggleBreak,
    handlePunchOut,
    handlePunchIn,
    handleApplyLeave,
    handleOpenTimeSheet,
    handleOpenPayslip,
    handleOpenTeam,
    handleLeaveStatus,
    handleViewLeaveHistory,
    handleOpenWeeklyDetails,
    handleOpenHolidayCalendar,
    handleSelectHoursType,
    handleSelectLocation,
    handleRefresh,
  } = useHomeScreen();

  const statusOuterColor = timer.isOnBreak
    ? isDark
      ? 'rgba(217, 119, 6, 0.25)'
      : '#FEF3C7'
    : timer.isWorking
      ? isDark
        ? 'rgba(59, 130, 246, 0.25)'
        : '#D8E3FC'
      : isDark
        ? 'rgba(100, 116, 139, 0.25)'
        : '#E2E8F0';

  const statusInnerColor = timer.isOnBreak ? '#D97706' : timer.isWorking ? '#1D4ED8' : '#64748B';

  return (
    <View style={getBackgroundImageStyle(isDark)}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={getScrollContentStyle(timer.isPunchedOut)}
          showsVerticalScrollIndicator={false}
          bounces={true}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={isDark ? '#60A5FA' : '#1D4ED8'}
              colors={['#1D4ED8']}
            />
          }
        >
          {/* Header Row: Personal Greeting and Date */}
          <View style={styles.headerRow}>
            <View style={styles.greetingCol}>
              <Text style={getGreetingTextStyle(isDark)}>{greetingLabel}</Text>
              <Text
                style={getGreetingNameStyle(isDark)}
                numberOfLines={1}
                testID="home-greeting-name"
              >
                Hello, {displayName}
              </Text>
            </View>
            <Text style={getHeaderDateStyle(isDark)} testID="home-header-date">
              {formattedDateLabel}
            </Text>
          </View>

          {/* Top Dropdowns: Hours & Location */}
          <View style={styles.dropdownsRow}>
            <TactilePressable
              style={getDropdownCardStyle(isDark)}
              onPress={() => setShowHoursModal(true)}
              activeScale={0.97}
              accessibilityRole="button"
              accessibilityLabel="Select Work Hours"
            >
              <View style={styles.dropdownIconContainer}>
                <Feather name="clock" size={18} color={isDark ? '#60A5FA' : '#475569'} />
              </View>
              <View style={styles.dropdownTextCol}>
                <Text style={getDropdownLabelStyle(isDark)}>Hours</Text>
                <Text style={getDropdownValueStyle(isDark)}>{timer.hoursType}</Text>
              </View>
              <Feather name="chevron-down" size={16} color={isDark ? '#94A3B8' : '#64748B'} />
            </TactilePressable>

            <TactilePressable
              style={getDropdownCardStyle(isDark)}
              onPress={() => setShowLocationModal(true)}
              activeScale={0.97}
              accessibilityRole="button"
              accessibilityLabel="Select Work Location"
            >
              <View style={styles.dropdownIconContainer}>
                <Feather name="home" size={18} color={isDark ? '#60A5FA' : '#475569'} />
              </View>
              <View style={styles.dropdownTextCol}>
                <Text style={getDropdownLabelStyle(isDark)}>Location</Text>
                <Text style={getDropdownValueStyle(isDark)} numberOfLines={1}>
                  {timer.workLocation}
                </Text>
              </View>
              <Feather name="chevron-down" size={16} color={isDark ? '#94A3B8' : '#64748B'} />
            </TactilePressable>
          </View>

          {/* Shift Banner */}
          <View style={getShiftBannerStyle(isDark)} pointerEvents="none">
            <View style={styles.shiftLeft}>
              <Feather name="calendar" size={15} color={isDark ? '#94A3B8' : '#475569'} />
              <Text style={getShiftLabelStyle(isDark)}>Shift</Text>
            </View>
            <View style={getShiftDividerStyle(isDark)} />
            <Text style={getShiftTimeStyle(isDark)}>09:00 AM - 06 : 00 PM</Text>
          </View>

          {/* Working Status Indicator */}
          <View style={styles.statusIndicatorRow} pointerEvents="none">
            <View style={[styles.statusDotOuter, { backgroundColor: statusOuterColor }]}>
              <View style={[styles.statusDotInner, { backgroundColor: statusInnerColor }]} />
            </View>
            <Text
              style={getStatusIndicatorTextStyle(
                isDark,
                Boolean(timer.isOnBreak),
                Boolean(timer.isPunchedOut),
              )}
            >
              {timer.isOnBreak ? 'On break' : timer.isWorking ? 'Working' : 'Off duty'}
            </Text>
          </View>

          {/* Circular Progress Hero Dial */}
          <View style={styles.dialWrapper} pointerEvents="none">
            <CircularProgressDial
              size={212}
              strokeWidth={11}
              centerDiscGap={0}
              progress={timer.progressFraction}
              trackColor={isDark ? '#1E293B' : '#B5CBF7'}
              progressColor={isDark ? '#3B82F6' : '#3B6FE2'}
              knobColor={isDark ? '#1E293B' : '#FFFFFF'}
              knobBorderColor={isDark ? '#60A5FA' : '#1D4ED8'}
              centerDiscColor={isDark ? '#1E3A8A' : '#1945B5'}
              knobSize={16}
              isActive={timer.isWorking}
              showAura={true}
            >
              <Text style={styles.workedLabel}>Worked today</Text>
              <Text style={styles.workedTime} numberOfLines={1} adjustsFontSizeToFit>
                {timer.workedDisplay}
              </Text>
              <Text style={styles.workedTarget}>of 8h</Text>
            </CircularProgressDial>
          </View>

          {/* Break and Remaining Info Bar */}
          <View style={getInfoBarStyle(isDark)} pointerEvents="none">
            <View style={styles.infoBarItem}>
              <Feather name="coffee" size={15} color={isDark ? '#94A3B8' : '#64748B'} />
              <Text style={getInfoBarTextMutedStyle(isDark)}> Break </Text>
              <Text style={getInfoBarTextBoldStyle(isDark)}>{timer.breakDisplay}</Text>
            </View>
            <View style={getInfoBarDividerStyle(isDark)} />
            <View style={styles.infoBarItem}>
              <Feather name="clock" size={15} color={isDark ? '#94A3B8' : '#64748B'} />
              <Text style={getInfoBarTextBoldStyle(isDark)}> {timer.remainingDisplay} </Text>
              <Text style={getInfoBarTextMutedStyle(isDark)}>remaining</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow} pointerEvents="box-none">
            <TactilePressable
              style={getBreakButtonStyle(Boolean(timer.isOnBreak), Boolean(timer.isPunchedOut))}
              onPress={handleToggleBreak}
              disabled={timer.isPunchedOut}
              activeScale={0.95}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel={timer.isOnBreak ? 'Resume work' : 'Start break'}
              testID="btn-break-toggle"
            >
              <Feather name={timer.isOnBreak ? 'play' : 'pause'} size={17} color="#FFFFFF" />
              <Text style={styles.breakButtonText}>
                {timer.isOnBreak ? 'Resume work' : 'Start break'}
              </Text>
            </TactilePressable>

            <TactilePressable
              style={getPunchOutButtonStyle(isDark, Boolean(timer.isPunchedOut), isPunchSubmitting)}
              onPress={timer.isPunchedOut ? handlePunchIn : handlePunchOut}
              disabled={isPunchSubmitting}
              activeScale={0.95}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel={timer.isPunchedOut ? 'Punch in' : 'Punch out'}
              testID="btn-punch-action"
            >
              {isPunchSubmitting ? (
                <ActivityIndicator
                  size="small"
                  color={timer.isPunchedOut ? '#FFFFFF' : isDark ? '#F8FAFC' : '#0F172A'}
                />
              ) : (
                <Feather
                  name={timer.isPunchedOut ? 'log-in' : 'log-out'}
                  size={17}
                  color={timer.isPunchedOut ? '#FFFFFF' : isDark ? '#F8FAFC' : '#0F172A'}
                />
              )}
              <Text style={getPunchOutButtonTextStyle(isDark, Boolean(timer.isPunchedOut))}>
                {isPunchSubmitting
                  ? timer.isPunchedOut
                    ? 'Punching in...'
                    : 'Punching out...'
                  : timer.isPunchedOut
                    ? 'Punch in'
                    : 'Punch out'}
              </Text>
            </TactilePressable>
          </View>

          {/* Helper Subtext */}
          <Text style={getPunchNoteStyle(isDark)} pointerEvents="none">
            {timer.isPunchedOut
              ? 'Punch-in requires a live photo and location.'
              : 'Punch-out requires a live photo and location.'}
          </Text>

          {/* Subtle Horizontal Divider */}
          <View style={getSectionDividerStyle(isDark)} />

          {/* Quick Actions Grid */}
          <HomeQuickActions
            isDark={isDark}
            onApplyLeave={handleApplyLeave}
            onTimeSheet={handleOpenTimeSheet}
            onPayslip={handleOpenPayslip}
            onTeam={handleOpenTeam}
          />

          {/* Immediate Access: Leave Status */}
          <TactilePressable
            style={getLeaveStatusCardStyle(isDark)}
            onPress={handleLeaveStatus}
            activeScale={0.98}
            accessibilityRole="button"
            accessibilityLabel="Leave status"
            testID="home-leave-status-btn"
          >
            <View style={getLeaveStatusIconBoxStyle(isDark)}>
              <Feather name="check-circle" size={18} color={isDark ? '#60A5FA' : '#2563EB'} />
            </View>
            <View style={styles.leaveStatusTextCol}>
              <Text style={getLeaveStatusTitleStyle(isDark)}>Leave status</Text>
              <Text style={getLeaveStatusSubtitleStyle(isDark)}>
                Check leave approvals, calendar & balances
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={isDark ? '#60A5FA' : '#2563EB'} />
          </TactilePressable>

          {/* Weekly Work Card with Interactive Daily Bars */}
          <WeeklyWorkCard
            isDark={isDark}
            loggedDisplay={weeklyLoggedDisplay}
            targetHours={weeklyTargetHours}
            progressPercent={weeklyProgressPercent}
            days={weeklyDays}
            selectedDayId={selectedWeeklyDayId}
            onSelectDay={setSelectedWeeklyDayId}
            onOpenEmploymentDetails={handleOpenWeeklyDetails}
          />

          {/* Employment Details, 3-Ring Leave Balance, Holiday & Leave History Bento */}
          <HomeLeaveInsights
            isDark={isDark}
            leaveRings={leaveRings}
            holidayRemainingCount={holidayRemainingCount}
            holidayObservedCount={holidayObservedCount}
            holidayTotalCount={holidayTotalCount}
            leaveHistoryTotal={leaveHistoryTotal}
            leaveDaysTaken={leaveDaysTaken}
            leaveDaysLeft={leaveDaysLeft}
            onOpenEmploymentDetails={handleOpenWeeklyDetails}
            onOpenLeaveStatus={handleLeaveStatus}
            onOpenHolidayCalendar={handleOpenHolidayCalendar}
            onOpenLeaveHistory={handleViewLeaveHistory}
          />
        </ScrollView>
      </SafeAreaView>

      <HomeModals
        isDark={isDark}
        showHoursModal={showHoursModal}
        showLocationModal={showLocationModal}
        showHolidayModal={showHolidayModal}
        showPayslipModal={showPayslipModal}
        showTeamModal={showTeamModal}
        hoursType={timer.hoursType}
        workLocation={timer.workLocation}
        hoursOptions={hoursOptions}
        locationOptions={locationOptions}
        holidays={holidays}
        payslipPreview={payslipPreview}
        onCloseHours={() => setShowHoursModal(false)}
        onCloseLocation={() => setShowLocationModal(false)}
        onCloseHoliday={() => setShowHolidayModal(false)}
        onClosePayslip={() => setShowPayslipModal(false)}
        onCloseTeam={() => setShowTeamModal(false)}
        onSelectHoursType={handleSelectHoursType}
        onSelectLocation={handleSelectLocation}
      />
    </View>
  );
}
