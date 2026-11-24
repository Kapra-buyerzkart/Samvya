import { TactilePressable } from '@/shared/animations';
import { KeyboardAvoidingScrollView } from '@/shared/components';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedCheckItem } from './components/AnimatedCheckItem';
import { AnimatedStrengthBar } from './components/AnimatedStrengthBar';
import {
  getBannerCardStyle,
  getBannerIconColor,
  getBannerIconContainerStyle,
  getBannerTextStyle,
  getBannerTitleStyle,
  getFieldLabelStyle,
  getFormCardStyle,
  getInputIconColor,
  getInputWrapperStyle,
  getNavTitleStyle,
  getPlaceholderTextColor,
  getSafeAreaStyle,
  getStrengthLabelStyle,
  getStrengthValueStyle,
  getSubmitButtonStyle,
  getTextColor,
  getTextInputStyle,
  styles,
} from './ResetPasswordScreen.styles';
import { useResetPasswordScreen } from './useResetPasswordScreen';

export function ResetPasswordScreen(): React.JSX.Element {
  const {
    isDark,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showCurrent,
    showNew,
    showConfirm,
    isUpdating,
    strength,
    hasMinLength,
    hasNumberOrSymbol,
    isMatching,
    handleUpdatePassword,
    handleBack,
    handleToggleShowCurrent,
    handleToggleShowNew,
    handleToggleShowConfirm,
  } = useResetPasswordScreen();

  return (
    <SafeAreaView style={[styles.safeArea, getSafeAreaStyle(isDark)]}>
      <KeyboardAvoidingScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Feather name="chevron-left" size={26} color={getTextColor(isDark)} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, getNavTitleStyle(isDark)]}>Reset Password</Text>
          <View style={styles.placeholderRight} />
        </View>

        <View style={[styles.bannerCard, getBannerCardStyle(isDark)]}>
          <View style={[styles.bannerIconContainer, getBannerIconContainerStyle(isDark)]}>
            <Feather name="lock" size={20} color={getBannerIconColor(isDark)} />
          </View>
          <View style={styles.bannerTextCol}>
            <Text style={[styles.bannerTitle, getBannerTitleStyle(isDark)]}>Security Requirement</Text>
            <Text style={[styles.bannerText, getBannerTextStyle(isDark)]}>
              Choose a strong password with at least 8 characters, combining uppercase, numbers,
              and symbols.
            </Text>
          </View>
        </View>

        <View style={[styles.formCard, getFormCardStyle(isDark)]}>
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, getFieldLabelStyle(isDark)]}>Current Password</Text>
            <View style={[styles.inputWrapper, getInputWrapperStyle(isDark)]}>
              <Feather name="key" size={18} color={getInputIconColor(isDark)} style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, getTextInputStyle(isDark)]}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor={getPlaceholderTextColor(isDark)}
                secureTextEntry={!showCurrent}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={handleToggleShowCurrent}
                style={styles.eyeBtn}
                activeOpacity={0.7}
              >
                <Feather name={showCurrent ? 'eye' : 'eye-off'} size={18} color={getInputIconColor(isDark)} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, getFieldLabelStyle(isDark)]}>New Password</Text>
            <View style={[styles.inputWrapper, getInputWrapperStyle(isDark)]}>
              <Feather name="lock" size={18} color={getInputIconColor(isDark)} style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, getTextInputStyle(isDark)]}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor={getPlaceholderTextColor(isDark)}
                secureTextEntry={!showNew}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={handleToggleShowNew}
                style={styles.eyeBtn}
                activeOpacity={0.7}
              >
                <Feather name={showNew ? 'eye' : 'eye-off'} size={18} color={getInputIconColor(isDark)} />
              </TouchableOpacity>
            </View>
          </View>

          {newPassword.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthHeader}>
                <Text style={[styles.strengthLabel, getStrengthLabelStyle(isDark)]}>Password Strength</Text>
                <Text style={[styles.strengthValue, getStrengthValueStyle(strength.color)]}>
                  {strength.label}
                </Text>
              </View>
              <View style={styles.strengthBarsRow}>
                {[1, 2, 3, 4].map((bar) => (
                  <AnimatedStrengthBar
                    key={bar}
                    filled={bar <= strength.score}
                    color={strength.color}
                  />
                ))}
              </View>
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, getFieldLabelStyle(isDark)]}>Confirm New Password</Text>
            <View style={[styles.inputWrapper, getInputWrapperStyle(isDark)]}>
              <Feather name="check-circle" size={18} color={getInputIconColor(isDark)} style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, getTextInputStyle(isDark)]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter new password"
                placeholderTextColor={getPlaceholderTextColor(isDark)}
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={handleToggleShowConfirm}
                style={styles.eyeBtn}
                activeOpacity={0.7}
              >
                <Feather name={showConfirm ? 'eye' : 'eye-off'} size={18} color={getInputIconColor(isDark)} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.checklist}>
            <AnimatedCheckItem checked={hasMinLength} label="At least 8 characters" isDark={isDark} />
            <AnimatedCheckItem checked={hasNumberOrSymbol} label="Contains number or symbol" isDark={isDark} />
            <AnimatedCheckItem checked={isMatching} label="Passwords match" isDark={isDark} />
          </View>
        </View>

        <TactilePressable
          style={getSubmitButtonStyle(!hasMinLength || !isMatching || isUpdating)}
          onPress={handleUpdatePassword}
          disabled={!hasMinLength || !isMatching || isUpdating}
          activeScale={0.96}
        >
          <Text style={styles.submitButtonText}>
            {isUpdating ? 'Updating Password...' : 'Update Password'}
          </Text>
          <Feather name="arrow-right" size={20} color="#FFFFFF" />
        </TactilePressable>
      </KeyboardAvoidingScrollView>
    </SafeAreaView>
  );
}

export default ResetPasswordScreen;
