import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { FontFamily } from '@/shared/theme';

export const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radarIconBubble: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWithPulse: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: FontFamily.headingBold,
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    marginTop: 1,
  },
  liveBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  liveBadgeText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
  },
  capacityBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  capacityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  capacityLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  capacityFloorText: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
  },
  capacityValueText: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
  },
  capacityTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  capacityFill: {
    height: '100%',
    borderRadius: 3,
  },
  capacityFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hotDeskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  hotDeskText: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
  },
  bookDeskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bookDeskBtnBooked: {
    borderWidth: 1,
    borderColor: '#10B981',
  },
  bookDeskBtnText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
  },
  filterScroll: {
    gap: 8,
    paddingBottom: 10,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterPillActive: {},
  filterPillInactive: {},
  filterPillText: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontFamily: FontFamily.bold,
  },
  memberList: {
    gap: 8,
    marginTop: 4,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CBD5E1',
  },
  avatarStatusBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  memberInfoCol: {
    flex: 1,
    marginRight: 8,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberNameText: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
  },
  deptBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  deptBadgeText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
  },
  memberRoleText: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    marginTop: 1,
  },
  locationChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  locationChipText: {
    fontSize: 11,
    fontFamily: FontFamily.semiBold,
  },
  timeChipText: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
  },
  collabBubble: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 4,
  },
  collabBubbleText: {
    fontSize: 10,
    fontFamily: FontFamily.medium,
  },
  quickPingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
  },
  quickPingText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
  },
  tomorrowBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginTop: 12,
  },
  tomorrowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tomorrowTitle: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
  },
  tomorrowHeadline: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    marginBottom: 8,
  },
  tomorrowOptionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tomorrowChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  tomorrowChipActive: {
    borderColor: 'transparent',
  },
  tomorrowChipText: {
    fontSize: 11,
    fontFamily: FontFamily.semiBold,
  },
  tomorrowChipTextActive: {
    color: '#FFFFFF',
    fontFamily: FontFamily.bold,
  },
  sheetContent: {
    paddingBottom: 24,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sheetAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#CBD5E1',
  },
  sheetHeaderDetails: {
    flex: 1,
  },
  sheetName: {
    fontSize: 16,
    fontFamily: FontFamily.headingBold,
  },
  sheetRole: {
    fontSize: 12,
    fontFamily: FontFamily.medium,
    marginTop: 2,
  },
  sheetStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  sheetStatusText: {
    fontSize: 11,
    fontFamily: FontFamily.semiBold,
  },
  sheetSectionBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  sheetMetaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  sheetMetaRowSpaced: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 10,
  },
  sheetMetaCol: {
    flex: 1,
  },
  sheetMetaLabel: {
    fontSize: 10,
    fontFamily: FontFamily.medium,
  },
  sheetMetaValue: {
    fontSize: 13,
    fontFamily: FontFamily.semiBold,
    marginTop: 1,
  },
  sheetActions: {
    gap: 10,
  },
  sheetActionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2563EB',
  },
  sheetActionBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: FontFamily.bold,
  },
  sheetActionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  sheetActionBtnSecondaryText: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
  },
});

export const getCardContainerStyle = (isDark: boolean): ViewStyle[] => [
  styles.cardContainer,
  {
    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
    borderColor: isDark ? '#1E293B' : '#E2E8F0',
  },
];

export const getRadarIconBubbleStyle = (isDark: boolean): ViewStyle[] => [
  styles.radarIconBubble,
  { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
];

export const getSectionTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.sectionTitle,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getSectionSubtitleStyle = (isDark: boolean): TextStyle[] => [
  styles.sectionSubtitle,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getLiveBadgeStyle = (isDark: boolean): ViewStyle[] => [
  styles.liveBadge,
  { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.2)' : '#DBEAFE' },
];

export const getLiveBadgeTextStyle = (isDark: boolean): TextStyle[] => [
  styles.liveBadgeText,
  { color: isDark ? '#93C5FD' : '#1D4ED8' },
];

export const getCapacityBoxStyle = (isDark: boolean): ViewStyle[] => [
  styles.capacityBox,
  {
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : '#F8FAFC',
    borderColor: isDark ? '#334155' : '#E2E8F0',
  },
];

export const getCapacityFloorTextStyle = (isDark: boolean): TextStyle[] => [
  styles.capacityFloorText,
  { color: isDark ? '#E2E8F0' : '#334155' },
];

export const getCapacityValueTextStyle = (isDark: boolean): TextStyle[] => [
  styles.capacityValueText,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getCapacityTrackStyle = (isDark: boolean): ViewStyle[] => [
  styles.capacityTrack,
  { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' },
];

export const getCapacityFillStyle = (capacityPercent: number): ViewStyle[] => [
  styles.capacityFill,
  {
    width: `${capacityPercent}%`,
    backgroundColor:
      capacityPercent > 85 ? '#EF4444' : capacityPercent > 65 ? '#F59E0B' : '#10B981',
  },
];

export const getHotDeskTextStyle = (isDark: boolean): TextStyle[] => [
  styles.hotDeskText,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getBookDeskBtnStyle = (isDark: boolean, bookedDesk: boolean): ViewStyle[] => [
  styles.bookDeskBtn,
  ...(bookedDesk ? [styles.bookDeskBtnBooked] : []),
  {
    backgroundColor: bookedDesk
      ? isDark
        ? '#065F46'
        : '#DCFCE7'
      : isDark
        ? '#1E293B'
        : '#EFF6FF',
  },
];

export const getBookDeskBtnTextStyle = (isDark: boolean, bookedDesk: boolean): TextStyle[] => [
  styles.bookDeskBtnText,
  { color: bookedDesk ? '#10B981' : isDark ? '#60A5FA' : '#2563EB' },
];

export const getFilterPillStyle = (isDark: boolean, isSelected: boolean): ViewStyle[] => [
  styles.filterPill,
  isSelected
    ? { ...styles.filterPillActive, backgroundColor: '#2563EB' }
    : { ...styles.filterPillInactive, backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
];

export const getFilterPillTextStyle = (isDark: boolean, isSelected: boolean): TextStyle[] => [
  styles.filterPillText,
  isSelected ? styles.filterPillTextActive : { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getMemberRowStyle = (isDark: boolean): ViewStyle[] => [
  styles.memberRow,
  {
    backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
    borderColor: isDark ? '#334155' : '#E2E8F0',
  },
];

export const getMemberNameTextStyle = (isDark: boolean): TextStyle[] => [
  styles.memberNameText,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getDeptBadgeStyle = (isDark: boolean): ViewStyle[] => [
  styles.deptBadge,
  { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0' },
];

export const getDeptBadgeTextStyle = (isDark: boolean): TextStyle[] => [
  styles.deptBadgeText,
  { color: isDark ? '#94A3B8' : '#475569' },
];

export const getMemberRoleTextStyle = (isDark: boolean): TextStyle[] => [
  styles.memberRoleText,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getLocationChipTextStyle = (isDark: boolean): TextStyle[] => [
  styles.locationChipText,
  { color: isDark ? '#CBD5E1' : '#334155' },
];

export const getTimeChipTextStyle = (isDark: boolean): TextStyle[] => [
  styles.timeChipText,
  { color: isDark ? '#64748B' : '#94A3B8' },
];

export const getCollabBubbleStyle = (isDark: boolean): ViewStyle[] => [
  styles.collabBubble,
  {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
  },
];

export const getCollabBubbleTextStyle = (isDark: boolean): TextStyle[] => [
  styles.collabBubbleText,
  { color: isDark ? '#94A3B8' : '#475569' },
];

export const getQuickPingBtnStyle = (isDark: boolean): ViewStyle[] => [
  styles.quickPingBtn,
  { backgroundColor: isDark ? '#0F172A' : '#EFF6FF' },
];

export const getQuickPingTextStyle = (isDark: boolean): TextStyle[] => [
  styles.quickPingText,
  { color: isDark ? '#60A5FA' : '#2563EB' },
];

export const getTomorrowBoxStyle = (isDark: boolean): ViewStyle[] => [
  styles.tomorrowBox,
  {
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.4)' : '#F8FAFC',
    borderColor: isDark ? '#334155' : '#E2E8F0',
  },
];

export const getTomorrowTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.tomorrowTitle,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getTomorrowHeadlineStyle = (isDark: boolean): TextStyle[] => [
  styles.tomorrowHeadline,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getTomorrowChipStyle = (isDark: boolean, isSelected: boolean): ViewStyle[] => [
  styles.tomorrowChip,
  isSelected
    ? { ...styles.tomorrowChipActive, backgroundColor: isDark ? '#1D4ED8' : '#2563EB' }
    : { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#CBD5E1' },
];

export const getTomorrowChipTextStyle = (isDark: boolean, isSelected: boolean): TextStyle[] => [
  styles.tomorrowChipText,
  isSelected ? styles.tomorrowChipTextActive : { color: isDark ? '#E2E8F0' : '#334155' },
];

export const getSheetNameStyle = (isDark: boolean): TextStyle[] => [
  styles.sheetName,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getSheetRoleStyle = (isDark: boolean): TextStyle[] => [
  styles.sheetRole,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getSheetStatusTextStyle = (isDark: boolean): TextStyle[] => [
  styles.sheetStatusText,
  { color: isDark ? '#E2E8F0' : '#334155' },
];

export const getSheetSectionBoxStyle = (isDark: boolean): ViewStyle[] => [
  styles.sheetSectionBox,
  {
    backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
    borderColor: isDark ? '#334155' : '#E2E8F0',
  },
];

export const getSheetMetaLabelStyle = (isDark: boolean): TextStyle[] => [
  styles.sheetMetaLabel,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getSheetMetaValueStyle = (isDark: boolean): TextStyle[] => [
  styles.sheetMetaValue,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getSheetActionBtnSecondaryStyle = (isDark: boolean): ViewStyle[] => [
  styles.sheetActionBtnSecondary,
  {
    backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
    borderColor: isDark ? '#334155' : '#BFDBFE',
  },
];

export const getSheetActionBtnSecondaryTextStyle = (isDark: boolean): TextStyle[] => [
  styles.sheetActionBtnSecondaryText,
  { color: isDark ? '#60A5FA' : '#2563EB' },
];
