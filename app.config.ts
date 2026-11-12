import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'HRMS Attendance',
  slug: 'hrms-attendance',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'hrms',
  userInterfaceStyle: 'automatic',
  runtimeVersion: {
    policy: 'fingerprint',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.hrms.attendance',
    infoPlist: {
      NSCameraUsageDescription:
        'HRMS requires camera access for biometric face verification during check-in and check-out.',
      NSLocationWhenInUseUsageDescription:
        'HRMS requires your location to verify attendance at authorized office sites.',
      NSLocationAlwaysAndWhenInUseUsageDescription:
        'HRMS requires continuous location updates in the background during active work sessions for field tracking.',
      UIBackgroundModes: ['location', 'fetch'],
    },
  },
  android: {
    package: 'com.hrms.attendance',
    adaptiveIcon: {
      backgroundColor: '#0F172A',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    permissions: [
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_BACKGROUND_LOCATION',
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.FOREGROUND_SERVICE_LOCATION',
      'android.permission.POST_NOTIFICATIONS',
      'android.permission.CAMERA',
      'android.permission.RECEIVE_BOOT_COMPLETED',
    ],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#0F172A',
        image: './assets/images/splash-icon.png',
        imageWidth: 100,
      },
    ],
    'expo-sqlite',
    'expo-secure-store',
    'expo-localization',
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission:
          'Allow HRMS to record your work-session route while clocked in.',
        locationWhenInUsePermission:
          'Allow HRMS to verify your current location for attendance check-in.',
        isIosBackgroundLocationEnabled: true,
        isAndroidBackgroundLocationEnabled: true,
        isAndroidForegroundServiceEnabled: true,
      },
    ],
    [
      '@sentry/react-native',
      {
        organization: 'hrms-corp',
        project: 'hrms-mobile',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    ...(process.env.EAS_PROJECT_ID
      ? { eas: { projectId: process.env.EAS_PROJECT_ID } }
      : {}),
    apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.hrms.internal/v1',
  },
});
