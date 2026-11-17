import { renderHook, act } from '@testing-library/react-native';
import { Keyboard, Platform } from 'react-native';
import { useKeyboard } from '../useKeyboard';

describe('useKeyboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('tracks keyboard visibility and height on iOS', async () => {
    const originalOS = Platform.OS;
    Platform.OS = 'ios';

    const listeners: Record<string, (e: unknown) => void> = {};
    jest.spyOn(Keyboard, 'addListener').mockImplementation((event, callback) => {
      listeners[event] = callback as (e: unknown) => void;
      return {
        remove: jest.fn(),
      } as unknown as ReturnType<typeof Keyboard.addListener>;
    });

    const { result } = await renderHook(() => useKeyboard());

    expect(result.current.isKeyboardVisible).toBe(false);
    expect(result.current.keyboardHeight).toBe(0);

    // Simulate keyboard show
    await act(async () => {
      listeners['keyboardWillShow']?.({
        endCoordinates: { height: 320, width: 375, screenX: 0, screenY: 500 },
      });
    });

    expect(result.current.isKeyboardVisible).toBe(true);
    expect(result.current.keyboardHeight).toBe(320);

    // Simulate keyboard hide
    await act(async () => {
      listeners['keyboardWillHide']?.({});
    });

    expect(result.current.isKeyboardVisible).toBe(false);
    expect(result.current.keyboardHeight).toBe(0);

    Platform.OS = originalOS;
  });

  it('tracks keyboard visibility and height on Android', async () => {
    const originalOS = Platform.OS;
    Platform.OS = 'android';

    const listeners: Record<string, (e: unknown) => void> = {};
    jest.spyOn(Keyboard, 'addListener').mockImplementation((event, callback) => {
      listeners[event] = callback as (e: unknown) => void;
      return {
        remove: jest.fn(),
      } as unknown as ReturnType<typeof Keyboard.addListener>;
    });

    const { result } = await renderHook(() => useKeyboard());

    expect(result.current.isKeyboardVisible).toBe(false);
    expect(result.current.keyboardHeight).toBe(0);

    // Simulate keyboard show
    await act(async () => {
      listeners['keyboardDidShow']?.({
        endCoordinates: { height: 280, width: 400, screenX: 0, screenY: 600 },
      });
    });

    expect(result.current.isKeyboardVisible).toBe(true);
    expect(result.current.keyboardHeight).toBe(280);

    // Simulate keyboard hide
    await act(async () => {
      listeners['keyboardDidHide']?.({});
    });

    expect(result.current.isKeyboardVisible).toBe(false);
    expect(result.current.keyboardHeight).toBe(0);

    Platform.OS = originalOS;
  });

  it('provides a working dismissKeyboard method', async () => {
    const dismissSpy = jest.spyOn(Keyboard, 'dismiss');
    const { result } = await renderHook(() => useKeyboard());

    await act(async () => {
      result.current.dismissKeyboard();
    });

    expect(dismissSpy).toHaveBeenCalled();
  });
});
