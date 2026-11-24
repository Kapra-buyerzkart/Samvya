import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import { TactilePressable } from '@/shared/animations';
import {
  AppBottomSheet,
  CircularProgressDial,
  KeyboardAvoidingScrollView,
} from '@/shared/components';
import { useHomeScreen } from './useHomeScreen';
import {
  styles,
  getBackgroundImageStyle,
  getImageStyle,
  getScrollContentStyle,
  getBrandTitleStyle,
  getHeaderDateStyle,
  getDropdownCardStyle,
  getDropdownLabelStyle,
  getDropdownValueStyle,
  getShiftBannerStyle,
  getShiftLabelStyle,
  getShiftDividerStyle,
  getShiftTimeStyle,
  getStatusIndicatorTextStyle,
  getWorkedLabelStyle,
  getWorkedTimeStyle,
  getWorkedTargetStyle,
  getInfoBarStyle,
  getInfoBarTextMutedStyle,
  getInfoBarTextBoldStyle,
  getInfoBarDividerStyle,
  getBreakButtonStyle,
  getPunchOutButtonStyle,
  getPunchOutButtonTextStyle,
  getPunchNoteStyle,
  getSectionDividerStyle,
  getWeeklyTitleStyle,
  getWeeklyStatsStyle,
  getProgressBarTrackStyle,
  getProgressBarFillStyle,
  getLeaveHeaderBannerStyle,
  getLeaveHeaderTitleStyle,
  getLeaveMetricLabelStyle,
  getLeaveMetricAllocatedStyle,
  getLeaveMetricDividerStyle,
  getViewHistoryButtonStyle,
  getModalItemStyle,
  getModalItemTextStyle,
} from './HomeScreen.styles';

export function HomeScreen(): React.JSX.Element {
  const {
    timer,
    isDark,
    showHoursModal,
    showLocationModal,
    hoursOptions,
    locationOptions,
    setShowHoursModal,
    setShowLocationModal,
    handleToggleBreak,
    handlePunchOut,
    handlePunchIn,
    handleRequestLeave,
    handleViewLeaveHistory,
    handleOpenWeeklyDetails,
    handleSelectHoursType,
    handleSelectLocation,
  } = useHomeScreen();

  return (
    <ImageBackground
      source={require('../../../../../assets/images/background.png')}
      style={getBackgroundImageStyle(isDark)}
      imageStyle={getImageStyle(isDark)}
      contentFit="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingScrollView
          contentContainerStyle={getScrollContentStyle(timer.isPunchedOut)}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Row: Brand and Date */}
          <View style={styles.headerRow}>
            <Text style={getBrandTitleStyle(isDark)}>
              Samavya
            </Text>
            <Text style={getHeaderDateStyle(isDark)}>
              Thu 12 Nov 2026
            </Text>
          </View>

          {/* Top Dropdowns: Hours & Location */}
          <View style={styles.dropdownsRow}>
            {/* Hours Selector */}
            <TactilePressable
              style={getDropdownCardStyle(isDark)}
              onPress={() => setShowHoursModal(true)}
              activeScale={0.97}
              accessibilityRole="button"
              accessibilityLabel="Select Work Hours"
            >
              <View style={styles.dropdownIconContainer}>
                <Feather name="clock" size={20} color={isDark ? '#60A5FA' : '#0F172A'} />
              </View>
              <View style={styles.dropdownTextCol}>
                <Text style={getDropdownLabelStyle(isDark)}>
                  Hours
                </Text>
                <Text style={getDropdownValueStyle(isDark)}>
                  {timer.hoursType}
                </Text>
              </View>
              <Feather name="chevron-down" size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            </TactilePressable>

            {/* Location Selector */}
            <TactilePressable
              style={getDropdownCardStyle(isDark)}
              onPress={() => setShowLocationModal(true)}
              activeScale={0.97}
              accessibilityRole="button"
              accessibilityLabel="Select Work Location"
            >
              <View style={styles.dropdownIconContainer}>
                <Feather name="home" size={20} color={isDark ? '#60A5FA' : '#0F172A'} />
              </View>
              <View style={styles.dropdownTextCol}>
                <Text style={getDropdownLabelStyle(isDark)}>
                  Location
                </Text>
                <Text
                  style={getDropdownValueStyle(isDark)}
                  numberOfLines={1}
                >
                  {timer.workLocation}
                </Text>
              </View>
              <Feather name="chevron-down" size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            </TactilePressable>
          </View>

          {/* Shift Banner */}
          <View style={getShiftBannerStyle(isDark)}>
            <View style={styles.shiftLeft}>
              <Feather name="calendar" size={16} color={isDark ? '#94A3B8' : '#64748B'} />
              <Text style={getShiftLabelStyle(isDark)}>
                Shift
              </Text>
            </View>
            <View style={getShiftDividerStyle(isDark)} />
            <Text style={getShiftTimeStyle(isDark)}>
              09:00 AM - 06 : 00 PM
            </Text>
          </View>

          {/* Working Status Indicator */}
          <View style={styles.statusIndicatorRow}>
            <Feather
              name={timer.isOnBreak ? 'coffee' : 'clock'}
              size={18}
              color={timer.isOnBreak ? '#D97706' : timer.isWorking ? '#2563EB' : '#64748B'}
            />
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
          <View style={styles.dialWrapper}>
            <CircularProgressDial
              size={220}
              strokeWidth={10}
              progress={timer.progressFraction}
              trackColor={isDark ? '#1E293B' : '#DDEBFC'}
              progressColor={isDark ? '#3B82F6' : '#1D4ED8'}
              knobColor={isDark ? '#1E293B' : '#FFFFFF'}
              knobBorderColor={isDark ? '#3B82F6' : '#1D4ED8'}
              centerDiscColor={isDark ? '#0F172A' : '#FFFFFF'}
              knobSize={18}
              isActive={timer.isWorking}
              showAura={true}
            >
              <Text style={getWorkedLabelStyle(isDark)}>
                Worked today
              </Text>
              <Text
                style={getWorkedTimeStyle(isDark)}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {timer.workedDisplay}
              </Text>
              <Text style={getWorkedTargetStyle(isDark)}>
                of 8h
              </Text>
            </CircularProgressDial>
          </View>

          {/* Break and Remaining Info Bar */}
          <View style={getInfoBarStyle(isDark)}>
            <View style={styles.infoBarItem}>
              <Feather name="coffee" size={16} color={isDark ? '#94A3B8' : '#475569'} />
              <Text style={getInfoBarTextMutedStyle(isDark)}>
                {' '}Break{' '}
              </Text>
              <Text style={getInfoBarTextBoldStyle(isDark)}>
                {timer.breakDisplay}
              </Text>
            </View>
            <View style={getInfoBarDividerStyle(isDark)} />
            <View style={styles.infoBarItem}>
              <Feather name="clock" size={16} color={isDark ? '#94A3B8' : '#475569'} />
              <Text style={getInfoBarTextBoldStyle(isDark)}>
                {' '}{timer.remainingDisplay}{' '}
              </Text>
              <Text style={getInfoBarTextMutedStyle(isDark)}>
                remaining
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TactilePressable
              style={getBreakButtonStyle(Boolean(timer.isOnBreak), Boolean(timer.isPunchedOut))}
              onPress={handleToggleBreak}
              disabled={timer.isPunchedOut}
              activeScale={0.95}
            >
              <Feather name={timer.isOnBreak ? 'play' : 'pause'} size={18} color="#FFFFFF" />
              <Text style={styles.breakButtonText}>
                {timer.isOnBreak ? 'Resume work' : 'Start break'}
              </Text>
            </TactilePressable>

            <TactilePressable
              style={getPunchOutButtonStyle(isDark, Boolean(timer.isPunchedOut))}
              onPress={timer.isPunchedOut ? handlePunchIn : handlePunchOut}
              activeScale={0.95}
            >
              <Feather
                name={timer.isPunchedOut ? 'log-in' : 'log-out'}
                size={18}
                color={timer.isPunchedOut ? '#FFFFFF' : isDark ? '#F8FAFC' : '#0F172A'}
              />
              <Text style={getPunchOutButtonTextStyle(isDark, Boolean(timer.isPunchedOut))}>
                {timer.isPunchedOut ? 'Punch in' : 'Punch out'}
              </Text>
            </TactilePressable>
          </View>

          {/* Helper Subtext */}
          <Text style={getPunchNoteStyle(isDark)}>
            {timer.isPunchedOut
              ? 'Punch-in requires a live photo and location.'
              : 'Punch-out requires a live photo and location.'}
          </Text>

          {/* Subtle Horizontal Divider */}
          <View style={getSectionDividerStyle(isDark)} />

          {/* Weekly Work Progress -> Tap to open Employment Details */}
          <TactilePressable
            style={styles.weeklyCard}
            onPress={handleOpenWeeklyDetails}
            activeScale={0.99}
            accessibilityRole="button"
            accessibilityLabel="View employment details and weekly work hours"
          >
            <View style={styles.weeklyHeader}>
              <View style={styles.weeklyTitleRow}>
                <Feather name="calendar" size={16} color={isDark ? '#94A3B8' : '#475569'} />
                <Text style={getWeeklyTitleStyle(isDark)}>
                  Weekly work
                </Text>
              </View>
              <Text style={getWeeklyStatsStyle(isDark)}>
                25h 30m / 40h
              </Text>
            </View>
            <View style={getProgressBarTrackStyle(isDark)}>
              <View style={getProgressBarFillStyle(isDark)} />
            </View>
          </TactilePressable>

          {/* Subtle Horizontal Divider */}
          <View style={getSectionDividerStyle(isDark)} />

          {/* Leave Balance Section */}
          <View style={styles.leaveSection}>
            <TactilePressable
              style={getLeaveHeaderBannerStyle(isDark)}
              onPress={handleRequestLeave}
              activeScale={0.98}
              accessibilityRole="button"
              accessibilityLabel="Request leave"
            >
              <View style={styles.leaveHeaderLeft}>
                <Feather name="calendar" size={16} color={isDark ? '#60A5FA' : '#1D4ED8'} />
                <Text style={getLeaveHeaderTitleStyle(isDark)}>
                  Leave balance
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={isDark ? '#94A3B8' : '#475569'} />
            </TactilePressable>

            <TactilePressable
              style={styles.leaveMetricsRow}
              onPress={handleRequestLeave}
              activeScale={0.98}
            >
              {/* Days Remaining */}
              <View style={styles.leaveMetricCol}>
                <Text style={[styles.leaveMetricNumber, styles.leaveMetricBlue]}>
                  14
                </Text>
                <Text style={getLeaveMetricLabelStyle(isDark)}>
                  days remaining
                </Text>
              </View>

              <View style={getLeaveMetricDividerStyle(isDark)} />

              {/* Days Allocated */}
              <View style={styles.leaveMetricCol}>
                <Text style={getLeaveMetricAllocatedStyle(isDark)}>
                  18
                </Text>
                <Text style={getLeaveMetricLabelStyle(isDark)}>
                  days allocated
                </Text>
              </View>

              <View style={getLeaveMetricDividerStyle(isDark)} />

              {/* Days Taken */}
              <View style={styles.leaveMetricCol}>
                <Text style={getLeaveMetricAllocatedStyle(isDark)}>
                  4
                </Text>
                <Text style={getLeaveMetricLabelStyle(isDark)}>
                  days taken
                </Text>
              </View>
            </TactilePressable>
          </View>

          {/* View Leave History Action Button */}
          <TactilePressable
            style={getViewHistoryButtonStyle(isDark)}
            onPress={handleViewLeaveHistory}
            activeScale={0.97}
            accessibilityRole="button"
            accessibilityLabel="View Leave history"
          >
            <Text style={styles.viewHistoryButtonText}>View Leave history</Text>
            <Feather name="arrow-right" size={18} color="#FFFFFF" />
          </TactilePressable>
        </KeyboardAvoidingScrollView>
      </SafeAreaView>

      {/* Hours Selector Bottom Sheet */}
      <AppBottomSheet
        isOpen={showHoursModal}
        onClose={() => setShowHoursModal(false)}
        title="Select Work Hours"
        testID="hours-bottom-sheet"
      >
        <View style={styles.sheetList}>
          {hoursOptions.map((type) => (
            <TouchableOpacity
              key={type}
              style={getModalItemStyle(isDark, timer.hoursType === type)}
              onPress={() => handleSelectHoursType(type)}
              activeOpacity={0.7}
            >
              <Text style={getModalItemTextStyle(isDark, timer.hoursType === type)}>
                {type}
              </Text>
              {timer.hoursType === type && (
                <Feather name="check" size={18} color={isDark ? '#60A5FA' : '#1D4ED8'} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </AppBottomSheet>

      {/* Location Selector Bottom Sheet */}
      <AppBottomSheet
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        title="Select Work Location"
        testID="location-bottom-sheet"
      >
        <View style={styles.sheetList}>
          {locationOptions.map((loc) => (
            <TouchableOpacity
              key={loc}
              style={getModalItemStyle(isDark, timer.workLocation === loc)}
              onPress={() => handleSelectLocation(loc)}
              activeOpacity={0.7}
            >
              <Text style={getModalItemTextStyle(isDark, timer.workLocation === loc)}>
                {loc}
              </Text>
              {timer.workLocation === loc && (
                <Feather name="check" size={18} color={isDark ? '#60A5FA' : '#1D4ED8'} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </AppBottomSheet>
    </ImageBackground>
  );
}
