const {
  withAndroidManifest,
  withAppBuildGradle,
  AndroidConfig,
  createRunOncePlugin,
} = require('expo/config-plugins');

const pkg = { name: 'with-unbundled-mlkit', version: '1.0.0' };

function withMlKitManifest(config) {
  return withAndroidManifest(config, (modConfig) => {
    const mainApp = AndroidConfig.Manifest.getMainApplicationOrThrow(modConfig.modResults);

    // Google Play Services install-time model download declaration
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApp,
      'com.google.mlkit.vision.DEPENDENCIES',
      'face',
      'value',
    );
    return modConfig;
  });
}

function withUnbundledGradle(config) {
  return withAppBuildGradle(config, (modConfig) => {
    const buildGradle = modConfig.modResults.contents;
    const substitutionBlock = `
// Override bundled ML Kit face detection to unbundled Google Play Services variant (-10 MB APK footprint)
allprojects {
    configurations.all {
        resolutionStrategy.dependencySubstitution {
            substitute module('com.google.mlkit:face-detection') using module('com.google.android.gms:play-services-mlkit-face-detection:17.1.0')
        }
    }
}
`;
    if (!buildGradle.includes('play-services-mlkit-face-detection')) {
      modConfig.modResults.contents = buildGradle + substitutionBlock;
    }
    return modConfig;
  });
}

function withUnbundledMlKit(config) {
  config = withMlKitManifest(config);
  config = withUnbundledGradle(config);
  return config;
}

module.exports = createRunOncePlugin(withUnbundledMlKit, pkg.name, pkg.version);
