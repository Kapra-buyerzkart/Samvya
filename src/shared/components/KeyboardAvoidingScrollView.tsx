import React, { forwardRef } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

export interface KeyboardAvoidingScrollViewProps extends ScrollViewProps {
  /**
   * Style applied to the outer KeyboardAvoidingView container.
   * Defaults to `{ flex: 1 }`.
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Keyboard avoiding behavior.
   * Defaults to `'padding'` on iOS and `undefined` on Android.
   */
  behavior?: KeyboardAvoidingViewProps['behavior'];

  /**
   * Distance between the top of the user screen and the React Native view.
   * Defaults to 0.
   */
  keyboardVerticalOffset?: number;

  /**
   * Whether tapping outside inputs dismisses the keyboard.
   * Defaults to `true`.
   */
  dismissKeyboardOnTap?: boolean;

  /**
   * Additional props to forward to the outer KeyboardAvoidingView.
   */
  keyboardAvoidingViewProps?: Omit<
    KeyboardAvoidingViewProps,
    'behavior' | 'keyboardVerticalOffset' | 'style' | 'children'
  >;

  /**
   * Optional pinned header rendered above the ScrollView inside the avoiding view.
   */
  headerComponent?: React.ReactNode;

  /**
   * Optional pinned footer rendered below the ScrollView inside the avoiding view.
   */
  footerComponent?: React.ReactNode;
}

export const KeyboardAvoidingScrollView = forwardRef<
  React.ElementRef<typeof ScrollView>,
  KeyboardAvoidingScrollViewProps
>(function KeyboardAvoidingScrollView(
  {
    children,
    containerStyle,
    behavior,
    keyboardVerticalOffset = 0,
    dismissKeyboardOnTap = true,
    keyboardAvoidingViewProps,
    headerComponent,
    footerComponent,
    keyboardShouldPersistTaps = 'handled',
    keyboardDismissMode = 'on-drag',
    nestedScrollEnabled = true,
    showsVerticalScrollIndicator = false,
    contentContainerStyle,
    style,
    testID,
    ...scrollViewProps
  },
  ref,
) {
  const defaultBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

  const innerContent = dismissKeyboardOnTap ? (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}
    >
      <View
        style={styles.innerContent}
        testID={testID ? `${testID}-dismiss-touchable` : undefined}
      >
        {children}
      </View>
    </TouchableWithoutFeedback>
  ) : (
    children
  );

  const scrollContent = (
    <ScrollView
      ref={ref}
      testID={testID}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      keyboardDismissMode={keyboardDismissMode}
      nestedScrollEnabled={nestedScrollEnabled}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={contentContainerStyle}
      style={[styles.scroll, style]}
      {...scrollViewProps}
    >
      {innerContent}
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView
      testID={testID ? `${testID}-avoiding-view` : undefined}
      behavior={behavior !== undefined ? behavior : defaultBehavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={[styles.container, containerStyle]}
      {...keyboardAvoidingViewProps}
    >
      {headerComponent}
      <View style={styles.scrollWrapper}>{scrollContent}</View>
      {footerComponent}
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollWrapper: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  innerContent: {
    flexGrow: 1,
  },
});
