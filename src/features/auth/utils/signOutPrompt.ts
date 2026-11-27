import { Alert } from 'react-native';
import { router } from 'expo-router';

export interface ConfirmAndSignOutOptions {
  logout: () => Promise<void>;
  onStart?: () => void;
  onFinish?: () => void;
}

export function confirmAndSignOut({
  logout,
  onStart,
  onFinish,
}: ConfirmAndSignOutOptions): void {
  Alert.alert('Sign Out', 'Are you sure you want to sign out of Samavya HRMS?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Sign Out',
      style: 'destructive',
      onPress: async () => {
        onStart?.();
        try {
          await logout();
          router.replace('/(auth)/login');
        } finally {
          onFinish?.();
        }
      },
    },
  ]);
}
