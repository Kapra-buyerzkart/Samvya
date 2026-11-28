import { FontFamily } from '@/shared/theme';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    padding: 2,
    marginRight: 6,
    marginLeft: -4,
  },
  navTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
    flexGrow: 1,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#DBEAFE',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextCol: {
    marginLeft: 14,
    flex: 1,
  },
  heroName: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    color: '#0F172A',
    marginLeft: 12,
    letterSpacing: -0.2,
  },
  editIconBtn: {
    padding: 6,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  twoColumnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  columnHalf: {
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 14,
  },
  fieldLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#64748B',
  },
  fieldValueBold: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    color: '#0F172A',
    marginTop: 4,
  },
  middleNameSection: {
    marginBottom: 14,
  },
  addText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#2563EB',
    marginTop: 4,
  },
  subCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  subCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  subCardIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subCardTextCol: {
    marginLeft: 10,
    flex: 1,
  },
  subCardLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#64748B',
  },
  subCardActionText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#2563EB',
    marginTop: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: {
    flex: 1,
    marginLeft: 12,
  },
  fieldValueContact: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#0F172A',
    marginTop: 2,
  },
  copyBtn: {
    padding: 6,
  },
  subContainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  subContainerHalf: {
    flex: 1,
    paddingLeft: 4,
  },
  verticalDividerSub: {
    width: 1,
    height: 30,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 12,
  },
  addressBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIllustrationWrapper: {
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressIllustration: {
    width: 80,
    height: 74,
  },
  addressVerticalDivider: {
    width: 1,
    height: 80,
    backgroundColor: '#E2E8F0',
    marginRight: 14,
  },
  addressContent: {
    flex: 1,
  },
  addressEmptyTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 2,
  },
  addressEmptySubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginBottom: 10,
  },
  addAddressBtn: {
    borderWidth: 1.5,
    borderColor: '#2563EB',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  addAddressBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#2563EB',
  },
  bottomEditBtn: {
    backgroundColor: '#1D4ED8',
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 14,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutButton: {
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    marginBottom: 24,
  },
  logoutButtonText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 15,
  },
  bottomEditBtnText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  bottomEditBtnDisabled: {
    backgroundColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  bottomEditBtnDisabledDark: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  bottomEditBtnTextDisabled: {
    color: '#94A3B8',
  },
  notSetText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#94A3B8',
  },
});

export function getBackgroundImageStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#020617' : '#F2F4F8',
  };
}

export function getSafeAreaStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#020617' : 'transparent',
  };
}

export function getTextColor(isDark: boolean): string {
  return isDark ? '#F8FAFC' : '#0F172A';
}

export function getNavTitleStyle(isDark: boolean): TextStyle | undefined {
  return isDark ? { color: '#F8FAFC' } : undefined;
}

export function getHeroCardStyle(isDark: boolean): ViewStyle | undefined {
  return isDark ? { backgroundColor: '#0F172A', borderColor: '#1E293B' } : undefined;
}

export function getAvatarCircleStyle(isDark: boolean): ViewStyle | undefined {
  return isDark ? { backgroundColor: '#1E3A8A', borderColor: '#3B82F6' } : undefined;
}

export function getAvatarTextStyle(isDark: boolean): TextStyle | undefined {
  return isDark ? { color: '#93C5FD' } : undefined;
}

export function getCameraBadgeStyle(isDark: boolean): ViewStyle | undefined {
  return isDark ? { backgroundColor: '#0F172A', borderColor: '#334155' } : undefined;
}

export function getHeroNameStyle(isDark: boolean): TextStyle | undefined {
  return isDark ? { color: '#F8FAFC' } : undefined;
}

export function getHeroSubtitleStyle(isDark: boolean): TextStyle | undefined {
  return isDark ? { color: '#94A3B8' } : undefined;
}

export function getCardStyle(isDark: boolean): ViewStyle | undefined {
  return isDark ? { backgroundColor: '#0F172A', borderColor: '#1E293B' } : undefined;
}

export function getHeaderIconBoxStyle(isDark: boolean): ViewStyle | undefined {
  return isDark ? { backgroundColor: '#1E293B', borderColor: '#334155' } : undefined;
}

export function getCardTitleStyle(isDark: boolean): TextStyle | undefined {
  return isDark ? { color: '#F8FAFC' } : undefined;
}

export function getCardDividerStyle(isDark: boolean): ViewStyle | undefined {
  return isDark ? { backgroundColor: '#1E293B' } : undefined;
}

export function getFieldLabelStyle(isDark: boolean): TextStyle | undefined {
  return isDark ? { color: '#94A3B8' } : undefined;
}

export function getFieldValueBoldStyle(isDark: boolean): TextStyle | undefined {
  return isDark ? { color: '#F8FAFC' } : undefined;
}

export function getVerticalDividerStyle(isDark: boolean): ViewStyle | undefined {
  return isDark ? { backgroundColor: '#1E293B' } : undefined;
}

export function getNotSetTextStyle(isDark: boolean): TextStyle | undefined {
  return isDark ? { color: '#64748B' } : undefined;
}

export function getSubCardStyle(isDark: boolean): ViewStyle | undefined {
  return isDark ? { backgroundColor: '#1E293B', borderColor: '#334155' } : undefined;
}

export function getSubCardIconBoxStyle(isDark: boolean): ViewStyle | undefined {
  return isDark ? { backgroundColor: '#0F172A', borderColor: '#334155' } : undefined;
}

export function getSubCardLabelStyle(isDark: boolean): TextStyle | undefined {
  return isDark ? { color: '#94A3B8' } : undefined;
}

export function getSubCardActionTextStyle(
  isDark: boolean,
  hasValue: boolean,
): (TextStyle | undefined)[] {
  return [
    hasValue ? styles.subCardActionText : styles.notSetText,
    isDark ? { color: hasValue ? '#60A5FA' : '#64748B' } : undefined,
  ];
}

export function getRowIconBoxStyle(isDark: boolean): ViewStyle | undefined {
  return isDark ? { backgroundColor: '#1E293B', borderColor: '#334155' } : undefined;
}

export function getFieldValueContactStyle(isDark: boolean): TextStyle | undefined {
  return isDark ? { color: '#F8FAFC' } : undefined;
}

export function getSubContainerRowStyle(isDark: boolean): ViewStyle | undefined {
  return isDark ? { backgroundColor: '#1E293B', borderColor: '#334155' } : undefined;
}

export function getVerticalDividerSubStyle(isDark: boolean): ViewStyle | undefined {
  return isDark ? { backgroundColor: '#334155' } : undefined;
}

export function getAddressVerticalDividerStyle(isDark: boolean): ViewStyle | undefined {
  return isDark ? { backgroundColor: '#1E293B' } : undefined;
}

export function getAddressEmptyTitleStyle(isDark: boolean): TextStyle | undefined {
  return isDark ? { color: '#F8FAFC' } : undefined;
}

export function getAddressEmptySubtitleStyle(isDark: boolean): TextStyle | undefined {
  return isDark ? { color: '#94A3B8' } : undefined;
}

export function getAddAddressBtnStyle(isDark: boolean): ViewStyle | undefined {
  return isDark ? { borderColor: '#3B82F6', backgroundColor: '#1E293B' } : undefined;
}

export function getAddAddressBtnTextStyle(isDark: boolean): TextStyle | undefined {
  return isDark ? { color: '#60A5FA' } : undefined;
}

export function getBottomEditBtnStyle(isDark: boolean): (ViewStyle | undefined)[] {
  return [
    styles.bottomEditBtn,
    styles.bottomEditBtnDisabled,
    isDark ? styles.bottomEditBtnDisabledDark : undefined,
  ];
}

export function getBottomEditBtnTextStyle(isDark: boolean): (TextStyle | undefined)[] {
  return [
    styles.bottomEditBtnText,
    styles.bottomEditBtnTextDisabled,
    isDark ? { color: '#64748B' } : undefined,
  ];
}

export function getSettingsBtnStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderColor: isDark ? '#334155' : '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0.2 : 0.05,
    shadowRadius: 4,
    elevation: 1,
  };
}

export function getLogoutButtonStyle(isDark: boolean, isLoggingOut: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? 'rgba(239, 68, 68, 0.14)' : '#FEF2F2',
    borderColor: isDark ? 'rgba(239, 68, 68, 0.35)' : '#FECACA',
    opacity: isLoggingOut ? 0.65 : 1,
  };
}

export function getLogoutTextStyle(isDark: boolean): TextStyle {
  return {
    color: isDark ? '#F87171' : '#DC2626',
  };
}
