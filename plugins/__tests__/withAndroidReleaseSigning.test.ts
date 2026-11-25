const { applyReleaseSigningConfig } = require('../withAndroidReleaseSigning');

const SAMPLE_BUILD_GRADLE = `
android {
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.debug
            minifyEnabled true
        }
    }
}
`;

describe('withAndroidReleaseSigning', () => {
  it('injects release signingConfig and conditional release buildType signing', () => {
    const transformed = applyReleaseSigningConfig(SAMPLE_BUILD_GRADLE);

    expect(transformed).toContain('signingConfigs.release');
    expect(transformed).toContain("System.getenv('ANDROID_KEYSTORE_PATH')");
    expect(transformed).toContain("findProperty('MYAPP_UPLOAD_STORE_FILE')");
    expect(transformed).toContain("System.getenv('REQUIRE_RELEASE_SIGNING')");
  });

  it('is idempotent when applied multiple times', () => {
    const once = applyReleaseSigningConfig(SAMPLE_BUILD_GRADLE);
    const twice = applyReleaseSigningConfig(once);

    expect(twice).toBe(once);
  });
});
