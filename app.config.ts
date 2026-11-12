import type { ConfigContext, ExpoConfig } from 'expo/config';

const isProductionBuild =
  process.env.APP_ENV === 'production' ||
  process.env.EAS_BUILD_PROFILE === 'production' ||
  process.env.NODE_ENV === 'production';

// Production builds drop x86/x86_64 to reduce Play Store AAB/APK download footprint;
// Development builds retain x86/x86_64 for Android Studio emulators.
const androidBuildArchs = isProductionBuild
  ? ['arm64-v8a', 'armeabi-v7a']
  : ['arm64-v8a', 'armeabi-v7a', 'x86_64', 'x86'];

const extraProguardRules = `
# ==============================================================================
# HRMS Attendance R8 / ProGuard Keep Rules for Release Builds
# ==============================================================================

# 1. VisionCamera & Nitro Modules (JSI, Hybrid Objects & C++ bindings)
-keep class com.margelo.nitro.** { *; }
-keep interface com.margelo.nitro.** { *; }
-keep class * implements com.margelo.nitro.core.HybridObject { *; }
-keep class com.margelo.nitro.camera.** { *; }
-keep class com.mrousavy.camera.** { *; }

# CameraX dependencies used by VisionCamera
-keep class androidx.camera.** { *; }
-keep class android.hardware.camera2.** { *; }

# Keep native JSI / DoNotStrip annotations
-keep @com.facebook.proguard.annotations.DoNotStrip class * { *; }
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}
-keepclasseswithmembernames class * {
    native <methods>;
}

# 2. Google Play Services & ML Kit Face Detection
-keep class com.google.mlkit.** { *; }
-keep class com.google.android.gms.vision.** { *; }
-keep class com.google.android.gms.tasks.** { *; }
-keep class com.google.android.gms.common.** { *; }
-keep class com.google.android.gms.internal.mlkit_vision_face.** { *; }
-keep class com.google.android.gms.internal.mlkit_vision_face_bundled.** { *; }

# 3. Expo Task Manager & Location Background Service
-keep class expo.modules.taskmanager.** { *; }
-keep class expo.modules.location.** { *; }
-keep class expo.modules.interfaces.taskmanager.** { *; }

# 4. React Native SQLite & MMKV
-keep class expo.modules.sqlite.** { *; }
-keep class com.tencent.mmkv.** { *; }
`;

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
        'HRMS requires your location to verify attendance at authorized office sites during check-in.',
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
      'android.permission.CAMERA',
    ],
  },
  web: {
    bundler: 'metro',
    output: 'single',
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
        locationAlwaysAndWhenInUsePermission:
          'Allow HRMS to record your work-session route while clocked in.',
        isIosBackgroundLocationEnabled: true,
        isAndroidBackgroundLocationEnabled: true,
        isAndroidForegroundServiceEnabled: true,
        androidForegroundServiceIcon: './assets/images/android-icon-monochrome.png',
      },
    ],
    [
      '@sentry/react-native',
      {
        organization: 'hrms-corp',
        project: 'hrms-mobile',
      },
    ],
    './plugins/withUnbundledMlKit',
    [
      'expo-build-properties',
      {
        android: {
          enableMinifyInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
          enablePngCrunchInReleaseBuilds: true,
          buildArchs: androidBuildArchs,
          extraProguardRules,
        },
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
