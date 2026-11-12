import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Button, ThemedText, ThemedView } from '@/shared/components';

export default function LoginRoute(): React.JSX.Element {
  const { t } = useTranslation();

  const handleSignIn = (): void => {
    router.replace('/(app)');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText variant="title" style={styles.title}>
          {t('auth.loginTitle')}
        </ThemedText>
        <ThemedText variant="subheading" style={styles.subtitle}>
          HRMS Mobile Attendance Platform
        </ThemedText>
        <Button
          title={t('auth.signIn')}
          onPress={handleSignIn}
          style={styles.button}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    width: '100%',
  },
});

