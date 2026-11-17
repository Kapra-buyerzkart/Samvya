import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, type Theme } from './colors';
import { useThemeStore } from './themeStore';

export function useAppTheme(): Theme {
  const systemScheme = useColorScheme();
  const themePreference = useThemeStore((s) => s.themePreference);

  const isDark =
    themePreference === 'dark'
      ? true
      : themePreference === 'light'
        ? false
        : systemScheme === 'dark';

  return isDark ? darkTheme : lightTheme;
}

export * from './colors';
export * from './typography';
export * from './themeStore';
