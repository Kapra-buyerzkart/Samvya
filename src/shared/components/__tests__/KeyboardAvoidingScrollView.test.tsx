import React, { createRef } from 'react';
import { Keyboard, Text, View } from 'react-native';
import { type KeyboardAwareScrollViewRef } from 'react-native-keyboard-controller';
import { render, fireEvent } from '@testing-library/react-native';
import { KeyboardAvoidingScrollView } from '../KeyboardAvoidingScrollView';

describe('KeyboardAvoidingScrollView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children and default props correctly', async () => {
    const { getByText, getByTestId } = await render(
      <KeyboardAvoidingScrollView testID="test-scroll">
        <Text>Form Content</Text>
      </KeyboardAvoidingScrollView>,
    );

    expect(getByText('Form Content')).toBeTruthy();
    const scrollView = getByTestId('test-scroll');
    expect(scrollView.props.keyboardShouldPersistTaps).toBe('handled');
    expect(scrollView.props.showsVerticalScrollIndicator).toBe(false);
    expect(scrollView.props.bottomOffset).toBe(24);
  });

  it('forwards ref to the underlying KeyboardAwareScrollView', async () => {
    const ref = createRef<KeyboardAwareScrollViewRef>();
    await render(
      <KeyboardAvoidingScrollView ref={ref}>
        <Text>Scroll item</Text>
      </KeyboardAvoidingScrollView>,
    );

    expect(ref.current).not.toBeNull();
  });

  it('dismisses keyboard on tap when dismissKeyboardOnTap is true', async () => {
    const dismissSpy = jest.spyOn(Keyboard, 'dismiss');
    const { getByTestId } = await render(
      <KeyboardAvoidingScrollView testID="my-scroll" dismissKeyboardOnTap={true}>
        <Text>Content</Text>
      </KeyboardAvoidingScrollView>,
    );

    const touchable = getByTestId('my-scroll-dismiss-touchable');
    fireEvent.press(touchable);
    expect(dismissSpy).toHaveBeenCalled();
  });

  it('renders header and footer components outside the scroll area', async () => {
    const { getByText } = await render(
      <KeyboardAvoidingScrollView
        headerComponent={
          <View>
            <Text>Sticky Header</Text>
          </View>
        }
        footerComponent={
          <View>
            <Text>Sticky Footer</Text>
          </View>
        }
      >
        <Text>Inner Content</Text>
      </KeyboardAvoidingScrollView>,
    );

    expect(getByText('Sticky Header')).toBeTruthy();
    expect(getByText('Inner Content')).toBeTruthy();
    expect(getByText('Sticky Footer')).toBeTruthy();
  });

  it('honors custom bottomOffset and keyboardVerticalOffset fallback', async () => {
    const { getByTestId, rerender } = await render(
      <KeyboardAvoidingScrollView testID="custom-scroll" bottomOffset={40}>
        <Text>Custom</Text>
      </KeyboardAvoidingScrollView>,
    );
    expect(getByTestId('custom-scroll').props.bottomOffset).toBe(40);

    await rerender(
      <KeyboardAvoidingScrollView testID="custom-scroll" keyboardVerticalOffset={64}>
        <Text>Custom</Text>
      </KeyboardAvoidingScrollView>,
    );
    expect(getByTestId('custom-scroll').props.bottomOffset).toBe(64);
  });
});
