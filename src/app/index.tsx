import React from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/features/auth';

export default function RootIndex(): React.JSX.Element {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return <Redirect href={isAuthenticated ? '/(app)' : '/(auth)/login'} />;
}
