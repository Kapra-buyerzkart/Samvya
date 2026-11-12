import { appStorage } from '@/shared/storage';

const DPDP_CONSENT_KEY = 'hrms-dpdp-biometric-consent';

export interface DpdpConsentState {
  hasConsented: boolean;
  consentedAt: number | null;
  policyVersion: string;
}

export const CURRENT_DPDP_POLICY_VERSION = '2024.1';

export const DPDP_NOTICE_TEXT = {
  title: 'Biometric Facial Verification Notice (DPDP Act, 2023)',
  purpose:
    'HRMS processes facial image data solely to verify physical presence for shift attendance and prevent unauthorized proxy check-ins.',
  processingScope:
    'Active on-device liveness challenge (e.g. blink or head turn) confirms a live human is present. Bounding boxes and angle heuristics are evaluated in transient memory. No permanent facial recognition templates or embeddings are stored on your device.',
  retentionPolicy:
    'Transient verification images captured on device are immediately deleted after secure upload. The server maintains attendance audit records in accordance with statutory labor regulations.',
  rights:
    'Under the Digital Personal Data Protection Act, you have the right to access, correct, or withdraw biometric processing consent at any time. If you opt out, you may check in using supervisor-approved manual entry without penalty.',
  grievanceOfficer: 'grievance-officer@hrms-corp.internal',
};

export function getDpdpConsent(): DpdpConsentState {
  const raw = appStorage.getString(DPDP_CONSENT_KEY);
  if (!raw) {
    return {
      hasConsented: false,
      consentedAt: null,
      policyVersion: CURRENT_DPDP_POLICY_VERSION,
    };
  }
  try {
    return JSON.parse(raw) as DpdpConsentState;
  } catch {
    return {
      hasConsented: false,
      consentedAt: null,
      policyVersion: CURRENT_DPDP_POLICY_VERSION,
    };
  }
}

export function grantDpdpConsent(): DpdpConsentState {
  const consent: DpdpConsentState = {
    hasConsented: true,
    consentedAt: Date.now(),
    policyVersion: CURRENT_DPDP_POLICY_VERSION,
  };
  appStorage.set(DPDP_CONSENT_KEY, JSON.stringify(consent));
  return consent;
}

export function revokeDpdpConsent(): DpdpConsentState {
  const revoked: DpdpConsentState = {
    hasConsented: false,
    consentedAt: null,
    policyVersion: CURRENT_DPDP_POLICY_VERSION,
  };
  appStorage.set(DPDP_CONSENT_KEY, JSON.stringify(revoked));
  return revoked;
}
