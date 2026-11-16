import React from 'react';
import { Stack } from 'expo-router';

export default function AppLayout(): React.JSX.Element {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="attendance/face-verify" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="attendance/manual-entry" options={{ presentation: 'modal' }} />
      <Stack.Screen name="attendance/history" options={{ headerShown: false }} />
      <Stack.Screen name="leave/request" options={{ headerShown: false }} />
      <Stack.Screen name="profile/index" options={{ headerShown: false }} />
      <Stack.Screen name="profile/edit" options={{ headerShown: false }} />
      <Stack.Screen name="profile/reset-password" options={{ headerShown: false }} />
      <Stack.Screen name="settings/index" options={{ headerShown: false }} />
    </Stack>
  );
}

