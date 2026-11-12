import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ThemedText, ThemedView } from '@/shared/components';

export default function SettingsRoute(): React.JSX.Element {
  const { t } = useTranslation();

  const handleBack = (): void => {
    router.back();
  };

  const handleSignOut = (): void => {
    router.replace('/(auth)/login');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText variant="title">Settings & Diagnostics</ThemedText>
        </View>

        <View style={styles.content}>
          <ThemedText variant="body">
            DPDP Privacy Controls, Permission Diagnostics, and Device Status.
          </ThemedText>
        </View>

        <View style={styles.footer}>
          <Button
            title={t('auth.signOut')}
            variant="danger"
            onPress={handleSignOut}
            style={styles.signOutButton}
          />
          <Button
            title={t('common.cancel')}
            variant="secondary"
            onPress={handleBack}
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
    gap: 12,
    marginBottom: 20,
  },
  signOutButton: {
    width: '100%',
  },
});

