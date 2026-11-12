import {
  DEFAULT_FLAGS,
  getFeatureFlag,
  useFeatureFlagStore,
} from '../index';

describe('FeatureFlagStore', () => {
  beforeEach(() => {
    useFeatureFlagStore.getState().resetFlags();
  });

  it('defaults all feature flags to false', () => {
    expect(DEFAULT_FLAGS.auth_flow).toBe(false);
    expect(DEFAULT_FLAGS.live_location_tracking).toBe(false);
    expect(DEFAULT_FLAGS.face_verification).toBe(false);
    expect(DEFAULT_FLAGS.manual_gps_entry).toBe(false);
    expect(DEFAULT_FLAGS.offline_sync_queue).toBe(false);

    expect(getFeatureFlag('auth_flow')).toBe(false);
    expect(getFeatureFlag('face_verification')).toBe(false);
  });

  it('updates a single flag and persists it', () => {
    useFeatureFlagStore.getState().setFlag('auth_flow', true);
    expect(getFeatureFlag('auth_flow')).toBe(true);
    expect(getFeatureFlag('face_verification')).toBe(false);
  });

  it('merges remote flags from config response', () => {
    useFeatureFlagStore.getState().applyRemoteFlags({
      live_location_tracking: true,
      manual_gps_entry: true,
    });

    expect(getFeatureFlag('live_location_tracking')).toBe(true);
    expect(getFeatureFlag('manual_gps_entry')).toBe(true);
    expect(getFeatureFlag('face_verification')).toBe(false);
  });
});
