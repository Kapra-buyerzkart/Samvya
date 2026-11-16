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
import { PulsingStatusDot, TactilePressable } from '@/shared/animations';

export function ProfileScreen(): React.JSX.Element {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const displayName = user?.name || 'Aarav Sharma';
  const displayEmail = user?.email || 'aarav.sharma@samavya.internal';
  const displayPhone = user?.phone || '+91 98765 43210';
  const displayEmpCode = user?.employeeCode || 'EMP-2026';
  const displayDepartment = user?.department || 'Field Operations';
  const displayDesignation = user?.designation || 'Operations Specialist';
  const displayJoiningDate = user?.joiningDate || '15 Jan 2024';
  const displayEmergency = user?.emergencyContact || '+91 91234 56789';
  const displayLocation = user?.location || 'Work from home';

  // Initials for avatar
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
          <Text style={styles.navTitle}>My Profile</Text>
          <TactilePressable
            onPress={() => router.push('/(app)/profile/edit')}
            style={styles.editHeaderBtn}
            activeScale={0.92}
          >
            <Feather name="edit-2" size={18} color="#1D4ED8" />
          </TactilePressable>
        </View>

        {/* Hero Profile Card */}
        <View style={styles.heroCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <TactilePressable
              style={styles.avatarBadge}
              onPress={() => router.push('/(app)/profile/edit')}
              activeScale={0.88}
            >
              <Feather name="camera" size={12} color="#FFFFFF" />
            </TactilePressable>
          </View>

          <Text style={styles.heroName}>{displayName}</Text>
          <Text style={styles.heroSubtitle}>
            {displayDesignation} • {displayDepartment}
          </Text>

          <View style={styles.badgeRow}>
            <View style={styles.statusPill}>
              <PulsingStatusDot color="#10B981" size={7} />
              <Text style={styles.statusText}>Active Employee</Text>
            </View>
            <View style={styles.empIdPill}>
              <Text style={styles.empIdText}>{displayEmpCode}</Text>
            </View>
          </View>
        </View>

        {/* Quick Highlights Row */}
        <View style={styles.highlightsCard}>
          <View style={styles.highlightCol}>
            <Text style={styles.highlightNumber}>14</Text>
            <Text style={styles.highlightLabel}>Days Leave</Text>
          </View>
          <View style={styles.highlightDivider} />
          <View style={styles.highlightCol}>
            <Text style={styles.highlightNumber}>9h</Text>
            <Text style={styles.highlightLabel}>Daily Shift</Text>
          </View>
          <View style={styles.highlightDivider} />
          <View style={styles.highlightCol}>
            <Text style={styles.highlightNumber}>WFH</Text>
            <Text style={styles.highlightLabel}>Work Mode</Text>
          </View>
        </View>

        {/* Personal & Work Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Employee Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <Feather name="mail" size={16} color="#1D4ED8" />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{displayEmail}</Text>
              </View>
            </View>

            <View style={styles.cardSeparator} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <Feather name="phone" size={16} color="#1D4ED8" />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Mobile Phone</Text>
                <Text style={styles.infoValue}>{displayPhone}</Text>
              </View>
            </View>

            <View style={styles.cardSeparator} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <Feather name="shield" size={16} color="#1D4ED8" />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Emergency Contact</Text>
                <Text style={styles.infoValue}>{displayEmergency}</Text>
              </View>
            </View>

            <View style={styles.cardSeparator} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <Feather name="calendar" size={16} color="#1D4ED8" />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Date Joined</Text>
                <Text style={styles.infoValue}>{displayJoiningDate}</Text>
              </View>
            </View>

            <View style={styles.cardSeparator} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <Feather name="map-pin" size={16} color="#1D4ED8" />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Work Location</Text>
                <Text style={styles.infoValue}>{displayLocation}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Security & Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account &amp; Security</Text>
          <View style={styles.menuCard}>
            <TactilePressable
              style={styles.menuRow}
              onPress={() => router.push('/(app)/profile/edit')}
              activeScale={0.98}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <Feather name="user" size={18} color="#1D4ED8" />
                </View>
                <Text style={styles.menuText}>Edit Profile</Text>
              </View>
              <Feather name="chevron-right" size={18} color="#94A3B8" />
            </TactilePressable>

            <View style={styles.cardSeparator} />

            <TactilePressable
              style={styles.menuRow}
              onPress={() => router.push('/(app)/profile/reset-password')}
              activeScale={0.98}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <Feather name="lock" size={18} color="#1D4ED8" />
                </View>
                <Text style={styles.menuText}>Reset Password</Text>
              </View>
              <Feather name="chevron-right" size={18} color="#94A3B8" />
            </TactilePressable>

            <View style={styles.cardSeparator} />

            <TactilePressable
              style={styles.menuRow}
              onPress={() => router.push('/(app)/attendance/face-verify')}
              activeScale={0.98}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <Feather name="camera" size={18} color="#1D4ED8" />
                </View>
                <View>
                  <Text style={styles.menuText}>Face Biometric Status</Text>
                  <Text style={styles.menuSubtext}>Enrolled &amp; Active</Text>
                </View>
              </View>
              <Feather name="check-circle" size={18} color="#16A34A" />
            </TactilePressable>

            <View style={styles.cardSeparator} />

            <View style={styles.menuRow}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <Feather name="shield" size={18} color="#1D4ED8" />
                </View>
                <View>
                  <Text style={styles.menuText}>DPDP Privacy Consent</Text>
                  <Text style={styles.menuSubtext}>Verified compliant</Text>
                </View>
              </View>
              <Feather name="check" size={18} color="#16A34A" />
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <TactilePressable
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeScale={0.96}
        >
          <Feather name="log-out" size={18} color="#DC2626" />
          <Text style={styles.signOutText}>Sign out of account</Text>
        </TactilePressable>

        {/* Version Footer */}
        <Text style={styles.versionFooter}>
          Samavya HRMS Enterprise Edition • v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    marginBottom: 16,
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
  editHeaderBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  heroCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(238, 242, 255, 0.7)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 30,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  heroName: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: '#475569',
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  statusText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#166534',
  },
  empIdPill: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  empIdText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#1D4ED8',
  },
  highlightsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  highlightCol: {
    flex: 1,
    alignItems: 'center',
  },
  highlightNumber: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    color: '#0F172A',
    marginBottom: 2,
    fontVariant: ['tabular-nums'],
  },
  highlightLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#64748B',
  },
  highlightDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  section: {
    marginBottom: 22,
  },
  sectionHeader: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 4,
    paddingHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  infoIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextCol: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#0F172A',
  },
  cardSeparator: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 4,
    paddingHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#0F172A',
  },
  menuSubtext: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
    height: 52,
    marginBottom: 20,
  },
  signOutText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: '#DC2626',
  },
  versionFooter: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 12,
  },
});

