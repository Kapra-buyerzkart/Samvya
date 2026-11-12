import {
  DEFAULT_FLAGS,
  getFeatureFlag,
  useFeatureFlagStore,
} from '../index';

describe('FeatureFlagStore', () => {
  beforeEach(() => {
    useFeatureFlagStore.getState().resetFlags();
  });

  it('defaults every flag off', () => {
    expect(DEFAULT_FLAGS.liveLocation).toBe(false);
    expect(DEFAULT_FLAGS.backgroundTracking).toBe(false);
    expect(DEFAULT_FLAGS.manualGps).toBe(false);
    expect(DEFAULT_FLAGS.faceCheckIn).toBe(false);

    expect(getFeatureFlag('liveLocation')).toBe(false);
    expect(getFeatureFlag('backgroundTracking')).toBe(false);
    expect(getFeatureFlag('manualGps')).toBe(false);
    expect(getFeatureFlag('faceCheckIn')).toBe(false);
  });

  it('updates a flag locally', () => {
    useFeatureFlagStore.getState().setFlag('liveLocation', true);
    expect(getFeatureFlag('liveLocation')).toBe(true);
    expect(getFeatureFlag('backgroundTracking')).toBe(false);
  });

  it('applies remote overrides', () => {
    useFeatureFlagStore.getState().applyRemoteFlags({
      liveLocation: true,
      manualGps: true,
    });

    expect(getFeatureFlag('liveLocation')).toBe(true);
    expect(getFeatureFlag('manualGps')).toBe(true);
    expect(getFeatureFlag('faceCheckIn')).toBe(false);
  });
});
