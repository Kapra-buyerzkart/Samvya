import React from 'react';
import { Redirect } from 'expo-router';

export default function RootIndex(): React.JSX.Element {
  return <Redirect href="/(app)" />;
}
