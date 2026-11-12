import { useAuthStore } from '../model/authStore';

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('starts unauthenticated with null user', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('authenticates user with phone number and persists session', async () => {
    await useAuthStore.getState().login({
      identifier: '+919876543210',
      method: 'phone',
      otp: '12345',
    });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).not.toBeNull();
    expect(state.user?.phone).toBe('+919876543210');
    expect(state.user?.employeeCode).toBe('EMP-2026');
  });

  it('authenticates user with email address', async () => {
    await useAuthStore.getState().login({
      identifier: 'arjun.sharma@samavya.internal',
      method: 'email',
      otp: '54321',
    });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe('arjun.sharma@samavya.internal');
  });

  it('clears session on logout', async () => {
    await useAuthStore.getState().login({
      identifier: '+919876543210',
      method: 'phone',
      otp: '12345',
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});

