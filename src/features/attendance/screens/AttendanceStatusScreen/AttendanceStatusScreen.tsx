import { GlassCard, KeyboardAvoidingScrollView } from '@/shared/components';
import { Feather } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getBackgroundImageProps,
  getBackgroundImageStyle,
  getCardStyle,
  getLegendRowStyle,
  getLegendTextStyle,
  getNavChevronBtnStyle,
  getPunchCardSubtitleStyle,
  getPunchIconBoxStyle,
  getPunchPeriodStyle,
  getSafeAreaStyle,
  getTextColor,
  getTextColorStyle,
  getWeekdayTextStyle,
  styles,
} from './AttendanceStatusScreen.styles';
import { useAttendanceStatusScreen } from './useAttendanceStatusScreen';

export function AttendanceStatusScreen(): React.JSX.Element {
  const {
    isDark,
    currentYear,
    currentMonth,
    selectedDay,
    setSelectedDay,
    handlePrevMonth,
    handleNextMonth,
    handleBack,
    calendarDays,
    selectedPunchInfo,
    formattedSelectedDate,
    monthNames,
    weekdayNames,
  } = useAttendanceStatusScreen();

  return (
    <ImageBackground
      source={require('../../../../../assets/images/background.png')}
      style={[styles.backgroundImage, getBackgroundImageStyle(isDark)]}
      imageStyle={getBackgroundImageProps(isDark)}
      contentFit="cover"
    >
      <SafeAreaView
        style={[styles.safeArea, getSafeAreaStyle(isDark)]}
        edges={['top', 'bottom']}
      >
        <KeyboardAvoidingScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
              <Text style={[styles.headerTitle, getTextColorStyle(isDark)]}>
                Attendance status
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.monthHeaderRow}>
            <Text
              style={[styles.monthTitle, getTextColorStyle(isDark)]}
              testID="current-month-label"
            >
              {monthNames[currentMonth]} {currentYear}
            </Text>

            <View style={styles.monthNavButtons}>
              <TouchableOpacity
                onPress={handlePrevMonth}
                style={[
                  styles.navChevronBtn,
                  getNavChevronBtnStyle(isDark),
                ]}
                activeOpacity={0.7}
                testID="prev-month-btn"
                accessibilityRole="button"
                accessibilityLabel="Previous month"
              >
                <Feather name="chevron-left" size={18} color={getTextColor(isDark)} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNextMonth}
                style={[
                  styles.navChevronBtn,
                  getNavChevronBtnStyle(isDark),
                ]}
                activeOpacity={0.7}
                testID="next-month-btn"
                accessibilityRole="button"
                accessibilityLabel="Next month"
              >
                <Feather name="chevron-right" size={18} color={getTextColor(isDark)} />
              </TouchableOpacity>
            </View>
          </View>

          <GlassCard
            intensity={20}
            tint={isDark ? 'dark' : 'light'}
            style={[
              styles.card,
              getCardStyle(isDark),
            ]}
          >
            <View style={styles.weekdaysRow}>
              {weekdayNames.map((w) => (
                <View key={w} style={styles.weekdaySlot}>
                  <Text style={[styles.weekdayText, getWeekdayTextStyle(isDark)]}>
                    {w}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {calendarDays.map((day) => {
                if (!day.isCurrentMonth) {
                  return <View key={day.dateKey} style={styles.daySlot} />;
                }

                const isSelected = selectedDay === day.dayNumber;
                const hasPending =
                  currentMonth === 10 && currentYear === 2026 && day.dayNumber === 13;
                const hasApproved =
                  currentMonth === 10 &&
                  currentYear === 2026 &&
                  (day.dayNumber === 16 ||
                    day.dayNumber === 17 ||
                    day.dayNumber === 18 ||
                    day.dayNumber === 19);

                return (
                  <TouchableOpacity
                    key={day.dateKey}
                    onPress={() => setSelectedDay(day.dayNumber)}
                    activeOpacity={0.7}
                    style={styles.daySlot}
                    testID={`attendance-day-${day.dayNumber}`}
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
                        <Text style={[styles.dayNumberText, getTextColorStyle(isDark)]}>
                          {day.dayNumber}
                        </Text>
                        {hasApproved ? (
                          <Feather
                            name="check"
                            size={11}
                            color="#10B981"
                            style={styles.dayMarkerIcon}
                          />
                        ) : hasPending ? (
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

            <View style={[styles.legendRow, getLegendRowStyle(isDark)]}>
              <View style={styles.legendItem}>
                <Feather name="check" size={14} color="#10B981" />
                <Text style={[styles.legendText, getLegendTextStyle(isDark)]}>
                  Approved
                </Text>
              </View>

              <View style={styles.legendItem}>
                <View style={styles.pendingLegendDot} />
                <Text style={[styles.legendText, getLegendTextStyle(isDark)]}>
                  Pending review
                </Text>
              </View>
            </View>
          </GlassCard>

          <GlassCard
            intensity={20}
            tint={isDark ? 'dark' : 'light'}
            style={[
              styles.card,
              getCardStyle(isDark),
            ]}
          >
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
              </View>

              <View style={styles.statusBadge}>
                {selectedPunchInfo.status === 'approved' ? (
                  <>
                    <Feather name="check" size={14} color="#059669" />
                    <Text style={styles.approvedStatusText}>Approved</Text>
                  </>
                ) : (
                  <>
                    <View style={styles.pendingBadgeDot} />
                    <Text style={styles.pendingStatusText}>Pending review</Text>
                  </>
                )}
              </View>
            </View>

            <View style={styles.punchItemRow}>
              <View
                style={[
                  styles.punchIconBox,
                  getPunchIconBoxStyle(isDark),
                ]}
              >
                <Feather name="sunrise" size={22} color={getTextColor(isDark)} />
              </View>
              <View style={styles.punchInfoCol}>
                <Text style={[styles.punchTitle, getTextColorStyle(isDark)]}>
                  Punch-in
                </Text>
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
              <View
                style={[
                  styles.punchIconBox,
                  getPunchIconBoxStyle(isDark),
                ]}
              >
                <Feather name="moon" size={22} color={getTextColor(isDark)} />
              </View>
              <View style={styles.punchInfoCol}>
                <Text style={[styles.punchTitle, getTextColorStyle(isDark)]}>
                  Punch-out
                </Text>
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
          </GlassCard>
        </KeyboardAvoidingScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

export default AttendanceStatusScreen;
