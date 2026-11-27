import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { AppBottomSheet, AppCalendar, KeyboardAvoidingScrollView } from '@/shared/components';
import {
  EDIT_DURATION_OPTIONS,
  useEditLeaveRequestScreen,
} from './useEditLeaveRequestScreen';
import {
  getApproverAvatarStyle,
  getApproverInitialsStyle,
  getCancelLeaveBtnStyle,
  getCancelLeaveBtnTextStyle,
  getCardSurfaceStyle,
  getHeaderTitleStyle,
  getMutedTextStyle,
  getOriginalCardStyle,
  getPrimaryTextStyle,
  getRejectedReasonCardStyle,
  getRejectedReasonTextStyle,
  getRejectedReasonTitleStyle,
  getSafeAreaStyle,
  getSaveButtonStyle,
  getSecondaryTextStyle,
  getStatusBadgeStyle,
  getStatusBadgeTextStyle,
  getStatusRowDividerStyle,
  styles,
} from './EditLeaveRequestScreen.styles';

export function EditLeaveRequestScreen(): React.JSX.Element {
  const {
    isDark,
    isRejected,
    isPending,
    isApproved,
    submittedDate,
    originalRangeLabel,
    approverName,
    approverInitials,
    rejectedReason,
    leaveType,
    leaveTypeOptions,
    startDate,
    endDate,
    formattedStartDate,
    formattedEndDate,
    duration,
    reason,
    secondaryReason,
    secondaryReasonError,
    isSaving,
    isCancelling,
    isLeaveTypeSheetOpen,
    isDurationSheetOpen,
    activeDatePicker,
    pickerMonthLabel,
    pickerCalendarDays,
    setReason,
    setSecondaryReason,
    setIsLeaveTypeSheetOpen,
    setIsDurationSheetOpen,
    openDatePicker,
    closeDatePicker,
    handlePickerPrevMonth,
    handlePickerNextMonth,
    handlePickCalendarDate,
    handleSelectLeaveType,
    handleSelectDuration,
    handleCancelLeave,
    handleSaveChanges,
    handleBack,
  } = useEditLeaveRequestScreen();

  const cardSurface = getCardSurfaceStyle(isDark);
  const primaryText = getPrimaryTextStyle(isDark);
  const secondaryText = getSecondaryTextStyle(isDark);

  const renderApproverCard = (extraStyle?: object) =>
    approverName ? (
      <View style={[styles.approverCard, cardSurface, extraStyle]} testID="edit-approver-card">
        <View style={getApproverAvatarStyle(isDark)}>
          <Text style={getApproverInitialsStyle(isDark)}>{approverInitials}</Text>
        </View>
        <View style={styles.approverTextCol}>
          <Text style={[styles.approverLabel, secondaryText]}>Approver</Text>
          <Text style={[styles.approverName, primaryText]} testID="edit-approver-name">
            {approverName}
          </Text>
        </View>
      </View>
    ) : null;

  return (
    <>
      <SafeAreaView style={getSafeAreaStyle(isDark)} edges={['top', 'bottom']}>
        <KeyboardAvoidingScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          nestedScrollEnabled
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
              testID="edit-leave-back-btn"
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Feather name="chevron-left" size={24} color={isDark ? '#F8FAFC' : '#0F1E36'} />
              <Text style={getHeaderTitleStyle(isDark)}>Edit leave request</Text>
            </TouchableOpacity>
          </View>

          {/* Status Pill + Submitted Date */}
          <View style={styles.statusRow}>
            <View
              style={getStatusBadgeStyle(isDark, isRejected)}
              testID="edit-leave-status-badge"
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: isRejected
                      ? '#EF4444'
                      : isPending
                        ? '#EAB308'
                        : '#22C55E',
                  },
                ]}
              />
              <Text style={getStatusBadgeTextStyle(isDark, isRejected)}>
                {isRejected
                  ? 'Rejected Request'
                  : isPending
                    ? 'Pending Request'
                    : 'Approved Request'}
              </Text>
            </View>

            <View style={getStatusRowDividerStyle(isDark)} />

            <Text style={getMutedTextStyle(isDark)} testID="edit-submitted-date">
              Submitted {submittedDate}
            </Text>
          </View>

          {/* Approved / Pending Side: Cancel or Withdraw Action */}
          {isApproved || isPending ? (
            <TouchableOpacity
              style={getCancelLeaveBtnStyle(isDark)}
              onPress={handleCancelLeave}
              disabled={isCancelling}
              activeOpacity={0.75}
              testID="cancel-leave-btn"
              accessibilityRole="button"
              accessibilityLabel={isPending ? 'Withdraw request' : 'Cancel leave'}
            >
              <Text style={getCancelLeaveBtnTextStyle(isDark)}>
                {isPending ? 'Withdraw request' : 'Cancel leave'}
              </Text>
              <Feather name="x" size={14} color={isDark ? '#FCA5A5' : '#DC2626'} />
            </TouchableOpacity>
          ) : null}

          {/* Original Request Card */}
          <View style={getOriginalCardStyle(isDark)} testID="original-request-card">
            <Feather name="calendar" size={20} color={isDark ? '#60A5FA' : '#2563EB'} />
            <View style={styles.originalCardTextCol}>
              <Text style={[styles.originalCardTitle, primaryText]}>Original request</Text>
              <Text style={[styles.originalCardSubtitle, secondaryText]}>
                {originalRangeLabel}
              </Text>
            </View>
          </View>

          {/* Rejected Side: Approver + Rejected Reason above Updated request */}
          {isRejected ? (
            <>
              {renderApproverCard()}

              <View style={getRejectedReasonCardStyle(isDark)} testID="rejected-reason-card">
                <Text style={getRejectedReasonTitleStyle(isDark)}>Rejected reason</Text>
                <View style={styles.rejectedReasonBodyRow}>
                  <View
                    style={[
                      styles.rejectedReasonAccentBar,
                      { backgroundColor: isDark ? '#60A5FA' : '#2563EB' },
                    ]}
                  />
                  <Text style={getRejectedReasonTextStyle(isDark)} testID="rejected-reason-text">
                    {rejectedReason}
                  </Text>
                </View>
              </View>
            </>
          ) : null}

          {/* Updated Request Form */}
          <Text style={[styles.sectionHeading, primaryText]}>Updated request</Text>

          {/* Leave Type */}
          <View style={styles.fieldBlock}>
            <Text style={[styles.fieldLabel, secondaryText]}>Leave type</Text>
            <TouchableOpacity
              style={[styles.selectBox, cardSurface]}
              onPress={() => setIsLeaveTypeSheetOpen(true)}
              activeOpacity={0.75}
              testID="edit-leave-type-btn"
              accessibilityRole="button"
              accessibilityLabel="Select leave type"
            >
              <Text style={[styles.selectBoxText, primaryText]}>{leaveType}</Text>
              <Feather name="chevron-down" size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          </View>

          {/* Start & End Date */}
          <View style={styles.dateRow}>
            <View style={styles.dateCol}>
              <Text style={[styles.fieldLabel, secondaryText]}>Start date</Text>
              <TouchableOpacity
                style={[styles.datePickerBox, cardSurface]}
                onPress={() => openDatePicker('start')}
                activeOpacity={0.75}
                testID="edit-start-date-btn"
                accessibilityRole="button"
                accessibilityLabel="Select start date"
              >
                <Feather name="calendar" size={16} color={isDark ? '#60A5FA' : '#2563EB'} />
                <Text style={[styles.datePickerText, primaryText]} numberOfLines={1}>
                  {formattedStartDate}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateCol}>
              <Text style={[styles.fieldLabel, secondaryText]}>End date</Text>
              <TouchableOpacity
                style={[styles.datePickerBox, cardSurface]}
                onPress={() => openDatePicker('end')}
                activeOpacity={0.75}
                testID="edit-end-date-btn"
                accessibilityRole="button"
                accessibilityLabel="Select end date"
              >
                <Feather name="calendar" size={16} color={isDark ? '#60A5FA' : '#2563EB'} />
                <Text style={[styles.datePickerText, primaryText]} numberOfLines={1}>
                  {formattedEndDate}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Duration */}
          <View style={styles.fieldBlock}>
            <Text style={[styles.fieldLabel, secondaryText]}>Duration</Text>
            <TouchableOpacity
              style={[styles.selectBox, cardSurface]}
              onPress={() => setIsDurationSheetOpen(true)}
              activeOpacity={0.75}
              testID="edit-duration-btn"
              accessibilityRole="button"
              accessibilityLabel="Select duration"
            >
              <Text style={[styles.selectBoxText, primaryText]}>{duration}</Text>
              <Feather name="chevron-down" size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          </View>

          {/* Reason */}
          <View style={styles.fieldBlock}>
            <Text style={[styles.fieldLabel, secondaryText]}>Reason</Text>
            <View style={[styles.textAreaBox, cardSurface]}>
              <TextInput
                style={[styles.textAreaInput, primaryText]}
                value={reason}
                onChangeText={setReason}
                placeholder="Enter leave reason"
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                multiline
                textAlignVertical="top"
                testID="edit-reason-input"
              />
            </View>
          </View>

          {/* Secondary Reason: Re-type Your Reason (Rejected) / Reason for date change (Approved) */}
          <View style={styles.fieldBlock}>
            <Text style={[styles.fieldLabel, secondaryText]}>
              {isRejected ? 'Re-type Your Reason' : 'Reason for date change'}
            </Text>
            <View style={[styles.textAreaBox, cardSurface]}>
              <TextInput
                style={[styles.textAreaInput, primaryText]}
                value={secondaryReason}
                onChangeText={setSecondaryReason}
                placeholder={
                  isRejected
                    ? 'Enter a valid reason to reapply'
                    : 'Enter reason for date change'
                }
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                multiline
                textAlignVertical="top"
                testID="edit-secondary-reason-input"
              />
            </View>
            {secondaryReasonError ? (
              <Text style={styles.fieldErrorText} testID="edit-secondary-reason-error">
                {secondaryReasonError}
              </Text>
            ) : null}
          </View>

          {/* Approved Side: Approver card below form */}
          {isApproved ? renderApproverCard(styles.approverBottomSpacer) : null}

          {/* Save Changes CTA */}
          <TouchableOpacity
            style={getSaveButtonStyle(isDark, isSaving)}
            onPress={handleSaveChanges}
            disabled={isSaving}
            activeOpacity={0.85}
            testID="edit-save-changes-btn"
            accessibilityRole="button"
            accessibilityLabel="Save changes"
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingScrollView>
      </SafeAreaView>

      {/* Leave Type Picker Sheet */}
      <AppBottomSheet
        isOpen={isLeaveTypeSheetOpen}
        onClose={() => setIsLeaveTypeSheetOpen(false)}
        title="Select Leave Type"
        testID="edit-leave-type-sheet"
      >
        <View style={styles.sheetList}>
          {leaveTypeOptions.map((option) => {
            const isSelected = leaveType === option;
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.sheetItem,
                  cardSurface,
                  isSelected
                    ? {
                        borderColor: isDark ? '#60A5FA' : '#2563EB',
                        backgroundColor: isDark ? 'rgba(37, 99, 235, 0.16)' : '#EFF6FF',
                      }
                    : null,
                ]}
                onPress={() => handleSelectLeaveType(option)}
                testID={`edit-leave-type-option-${option}`}
              >
                <Text style={[styles.sheetItemText, primaryText]}>{option}</Text>
                {isSelected ? (
                  <Feather name="check" size={18} color={isDark ? '#60A5FA' : '#2563EB'} />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </AppBottomSheet>

      {/* Duration Picker Sheet */}
      <AppBottomSheet
        isOpen={isDurationSheetOpen}
        onClose={() => setIsDurationSheetOpen(false)}
        title="Select Duration"
        testID="edit-duration-sheet"
      >
        <View style={styles.sheetList}>
          {EDIT_DURATION_OPTIONS.map((option) => {
            const isSelected = duration === option;
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.sheetItem,
                  cardSurface,
                  isSelected
                    ? {
                        borderColor: isDark ? '#60A5FA' : '#2563EB',
                        backgroundColor: isDark ? 'rgba(37, 99, 235, 0.16)' : '#EFF6FF',
                      }
                    : null,
                ]}
                onPress={() => handleSelectDuration(option)}
                testID={`edit-duration-option-${option}`}
              >
                <Text style={[styles.sheetItemText, primaryText]}>{option}</Text>
                {isSelected ? (
                  <Feather name="check" size={18} color={isDark ? '#60A5FA' : '#2563EB'} />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </AppBottomSheet>

      {/* Date Picker Sheet */}
      <AppBottomSheet
        isOpen={activeDatePicker !== null}
        onClose={closeDatePicker}
        title={activeDatePicker === 'start' ? 'Select Start Date' : 'Select End Date'}
        testID="edit-date-picker-sheet"
      >
        <View style={styles.calendarPickerHeader}>
          <Text style={[styles.calendarPickerMonthTitle, primaryText]}>{pickerMonthLabel}</Text>
          <View style={styles.calendarPickerNavRow}>
            <TouchableOpacity
              onPress={handlePickerPrevMonth}
              style={[styles.calendarPickerNavBtn, cardSurface]}
              testID="edit-picker-prev-month"
            >
              <Feather name="chevron-left" size={18} color={isDark ? '#F8FAFC' : '#0F172A'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePickerNextMonth}
              style={[styles.calendarPickerNavBtn, cardSurface]}
              testID="edit-picker-next-month"
            >
              <Feather name="chevron-right" size={18} color={isDark ? '#F8FAFC' : '#0F172A'} />
            </TouchableOpacity>
          </View>
        </View>

        <AppCalendar
          withoutCard
          days={pickerCalendarDays}
          getDayTestID={(day) => `edit-picker-day-${day.dateKey}`}
          getDayState={(day) => {
            const selectedKey = activeDatePicker === 'start' ? startDate : endDate;
            return { isSelected: day.dateKey === selectedKey };
          }}
          onDayPress={(day) => handlePickCalendarDate(day.dateKey)}
        />
      </AppBottomSheet>
    </>
  );
}
