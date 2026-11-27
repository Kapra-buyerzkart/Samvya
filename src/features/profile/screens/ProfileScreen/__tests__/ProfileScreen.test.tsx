import React from 'react';
import { Alert, type AlertButton } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { authApi, useAuthStore } from '@/features/auth';
import { tokenStorage } from '@/shared/api';
import { ProfileScreen } from '../ProfileScreen';

describe('ProfileScreen', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await tokenStorage.setTokens({
      accessToken: 'acc_profile_tok',
      refreshToken: 'ref_profile_tok',
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

  it('navigates to Settings when pressing the settings gear button', async () => {
    const { getByTestId } = await render(<ProfileScreen />);

    await fireEvent.press(getByTestId('profile-settings-btn'));

    expect(router.push).toHaveBeenCalledWith('/(app)/settings');
  });

  it('prompts confirmation, revokes session token, clears auth storage, and navigates to login on Log out', async () => {
    const revokeSpy = jest.spyOn(authApi, 'revokeSession').mockResolvedValue(undefined);
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((_t, _m, buttons) => {
      const destructiveBtn = buttons?.find((b: AlertButton) => b.style === 'destructive');
      destructiveBtn?.onPress?.();
    });

    const { getByTestId } = await render(<ProfileScreen />);

    await fireEvent.press(getByTestId('profile-logout-btn'));

    expect(alertSpy).toHaveBeenCalled();

    await waitFor(async () => {
      expect(revokeSpy).toHaveBeenCalledWith('ref_profile_tok');
      expect(await tokenStorage.getAccessToken()).toBeNull();
      expect(await tokenStorage.getRefreshToken()).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().session).toBeNull();
      expect(useAuthStore.getState().user).toBeNull();
      expect(router.replace).toHaveBeenCalledWith('/(auth)/login');
    });
  });
});
