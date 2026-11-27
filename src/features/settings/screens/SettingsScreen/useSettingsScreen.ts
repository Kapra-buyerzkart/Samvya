import { useState } from 'react';
import { Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { confirmAndSignOut, useAuthStore } from '@/features/auth';
import { useAppTheme, useThemeStore, type ThemePreference } from '@/shared/theme';

export function useSettingsScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const theme = useAppTheme();
  const themePreference = useThemeStore((s) => s.themePreference);
  const setThemePreference = useThemeStore((s) => s.setThemePreference);
  const toggleDarkMode = useThemeStore((s) => s.toggleDarkMode);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const displayName = user?.name || 'Aarav Sharma';
  const displayEmail = user?.email || 'aarav.sharma@samavya.internal';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleSignOut = () => {
    if (isSigningOut) return;
    confirmAndSignOut({
      logout,
      onStart: () => setIsSigningOut(true),
      onFinish: () => setIsSigningOut(false),
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)');
    }
  };

  const handleProfilePress = () => {
    router.push('/(app)/profile');
  };

  const handleDisabledProfilePress = () => {
    Alert.alert(
      'Profile Editing Disabled',
      'Your profile details are managed by your HR administrator.',
    );
  };

  const handleResetPasswordPress = () => {
    router.push('/(app)/profile/reset-password');
  };

  const themeOptions: {
    key: ThemePreference;
    label: string;
    icon: keyof typeof Feather.glyphMap;
  }[] = [
    { key: 'system', label: 'System', icon: 'smartphone' },
    { key: 'light', label: 'Light', icon: 'sun' },
    { key: 'dark', label: 'Dark', icon: 'moon' },
  ];

  return {
    theme,
    themePreference,
    setThemePreference,
    toggleDarkMode,
    displayName,
    displayEmail,
    initials,
    isSigningOut,
    handleSignOut,
    handleBack,
    handleProfilePress,
    handleDisabledProfilePress,
    handleResetPasswordPress,
    themeOptions,
  };
}
