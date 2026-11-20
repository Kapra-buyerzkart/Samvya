import React from 'react';
import { useGlobalSearchParams, router } from 'expo-router';
import { PunchSuccessScreen } from '@/features/attendance';

export default function PunchSuccessRoute(): React.JSX.Element {
  const params = useGlobalSearchParams<{ action?: string; type?: string; timestamp?: string }>();
  const isPunchIn = params.action === 'punch-in' || params.type === 'punch-in';

  return (
    <PunchSuccessScreen
      type={isPunchIn ? 'punch-in' : 'punch-out'}
      timestamp={params.timestamp ? parseInt(params.timestamp, 10) : undefined}
      onDismiss={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(app)');
        }
      }}
    />
  );
}
