import React, { createRef } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  type KeyboardAvoidingViewProps,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
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
  });

  it('forwards ref to the underlying ScrollView', async () => {
    const ref = createRef<React.ElementRef<typeof ScrollView>>();
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

  it('adapts behavior based on platform', async () => {
    const originalOS = Platform.OS;

    // Test iOS behavior
    Platform.OS = 'ios';
    let iosProps: KeyboardAvoidingViewProps | null = null;
    const iosSpy = jest
      .spyOn(KeyboardAvoidingView.prototype, 'render')
      .mockImplementation(function (this: KeyboardAvoidingView) {
        iosProps = this.props;
        return null;
      });
    await render(
      <KeyboardAvoidingScrollView testID="ios-scroll">
        <Text>iOS</Text>
      </KeyboardAvoidingScrollView>,
    );
    const capturedIos = iosProps as KeyboardAvoidingViewProps | null;
    expect(capturedIos?.behavior).toBe('padding');
    iosSpy.mockRestore();

    // Test Android behavior
    Platform.OS = 'android';
    let androidProps: KeyboardAvoidingViewProps | null = null;
    const androidSpy = jest
      .spyOn(KeyboardAvoidingView.prototype, 'render')
      .mockImplementation(function (this: KeyboardAvoidingView) {
        androidProps = this.props;
        return null;
      });
    await render(
      <KeyboardAvoidingScrollView testID="android-scroll">
        <Text>Android</Text>
      </KeyboardAvoidingScrollView>,
    );
    const capturedAndroid = androidProps as KeyboardAvoidingViewProps | null;
    expect(capturedAndroid?.behavior).toBeUndefined();
    androidSpy.mockRestore();

    Platform.OS = originalOS;
  });

  it('honors custom behavior override and keyboardVerticalOffset', async () => {
    let capturedProps: KeyboardAvoidingViewProps | null = null;
    const renderSpy = jest
      .spyOn(KeyboardAvoidingView.prototype, 'render')
      .mockImplementation(function (this: KeyboardAvoidingView) {
        capturedProps = this.props;
        return null;
      });

    await render(
      <KeyboardAvoidingScrollView
        testID="custom-scroll"
        behavior="height"
        keyboardVerticalOffset={64}
      >
        <Text>Custom</Text>
      </KeyboardAvoidingScrollView>,
    );

    const captured = capturedProps as KeyboardAvoidingViewProps | null;
    expect(captured?.behavior).toBe('height');
    expect(captured?.keyboardVerticalOffset).toBe(64);
    renderSpy.mockRestore();
  });
});
