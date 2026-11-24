import { AppBottomSheet, GlassCard, KeyboardAvoidingScrollView } from '@/shared/components';
import { Feather } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedLeavePieChart } from '../../components/AnimatedLeavePieChart';
import { LeaveDetailModal } from './components/LeaveDetailModal';
import { LeaveMonthPill } from './components/LeaveMonthPill';
import { LeavePaginationFooter } from './components/LeavePaginationFooter';
import { LeaveRecordCard } from './components/LeaveRecordCard';
import { LeaveSummaryMetric } from './components/LeaveSummaryMetric';
import {
  getBackgroundImageStyle,
  getCardStyle,
  getChartPromptTextStyle,
  getFileIconBadgeStyle,
  getFilterPillStyle,
  getFilterPillTitleStyle,
  getFilterPillValueStyle,
  getHeaderTitleStyle,
  getHistoryHeaderSubtitleStyle,
  getHistoryHeaderTitleStyle,
  getImageStyle,
  getModalItemStyle,
  getModalItemSubtitleStyle,
  getModalItemTitleStyle,
  getSafeAreaStyle,
  getViewAllTextStyle,
  styles,
} from './LeaveHistoryScreen.styles';
import { useLeaveHistoryScreen } from './useLeaveHistoryScreen';

export function LeaveHistoryScreen(): React.JSX.Element {
  const {
    isDark,
    durationKey,
    selectedMonth,
    currentPage,
    totalPages,
    isDurationModalOpen,
    isLeaveDetailModalOpen,
    selectedRecord,
    durationData,
    currentDurationOption,
    pagedRecords,
    pieData,
    durationOptions,
    setIsDurationModalOpen,
    handleBack,
    handleSelectDuration,
    handleSelectMonth,
    handlePrevPage,
    handleNextPage,
    handleRecordPress,
    handleOpenHeaderHistory,
    handleCloseRecordDetail,
  } = useLeaveHistoryScreen();

  return (
    <ImageBackground
      source={require('../../../../../assets/images/background_leave_history.png')}
      style={getBackgroundImageStyle(isDark)}
      imageStyle={getImageStyle(isDark)}
      contentFit="cover"
    >
      <SafeAreaView style={getSafeAreaStyle(isDark)} edges={['top', 'bottom']}>
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
              <Feather name="chevron-left" size={26} color={isDark ? '#F8FAFC' : '#0F294A'} />
              <Text style={getHeaderTitleStyle(isDark)}>Leave History</Text>
            </TouchableOpacity>
          </View>

          {/* 2. Summary Metric Row */}
          <LeaveSummaryMetric totalDays={durationData.totalDays} isDark={isDark} />

          {/* 3. Card 1: Leave by month & Animated Pie Chart */}
          <GlassCard intensity={25} tint={isDark ? 'dark' : 'light'} style={getCardStyle(isDark)}>
            {/* Interactive Duration Selector Pill */}
            <TouchableOpacity
              style={getFilterPillStyle(isDark)}
              activeOpacity={0.8}
              onPress={() => setIsDurationModalOpen(true)}
              testID="filter-duration-btn"
              accessibilityRole="button"
              accessibilityLabel="Select time duration"
            >
              <View style={styles.filterPillLeft}>
                <Feather name="calendar" size={16} color={isDark ? '#94A3B8' : '#64748B'} />
                <Text style={getFilterPillTitleStyle(isDark)}>{currentDurationOption.label}</Text>
              </View>
              <View style={styles.filterPillRight}>
                <Text style={getFilterPillValueStyle(isDark)}>
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
            <Text style={getChartPromptTextStyle(isDark)}>
              Select a month to view its leave history
            </Text>

            {/* Month Selection Buttons Row */}
            {durationKey === '3months' ? (
              <View style={styles.monthPillsRowFitted}>
                {durationData.months.map((m) => (
                  <LeaveMonthPill
                    key={m.key}
                    month={m}
                    isSelected={selectedMonth === m.key}
                    isDark={isDark}
                    isFitted={true}
                    onPress={() => handleSelectMonth(m.key)}
                  />
                ))}
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.monthPillsScrollContent}
              >
                <View style={styles.monthPillsRow}>
                  {durationData.months.map((m) => (
                    <LeaveMonthPill
                      key={m.key}
                      month={m}
                      isSelected={selectedMonth === m.key}
                      isDark={isDark}
                      isFitted={false}
                      onPress={() => handleSelectMonth(m.key)}
                    />
                  ))}
                </View>
              </ScrollView>
            )}
          </GlassCard>

          {/* 4. Card 2: Leave History List & Pagination */}
          <GlassCard intensity={25} tint={isDark ? 'dark' : 'light'} style={getCardStyle(isDark)}>
            {/* Header: Leave History Title & View All */}
            <View style={styles.historyCardHeader}>
              <TouchableOpacity
                style={styles.historyHeaderLeft}
                onPress={handleOpenHeaderHistory}
                activeOpacity={0.7}
                testID="leave-history-header-btn"
                accessibilityRole="button"
                accessibilityLabel="Leave History details"
              >
                <View style={getFileIconBadgeStyle(isDark)}>
                  <Feather name="file-text" size={18} color={isDark ? '#60A5FA' : '#1D4ED8'} />
                </View>
                <View style={styles.historyHeaderTextCol}>
                  <Text style={getHistoryHeaderTitleStyle(isDark)}>Leave History</Text>
                  <Text style={getHistoryHeaderSubtitleStyle(isDark)}>
                    leaves from the selected time
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSelectMonth('all')}
                style={styles.viewAllBtn}
                activeOpacity={0.7}
                testID="view-all-leaves-btn"
                accessibilityRole="button"
                accessibilityLabel="View all leaves"
              >
                <Text style={getViewAllTextStyle(isDark)}>
                  View all {durationData.records.length}
                </Text>
                <Feather name="chevron-right" size={15} color={isDark ? '#F8FAFC' : '#0F294A'} />
              </TouchableOpacity>
            </View>

            {/* List of Leave Record Cards */}
            <View style={styles.recordsList}>
              {pagedRecords.map((item) => (
                <LeaveRecordCard
                  key={item.id}
                  item={item}
                  isDark={isDark}
                  onPress={handleRecordPress}
                />
              ))}
            </View>

            {/* Pagination Controls Footer */}
            <LeavePaginationFooter
              currentPage={currentPage}
              totalPages={totalPages}
              isDark={isDark}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
            />
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
          {durationOptions.map((option) => {
            const isSelected = option.key === durationKey;
            return (
              <TouchableOpacity
                key={option.key}
                style={getModalItemStyle(isDark, isSelected)}
                onPress={() => handleSelectDuration(option.key)}
                activeOpacity={0.7}
                testID={`duration-option-${option.key}`}
              >
                <View style={styles.modalItemTextCol}>
                  <Text style={getModalItemTitleStyle(isDark, isSelected)}>{option.label}</Text>
                  <Text style={getModalItemSubtitleStyle(isDark)}>
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

      {/* Leave Detail Bottom Sheet Modal */}
      <LeaveDetailModal
        isOpen={isLeaveDetailModalOpen}
        record={selectedRecord}
        isDark={isDark}
        onClose={handleCloseRecordDetail}
      />
    </ImageBackground>
  );
}
