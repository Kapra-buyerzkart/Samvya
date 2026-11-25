# CI/CD Setup & Operations Guide

This repository is an **Expo SDK 58 / React Native 0.88.1** mobile application (**HRMS Attendance**, bundle/application ID `com.hrms.attendance`) using **Expo Continuous Native Generation (CNG)**.

Because `/android` and `/ios` are excluded from Git in `.gitignore` and generated on demand from `app.config.ts` and `./plugins/*`, every CI/CD workflow generates native projects via `npx expo prebuild` on clean runners before compiling.

---

## 1. Pipeline Architecture

```text
.github/
├── actions/
│   └── validate-project/
│       └── action.yml        # Shared composite action: Node 22, npm ci, lint, typecheck, Jest, expo-doctor, expo export
└── workflows/
    ├── ci.yml                # Pull Request validation (JS + Metro/Hermes bundle + Android + iOS Simulator builds)
    ├── android-build.yml     # Android release build (APK + AAB) & optional Google Play Internal Testing deployment
    ├── ios-build.yml         # iOS release build (signed IPA or unsigned simulator fallback) & optional TestFlight deployment
    └── release.yml           # SemVer tag orchestrator (vX.Y.Z) with strict credential & deployment verification
```

### Derived Project Toolchain

| Component | Repository / Derived Value |
| :--- | :--- |
| Framework | Expo `~58.0.26` (CNG), React Native `0.88.1`, React `19.3.0` |
| Node.js & Package Manager | Node `22`, `npm` (`package-lock.json` lockfile v3, `npm ci`) |
| Android Toolchain | `ubuntu-latest`, Java `17` (Temurin), Gradle `9.4.1`, AGP `9.2.1`, `compileSdk 37`, `targetSdk 36`, `minSdk 24`, NDK `27.1.12297006` |
| iOS Toolchain | `macos-26`, Xcode `26.6` (`17F113`), Ruby `3.3` + Bundler (`Gemfile`), CocoaPods `~> 1.16` (`>= 1.16.2`), Deployment Target `16.4` |
| App Identifier | `com.hrms.attendance` (`HRMSAttendance.xcworkspace`, scheme `HRMSAttendance`) |
| Release Versioning | Read dynamically via `npx expo config --type public --json` (`package.json` `version` + `BUILD_NUMBER`) |

### Security & Reliability Controls

- **Least-privilege permissions**: All workflows declare `permissions: { contents: read }`.
- **Action pinning**: All third-party actions are pinned to immutable commit SHAs.
- **No plaintext secrets in repo**: Keystores, `.p12` certificates, provisioning profiles, and API keys live exclusively in GitHub Actions Secrets, are materialized only into `$RUNNER_TEMP` (never the workspace), and are deleted in `if: always()` cleanup steps.
- **Sentry safety**: If `SENTRY_AUTH_TOKEN` is unset, `SENTRY_DISABLE_AUTO_UPLOAD=true` is exported automatically so Gradle and Xcode release builds do not fail attempting to upload source maps/dSYMs. When `SENTRY_AUTH_TOKEN` is configured, Sentry automatically uploads release artifacts.
- **Concurrency & timeouts**: PR and branch runs cancel superseded runs on the same ref; semantic version tag releases set `cancel-in-progress: false` so store deployments are never interrupted mid-flight. Every job sets explicit `timeout-minutes`.

---

## 2. Workflow Triggers & Behavior

| Workflow | Trigger | Validation | Native Build & Artifacts | Store Deployment |
| :--- | :--- | :--- | :--- | :--- |
| **`ci.yml`** | `pull_request` (`opened`, `synchronize`, `reopened`, `ready_for_review`), `workflow_dispatch` | ESLint, TypeScript, Jest, `expo-doctor`, `expo export` (Android + iOS), advisory bundle size check | Android `assembleRelease` validation + iOS Simulator `Release` (`CODE_SIGNING_ALLOWED=NO`) validation | Never |
| **`android-build.yml`** | `push` to `main`, `workflow_dispatch`, `workflow_call` | ESLint, TypeScript, Jest, `expo-doctor`, `expo export -p android` (skipped if called by `release.yml`) | Builds `.aab` + `.apk` + `mapping.txt`; signed if secrets exist, unsigned debug-key fallback on `main` if secrets are not yet configured | Only via `workflow_dispatch` (`deploy_to_play_internal: true`) or `release.yml` — never on `main` push |
| **`ios-build.yml`** | `push` to `main`, `workflow_dispatch`, `workflow_call` | ESLint, TypeScript, Jest, `expo-doctor`, `expo export -p ios` (skipped if called by `release.yml`) | Builds signed `.ipa` + `dSYMs.zip` when Apple certs/profile exist, or unsigned Simulator `.app.zip` fallback on `main` if not yet configured | Only via `workflow_dispatch` (`deploy_to_testflight: true`) or `release.yml` — never on `main` push |
| **`release.yml`** | `push` tags matching `v[0-9]*.[0-9]*.[0-9]*` | Strict SemVer regex check, credential preflight, `package.json` version parity check, full JS/Expo validation | Calls `android-build.yml` (`both`) & `ios-build.yml` with `secrets: inherit` | Required for all enabled platforms (`RELEASE_PLATFORMS`); fails explicitly if any credential or deployment fails |

> **Important (`release.yml` No-Silent-Skip Rule):** Pushing a semantic version tag (e.g., `v1.0.0`) **requires** all signing and store deployment credentials for every enabled platform (`RELEASE_PLATFORMS`, default `all`). If credentials are missing or a store deployment is skipped/fails, `release.yml` fails the run explicitly instead of reporting success.

> **Advisory Bundle Size Budget:** `scripts/check-bundle-budget.js` currently reports an advisory warning in `ci.yml` (`continue-on-error: true`) because `PHASE_BASELINE_BYTES` (`3,137,201` bytes) has not been updated for recent feature additions (~`6.2 MB` bundle). Update `PHASE_BASELINE_BYTES` in `scripts/check-bundle-budget.js` and remove `continue-on-error: true` when enforcing strict per-phase size budgets again.

---

## 3. Required GitHub Secrets

Configure these under **GitHub Repository -> Settings -> Secrets and variables -> Actions -> Secrets**.

### Android Secrets

| Secret Name | Required For | Description |
| :--- | :--- | :--- |
| `ANDROID_KEYSTORE_BASE64` | Signed Android builds & releases | Base64-encoded Android upload `.keystore` / `.jks` file (single line, no line breaks). |
| `ANDROID_KEYSTORE_PASSWORD` | Signed Android builds & releases | Password for the Android keystore. |
| `ANDROID_KEY_ALIAS` | Signed Android builds & releases | Key alias inside the Android keystore. |
| `ANDROID_KEY_PASSWORD` | Signed Android builds & releases | Password for the key alias. |
| `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` | Play Store Internal Testing deployment | Full raw JSON contents of the Google Cloud service account key authorized in Play Console. |

### iOS Secrets

| Secret Name | Required For | Description |
| :--- | :--- | :--- |
| `IOS_DIST_CERT_BASE64` | Signed iOS builds & releases | Base64-encoded Apple Distribution certificate + private key exported as `.p12`. |
| `IOS_DIST_CERT_PASSWORD` | Signed iOS builds & releases | Password used when exporting the `.p12` file. |
| `IOS_PROVISIONING_PROFILE_BASE64` | Signed iOS builds & releases | Base64-encoded App Store distribution `.mobileprovision` file for `com.hrms.attendance`. |
| `APP_STORE_CONNECT_API_KEY_ID` | TestFlight deployment | Key ID of the App Store Connect API key (e.g., `ABC123DEF4`). |
| `APP_STORE_CONNECT_ISSUER_ID` | TestFlight deployment | Issuer UUID from App Store Connect Integrations. |
| `APP_STORE_CONNECT_API_KEY` | TestFlight deployment | Full PEM contents of the `AuthKey_<KEY_ID>.p8` private key file. |

### Optional Shared Secrets

| Secret Name | Required For | Description |
| :--- | :--- | :--- |
| `SENTRY_AUTH_TOKEN` | Optional source map & dSYM upload | Sentry auth token (`org: hrms-corp`, `project: hrms-mobile`). When omitted, auto-upload is disabled (`SENTRY_DISABLE_AUTO_UPLOAD=true`). |

---

## 4. Repository Variables

Configure these under **GitHub Repository -> Settings -> Secrets and variables -> Actions -> Variables**. All have safe defaults.

| Variable Name | Default | Allowed Values / Format | Description |
| :--- | :--- | :--- | :--- |
| `RELEASE_PLATFORMS` | `all` | `all`, `android`, `ios` | Controls which platforms `release.yml` builds and deploys on tag pushes. Cannot be empty or `none`. |
| `BUILD_NUMBER_OFFSET` | `0` | Non-negative integer (e.g., `100`) | Added to `GITHUB_RUN_NUMBER` to compute Android `versionCode` and iOS `CFBundleVersion` (`buildNumber`). Useful when migrating from existing Play Store / TestFlight build numbers. |
| `PLAY_INTERNAL_RELEASE_STATUS` | `completed` | `completed`, `draft`, `inProgress`, `halted` | Release status sent to Google Play Console `internal` track. Set to `draft` if your app listing has never been published/reviewed on Google Play yet. |
| `APPLE_TEAM_ID` | *(extracted from profile)* | 10-char Apple Developer Team ID | Optional override; by default `TeamIdentifier` is extracted directly from the `.mobileprovision` file. |
| `IOS_USES_NON_EXEMPT_ENCRYPTION` | `false` | `true`, `false` | Export compliance flag passed to TestFlight (`usesNonExemptEncryption`). |
| `TESTFLIGHT_WAIT_FOR_PROCESSING` | `true` | `true`, `false` | Whether `upload-testflight-build` waits for App Store Connect build processing before finishing. |
| `TESTFLIGHT_GROUPS` | *(empty)* | Comma-separated group names | Optional exact TestFlight beta group names to attach processed builds to (requires `TESTFLIGHT_WAIT_FOR_PROCESSING=true`). |

---

## 5. Configuring Android Signing

During `npx expo prebuild`, `./plugins/withAndroidReleaseSigning.js` injects `signingConfigs.release` into `android/app/build.gradle` and reads credentials from either Gradle properties (`MYAPP_UPLOAD_*`) or environment variables (`ANDROID_KEYSTORE_*`). When `REQUIRE_RELEASE_SIGNING=true`, Gradle refuses to fall back to `debug.keystore`.

### Generating & Encoding an Upload Keystore

1. Generate an upload keystore (store the original `.keystore` securely in your password manager/vault, **never** in Git):

   ```bash
   keytool -genkeypair -v \
     -storetype PKCS12 \
     -keystore hrms-upload.keystore \
     -alias hrms-upload \
     -keyalg RSA \
     -keysize 2048 \
     -validity 10000
   ```

2. Base64-encode the keystore for `ANDROID_KEYSTORE_BASE64`:

   ```bash
   # macOS
   base64 -i hrms-upload.keystore | tr -d '\n' | pbcopy

   # Linux
   base64 -w 0 hrms-upload.keystore
   ```

3. Set `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, and `ANDROID_KEY_PASSWORD` in GitHub Secrets.
4. For local signed builds, place the keystore outside Git (or inside `android/app/` which is gitignored) and configure `~/.gradle/gradle.properties`:

   ```properties
   MYAPP_UPLOAD_STORE_FILE=/absolute/path/to/hrms-upload.keystore
   MYAPP_UPLOAD_KEY_ALIAS=hrms-upload
   MYAPP_UPLOAD_STORE_PASSWORD=your-keystore-password
   MYAPP_UPLOAD_KEY_PASSWORD=your-key-password
   ```

---

## 6. Configuring iOS Signing

`ios-build.yml` uses manual code signing with an ephemeral macOS keychain via `apple-actions/import-codesign-certs` and installs your provisioning profile into `~/Library/MobileDevice/Provisioning Profiles/` for the duration of the job.

### Exporting Certificate & Provisioning Profile

1. **Create an Apple Distribution Certificate**:
   - In Apple Developer Portal (**Certificates, Identifiers & Profiles -> Certificates**), create an **Apple Distribution** certificate using a CSR from Keychain Access.
   - Download the `.cer`, double-click to import into Keychain Access (`login` -> `My Certificates`), select both the certificate and its private key, and export as `ios_distribution.p12` with a strong password.
   - Base64-encode it into `IOS_DIST_CERT_BASE64`:

     ```bash
     base64 -i ios_distribution.p12 | tr -d '\n' | pbcopy
     ```

   - Save the export password as `IOS_DIST_CERT_PASSWORD`.

2. **Create an App Store Provisioning Profile**:
   - Ensure App ID `com.hrms.attendance` exists with any required capabilities (background location is configured in `Info.plist`).
   - Create an **App Store Connect** distribution provisioning profile bound to `com.hrms.attendance` and your Apple Distribution certificate.
   - Download `HRMS_AppStore.mobileprovision` and base64-encode it into `IOS_PROVISIONING_PROFILE_BASE64`:

     ```bash
     base64 -i HRMS_AppStore.mobileprovision | tr -d '\n' | pbcopy
     ```

---

## 7. Configuring Play Store & TestFlight Deployments

### Google Play Console (Internal Testing)

1. Google Play requires the **first** `.aab` for `com.hrms.attendance` to be uploaded manually in Google Play Console before the Publishing API can manage releases.
2. In Google Cloud Console, enable the **Google Play Android Developer API** (`androidpublisher.googleapis.com`).
3. Create a Service Account (IAM & Admin -> Service Accounts), generate a **JSON key**, and store the full JSON file content in secret `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`.
4. In Google Play Console (**Users and permissions**), invite the service account email and grant **Release apps to testing tracks** (and view app info) for `com.hrms.attendance`.
5. If your app has not completed initial Play Store review yet, set repository variable `PLAY_INTERNAL_RELEASE_STATUS=draft`.

### Apple TestFlight (App Store Connect API)

1. In App Store Connect (**Users and Access -> Integrations -> App Store Connect API**), generate a Team Key with role **App Manager**.
2. Save:
   - **Issuer ID** -> secret `APP_STORE_CONNECT_ISSUER_ID`
   - **Key ID** -> secret `APP_STORE_CONNECT_API_KEY_ID`
   - Full text of `AuthKey_<KEY_ID>.p8` -> secret `APP_STORE_CONNECT_API_KEY`
3. In App Store Connect, verify the app record for `com.hrms.attendance` exists and complete **TestFlight -> Test Information** (Beta App Description, Feedback Email, and Primary Locale) before triggering automated uploads.

---

## 8. How to Trigger a Release

1. Update `"version"` in `package.json` (e.g., `"1.1.0"`). `app.config.ts` derives `version`, Android `versionName`, and iOS `CFBundleShortVersionString` directly from `package.json`.
2. Commit and merge to `main` (verify `ci.yml`, `android-build.yml`, and `ios-build.yml` pass).
3. Create and push an annotated semantic version tag matching `package.json`:

   ```bash
   git checkout main
   git pull origin main
   git tag -a v1.1.0 -m "Release v1.1.0"
   git push origin v1.1.0
   ```

4. Monitor the **Release Build & Deploy** workflow (`release.yml`). It validates SemVer format, ensures all required signing and deployment credentials exist, verifies tag-to-`package.json` version parity, runs the full quality gate, builds signed Android + iOS artifacts, uploads to Google Play Internal Testing & TestFlight, and runs `verify-release` to guarantee all enabled deployments succeeded.

To trigger a one-off build or store deployment without tagging, use **Actions -> Android Build & Deploy** or **Actions -> iOS Build & Deploy -> Run workflow**.

---

## 9. Troubleshooting Failed Workflows

| Symptom | Likely Cause | Fix |
| :--- | :--- | :--- |
| `Release aborted: missing required signing or deployment secrets` | Tag pushed before secrets were configured, or `RELEASE_PLATFORMS=all` when only one platform is configured. | Add the listed secrets under **Settings -> Secrets -> Actions**, or set `RELEASE_PLATFORMS` variable to `android` or `ios`. |
| `Tag version (X.Y.Z) does not match project version` | Git tag does not match `"version"` in `package.json`. | Update `"version"` in `package.json`, commit to `main`, delete the mistyped tag, and re-tag. |
| `Google Play` fails with `Only releases with status draft may be created on a draft app` | App has not had its first production/closed track published yet on Play Console. | Set repository variable `PLAY_INTERNAL_RELEASE_STATUS` to `draft`. |
| `Google Play` fails with `Version code N has already been used` | `GITHUB_RUN_NUMBER` is lower than an existing Play Console build. | Set repository variable `BUILD_NUMBER_OFFSET` higher than the previous max `versionCode`. |
| `iOS` fails with `Provisioning profile application-identifier does not match bundle ID` | Wrong `.mobileprovision` encoded in `IOS_PROVISIONING_PROFILE_BASE64`. | Re-export the App Store profile specifically for `com.hrms.attendance`. |
| `iOS` fails with `No valid code-signing identity found` | `.p12` lacked private key or wrong `IOS_DIST_CERT_PASSWORD`. | Re-export from Keychain Access ensuring the private key under the distribution certificate is included. |
| `TestFlight` fails with missing Test Information or duplicate build number | App Store Connect metadata incomplete or `CFBundleVersion` already uploaded. | Fill in TestFlight Beta App Info in App Store Connect or raise `BUILD_NUMBER_OFFSET`. |
| `sentry-cli` error during Android/iOS build | `SENTRY_AUTH_TOKEN` secret is invalid or expired. | Update `SENTRY_AUTH_TOKEN` or delete the invalid secret so CI falls back to `SENTRY_DISABLE_AUTO_UPLOAD=true`. |
| `CocoaPods` podspec / Xcode version error | Runner image or Expo SDK mismatch. | Ensure `ios-build.yml` and `ci.yml` use `macos-26` with Xcode `26.6` (Expo SDK 58 requires Xcode `26.4+`). |
