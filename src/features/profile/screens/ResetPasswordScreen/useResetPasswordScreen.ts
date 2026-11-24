import { useAppTheme } from '@/shared/theme';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert } from 'react-native';

export function useResetPasswordScreen() {
  const theme = useAppTheme();
  const isDark = theme.isDark;
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);

  const strength = useMemo(() => {
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;

    if (score <= 1) return { score, label: 'Weak', color: '#EF4444' };
    if (score === 2) return { score, label: 'Fair', color: '#F59E0B' };
    if (score === 3) return { score, label: 'Good', color: '#3B82F6' };
    return { score, label: 'Strong', color: '#10B981' };
  }, [newPassword]);

  const hasMinLength = newPassword.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isMatching = newPassword.length > 0 && newPassword === confirmPassword;

  const handleUpdatePassword = () => {
    if (!currentPassword) {
      Alert.alert('Required', 'Please enter your current password.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Weak Password', 'New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'New password and confirmation password do not match.');
      return;
    }

    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      Alert.alert(
        'Password Updated',
        'Your password has been changed successfully. Please use your new password next time you sign in.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ],
      );
    }, 500);
  };

  const handleBack = () => {
    router.back();
  };

  const handleToggleShowCurrent = () => {
    setShowCurrent((prev) => !prev);
  };

  const handleToggleShowNew = () => {
    setShowNew((prev) => !prev);
  };

  const handleToggleShowConfirm = () => {
    setShowConfirm((prev) => !prev);
  };

  return {
    isDark,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showCurrent,
    showNew,
    showConfirm,
    isUpdating,
    strength,
    hasMinLength,
    hasNumberOrSymbol,
    isMatching,
    handleUpdatePassword,
    handleBack,
    handleToggleShowCurrent,
    handleToggleShowNew,
    handleToggleShowConfirm,
  };
}
