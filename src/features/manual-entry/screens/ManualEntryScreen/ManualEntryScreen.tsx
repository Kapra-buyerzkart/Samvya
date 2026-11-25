import { ManualGpsForm } from '../../components/ManualGpsForm';
import { Button, Card, ThemedText, ThemedView } from '@/shared/components';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './ManualEntryScreen.styles';
import { useManualEntryScreen } from './useManualEntryScreen';

export function ManualEntryScreen(): React.JSX.Element {
  const { t, isManualGpsEnabled, handleCancel, handleSuccess } = useManualEntryScreen();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText variant="title">{t('manual.title')}</ThemedText>
          <ThemedText variant="subheading">{t('manual.subtitle')}</ThemedText>
        </View>

        {isManualGpsEnabled ? (
          <ManualGpsForm
            userId="usr_current_employee"
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : (
          <View style={styles.content}>
            <Card style={styles.disabledCard}>
              <ThemedText variant="heading" style={styles.disabledTitle}>
                Feature Disabled
              </ThemedText>
              <ThemedText variant="body" style={styles.disabledText}>
                Manual GPS coordinate entry is currently turned off by company policy. Please use hardware GPS for attendance check-in.
              </ThemedText>
              <Button
                title={t('common.cancel')}
                variant="secondary"
                onPress={handleCancel}
                style={styles.cancelBtn}
              />
            </Card>
          </View>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

export default ManualEntryScreen;
