import { create } from 'zustand';
import { appStorage } from '@/shared/storage';

export type FeatureFlagKey =
  | 'liveLocation'
  | 'backgroundTracking'
  | 'manualGps'
  | 'faceCheckIn';

export type FeatureFlags = Record<FeatureFlagKey, boolean>;

export const DEFAULT_FLAGS: FeatureFlags = {
  liveLocation: true,
  backgroundTracking: true,
  manualGps: true,
  faceCheckIn: true,
};

const STORAGE_KEY = 'hrms-feature-flags-v2';

function loadStoredFlags(): FeatureFlags {
  try {
    const raw = appStorage.getString(STORAGE_KEY);
    if (!raw) return DEFAULT_FLAGS;
    const parsed = JSON.parse(raw) as Partial<FeatureFlags>;
    return { ...DEFAULT_FLAGS, ...parsed };
  } catch {
    return DEFAULT_FLAGS;
  }
}

interface FeatureFlagStore {
  flags: FeatureFlags;
  setFlag: (key: FeatureFlagKey, value: boolean) => void;
  applyRemoteFlags: (remoteFlags: Partial<FeatureFlags>) => void;
  enableAllFeatures: () => void;
  resetFlags: () => void;
}

export const useFeatureFlagStore = create<FeatureFlagStore>((set, get) => ({
  flags: loadStoredFlags(),
  setFlag: (key, value) => {
    const updated = { ...get().flags, [key]: value };
    appStorage.set(STORAGE_KEY, JSON.stringify(updated));
    set({ flags: updated });
  },
  applyRemoteFlags: (remoteFlags) => {
    const updated = { ...get().flags, ...remoteFlags };
    appStorage.set(STORAGE_KEY, JSON.stringify(updated));
    set({ flags: updated });
  },
  enableAllFeatures: () => {
    const allEnabled: FeatureFlags = {
      liveLocation: true,
      backgroundTracking: true,
      manualGps: true,
      faceCheckIn: true,
    };
    appStorage.set(STORAGE_KEY, JSON.stringify(allEnabled));
    set({ flags: allEnabled });
  },
  resetFlags: () => {
    appStorage.remove(STORAGE_KEY);
    set({ flags: DEFAULT_FLAGS });
  },
}));

export function useFeatureFlag(key: FeatureFlagKey): boolean {
  return useFeatureFlagStore((state) => state.flags[key]);
}

export function getFeatureFlag(key: FeatureFlagKey): boolean {
  return useFeatureFlagStore.getState().flags[key];
}
