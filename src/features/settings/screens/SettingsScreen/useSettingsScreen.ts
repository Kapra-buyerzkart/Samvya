import { useAuthStore } from '@/features/auth/model/authStore';
import { useAppTheme, useThemeStore, type ThemePreference } from '@/shared/theme';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert } from 'react-native';

export function useSettingsScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const theme = useAppTheme();
  const themePreference = useThemeStore((s) => s.themePreference);
  const setThemePreference = useThemeStore((s) => s.setThemePreference);
  const toggleDarkMode = useThemeStore((s) => s.toggleDarkMode);

  const displayName = user?.name || 'Aarav Sharma';
  const displayEmail = user?.email || 'aarav.sharma@samavya.internal';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of Samavya HRMS?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleBack = () => {
    router.back();
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
    handleSignOut,
    handleBack,
    handleProfilePress,
    handleDisabledProfilePress,
    handleResetPasswordPress,
    themeOptions,
  };
}
