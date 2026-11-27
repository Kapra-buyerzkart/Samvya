import { useState } from 'react';
import { Keyboard } from 'react-native';
import { router } from 'expo-router';
import { isApiError } from '@/shared/api';
import { useAppTheme } from '@/shared/theme';
import { type EntityId } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';

const DEV_TEST_CREDENTIALS = __DEV__
  ? {
      username: 'backupssajil@gmail.com',
      password: 'Password@123',
    }
  : null;

export function useLoginScreen() {
  const theme = useAppTheme();
  const isDark = theme.isDark;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [switchingTenantId, setSwitchingTenantId] = useState<EntityId | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const login = useAuthStore((s) => s.login);
  const selectOrganization = useAuthStore((s) => s.selectOrganization);
  const cancelOrganizationSelection = useAuthStore((s) => s.cancelOrganizationSelection);
  const requiresOrganizationSelection = useAuthStore(
    (s) => s.requiresOrganizationSelection,
  );
  const organizations = useAuthStore((s) => s.organizations);

  const handleUsernameChange = (value: string): void => {
    setUsername(value);
    if (errorMessage) setErrorMessage(null);
  };

  const handlePasswordChange = (value: string): void => {
    setPassword(value);
    if (errorMessage) setErrorMessage(null);
  };

  const handleTogglePasswordVisibility = (): void => {
    setShowPassword((prev) => !prev);
  };

  const handleFillTestCredentials = (): void => {
    if (!DEV_TEST_CREDENTIALS) return;
    setUsername(DEV_TEST_CREDENTIALS.username);
    setPassword(DEV_TEST_CREDENTIALS.password);
    if (errorMessage) setErrorMessage(null);
  };

  const handleSignIn = async (): Promise<void> => {
    const trimmedEmail = username.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your staff email.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    Keyboard.dismiss();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await login({
        username: trimmedEmail,
        password,
      });

      if (!result.requiresOrganizationSelection) {
        router.replace('/(app)');
      }
    } catch (error) {
      if (isApiError(error)) {
        setErrorMessage(
          error.status === 401
            ? 'Invalid email or password. Please check your credentials and try again.'
            : error.message,
        );
      } else {
        setErrorMessage('Unable to sign in right now. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectOrganization = async (tenantId: EntityId): Promise<void> => {
    setErrorMessage(null);
    setSwitchingTenantId(tenantId);

    try {
      await selectOrganization(tenantId);
      router.replace('/(app)');
    } catch (error) {
      setErrorMessage(
        isApiError(error)
          ? error.message
          : 'Unable to switch organization. Please try again.',
      );
    } finally {
      setSwitchingTenantId(null);
    }
  };

  const handleCloseOrganizationPicker = (): void => {
    if (switchingTenantId !== null) return;
    cancelOrganizationSelection().catch(() => {});
  };

  return {
    isDark,
    username,
    password,
    showPassword,
    isSubmitting,
    switchingTenantId,
    errorMessage,
    requiresOrganizationSelection,
    organizations,
    canFillTestCredentials: Boolean(DEV_TEST_CREDENTIALS),
    handleUsernameChange,
    handlePasswordChange,
    handleTogglePasswordVisibility,
    handleFillTestCredentials,
    handleSignIn,
    handleSelectOrganization,
    handleCloseOrganizationPicker,
  };
}
