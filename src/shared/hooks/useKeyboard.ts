import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardEvent,
  Platform,
} from 'react-native';

export interface KeyboardState {
  /** Whether the on-screen keyboard is currently visible. */
  isKeyboardVisible: boolean;
  /** Current height of the on-screen keyboard in density-independent pixels. */
  keyboardHeight: number;
  /** Programmatic utility to dismiss the keyboard. */
  dismissKeyboard: () => void;
}

/**
 * Reactive hook to observe keyboard visibility and height dynamics across iOS and Android.
 */
export function useKeyboard(): KeyboardState {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const handleKeyboardShow = (e: KeyboardEvent): void => {
      setKeyboardVisible(true);
      setKeyboardHeight(e.endCoordinates.height);
    };

    const handleKeyboardHide = (): void => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener(showEvent, handleKeyboardShow);
    const hideSub = Keyboard.addListener(hideEvent, handleKeyboardHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return {
    isKeyboardVisible,
    keyboardHeight,
    dismissKeyboard: Keyboard.dismiss,
  };
}
