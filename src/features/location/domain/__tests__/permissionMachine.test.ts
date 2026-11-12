import {
  evaluateBackgroundPermissionState,
  evaluatePermissionState,
  type PermissionEvaluationInput,
} from '../permissionMachine';

describe('Location Permission State Machine', () => {
  it('returns undetermined when status is undetermined', () => {
    const input: PermissionEvaluationInput = {
      status: 'undetermined',
      granted: false,
    };
    expect(evaluatePermissionState(input)).toEqual({ status: 'undetermined' });
  });

  it('returns granted full when granted with full accuracy', () => {
    const input: PermissionEvaluationInput = {
      status: 'granted',
      granted: true,
      accuracy: 'full',
    };
    expect(evaluatePermissionState(input)).toEqual({
      status: 'granted',
      accuracy: 'full',
    });
  });

  it('returns approximate_only when granted with coarse/reduced accuracy', () => {
    const inputCoarse: PermissionEvaluationInput = {
      status: 'granted',
      granted: true,
      accuracy: 'coarse',
    };
    expect(evaluatePermissionState(inputCoarse)).toEqual({
      status: 'approximate_only',
    });

    const inputReduced: PermissionEvaluationInput = {
      status: 'granted',
      granted: true,
      accuracy: 'reduced',
    };
    expect(evaluatePermissionState(inputReduced)).toEqual({
      status: 'approximate_only',
    });
  });

  it('returns denied with canAskAgain=true when denied once', () => {
    const input: PermissionEvaluationInput = {
      status: 'denied',
      granted: false,
      canAskAgain: true,
    };
    expect(evaluatePermissionState(input)).toEqual({
      status: 'denied',
      canAskAgain: true,
    });
  });

  it('returns blocked when user permanently denies (canAskAgain=false)', () => {
    const input: PermissionEvaluationInput = {
      status: 'denied',
      granted: false,
      canAskAgain: false,
    };
    expect(evaluatePermissionState(input)).toEqual({ status: 'blocked' });
  });

  describe('Background Permission State Machine', () => {
    it('returns foreground_required if foreground permission is not yet granted', () => {
      const input: PermissionEvaluationInput = {
        status: 'granted',
        granted: true,
      };
      // foregroundGranted = false
      expect(evaluateBackgroundPermissionState(input, false)).toEqual({
        status: 'foreground_required',
      });
    });

    it('returns granted when foreground is granted and background is granted', () => {
      const input: PermissionEvaluationInput = {
        status: 'granted',
        granted: true,
      };
      expect(evaluateBackgroundPermissionState(input, true)).toEqual({
        status: 'granted',
      });
    });

    it('returns denied when background is denied but canAskAgain is true', () => {
      const input: PermissionEvaluationInput = {
        status: 'denied',
        granted: false,
        canAskAgain: true,
      };
      expect(evaluateBackgroundPermissionState(input, true)).toEqual({
        status: 'denied',
        canAskAgain: true,
      });
    });

    it('returns blocked when background is denied and canAskAgain is false', () => {
      const input: PermissionEvaluationInput = {
        status: 'denied',
        granted: false,
        canAskAgain: false,
      };
      expect(evaluateBackgroundPermissionState(input, true)).toEqual({
        status: 'blocked',
      });
    });
  });
});

