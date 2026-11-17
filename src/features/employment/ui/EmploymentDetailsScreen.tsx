import { GlassCard } from '@/shared/components';
import { FontFamily, useAppTheme } from '@/shared/theme';
import { Feather } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DEFAULT_EMPLOYMENT_HISTORY, getMonthlyWorkHoursData } from '../data/employmentDataService';
import { MonthlyWorkHoursChart } from './MonthlyWorkHoursChart';

export function EmploymentDetailsScreen(): React.JSX.Element {
  const theme = useAppTheme();
  const isDark = theme.isDark;

  // Selected calendar month state (defaults to November 2026 per design)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(11); // November
  // Selected day for the tooltip (defaults to Day 5 "Thur. 8h" per design)
  const [selectedDay, setSelectedDay] = useState(5);

  // Retrieve monthly work hours data
  const monthData = useMemo(() => {
    return getMonthlyWorkHoursData(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const handlePrevMonth = (): void => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = (): void => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(1);
  };

  const handleBack = (): void => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)');
    }
  };

  const history = DEFAULT_EMPLOYMENT_HISTORY;

  return (
    <ImageBackground
      source={require('../../../../assets/images/background_home.png')}
      style={[styles.backgroundImage, { backgroundColor: isDark ? '#020617' : '#F8FAFC' }]}
      imageStyle={{ opacity: isDark ? 0.05 : 1 }}
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
            <Text style={[styles.navTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Employment details
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* CARD 1: Monthly work hours */}
          <GlassCard
            intensity={50}
            tint={isDark ? 'dark' : 'light'}
            style={[
              styles.card,
              isDark && {
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                borderColor: 'rgba(51, 65, 85, 0.8)',
              },
            ]}
          >
            {/* Card Header */}
            <View style={styles.cardHeaderRow}>
              <View
                style={[
                  styles.headerIconBadge,
                  {
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(239, 246, 255, 1)',
                    borderColor: isDark ? '#334155' : 'rgba(191, 219, 254, 1)',
                  },
                ]}
              >
                <Feather name="calendar" size={20} color={isDark ? '#60A5FA' : '#2563EB'} />
              </View>
              <Text style={[styles.cardTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Monthly work hours
              </Text>
            </View>

            {/* Month Navigator Row */}
            <View style={styles.monthNavRow}>
              <TouchableOpacity
                style={[
                  styles.navArrowBtn,
                  {
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.85)',
                    borderColor: isDark ? '#334155' : 'rgba(203, 213, 225, 0.85)',
                  },
                ]}
                onPress={handlePrevMonth}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Previous month"
              >
                <Feather name="chevron-left" size={20} color={isDark ? '#F8FAFC' : '#1E293B'} />
              </TouchableOpacity>

              <View
                style={[
                  styles.monthPill,
                  {
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.85)',
                    borderColor: isDark ? '#334155' : 'rgba(203, 213, 225, 0.85)',
                  },
                ]}
              >
                <Text style={[styles.monthPillText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  {monthData.monthName}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.navArrowBtn,
                  {
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.85)',
                    borderColor: isDark ? '#334155' : 'rgba(203, 213, 225, 0.85)',
                  },
                ]}
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
                <Text style={[styles.metricLargeText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  {monthData.workingDays} working days
                </Text>
              </View>

              <View
                style={[
                  styles.verticalDivider,
                  { backgroundColor: isDark ? '#334155' : '#CBD5E1' },
                ]}
              />

              <View style={styles.metricCol}>
                <Text style={[styles.metricSubLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Total hours
                </Text>
                <Text style={[styles.metricLargeText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  {monthData.totalHoursFormatted}
                </Text>
              </View>

              <View
                style={[
                  styles.verticalDivider,
                  { backgroundColor: isDark ? '#334155' : '#CBD5E1' },
                ]}
              />

              <View style={styles.metricCol}>
                <Text style={[styles.metricLargeText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
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
            style={[
              styles.card,
              { marginTop: 18 },
              isDark && {
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                borderColor: 'rgba(51, 65, 85, 0.8)',
              },
            ]}
          >
            {/* Card Header with Counter Badge */}
            <View style={styles.cardHeaderRow}>
              <View
                style={[
                  styles.headerIconBadge,
                  {
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(239, 246, 255, 0.85)',
                    borderColor: isDark ? '#334155' : 'rgba(191, 219, 254, 0.95)',
                  },
                ]}
              >
                <Feather name="calendar" size={20} color={isDark ? '#60A5FA' : '#2563EB'} />
              </View>
              <Text style={[styles.cardTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Employment history
              </Text>
              <View
                style={[
                  styles.counterPill,
                  {
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(239, 246, 255, 0.85)',
                    borderColor: isDark ? '#334155' : 'rgba(191, 219, 254, 0.95)',
                  },
                ]}
              >
                <Text style={[styles.counterPillText, { color: isDark ? '#60A5FA' : '#1D4ED8' }]}>
                  1
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.horizontalDivider,
                { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' },
              ]}
            />

            {/* Role, Status, and Department */}
            <View style={styles.historyRoleSection}>
              <Text style={[styles.roleHeading, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                {history.designation}
              </Text>

              {/* Status Pills */}
              <View style={styles.badgeGroup}>
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: isDark ? '#064E3B' : '#ECFDF5',
                      borderColor: isDark ? '#059669' : '#A7F3D0',
                    },
                  ]}
                >
                  <Text style={[styles.statusPillText, { color: isDark ? '#34D399' : '#047857' }]}>
                    {history.status}
                  </Text>
                </View>

                {history.isPrimary && (
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: isDark ? '#1E1B4B' : '#EEF2FF',
                        borderColor: isDark ? '#4338CA' : '#C7D2FE',
                      },
                    ]}
                  >
                    <Text
                      style={[styles.statusPillText, { color: isDark ? '#A5B4FC' : '#4338CA' }]}
                    >
                      Primary
                    </Text>
                  </View>
                )}

                <Text style={[styles.empCodeText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  {history.employeeCode}
                </Text>
              </View>

              <Text style={[styles.subOrganisationText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                {history.organisation} &nbsp;|&nbsp; {history.office} &nbsp;|&nbsp;{' '}
                {history.department}
              </Text>
            </View>

            <View
              style={[
                styles.horizontalDivider,
                { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' },
              ]}
            />

            {/* 2-Column Info Grid */}
            <View style={styles.infoGrid}>
              <View style={styles.gridRow}>
                {/* Column 1: Employment Type */}
                <View style={styles.gridCol}>
                  <Text style={[styles.fieldLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    EMPLOYMENT TYPE
                  </Text>
                  <Text style={[styles.fieldValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    {history.employmentType}
                  </Text>
                </View>

                {/* Column 2: Work Arrangement */}
                <View style={styles.gridCol}>
                  <Text style={[styles.fieldLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    WORK ARRANGEMENT
                  </Text>
                  <Text style={[styles.fieldValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    {history.workArrangement}
                  </Text>
                </View>
              </View>

              <View style={[styles.gridRow, { marginTop: 14 }]}>
                {/* Column 1: Effective Period */}
                <View style={styles.gridCol}>
                  <Text style={[styles.fieldLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    EFFECTIVE PERIOD
                  </Text>
                  <Text style={[styles.fieldValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    {history.effectivePeriod}
                  </Text>
                </View>

                {/* Column 2: Confirmation */}
                <View style={styles.gridCol}>
                  <Text style={[styles.fieldLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    CONFIRMATION
                  </Text>
                  <Text style={[styles.fieldValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    {history.confirmation}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={[
                styles.horizontalDivider,
                { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' },
              ]}
            />

            {/* Footer Metadata */}
            <View style={styles.footerSection}>
              <View style={styles.footerRow}>
                <View style={styles.footerDateItem}>
                  <Feather name="calendar" size={14} color={isDark ? '#94A3B8' : '#64748B'} />
                  <Text style={[styles.footerText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    Joined {history.joinedDate}
                  </Text>
                </View>
                <Text style={[styles.footerText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Last working day: {history.lastWorkingDay}
                </Text>
              </View>

              <Text
                style={[styles.footerText, { color: isDark ? '#94A3B8' : '#64748B', marginTop: 4 }]}
              >
                Relieved: {history.relievedDate}
              </Text>
            </View>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  navBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 36,
  },
  card: {
    borderRadius: 28,
    padding: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  headerIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    flex: 1,
  },
  counterPill: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterPillText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 13,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  navArrowBtn: {
    width: 42,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthPill: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  monthPillText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 15,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 8,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricSubLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    marginBottom: 2,
  },
  metricLargeText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 14,
    textAlign: 'center',
  },
  verticalDivider: {
    width: 1,
    height: 28,
  },
  horizontalDivider: {
    height: 1,
    width: '100%',
    marginVertical: 14,
  },
  historyRoleSection: {
    paddingVertical: 2,
  },
  roleHeading: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    marginBottom: 8,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusPillText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
  },
  empCodeText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
  },
  subOrganisationText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    marginTop: 2,
  },
  infoGrid: {
    paddingVertical: 2,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridCol: {
    flex: 1,
  },
  fieldLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  fieldValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 15,
  },
  footerSection: {
    paddingTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerDateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
  },
});
