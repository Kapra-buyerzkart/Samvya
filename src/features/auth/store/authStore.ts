import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  configureHttpClientAuth,
  queryClient,
  tokenStorage,
} from '@/shared/api';
import {
  LEGACY_SHIFT_TIMER_STORAGE_KEY,
  SHIFT_TIMER_STORAGE_KEY,
} from '@/shared/constants';
import { appStorage, zustandMMKVStorage } from '@/shared/storage';
import {
  authApi,
  type EntityId,
  type OrganizationOption,
  type StaffSession,
} from '../api/authApi';

const INSTALL_MARKER_KEY = 'hrms-auth-installed';

export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  employeeCode: string;
  department: string;
  designation?: string;
  joiningDate?: string;
  emergencyContact?: string;
  location?: string;
  dpdpConsentGiven: boolean;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dob?: string;
  gender?: string;
  otherEmail?: string;
  otherPhone?: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResult {
  requiresOrganizationSelection: boolean;
  organizations: OrganizationOption[];
}

export interface AuthState {
  isAuthenticated: boolean;
  requiresOrganizationSelection: boolean;
  organizations: OrganizationOption[];
  session: StaffSession | null;
  user: UserProfile | null;
  pendingUsername: string | null;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  selectOrganization: (tenantId: EntityId) => Promise<void>;
  cancelOrganizationSelection: () => Promise<void>;
  refreshSession: () => Promise<string | null>;
  hydrateAuthOnStartup: () => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: UserProfile) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
}

function buildDisplayNameFromEmail(email: string): string {
  const localPart = email.split('@')[0] || 'Staff Member';
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildUserProfile(
  session: StaffSession,
  fallbackEmail: string,
  previousUser: UserProfile | null,
): UserProfile {
  const email = session.email || fallbackEmail || previousUser?.email || '';
  const name = session.name || previousUser?.name || buildDisplayNameFromEmail(email);

  return {
    ...previousUser,
    id: session.memberId != null ? String(session.memberId) : (previousUser?.id ?? 'staff'),
    name,
    email,
    employeeCode: session.employeeCode || previousUser?.employeeCode || 'EMP',
    department: session.department || previousUser?.department || 'General',
    designation: session.designation || previousUser?.designation,
    dpdpConsentGiven: previousUser?.dpdpConsentGiven ?? true,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      requiresOrganizationSelection: false,
      organizations: [],
      session: null,
      user: null,
      pendingUsername: null,

      login: async ({ username, password }) => {
        const trimmedUsername = username.trim();
        const authResult = await authApi.signIn({
          username: trimmedUsername,
          password,
        });

        await tokenStorage.setTokens({
          accessToken: authResult.token,
          refreshToken: authResult.refreshToken,
        });
        appStorage.set(INSTALL_MARKER_KEY, true);

        // Clear employment variables until /auth/session confirms active employment
        set({
          isAuthenticated: false,
          requiresOrganizationSelection: authResult.requiresOrganizationSelection,
          pendingUsername: trimmedUsername,
          session: {
            tenantId: authResult.tenantId,
            memberId: authResult.memberId,
            employmentId: null,
            employmentPublicId: null,
          },
        });

        if (authResult.requiresOrganizationSelection) {
          const organizations = await authApi.listMyOrganizations(authResult.token);
          set({
            organizations,
            requiresOrganizationSelection: true,
          });
          return {
            requiresOrganizationSelection: true,
            organizations,
          };
        }

        const staffSession = await authApi.loadStaffSession(authResult.token);
        queryClient.clear();

        set((state) => ({
          isAuthenticated: true,
          requiresOrganizationSelection: false,
          organizations: [],
          pendingUsername: null,
          session: staffSession,
          user: buildUserProfile(staffSession, trimmedUsername, state.user),
        }));

        return {
          requiresOrganizationSelection: false,
          organizations: [],
        };
      },

      selectOrganization: async (tenantId) => {
        const switchResult = await authApi.switchOrganization(tenantId);

        await tokenStorage.setTokens({
          accessToken: switchResult.token,
          refreshToken: switchResult.refreshToken,
        });
        appStorage.set(INSTALL_MARKER_KEY, true);

        const staffSession = await authApi.loadStaffSession(switchResult.token);
        queryClient.clear();

        set((state) => ({
          isAuthenticated: true,
          requiresOrganizationSelection: switchResult.requiresOrganizationSelection,
          organizations: [],
          pendingUsername: null,
          session: {
            ...staffSession,
            tenantId: staffSession.tenantId ?? switchResult.tenantId,
            memberId: staffSession.memberId ?? switchResult.memberId,
          },
          user: buildUserProfile(
            staffSession,
            state.pendingUsername || state.user?.email || '',
            state.user,
          ),
        }));
      },

      cancelOrganizationSelection: async () => {
        await get().logout();
      },

      refreshSession: async () => {
        const currentRefreshToken = await tokenStorage.getRefreshToken();
        if (!currentRefreshToken) {
          return null;
        }

        const refreshed = await authApi.refreshSession(currentRefreshToken);
        await tokenStorage.setTokens({
          accessToken: refreshed.token,
          refreshToken: refreshed.refreshToken ?? currentRefreshToken,
        });

        const staffSession = await authApi.loadStaffSession(refreshed.token);

        set((state) => ({
          isAuthenticated: !refreshed.requiresOrganizationSelection,
          requiresOrganizationSelection: refreshed.requiresOrganizationSelection,
          session: {
            ...staffSession,
            tenantId: staffSession.tenantId ?? refreshed.tenantId,
            memberId: staffSession.memberId ?? refreshed.memberId,
          },
          user: buildUserProfile(
            staffSession,
            state.pendingUsername || state.user?.email || '',
            state.user,
          ),
        }));

        return refreshed.token;
      },

      hydrateAuthOnStartup: async () => {
        const hasInstallMarker = appStorage.getBoolean(INSTALL_MARKER_KEY) === true;
        if (!hasInstallMarker) {
          // On fresh install (or iOS reinstall where Keychain survives uninstall), purge stale tokens.
          await tokenStorage.clearTokens();
          appStorage.remove(SHIFT_TIMER_STORAGE_KEY);
          appStorage.remove(LEGACY_SHIFT_TIMER_STORAGE_KEY);
          appStorage.set(INSTALL_MARKER_KEY, true);
          set({
            isAuthenticated: false,
            requiresOrganizationSelection: false,
            organizations: [],
            session: null,
            user: null,
            pendingUsername: null,
          });
          return false;
        }

        const { accessToken, refreshToken } = await tokenStorage.getTokens();
        if (!accessToken && !refreshToken) {
          if (get().isAuthenticated) {
            set({
              isAuthenticated: false,
              requiresOrganizationSelection: false,
              organizations: [],
              session: null,
              user: null,
              pendingUsername: null,
            });
          }
          return false;
        }

        try {
          if (accessToken) {
            const staffSession = await authApi.loadStaffSession(accessToken);
            set((state) => ({
              isAuthenticated: true,
              requiresOrganizationSelection: false,
              session: staffSession,
              user: buildUserProfile(staffSession, state.user?.email || '', state.user),
            }));
            return true;
          }
        } catch {
          // Fall through to refresh token attempt
        }

        if (refreshToken) {
          try {
            const nextToken = await get().refreshSession();
            return Boolean(nextToken);
          } catch {
            // Fall through to reset
          }
        }

        await tokenStorage.clearTokens();
        queryClient.clear();
        set({
          isAuthenticated: false,
          requiresOrganizationSelection: false,
          organizations: [],
          session: null,
          user: null,
          pendingUsername: null,
        });
        return false;
      },

      logout: async () => {
        try {
          const refreshToken = await tokenStorage.getRefreshToken();
          if (refreshToken) {
            await authApi.revokeSession(refreshToken);
          }
        } catch {
          // Always clear local credentials even if network revocation fails
        } finally {
          await tokenStorage.clearTokens();
          appStorage.remove(SHIFT_TIMER_STORAGE_KEY);
          appStorage.remove(LEGACY_SHIFT_TIMER_STORAGE_KEY);
          queryClient.clear();
          set({
            isAuthenticated: false,
            requiresOrganizationSelection: false,
            organizations: [],
            session: null,
            user: null,
            pendingUsername: null,
          });
        }
      },

      setUser: (user) => set({ user }),
      updateProfile: (updated) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updated } : null,
        })),
    }),
    {
      name: 'hrms-auth-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        session: state.session,
        user: state.user,
      }),
    },
  ),
);

configureHttpClientAuth({
  onRefreshToken: () => useAuthStore.getState().refreshSession(),
  onSessionExpired: () => useAuthStore.getState().logout(),
});
