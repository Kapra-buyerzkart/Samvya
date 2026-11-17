import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  type KeyboardAvoidingViewProps,
  Platform,
  Text,
} from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { AppKeyboardAvoidingView } from '../AppKeyboardAvoidingView';

describe('AppKeyboardAvoidingView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children correctly', async () => {
    const { getByText } = await render(
      <AppKeyboardAvoidingView testID="test-avoiding-view">
        <Text>Avoid Keyboard Content</Text>
      </AppKeyboardAvoidingView>,
    );
    expect(getByText('Avoid Keyboard Content')).toBeTruthy();
  });

  it('adapts platform-default behavior', async () => {
    const originalOS = Platform.OS;

    // Test iOS
    Platform.OS = 'ios';
    let iosProps: KeyboardAvoidingViewProps | null = null;
    const iosSpy = jest
      .spyOn(KeyboardAvoidingView.prototype, 'render')
      .mockImplementation(function (this: KeyboardAvoidingView) {
        iosProps = this.props;
        return null;
      });
    await render(
      <AppKeyboardAvoidingView testID="ios-avoiding-view">
        <Text>iOS</Text>
      </AppKeyboardAvoidingView>,
    );
    const capturedIos = iosProps as KeyboardAvoidingViewProps | null;
    expect(capturedIos?.behavior).toBe('padding');
    iosSpy.mockRestore();

    // Test Android
    Platform.OS = 'android';
    let androidProps: KeyboardAvoidingViewProps | null = null;
    const androidSpy = jest
      .spyOn(KeyboardAvoidingView.prototype, 'render')
      .mockImplementation(function (this: KeyboardAvoidingView) {
        androidProps = this.props;
        return null;
      });
    await render(
      <AppKeyboardAvoidingView testID="android-avoiding-view">
        <Text>Android</Text>
      </AppKeyboardAvoidingView>,
    );
    const capturedAndroid = androidProps as KeyboardAvoidingViewProps | null;
    expect(capturedAndroid?.behavior).toBeUndefined();
    androidSpy.mockRestore();

    Platform.OS = originalOS;
  });

  it('triggers Keyboard.dismiss on press when dismissKeyboardOnTap is true', async () => {
    const dismissSpy = jest.spyOn(Keyboard, 'dismiss');
    const { getByTestId } = await render(
      <AppKeyboardAvoidingView testID="my-view" dismissKeyboardOnTap={true}>
        <Text>Tap me</Text>
      </AppKeyboardAvoidingView>,
    );

    const touchable = getByTestId('my-view-dismiss-touchable');
    fireEvent.press(touchable);
    expect(dismissSpy).toHaveBeenCalled();
  });
});
