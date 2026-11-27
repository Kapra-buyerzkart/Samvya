import { FontFamily } from '@/shared/theme';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingVertical: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontFamily: FontFamily.headingSemiBold,
    fontWeight: '600',
    marginLeft: 6,
    letterSpacing: -0.2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusBadgeText: {
    fontSize: 13,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
  },
  statusRowDivider: {
    width: 1,
    height: 16,
    marginHorizontal: 12,
  },
  submittedDateText: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
  },
  cancelLeaveBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
  },
  cancelLeaveBtnText: {
    fontSize: 13.5,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
  },
  originalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  originalCardTextCol: {
    flex: 1,
  },
  originalCardTitle: {
    fontSize: 15,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    marginBottom: 2,
  },
  originalCardSubtitle: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
  },
  approverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  approverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approverInitials: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
  },
  approverTextCol: {
    flex: 1,
  },
  approverLabel: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    marginBottom: 1,
  },
  approverName: {
    fontSize: 15,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
  },
  rejectedReasonCard: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
  },
  rejectedReasonTitle: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    marginBottom: 8,
  },
  rejectedReasonBodyRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  rejectedReasonAccentBar: {
    width: 3,
    borderRadius: 2,
  },
  rejectedReasonText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 20,
    fontFamily: FontFamily.regular,
  },
  sectionHeading: {
    fontSize: 18,
    fontFamily: FontFamily.headingBold,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginTop: 4,
    marginBottom: 14,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
    marginBottom: 6,
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 48,
  },
  selectBoxText: {
    fontSize: 14.5,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  dateCol: {
    flex: 1,
  },
  datePickerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 46,
  },
  datePickerText: {
    fontSize: 13.5,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    flexShrink: 1,
  },
  textAreaBox: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 88,
  },
  textAreaInput: {
    fontSize: 14.5,
    fontFamily: FontFamily.regular,
    minHeight: 64,
    padding: 0,
  },
  fieldErrorText: {
    fontSize: 12.5,
    fontFamily: FontFamily.medium,
    color: '#DC2626',
    marginTop: 5,
  },
  approverBottomSpacer: {
    marginTop: 4,
    marginBottom: 18,
  },
  saveButton: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 15.5,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sheetList: {
    gap: 10,
    paddingBottom: 12,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  sheetItemText: {
    fontSize: 15,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
  },
  calendarPickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  calendarPickerMonthTitle: {
    fontSize: 16,
    fontFamily: FontFamily.headingSemiBold,
    fontWeight: '600',
  },
  calendarPickerNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  calendarPickerNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarWeekdaysRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  calendarWeekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  calendarWeekdayText: {
    fontSize: 13,
    fontFamily: FontFamily.medium,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 12,
  },
  calendarDayCell: {
    width: '14.28%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  calendarDayPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayPillSelected: {
    backgroundColor: '#1D4ED8',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  calendarDayText: {
    fontSize: 15,
    fontFamily: FontFamily.medium,
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontFamily: FontFamily.headingBold,
    fontWeight: '700',
    lineHeight: 18,
  },
  calendarSelectedCheckIcon: {
    marginTop: 1,
  },
});

export const getSafeAreaStyle = (isDark: boolean): ViewStyle[] => [
  styles.safeArea,
  { backgroundColor: isDark ? '#020617' : '#E6ECF7' },
];

export const getHeaderTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.headerTitle,
  { color: isDark ? '#F8FAFC' : '#0F1E36' },
];

export const getStatusBadgeStyle = (isDark: boolean, isRejected: boolean): ViewStyle[] => {
  if (isRejected) {
    return [
      styles.statusBadge,
      {
        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.14)' : '#FEF2F2',
        borderColor: isDark ? '#F87171' : '#EF4444',
      },
    ];
  }
  return [
    styles.statusBadge,
    {
      backgroundColor: isDark ? 'rgba(16, 185, 129, 0.14)' : '#ECFDF5',
      borderColor: isDark ? '#34D399' : '#22C55E',
    },
  ];
};

export const getStatusBadgeTextStyle = (isDark: boolean, isRejected: boolean): TextStyle[] => [
  styles.statusBadgeText,
  {
    color: isRejected ? (isDark ? '#FCA5A5' : '#DC2626') : isDark ? '#6EE7B7' : '#16A34A',
  },
];

export const getStatusRowDividerStyle = (isDark: boolean): ViewStyle[] => [
  styles.statusRowDivider,
  { backgroundColor: isDark ? '#334155' : '#CBD5E1' },
];

export const getMutedTextStyle = (isDark: boolean): TextStyle[] => [
  styles.submittedDateText,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getCancelLeaveBtnStyle = (isDark: boolean): ViewStyle[] => [
  styles.cancelLeaveBtn,
  {
    backgroundColor: isDark ? 'rgba(239, 68, 68, 0.16)' : '#FEE2E2',
    borderColor: isDark ? '#F87171' : '#F87171',
  },
];

export const getCancelLeaveBtnTextStyle = (isDark: boolean): TextStyle[] => [
  styles.cancelLeaveBtnText,
  { color: isDark ? '#FCA5A5' : '#DC2626' },
];

export const getCardSurfaceStyle = (isDark: boolean): ViewStyle => ({
  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.88)' : '#FFFFFF',
  borderColor: isDark ? '#334155' : '#D8E1F0',
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: isDark ? 0.2 : 0.05,
  shadowRadius: 8,
  elevation: 2,
});

export const getOriginalCardStyle = (isDark: boolean): ViewStyle[] => [
  styles.originalCard,
  {
    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.92)',
    borderColor: isDark ? '#334155' : '#D5E2FA',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.2 : 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
];

export const getPrimaryTextStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? '#F8FAFC' : '#0F172A',
});

export const getSecondaryTextStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? '#94A3B8' : '#64748B',
});

export const getApproverAvatarStyle = (isDark: boolean): ViewStyle[] => [
  styles.approverAvatar,
  { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.2)' : '#E8F0FE' },
];

export const getApproverInitialsStyle = (isDark: boolean): TextStyle[] => [
  styles.approverInitials,
  { color: isDark ? '#60A5FA' : '#2563EB' },
];

export const getRejectedReasonCardStyle = (isDark: boolean): ViewStyle[] => [
  styles.rejectedReasonCard,
  {
    backgroundColor: isDark ? 'rgba(30, 58, 138, 0.22)' : '#EEF3FD',
    borderColor: isDark ? '#1E40AF' : '#CBD8F6',
  },
];

export const getRejectedReasonTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.rejectedReasonTitle,
  { color: isDark ? '#93C5FD' : '#2E50AB' },
];

export const getRejectedReasonTextStyle = (isDark: boolean): TextStyle[] => [
  styles.rejectedReasonText,
  { color: isDark ? '#E2E8F0' : '#1E293B' },
];

export const getSaveButtonStyle = (isDark: boolean, disabled: boolean): ViewStyle[] => [
  styles.saveButton,
  {
    backgroundColor: isDark ? '#2563EB' : '#1D5BD8',
    opacity: disabled ? 0.6 : 1,
  },
];
