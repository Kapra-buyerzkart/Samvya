import {
  CURRENT_DPDP_POLICY_VERSION,
  DPDP_NOTICE_TEXT,
  getDpdpConsent,
  grantDpdpConsent,
  revokeDpdpConsent,
} from '../dpdpConsent';

describe('DPDP Act (2023) Biometric Consent Management', () => {
  beforeEach(() => {
    revokeDpdpConsent();
  });

  it('provides DPDP Act statutory notice text and grievance contact', () => {
    expect(DPDP_NOTICE_TEXT.title).toContain('DPDP Act, 2023');
    expect(DPDP_NOTICE_TEXT.purpose).toContain('verify physical presence');
    expect(DPDP_NOTICE_TEXT.grievanceOfficer).toContain('@');
  });

  it('defaults to unconsented state', () => {
    const consent = getDpdpConsent();
    expect(consent.hasConsented).toBe(false);
    expect(consent.consentedAt).toBeNull();
  });

  it('records affirmative consent with timestamp and policy version', () => {
    const granted = grantDpdpConsent();
    expect(granted.hasConsented).toBe(true);
    expect(granted.consentedAt).toBeGreaterThan(0);
    expect(granted.policyVersion).toBe(CURRENT_DPDP_POLICY_VERSION);

    const reloaded = getDpdpConsent();
    expect(reloaded.hasConsented).toBe(true);
  });

  it('supports withdrawal of consent without penalty', () => {
    grantDpdpConsent();
    expect(getDpdpConsent().hasConsented).toBe(true);

    const revoked = revokeDpdpConsent();
    expect(revoked.hasConsented).toBe(false);
    expect(revoked.consentedAt).toBeNull();
    expect(getDpdpConsent().hasConsented).toBe(false);
  });
});
