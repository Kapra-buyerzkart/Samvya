import { GlassCard, KeyboardAvoidingScrollView } from '@/shared/components';
import { Feather } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getBackgroundImageStyle,
  getBrandSubtitleStyle,
  getBrandTitleStyle,
  getCardStyle,
  getCardSubtitleStyle,
  getCardTitleStyle,
  getImageProps,
  getInputContainerStyle,
  getOtpBoxStyle,
  getOtpLabelStyle,
  getPillContainerStyle,
  getPillTabStyle,
  getPillTextStyle,
  getSendOtpTextStyle,
  getTextInputStyle,
  getVerifyButtonStyle,
  styles,
} from './LoginScreen.styles';
import { useLoginScreen } from './useLoginScreen';

export function LoginScreen(): React.JSX.Element {
  const {
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
  } = useLoginScreen();

  return (
    <ImageBackground
      source={require('../../../../../assets/images/background.png')}
      style={[styles.backgroundImage, getBackgroundImageStyle(isDark)]}
      imageStyle={getImageProps(isDark)}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.brandTitle, getBrandTitleStyle(isDark)]}>
              Samavya
            </Text>
            <Text style={[styles.brandSubtitle, getBrandSubtitleStyle(isDark)]}>
              Human Resource Management System
            </Text>
          </View>

          <View style={styles.switcherWrapper}>
            <View
              style={[
                styles.pillContainer,
                getPillContainerStyle(isDark),
              ]}
            >
              <Pressable
                style={[
                  styles.pillTab,
                  getPillTabStyle(method === 'phone'),
                ]}
                onPress={() => handleSelectMethod('phone')}
              >
                <Text style={getPillTextStyle(method === 'phone', isDark)}>
                  Mobile number
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.pillTab,
                  getPillTabStyle(method === 'email'),
                ]}
                onPress={() => handleSelectMethod('email')}
              >
                <Text style={getPillTextStyle(method === 'email', isDark)}>
                  Email / EMP code
                </Text>
              </Pressable>
            </View>
            <Text style={styles.switcherHint}>
              Switch between mobile number and email / employee code
            </Text>
          </View>

          <GlassCard
            intensity={20}
            tint={isDark ? 'dark' : 'light'}
            style={[
              styles.card,
              getCardStyle(isDark),
            ]}
          >
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../../../assets/images/samavya-logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={[styles.cardTitle, getCardTitleStyle(isDark)]}>
              Log in to your account
            </Text>
            <Text style={[styles.cardSubtitle, getCardSubtitleStyle(isDark)]}>
              {method === 'phone'
                ? "Use the phone number registered with HR. We'll send your code by SMS."
                : "Use your work email or employee code registered with HR. We'll send your code to your registered work email."}
            </Text>

            <View
              style={[
                styles.inputContainer,
                getInputContainerStyle(isDark),
              ]}
            >
              <View style={styles.inputIcon}>
                <Feather
                  name={method === 'phone' ? 'phone' : 'mail'}
                  size={18}
                  color={isDark ? '#94A3B8' : '#64748B'}
                />
              </View>
              <TextInput
                style={[styles.textInput, getTextInputStyle(isDark)]}
                placeholder={
                  method === 'phone' ? 'Enter phone number' : 'Enter Email / employee code'
                }
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                value={identifier}
                onChangeText={setIdentifier}
                keyboardType={method === 'phone' ? 'phone-pad' : 'email-address'}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.sendOtpRow}>
              <TouchableOpacity
                onPress={handleSendOtp}
                disabled={isSendingOtp || countdown > 0}
                style={styles.sendOtpButton}
                activeOpacity={0.7}
              >
                {isSendingOtp ? (
                  <ActivityIndicator size="small" color={isDark ? '#60A5FA' : '#1D4ED8'} />
                ) : (
                  <Text style={[styles.sendOtpText, getSendOtpTextStyle(isDark)]}>
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Send OTP >'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <Text style={[styles.otpLabel, getOtpLabelStyle(isDark)]}>
              5-digit code
            </Text>

            <View style={styles.otpRow}>
              {otpDigits.map((digit, index) => {
                const isFocused = focusedOtpIndex === index;
                return (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      otpInputsRef.current[index] = ref;
                    }}
                    style={getOtpBoxStyle(isDark, isFocused, Boolean(digit))}
                    keyboardType="number-pad"
                    maxLength={index === 0 ? 5 : 1}
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

            <TouchableOpacity
              style={getVerifyButtonStyle(isVerifying)}
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

          <View style={styles.footer}>
            <Text style={styles.footerText}>Your account is created by HR.</Text>
          </View>
        </KeyboardAvoidingScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

export default LoginScreen;
