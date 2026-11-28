import React from 'react';
import { Keyboard, Text } from 'react-native';
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

  it('defaults behavior to padding and allows overrides', async () => {
    const { getByTestId, rerender } = await render(
      <AppKeyboardAvoidingView testID="avoiding-view">
        <Text>Content</Text>
      </AppKeyboardAvoidingView>,
    );
    expect(getByTestId('avoiding-view').props.behavior).toBe('padding');

    await rerender(
      <AppKeyboardAvoidingView testID="avoiding-view" behavior="height">
        <Text>Content</Text>
      </AppKeyboardAvoidingView>,
    );
    expect(getByTestId('avoiding-view').props.behavior).toBe('height');
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
