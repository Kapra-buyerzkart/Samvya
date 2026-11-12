# Release Build Smoke Test Protocol

This document defines the manual and automated smoke-testing procedure required before releasing any production binary on iOS and Android. Every release build must pass this checklist with feature flags both **OFF** and **ON**.

---

## Environment Prerequisites
- Test on **Release** configuration (`npx expo run:ios --configuration Release` or `npx expo run:android --variant release`).
- Physical device or clean simulator/emulator with reset permissions.
- Network toggle capability (Airplane mode) to test offline queueing.

---

## Test Scenarios

### 1. App Launch & Cold Start
- [ ] **Cold Boot**: App starts without crashing; splash screen displays `#0F172A` background and dismisses smoothly within 1.5s.
- [ ] **Hermes JSI Engine**: Hermes runtime is active; memory footprint remains stable (< 80 MB on idle).
- [ ] **Error Boundary**: Intentional unhandled errors in child trees show the retry fallback screen without crashing the process.

---

### 2. Baseline Flow (`liveLocation: false`)
*Verify that the app functions exactly as baseline when the feature flag is off.*
- [ ] **Dashboard Display**: Renders shift status card with `Off Duty` indicator.
- [ ] **Zero Permission Prompts**: Location permissions are **never** requested upon app launch or navigation.
- [ ] **Navigation**: Tapping "Manual Entry" opens the modal; tapping "History" navigates to the attendance history view.

---

### 3. One-Shot Location Check-In (`liveLocation: true`)
*Verify one-shot GPS capture, permission state machine, and geofence gating.*

#### A. Permission State Transitions
- [ ] **Undetermined State**: On initial tap of "Acquire GPS Location", system dialog prompts for `When In Use` location permission.
- [ ] **Denied State**: Declining permission once renders the in-app rationale screen with a "Retry" button.
- [ ] **Blocked State**: When permission is denied with "Don't ask again" (Android) or rejected permanently (iOS), tapping "Open Settings" deep-links directly into device system settings.
- [ ] **Approximate Location**: If the user grants approximate/coarse permission, an alert explains that precise location is required for geofence verification.

#### B. Location Acquisition & Sanity Filtering
- [ ] **Balanced GPS Fix**: Acquires fix within 10 seconds under `Balanced` accuracy.
- [ ] **Accuracy Threshold**: Fixes with horizontal accuracy > 50m trigger an automatic retry attempt (up to 2 retries).
- [ ] **Mock Location Warning**: If using a simulated/spoofed location (e.g. Android mock location app or Xcode simulated location), the warning banner `⚠️ Simulated location provider detected` is displayed and logged.

#### C. Geofence Evaluation (UX Only)
- [ ] **Within Office Site**: Position within the site radius (100m) renders the green `Within Office Site (Xm)` badge.
- [ ] **Outside Office Site**: Position outside the site radius renders the amber `Outside Office Site (Xm from site)` badge.
- [ ] **Audit Trail**: Confirming check-in records distance, accuracy, provider, and mocked flags into the local payload.

---

### 4. Offline Event Queue & Replay
- [ ] **Offline Enqueue**: Disconnect device network (Airplane mode) and tap "Confirm Check-In". The event is immediately saved to the SQLite `attendance_queue` table with status `pending`.
- [ ] **Idempotency**: Submitting with the same `client_id` updates retry count rather than creating duplicate attendance events.
- [ ] **Process Restart**: Force-kill the app and relaunch. Verify that the pending check-in item is preserved in SQLite.
- [ ] **Chronological Replay**: Reconnecting network re適lays pending records in strictly chronological FIFO order (`ORDER BY timestamp ASC`).

---

### 5. UI, Theming & Accessibility
- [ ] **Dark Mode**: Toggle system dark mode. Contrast ratios for text, cards, and badges meet WCAG AA standards.
- [ ] **Safe Areas**: Top header and bottom buttons clear the Dynamic Island, camera notch, and home indicator bar.
- [ ] **Screen Readers**: VoiceOver / TalkBack correctly reads the location status, retry buttons, and geofence badges.
