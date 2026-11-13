import { GlassCard } from '@/shared/components';
import { FontFamily } from '@/shared/theme';
import { Feather } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  type NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../model/authStore';

type AuthMethod = 'phone' | 'email';

export function LoginScreen(): React.JSX.Element {
  const [method, setMethod] = useState<AuthMethod>('phone');
  const [identifier, setIdentifier] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [focusedOtpIndex, setFocusedOtpIndex] = useState<number | null>(null);

  const otpInputsRef = useRef<(React.ElementRef<typeof TextInput> | null)[]>([]);
  const login = useAuthStore((s) => s.login);

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

    // Simulate OTP dispatch
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

      Alert.alert(
        'OTP Sent Successfully',
        method === 'phone'
          ? `A 5-digit verification code has been sent by SMS to ${identifier}.\n\n(Demo code: 12345)`
          : `A 5-digit verification code has been sent to your registered work email (${identifier}).\n\n(Demo code: 12345)`,
      );

      // Focus first OTP input
      otpInputsRef.current[0]?.focus();
    }, 600);
  };

  const handleOtpChange = (value: string, index: number): void => {
    const cleaned = value.replace(/[^0-9]/g, '');

    // Handle full paste
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

      // Navigate to app main dashboard
      router.replace('/(app)');
    } catch {
      Alert.alert('Verification Failed', 'Invalid code or authentication error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../../../assets/images/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flexOne}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Header Title & Subtitle */}
              <View style={styles.header}>
                <Text style={styles.brandTitle}>Samavya</Text>
                <Text style={styles.brandSubtitle}>Human Resource Management System</Text>
              </View>

              {/* Method Switcher Pill */}
              <View style={styles.switcherWrapper}>
                <View style={styles.pillContainer}>
                  <Pressable
                    style={[
                      styles.pillTab,
                      method === 'phone' ? styles.pillTabActive : styles.pillTabInactive,
                    ]}
                    onPress={() => {
                      setMethod('phone');
                      setIdentifier('');
                      setOtpDigits(['', '', '', '', '']);
                    }}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        method === 'phone' ? styles.pillTextActive : styles.pillTextInactive,
                      ]}
                    >
                      Mobile number
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.pillTab,
                      method === 'email' ? styles.pillTabActive : styles.pillTabInactive,
                    ]}
                    onPress={() => {
                      setMethod('email');
                      setIdentifier('');
                      setOtpDigits(['', '', '', '', '']);
                    }}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        method === 'email' ? styles.pillTextActive : styles.pillTextInactive,
                      ]}
                    >
                      Email / employee code
                    </Text>
                  </Pressable>
                </View>
                <Text style={styles.switcherHint}>
                  Switch between mobile number and email / employee code
                </Text>
              </View>

              {/* Card Container */}
              <GlassCard intensity={80} tint="light" style={styles.card}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                  <Image
                    source={require('@/../assets/images/samavya-logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>

                {/* Card Title & Instructions */}
                <Text style={styles.cardTitle}>Log in to your account</Text>
                <Text style={styles.cardSubtitle}>
                  {method === 'phone'
                    ? "Use the phone number registered with HR.\nWe'll send your code by SMS."
                    : "Use your work email or employee code registered with HR.\nWe'll send your code to your registered work email."}
                </Text>

                {/* Input Container */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Feather
                      name={method === 'phone' ? 'phone' : 'mail'}
                      size={18}
                      color="#64748B"
                    />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder={
                      method === 'phone' ? 'Enter phone number' : 'Enter Email / employee code'
                    }
                    placeholderTextColor="#94A3B8"
                    value={identifier}
                    onChangeText={setIdentifier}
                    keyboardType={method === 'phone' ? 'phone-pad' : 'email-address'}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Send OTP button row (below input box, right-aligned) */}
                <View style={styles.sendOtpRow}>
                  <TouchableOpacity
                    onPress={handleSendOtp}
                    disabled={isSendingOtp || countdown > 0}
                    style={styles.sendOtpButton}
                    activeOpacity={0.7}
                  >
                    {isSendingOtp ? (
                      <ActivityIndicator size="small" color="#1D4ED8" />
                    ) : (
                      <Text style={styles.sendOtpText}>
                        {countdown > 0 ? `Resend in ${countdown}s` : 'Send OTP >'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                {/* 5-digit code Label */}
                <Text style={styles.otpLabel}>5-digit code</Text>

                {/* 5 OTP Boxes */}
                <View style={styles.otpRow}>
                  {otpDigits.map((digit, index) => {
                    const isFocused = focusedOtpIndex === index;
                    return (
                      <TextInput
                        key={index}
                        ref={(ref) => {
                          otpInputsRef.current[index] = ref;
                        }}
                        style={[
                          styles.otpBox,
                          isFocused && styles.otpBoxFocused,
                          digit ? styles.otpBoxFilled : null,
                        ]}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(val) => handleOtpChange(val, index)}
                        onKeyPress={(e) => handleOtpKeyPress(e, index)}
                        onFocus={() => setFocusedOtpIndex(index)}
                        onBlur={() => setFocusedOtpIndex(null)}
                        selectTextOnFocus
                      />
                    );
                  })}
                </View>

                {/* Verify & sign in Button */}
                <TouchableOpacity
                  style={[styles.verifyButton, isVerifying && styles.buttonDisabled]}
                  onPress={handleVerify}
                  disabled={isVerifying}
                  activeOpacity={0.85}
                >
                  {isVerifying ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.verifyButtonText}>Verify & sign in →</Text>
                  )}
                </TouchableOpacity>
              </GlassCard>

              {/* Bottom HR Note */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Your account is created by HR.</Text>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 8,
    marginBottom: 20,
  },
  brandTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 36,
    color: '#0F1E36',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  brandSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: '#475569',
  },
  switcherWrapper: {
    marginBottom: 20,
  },
  pillContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  pillTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillTabActive: {
    backgroundColor: '#1D4ED8',
  },
  pillTabInactive: {
    backgroundColor: 'transparent',
  },
  pillText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontFamily: FontFamily.semiBold,
  },
  pillTextInactive: {
    color: '#475569',
    fontFamily: FontFamily.medium,
  },
  switcherHint: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'left',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 24,
    overflow: 'hidden',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 86,
    height: 82,
  },
  cardTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    color: '#0F172A',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    color: '#64748B',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: '#0F172A',
    paddingVertical: 8,
  },
  sendOtpRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginBottom: 8,
  },
  sendOtpButton: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  sendOtpText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#1D4ED8',
  },
  otpLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: '#0F172A',
    marginTop: 12,
    marginBottom: 10,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  otpBox: {
    width: 52,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    textAlign: 'center',
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    color: '#0F172A',
    fontVariant: ['tabular-nums'],
  },
  otpBoxFocused: {
    borderColor: '#1D4ED8',
    backgroundColor: '#EFF6FF',
  },
  otpBoxFilled: {
    borderColor: '#93C5FD',
    backgroundColor: '#FFFFFF',
  },
  verifyButton: {
    backgroundColor: '#1D4ED8',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#64748B',
  },
});
