import { appStorage } from '@/shared/storage';
import { DEFAULT_MANUAL_POLICY, ManualGpsPolicyConfig } from './types';

const POLICY_STORAGE_KEY = 'hrms-manual-gps-policy';

export function getManualGpsPolicy(): ManualGpsPolicyConfig {
  const raw = appStorage.getString(POLICY_STORAGE_KEY);
  if (!raw) return DEFAULT_MANUAL_POLICY;
  try {
    return { ...DEFAULT_MANUAL_POLICY, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_MANUAL_POLICY;
  }
}

export function saveManualGpsPolicy(policy: Partial<ManualGpsPolicyConfig>): ManualGpsPolicyConfig {
  const current = getManualGpsPolicy();
  const updated: ManualGpsPolicyConfig = { ...current, ...policy };
  appStorage.set(POLICY_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function isSameDay(timestamp1: number, timestamp2: number): boolean {
  const d1 = new Date(timestamp1);
  const d2 = new Date(timestamp2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export interface RateLimitCheckResult {
  allowed: boolean;
  remainingEntriesToday: number;
  maxEntriesPerDay: number;
  reason?: string;
}

export function evaluateRateLimit(
  todaySubmissionsCount: number,
  policy: ManualGpsPolicyConfig = getManualGpsPolicy(),
): RateLimitCheckResult {
  if (!policy.enabled) {
    return {
      allowed: false,
      remainingEntriesToday: 0,
      maxEntriesPerDay: policy.maxManualEntriesPerDay,
      reason: 'Manual GPS submissions are currently disabled by administrative policy.',
    };
  }

  const remaining = Math.max(0, policy.maxManualEntriesPerDay - todaySubmissionsCount);
  const allowed = remaining > 0;

  return {
    allowed,
    remainingEntriesToday: remaining,
    maxEntriesPerDay: policy.maxManualEntriesPerDay,
    reason: allowed
      ? undefined
      : `Daily limit reached (${policy.maxManualEntriesPerDay}/${policy.maxManualEntriesPerDay}). Contact supervisor for manual approval override.`,
  };
}
