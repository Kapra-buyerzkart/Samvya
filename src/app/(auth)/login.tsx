import React from 'react';
import { Redirect } from 'expo-router';
import { LoginScreen, useAuthStore } from '@/features/auth';

export default function LoginRoute(): React.JSX.Element {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const requiresOrganizationSelection = useAuthStore(
    (s) => s.requiresOrganizationSelection,
  );

  if (isAuthenticated && !requiresOrganizationSelection) {
    return <Redirect href="/(app)" />;
  }

  return <LoginScreen />;
}
