import { confirmAndSignOut, useAuthStore } from '@/features/auth';
import { useAppTheme } from '@/shared/theme';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export function useProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const theme = useAppTheme();
  const isDark = theme.isDark;
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName = user?.name || 'Peter S';
  const nameParts = displayName.trim().split(/\s+/);
  const firstName =
    user?.firstName || (nameParts.length > 0 && nameParts[0] ? nameParts[0] : 'Peter');
  const lastName = user?.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'S');
  const middleName = user?.middleName;
  const dob = user?.dob;
  const gender = user?.gender;

  const displayEmail = user?.email || 'peter@gmail.com';
  const displayPhone = user?.phone || '9567-767-8768';
  const otherEmail = user?.otherEmail;
  const otherPhone = user?.otherPhone;
  const address = user?.address;

  const initials = `${firstName[0] ?? 'P'}${lastName[0] ?? 'S'}`.toUpperCase();

  const handleCopy = (text: string, label: string) => {
    Alert.alert('Copied', `${label} copied: ${text}`);
  };

  const handleEditDisabled = () => {
    Alert.alert(
      'Profile Editing Disabled',
      'Your profile details are managed by your HR administrator.',
    );
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)');
    }
  };

  const handleOpenSettings = () => {
    router.push('/(app)/settings');
  };

  const handleSignOut = () => {
    if (isLoggingOut) return;
    confirmAndSignOut({
      logout,
      onStart: () => setIsLoggingOut(true),
      onFinish: () => setIsLoggingOut(false),
    });
  };

  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  return {
    isDark,
    displayName,
    firstName,
    lastName,
    middleName,
    dob,
    gender,
    displayEmail,
    displayPhone,
    otherEmail,
    otherPhone,
    address,
    initials,
    isAddressModalOpen,
    isLoggingOut,
    handleCopy,
    handleEditDisabled,
    handleBack,
    handleOpenSettings,
    handleSignOut,
    handleOpenAddressModal,
    handleCloseAddressModal,
  };
}
