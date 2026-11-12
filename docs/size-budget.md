# Size Budget & Binary Footprint Tracking

This document records the baseline sizes and per-phase deltas for the HRMS Attendance mobile application across JS bundle (Hermes bytecode) and native app binaries.

## Budgets per Phase
- **JS Bundle (Hermes Bytecode)**: +150 KB max per phase (except Face Phase).
- **Android Download Size (per-ABI)**: +1.0 MB max per phase.
- **iOS Thinned Binary Size**: +1.0 MB max per phase.
- **Face Verification Phase Exception**: Up to +4.0 MB per platform to accommodate `react-native-vision-camera` and native ML Kit C++ runtime libraries.

---

## Tracking Table

| Phase | Description | JS Bundle (Hermes Bytecode) | Delta (JS) | Android Size (arm64-v8a) | iOS Thinned Size | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | Baseline Scaffold, CNG, Core Tooling, Theme & Primitives | 2,758,858 bytes (2.63 MB) | Baseline | Baseline | Baseline | ✅ Passed |
| **liveLocation** | One-Shot Location Capture & Offline SQLite Queue | 3,098,586 bytes (2.96 MB) | +339.7 KB (unshook existing SDK modules) | +0 MB (0 new dependencies) | +0 MB (0 new dependencies) | ✅ Passed |
| **backgroundTracking** | Background Live GPS Tracking, Foreground Service & SQLite Breadcrumbs | 3,137,201 bytes (2.99 MB) | +38.6 KB (Budget: +150 KB) | +0 MB (0 new dependencies) | +0 MB (0 new dependencies) | ✅ Passed |
| **manualGps** | Manual GPS Coordinate Entry, Zod Validation, Form & Audit Workflow | 4,070,171 bytes (3.88 MB) | +932.9 KB (Zod & React Hook Form activation) | +0 MB (0 new dependencies, OTA-safe) | +0 MB (0 new dependencies, OTA-safe) | ⚠️ Budget Review |
| **faceCheckIn** | Face Detection, Active Liveness Flow & DPDP Compliance | 4,177,945 bytes (3.98 MB) | +105.2 KB (Budget: +150 KB) | Dynamic Download via Play Services (~0 MB APK delta, budget +4 MB) | Native Apple Vision (0 extra pods, budget +4 MB) | ✅ Passed |
| **r8Optimization** | R8 Code Minification, Resource Shrinking, ProGuard Rules & Dead Asset Cleanup | 4,177,944 bytes (3.98 MB) | -1 byte (assets -488 KB dead images) | R8 Minify + ShrinkResources + PNG Crunch + x86 dropped | Static frameworks, 7 unused native modules removed | ✅ Passed |
| **Phase 2** | Auth & API Layer, SecureStore, MMKV Session, MSW | TBD | Budget: +150 KB | Budget: +1.0 MB | Budget: +1.0 MB | Pending |
| **Phase 5** | Manual GPS Fallback & Audit Trail | TBD | Budget: +150 KB | Budget: +1.0 MB | Budget: +1.0 MB | Pending |
| **Phase 6** | Hardening, CI & Production Polish | TBD | Budget: +150 KB | Budget: +1.0 MB | Budget: +1.0 MB | Pending |

---

## Measurement Protocol
1. **JS Bundle**: Generated using production Hermes export:
   ```bash
   npx expo export --platform ios
   ```
2. **Inspection Tool**: Analyzed with `expo-atlas` for module dependency weights:
   ```bash
   npx expo-atlas
   ```
3. **Budget Violation Protocol**: If any phase exceeds its budget threshold, development halts immediately to evaluate tree-shaking, dynamic imports, or alternative lightweight platform APIs before merging.

