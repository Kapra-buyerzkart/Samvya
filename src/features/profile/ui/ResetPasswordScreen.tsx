import React, { useMemo, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FontFamily } from '@/shared/theme';

export function ResetPasswordScreen(): React.JSX.Element {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);

  // Password strength calculation
  const strength = useMemo(() => {
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;

    if (score <= 1) return { score, label: 'Weak', color: '#EF4444' };
    if (score === 2) return { score, label: 'Fair', color: '#F59E0B' };
    if (score === 3) return { score, label: 'Good', color: '#3B82F6' };
    return { score, label: 'Strong', color: '#10B981' };
  }, [newPassword]);

  const hasMinLength = newPassword.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isMatching = newPassword.length > 0 && newPassword === confirmPassword;

  const handleUpdatePassword = () => {
    if (!currentPassword) {
      Alert.alert('Required', 'Please enter your current password.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Weak Password', 'New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'New password and confirmation password do not match.');
      return;
    }

    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      Alert.alert(
        'Password Updated',
        'Your password has been changed successfully. Please use your new password next time you sign in.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ],
      );
    }, 500);
  };

  return (
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
            {/* Header */}
            <View style={styles.navBar}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
                activeOpacity={0.7}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Feather name="chevron-left" size={26} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.navTitle}>Reset Password</Text>
              <View style={styles.placeholderRight} />
            </View>

            {/* Instruction Banner */}
            <View style={styles.bannerCard}>
              <View style={styles.bannerIconContainer}>
                <Feather name="lock" size={20} color="#1D4ED8" />
              </View>
              <View style={styles.bannerTextCol}>
                <Text style={styles.bannerTitle}>Security Requirement</Text>
                <Text style={styles.bannerText}>
                  Choose a strong password with at least 8 characters, combining uppercase, numbers, and symbols.
                </Text>
              </View>
            </View>

            {/* Password Form Card */}
            <View style={styles.formCard}>
              {/* Current Password */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Current Password</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="key" size={18} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Enter current password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showCurrent}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowCurrent(!showCurrent)}
                    style={styles.eyeBtn}
                    activeOpacity={0.7}
                  >
                    <Feather
                      name={showCurrent ? 'eye' : 'eye-off'}
                      size={18}
                      color="#64748B"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* New Password */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>New Password</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="lock" size={18} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter new password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showNew}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowNew(!showNew)}
                    style={styles.eyeBtn}
                    activeOpacity={0.7}
                  >
                    <Feather
                      name={showNew ? 'eye' : 'eye-off'}
                      size={18}
                      color="#64748B"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Password Strength Meter */}
              {newPassword.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthHeader}>
                    <Text style={styles.strengthLabel}>Password Strength</Text>
                    <Text style={[styles.strengthValue, { color: strength.color }]}>
                      {strength.label}
                    </Text>
                  </View>
                  <View style={styles.strengthBarsRow}>
                    {[1, 2, 3, 4].map((bar) => (
                      <View
                        key={bar}
                        style={[
                          styles.strengthBar,
                          bar <= strength.score && { backgroundColor: strength.color },
                        ]}
                      />
                    ))}
                  </View>
                </View>
              )}

              {/* Confirm New Password */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Confirm New Password</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="check-circle" size={18} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Re-enter new password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showConfirm}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirm(!showConfirm)}
                    style={styles.eyeBtn}
                    activeOpacity={0.7}
                  >
                    <Feather
                      name={showConfirm ? 'eye' : 'eye-off'}
                      size={18}
                      color="#64748B"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Verification Checklist */}
              <View style={styles.checklist}>
                <View style={styles.checkItem}>
                  <Feather
                    name={hasMinLength ? 'check-circle' : 'circle'}
                    size={15}
                    color={hasMinLength ? '#16A34A' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.checkText,
                      hasMinLength && styles.checkTextActive,
                    ]}
                  >
                    At least 8 characters
                  </Text>
                </View>

                <View style={styles.checkItem}>
                  <Feather
                    name={hasNumberOrSymbol ? 'check-circle' : 'circle'}
                    size={15}
                    color={hasNumberOrSymbol ? '#16A34A' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.checkText,
                      hasNumberOrSymbol && styles.checkTextActive,
                    ]}
                  >
                    Contains number or symbol
                  </Text>
                </View>

                <View style={styles.checkItem}>
                  <Feather
                    name={isMatching ? 'check-circle' : 'circle'}
                    size={15}
                    color={isMatching ? '#16A34A' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.checkText,
                      isMatching && styles.checkTextActive,
                    ]}
                  >
                    Passwords match
                  </Text>
                </View>
              </View>
            </View>

            {/* Update Password Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!hasMinLength || !isMatching || isUpdating) && styles.submitButtonDisabled,
              ]}
              onPress={handleUpdatePassword}
              disabled={!hasMinLength || !isMatching || isUpdating}
              activeOpacity={0.85}
            >
              <Text style={styles.submitButtonText}>
                {isUpdating ? 'Updating Password...' : 'Update Password'}
              </Text>
              <Feather name="arrow-right" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flexOne: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 6,
  },
  backButton: {
    padding: 2,
    marginLeft: -4,
  },
  navTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  placeholderRight: {
    width: 24,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(238, 242, 255, 0.75)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 14,
    gap: 12,
    marginBottom: 20,
  },
  bannerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 14,
    color: '#1D4ED8',
    marginBottom: 2,
  },
  bannerText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#475569',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 16,
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: '#475569',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    height: 48,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 8,
  },
  eyeBtn: {
    padding: 6,
  },
  strengthContainer: {
    gap: 6,
    marginTop: -4,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  strengthLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#64748B',
  },
  strengthValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
  },
  strengthBarsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  checklist: {
    gap: 8,
    paddingTop: 4,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#94A3B8',
  },
  checkTextActive: {
    color: '#16A34A',
    fontFamily: FontFamily.medium,
  },
  submitButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 28,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});

