import { tokenStorage } from '@/shared/api';
import { SHIFT_TIMER_STORAGE_KEY } from '@/shared/constants';
import { appStorage } from '@/shared/storage';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../authStore';

jest.mock('../../api/authApi', () => ({
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

describe('AuthStore', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    appStorage.clearAll();
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

  it('starts unauthenticated with null session and user', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
  });

  it('signs in directly, stores secure tokens, and loads staff session', async () => {
    mockedAuthApi.signIn.mockResolvedValue({
      token: 'acc_1',
      refreshToken: 'ref_1',
      requiresOrganizationSelection: false,
      tenantId: 10,
      memberId: 42,
    });
    mockedAuthApi.loadStaffSession.mockResolvedValue({
      tenantId: 10,
      memberId: 42,
      employmentId: 105,
      employmentPublicId: 'emp_pub_105',
      name: 'Sajil Kumar',
      email: 'backupssajil@gmail.com',
      employeeCode: 'KAP0042',
      department: 'Engineering',
    });

    const res = await useAuthStore.getState().login({
      username: 'backupssajil@gmail.com',
      password: 'Password@123',
    });

    expect(res.requiresOrganizationSelection).toBe(false);
    expect(mockedAuthApi.signIn).toHaveBeenCalledWith({
      username: 'backupssajil@gmail.com',
      password: 'Password@123',
    });
    expect(await tokenStorage.getAccessToken()).toBe('acc_1');
    expect(await tokenStorage.getRefreshToken()).toBe('ref_1');

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.session).toMatchObject({
      tenantId: 10,
      memberId: 42,
      employmentId: 105,
      employmentPublicId: 'emp_pub_105',
    });
    expect(state.user?.email).toBe('backupssajil@gmail.com');
    expect(state.user?.employeeCode).toBe('KAP0042');
  });

  it('handles multi-organization selection and switches organization', async () => {
    mockedAuthApi.signIn.mockResolvedValue({
      token: 'acct_select_tok',
      refreshToken: 'ref_select',
      requiresOrganizationSelection: true,
      tenantId: null,
      memberId: 42,
    });
    mockedAuthApi.listMyOrganizations.mockResolvedValue([
      { tenantId: 1, name: 'Samavya HQ', role: 'Employee' },
      { tenantId: 2, name: 'Samavya Labs', role: 'Manager' },
    ]);
    mockedAuthApi.switchOrganization.mockResolvedValue({
      token: 'org2_acc',
      refreshToken: 'org2_ref',
      requiresOrganizationSelection: false,
      tenantId: 2,
      memberId: 42,
    });
    mockedAuthApi.loadStaffSession.mockResolvedValue({
      tenantId: 2,
      memberId: 42,
      employmentId: 201,
      employmentPublicId: 'emp_pub_201',
    });

    const loginRes = await useAuthStore.getState().login({
      username: 'staff@company.com',
      password: 'Password@123',
    });

    expect(loginRes.requiresOrganizationSelection).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().organizations).toHaveLength(2);

    await useAuthStore.getState().selectOrganization(2);

    expect(mockedAuthApi.switchOrganization).toHaveBeenCalledWith(2);
    expect(await tokenStorage.getAccessToken()).toBe('org2_acc');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().requiresOrganizationSelection).toBe(false);
    expect(useAuthStore.getState().session?.employmentId).toBe(201);
  });

  it('refreshes session keeping existing refreshToken when omitted and reloads staff session', async () => {
    await tokenStorage.setTokens({ accessToken: 'old_acc', refreshToken: 'keep_ref' });

    mockedAuthApi.refreshSession.mockResolvedValue({
      token: 'new_acc',
      refreshToken: null,
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

    const nextToken = await useAuthStore.getState().refreshSession();

    expect(nextToken).toBe('new_acc');
    expect(mockedAuthApi.refreshSession).toHaveBeenCalledWith('keep_ref');
    expect(await tokenStorage.getAccessToken()).toBe('new_acc');
    expect(await tokenStorage.getRefreshToken()).toBe('keep_ref');
    expect(mockedAuthApi.loadStaffSession).toHaveBeenCalledWith('new_acc');
  });

  it('revokes refresh session and clears tokens and user on logout', async () => {
    await tokenStorage.setTokens({ accessToken: 'acc_1', refreshToken: 'ref_1' });
    appStorage.set(SHIFT_TIMER_STORAGE_KEY, JSON.stringify({ status: 'punched_in' }));
    useAuthStore.setState({
      isAuthenticated: true,
      session: {
        tenantId: 10,
        memberId: 42,
        employmentId: 105,
        employmentPublicId: 'emp_pub_105',
      },
      user: {
        id: '42',
        name: 'Sajil',
        email: 'backupssajil@gmail.com',
        employeeCode: 'KAP0042',
        department: 'Engineering',
        dpdpConsentGiven: true,
      },
    });
    mockedAuthApi.revokeSession.mockResolvedValue(undefined);

    await useAuthStore.getState().logout();

    expect(mockedAuthApi.revokeSession).toHaveBeenCalledWith('ref_1');
    expect(await tokenStorage.getAccessToken()).toBeNull();
    expect(await tokenStorage.getRefreshToken()).toBeNull();
    expect(appStorage.contains(SHIFT_TIMER_STORAGE_KEY)).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().session).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('purges orphaned Keychain tokens on fresh install and restores when install marker exists', async () => {
    await tokenStorage.setTokens({ accessToken: 'stale_acc', refreshToken: 'stale_ref' });

    const freshRes = await useAuthStore.getState().hydrateAuthOnStartup();
    expect(freshRes).toBe(false);
    expect(await tokenStorage.getAccessToken()).toBeNull();
    expect(await tokenStorage.getRefreshToken()).toBeNull();

    // After install marker is set and tokens are present, startup hydrates session
    await tokenStorage.setTokens({ accessToken: 'valid_acc', refreshToken: 'valid_ref' });
    mockedAuthApi.loadStaffSession.mockResolvedValue({
      tenantId: 10,
      memberId: 42,
      employmentId: 105,
      employmentPublicId: 'emp_pub_105',
    });

    const restored = await useAuthStore.getState().hydrateAuthOnStartup();
    expect(restored).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().session?.employmentId).toBe(105);
  });
});
