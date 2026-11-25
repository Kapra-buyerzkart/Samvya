const { withAppBuildGradle, createRunOncePlugin } = require('expo/config-plugins');

const pkg = { name: 'with-android-release-signing', version: '1.0.0' };
const SIGNING_MARKER = '// @generated-android-release-signing';

function applyReleaseSigningConfig(buildGradle) {
  if (buildGradle.includes(SIGNING_MARKER)) {
    return buildGradle;
  }

  const signingDebugBlockRegex = /(signingConfigs\s*\{\s*debug\s*\{[\s\S]*?\n\s*\})/;
  if (!signingDebugBlockRegex.test(buildGradle)) {
    throw new Error(
      'withAndroidReleaseSigning: Unable to locate signingConfigs.debug block in android/app/build.gradle.',
    );
  }

  let updated = buildGradle.replace(
    signingDebugBlockRegex,
    `$1
        release {
            ${SIGNING_MARKER}
            def storeFileProp = findProperty('MYAPP_UPLOAD_STORE_FILE') ?: System.getenv('ANDROID_KEYSTORE_PATH')
            def storePasswordProp = findProperty('MYAPP_UPLOAD_STORE_PASSWORD') ?: System.getenv('ANDROID_KEYSTORE_PASSWORD')
            def keyAliasProp = findProperty('MYAPP_UPLOAD_KEY_ALIAS') ?: System.getenv('ANDROID_KEY_ALIAS')
            def keyPasswordProp = findProperty('MYAPP_UPLOAD_KEY_PASSWORD') ?: System.getenv('ANDROID_KEY_PASSWORD')
            if (storeFileProp && storePasswordProp && keyAliasProp && keyPasswordProp) {
                storeFile file(storeFileProp)
                storePassword storePasswordProp
                keyAlias keyAliasProp
                keyPassword keyPasswordProp
            }
        }`,
  );

  const releaseSigningLineRegex =
    /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig\s+signingConfigs\.debug/;
  if (!releaseSigningLineRegex.test(updated)) {
    throw new Error(
      'withAndroidReleaseSigning: Unable to locate buildTypes.release signingConfig in android/app/build.gradle.',
    );
  }

  updated = updated.replace(
    releaseSigningLineRegex,
    `$1def hasReleaseSigning = [
                findProperty('MYAPP_UPLOAD_STORE_FILE') ?: System.getenv('ANDROID_KEYSTORE_PATH'),
                findProperty('MYAPP_UPLOAD_STORE_PASSWORD') ?: System.getenv('ANDROID_KEYSTORE_PASSWORD'),
                findProperty('MYAPP_UPLOAD_KEY_ALIAS') ?: System.getenv('ANDROID_KEY_ALIAS'),
                findProperty('MYAPP_UPLOAD_KEY_PASSWORD') ?: System.getenv('ANDROID_KEY_PASSWORD'),
            ].every { it != null && it.toString().trim().length() > 0 }
            def requireReleaseSigning = (findProperty('REQUIRE_RELEASE_SIGNING') ?: System.getenv('REQUIRE_RELEASE_SIGNING') ?: 'false').toString().toBoolean()
            if (hasReleaseSigning) {
                signingConfig signingConfigs.release
            } else if (requireReleaseSigning) {
                throw new GradleException('Release signing credentials are required when REQUIRE_RELEASE_SIGNING=true.')
            } else {
                signingConfig signingConfigs.debug
            }`,
  );

  return updated;
}

function withAndroidReleaseSigning(config) {
  return withAppBuildGradle(config, (modConfig) => {
    if (modConfig.modResults.language !== 'groovy') {
      throw new Error(
        `withAndroidReleaseSigning: Expected Groovy build.gradle, got ${modConfig.modResults.language}.`,
      );
    }
    modConfig.modResults.contents = applyReleaseSigningConfig(modConfig.modResults.contents);
    return modConfig;
  });
}

const plugin = createRunOncePlugin(withAndroidReleaseSigning, pkg.name, pkg.version);
plugin.applyReleaseSigningConfig = applyReleaseSigningConfig;

module.exports = plugin;
