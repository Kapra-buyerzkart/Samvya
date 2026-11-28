import React, { forwardRef } from 'react';
import {
  Keyboard,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewProps,
  type KeyboardAwareScrollViewRef,
  type KeyboardAvoidingViewProps,
} from 'react-native-keyboard-controller';

export interface KeyboardAvoidingScrollViewProps extends KeyboardAwareScrollViewProps {
  /**
   * Style applied to the outer container.
   * Defaults to `{ flex: 1 }`.
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Kept for backwards compatibility with callers; `KeyboardAwareScrollView`
   * handles keyboard avoidance automatically on both iOS and Android.
   */
  behavior?: KeyboardAvoidingViewProps['behavior'];

  /**
   * Kept for backwards compatibility; maps to `bottomOffset` if `bottomOffset` is not provided.
   */
  keyboardVerticalOffset?: number;

  /**
   * Whether tapping outside inputs dismisses the keyboard.
   * Defaults to `true`.
   */
  dismissKeyboardOnTap?: boolean;

  /**
   * Optional pinned header rendered above the ScrollView.
   */
  headerComponent?: React.ReactNode;

  /**
   * Optional pinned footer rendered below the ScrollView.
   */
  footerComponent?: React.ReactNode;
}

export const KeyboardAvoidingScrollView = forwardRef<
  KeyboardAwareScrollViewRef,
  KeyboardAvoidingScrollViewProps
>(function KeyboardAvoidingScrollView(
  {
    children,
    containerStyle,
    behavior: _behavior,
    keyboardVerticalOffset,
    bottomOffset,
    extraKeyboardSpace = 0,
    dismissKeyboardOnTap = true,
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
  const resolvedBottomOffset = bottomOffset ?? keyboardVerticalOffset ?? 24;

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
    <KeyboardAwareScrollView
      ref={ref}
      testID={testID}
      bottomOffset={resolvedBottomOffset}
      extraKeyboardSpace={extraKeyboardSpace}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      keyboardDismissMode={keyboardDismissMode}
      nestedScrollEnabled={nestedScrollEnabled}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={contentContainerStyle}
      style={[styles.scroll, style]}
      {...scrollViewProps}
    >
      {innerContent}
    </KeyboardAwareScrollView>
  );

  return (
    <View
      testID={testID ? `${testID}-avoiding-view` : undefined}
      style={[styles.container, containerStyle]}
    >
      {headerComponent}
      <View style={styles.scrollWrapper}>{scrollContent}</View>
      {footerComponent}
    </View>
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
