import * as Location from 'expo-location';
import { Linking } from 'react-native';

export type LocationPermissionState =
  | { status: 'undetermined' }
  | { status: 'granted'; accuracy: 'full' }
  | { status: 'approximate_only' }
  | { status: 'denied'; canAskAgain: boolean }
  | { status: 'blocked' };

export type BackgroundPermissionState =
  | { status: 'undetermined' }
  | { status: 'granted' }
  | { status: 'denied'; canAskAgain: boolean }
  | { status: 'blocked' }
  | { status: 'foreground_required' };

export interface PermissionEvaluationInput {
  status: Location.PermissionStatus | 'undetermined' | 'granted' | 'denied';
  granted: boolean;
  canAskAgain?: boolean;
  accuracy?: 'full' | 'coarse' | 'reduced' | 'fine' | 'none';
}

export function evaluatePermissionState(input: PermissionEvaluationInput): LocationPermissionState {
  if (input.status === 'undetermined') {
    return { status: 'undetermined' };
  }

  if (input.granted) {
    if (input.accuracy === 'coarse' || input.accuracy === 'reduced') {
      return { status: 'approximate_only' };
    }
    return { status: 'granted', accuracy: 'full' };
  }

  if (input.canAskAgain === false) {
    return { status: 'blocked' };
  }

  return { status: 'denied', canAskAgain: true };
}

export function evaluateBackgroundPermissionState(
  input: PermissionEvaluationInput,
  foregroundGranted: boolean,
): BackgroundPermissionState {
  if (!foregroundGranted) {
    return { status: 'foreground_required' };
  }

  if (input.status === 'undetermined') {
    return { status: 'undetermined' };
  }

  if (input.granted) {
    return { status: 'granted' };
  }

  if (input.canAskAgain === false) {
    return { status: 'blocked' };
  }

  return { status: 'denied', canAskAgain: true };
}

export async function checkLocationPermission(): Promise<LocationPermissionState> {
  const response = await Location.getForegroundPermissionsAsync();
  return evaluatePermissionState({
    status: response.status,
    granted: response.granted,
    canAskAgain: response.canAskAgain,
    accuracy: response.android?.accuracy as 'full' | 'coarse' | undefined,
  });
}

export async function requestLocationPermission(): Promise<LocationPermissionState> {
  const response = await Location.requestForegroundPermissionsAsync();
  return evaluatePermissionState({
    status: response.status,
    granted: response.granted,
    canAskAgain: response.canAskAgain,
    accuracy: response.android?.accuracy as 'full' | 'coarse' | undefined,
  });
}

export async function checkBackgroundLocationPermission(): Promise<BackgroundPermissionState> {
  const fg = await checkLocationPermission();
  const fgGranted = fg.status === 'granted';

  if (!fgGranted) {
    return { status: 'foreground_required' };
  }

  const response = await Location.getBackgroundPermissionsAsync();
  return evaluateBackgroundPermissionState(
    {
      status: response.status,
      granted: response.granted,
      canAskAgain: response.canAskAgain,
    },
    true,
  );
}

export async function requestBackgroundLocationPermission(): Promise<BackgroundPermissionState> {
  // Invariant: Request background permission only after foreground is granted
  const fg = await checkLocationPermission();
  if (fg.status !== 'granted') {
    return { status: 'foreground_required' };
  }

  const response = await Location.requestBackgroundPermissionsAsync();
  return evaluateBackgroundPermissionState(
    {
      status: response.status,
      granted: response.granted,
      canAskAgain: response.canAskAgain,
    },
    true,
  );
}

export async function openSettingsDeepLink(): Promise<void> {
  await Linking.openSettings();
}
