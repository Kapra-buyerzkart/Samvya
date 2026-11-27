import { Feather } from '@expo/vector-icons';
import React from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  EmploymentHistoryShimmer,
  MonthlyWorkHoursShimmer,
} from '../../components/EmploymentDetailsShimmer';
import { MonthlyWorkHoursChart } from '../../components/MonthlyWorkHoursChart';
import {
  getBackgroundStyle,
  getCardStyle,
  getCardTitleStyle,
  getCounterPillStyle,
  getCounterPillTextStyle,
  getEmpCodeTextStyle,
  getEmptyStateTextStyle,
  getFieldLabelStyle,
  getFieldValueStyle,
  getFooterTextStyle,
  getGridRowSpacingStyle,
  getHeaderIconBadgeStyle,
  getHistoryHeaderIconBadgeStyle,
  getHorizontalDividerStyle,
  getMetricLargeTextStyle,
  getMetricSubLabelStyle,
  getMonthNavBtnStyle,
  getMonthPillStyle,
  getMonthPillTextStyle,
  getNavTitleStyle,
  getPrimaryPillStyle,
  getPrimaryPillTextStyle,
  getRoleHeadingStyle,
  getStatusPillStyle,
  getStatusPillTextStyle,
  getSubOrganisationTextStyle,
  getVerticalDividerStyle,
  styles,
} from './EmploymentDetailsScreen.styles';
import { useEmploymentDetailsScreen } from './useEmploymentDetailsScreen';

export function EmploymentDetailsScreen(): React.JSX.Element {
  const {
    isDark,
    monthLabel,
    monthData,
    selectedDay,
    historyItems,
    isLoadingMonth,
    monthError,
    isLoadingHistory,
    historyError,
    setSelectedDay,
    handlePrevMonth,
    handleNextMonth,
    handleRetryMonth,
    handleRetryHistory,
    handleBack,
  } = useEmploymentDetailsScreen();

  return (
    <View style={getBackgroundStyle(isDark)} testID="employment-details-screen">
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
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
            <Text style={getNavTitleStyle(isDark)}>Employment details</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          bounces
          keyboardShouldPersistTaps="handled"
          testID="employment-details-scroll-view"
          refreshControl={
            <RefreshControl
              refreshing={isLoadingMonth || isLoadingHistory}
              onRefresh={() => {
                handleRetryMonth();
                handleRetryHistory();
              }}
              tintColor={isDark ? '#60A5FA' : '#1D4ED8'}
              colors={['#1D4ED8']}
            />
          }
        >
          {/* CARD 1: Monthly work hours */}
          <View style={getCardStyle(isDark)} testID="monthly-work-hours-card">
            <View style={styles.cardHeaderRow}>
              <View style={getHeaderIconBadgeStyle(isDark)}>
                <Feather name="calendar" size={20} color={isDark ? '#60A5FA' : '#2563EB'} />
              </View>
              <Text style={getCardTitleStyle(isDark)}>Monthly work hours</Text>
            </View>

            {monthError ? (
              <TouchableOpacity
                style={styles.monthErrorBanner}
                onPress={handleRetryMonth}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel="Retry loading monthly attendance"
                testID="employment-month-retry"
              >
                <Text style={styles.monthErrorText}>{monthError} Tap to retry.</Text>
              </TouchableOpacity>
            ) : null}

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
                <Text style={getMonthPillTextStyle(isDark)}>{monthLabel}</Text>
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

            {isLoadingMonth ? (
              <MonthlyWorkHoursShimmer isDark={isDark} />
            ) : monthData ? (
              <>
                <View style={styles.metricsRow}>
                  <View style={styles.metricCol}>
                    <Text style={getMetricLargeTextStyle(isDark)}>
                      {monthData.workingDays} working {'\n'} days
                    </Text>
                  </View>

                  <View style={getVerticalDividerStyle(isDark)} />

                  <View style={styles.metricCol}>
                    <Text style={getMetricSubLabelStyle(isDark)}>Total hours</Text>
                    <Text style={getMetricLargeTextStyle(isDark)}>
                      {monthData.totalHoursFormatted}
                    </Text>
                  </View>

                  <View style={getVerticalDividerStyle(isDark)} />

                  <View style={styles.metricCol}>
                    <Text style={getMetricLargeTextStyle(isDark)}>
                      {monthData.daysRecorded} days {'\n'}recorded
                    </Text>
                  </View>
                </View>

                <MonthlyWorkHoursChart
                  dailyRecords={monthData.dailyRecords}
                  selectedDay={selectedDay}
                  onSelectDay={setSelectedDay}
                  isDark={isDark}
                />
              </>
            ) : !monthError ? (
              <View style={styles.emptyStateBox} testID="employment-month-empty">
                <Text style={getEmptyStateTextStyle(isDark)}>
                  No monthly attendance records available.
                </Text>
              </View>
            ) : null}
          </View>

          {/* CARD 2: Employment history */}
          <View style={getCardStyle(isDark, true)} testID="employment-history-card">
            <View style={styles.cardHeaderRow}>
              <View style={getHistoryHeaderIconBadgeStyle(isDark)}>
                <Feather name="calendar" size={20} color={isDark ? '#60A5FA' : '#2563EB'} />
              </View>
              <Text style={getCardTitleStyle(isDark)}>Employment history</Text>
              <View style={getCounterPillStyle(isDark)}>
                <Text style={getCounterPillTextStyle(isDark)} testID="employment-history-count">
                  {isLoadingHistory ? '—' : historyItems.length}
                </Text>
              </View>
            </View>

            {historyError ? (
              <TouchableOpacity
                style={styles.monthErrorBanner}
                onPress={handleRetryHistory}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel="Retry loading employment history"
                testID="employment-history-retry"
              >
                <Text style={styles.monthErrorText}>{historyError} Tap to retry.</Text>
              </TouchableOpacity>
            ) : null}

            {isLoadingHistory ? (
              <EmploymentHistoryShimmer isDark={isDark} />
            ) : historyItems.length > 0 ? (
              historyItems.map((item) => (
                <React.Fragment key={item.id}>
                  <View style={getHorizontalDividerStyle(isDark)} />

                  <View style={styles.historyRoleSection}>
                    <Text style={getRoleHeadingStyle(isDark)}>{item.designation}</Text>

                    <View style={styles.badgeGroup}>
                      <View style={getStatusPillStyle(isDark)}>
                        <Text style={getStatusPillTextStyle(isDark)}>{item.status}</Text>
                      </View>

                      {item.isPrimary && (
                        <View style={getPrimaryPillStyle(isDark)}>
                          <Text style={getPrimaryPillTextStyle(isDark)}>Primary</Text>
                        </View>
                      )}

                      <Text style={getEmpCodeTextStyle(isDark)}>{item.employeeCode}</Text>
                    </View>

                    <Text style={getSubOrganisationTextStyle(isDark)}>
                      {item.organisation} &nbsp;|&nbsp; {item.office} &nbsp;|&nbsp;{' '}
                      {item.department}
                    </Text>
                  </View>

                  <View style={getHorizontalDividerStyle(isDark)} />

                  <View style={styles.infoGrid}>
                    <View style={styles.gridRow}>
                      <View style={styles.gridCol}>
                        <Text style={getFieldLabelStyle(isDark)}>EMPLOYMENT TYPE</Text>
                        <Text style={getFieldValueStyle(isDark)}>{item.employmentType}</Text>
                      </View>

                      <View style={styles.gridCol}>
                        <Text style={getFieldLabelStyle(isDark)}>WORK ARRANGEMENT</Text>
                        <Text style={getFieldValueStyle(isDark)}>{item.workArrangement}</Text>
                      </View>
                    </View>

                    <View style={getGridRowSpacingStyle()}>
                      <View style={styles.gridCol}>
                        <Text style={getFieldLabelStyle(isDark)}>EFFECTIVE PERIOD</Text>
                        <Text style={getFieldValueStyle(isDark)}>{item.effectivePeriod}</Text>
                      </View>

                      <View style={styles.gridCol}>
                        <Text style={getFieldLabelStyle(isDark)}>CONFIRMATION</Text>
                        <Text style={getFieldValueStyle(isDark)}>{item.confirmation}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={getHorizontalDividerStyle(isDark)} />

                  <View style={styles.footerSection}>
                    <View style={styles.footerRow}>
                      <View style={styles.footerDateItem}>
                        <Feather name="calendar" size={14} color={isDark ? '#94A3B8' : '#64748B'} />
                        <Text style={getFooterTextStyle(isDark)}>Joined {item.joinedDate}</Text>
                      </View>
                      <Text style={getFooterTextStyle(isDark)}>
                        Last working day: {item.lastWorkingDay}
                      </Text>
                    </View>

                    <Text style={getFooterTextStyle(isDark, true)}>
                      Relieved: {item.relievedDate}
                    </Text>
                  </View>
                </React.Fragment>
              ))
            ) : !historyError ? (
              <View style={styles.emptyStateBox} testID="employment-history-empty">
                <Text style={getEmptyStateTextStyle(isDark)}>No employment history available.</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export default EmploymentDetailsScreen;
