import { FontFamily } from '@/shared/theme';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flexOne: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 6,
  },
  backButton: {
    padding: 2,
    marginLeft: -4,
  },
  navTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  placeholderRight: {
    width: 24,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(238, 242, 255, 0.75)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 14,
    gap: 12,
    marginBottom: 20,
  },
  bannerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 14,
    color: '#1D4ED8',
    marginBottom: 2,
  },
  bannerText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#475569',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 16,
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: '#475569',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    height: 48,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 8,
  },
  eyeBtn: {
    padding: 6,
  },
  strengthContainer: {
    gap: 6,
    marginTop: -4,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  strengthLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#64748B',
  },
  strengthValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
  },
  strengthBarsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  checklist: {
    gap: 8,
    paddingTop: 4,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#94A3B8',
  },
  checkTextActive: {
    color: '#16A34A',
    fontFamily: FontFamily.medium,
  },
  submitButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 28,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export function getSafeAreaStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#020617' : '#F8FAFC',
  };
}

export function getTextColor(isDark: boolean): string {
  return isDark ? '#F8FAFC' : '#0F172A';
}

export function getNavTitleStyle(isDark: boolean): TextStyle | undefined {
  return isDark ? { color: '#F8FAFC' } : undefined;
}

export function getBannerCardStyle(isDark: boolean): ViewStyle | undefined {
  return isDark ? { backgroundColor: '#0F172A', borderColor: '#1E293B' } : undefined;
}

export function getBannerIconContainerStyle(isDark: boolean): ViewStyle | undefined {
  return isDark ? { backgroundColor: '#1E3A8A' } : undefined;
}

export function getBannerIconColor(isDark: boolean): string {
  return isDark ? '#93C5FD' : '#1D4ED8';
}

export function getBannerTitleStyle(isDark: boolean): TextStyle | undefined {
  return isDark ? { color: '#F8FAFC' } : undefined;
}

export function getBannerTextStyle(isDark: boolean): TextStyle | undefined {
  return isDark ? { color: '#94A3B8' } : undefined;
}

export function getFormCardStyle(isDark: boolean): ViewStyle | undefined {
  return isDark ? { backgroundColor: '#0F172A', borderColor: '#1E293B' } : undefined;
}

export function getFieldLabelStyle(isDark: boolean): TextStyle | undefined {
  return isDark ? { color: '#94A3B8' } : undefined;
}

export function getInputWrapperStyle(isDark: boolean): ViewStyle | undefined {
  return isDark ? { backgroundColor: '#1E293B', borderColor: '#334155' } : undefined;
}

export function getInputIconColor(isDark: boolean): string {
  return isDark ? '#94A3B8' : '#64748B';
}

export function getTextInputStyle(isDark: boolean): TextStyle | undefined {
  return isDark ? { color: '#F8FAFC' } : undefined;
}

export function getPlaceholderTextColor(isDark: boolean): string {
  return isDark ? '#64748B' : '#94A3B8';
}

export function getStrengthLabelStyle(isDark: boolean): TextStyle | undefined {
  return isDark ? { color: '#94A3B8' } : undefined;
}

export function getStrengthValueStyle(color: string): TextStyle {
  return {
    color,
  };
}

export function getCheckTextStyle(checked: boolean, isDark: boolean): (TextStyle | undefined)[] {
  return [
    styles.checkText,
    isDark ? { color: '#94A3B8' } : undefined,
    checked ? (isDark ? { color: '#4ADE80' } : styles.checkTextActive) : undefined,
  ];
}

export function getSubmitButtonStyle(disabled: boolean): (ViewStyle | undefined)[] {
  return [styles.submitButton, disabled ? styles.submitButtonDisabled : undefined];
}
