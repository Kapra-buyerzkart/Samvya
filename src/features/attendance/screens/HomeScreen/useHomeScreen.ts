import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import {
  getActiveTrackingSession,
  startBackgroundTracking,
  startTrackingSession,
  stopBackgroundTracking,
  stopTrackingSession,
} from '@/features/location';
import { useAppTheme } from '@/shared/theme';
import { usePersistentShiftTimer } from '../../hooks/usePersistentShiftTimer';

export const HOURS_OPTIONS = ['Regular', 'Overtime', 'Flexible'] as const;
export type HoursTypeOption = (typeof HOURS_OPTIONS)[number];

export const LOCATION_OPTIONS = ['Work from home', 'Headquarters', 'Client site'] as const;
export type LocationOption = (typeof LOCATION_OPTIONS)[number];

export interface UseHomeScreenResult {
  timer: ReturnType<typeof usePersistentShiftTimer>;
  isDark: boolean;
  showHoursModal: boolean;
  showLocationModal: boolean;
  hoursOptions: typeof HOURS_OPTIONS;
  locationOptions: typeof LOCATION_OPTIONS;
  setShowHoursModal: (show: boolean) => void;
  setShowLocationModal: (show: boolean) => void;
  handleToggleBreak: () => void;
  handlePunchOut: () => void;
  handlePunchIn: () => void;
  handleRequestLeave: () => void;
  handleViewLeaveHistory: () => void;
  handleOpenWeeklyDetails: () => void;
  handleSelectHoursType: (type: HoursTypeOption) => void;
  handleSelectLocation: (loc: LocationOption) => void;
}

export function useHomeScreen(): UseHomeScreenResult {
  const timer = usePersistentShiftTimer();
  const theme = useAppTheme();
  const isDark = theme.isDark;

  const [showHoursModal, setShowHoursModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleToggleBreak = (): void => {
    if (!timer.isOnBreak) {
      timer.startBreak();
      Alert.alert('Break Started', 'You are now on break. Work timer is paused.');
    } else {
      timer.resumeWork();
      Alert.alert('Break Ended', 'Welcome back! Work timer has resumed.');
    }
  };

  const handlePunchOut = (): void => {
    Alert.alert(
      'Punch Out Verification',
      'Punch-out requires face verification and location check.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Quick Punch Out',
          style: 'destructive',
          onPress: async () => {
            timer.punchOut();
            stopTrackingSession();
            await stopBackgroundTracking();
            router.push({
              pathname: '/(app)/attendance/punch-success',
              params: { action: 'punch-out' },
            });
          },
        },
        {
          text: 'Verify Face & Location',
          onPress: () => {
            router.push({
              pathname: '/(app)/attendance/face-verify',
              params: { action: 'punch-out' },
            });
          },
        },
      ],
    );
  };

  const handlePunchIn = (): void => {
    Alert.alert(
      'Punch In Verification',
      'Punch-in requires face verification and location check.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Quick Punch In',
          onPress: async () => {
            try {
              timer.punchIn();
              const current = getActiveTrackingSession();
              if (!current || current.status !== 'tracking') {
                const newSession = startTrackingSession(
                  `sess_${Date.now()}`,
                  'usr_default_employee',
                );
                await startBackgroundTracking(newSession.sessionId, 'usr_default_employee');
              }
              router.push({
                pathname: '/(app)/attendance/punch-success',
                params: { action: 'punch-in' },
              });
            } catch {
              router.push({
                pathname: '/(app)/attendance/punch-success',
                params: { action: 'punch-in' },
              });
            }
          },
        },
        {
          text: 'Verify Face & Location',
          onPress: () => {
            router.push({
              pathname: '/(app)/attendance/face-verify',
              params: { action: 'punch-in' },
            });
          },
        },
      ],
    );
  };

  const handleRequestLeave = (): void => {
    router.push('/(app)/leave/request');
  };

  const handleViewLeaveHistory = (): void => {
    router.push('/(app)/leave/history');
  };

  const handleOpenWeeklyDetails = (): void => {
    router.push('/(app)/employment');
  };

  const handleSelectHoursType = (type: HoursTypeOption): void => {
    timer.setHoursType(type);
    setShowHoursModal(false);
  };

  const handleSelectLocation = (loc: LocationOption): void => {
    timer.setWorkLocation(loc);
    setShowLocationModal(false);
  };

  return {
    timer,
    isDark,
    showHoursModal,
    showLocationModal,
    hoursOptions: HOURS_OPTIONS,
    locationOptions: LOCATION_OPTIONS,
    setShowHoursModal,
    setShowLocationModal,
    handleToggleBreak,
    handlePunchOut,
    handlePunchIn,
    handleRequestLeave,
    handleViewLeaveHistory,
    handleOpenWeeklyDetails,
    handleSelectHoursType,
    handleSelectLocation,
  };
}
