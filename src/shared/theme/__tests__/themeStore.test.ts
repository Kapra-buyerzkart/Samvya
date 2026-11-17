import { useThemeStore } from '../themeStore';

describe('themeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ themePreference: 'system' });
  });

  it('initializes with default system preference', () => {
    expect(useThemeStore.getState().themePreference).toBe('system');
  });

  it('updates theme preference to dark and light', () => {
    useThemeStore.getState().setThemePreference('dark');
    expect(useThemeStore.getState().themePreference).toBe('dark');

    useThemeStore.getState().setThemePreference('light');
    expect(useThemeStore.getState().themePreference).toBe('light');

    useThemeStore.getState().setThemePreference('system');
    expect(useThemeStore.getState().themePreference).toBe('system');
  });

  it('toggles dark mode between dark and light', () => {
    useThemeStore.getState().setThemePreference('light');
    useThemeStore.getState().toggleDarkMode();
    expect(useThemeStore.getState().themePreference).toBe('dark');

    useThemeStore.getState().toggleDarkMode();
    expect(useThemeStore.getState().themePreference).toBe('light');
  });
});
