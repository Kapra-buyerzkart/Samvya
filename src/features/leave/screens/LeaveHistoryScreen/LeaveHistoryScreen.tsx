import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import { AppBottomSheet, GlassCard, KeyboardAvoidingScrollView } from '@/shared/components';
import { AnimatedLeavePieChart } from '../../components/AnimatedLeavePieChart';
import { useLeaveHistoryScreen } from './useLeaveHistoryScreen';
import {
  styles,
  getBackgroundImageStyle,
  getImageStyle,
  getSafeAreaStyle,
  getHeaderTitleStyle,
  getCalendarIconBubbleStyle,
  getSummaryTitleStyle,
  getSummaryNumberStyle,
  getSummarySubtitleStyle,
  getCardStyle,
  getFilterPillStyle,
  getFilterPillTitleStyle,
  getFilterPillValueStyle,
  getChartPromptTextStyle,
  getMonthPillStyle,
  getMonthPillNameStyle,
  getMonthPillDaysStyle,
  getFileIconBadgeStyle,
  getHistoryHeaderTitleStyle,
  getHistoryHeaderSubtitleStyle,
  getViewAllTextStyle,
  getRecordCardStyle,
  getDateBoxStyle,
  getDateNumberTextStyle,
  getDateMonthTextStyle,
  getDurationTextStyle,
  getReasonHeaderTitleStyle,
  getReasonDescriptionStyle,
  getPaginationTextStyle,
  getPageNavBtnStyle,
  getModalItemStyle,
  getModalItemTitleStyle,
  getModalItemSubtitleStyle,
} from './LeaveHistoryScreen.styles';

export function LeaveHistoryScreen(): React.JSX.Element {
  const {
    isDark,
    durationKey,
    selectedMonth,
    currentPage,
    totalPages,
    isDurationModalOpen,
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
  } = useLeaveHistoryScreen();

  return (
    <ImageBackground
      source={require('../../../../../assets/images/background_home.png')}
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
              <Text style={getHeaderTitleStyle(isDark)}>
                Leave History
              </Text>
            </TouchableOpacity>
          </View>

          {/* 2. Summary Metric Row */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryLeft}>
              <View style={getCalendarIconBubbleStyle(isDark)}>
                <Feather name="calendar" size={18} color={isDark ? '#60A5FA' : '#1D4ED8'} />
              </View>
              <Text style={getSummaryTitleStyle(isDark)}>
                Leave by month
              </Text>
            </View>

            <View style={styles.summaryRight}>
              <Text
                style={getSummaryNumberStyle(isDark)}
                testID="summary-total-days"
              >
                {durationData.totalDays} days
              </Text>
              <Text style={getSummarySubtitleStyle(isDark)}>
                Approved leave taken
              </Text>
            </View>
          </View>

          {/* 3. Card 1: Leave by month & Animated Pie Chart */}
          <GlassCard
            intensity={20}
            tint={isDark ? 'dark' : 'light'}
            style={getCardStyle(isDark)}
          >
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
                <Text style={getFilterPillTitleStyle(isDark)}>
                  {currentDurationOption.label}
                </Text>
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
                      style={getMonthPillStyle(isDark, isSelected)}
                      onPress={() => handleSelectMonth(m.key)}
                      activeOpacity={0.7}
                      testID={`month-btn-${m.key.toLowerCase()}`}
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${m.label}`}
                    >
                      <View style={styles.monthPillHeader}>
                        <View style={[styles.monthDot, { backgroundColor: m.color }]} />
                        <Text style={getMonthPillNameStyle(isDark, isSelected)}>
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
                      <Text style={getMonthPillDaysStyle(isDark, isSelected)}>
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
            style={getCardStyle(isDark)}
          >
            {/* Header: Leave History Title & View All */}
            <View style={styles.historyCardHeader}>
              <View style={styles.historyHeaderLeft}>
                <View style={getFileIconBadgeStyle(isDark)}>
                  <Feather name="file-text" size={20} color={isDark ? '#60A5FA' : '#1D4ED8'} />
                </View>
                <View style={styles.historyHeaderTextCol}>
                  <Text style={getHistoryHeaderTitleStyle(isDark)}>
                    Leave History
                  </Text>
                  <Text style={getHistoryHeaderSubtitleStyle(isDark)}>
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
                <Text style={getViewAllTextStyle(isDark)}>
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
                  style={getRecordCardStyle(isDark)}
                  onPress={() => handleRecordPress(item)}
                  activeOpacity={0.8}
                  testID={`leave-record-${item.id}`}
                  accessibilityRole="button"
                  accessibilityLabel={`Leave record for ${item.dateDisplay} ${item.monthDisplay}`}
                >
                  {/* Top row: Date Box and Duration + Status */}
                  <View style={styles.recordTopRow}>
                    <View style={getDateBoxStyle(isDark)}>
                      <Text style={getDateNumberTextStyle(isDark, item.dateDisplay.length > 2)}>
                        {item.dateDisplay}
                      </Text>
                      <Text style={getDateMonthTextStyle(isDark)}>
                        {item.monthDisplay}
                      </Text>
                    </View>

                    <View style={styles.durationCol}>
                      <Text style={getDurationTextStyle(isDark)}>
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
                    <Text style={getReasonHeaderTitleStyle(isDark)}>
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
                    style={getReasonDescriptionStyle(isDark)}
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
                <Text style={getPaginationTextStyle(isDark)}>
                  {currentPage} of {totalPages}
                </Text>
              </View>

              <View style={styles.paginationButtons}>
                <TouchableOpacity
                  onPress={handlePrevPage}
                  disabled={currentPage <= 1}
                  style={getPageNavBtnStyle(isDark, currentPage <= 1)}
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
                  style={getPageNavBtnStyle(isDark, currentPage >= totalPages)}
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
                  <Text style={getModalItemTitleStyle(isDark, isSelected)}>
                    {option.label}
                  </Text>
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
    </ImageBackground>
  );
}
