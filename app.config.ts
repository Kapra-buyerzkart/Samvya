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
      NSLocationWhenInUseUsageDescription:
        'HRMS requires your location to verify attendance at authorized office sites during check-in.',
      UIBackgroundModes: ['fetch'],
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
        locationWhenInUsePermission:
          'Allow HRMS to verify your current location for attendance check-in.',
        isIosBackgroundLocationEnabled: false,
        isAndroidBackgroundLocationEnabled: false,
        isAndroidForegroundServiceEnabled: false,
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
