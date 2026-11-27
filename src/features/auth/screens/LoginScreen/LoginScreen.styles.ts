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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 8,
    marginBottom: 24,
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
    fontSize: 21,
    color: '#0F172A',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 13.5,
    lineHeight: 19,
    color: '#64748B',
    marginBottom: 20,
  },
  fieldLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13.5,
    marginBottom: 8,
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
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: '#0F172A',
    paddingVertical: 8,
  },
  eyeButton: {
    padding: 6,
    marginLeft: 4,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  errorText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  signInButton: {
    backgroundColor: '#1D4ED8',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
  },
  devFillBtn: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  devFillBtnText: {
    fontFamily: FontFamily.medium,
    fontSize: 12.5,
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

export function getFieldLabelStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#E2E8F0' : '#1E293B',
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

export function getErrorBannerStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? 'rgba(239, 68, 68, 0.14)' : '#FEF2F2',
    borderColor: isDark ? 'rgba(248, 113, 113, 0.4)' : '#FECACA',
  };
}

export function getErrorTextStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#FCA5A5' : '#DC2626',
  };
}

export function getSignInButtonStyle(isSubmitting: boolean): (ViewStyle | undefined)[] {
  return [styles.signInButton, isSubmitting ? styles.buttonDisabled : undefined];
}

export function getDevFillBtnStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : '#EFF6FF',
    borderColor: isDark ? '#334155' : '#BFDBFE',
  };
}

export function getDevFillBtnTextStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#93C5FD' : '#1D4ED8',
  };
}
