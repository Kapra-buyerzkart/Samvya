import React from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageBackground } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { GlassCard, KeyboardAvoidingScrollView } from '@/shared/components';
import { OrganizationPickerSheet } from './components/OrganizationPickerSheet';
import {
  getBackgroundImageStyle,
  getBrandSubtitleStyle,
  getBrandTitleStyle,
  getCardStyle,
  getCardSubtitleStyle,
  getCardTitleStyle,
  getDevFillBtnStyle,
  getDevFillBtnTextStyle,
  getErrorBannerStyle,
  getErrorTextStyle,
  getFieldLabelStyle,
  getImageProps,
  getInputContainerStyle,
  getSignInButtonStyle,
  getTextInputStyle,
  styles,
} from './LoginScreen.styles';
import { useLoginScreen } from './useLoginScreen';

export function LoginScreen(): React.JSX.Element {
  const {
    isDark,
    username,
    password,
    showPassword,
    isSubmitting,
    switchingTenantId,
    errorMessage,
    requiresOrganizationSelection,
    organizations,
    canFillTestCredentials,
    handleUsernameChange,
    handlePasswordChange,
    handleTogglePasswordVisibility,
    handleFillTestCredentials,
    handleSignIn,
    handleSelectOrganization,
    handleCloseOrganizationPicker,
  } = useLoginScreen();

  return (
    <ImageBackground
      source={require('../../../../../assets/images/background.png')}
      style={[styles.backgroundImage, getBackgroundImageStyle(isDark)]}
      imageStyle={getImageProps(isDark)}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingScrollView
          contentContainerStyle={styles.scrollContent}
          mode="layout"
          bottomOffset={24}
        >
          <View style={styles.header}>
            <Text style={[styles.brandTitle, getBrandTitleStyle(isDark)]}>Samavya</Text>
            <Text style={[styles.brandSubtitle, getBrandSubtitleStyle(isDark)]}>
              Human Resource Management System
            </Text>
          </View>

          <GlassCard
            intensity={20}
            tint={isDark ? 'dark' : 'light'}
            style={[styles.card, getCardStyle(isDark)]}
          >
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../../../assets/images/samavya-logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={[styles.cardTitle, getCardTitleStyle(isDark)]}>
              Sign in to your account
            </Text>
            <Text style={[styles.cardSubtitle, getCardSubtitleStyle(isDark)]}>
              Enter your registered staff email and password to continue.
            </Text>

            {/* Staff Email */}
            <Text style={[styles.fieldLabel, getFieldLabelStyle(isDark)]}>Staff email</Text>
            <View style={[styles.inputContainer, getInputContainerStyle(isDark)]}>
              <View style={styles.inputIcon}>
                <Feather name="mail" size={18} color={isDark ? '#94A3B8' : '#64748B'} />
              </View>
              <TextInput
                style={[styles.textInput, getTextInputStyle(isDark)]}
                placeholder="name@company.com"
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                value={username}
                onChangeText={handleUsernameChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="username"
                returnKeyType="next"
                testID="login-email-input"
              />
            </View>

            {/* Password */}
            <Text style={[styles.fieldLabel, getFieldLabelStyle(isDark)]}>Password</Text>
            <View style={[styles.inputContainer, getInputContainerStyle(isDark)]}>
              <View style={styles.inputIcon}>
                <Feather name="lock" size={18} color={isDark ? '#94A3B8' : '#64748B'} />
              </View>
              <TextInput
                style={[styles.textInput, getTextInputStyle(isDark)]}
                placeholder="Enter your password"
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
                testID="login-password-input"
              />
              <TouchableOpacity
                onPress={handleTogglePasswordVisibility}
                style={styles.eyeButton}
                activeOpacity={0.7}
                testID="toggle-password-visibility-btn"
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={18}
                  color={isDark ? '#94A3B8' : '#64748B'}
                />
              </TouchableOpacity>
            </View>

            {errorMessage ? (
              <View
                style={[styles.errorBanner, getErrorBannerStyle(isDark)]}
                testID="login-error-banner"
              >
                <Feather
                  name="alert-circle"
                  size={16}
                  color={isDark ? '#FCA5A5' : '#DC2626'}
                />
                <Text style={[styles.errorText, getErrorTextStyle(isDark)]}>
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={getSignInButtonStyle(isSubmitting)}
              onPress={handleSignIn}
              disabled={isSubmitting}
              activeOpacity={0.85}
              testID="login-submit-btn"
              accessibilityRole="button"
              accessibilityLabel="Sign in"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.signInButtonText}>Sign in →</Text>
              )}
            </TouchableOpacity>

            {canFillTestCredentials ? (
              <TouchableOpacity
                style={[styles.devFillBtn, getDevFillBtnStyle(isDark)]}
                onPress={handleFillTestCredentials}
                activeOpacity={0.75}
                testID="fill-test-credentials-btn"
                accessibilityRole="button"
                accessibilityLabel="Fill test credentials"
              >
                <Feather
                  name="zap"
                  size={13}
                  color={isDark ? '#93C5FD' : '#1D4ED8'}
                />
                <Text style={[styles.devFillBtnText, getDevFillBtnTextStyle(isDark)]}>
                  Fill test credentials
                </Text>
              </TouchableOpacity>
            ) : null}
          </GlassCard>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Your account is created by HR.</Text>
          </View>
        </KeyboardAvoidingScrollView>
      </SafeAreaView>

      <OrganizationPickerSheet
        isOpen={requiresOrganizationSelection}
        organizations={organizations}
        switchingTenantId={switchingTenantId}
        isDark={isDark}
        onSelect={handleSelectOrganization}
        onClose={handleCloseOrganizationPicker}
      />
    </ImageBackground>
  );
}

export default LoginScreen;
