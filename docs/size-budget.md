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
| **Phase 2** | Auth & API Layer, SecureStore, MMKV Session, MSW | TBD | Budget: +150 KB | Budget: +1.0 MB | Budget: +1.0 MB | Pending |
| **Phase 3** | Location Tracking & Offline SQLite Queue | TBD | Budget: +150 KB | Budget: +1.0 MB | Budget: +1.0 MB | Pending |
| **Phase 4** | Face Detection & Active Liveness Flow | TBD | Budget: +150 KB | Budget: +4.0 MB | Budget: +4.0 MB | Pending |
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
