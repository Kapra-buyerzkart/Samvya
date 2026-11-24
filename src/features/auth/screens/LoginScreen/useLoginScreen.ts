import { useAuthStore } from '@/features/auth/model/authStore';
import { useAppTheme } from '@/shared/theme';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Keyboard, type NativeSyntheticEvent, type TextInput } from 'react-native';

export type AuthMethod = 'phone' | 'email';

export function useLoginScreen() {
  const theme = useAppTheme();
  const isDark = theme.isDark;

  const [method, setMethod] = useState<AuthMethod>('phone');
  const [identifier, setIdentifier] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [focusedOtpIndex, setFocusedOtpIndex] = useState<number | null>(null);

  const otpInputsRef = useRef<(React.ElementRef<typeof TextInput> | null)[]>([]);
  const login = useAuthStore((s) => s.login);

  const handleSelectMethod = (selectedMethod: AuthMethod): void => {
    setMethod(selectedMethod);
    setIdentifier('');
    setOtpDigits(['', '', '', '', '']);
  };

  const handleSendOtp = async (): Promise<void> => {
    if (!identifier.trim()) {
      Alert.alert(
        'Required',
        method === 'phone'
          ? 'Please enter your mobile phone number.'
          : 'Please enter your work email or employee code.',
      );
      return;
    }

    setIsSendingOtp(true);
    Keyboard.dismiss();

    setTimeout(() => {
      setIsSendingOtp(false);
      setCountdown(30);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setOtpDigits(['1', '2', '3', '4', '5']);

      Alert.alert(
        'OTP Sent Successfully',
        method === 'phone'
          ? `A 5-digit verification code has been sent by SMS to ${identifier}.\n\n(Demo code: 12345)`
          : `A 5-digit verification code has been sent to your registered work email (${identifier}).\n\n(Demo code: 12345)`,
      );

      otpInputsRef.current[0]?.focus();
    }, 600);
  };

  const handleOtpChange = (value: string, index: number): void => {
    const cleaned = value.replace(/[^0-9]/g, '');

    if (cleaned.length >= 5) {
      const pasted = cleaned.slice(0, 5).split('');
      setOtpDigits(pasted);
      otpInputsRef.current[4]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleaned.slice(-1);
    setOtpDigits(newDigits);

    if (cleaned && index < 4) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: NativeSyntheticEvent<{ key: string }>, index: number): void => {
    if (e.nativeEvent.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (): Promise<void> => {
    const code = otpDigits.join('');

    if (!identifier.trim()) {
      Alert.alert(
        'Required',
        method === 'phone'
          ? 'Please enter your registered phone number first.'
          : 'Please enter your registered work email or employee code first.',
      );
      return;
    }

    if (code.length < 5) {
      Alert.alert('Incomplete Code', 'Please enter the complete 5-digit verification code.');
      return;
    }

    setIsVerifying(true);
    try {
      await login({
        identifier: identifier.trim(),
        method,
        otp: code,
      });

      router.replace('/(app)');
    } catch {
      Alert.alert('Verification Failed', 'Invalid code or authentication error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    method,
    identifier,
    otpDigits,
    countdown,
    isSendingOtp,
    isVerifying,
    focusedOtpIndex,
    otpInputsRef,
    isDark,
    setIdentifier,
    setFocusedOtpIndex,
    handleSendOtp,
    handleOtpChange,
    handleOtpKeyPress,
    handleVerify,
    handleSelectMethod,
  };
}
