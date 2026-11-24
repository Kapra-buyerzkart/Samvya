import { FontFamily } from '@/shared/theme';
import { type ImageStyle, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 8,
    marginBottom: 20,
  },
  brandTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 36,
    color: '#0F1E36',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  brandSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: '#475569',
  },
  switcherWrapper: {
    marginBottom: 20,
  },
  pillContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  pillTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillTabActive: {
    backgroundColor: '#1D4ED8',
  },
  pillTabInactive: {
    backgroundColor: 'transparent',
  },
  pillText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontFamily: FontFamily.semiBold,
  },
  pillTextInactive: {
    color: '#475569',
    fontFamily: FontFamily.medium,
  },
  switcherHint: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'left',
  },
  card: {
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 86,
    height: 82,
  },
  cardTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    color: '#0F172A',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    color: '#64748B',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: '#0F172A',
    paddingVertical: 8,
  },
  sendOtpRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginBottom: 8,
  },
  sendOtpButton: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  sendOtpText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#1D4ED8',
  },
  otpLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: '#0F172A',
    marginTop: 12,
    marginBottom: 10,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  otpBox: {
    width: 52,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    color: '#0F172A',
    fontVariant: ['tabular-nums'],
    padding: 0,
    includeFontPadding: false,
  },
  otpBoxFocused: {
    borderColor: '#1D4ED8',
    backgroundColor: '#EFF6FF',
  },
  otpBoxFilled: {
    borderColor: '#93C5FD',
    backgroundColor: '#FFFFFF',
  },
  otpBoxDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    color: '#F8FAFC',
  },
  otpBoxFocusedDark: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E3A5F',
  },
  otpBoxFilledDark: {
    borderColor: '#60A5FA',
    backgroundColor: '#1E293B',
  },
  verifyButton: {
    backgroundColor: '#1D4ED8',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#64748B',
  },
});

export function getBackgroundImageStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#020617' : '#F8FAFC',
  };
}

export function getImageProps(isDark: boolean): ImageStyle {
  return {
    opacity: isDark ? 0.05 : 1,
  };
}

export function getBrandTitleStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#F8FAFC' : '#0F1E36',
  };
}

export function getBrandSubtitleStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#94A3B8' : '#475569',
  };
}

export function getPillContainerStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
    borderColor: isDark ? '#334155' : '#E2E8F0',
  };
}

export function getPillTabStyle(isActive: boolean): ViewStyle {
  return isActive ? styles.pillTabActive : styles.pillTabInactive;
}

export function getPillTextStyle(isActive: boolean, isDark: boolean): (TextStyle | { color: string })[] {
  return isActive
    ? [styles.pillText, styles.pillTextActive]
    : [styles.pillText, styles.pillTextInactive, { color: isDark ? '#94A3B8' : '#475569' }];
}

export function getCardStyle(isDark: boolean): ViewStyle | undefined {
  if (isDark) {
    return {
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      borderColor: 'rgba(51, 65, 85, 0.8)',
    };
  }
  return undefined;
}

export function getCardTitleStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#F8FAFC' : '#0F172A',
  };
}

export function getCardSubtitleStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#94A3B8' : '#64748B',
  };
}

export function getInputContainerStyle(isDark: boolean): ViewStyle | undefined {
  if (isDark) {
    return {
      backgroundColor: '#1E293B',
      borderColor: '#334155',
    };
  }
  return undefined;
}

export function getTextInputStyle(isDark: boolean): TextStyle | undefined {
  if (isDark) {
    return {
      color: '#F8FAFC',
    };
  }
  return undefined;
}

export function getSendOtpTextStyle(isDark: boolean): TextStyle | undefined {
  if (isDark) {
    return {
      color: '#60A5FA',
    };
  }
  return undefined;
}

export function getOtpLabelStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#F8FAFC' : '#0F172A',
  };
}

export function getOtpBoxStyle(
  isDark: boolean,
  isFocused: boolean,
  hasDigit: boolean
): (ViewStyle | TextStyle)[] {
  const list: (ViewStyle | TextStyle)[] = [styles.otpBox];
  if (isDark) list.push(styles.otpBoxDark);
  if (isFocused) {
    list.push(isDark ? styles.otpBoxFocusedDark : styles.otpBoxFocused);
  }
  if (hasDigit && !isFocused) {
    list.push(isDark ? styles.otpBoxFilledDark : styles.otpBoxFilled);
  }
  return list;
}

export function getVerifyButtonStyle(isVerifying: boolean): (ViewStyle | undefined)[] {
  return [styles.verifyButton, isVerifying ? styles.buttonDisabled : undefined];
}
