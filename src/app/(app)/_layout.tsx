import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { DynamicIslandPill } from '@/features/attendance';

export default function AppLayout(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="attendance/face-verify" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="attendance/manual-entry" options={{ presentation: 'modal' }} />
        <Stack.Screen name="attendance/history" options={{ headerShown: false }} />
        <Stack.Screen name="leave/request" options={{ headerShown: false }} />
        <Stack.Screen name="profile/index" options={{ headerShown: false }} />
        <Stack.Screen name="profile/edit" options={{ headerShown: false }} />
        <Stack.Screen name="profile/reset-password" options={{ headerShown: false }} />
        <Stack.Screen name="employment/index" options={{ headerShown: false }} />
        <Stack.Screen name="settings/index" options={{ headerShown: false }} />
      </Stack>
      <DynamicIslandPill />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

