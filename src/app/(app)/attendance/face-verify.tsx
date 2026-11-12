import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ThemedText, ThemedView } from '@/shared/components';

export default function FaceVerifyRoute(): React.JSX.Element {
  const { t } = useTranslation();

  const handleCancel = (): void => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText variant="title">{t('face.title')}</ThemedText>
          <ThemedText variant="subheading">{t('face.alignFace')}</ThemedText>
        </View>

        <View style={styles.previewPlaceholder}>
          <View style={styles.faceGuideRing} />
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
    alignItems: 'center',
    marginTop: 20,
  },
  previewPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  faceGuideRing: {
    width: 260,
    height: 320,
    borderRadius: 130,
    borderWidth: 3,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
  },
  footer: {
    marginBottom: 20,
  },
});
