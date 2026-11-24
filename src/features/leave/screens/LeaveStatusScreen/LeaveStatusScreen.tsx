import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageBackground } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { GlassCard, KeyboardAvoidingScrollView } from '@/shared/components';
import {
  MONTH_NAMES,
  WEEKDAY_NAMES,
  useLeaveStatusScreen,
} from './useLeaveStatusScreen';
import {
  styles,
  getBackgroundImageStyle,
  getImageStyle,
  getSafeAreaStyle,
  getHeaderTitleStyle,
  getMonthTitleStyle,
  getNavChevronBtnStyle,
  getFilterPillStyle,
  getFilterDividerStyle,
  getCardStyle,
  getWeekdayTextStyle,
  getDayNumberTextColorStyle,
  getLegendRowStyle,
  getLegendTextStyle,
  getStatusCardTitleStyle,
  getRecordDividerStyle,
  getTimelineStepLabelStyle,
  getTimelineIconBadgeStyle,
} from './LeaveStatusScreen.styles';

export function LeaveStatusScreen(): React.JSX.Element {
  const {
    isDark,
    currentYear,
    currentMonth,
    selectedFilter,
    selectedDate,
    calendarDays,
    displayedRecords,
    approvedDates,
    pendingDates,
    handlePrevMonth,
    handleNextMonth,
    handleToggleFilter,
    handleSelectDatePress,
    handleDayPress,
    handleBack,
  } = useLeaveStatusScreen();

  return (
    <ImageBackground
      source={require('../../../../../assets/images/background.png')}
      style={getBackgroundImageStyle(isDark)}
      imageStyle={getImageStyle(isDark)}
      contentFit="cover"
    >
      <SafeAreaView
        style={getSafeAreaStyle(isDark)}
        edges={['top', 'bottom']}
      >
        <KeyboardAvoidingScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={handleBack}
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
              <Text style={getHeaderTitleStyle(isDark)}>
                Leave status
              </Text>
            </TouchableOpacity>
          </View>

          {/* Month & Year Navigation Row */}
          <View style={styles.monthHeaderRow}>
            <Text
              style={getMonthTitleStyle(isDark)}
              testID="current-month-label"
            >
              {MONTH_NAMES[currentMonth]} {currentYear}
            </Text>

            <View style={styles.monthNavButtons}>
              <TouchableOpacity
                onPress={handlePrevMonth}
                style={getNavChevronBtnStyle(isDark)}
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
                style={getNavChevronBtnStyle(isDark)}
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
              style={getFilterPillStyle(isDark)}
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

            <View style={getFilterDividerStyle(isDark)} />

            <TouchableOpacity
              style={getFilterPillStyle(isDark)}
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
          <GlassCard
            intensity={20}
            tint={isDark ? 'dark' : 'light'}
            style={getCardStyle(isDark)}
          >
            {/* Weekday Names Header */}
            <View style={styles.weekdaysRow}>
              {WEEKDAY_NAMES.map((w) => (
                <View key={w} style={styles.weekdaySlot}>
                  <Text style={[styles.weekdayText, getWeekdayTextStyle(isDark)]}>{w}</Text>
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
                  approvedDates.has(day.dateKey);

                const isPending =
                  (selectedFilter === 'all' || selectedFilter === 'pending') &&
                  pendingDates.has(day.dateKey);

                const isSelected = selectedDate === day.dateKey;

                return (
                  <TouchableOpacity
                    key={day.dateKey}
                    onPress={() => handleDayPress(day.dateKey)}
                    activeOpacity={0.7}
                    style={styles.daySlot}
                    testID={`status-day-${day.dateKey}`}
                    accessibilityRole="button"
                    accessibilityLabel={`Day ${day.dayNumber}`}
                  >
                    {isSelected ? (
                      <View style={styles.selectedCircle}>
                        <Text style={styles.selectedDayNumberText}>{day.dayNumber}</Text>
                        <Feather
                          name="check"
                          size={12}
                          color="#FFFFFF"
                          style={styles.selectedCheckIcon}
                        />
                      </View>
                    ) : (
                      <View style={styles.unselectedDayContainer}>
                        <Text style={[styles.dayNumberText, getDayNumberTextColorStyle(isDark)]}>
                          {day.dayNumber}
                        </Text>
                        {isApproved ? (
                          <Feather
                            name="check"
                            size={11}
                            color="#10B981"
                            style={styles.dayMarkerIcon}
                          />
                        ) : isPending ? (
                          <View style={styles.pendingDot} />
                        ) : (
                          <View style={styles.emptyDotPlaceholder} />
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Status Legend Row inside Card */}
            <View style={[styles.legendRow, getLegendRowStyle(isDark)]}>
              <View style={styles.legendItem}>
                <Feather name="check" size={14} color="#10B981" />
                <Text style={[styles.legendText, getLegendTextStyle(isDark)]}>Approved</Text>
              </View>

              <View style={styles.legendItem}>
                <View style={styles.pendingLegendDot} />
                <Text style={[styles.legendText, getLegendTextStyle(isDark)]}>Pending</Text>
              </View>
            </View>
          </GlassCard>

          {/* Approval Status Card */}
          <GlassCard
            intensity={20}
            tint={isDark ? 'dark' : 'light'}
            style={getCardStyle(isDark)}
          >
            <Text style={getStatusCardTitleStyle(isDark)}>
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
                  {index > 0 && <View style={getRecordDividerStyle(isDark)} />}

                  {/* Step 1: Requested */}
                  <View style={styles.timelineStepRow}>
                    <View style={getTimelineIconBadgeStyle(false)}>
                      <Feather name="file-text" size={15} color="#2563EB" />
                    </View>
                    <Text style={getTimelineStepLabelStyle(isDark)}>
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
                    <View style={getTimelineIconBadgeStyle(record.status === 'rejected')}>
                      <Feather
                        name={record.status === 'approved' ? 'check' : 'x'}
                        size={15}
                        color={record.status === 'approved' ? '#2563EB' : '#EF4444'}
                      />
                    </View>
                    <Text style={getTimelineStepLabelStyle(isDark, record.status)}>
                      {record.status === 'approved' ? 'Approved' : 'Rejected'}
                    </Text>
                    <Text style={styles.timelineDateText}>
                      {record.actionDate}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </GlassCard>
        </KeyboardAvoidingScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
