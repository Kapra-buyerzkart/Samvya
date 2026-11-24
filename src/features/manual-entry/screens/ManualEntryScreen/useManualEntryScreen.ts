import { useFeatureFlag } from '@/shared/flags';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export function useManualEntryScreen() {
  const { t } = useTranslation();
  const isManualGpsEnabled = useFeatureFlag('manualGps');

  const handleCancel = (): void => {
    router.back();
  };

  const handleSuccess = (): void => {
    router.replace('/(app)');
  };

  return {
    t,
    isManualGpsEnabled,
    handleCancel,
    handleSuccess,
  };
}
