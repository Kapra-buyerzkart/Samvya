import { Button, Card, KeyboardAvoidingScrollView, ThemedText, ThemedView } from '@/shared/components';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './ConsentScreen.styles';
import { useConsentScreen } from './useConsentScreen';

export function ConsentScreen(): React.JSX.Element {
  const { consentState, handleAccept, handleRevoke, t, dpdpNoticeText } = useConsentScreen();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingScrollView contentContainerStyle={styles.scroll}>
          <Card style={styles.card}>
            <ThemedText variant="heading" style={styles.title}>
              {dpdpNoticeText.title}
            </ThemedText>

            <ThemedText variant="body" style={styles.sectionHeader}>
              1. Purpose of Processing
            </ThemedText>
            <ThemedText variant="caption" style={styles.notice}>
              {dpdpNoticeText.purpose}
            </ThemedText>

            <ThemedText variant="body" style={styles.sectionHeader}>
              2. On-Device Scope & Zero Local Retention
            </ThemedText>
            <ThemedText variant="caption" style={styles.notice}>
              {dpdpNoticeText.processingScope}
            </ThemedText>

            <ThemedText variant="body" style={styles.sectionHeader}>
              3. Data Retention & Deletion
            </ThemedText>
            <ThemedText variant="caption" style={styles.notice}>
              {dpdpNoticeText.retentionPolicy}
            </ThemedText>

            <ThemedText variant="body" style={styles.sectionHeader}>
              4. Data Principal Rights & Fallback
            </ThemedText>
            <ThemedText variant="caption" style={styles.notice}>
              {dpdpNoticeText.rights}
            </ThemedText>

            <ThemedText variant="caption" style={styles.officer}>
              Grievance Officer: {dpdpNoticeText.grievanceOfficer}
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
        </KeyboardAvoidingScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

export default ConsentScreen;
