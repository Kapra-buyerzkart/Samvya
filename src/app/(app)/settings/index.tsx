import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '@/features/auth';
import { FontFamily } from '@/shared/theme';

export default function SettingsRoute(): React.JSX.Element {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Feather name="chevron-left" size={26} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Settings</Text>
          <View style={styles.backButtonPlaceholder} />
        </View>

        {/* Profile Card Summary */}
        <TouchableOpacity
          style={styles.profileSummaryCard}
          onPress={() => router.push('/(app)/profile')}
          activeOpacity={0.75}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileEmail}>{displayEmail}</Text>
            <Text style={styles.viewProfileText}>View & manage profile →</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#94A3B8" />
        </TouchableOpacity>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account & Security</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/(app)/profile/edit')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconWrapper, { backgroundColor: '#EFF6FF' }]}>
                <Feather name="user-check" size={18} color="#1D4ED8" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuTitle}>Edit Profile Information</Text>
                <Text style={styles.menuSubtitle}>Name, designation, emergency contact</Text>
              </View>
              <Feather name="chevron-right" size={18} color="#CBD5E1" />
            </TouchableOpacity>

            <View style={styles.cardSeparator} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/(app)/profile/reset-password')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconWrapper, { backgroundColor: '#FEF3C7' }]}>
                <Feather name="key" size={18} color="#D97706" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuTitle}>Change Password</Text>
                <Text style={styles.menuSubtitle}>Update your login credentials</Text>
              </View>
              <Feather name="chevron-right" size={18} color="#CBD5E1" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Privacy & Compliance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Privacy & Compliance</Text>
          <View style={styles.menuCard}>
            <View style={styles.menuItem}>
              <View style={[styles.menuIconWrapper, { backgroundColor: '#ECFDF5' }]}>
                <Feather name="shield" size={18} color="#059669" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuTitle}>DPDP Privacy Consent</Text>
                <Text style={styles.menuSubtitle}>Consent granted for biometric & GPS clock-in</Text>
              </View>
              <Feather name="check" size={18} color="#059669" />
            </View>

            <View style={styles.cardSeparator} />

            <View style={styles.menuItem}>
              <View style={[styles.menuIconWrapper, { backgroundColor: '#F1F5F9' }]}>
                <Feather name="map-pin" size={18} color="#475569" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuTitle}>Location Geofence Status</Text>
                <Text style={styles.menuSubtitle}>GPS verified within office perimeter</Text>
              </View>
              <Feather name="check-circle" size={18} color="#059669" />
            </View>
          </View>
        </View>

        {/* App Info & Sign Out */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>App System</Text>
          <View style={styles.menuCard}>
            <View style={styles.menuItem}>
              <View style={[styles.menuIconWrapper, { backgroundColor: '#F8FAFC' }]}>
                <Feather name="info" size={18} color="#64748B" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuTitle}>Samavya HRMS Mobile</Text>
                <Text style={styles.menuSubtitle}>Version 1.0.0 (Build 2026.11)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Feather name="log-out" size={18} color="#DC2626" />
          <Text style={styles.signOutText}>Sign Out of Samavya</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  backButtonPlaceholder: {
    width: 38,
  },
  navTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    color: '#0F172A',
  },
  profileSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    color: '#0F172A',
    marginBottom: 2,
  },
  profileEmail: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  viewProfileText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#1D4ED8',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    color: '#0F172A',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#64748B',
  },
  cardSeparator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 64,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
  },
  signOutText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#DC2626',
  },
});
