import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, ThemedText, ThemedView } from '@/shared/components';
import {
  DPDP_NOTICE_TEXT,
  getDpdpConsent,
  grantDpdpConsent,
  revokeDpdpConsent,
} from '@/features/face';

export default function ConsentRoute(): React.JSX.Element {
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

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Card style={styles.card}>
            <ThemedText variant="heading" style={styles.title}>
              {DPDP_NOTICE_TEXT.title}
            </ThemedText>

            <ThemedText variant="body" style={styles.sectionHeader}>
              1. Purpose of Processing
            </ThemedText>
            <ThemedText variant="caption" style={styles.notice}>
              {DPDP_NOTICE_TEXT.purpose}
            </ThemedText>

            <ThemedText variant="body" style={styles.sectionHeader}>
              2. On-Device Scope & Zero Local Retention
            </ThemedText>
            <ThemedText variant="caption" style={styles.notice}>
              {DPDP_NOTICE_TEXT.processingScope}
            </ThemedText>

            <ThemedText variant="body" style={styles.sectionHeader}>
              3. Data Retention & Deletion
            </ThemedText>
            <ThemedText variant="caption" style={styles.notice}>
              {DPDP_NOTICE_TEXT.retentionPolicy}
            </ThemedText>

            <ThemedText variant="body" style={styles.sectionHeader}>
              4. Data Principal Rights & Fallback
            </ThemedText>
            <ThemedText variant="caption" style={styles.notice}>
              {DPDP_NOTICE_TEXT.rights}
            </ThemedText>

            <ThemedText variant="caption" style={styles.officer}>
              Grievance Officer: {DPDP_NOTICE_TEXT.grievanceOfficer}
            </ThemedText>

            <View style={styles.actions}>
              <Button
                title={consentState.hasConsented ? 'Consent Granted ✓' : t('auth.consentAccept')}
                variant="primary"
                onPress={handleAccept}
                style={styles.button}
              />
              {consentState.hasConsented ? (
                <Button
                  title="Withdraw Biometric Consent"
                  variant="danger"
                  onPress={handleRevoke}
                  style={styles.revokeButton}
                />
              ) : null}
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    padding: 16,
  },
  card: {
    padding: 20,
    backgroundColor: '#0F172A',
  },
  title: {
    marginBottom: 16,
    color: '#F8FAFC',
  },
  sectionHeader: {
    fontWeight: '700',
    color: '#E2E8F0',
    marginTop: 12,
    marginBottom: 4,
  },
  notice: {
    lineHeight: 20,
    color: '#94A3B8',
    marginBottom: 8,
  },
  officer: {
    color: '#64748B',
    marginTop: 12,
    fontStyle: 'italic',
  },
  actions: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    width: '100%',
  },
  revokeButton: {
    width: '100%',
  },
});

