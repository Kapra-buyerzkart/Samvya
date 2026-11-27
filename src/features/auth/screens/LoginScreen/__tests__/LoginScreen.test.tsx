import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { ApiError, tokenStorage } from '@/shared/api';
import { authApi } from '../../../api/authApi';
import { useAuthStore } from '../../../store/authStore';
import { LoginScreen } from '../LoginScreen';

jest.mock('../../../api/authApi', () => ({
  authApi: {
    signIn: jest.fn(),
    listMyOrganizations: jest.fn(),
    switchOrganization: jest.fn(),
    loadStaffSession: jest.fn(),
    refreshSession: jest.fn(),
    revokeSession: jest.fn(),
  },
}));

const mockedAuthApi = authApi as jest.Mocked<typeof authApi>;

describe('LoginScreen', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await tokenStorage.clearTokens();
    useAuthStore.setState({
      isAuthenticated: false,
      requiresOrganizationSelection: false,
      organizations: [],
      session: null,
      user: null,
      pendingUsername: null,
    });
  });

  it('validates required email and password fields', async () => {
    const { getByTestId, getByText } = await render(<LoginScreen />);

    await fireEvent.press(getByTestId('login-submit-btn'));
    expect(getByText('Please enter your staff email.')).toBeTruthy();

    await fireEvent.changeText(
      getByTestId('login-email-input'),
      'backupssajil@gmail.com',
    );
    await fireEvent.press(getByTestId('login-submit-btn'));
    expect(getByText('Please enter your password.')).toBeTruthy();
  });

  it('toggles password visibility', async () => {
    const { getByTestId } = await render(<LoginScreen />);

    expect(getByTestId('login-password-input').props.secureTextEntry).toBe(true);

    await fireEvent.press(getByTestId('toggle-password-visibility-btn'));
    expect(getByTestId('login-password-input').props.secureTextEntry).toBe(false);
  });

  it('fills test staff credentials in dev mode when pressing Fill test credentials', async () => {
    const { getByTestId } = await render(<LoginScreen />);

    await fireEvent.press(getByTestId('fill-test-credentials-btn'));

    expect(getByTestId('login-email-input').props.value).toBe('backupssajil@gmail.com');
    expect(getByTestId('login-password-input').props.value).toBe('Password@123');
  });

  it('signs in with staff email and password and navigates to app', async () => {
    mockedAuthApi.signIn.mockResolvedValue({
      token: 'acc_tok',
      refreshToken: 'ref_tok',
      requiresOrganizationSelection: false,
      tenantId: 10,
      memberId: 42,
    });
    mockedAuthApi.loadStaffSession.mockResolvedValue({
      tenantId: 10,
      memberId: 42,
      employmentId: 105,
      employmentPublicId: 'emp_pub_105',
    });

    const { getByTestId } = await render(<LoginScreen />);

    await fireEvent.changeText(
      getByTestId('login-email-input'),
      'backupssajil@gmail.com',
    );
    await fireEvent.changeText(getByTestId('login-password-input'), 'Password@123');
    await fireEvent.press(getByTestId('login-submit-btn'));

    await waitFor(() => {
      expect(mockedAuthApi.signIn).toHaveBeenCalledWith({
        username: 'backupssajil@gmail.com',
        password: 'Password@123',
      });
      expect(router.replace).toHaveBeenCalledWith('/(app)');
    });
  });

  it('shows API error message when credentials are rejected', async () => {
    mockedAuthApi.signIn.mockRejectedValue(
      new ApiError({ status: 401, message: 'Unauthorized' }),
    );

    const { getByTestId, findByText } = await render(<LoginScreen />);

    await fireEvent.changeText(getByTestId('login-email-input'), 'wrong@company.com');
    await fireEvent.changeText(getByTestId('login-password-input'), 'BadPass');
    await fireEvent.press(getByTestId('login-submit-btn'));

    expect(
      await findByText('Invalid email or password. Please check your credentials and try again.'),
    ).toBeTruthy();
  });

  it('opens organization picker when requiresOrganizationSelection is true and completes sign-in', async () => {
    mockedAuthApi.signIn.mockResolvedValue({
      token: 'acct_tok',
      refreshToken: 'ref_tok',
      requiresOrganizationSelection: true,
      tenantId: null,
      memberId: 42,
    });
    mockedAuthApi.listMyOrganizations.mockResolvedValue([
      { tenantId: 11, name: 'Samavya India', role: 'Staff' },
      { tenantId: 22, name: 'Samavya Global', role: 'Lead' },
    ]);
    mockedAuthApi.switchOrganization.mockResolvedValue({
      token: 'org_tok',
      refreshToken: 'org_ref',
      requiresOrganizationSelection: false,
      tenantId: 22,
      memberId: 42,
    });
    mockedAuthApi.loadStaffSession.mockResolvedValue({
      tenantId: 22,
      memberId: 42,
      employmentId: 300,
      employmentPublicId: 'emp_pub_300',
    });

    const { getByTestId, findByTestId } = await render(<LoginScreen />);

    await fireEvent.changeText(getByTestId('login-email-input'), 'multi@company.com');
    await fireEvent.changeText(getByTestId('login-password-input'), 'Password@123');
    await fireEvent.press(getByTestId('login-submit-btn'));

    expect(await findByTestId('organization-picker-sheet')).toBeTruthy();
    await fireEvent.press(await findByTestId('org-option-22'));

    await waitFor(() => {
      expect(mockedAuthApi.switchOrganization).toHaveBeenCalledWith(22);
      expect(router.replace).toHaveBeenCalledWith('/(app)');
    });
  });
});
