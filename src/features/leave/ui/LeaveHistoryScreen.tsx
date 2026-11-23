import { AppBottomSheet, GlassCard, KeyboardAvoidingScrollView } from '@/shared/components';
import { FontFamily, useAppTheme } from '@/shared/theme';
import { Feather } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  buildPieChartData,
  DURATION_OPTIONS,
  type DurationKey,
  getLeaveDataForDuration,
  type LeaveHistoryRecord,
} from '../model/leaveHistoryData';
import { AnimatedLeavePieChart } from './AnimatedLeavePieChart';

const ITEMS_PER_PAGE = 3;

export function LeaveHistoryScreen(): React.JSX.Element {
  const theme = useAppTheme();
  const isDark = theme.isDark;

  const [durationKey, setDurationKey] = useState<DurationKey>('3months');
  const [selectedMonth, setSelectedMonth] = useState<string>('Nov');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);

  // Resolved duration data & option
  const durationData = useMemo(() => getLeaveDataForDuration(durationKey), [durationKey]);
  const currentDurationOption = useMemo(
    () => DURATION_OPTIONS.find((o) => o.key === durationKey) ?? DURATION_OPTIONS[0]!,
    [durationKey],
  );

  const handleBack = (): void => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)');
    }
  };

  const handleSelectDuration = (key: DurationKey): void => {
    setDurationKey(key);
    // Default to 'Nov' if available in that duration, else first month
    const newDurationData = getLeaveDataForDuration(key);
    const hasNov = newDurationData.months.some((m) => m.key === 'Nov');
    setSelectedMonth(hasNov ? 'Nov' : (newDurationData.months[0]?.key ?? 'all'));
    setCurrentPage(1);
    setIsDurationModalOpen(false);
  };

  const handleSelectMonth = (monthKey: string): void => {
    setSelectedMonth(monthKey);
    setCurrentPage(1);
  };

  // Filter records by selected month (or all)
  const filteredRecords = useMemo(() => {
    if (selectedMonth === 'all') return durationData.records;
    const matched = durationData.records.filter((r) => r.monthKey === selectedMonth);
    return matched.length > 0 ? matched : durationData.records;
  }, [durationData.records, selectedMonth]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / ITEMS_PER_PAGE));

  const pagedRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecords.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  const handlePrevPage = (): void => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const handleNextPage = (): void => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  const handleRecordPress = (item: LeaveHistoryRecord): void => {
    Alert.alert(
      `${item.dateDisplay} ${item.monthDisplay} (${item.durationLabel})`,
      `${item.status}\n\n${item.reasonDescription}`,
    );
  };

  // Dynamic Animated Pie Chart Data for current duration
  const pieData = useMemo(
    () => buildPieChartData(durationData.months, selectedMonth, (m) => handleSelectMonth(m)),
    [durationData.months, selectedMonth],
  );

  return (
    <ImageBackground
      source={require('../../../../assets/images/background_home.png')}
      style={[styles.backgroundImage, { backgroundColor: isDark ? '#020617' : '#F8FAFC' }]}
      imageStyle={{ opacity: isDark ? 0.05 : 1 }}
      contentFit="cover"
    >
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: isDark ? '#020617' : 'transparent' }]}
        edges={['top', 'bottom']}
      >
        <KeyboardAvoidingScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
              testID="leave-history-back-btn"
              accessibilityRole="button"
              accessibilityLabel="Leave history back"
            >
              <Feather name="chevron-left" size={26} color={isDark ? '#F8FAFC' : '#0F172A'} />
              <Text style={[styles.headerTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Leave History
              </Text>
            </TouchableOpacity>
          </View>

          {/* 2. Summary Metric Row */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryLeft}>
              <View
                style={[
                  styles.calendarIconBubble,
                  { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
                ]}
              >
                <Feather name="calendar" size={18} color={isDark ? '#60A5FA' : '#1D4ED8'} />
              </View>
              <Text style={[styles.summaryTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Leave by month
              </Text>
            </View>

            <View style={styles.summaryRight}>
              <Text
                style={[styles.summaryNumber, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                testID="summary-total-days"
              >
                {durationData.totalDays} days
              </Text>
              <Text style={[styles.summarySubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                Approved leave taken
              </Text>
            </View>
          </View>

          {/* 3. Card 1: Leave by month & Animated Pie Chart */}
          <GlassCard
            intensity={20}
            tint={isDark ? 'dark' : 'light'}
            style={[
              styles.card,
              isDark && {
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                borderColor: 'rgba(51, 65, 85, 0.8)',
              },
            ]}
          >
            {/* Interactive Duration Selector Pill */}
            <TouchableOpacity
              style={[
                styles.filterPill,
                {
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                },
              ]}
              activeOpacity={0.8}
              onPress={() => setIsDurationModalOpen(true)}
              testID="filter-duration-btn"
              accessibilityRole="button"
              accessibilityLabel="Select time duration"
            >
              <View style={styles.filterPillLeft}>
                <Feather name="calendar" size={16} color={isDark ? '#94A3B8' : '#64748B'} />
                <Text style={[styles.filterPillTitle, { color: isDark ? '#F8FAFC' : '#1E293B' }]}>
                  {currentDurationOption.label}
                </Text>
              </View>
              <View style={styles.filterPillRight}>
                <Text style={[styles.filterPillValue, { color: isDark ? '#94A3B8' : '#475569' }]}>
                  {currentDurationOption.dateRange}
                </Text>
                <Feather name="chevron-down" size={16} color={isDark ? '#94A3B8' : '#64748B'} />
              </View>
            </TouchableOpacity>

            {/* Animated Pie Chart via react-native-gifted-charts */}
            <AnimatedLeavePieChart
              key={`animated-pie-${durationKey}`}
              durationKey={durationKey}
              selectedMonth={selectedMonth}
              data={pieData}
              isDark={isDark}
            />

            {/* Prompt text */}
            <Text style={[styles.chartPromptText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Select a month to view its leave history
            </Text>

            {/* Month Selection Buttons Row (Horizontal Scrollable for longer durations) */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.monthPillsScrollContent}
            >
              <View style={styles.monthPillsRow}>
                {durationData.months.map((m) => {
                  const isSelected = selectedMonth === m.key;
                  return (
                    <TouchableOpacity
                      key={m.key}
                      style={[
                        styles.monthPill,
                        {
                          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                          borderColor: isDark ? '#334155' : '#CBD5E1',
                        },
                        isSelected && styles.monthPillActive,
                      ]}
                      onPress={() => handleSelectMonth(m.key)}
                      activeOpacity={0.7}
                      testID={`month-btn-${m.key.toLowerCase()}`}
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${m.label}`}
                    >
                      <View style={styles.monthPillHeader}>
                        <View style={[styles.monthDot, { backgroundColor: m.color }]} />
                        <Text
                          style={[
                            styles.monthPillName,
                            { color: isDark ? '#F8FAFC' : '#0F172A' },
                            isSelected && styles.monthPillNameActive,
                          ]}
                        >
                          {m.label}
                        </Text>
                        {isSelected && (
                          <Feather
                            name="check"
                            size={14}
                            color="#1D4ED8"
                            style={styles.checkIcon}
                          />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.monthPillDays,
                          { color: isDark ? '#F8FAFC' : '#0F172A' },
                          isSelected && styles.monthPillDaysActive,
                        ]}
                      >
                        {m.days} {m.days === 1 ? 'day' : 'days'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </GlassCard>

          {/* 4. Card 2: Leave History List & Pagination */}
          <GlassCard
            intensity={20}
            tint={isDark ? 'dark' : 'light'}
            style={[
              styles.card,
              isDark && {
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                borderColor: 'rgba(51, 65, 85, 0.8)',
              },
            ]}
          >
            {/* Header: Leave History Title & View All */}
            <View style={styles.historyCardHeader}>
              <View style={styles.historyHeaderLeft}>
                <View
                  style={[
                    styles.fileIconBadge,
                    { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
                  ]}
                >
                  <Feather name="file-text" size={20} color={isDark ? '#60A5FA' : '#1D4ED8'} />
                </View>
                <View style={styles.historyHeaderTextCol}>
                  <Text
                    style={[styles.historyHeaderTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                  >
                    Leave History
                  </Text>
                  <Text
                    style={[
                      styles.historyHeaderSubtitle,
                      { color: isDark ? '#94A3B8' : '#64748B' },
                    ]}
                  >
                    leaves from the selected time
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => handleSelectMonth('all')}
                style={styles.viewAllBtn}
                activeOpacity={0.7}
                testID="view-all-leaves-btn"
                accessibilityRole="button"
                accessibilityLabel="View all leaves"
              >
                <Text style={[styles.viewAllText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  View all {durationData.records.length}
                </Text>
                <Feather name="chevron-right" size={15} color={isDark ? '#F8FAFC' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            {/* List of Leave Record Cards */}
            <View style={styles.recordsList}>
              {pagedRecords.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.recordCard,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      borderColor: isDark ? '#334155' : '#CBD5E1',
                    },
                  ]}
                  onPress={() => handleRecordPress(item)}
                  activeOpacity={0.8}
                  testID={`leave-record-${item.id}`}
                  accessibilityRole="button"
                  accessibilityLabel={`Leave record for ${item.dateDisplay} ${item.monthDisplay}`}
                >
                  {/* Top row: Date Box and Duration + Status */}
                  <View style={styles.recordTopRow}>
                    <View
                      style={[
                        styles.dateBox,
                        {
                          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : '#EFF6FF',
                          borderColor: isDark ? '#334155' : '#DBEAFE',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dateNumberText,
                          { color: isDark ? '#60A5FA' : '#1D4ED8' },
                          item.dateDisplay.length > 2 && { fontSize: 13 },
                        ]}
                      >
                        {item.dateDisplay}
                      </Text>
                      <Text
                        style={[styles.dateMonthText, { color: isDark ? '#60A5FA' : '#1D4ED8' }]}
                      >
                        {item.monthDisplay}
                      </Text>
                    </View>

                    <View style={styles.durationCol}>
                      <Text
                        style={[styles.durationText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                      >
                        {item.durationLabel}
                      </Text>
                      <View style={styles.statusRow}>
                        <View style={styles.approvedDot} />
                        <Text style={styles.approvedText}>{item.status}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Middle row: Reason requested + chevron */}
                  <View style={styles.reasonHeaderRow}>
                    <Text
                      style={[styles.reasonHeaderTitle, { color: isDark ? '#F8FAFC' : '#1E293B' }]}
                    >
                      {item.reasonTitle}
                    </Text>
                    <Feather
                      name="chevron-right"
                      size={18}
                      color={isDark ? '#60A5FA' : '#2563EB'}
                    />
                  </View>

                  {/* Bottom row: Description snippet */}
                  <Text
                    style={[styles.reasonDescription, { color: isDark ? '#94A3B8' : '#64748B' }]}
                    numberOfLines={2}
                  >
                    {item.reasonDescription}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Pagination Controls Footer */}
            <View style={styles.paginationFooter}>
              <View style={styles.paginationIndicators}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      i + 1 === currentPage ? styles.paginationPillActive : styles.paginationDot,
                    ]}
                  />
                ))}
                <Text style={[styles.paginationText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  {currentPage} of {totalPages}
                </Text>
              </View>

              <View style={styles.paginationButtons}>
                <TouchableOpacity
                  onPress={handlePrevPage}
                  disabled={currentPage <= 1}
                  style={[
                    styles.pageNavBtn,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      borderColor: isDark ? '#334155' : '#CBD5E1',
                    },
                    currentPage <= 1 && styles.pageNavBtnDisabled,
                  ]}
                  activeOpacity={0.7}
                  testID="prev-page-btn"
                  accessibilityRole="button"
                  accessibilityLabel="Previous page"
                >
                  <Feather
                    name="chevron-left"
                    size={18}
                    color={currentPage <= 1 ? '#94A3B8' : isDark ? '#F8FAFC' : '#0F172A'}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleNextPage}
                  disabled={currentPage >= totalPages}
                  style={[
                    styles.pageNavBtn,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      borderColor: isDark ? '#334155' : '#CBD5E1',
                    },
                    currentPage >= totalPages && styles.pageNavBtnDisabled,
                  ]}
                  activeOpacity={0.7}
                  testID="next-page-btn"
                  accessibilityRole="button"
                  accessibilityLabel="Next page"
                >
                  <Feather
                    name="chevron-right"
                    size={18}
                    color={currentPage >= totalPages ? '#94A3B8' : isDark ? '#F8FAFC' : '#0F172A'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </GlassCard>
        </KeyboardAvoidingScrollView>
      </SafeAreaView>

      {/* Duration Selector Bottom Sheet */}
      <AppBottomSheet
        isOpen={isDurationModalOpen}
        onClose={() => setIsDurationModalOpen(false)}
        title="Select Time Duration"
      >
        <View style={styles.sheetList}>
          {DURATION_OPTIONS.map((option) => {
            const isSelected = option.key === durationKey;
            return (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.modalItem,
                  isSelected && {
                    backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                  },
                ]}
                onPress={() => handleSelectDuration(option.key)}
                activeOpacity={0.7}
                testID={`duration-option-${option.key}`}
              >
                <View style={styles.modalItemTextCol}>
                  <Text
                    style={[
                      styles.modalItemTitle,
                      { color: isDark ? '#E2E8F0' : '#1E293B' },
                      isSelected && {
                        color: isDark ? '#60A5FA' : '#1D4ED8',
                        fontWeight: '700',
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[styles.modalItemSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}
                  >
                    {option.dateRange} · {option.totalDays} days approved
                  </Text>
                </View>

                {isSelected && (
                  <Feather name="check" size={18} color={isDark ? '#60A5FA' : '#1D4ED8'} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </AppBottomSheet>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,

    paddingTop: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 2,
    marginLeft: -4,
  },
  headerTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    letterSpacing: -0.3,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calendarIconBubble: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 16,
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  summaryNumber: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    letterSpacing: -0.3,
  },
  summarySubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    marginTop: 2,
  },
  card: {
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  filterPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterPillTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
  },
  filterPillRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterPillValue: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
  },
  chartPromptText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    marginTop: 14,
    marginBottom: 12,
  },
  monthPillsScrollContent: {
    paddingRight: 4,
  },
  monthPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  monthPill: {
    minWidth: 92,
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  monthPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  monthPillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  monthDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  monthPillName: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
  },
  monthPillNameActive: {
    fontFamily: FontFamily.semiBold,
    color: '#1D4ED8',
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  monthPillDays: {
    fontFamily: FontFamily.headingBold,
    fontSize: 14,
  },
  monthPillDaysActive: {
    color: '#1D4ED8',
  },
  historyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  historyHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  fileIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyHeaderTextCol: {
    flex: 1,
  },
  historyHeaderTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    letterSpacing: -0.2,
  },
  historyHeaderSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    marginTop: 1,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  viewAllText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 14,
  },
  recordsList: {
    gap: 10,
  },
  recordCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  recordTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  dateBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNumberText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    lineHeight: 18,
  },
  dateMonthText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    lineHeight: 13,
  },
  durationCol: {
    flex: 1,
  },
  durationText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    marginBottom: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  approvedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  approvedText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: '#059669',
  },
  reasonHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reasonHeaderTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
  },
  reasonDescription: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 17,
  },
  paginationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 8,
  },
  paginationIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  paginationPillActive: {
    width: 22,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1D4ED8',
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  paginationText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    marginLeft: 6,
  },
  paginationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  pageNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNavBtnDisabled: {
    opacity: 0.4,
  },
  sheetList: {
    paddingBottom: 8,
    gap: 6,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  modalItemTextCol: {
    flex: 1,
  },
  modalItemTitle: {
    fontSize: 16,
    fontFamily: FontFamily.semiBold,
    marginBottom: 2,
  },
  modalItemSubtitle: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
  },
});
