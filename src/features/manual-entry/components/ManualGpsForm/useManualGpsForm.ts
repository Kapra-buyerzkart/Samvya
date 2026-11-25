import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppTheme } from '@/shared/theme';
import {
  ManualGpsPolicyConfig,
  OriginalDeviceFix,
} from '../../domain/types';
import {
  createManualGpsSchema,
  ManualGpsFormValues,
  parseManualCoordinates,
} from '../../domain/validation';
import { verifyCoordinatesInMaps } from '../../domain/mapsDeepLink';
import { evaluateRateLimit, getManualGpsPolicy } from '../../domain/policy';
import { submitManualAttendanceWithQueue } from '../../db/manualEntryDatabase';
import { preparePhotoForUpload } from '../../domain/photoCompressor';

export interface ManualGpsFormProps {
  userId: string;
  originalDeviceFix?: OriginalDeviceFix | null;
  policy?: ManualGpsPolicyConfig;
  onSuccess: (recordId: number) => void;
  onCancel: () => void;
}

function createManualClientId(): string {
  return `man_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function useManualGpsForm({
  userId,
  originalDeviceFix = null,
  policy = getManualGpsPolicy(),
  onSuccess,
}: Omit<ManualGpsFormProps, 'onCancel'>) {
  const theme = useAppTheme();
  const isDark = theme.isDark;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoAttachment, setPhotoAttachment] = useState<string | null>(null);

  const schema = createManualGpsSchema(policy);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ManualGpsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      latitude: originalDeviceFix ? originalDeviceFix.latitude.toFixed(6) : '',
      longitude: originalDeviceFix ? originalDeviceFix.longitude.toFixed(6) : '',
      reason: '',
      photoUri: '',
    },
  });

  const handleVerifyInMaps = async (): Promise<void> => {
    const lat = Number(getValues('latitude'));
    const lon = Number(getValues('longitude'));

    if (Number.isNaN(lat) || Number.isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      Alert.alert(
        'Invalid Coordinates',
        'Please enter valid latitude (-90 to +90) and longitude (-180 to +180) before verifying in maps.',
      );
      return;
    }

    const opened = await verifyCoordinatesInMaps(lat, lon, 'Reported Worksite');
    if (!opened) {
      Alert.alert('Unable to Open Maps', 'Could not open native maps application.');
    }
  };

  const handleAttachSimulatedPhoto = async (): Promise<void> => {
    const mockPhotoUri = `file:///data/user/0/com.hrms.attendance/cache/worksite_proof_${Date.now()}.jpg`;
    const compressed = await preparePhotoForUpload(mockPhotoUri, 0.6);
    setPhotoAttachment(compressed.uri);
    Alert.alert('Photo Attached', 'Worksite photo attached and compressed at 60% quality.');
  };

  const onSubmit = async (values: ManualGpsFormValues): Promise<void> => {
    const rateCheck = evaluateRateLimit(0, policy);
    if (!rateCheck.allowed) {
      Alert.alert('Rate Limit Exceeded', rateCheck.reason ?? 'Daily limit reached.');
      return;
    }

    setIsSubmitting(true);
    try {
      const validated = schema.parse(values);
      const coords = parseManualCoordinates(validated);
      const clientId = createManualClientId();

      const { manualRecord } = await submitManualAttendanceWithQueue({
        clientId,
        userId,
        latitude: coords.latitude,
        longitude: coords.longitude,
        reason: validated.reason,
        photoUri: photoAttachment ?? undefined,
        photoQuality: 0.6,
        audit: {
          who: userId,
          when: Date.now(),
          device: {
            os: Platform.OS,
            osVersion: String(Platform.Version),
            appVersion: '1.0.0',
          },
          reason: validated.reason,
          originalDeviceFix,
          reviewedBy: null,
          reviewedAt: null,
          reviewNote: null,
        },
      });

      Alert.alert(
        'Manual Entry Submitted',
        'Your manual GPS attendance request has been queued with status [PENDING SUPERVISOR APPROVAL].',
        [{ text: 'OK', onPress: () => onSuccess(manualRecord.id) }],
      );
    } catch (err) {
      Alert.alert(
        'Submission Error',
        err instanceof Error ? err.message : 'Failed to submit manual coordinate entry.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitForm = (): Promise<void> => handleSubmit(onSubmit)();

  return {
    isDark,
    control,
    errors,
    isSubmitting,
    photoAttachment,
    setPhotoAttachment,
    handleVerifyInMaps,
    handleAttachSimulatedPhoto,
    submitForm,
  };
}
