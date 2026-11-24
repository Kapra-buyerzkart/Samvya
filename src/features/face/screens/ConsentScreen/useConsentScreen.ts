import {
  DPDP_NOTICE_TEXT,
  getDpdpConsent,
  grantDpdpConsent,
  revokeDpdpConsent,
} from '@/features/face/domain/dpdpConsent';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useConsentScreen() {
  const { t } = useTranslation();
  const [consentState, setConsentState] = useState(() => getDpdpConsent());

  const handleAccept = (): void => {
    grantDpdpConsent();
    setConsentState(getDpdpConsent());
    router.back();
  };

  const handleRevoke = (): void => {
    revokeDpdpConsent();
    setConsentState(getDpdpConsent());
    router.back();
  };

  return {
    consentState,
    handleAccept,
    handleRevoke,
    t,
    dpdpNoticeText: DPDP_NOTICE_TEXT,
  };
}
