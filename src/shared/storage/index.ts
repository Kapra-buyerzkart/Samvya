import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

export interface StoragePort {
  getString(key: string): string | undefined;
  getBoolean(key: string): boolean | undefined;
  getNumber(key: string): number | undefined;
  set(key: string, value: string | boolean | number): void;
  remove(key: string): void;
  contains(key: string): boolean;
  clearAll(): void;
  getAllKeys(): string[];
}

function createFallbackStorage(): StoragePort {
  const memory = new Map<string, string | boolean | number>();
  return {
    getString: (key: string) => (memory.get(key) != null ? String(memory.get(key)) : undefined),
    getBoolean: (key: string) => {
      const val = memory.get(key);
      return typeof val === 'boolean' ? val : undefined;
    },
    getNumber: (key: string) => {
      const val = memory.get(key);
      return typeof val === 'number' ? val : undefined;
    },
    set: (key: string, value: string | boolean | number) => {
      memory.set(key, value);
    },
    remove: (key: string) => {
      memory.delete(key);
    },
    contains: (key: string) => memory.has(key),
    clearAll: () => memory.clear(),
    getAllKeys: () => Array.from(memory.keys()),
  };
}

function initializeStorage(): StoragePort {
  try {
    return createMMKV({
      id: 'hrms-app-storage',
    });
  } catch {
    return createFallbackStorage();
  }
}

export const appStorage: StoragePort = initializeStorage();

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
