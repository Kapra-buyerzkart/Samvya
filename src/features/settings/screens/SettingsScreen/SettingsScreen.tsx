import { TactilePressable } from '@/shared/animations';
import { KeyboardAvoidingScrollView } from '@/shared/components';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getBackButtonStyle,
  getCardSeparatorStyle,
  getCardSurfaceStyle,
  getDisabledBadgeStyle,
  getMenuIconWrapperStyle,
  getSafeAreaStyle,
  getSignOutButtonStyle,
  getSignOutTextStyle,
  getTextColorStyle,
  getThemeOptionPillStyle,
  getThemeOptionTextStyle,
  styles,
} from './SettingsScreen.styles';
import { useSettingsScreen } from './useSettingsScreen';

export function SettingsScreen(): React.JSX.Element {
  const {
    theme,
    themePreference,
    setThemePreference,
    toggleDarkMode,
    displayName,
    displayEmail,
    initials,
    handleSignOut,
    handleBack,
    handleProfilePress,
    handleDisabledProfilePress,
    handleResetPasswordPress,
    themeOptions,
  } = useSettingsScreen();

  return (
    <SafeAreaView style={[styles.safeArea, getSafeAreaStyle(theme.colors.background)]}>
      <KeyboardAvoidingScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={handleBack}
            style={[
              styles.backButton,
              getBackButtonStyle(theme.colors.surface, theme.colors.border),
            ]}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Feather name="chevron-left" size={26} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, getTextColorStyle(theme.colors.text)]}>Settings</Text>
          <View style={styles.backButtonPlaceholder} />
        </View>

        <TactilePressable
          style={[
            styles.profileSummaryCard,
            getCardSurfaceStyle(theme.colors.surface, theme.colors.border),
          ]}
          onPress={handleProfilePress}
          activeScale={0.98}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, getTextColorStyle(theme.colors.text)]}>{displayName}</Text>
            <Text style={[styles.profileEmail, getTextColorStyle(theme.colors.textSecondary)]}>
              {displayEmail}
            </Text>
            <Text style={[styles.viewProfileText, getTextColorStyle(theme.colors.primary)]}>
              View & manage profile →
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={theme.colors.textMuted} />
        </TactilePressable>

        <View style={styles.section}>
          <Text style={[styles.sectionHeader, getTextColorStyle(theme.colors.textMuted)]}>
            Appearance & Theme
          </Text>
          <View
            style={[
              styles.menuCard,
              getCardSurfaceStyle(theme.colors.surface, theme.colors.border),
            ]}
          >
            <View style={styles.menuItem}>
              <View
                style={[
                  styles.menuIconWrapper,
                  getMenuIconWrapperStyle(theme.isDark ? '#1E293B' : '#EFF6FF'),
                ]}
              >
                <Feather
                  name={theme.isDark ? 'moon' : 'sun'}
                  size={18}
                  color={theme.isDark ? '#F59E0B' : '#2563EB'}
                />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, getTextColorStyle(theme.colors.text)]}>Dark Mode</Text>
                <Text style={[styles.menuSubtitle, getTextColorStyle(theme.colors.textSecondary)]}>
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

            <View style={[styles.cardSeparator, getCardSeparatorStyle(theme.colors.border)]} />

            <View style={styles.themeSelectorRow}>
              {themeOptions.map((opt) => {
                const isSelected = themePreference === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    style={[
                      styles.themeOptionPill,
                      getThemeOptionPillStyle(isSelected, theme.isDark),
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
                        getThemeOptionTextStyle(isSelected, theme.colors.text),
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

        <View style={styles.section}>
          <Text style={[styles.sectionHeader, getTextColorStyle(theme.colors.textMuted)]}>
            Account & Security
          </Text>
          <View
            style={[
              styles.menuCard,
              getCardSurfaceStyle(theme.colors.surface, theme.colors.border),
            ]}
          >
            <TactilePressable
              style={styles.menuItemDisabled}
              onPress={handleDisabledProfilePress}
              activeScale={0.99}
              accessibilityRole="button"
              accessibilityState={{ disabled: true }}
              accessibilityLabel="Edit Profile Information disabled"
            >
              <View
                style={[
                  styles.menuIconWrapper,
                  getMenuIconWrapperStyle(theme.isDark ? '#1E293B' : '#F1F5F9'),
                ]}
              >
                <Feather name="lock" size={18} color={theme.colors.textMuted} />
              </View>
              <View style={styles.menuTextCol}>
                <View style={styles.disabledTitleRow}>
                  <Text style={[styles.menuTitle, getTextColorStyle(theme.colors.textMuted)]}>
                    Edit Profile Information
                  </Text>
                  <View
                    style={[
                      styles.disabledBadge,
                      getDisabledBadgeStyle(theme.isDark ? '#334155' : '#E2E8F0'),
                    ]}
                  >
                    <Text
                      style={[
                        styles.disabledBadgeText,
                        getTextColorStyle(theme.isDark ? '#94A3B8' : '#64748B'),
                      ]}
                    >
                      Disabled
                    </Text>
                  </View>
                </View>
                <Text style={[styles.menuSubtitle, getTextColorStyle(theme.colors.textMuted)]}>
                  Managed by HR administrator
                </Text>
              </View>
            </TactilePressable>

            <View style={[styles.cardSeparator, getCardSeparatorStyle(theme.colors.border)]} />

            <TactilePressable
              style={styles.menuItem}
              onPress={handleResetPasswordPress}
              activeScale={0.98}
            >
              <View
                style={[
                  styles.menuIconWrapper,
                  getMenuIconWrapperStyle(theme.isDark ? '#78350F' : '#FEF3C7'),
                ]}
              >
                <Feather name="key" size={18} color={theme.isDark ? '#FCD34D' : '#D97706'} />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, getTextColorStyle(theme.colors.text)]}>
                  Change Password
                </Text>
                <Text style={[styles.menuSubtitle, getTextColorStyle(theme.colors.textSecondary)]}>
                  Update your login credentials
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={theme.colors.borderStrong} />
            </TactilePressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionHeader, getTextColorStyle(theme.colors.textMuted)]}>
            Privacy & Compliance
          </Text>
          <View
            style={[
              styles.menuCard,
              getCardSurfaceStyle(theme.colors.surface, theme.colors.border),
            ]}
          >
            <View style={styles.menuItem}>
              <View
                style={[
                  styles.menuIconWrapper,
                  getMenuIconWrapperStyle(theme.isDark ? '#064E3B' : '#ECFDF5'),
                ]}
              >
                <Feather name="shield" size={18} color={theme.isDark ? '#6EE7B7' : '#059669'} />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, getTextColorStyle(theme.colors.text)]}>
                  DPDP Privacy Consent
                </Text>
                <Text style={[styles.menuSubtitle, getTextColorStyle(theme.colors.textSecondary)]}>
                  Consent granted for biometric & GPS clock-in
                </Text>
              </View>
              <Feather name="check" size={18} color={theme.isDark ? '#6EE7B7' : '#059669'} />
            </View>

            <View style={[styles.cardSeparator, getCardSeparatorStyle(theme.colors.border)]} />

            <View style={styles.menuItem}>
              <View
                style={[
                  styles.menuIconWrapper,
                  getMenuIconWrapperStyle(theme.isDark ? '#1E293B' : '#F1F5F9'),
                ]}
              >
                <Feather name="map-pin" size={18} color={theme.isDark ? '#94A3B8' : '#475569'} />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, getTextColorStyle(theme.colors.text)]}>
                  Location Geofence Status
                </Text>
                <Text style={[styles.menuSubtitle, getTextColorStyle(theme.colors.textSecondary)]}>
                  GPS verified within office perimeter
                </Text>
              </View>
              <Feather name="check-circle" size={18} color={theme.isDark ? '#6EE7B7' : '#059669'} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionHeader, getTextColorStyle(theme.colors.textMuted)]}>App System</Text>
          <View
            style={[
              styles.menuCard,
              getCardSurfaceStyle(theme.colors.surface, theme.colors.border),
            ]}
          >
            <View style={styles.menuItem}>
              <View
                style={[
                  styles.menuIconWrapper,
                  getMenuIconWrapperStyle(theme.isDark ? '#1E293B' : '#F8FAFC'),
                ]}
              >
                <Feather name="info" size={18} color={theme.isDark ? '#94A3B8' : '#64748B'} />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, getTextColorStyle(theme.colors.text)]}>
                  Samavya HRMS Mobile
                </Text>
                <Text style={[styles.menuSubtitle, getTextColorStyle(theme.colors.textSecondary)]}>
                  Version 1.0.0 (Build 2026.11)
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TactilePressable
          style={[
            styles.signOutButton,
            getSignOutButtonStyle(theme.isDark),
          ]}
          onPress={handleSignOut}
          activeScale={0.96}
        >
          <Feather name="log-out" size={18} color={theme.isDark ? '#F87171' : '#DC2626'} />
          <Text style={[styles.signOutText, getSignOutTextStyle(theme.isDark)]}>
            Sign Out of Samavya
          </Text>
        </TactilePressable>
      </KeyboardAvoidingScrollView>
    </SafeAreaView>
  );
}

export default SettingsScreen;
