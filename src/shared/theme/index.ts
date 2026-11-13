import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, type Theme } from './colors';

export function useAppTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
}

export * from './colors';
export * from './typography';

