export const palette = {
  blue50: '#EFF6FF',
  blue500: '#3B82F6',
  blue600: '#2563EB',
  blue700: '#1D4ED8',
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',
  slate950: '#020617',
  emerald500: '#10B981',
  emerald600: '#059669',
  amber500: '#F59E0B',
  amber600: '#D97706',
  rose500: '#F43F5E',
  rose600: '#E11D48',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSubtle: string;
  border: string;
  borderStrong: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryPressed: string;
  primaryContent: string;
  success: string;
  successSurface: string;
  warning: string;
  warningSurface: string;
  error: string;
  errorSurface: string;
}

export interface Theme {
  isDark: boolean;
  colors: ThemeColors;
}

export const lightTheme: Theme = {
  isDark: false,
  colors: {
    background: palette.slate50,
    surface: palette.white,
    surfaceSubtle: palette.slate100,
    border: palette.slate200,
    borderStrong: palette.slate300,
    text: palette.slate900,
    textSecondary: palette.slate600,
    textMuted: palette.slate400,
    primary: palette.blue600,
    primaryPressed: palette.blue700,
    primaryContent: palette.white,
    success: palette.emerald600,
    successSurface: '#ECFDF5',
    warning: palette.amber600,
    warningSurface: '#FFFBEB',
    error: palette.rose600,
    errorSurface: '#FFF1F2',
  },
};

export const darkTheme: Theme = {
  isDark: true,
  colors: {
    background: palette.slate950,
    surface: palette.slate900,
    surfaceSubtle: palette.slate800,
    border: palette.slate800,
    borderStrong: palette.slate700,
    text: palette.slate50,
    textSecondary: palette.slate300,
    textMuted: palette.slate500,
    primary: palette.blue500,
    primaryPressed: palette.blue600,
    primaryContent: palette.white,
    success: palette.emerald500,
    successSurface: '#064E3B',
    warning: palette.amber500,
    warningSurface: '#78350F',
    error: palette.rose500,
    errorSurface: '#881337',
  },
};
