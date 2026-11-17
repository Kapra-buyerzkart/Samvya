import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export interface AppKeyboardAvoidingViewProps extends KeyboardAvoidingViewProps {
  /**
   * Whether tapping outside inputs dismisses the keyboard.
   * Defaults to `false` so it does not intercept inner gestures unless requested.
   */
  dismissKeyboardOnTap?: boolean;
}

export function AppKeyboardAvoidingView({
  behavior,
  style,
  dismissKeyboardOnTap = false,
  children,
  testID,
  ...props
}: AppKeyboardAvoidingViewProps): React.JSX.Element {
  const defaultBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

  const content = (
    <KeyboardAvoidingView
      testID={testID}
      behavior={behavior !== undefined ? behavior : defaultBehavior}
      style={[styles.container, style]}
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  );

  if (dismissKeyboardOnTap) {
    return (
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        <View
          style={styles.container}
          testID={testID ? `${testID}-dismiss-touchable` : undefined}
        >
          {content}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
