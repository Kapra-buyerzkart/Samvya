import React from 'react';
import { Alert, type AlertButton } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { authApi, useAuthStore } from '@/features/auth';
import { tokenStorage } from '@/shared/api';
import { SettingsScreen } from '../SettingsScreen';

describe('SettingsScreen', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await tokenStorage.setTokens({
      accessToken: 'acc_settings_tok',
      refreshToken: 'ref_settings_tok',
    });
    useAuthStore.setState({
      isAuthenticated: true,
      session: {
        tenantId: 10,
        memberId: 42,
        employmentId: 105,
        employmentPublicId: 'emp_105',
      },
      user: {
        id: '42',
        name: 'Sajil Kumar',
        email: 'backupssajil@gmail.com',
        employeeCode: 'KAP0042',
        department: 'Engineering',
        dpdpConsentGiven: true,
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('revokes session, clears SecureStore tokens, and navigates to login when signing out', async () => {
    const revokeSpy = jest.spyOn(authApi, 'revokeSession').mockResolvedValue(undefined);
    jest.spyOn(Alert, 'alert').mockImplementation((_t, _m, buttons) => {
      const destructiveBtn = buttons?.find((b: AlertButton) => b.style === 'destructive');
      destructiveBtn?.onPress?.();
    });

    const { getByTestId } = await render(<SettingsScreen />);

    await fireEvent.press(getByTestId('settings-logout-btn'));

    await waitFor(async () => {
      expect(revokeSpy).toHaveBeenCalledWith('ref_settings_tok');
      expect(await tokenStorage.getAccessToken()).toBeNull();
      expect(await tokenStorage.getRefreshToken()).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().session).toBeNull();
      expect(useAuthStore.getState().user).toBeNull();
      expect(router.replace).toHaveBeenCalledWith('/(auth)/login');
    });
  });
});
