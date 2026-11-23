import { useAuthStore } from '@/features/auth';
import { TactilePressable } from '@/shared/animations';
import { KeyboardAvoidingScrollView } from '@/shared/components';
import { FontFamily, useAppTheme } from '@/shared/theme';
import { Feather } from '@expo/vector-icons';
import { Image, ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddressBottomSheet } from './AddressBottomSheet';

export function ProfileScreen(): React.JSX.Element {
  const user = useAuthStore((s) => s.user);
  const theme = useAppTheme();
  const isDark = theme.isDark;
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Parse display values with fallback to the reference design ("Peter S")
  const displayName = user?.name || 'Peter S';
  const nameParts = displayName.trim().split(/\s+/);
  const firstName =
    user?.firstName || (nameParts.length > 0 && nameParts[0] ? nameParts[0] : 'Peter');
  const lastName = user?.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'S');
  const middleName = user?.middleName;
  const dob = user?.dob;
  const gender = user?.gender;

  const displayEmail = user?.email || 'peter@gmail.com';
  const displayPhone = user?.phone || '9567-767-8768';
  const otherEmail = user?.otherEmail;
  const otherPhone = user?.otherPhone;
  const address = user?.address;

  // Initials for avatar circle (e.g. "PS")
  const initials = `${firstName[0] ?? 'P'}${lastName[0] ?? 'S'}`.toUpperCase();

  const handleCopy = (text: string, label: string) => {
    Alert.alert('Copied', `${label} copied: ${text}`);
  };

  const handleEditDisabled = () => {
    Alert.alert(
      'Profile Editing Disabled',
      'Your profile details are managed by your HR administrator.',
    );
  };

  return (
    <ImageBackground
      source={require('../../../../assets/images/background_home.png')}
      style={[styles.backgroundImage, { backgroundColor: isDark ? '#020617' : '#F8FAFC' }]}
      imageStyle={{ opacity: isDark ? 0.05 : 1 }}
      contentFit="cover"
    >
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: isDark ? '#020617' : 'transparent' }]}
      >
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Feather name="chevron-left" size={28} color={isDark ? '#F8FAFC' : '#0F172A'} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, isDark && { color: '#F8FAFC' }]}>Profile</Text>
        </View>

        <KeyboardAvoidingScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Header Profile Card */}
          <View
            style={[
              styles.heroCard,
              isDark && { backgroundColor: '#0F172A', borderColor: '#1E293B' },
            ]}
          >
            <View style={styles.avatarWrapper}>
              <View
                style={[
                  styles.avatarCircle,
                  isDark && { backgroundColor: '#1E3A8A', borderColor: '#3B82F6' },
                ]}
              >
                <Text style={[styles.avatarText, isDark && { color: '#93C5FD' }]}>{initials}</Text>
              </View>
              <TactilePressable
                style={[
                  styles.cameraBadge,
                  isDark && { backgroundColor: '#0F172A', borderColor: '#334155' },
                ]}
                onPress={handleEditDisabled}
                activeScale={0.88}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Change photo disabled"
              >
                <Feather name="lock" size={10} color={isDark ? '#64748B' : '#94A3B8'} />
              </TactilePressable>
            </View>

            <View style={styles.heroTextCol}>
              <Text style={[styles.heroName, isDark && { color: '#F8FAFC' }]}>{displayName}</Text>
              <Text style={[styles.heroSubtitle, isDark && { color: '#94A3B8' }]}>
                Personal and contact details
              </Text>
            </View>
          </View>

          {/* 2. Personal Information Card */}
          <View
            style={[styles.card, isDark && { backgroundColor: '#0F172A', borderColor: '#1E293B' }]}
          >
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View
                  style={[
                    styles.headerIconBox,
                    isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
                  ]}
                >
                  <Feather name="user" size={18} color={isDark ? '#60A5FA' : '#2563EB'} />
                </View>
                <Text style={[styles.cardTitle, isDark && { color: '#F8FAFC' }]}>
                  Personal Information
                </Text>
              </View>
              <TactilePressable
                onPress={handleEditDisabled}
                style={styles.editIconBtn}
                activeScale={0.88}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Edit personal information disabled"
              >
                <Feather name="lock" size={16} color={isDark ? '#64748B' : '#94A3B8'} />
              </TactilePressable>
            </View>

            <View style={[styles.cardDivider, isDark && { backgroundColor: '#1E293B' }]} />

            {/* Names 2-Column Row */}
            <View style={styles.twoColumnRow}>
              <View style={styles.columnHalf}>
                <Text style={[styles.fieldLabel, isDark && { color: '#94A3B8' }]}>First name</Text>
                <Text style={[styles.fieldValueBold, isDark && { color: '#F8FAFC' }]}>
                  {firstName}
                </Text>
              </View>
              <View style={[styles.verticalDivider, isDark && { backgroundColor: '#1E293B' }]} />
              <View style={styles.columnHalf}>
                <Text style={[styles.fieldLabel, isDark && { color: '#94A3B8' }]}>Last name</Text>
                <Text style={[styles.fieldValueBold, isDark && { color: '#F8FAFC' }]}>
                  {lastName}
                </Text>
              </View>
            </View>

            <View style={[styles.cardDivider, isDark && { backgroundColor: '#1E293B' }]} />

            {/* Middle name */}
            <View style={styles.middleNameSection}>
              <Text style={[styles.fieldLabel, isDark && { color: '#94A3B8' }]}>Middle name</Text>
              {middleName ? (
                <Text style={[styles.fieldValueBold, isDark && { color: '#F8FAFC' }]}>
                  {middleName}
                </Text>
              ) : (
                <TouchableOpacity onPress={handleEditDisabled} activeOpacity={0.7}>
                  <Text style={[styles.notSetText, isDark && { color: '#64748B' }]}>Not specified</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Sub-cards Row (Date of birth & Gender) */}
            <View style={styles.subCardsRow}>
              <TouchableOpacity
                style={[
                  styles.subCard,
                  isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
                ]}
                onPress={handleEditDisabled}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.subCardIconBox,
                    isDark && { backgroundColor: '#0F172A', borderColor: '#334155' },
                  ]}
                >
                  <Feather name="calendar" size={16} color={isDark ? '#60A5FA' : '#2563EB'} />
                </View>
                <View style={styles.subCardTextCol}>
                  <Text style={[styles.subCardLabel, isDark && { color: '#94A3B8' }]}>
                    Date of birth
                  </Text>
                  <Text
                    style={[
                      dob ? styles.subCardActionText : styles.notSetText,
                      isDark && { color: dob ? '#60A5FA' : '#64748B' },
                    ]}
                  >
                    {dob || 'Not set'}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.subCard,
                  isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
                ]}
                onPress={handleEditDisabled}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.subCardIconBox,
                    isDark && { backgroundColor: '#0F172A', borderColor: '#334155' },
                  ]}
                >
                  <Feather name="user" size={16} color={isDark ? '#60A5FA' : '#2563EB'} />
                </View>
                <View style={styles.subCardTextCol}>
                  <Text style={[styles.subCardLabel, isDark && { color: '#94A3B8' }]}>Gender</Text>
                  <Text
                    style={[
                      gender ? styles.subCardActionText : styles.notSetText,
                      isDark && { color: gender ? '#60A5FA' : '#64748B' },
                    ]}
                  >
                    {gender || 'Not set'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. Contact Information Card */}
          <View
            style={[styles.card, isDark && { backgroundColor: '#0F172A', borderColor: '#1E293B' }]}
          >
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View
                  style={[
                    styles.headerIconBox,
                    isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
                  ]}
                >
                  <Feather name="mail" size={18} color={isDark ? '#60A5FA' : '#2563EB'} />
                </View>
                <Text style={[styles.cardTitle, isDark && { color: '#F8FAFC' }]}>
                  Contact Information
                </Text>
              </View>
              <TactilePressable
                onPress={handleEditDisabled}
                style={styles.editIconBtn}
                activeScale={0.88}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Edit personal information disabled"
              >
                <Feather name="lock" size={16} color={isDark ? '#64748B' : '#94A3B8'} />
              </TactilePressable>
            </View>

            <View style={[styles.cardDivider, isDark && { backgroundColor: '#1E293B' }]} />

            {/* Work Email Row */}
            <View style={styles.contactRow}>
              <View
                style={[
                  styles.rowIconBox,
                  isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
                ]}
              >
                <Feather name="mail" size={16} color={isDark ? '#60A5FA' : '#2563EB'} />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.fieldLabel, isDark && { color: '#94A3B8' }]}>Work email</Text>
                <Text style={[styles.fieldValueContact, isDark && { color: '#F8FAFC' }]}>
                  {displayEmail}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleCopy(displayEmail, 'Work email')}
                style={styles.copyBtn}
                activeOpacity={0.6}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="copy" size={18} color={isDark ? '#60A5FA' : '#2563EB'} />
              </TouchableOpacity>
            </View>

            <View style={[styles.cardDivider, isDark && { backgroundColor: '#1E293B' }]} />

            {/* Primary Phone Row */}
            <View style={styles.contactRow}>
              <View
                style={[
                  styles.rowIconBox,
                  isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
                ]}
              >
                <Feather name="phone" size={16} color={isDark ? '#60A5FA' : '#2563EB'} />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.fieldLabel, isDark && { color: '#94A3B8' }]}>
                  Primary phone
                </Text>
                <Text style={[styles.fieldValueContact, isDark && { color: '#F8FAFC' }]}>
                  {displayPhone}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleCopy(displayPhone, 'Primary phone')}
                style={styles.copyBtn}
                activeOpacity={0.6}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="copy" size={18} color={isDark ? '#60A5FA' : '#2563EB'} />
              </TouchableOpacity>
            </View>

            <View style={[styles.cardDivider, isDark && { backgroundColor: '#1E293B' }]} />

            {/* Sub-container for Other email & Other phone */}
            <View
              style={[
                styles.subContainerRow,
                isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
              ]}
            >
              <TouchableOpacity
                style={styles.subContainerHalf}
                onPress={handleEditDisabled}
                activeOpacity={0.7}
              >
                <Text style={[styles.subCardLabel, isDark && { color: '#94A3B8' }]}>
                  Other email
                </Text>
                <Text
                  style={[
                    otherEmail ? styles.subCardActionText : styles.notSetText,
                    isDark && { color: otherEmail ? '#60A5FA' : '#64748B' },
                  ]}
                >
                  {otherEmail || 'Not set'}
                </Text>
              </TouchableOpacity>
              <View style={[styles.verticalDividerSub, isDark && { backgroundColor: '#334155' }]} />
              <TouchableOpacity
                style={styles.subContainerHalf}
                onPress={handleEditDisabled}
                activeOpacity={0.7}
              >
                <Text style={[styles.subCardLabel, isDark && { color: '#94A3B8' }]}>
                  Other phone
                </Text>
                <Text
                  style={[
                    otherPhone ? styles.subCardActionText : styles.notSetText,
                    isDark && { color: otherPhone ? '#60A5FA' : '#64748B' },
                  ]}
                >
                  {otherPhone || 'Not set'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 4. Address Card */}
          <View
            style={[styles.card, isDark && { backgroundColor: '#0F172A', borderColor: '#1E293B' }]}
          >
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View
                  style={[
                    styles.headerIconBox,
                    isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
                  ]}
                >
                  <Feather name="map-pin" size={18} color={isDark ? '#60A5FA' : '#2563EB'} />
                </View>
                <Text style={[styles.cardTitle, isDark && { color: '#F8FAFC' }]}>Address</Text>
              </View>
            </View>

            <View style={[styles.cardDivider, isDark && { backgroundColor: '#1E293B' }]} />

            {/* Body */}
            <View style={styles.addressBody}>
              <View style={styles.addressIllustrationWrapper}>
                <Image
                  source={require('../../../../assets/images/address_illustration.png')}
                  style={styles.addressIllustration}
                  contentFit="contain"
                />
              </View>

              <View
                style={[styles.addressVerticalDivider, isDark && { backgroundColor: '#1E293B' }]}
              />

              <View style={styles.addressContent}>
                <Text style={[styles.addressEmptyTitle, isDark && { color: '#F8FAFC' }]}>
                  {address ? 'Current address' : 'No address added'}
                </Text>
                <Text style={[styles.addressEmptySubtitle, isDark && { color: '#94A3B8' }]}>
                  {address || 'Add your street, city and postal code'}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.addAddressBtn,
                    isDark && { borderColor: '#3B82F6', backgroundColor: '#1E293B' },
                  ]}
                  onPress={() => setIsAddressModalOpen(true)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.addAddressBtnText, isDark && { color: '#60A5FA' }]}>
                    {address ? 'Edit address' : '+ Add address'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 5. Bottom Action Button */}
          <TactilePressable
            style={[
              styles.bottomEditBtn,
              styles.bottomEditBtnDisabled,
              isDark && styles.bottomEditBtnDisabledDark,
            ]}
            onPress={handleEditDisabled}
            activeScale={1}
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
            accessibilityLabel="Edit Profile disabled"
          >
            <Feather name="lock" size={16} color={isDark ? '#64748B' : '#94A3B8'} />
            <Text
              style={[
                styles.bottomEditBtnText,
                styles.bottomEditBtnTextDisabled,
                isDark && { color: '#64748B' },
              ]}
            >
              Edit Profile (Disabled)
            </Text>
          </TactilePressable>
        </KeyboardAvoidingScrollView>

        <AddressBottomSheet
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
        />
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
    backgroundColor: 'transparent',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    padding: 2,
    marginRight: 6,
    marginLeft: -4,
  },
  navTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 96,
  },
  // 1. Hero Card
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#1E40AF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#DBEAFE',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextCol: {
    marginLeft: 14,
    flex: 1,
  },
  heroName: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },
  // General Card Styles
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#1E40AF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    color: '#0F172A',
    marginLeft: 12,
    letterSpacing: -0.2,
  },
  editIconBtn: {
    padding: 6,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  // Two Column Row
  twoColumnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  columnHalf: {
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 14,
  },
  fieldLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#64748B',
  },
  fieldValueBold: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    color: '#0F172A',
    marginTop: 4,
  },
  middleNameSection: {
    marginBottom: 14,
  },
  addText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#2563EB',
    marginTop: 4,
  },
  // Sub-cards Row
  subCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  subCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    padding: 12,
  },
  subCardIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subCardTextCol: {
    marginLeft: 10,
    flex: 1,
  },
  subCardLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#64748B',
  },
  subCardActionText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#2563EB',
    marginTop: 2,
  },
  // Contact Rows
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: {
    flex: 1,
    marginLeft: 12,
  },
  fieldValueContact: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#0F172A',
    marginTop: 2,
  },
  copyBtn: {
    padding: 6,
  },
  subContainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    padding: 12,
  },
  subContainerHalf: {
    flex: 1,
    paddingLeft: 4,
  },
  verticalDividerSub: {
    width: 1,
    height: 30,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 12,
  },
  // Address Card
  addressBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIllustrationWrapper: {
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressIllustration: {
    width: 80,
    height: 74,
  },
  addressVerticalDivider: {
    width: 1,
    height: 80,
    backgroundColor: '#E2E8F0',
    marginRight: 14,
  },
  addressContent: {
    flex: 1,
  },
  addressEmptyTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 2,
  },
  addressEmptySubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginBottom: 10,
  },
  addAddressBtn: {
    borderWidth: 1.5,
    borderColor: '#2563EB',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  addAddressBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#2563EB',
  },
  // Bottom Action Button
  bottomEditBtn: {
    backgroundColor: '#1D4ED8',
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 28,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  bottomEditBtnText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  bottomEditBtnDisabled: {
    backgroundColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  bottomEditBtnDisabledDark: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  bottomEditBtnTextDisabled: {
    color: '#94A3B8',
  },
  notSetText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#94A3B8',
  },
});
