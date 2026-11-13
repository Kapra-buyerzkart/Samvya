export const FontFamily = {
  // Brand & Headings: Plus Jakarta Sans
  headingBold: 'PlusJakartaSans_700Bold',
  headingSemiBold: 'PlusJakartaSans_600SemiBold',
  headingMedium: 'PlusJakartaSans_500Medium',
  headingExtraBold: 'PlusJakartaSans_800ExtraBold',

  // Body & UI: Inter
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const Typography = {
  brandTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 24,
    lineHeight: 28,
    color: '#0F172A',
  },
  screenTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    lineHeight: 28,
    color: '#0F172A',
  },
  sectionTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 16,
    lineHeight: 22,
    color: '#0F172A',
  },
  cardTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: '#0F172A',
  },
  bodyRegular: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: '#334155',
  },
  bodyMedium: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    color: '#1E293B',
  },
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#64748B',
  },
  captionMedium: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    color: '#64748B',
  },
  buttonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    lineHeight: 20,
  },
  timerHero: {
    fontFamily: FontFamily.headingBold,
    fontSize: 32,
    lineHeight: 38,
    fontVariant: ['tabular-nums'] as const,
    color: '#0F172A',
  },
  metricLarge: {
    fontFamily: FontFamily.headingBold,
    fontSize: 28,
    lineHeight: 34,
    fontVariant: ['tabular-nums'] as const,
  },
} as const;

