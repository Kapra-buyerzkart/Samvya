import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandMMKVStorage } from '@/shared/storage';

export type ThemePreference = 'system' | 'light' | 'dark';

export interface ThemeState {
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themePreference: 'light',
      setThemePreference: (preference: ThemePreference) => {
        set({ themePreference: preference });
      },
      toggleDarkMode: () => {
        const current = get().themePreference;
        if (current === 'dark') {
          set({ themePreference: 'light' });
        } else {
          set({ themePreference: 'dark' });
        }
      },
    }),
    {
      name: 'hrms-theme-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);
