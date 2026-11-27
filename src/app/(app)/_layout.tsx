import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/features/auth';
import { BottomTabBar } from '@/shared/components';

export default function AppLayout(): React.JSX.Element {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="attendance/face-verify" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="attendance/manual-entry" options={{ presentation: 'modal' }} />
        <Stack.Screen name="attendance/history" options={{ headerShown: false }} />
        <Stack.Screen name="attendance/punch-success" options={{ headerShown: false }} />
        <Stack.Screen name="leave/request" options={{ headerShown: false }} />
        <Stack.Screen name="leave/status" options={{ headerShown: false }} />
        <Stack.Screen name="leave/history" options={{ headerShown: false }} />
        <Stack.Screen name="profile/index" options={{ headerShown: false }} />
        <Stack.Screen name="profile/reset-password" options={{ headerShown: false }} />
        <Stack.Screen name="employment/index" options={{ headerShown: false }} />
        <Stack.Screen name="settings/index" options={{ headerShown: false }} />
      </Stack>
      {/* <DynamicIslandPill /> */}
      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
