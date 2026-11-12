import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ThemedText, ThemedView } from '@/shared/components';

export default function ManualEntryRoute(): React.JSX.Element {
  const { t } = useTranslation();

  const handleCancel = (): void => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText variant="title">{t('manual.title')}</ThemedText>
          <ThemedText variant="subheading">{t('manual.subtitle')}</ThemedText>
        </View>

        <View style={styles.content}>
          <ThemedText variant="body">
            Manual coordinate picker and audited justification form.
          </ThemedText>
        </View>

        <View style={styles.footer}>
          <Button
            title={t('common.cancel')}
            variant="secondary"
            onPress={handleCancel}
          />
        </View>
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
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginBottom: 20,
  },
});

