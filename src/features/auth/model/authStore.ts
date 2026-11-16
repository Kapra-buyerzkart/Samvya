import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandMMKVStorage } from '@/shared/storage';

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
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (credentials: { identifier: string; method: 'phone' | 'email'; otp: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: UserProfile) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async ({ identifier, method }) => {
        const dummyUser: UserProfile = {
          id: `usr_${Date.now()}`,
          name: method === 'phone' ? 'Aarav Sharma' : identifier.split('@')[0] || 'Aarav Sharma',
          email: method === 'email' ? identifier : 'aarav.sharma@samavya.internal',
          phone: method === 'phone' ? identifier : '+91 98765 43210',
          employeeCode: 'EMP-2026',
          department: 'Field Operations',
          designation: 'Operations Specialist',
          joiningDate: '15 Jan 2024',
          emergencyContact: '+91 91234 56789',
          location: 'Work from home',
          dpdpConsentGiven: true,
        };
        set({
          isAuthenticated: true,
          user: dummyUser,
        });
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
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
    },
  ),
);

