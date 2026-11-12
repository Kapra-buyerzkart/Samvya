import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppErrorBoundary } from '@/shared/errors';
import { useAppTheme } from '@/shared/theme';
import '@/shared/i18n';
// Top-level task definition import required by expo-task-manager
import { initializeTrackingOnStartup } from '@/features/location/tasks/backgroundLocationTask';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export default function RootLayout(): React.JSX.Element {
  const theme = useAppTheme();

  useEffect(() => {
    // Restore tracking session or teardown unregistered background services
    initializeTrackingOnStartup().catch(() => {});
  }, []);

  return (
    <AppErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style={theme.isDark ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </AppErrorBoundary>
  );
}
