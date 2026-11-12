import {
  DEFAULT_FLAGS,
  getFeatureFlag,
  useFeatureFlagStore,
} from '../index';

describe('FeatureFlagStore', () => {
  beforeEach(() => {
    useFeatureFlagStore.getState().resetFlags();
  });

  it('defaults every feature flag open (true)', () => {
    expect(DEFAULT_FLAGS.liveLocation).toBe(true);
    expect(DEFAULT_FLAGS.backgroundTracking).toBe(true);
    expect(DEFAULT_FLAGS.manualGps).toBe(true);
    expect(DEFAULT_FLAGS.faceCheckIn).toBe(true);

    expect(getFeatureFlag('liveLocation')).toBe(true);
    expect(getFeatureFlag('backgroundTracking')).toBe(true);
    expect(getFeatureFlag('manualGps')).toBe(true);
    expect(getFeatureFlag('faceCheckIn')).toBe(true);
  });

  it('updates a flag locally', () => {
    useFeatureFlagStore.getState().setFlag('liveLocation', false);
    expect(getFeatureFlag('liveLocation')).toBe(false);
    expect(getFeatureFlag('backgroundTracking')).toBe(true);
  });

  it('applies remote overrides', () => {
    useFeatureFlagStore.getState().applyRemoteFlags({
      liveLocation: false,
      manualGps: false,
    });

    expect(getFeatureFlag('liveLocation')).toBe(false);
    expect(getFeatureFlag('manualGps')).toBe(false);
    expect(getFeatureFlag('faceCheckIn')).toBe(true);
  });

  it('enables all features explicitly', () => {
    useFeatureFlagStore.getState().applyRemoteFlags({
      liveLocation: false,
    });
    expect(getFeatureFlag('liveLocation')).toBe(false);

    useFeatureFlagStore.getState().enableAllFeatures();
    expect(getFeatureFlag('liveLocation')).toBe(true);
    expect(getFeatureFlag('backgroundTracking')).toBe(true);
    expect(getFeatureFlag('manualGps')).toBe(true);
    expect(getFeatureFlag('faceCheckIn')).toBe(true);
  });
});
