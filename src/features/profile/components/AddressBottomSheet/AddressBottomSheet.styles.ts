import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { FontFamily } from '@/shared/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  handleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 6,
  },
  handleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#BFDBFE',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13.5,
    color: '#0F172A',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: '#0F172A',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  selectorBox: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorBoxActive: {
    borderColor: '#2563EB',
  },
  selectorText: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: '#0F172A',
    flex: 1,
  },
  selectorPlaceholder: {
    color: '#94A3B8',
  },
  dropdownContainer: {
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    padding: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  dropdownSearchInput: {
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    fontSize: 13.5,
    fontFamily: FontFamily.regular,
    color: '#0F172A',
    marginBottom: 6,
  },
  dropdownList: {
    maxHeight: 180,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  dropdownItemActive: {
    backgroundColor: '#EFF6FF',
  },
  dropdownItemText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: '#0F172A',
  },
  dropdownItemTextActive: {
    fontFamily: FontFamily.semiBold,
    color: '#2563EB',
  },
  noticeText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 18,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: '#2563EB',
  },
  saveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
});

export const getContainerStyle = (isDark: boolean): ViewStyle[] => [
  styles.container,
  ...(isDark ? [{ backgroundColor: '#0F172A' }] : []),
];

export const getHandleBarStyle = (isDark: boolean): ViewStyle[] => [
  styles.handleBar,
  ...(isDark ? [{ backgroundColor: '#334155' }] : []),
];

export const getIconBoxStyle = (isDark: boolean): ViewStyle[] => [
  styles.iconBox,
  ...(isDark ? [{ backgroundColor: '#1E293B' }] : []),
];

export const getTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.title,
  ...(isDark ? [{ color: '#F8FAFC' }] : []),
];

export const getSubtitleStyle = (isDark: boolean): TextStyle[] => [
  styles.subtitle,
  ...(isDark ? [{ color: '#94A3B8' }] : []),
];

export const getCloseBtnStyle = (isDark: boolean): ViewStyle[] => [
  styles.closeBtn,
  ...(isDark ? [{ backgroundColor: '#1E293B' }] : []),
];

export const getLabelStyle = (isDark: boolean): TextStyle[] => [
  styles.label,
  ...(isDark ? [{ color: '#E2E8F0' }] : []),
];

export const getInputStyle = (isDark: boolean, hasError?: boolean): TextStyle[] => [
  styles.input,
  ...(isDark ? [{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' }] : []),
  ...(hasError ? [styles.inputError] : []),
];

export const getSelectorBoxStyle = (
  isDark: boolean,
  hasError?: boolean,
  isActive?: boolean,
): ViewStyle[] => [
  styles.selectorBox,
  ...(isDark ? [{ backgroundColor: '#1E293B', borderColor: '#334155' }] : []),
  ...(hasError ? [styles.inputError] : []),
  ...(isActive ? [styles.selectorBoxActive] : []),
];

export const getSelectorTextStyle = (isDark: boolean, hasValue: boolean): TextStyle[] => [
  styles.selectorText,
  ...(isDark ? [{ color: '#F8FAFC' }] : []),
  ...(!hasValue ? [styles.selectorPlaceholder] : []),
];

export const getDropdownContainerStyle = (isDark: boolean): ViewStyle[] => [
  styles.dropdownContainer,
  ...(isDark ? [{ backgroundColor: '#1E293B', borderColor: '#334155' }] : []),
];

export const getDropdownSearchInputStyle = (isDark: boolean): TextStyle[] => [
  styles.dropdownSearchInput,
  ...(isDark ? [{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#F8FAFC' }] : []),
];

export const getDropdownItemStyle = (isDark: boolean, isSelected: boolean): ViewStyle[] => [
  styles.dropdownItem,
  ...(isSelected ? [isDark ? { backgroundColor: '#1E3A8A' } : styles.dropdownItemActive] : []),
];

export const getDropdownItemTextStyle = (isDark: boolean, isSelected: boolean): TextStyle[] => [
  styles.dropdownItemText,
  ...(isDark ? [{ color: '#F8FAFC' }] : []),
  ...(isSelected ? [isDark ? { color: '#60A5FA' } : styles.dropdownItemTextActive] : []),
];

export const getNoticeTextStyle = (isDark: boolean): TextStyle[] => [
  styles.noticeText,
  ...(isDark ? [{ color: '#94A3B8' }] : []),
];

export const getCancelBtnStyle = (isDark: boolean): ViewStyle[] => [
  styles.cancelBtn,
  ...(isDark ? [{ backgroundColor: '#1E293B', borderColor: '#3B82F6' }] : []),
];

export const getCancelBtnTextStyle = (isDark: boolean): TextStyle[] => [
  styles.cancelBtnText,
  ...(isDark ? [{ color: '#60A5FA' }] : []),
];
