import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import { TactilePressable } from '@/shared/animations';
import { GlassCard, KeyboardAvoidingScrollView } from '@/shared/components';
import {
  MONTH_NAMES,
  WEEKDAY_NAMES,
  useRequestLeaveScreen,
} from './useRequestLeaveScreen';
import {
  styles,
  getBackgroundImageStyle,
  getImageStyle,
  getSafeAreaStyle,
  getNavTitleStyle,
  getApprovalStatusBtnStyle,
  getApprovalStatusBtnTextStyle,
  getSummaryCardStyle,
  getSummaryLabelStyle,
  getSummaryValueStyle,
  getSummaryDividerStyle,
  getDurationToggleContainerStyle,
  getDurationToggleBtnStyle,
  getDurationToggleTextStyle,
  getDatePickerLabelStyle,
  getDatePickerValueStyle,
  getDatesVerticalDividerStyle,
  getSectionSeparatorStyle,
  getMonthTitleStyle,
  getNavChevronBtnStyle,
  getCardStyle,
  getWeekdayTextStyle,
  getDayNumberTextStyle,
  getInRangeContainerStyle,
  getInRangeDayNumberTextStyle,
  getReasonTitleStyle,
  getAvailableBadgeStyle,
  getAvailableBadgeTextStyle,
  getReasonInputStyle,
  getSubmitButtonStyle,
} from './RequestLeaveScreen.styles';

export function RequestLeaveScreen(): React.JSX.Element {
  const {
    isDark,
    currentYear,
    currentMonth,
    durationType,
    startDate,
    endDate,
    reason,
    isSubmitting,
    calendarDays,
    setDurationType,
    setReason,
    handlePrevMonth,
    handleNextMonth,
    handleSelectDay,
    formatDateDisplay,
    handleSubmit,
    handleApprovalStatus,
    handleBack,
    handleStartDatePress,
    handleEndDatePress,
  } = useRequestLeaveScreen();

  return (
    <ImageBackground
      source={require('../../../../../assets/images/background_home.png')}
      style={getBackgroundImageStyle(isDark)}
      imageStyle={getImageStyle(isDark)}
      contentFit="cover"
    >
      <SafeAreaView style={getSafeAreaStyle(isDark)}>
        <KeyboardAvoidingScrollView contentContainerStyle={styles.scrollContent}>
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
                <Feather name="chevron-left" size={24} color={isDark ? '#F8FAFC' : '#0F172A'} />
              </TouchableOpacity>
              <Text style={getNavTitleStyle(isDark)}>
                Request leave
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleApprovalStatus}
              style={getApprovalStatusBtnStyle(isDark)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Approval status"
              testID="approval-status-btn"
            >
              <Text style={getApprovalStatusBtnTextStyle(isDark)}>
                Approval status
              </Text>
              <Feather name="chevron-right" size={14} color={isDark ? '#93C5FD' : '#2563EB'} />
            </TouchableOpacity>
          </View>

          {/* 2. Leave Summary Card (Allocated / Taken / Pending) */}
          <View style={getSummaryCardStyle(isDark)}>
            <View style={styles.summaryCol}>
              <Text style={getSummaryLabelStyle(isDark)}>
                Allocated
              </Text>
              <Text style={getSummaryValueStyle(isDark)}>
                18 days
              </Text>
            </View>

            <View style={getSummaryDividerStyle(isDark)} />

            <View style={styles.summaryCol}>
              <Text style={getSummaryLabelStyle(isDark)}>
                Taken
              </Text>
              <Text style={getSummaryValueStyle(isDark)}>
                4 days
              </Text>
            </View>

            <View style={getSummaryDividerStyle(isDark)} />

            <View style={styles.summaryCol}>
              <Text style={getSummaryLabelStyle(isDark)}>
                Pending
              </Text>
              <Text style={getSummaryValueStyle(isDark)}>
                0 days
              </Text>
            </View>
          </View>

          {/* 3. Duration Segment Toggle (Full day / Half day) */}
          <View style={styles.durationRow}>
            <View style={getDurationToggleContainerStyle(isDark)}>
              <TactilePressable
                style={getDurationToggleBtnStyle(durationType === 'full')}
                onPress={() => setDurationType('full')}
                activeScale={0.96}
                accessibilityRole="button"
                accessibilityState={{ selected: durationType === 'full' }}
                testID="duration-full-btn"
              >
                <Text style={getDurationToggleTextStyle(isDark, durationType === 'full')}>
                  Full day
                </Text>
              </TactilePressable>

              <TactilePressable
                style={getDurationToggleBtnStyle(durationType === 'half')}
                onPress={() => setDurationType('half')}
                activeScale={0.96}
                accessibilityRole="button"
                accessibilityState={{ selected: durationType === 'half' }}
                testID="duration-half-btn"
              >
                <Text style={getDurationToggleTextStyle(isDark, durationType === 'half')}>
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
              onPress={handleStartDatePress}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Select start date"
              testID="start-date-picker"
            >
              <Feather name="calendar" size={20} color={isDark ? '#60A5FA' : '#2563EB'} />
              <View style={styles.datePickerTextCol}>
                <Text style={getDatePickerLabelStyle(isDark)}>
                  Start date
                </Text>
                <Text style={getDatePickerValueStyle(isDark)}>
                  {formatDateDisplay(startDate)}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={getDatesVerticalDividerStyle(isDark)} />

            {/* End Date Column */}
            <TouchableOpacity
              style={styles.datePickerCol}
              onPress={handleEndDatePress}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Select end date"
              testID="end-date-picker"
            >
              <Feather name="calendar" size={20} color={isDark ? '#60A5FA' : '#2563EB'} />
              <View style={styles.datePickerTextCol}>
                <Text style={getDatePickerLabelStyle(isDark)}>
                  End date
                </Text>
                <Text style={getDatePickerValueStyle(isDark)}>
                  {formatDateDisplay(endDate)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Divider below Date Pickers */}
          <View style={getSectionSeparatorStyle(isDark)} />

          {/* 5. Month Calendar Grid Card */}
          <View style={styles.monthHeaderRow}>
            <Text
              style={[styles.monthTitle, getMonthTitleStyle(isDark)]}
              testID="current-month-label"
            >
              {MONTH_NAMES[currentMonth]} {currentYear}
            </Text>
            <View style={styles.monthNavButtons}>
              <TactilePressable
                onPress={handlePrevMonth}
                style={[styles.navChevronBtn, getNavChevronBtnStyle(isDark)]}
                activeScale={0.88}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Previous month"
                testID="prev-month-btn"
              >
                <Feather name="chevron-left" size={18} color={isDark ? '#F8FAFC' : '#0F172A'} />
              </TactilePressable>
              <TactilePressable
                onPress={handleNextMonth}
                style={[styles.navChevronBtn, getNavChevronBtnStyle(isDark)]}
                activeScale={0.88}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Next month"
                testID="next-month-btn"
              >
                <Feather name="chevron-right" size={18} color={isDark ? '#F8FAFC' : '#0F172A'} />
              </TactilePressable>
            </View>
          </View>

          <GlassCard
            intensity={20}
            tint={isDark ? 'dark' : 'light'}
            style={[styles.card, getCardStyle(isDark)]}
          >
            {/* Day of Week Labels */}
            <View style={styles.weekdaysRow}>
              {WEEKDAY_NAMES.map((name) => (
                <View key={name} style={styles.weekdaySlot}>
                  <Text style={[styles.weekdayText, getWeekdayTextStyle(isDark)]}>
                    {name}
                  </Text>
                </View>
              ))}
            </View>

            {/* Days Matrix */}
            <View style={styles.daysGrid}>
              {calendarDays.map((item, index) => {
                if (!item.isCurrentMonth) {
                  return <View key={item.dateKey || `pad-${index}`} style={styles.daySlot} />;
                }

                const isStart = startDate === item.dateKey;
                const isEnd = endDate === item.dateKey;
                const isInRange = Boolean(
                  startDate && endDate && item.dateKey > startDate && item.dateKey < endDate,
                );
                const isSingleSelected = isStart && (!endDate || startDate === endDate);
                const isSelectedEndpoint = isStart || isEnd;

                return (
                  <TactilePressable
                    key={item.dateKey}
                    style={styles.daySlot}
                    onPress={() => handleSelectDay(item.dateKey)}
                    activeScale={0.9}
                    testID={`day-slot-${item.dateKey}`}
                    accessibilityRole="button"
                    accessibilityLabel={`Select date ${item.dateKey}`}
                  >
                    {isSelectedEndpoint || isSingleSelected ? (
                      <View style={styles.selectedCircle}>
                        <Text style={styles.selectedDayNumberText}>{item.dayNumber}</Text>
                        <Feather
                          name="check"
                          size={12}
                          color="#FFFFFF"
                          style={styles.selectedCheckIcon}
                        />
                      </View>
                    ) : isInRange ? (
                      <View style={[styles.inRangeContainer, getInRangeContainerStyle(isDark)]}>
                        <Text style={[styles.inRangeDayNumberText, getInRangeDayNumberTextStyle(isDark)]}>
                          {item.dayNumber}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.unselectedDayContainer}>
                        <Text style={[styles.dayNumberText, getDayNumberTextStyle(isDark)]}>
                          {item.dayNumber}
                        </Text>
                        <View style={styles.emptyDotPlaceholder} />
                      </View>
                    )}
                  </TactilePressable>
                );
              })}
            </View>
          </GlassCard>

          {/* Divider below Calendar Card */}
          <View style={getSectionSeparatorStyle(isDark)} />

          {/* 6. Reason Section with Days Available Badge */}
          <View style={styles.reasonSection}>
            <View style={styles.reasonHeaderRow}>
              <Text style={getReasonTitleStyle(isDark)}>
                Reason
              </Text>
              <View style={getAvailableBadgeStyle(isDark)}>
                <Text style={getAvailableBadgeTextStyle(isDark)}>
                  14 days available
                </Text>
              </View>
            </View>

            <View style={styles.reasonInputContainer}>
              <TextInput
                style={getReasonInputStyle(isDark)}
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
            <Feather name="arrow-right" size={20} color="#FFFFFF" />
          </TactilePressable>
        </KeyboardAvoidingScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
