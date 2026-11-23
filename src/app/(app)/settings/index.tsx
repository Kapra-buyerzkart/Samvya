import { useAuthStore } from '@/features/auth';
import { TactilePressable } from '@/shared/animations';
import { KeyboardAvoidingScrollView } from '@/shared/components';
import { FontFamily, useAppTheme, useThemeStore, type ThemePreference } from '@/shared/theme';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsRoute(): React.JSX.Element {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const theme = useAppTheme();
  const themePreference = useThemeStore((s) => s.themePreference);
  const setThemePreference = useThemeStore((s) => s.setThemePreference);
  const toggleDarkMode = useThemeStore((s) => s.toggleDarkMode);

  const displayName = user?.name || 'Aarav Sharma';
  const displayEmail = user?.email || 'aarav.sharma@samavya.internal';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of Samavya HRMS?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const themeOptions: {
    key: ThemePreference;
    label: string;
    icon: keyof typeof Feather.glyphMap;
  }[] = [
    { key: 'system', label: 'System', icon: 'smartphone' },
    { key: 'light', label: 'Light', icon: 'sun' },
    { key: 'dark', label: 'Dark', icon: 'moon' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.backButton,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Feather name="chevron-left" size={26} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: theme.colors.text }]}>Settings</Text>
          <View style={styles.backButtonPlaceholder} />
        </View>

        {/* Profile Card Summary */}
        <TactilePressable
          style={[
            styles.profileSummaryCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={() => router.push('/(app)/profile')}
          activeScale={0.98}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.colors.text }]}>{displayName}</Text>
            <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>
              {displayEmail}
            </Text>
            <Text style={[styles.viewProfileText, { color: theme.colors.primary }]}>
              View & manage profile →
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={theme.colors.textMuted} />
        </TactilePressable>

        {/* Appearance & Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.colors.textMuted }]}>
            Appearance & Theme
          </Text>
          <View
            style={[
              styles.menuCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            {/* Quick Dark Mode Toggle */}
            <View style={styles.menuItem}>
              <View
                style={[
                  styles.menuIconWrapper,
                  {
                    backgroundColor: theme.isDark ? '#1E293B' : '#EFF6FF',
                  },
                ]}
              >
                <Feather
                  name={theme.isDark ? 'moon' : 'sun'}
                  size={18}
                  color={theme.isDark ? '#F59E0B' : '#2563EB'}
                />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, { color: theme.colors.text }]}>Dark Mode</Text>
                <Text style={[styles.menuSubtitle, { color: theme.colors.textSecondary }]}>
                  {theme.isDark ? 'Dark theme active' : 'Light theme active'}
                </Text>
              </View>
              <Switch
                value={theme.isDark}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#CBD5E1', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.cardSeparator, { backgroundColor: theme.colors.border }]} />

            {/* Segmented Mode Selector: System / Light / Dark */}
            <View style={styles.themeSelectorRow}>
              {themeOptions.map((opt) => {
                const isSelected = themePreference === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    style={[
                      styles.themeOptionPill,
                      {
                        backgroundColor: isSelected
                          ? theme.isDark
                            ? '#2563EB'
                            : '#1D4ED8'
                          : theme.isDark
                            ? '#1E293B'
                            : '#F1F5F9',
                        borderColor: isSelected ? '#3B82F6' : theme.isDark ? '#334155' : '#E2E8F0',
                      },
                    ]}
                    onPress={() => setThemePreference(opt.key)}
                    activeOpacity={0.7}
                  >
                    <Feather
                      name={opt.icon}
                      size={14}
                      color={isSelected ? '#FFFFFF' : theme.colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.themeOptionText,
                        {
                          color: isSelected ? '#FFFFFF' : theme.colors.text,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.colors.textMuted }]}>
            Account & Security
          </Text>
          <View
            style={[
              styles.menuCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <TactilePressable
              style={[styles.menuItem, { opacity: 0.6 }]}
              onPress={() =>
                Alert.alert(
                  'Profile Editing Disabled',
                  'Your profile details are managed by your HR administrator.',
                )
              }
              activeScale={0.99}
              accessibilityRole="button"
              accessibilityState={{ disabled: true }}
              accessibilityLabel="Edit Profile Information disabled"
            >
              <View
                style={[
                  styles.menuIconWrapper,
                  { backgroundColor: theme.isDark ? '#1E293B' : '#F1F5F9' },
                ]}
              >
                <Feather name="lock" size={18} color={theme.colors.textMuted} />
              </View>
              <View style={styles.menuTextCol}>
                <View style={styles.disabledTitleRow}>
                  <Text style={[styles.menuTitle, { color: theme.colors.textMuted }]}>
                    Edit Profile Information
                  </Text>
                  <View
                    style={[
                      styles.disabledBadge,
                      { backgroundColor: theme.isDark ? '#334155' : '#E2E8F0' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.disabledBadgeText,
                        { color: theme.isDark ? '#94A3B8' : '#64748B' },
                      ]}
                    >
                      Disabled
                    </Text>
                  </View>
                </View>
                <Text style={[styles.menuSubtitle, { color: theme.colors.textMuted }]}>
                  Managed by HR administrator
                </Text>
              </View>
            </TactilePressable>

            <View style={[styles.cardSeparator, { backgroundColor: theme.colors.border }]} />

            <TactilePressable
              style={styles.menuItem}
              onPress={() => router.push('/(app)/profile/reset-password')}
              activeScale={0.98}
            >
              <View
                style={[
                  styles.menuIconWrapper,
                  { backgroundColor: theme.isDark ? '#78350F' : '#FEF3C7' },
                ]}
              >
                <Feather name="key" size={18} color={theme.isDark ? '#FCD34D' : '#D97706'} />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, { color: theme.colors.text }]}>
                  Change Password
                </Text>
                <Text style={[styles.menuSubtitle, { color: theme.colors.textSecondary }]}>
                  Update your login credentials
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={theme.colors.borderStrong} />
            </TactilePressable>
          </View>
        </View>

        {/* Privacy & Compliance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.colors.textMuted }]}>
            Privacy & Compliance
          </Text>
          <View
            style={[
              styles.menuCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.menuItem}>
              <View
                style={[
                  styles.menuIconWrapper,
                  { backgroundColor: theme.isDark ? '#064E3B' : '#ECFDF5' },
                ]}
              >
                <Feather name="shield" size={18} color={theme.isDark ? '#6EE7B7' : '#059669'} />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, { color: theme.colors.text }]}>
                  DPDP Privacy Consent
                </Text>
                <Text style={[styles.menuSubtitle, { color: theme.colors.textSecondary }]}>
                  Consent granted for biometric & GPS clock-in
                </Text>
              </View>
              <Feather name="check" size={18} color={theme.isDark ? '#6EE7B7' : '#059669'} />
            </View>

            <View style={[styles.cardSeparator, { backgroundColor: theme.colors.border }]} />

            <View style={styles.menuItem}>
              <View
                style={[
                  styles.menuIconWrapper,
                  { backgroundColor: theme.isDark ? '#1E293B' : '#F1F5F9' },
                ]}
              >
                <Feather name="map-pin" size={18} color={theme.isDark ? '#94A3B8' : '#475569'} />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, { color: theme.colors.text }]}>
                  Location Geofence Status
                </Text>
                <Text style={[styles.menuSubtitle, { color: theme.colors.textSecondary }]}>
                  GPS verified within office perimeter
                </Text>
              </View>
              <Feather name="check-circle" size={18} color={theme.isDark ? '#6EE7B7' : '#059669'} />
            </View>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.colors.textMuted }]}>App System</Text>
          <View
            style={[
              styles.menuCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.menuItem}>
              <View
                style={[
                  styles.menuIconWrapper,
                  { backgroundColor: theme.isDark ? '#1E293B' : '#F8FAFC' },
                ]}
              >
                <Feather name="info" size={18} color={theme.isDark ? '#94A3B8' : '#64748B'} />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, { color: theme.colors.text }]}>
                  Samavya HRMS Mobile
                </Text>
                <Text style={[styles.menuSubtitle, { color: theme.colors.textSecondary }]}>
                  Version 1.0.0 (Build 2026.11)
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <TactilePressable
          style={[
            styles.signOutButton,
            {
              backgroundColor: theme.isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
              borderColor: theme.isDark ? 'rgba(239, 68, 68, 0.3)' : 'transparent',
              borderWidth: theme.isDark ? 1 : 0,
            },
          ]}
          onPress={handleSignOut}
          activeScale={0.96}
        >
          <Feather name="log-out" size={18} color={theme.isDark ? '#F87171' : '#DC2626'} />
          <Text style={[styles.signOutText, { color: theme.isDark ? '#F87171' : '#DC2626' }]}>
            Sign Out of Samavya
          </Text>
        </TactilePressable>
      </KeyboardAvoidingScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  backButtonPlaceholder: {
    width: 38,
  },
  navTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
  },
  profileSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 22,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    marginBottom: 2,
  },
  profileEmail: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    marginBottom: 4,
  },
  viewProfileText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  menuCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextCol: {
    flex: 1,
    marginRight: 8,
  },
  menuTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
  },
  cardSeparator: {
    height: 1,
    marginLeft: 64,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  themeOptionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  themeOptionText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
    marginBottom: 100,
  },
  signOutText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
  },
  disabledTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  disabledBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  disabledBadgeText: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
  },
});
