import React from 'react';
import { Text, type TextProps } from 'react-native';
import { useAppTheme } from '@/shared/theme';

export type TextVariant = 'title' | 'heading' | 'subheading' | 'body' | 'caption' | 'code';

export interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  weight?: 'normal' | '500' | '600' | '700';
}

export function ThemedText({
  variant = 'body',
  color,
  weight,
  style,
  ...rest
}: ThemedTextProps): React.JSX.Element {
  const theme = useAppTheme();

  const variantStyles = {
    title: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const, color: theme.colors.text },
    heading: { fontSize: 18, lineHeight: 26, fontWeight: '600' as const, color: theme.colors.text },
    subheading: { fontSize: 16, lineHeight: 22, fontWeight: '500' as const, color: theme.colors.textSecondary },
    body: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const, color: theme.colors.text },
    caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const, color: theme.colors.textMuted },
    code: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const, color: theme.colors.textSecondary, fontFamily: 'monospace' },
  }[variant];

  return (
    <Text
      style={[
        variantStyles,
        color ? { color } : null,
        weight ? { fontWeight: weight } : null,
        style,
      ]}
      {...rest}
    />
  );
}
