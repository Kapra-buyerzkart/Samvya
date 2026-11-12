import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

export const appStorage = createMMKV({
  id: 'hrms-app-storage',
});

export const zustandMMKVStorage: StateStorage = {
  getItem: (name: string) => {
    const value = appStorage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    appStorage.set(name, value);
  },
  removeItem: (name: string) => {
    appStorage.remove(name);
  },
};
