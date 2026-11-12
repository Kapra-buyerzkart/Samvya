import React from 'react';
import { View, type ViewProps } from 'react-native';
import { useAppTheme } from '@/shared/theme';

export interface ThemedViewProps extends ViewProps {
  surface?: boolean;
}

export function ThemedView({
  surface = false,
  style,
  ...rest
}: ThemedViewProps): React.JSX.Element {
  const theme = useAppTheme();

  return (
    <View
      style={[
        { backgroundColor: surface ? theme.colors.surface : theme.colors.background },
        style,
      ]}
      {...rest}
    />
  );
}
