import { useState } from 'react';
import {
  checkLocationPermission,
  openSettingsDeepLink,
  requestLocationPermission,
  type LocationPermissionState,
} from '../domain/permissionMachine';
import {
  evaluateGeofence,
  getCheckInFix,
  type CheckInLocationFix,
  type GeofenceEvaluation,
  type GeofenceSite,
} from '../domain/checkInFix';
import { enqueueAttendanceEvent } from '@/features/attendance/db/attendanceQueue';

export type CheckInStep =
  | 'idle'
  | 'checking_permission'
  | 'permission_rationale'
  | 'acquiring'
  | 'evaluating'
  | 'ready'
  | 'enqueued'
  | 'error';

export interface UseCheckInLocationResult {
  step: CheckInStep;
  permissionState: LocationPermissionState;
  currentFix: CheckInLocationFix | null;
  geofenceResult: GeofenceEvaluation | null;
  errorMessage: string | null;
  attemptCount: number;
  startCheckInLocationCapture: (site: GeofenceSite) => Promise<void>;
  requestPermission: (site: GeofenceSite) => Promise<void>;
  openSettings: () => Promise<void>;
  confirmAndEnqueueCheckIn: (userId: string) => Promise<void>;
  reset: () => void;
}

export function useCheckInLocation(): UseCheckInLocationResult {
  const [step, setStep] = useState<CheckInStep>('idle');
  const [permissionState, setPermissionState] = useState<LocationPermissionState>({
    status: 'undetermined',
  });
  const [currentFix, setCurrentFix] = useState<CheckInLocationFix | null>(null);
  const [geofenceResult, setGeofenceResult] = useState<GeofenceEvaluation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [activeSite, setActiveSite] = useState<GeofenceSite | null>(null);

  const acquireFix = async (site: GeofenceSite): Promise<void> => {
    setStep('acquiring');
    setErrorMessage(null);

    try {
      const fix = await getCheckInFix({
        accuracyThresholdMeters: 50,
        maxRetries: 2,
        onStatusChange: (status) => {
          if (status.state === 'acquiring') {
            setAttemptCount(status.attempt);
          } else if (status.state === 'retrying') {
            setStep('acquiring');
          }
        },
      });

      setCurrentFix(fix);
      setStep('evaluating');

      const geofence = evaluateGeofence(fix, site);
      setGeofenceResult(geofence);
      setStep('ready');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Location capture failed');
      setStep('error');
    }
  };

  const startCheckInLocationCapture = async (site: GeofenceSite): Promise<void> => {
    setActiveSite(site);
    setStep('checking_permission');

    const perm = await checkLocationPermission();
    setPermissionState(perm);

    if (perm.status === 'granted') {
      await acquireFix(site);
      return;
    }

    if (perm.status === 'undetermined') {
      const requested = await requestLocationPermission();
      setPermissionState(requested);
      if (requested.status === 'granted') {
        await acquireFix(site);
      } else {
        setStep('permission_rationale');
      }
      return;
    }

    setStep('permission_rationale');
  };

  const handleRequestPermission = async (site: GeofenceSite): Promise<void> => {
    const requested = await requestLocationPermission();
    setPermissionState(requested);
    if (requested.status === 'granted') {
      await acquireFix(site);
    } else {
      setStep('permission_rationale');
    }
  };

  const confirmAndEnqueueCheckIn = async (userId: string): Promise<void> => {
    if (!currentFix || !geofenceResult) {
      throw new Error('No valid location fix available to check in');
    }

    const clientId = 'fix_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

    await enqueueAttendanceEvent({
      clientId,
      userId,
      type: 'check_in',
      latitude: currentFix.latitude,
      longitude: currentFix.longitude,
      accuracy: currentFix.accuracy,
      mocked: currentFix.mocked,
      provider: currentFix.provider,
      distanceToSite: geofenceResult.distanceMeters,
      withinGeofence: geofenceResult.withinGeofence,
      timestamp: currentFix.timestamp,
    });

    setStep('enqueued');
  };

  const reset = (): void => {
    setStep('idle');
    setCurrentFix(null);
    setGeofenceResult(null);
    setErrorMessage(null);
    setAttemptCount(0);
  };

  return {
    step,
    permissionState,
    currentFix,
    geofenceResult,
    errorMessage,
    attemptCount,
    startCheckInLocationCapture,
    requestPermission: (site) => handleRequestPermission(site || activeSite),
    openSettings: openSettingsDeepLink,
    confirmAndEnqueueCheckIn,
    reset,
  };
}

