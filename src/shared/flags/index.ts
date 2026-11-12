import { create } from 'zustand';
import { appStorage } from '@/shared/storage';

export type FeatureFlagKey =
  | 'auth_flow'
  | 'live_location_tracking'
  | 'face_verification'
  | 'manual_gps_entry'
  | 'offline_sync_queue';

export type FeatureFlags = Record<FeatureFlagKey, boolean>;

export const DEFAULT_FLAGS: FeatureFlags = {
  auth_flow: false,
  live_location_tracking: false,
  face_verification: false,
  manual_gps_entry: false,
  offline_sync_queue: false,
};

const STORAGE_KEY = 'hrms-feature-flags';

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
