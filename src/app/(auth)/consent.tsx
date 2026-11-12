import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Button, Card, ThemedText, ThemedView } from '@/shared/components';

export default function ConsentRoute(): React.JSX.Element {
  const { t } = useTranslation();

  const handleAccept = (): void => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <Card style={styles.card}>
        <ThemedText variant="heading" style={styles.title}>
          {t('auth.consentTitle')}
        </ThemedText>
        <ThemedText variant="body" style={styles.notice}>
          {t('auth.consentNotice')}
        </ThemedText>
        <View style={styles.actions}>
          <Button
            title={t('auth.consentAccept')}
            onPress={handleAccept}
            style={styles.button}
          />
        </View>
      </Card>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    padding: 24,
  },
  title: {
    marginBottom: 16,
  },
  notice: {
    lineHeight: 22,
    marginBottom: 24,
  },
  actions: {
    marginTop: 8,
  },
  button: {
    width: '100%',
  },
});
