import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import { GlassCard, KeyboardAvoidingScrollView } from '@/shared/components';
import { MonthlyWorkHoursChart } from '../../components/MonthlyWorkHoursChart';
import { useEmploymentDetailsScreen } from './useEmploymentDetailsScreen';
import {
  styles,
  getBackgroundImageStyle,
  getImageStyle,
  getNavTitleStyle,
  getCardStyle,
  getHeaderIconBadgeStyle,
  getHistoryHeaderIconBadgeStyle,
  getCardTitleStyle,
  getCounterPillStyle,
  getCounterPillTextStyle,
  getMonthNavBtnStyle,
  getMonthPillStyle,
  getMonthPillTextStyle,
  getMetricLargeTextStyle,
  getMetricSubLabelStyle,
  getVerticalDividerStyle,
  getHorizontalDividerStyle,
  getRoleHeadingStyle,
  getStatusPillStyle,
  getStatusPillTextStyle,
  getPrimaryPillStyle,
  getPrimaryPillTextStyle,
  getEmpCodeTextStyle,
  getSubOrganisationTextStyle,
  getFieldLabelStyle,
  getFieldValueStyle,
  getGridRowSpacingStyle,
  getFooterTextStyle,
} from './EmploymentDetailsScreen.styles';

export function EmploymentDetailsScreen(): React.JSX.Element {
  const {
    isDark,
    monthData,
    selectedDay,
    history,
    setSelectedDay,
    handlePrevMonth,
    handleNextMonth,
    handleBack,
  } = useEmploymentDetailsScreen();

  return (
    <ImageBackground
      source={require('../../../../../assets/images/background_home.png')}
      style={getBackgroundImageStyle(isDark)}
      imageStyle={getImageStyle(isDark)}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Feather name="chevron-left" size={26} color={isDark ? '#F8FAFC' : '#0F172A'} />
            <Text style={getNavTitleStyle(isDark)}>
              Employment details
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* CARD 1: Monthly work hours */}
          <GlassCard
            intensity={50}
            tint={isDark ? 'dark' : 'light'}
            style={getCardStyle(isDark)}
          >
            {/* Card Header */}
            <View style={styles.cardHeaderRow}>
              <View style={getHeaderIconBadgeStyle(isDark)}>
                <Feather name="calendar" size={20} color={isDark ? '#60A5FA' : '#2563EB'} />
              </View>
              <Text style={getCardTitleStyle(isDark)}>
                Monthly work hours
              </Text>
            </View>

            {/* Month Navigator Row */}
            <View style={styles.monthNavRow}>
              <TouchableOpacity
                style={getMonthNavBtnStyle(isDark)}
                onPress={handlePrevMonth}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Previous month"
              >
                <Feather name="chevron-left" size={20} color={isDark ? '#F8FAFC' : '#1E293B'} />
              </TouchableOpacity>

              <View style={getMonthPillStyle(isDark)}>
                <Text style={getMonthPillTextStyle(isDark)}>
                  {monthData.monthName}
                </Text>
              </View>

              <TouchableOpacity
                style={getMonthNavBtnStyle(isDark)}
                onPress={handleNextMonth}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Next month"
              >
                <Feather name="chevron-right" size={20} color={isDark ? '#F8FAFC' : '#1E293B'} />
              </TouchableOpacity>
            </View>

            {/* 3-Column Metrics Row */}
            <View style={styles.metricsRow}>
              <View style={styles.metricCol}>
                <Text style={getMetricLargeTextStyle(isDark)}>
                  {monthData.workingDays} working days
                </Text>
              </View>

              <View style={getVerticalDividerStyle(isDark)} />

              <View style={styles.metricCol}>
                <Text style={getMetricSubLabelStyle(isDark)}>
                  Total hours
                </Text>
                <Text style={getMetricLargeTextStyle(isDark)}>
                  {monthData.totalHoursFormatted}
                </Text>
              </View>

              <View style={getVerticalDividerStyle(isDark)} />

              <View style={styles.metricCol}>
                <Text style={getMetricLargeTextStyle(isDark)}>
                  {monthData.daysRecorded} days recorded
                </Text>
              </View>
            </View>

            {/* Interactive Bar Chart */}
            <MonthlyWorkHoursChart
              dailyRecords={monthData.dailyRecords}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              isDark={isDark}
            />
          </GlassCard>

          {/* CARD 2: Employment history */}
          <GlassCard
            intensity={50}
            tint={isDark ? 'dark' : 'light'}
            style={getCardStyle(isDark, true)}
          >
            {/* Card Header with Counter Badge */}
            <View style={styles.cardHeaderRow}>
              <View style={getHistoryHeaderIconBadgeStyle(isDark)}>
                <Feather name="calendar" size={20} color={isDark ? '#60A5FA' : '#2563EB'} />
              </View>
              <Text style={getCardTitleStyle(isDark)}>
                Employment history
              </Text>
              <View style={getCounterPillStyle(isDark)}>
                <Text style={getCounterPillTextStyle(isDark)}>
                  1
                </Text>
              </View>
            </View>

            <View style={getHorizontalDividerStyle(isDark)} />

            {/* Role, Status, and Department */}
            <View style={styles.historyRoleSection}>
              <Text style={getRoleHeadingStyle(isDark)}>
                {history.designation}
              </Text>

              {/* Status Pills */}
              <View style={styles.badgeGroup}>
                <View style={getStatusPillStyle(isDark)}>
                  <Text style={getStatusPillTextStyle(isDark)}>
                    {history.status}
                  </Text>
                </View>

                {history.isPrimary && (
                  <View style={getPrimaryPillStyle(isDark)}>
                    <Text style={getPrimaryPillTextStyle(isDark)}>
                      Primary
                    </Text>
                  </View>
                )}

                <Text style={getEmpCodeTextStyle(isDark)}>
                  {history.employeeCode}
                </Text>
              </View>

              <Text style={getSubOrganisationTextStyle(isDark)}>
                {history.organisation} &nbsp;|&nbsp; {history.office} &nbsp;|&nbsp;{' '}
                {history.department}
              </Text>
            </View>

            <View style={getHorizontalDividerStyle(isDark)} />

            {/* 2-Column Info Grid */}
            <View style={styles.infoGrid}>
              <View style={styles.gridRow}>
                {/* Column 1: Employment Type */}
                <View style={styles.gridCol}>
                  <Text style={getFieldLabelStyle(isDark)}>
                    EMPLOYMENT TYPE
                  </Text>
                  <Text style={getFieldValueStyle(isDark)}>
                    {history.employmentType}
                  </Text>
                </View>

                {/* Column 2: Work Arrangement */}
                <View style={styles.gridCol}>
                  <Text style={getFieldLabelStyle(isDark)}>
                    WORK ARRANGEMENT
                  </Text>
                  <Text style={getFieldValueStyle(isDark)}>
                    {history.workArrangement}
                  </Text>
                </View>
              </View>

              <View style={getGridRowSpacingStyle()}>
                {/* Column 1: Effective Period */}
                <View style={styles.gridCol}>
                  <Text style={getFieldLabelStyle(isDark)}>
                    EFFECTIVE PERIOD
                  </Text>
                  <Text style={getFieldValueStyle(isDark)}>
                    {history.effectivePeriod}
                  </Text>
                </View>

                {/* Column 2: Confirmation */}
                <View style={styles.gridCol}>
                  <Text style={getFieldLabelStyle(isDark)}>
                    CONFIRMATION
                  </Text>
                  <Text style={getFieldValueStyle(isDark)}>
                    {history.confirmation}
                  </Text>
                </View>
              </View>
            </View>

            <View style={getHorizontalDividerStyle(isDark)} />

            {/* Footer Metadata */}
            <View style={styles.footerSection}>
              <View style={styles.footerRow}>
                <View style={styles.footerDateItem}>
                  <Feather name="calendar" size={14} color={isDark ? '#94A3B8' : '#64748B'} />
                  <Text style={getFooterTextStyle(isDark)}>
                    Joined {history.joinedDate}
                  </Text>
                </View>
                <Text style={getFooterTextStyle(isDark)}>
                  Last working day: {history.lastWorkingDay}
                </Text>
              </View>

              <Text style={getFooterTextStyle(isDark, true)}>
                Relieved: {history.relievedDate}
              </Text>
            </View>
          </GlassCard>
        </KeyboardAvoidingScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
