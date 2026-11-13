#!/usr/bin/env bash
set -e

# Samavya HRMS - Automated APK Build Script
echo "=========================================="
echo "🚀 Building Samavya HRMS Release APK..."
echo "=========================================="

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Optional quality checks before building
echo "🔍 Running TypeScript typecheck..."
npm run typecheck

echo "📦 Running Android release build via Gradle..."
cd "$PROJECT_ROOT/android"

# Disable Sentry auto upload if auth token is not set
export SENTRY_DISABLE_AUTO_UPLOAD=true

./gradlew assembleRelease

cd "$PROJECT_ROOT"

APK_PATH="$PROJECT_ROOT/android/app/build/outputs/apk/release/app-release.apk"

if [ -f "$APK_PATH" ]; then
  OUTPUT_DIR="$PROJECT_ROOT/dist"
  mkdir -p "$OUTPUT_DIR"
  cp "$APK_PATH" "$OUTPUT_DIR/Samavya.apk"
  cp "$APK_PATH" "$HOME/Desktop/Samavya.apk" 2>/dev/null || true

  APK_SIZE=$(ls -lh "$APK_PATH" | awk '{print $5}')

  echo ""
  echo "=========================================="
  echo "✅ BUILD SUCCESSFUL!"
  echo "=========================================="
  echo "📁 APK Location: $APK_PATH"
  echo "📁 Project Copy: $OUTPUT_DIR/Samavya.apk"
  echo "🖥️  Desktop Copy: $HOME/Desktop/Samavya.apk"
  echo "📊 Size: $APK_SIZE"
  echo ""
  echo "To install on a connected phone/emulator:"
  echo "  adb install -r \"$OUTPUT_DIR/Samavya.apk\""
  echo "=========================================="
else
  echo "❌ Error: APK not found at $APK_PATH"
  exit 1
fi
