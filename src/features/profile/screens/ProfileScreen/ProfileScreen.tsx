import { AddressBottomSheet } from '@/features/profile/ui/AddressBottomSheet';
import { TactilePressable } from '@/shared/animations';
import { Feather } from '@expo/vector-icons';
import { Image, ImageBackground } from 'expo-image';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getAddAddressBtnStyle,
  getAddAddressBtnTextStyle,
  getAddressEmptySubtitleStyle,
  getAddressEmptyTitleStyle,
  getAddressVerticalDividerStyle,
  getAvatarCircleStyle,
  getAvatarTextStyle,
  getBackgroundImageProps,
  getBackgroundImageStyle,
  getBottomEditBtnStyle,
  getBottomEditBtnTextStyle,
  getCameraBadgeStyle,
  getCardDividerStyle,
  getCardStyle,
  getCardTitleStyle,
  getFieldLabelStyle,
  getFieldValueBoldStyle,
  getFieldValueContactStyle,
  getHeaderIconBoxStyle,
  getHeroCardStyle,
  getHeroNameStyle,
  getHeroSubtitleStyle,
  getNavTitleStyle,
  getNotSetTextStyle,
  getRowIconBoxStyle,
  getSafeAreaStyle,
  getSubCardActionTextStyle,
  getSubCardIconBoxStyle,
  getSubCardLabelStyle,
  getSubCardStyle,
  getSubContainerRowStyle,
  getTextColor,
  getVerticalDividerStyle,
  getVerticalDividerSubStyle,
  styles,
} from './ProfileScreen.styles';
import { useProfileScreen } from './useProfileScreen';

export function ProfileScreen(): React.JSX.Element {
  const {
    isDark,
    displayName,
    firstName,
    lastName,
    middleName,
    dob,
    gender,
    displayEmail,
    displayPhone,
    otherEmail,
    otherPhone,
    address,
    initials,
    isAddressModalOpen,
    handleCopy,
    handleEditDisabled,
    handleBack,
    handleOpenAddressModal,
    handleCloseAddressModal,
  } = useProfileScreen();

  return (
    <ImageBackground
      source={require('../../../../../assets/images/background_home.png')}
      style={[styles.backgroundImage, getBackgroundImageStyle(isDark)]}
      imageStyle={getBackgroundImageProps(isDark)}
      contentFit="cover"
    >
      <SafeAreaView
        style={[styles.safeArea, getSafeAreaStyle(isDark)]}
      >
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Feather name="chevron-left" size={28} color={getTextColor(isDark)} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, getNavTitleStyle(isDark)]}>Profile</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.heroCard, getHeroCardStyle(isDark)]}>
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatarCircle, getAvatarCircleStyle(isDark)]}>
                <Text style={[styles.avatarText, getAvatarTextStyle(isDark)]}>{initials}</Text>
              </View>
              <TactilePressable
                style={[styles.cameraBadge, getCameraBadgeStyle(isDark)]}
                onPress={handleEditDisabled}
                activeScale={0.88}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Change photo disabled"
              >
                <Feather name="lock" size={10} color={isDark ? '#64748B' : '#94A3B8'} />
              </TactilePressable>
            </View>

            <View style={styles.heroTextCol}>
              <Text style={[styles.heroName, getHeroNameStyle(isDark)]}>{displayName}</Text>
              <Text style={[styles.heroSubtitle, getHeroSubtitleStyle(isDark)]}>
                Personal and contact details
              </Text>
            </View>
          </View>

          <View style={[styles.card, getCardStyle(isDark)]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={[styles.headerIconBox, getHeaderIconBoxStyle(isDark)]}>
                  <Feather name="user" size={18} color={isDark ? '#60A5FA' : '#2563EB'} />
                </View>
                <Text style={[styles.cardTitle, getCardTitleStyle(isDark)]}>
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

            <View style={[styles.cardDivider, getCardDividerStyle(isDark)]} />

            <View style={styles.twoColumnRow}>
              <View style={styles.columnHalf}>
                <Text style={[styles.fieldLabel, getFieldLabelStyle(isDark)]}>First name</Text>
                <Text style={[styles.fieldValueBold, getFieldValueBoldStyle(isDark)]}>
                  {firstName}
                </Text>
              </View>
              <View style={[styles.verticalDivider, getVerticalDividerStyle(isDark)]} />
              <View style={styles.columnHalf}>
                <Text style={[styles.fieldLabel, getFieldLabelStyle(isDark)]}>Last name</Text>
                <Text style={[styles.fieldValueBold, getFieldValueBoldStyle(isDark)]}>
                  {lastName}
                </Text>
              </View>
            </View>

            <View style={[styles.cardDivider, getCardDividerStyle(isDark)]} />

            <View style={styles.middleNameSection}>
              <Text style={[styles.fieldLabel, getFieldLabelStyle(isDark)]}>Middle name</Text>
              {middleName ? (
                <Text style={[styles.fieldValueBold, getFieldValueBoldStyle(isDark)]}>
                  {middleName}
                </Text>
              ) : (
                <TouchableOpacity onPress={handleEditDisabled} activeOpacity={0.7}>
                  <Text style={[styles.notSetText, getNotSetTextStyle(isDark)]}>Not specified</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.subCardsRow}>
              <TouchableOpacity
                style={[styles.subCard, getSubCardStyle(isDark)]}
                onPress={handleEditDisabled}
                activeOpacity={0.7}
              >
                <View style={[styles.subCardIconBox, getSubCardIconBoxStyle(isDark)]}>
                  <Feather name="calendar" size={16} color={isDark ? '#60A5FA' : '#2563EB'} />
                </View>
                <View style={styles.subCardTextCol}>
                  <Text style={[styles.subCardLabel, getSubCardLabelStyle(isDark)]}>
                    Date of birth
                  </Text>
                  <Text style={getSubCardActionTextStyle(isDark, Boolean(dob))}>
                    {dob || 'Not set'}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.subCard, getSubCardStyle(isDark)]}
                onPress={handleEditDisabled}
                activeOpacity={0.7}
              >
                <View style={[styles.subCardIconBox, getSubCardIconBoxStyle(isDark)]}>
                  <Feather name="user" size={16} color={isDark ? '#60A5FA' : '#2563EB'} />
                </View>
                <View style={styles.subCardTextCol}>
                  <Text style={[styles.subCardLabel, getSubCardLabelStyle(isDark)]}>Gender</Text>
                  <Text style={getSubCardActionTextStyle(isDark, Boolean(gender))}>
                    {gender || 'Not set'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.card, getCardStyle(isDark)]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={[styles.headerIconBox, getHeaderIconBoxStyle(isDark)]}>
                  <Feather name="mail" size={18} color={isDark ? '#60A5FA' : '#2563EB'} />
                </View>
                <Text style={[styles.cardTitle, getCardTitleStyle(isDark)]}>
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

            <View style={[styles.cardDivider, getCardDividerStyle(isDark)]} />

            <View style={styles.contactRow}>
              <View style={[styles.rowIconBox, getRowIconBoxStyle(isDark)]}>
                <Feather name="mail" size={16} color={isDark ? '#60A5FA' : '#2563EB'} />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.fieldLabel, getFieldLabelStyle(isDark)]}>Work email</Text>
                <Text style={[styles.fieldValueContact, getFieldValueContactStyle(isDark)]}>
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

            <View style={[styles.cardDivider, getCardDividerStyle(isDark)]} />

            <View style={styles.contactRow}>
              <View style={[styles.rowIconBox, getRowIconBoxStyle(isDark)]}>
                <Feather name="phone" size={16} color={isDark ? '#60A5FA' : '#2563EB'} />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.fieldLabel, getFieldLabelStyle(isDark)]}>
                  Primary phone
                </Text>
                <Text style={[styles.fieldValueContact, getFieldValueContactStyle(isDark)]}>
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

            <View style={[styles.cardDivider, getCardDividerStyle(isDark)]} />

            <View style={[styles.subContainerRow, getSubContainerRowStyle(isDark)]}>
              <TouchableOpacity
                style={styles.subContainerHalf}
                onPress={handleEditDisabled}
                activeOpacity={0.7}
              >
                <Text style={[styles.subCardLabel, getSubCardLabelStyle(isDark)]}>
                  Other email
                </Text>
                <Text style={getSubCardActionTextStyle(isDark, Boolean(otherEmail))}>
                  {otherEmail || 'Not set'}
                </Text>
              </TouchableOpacity>
              <View style={[styles.verticalDividerSub, getVerticalDividerSubStyle(isDark)]} />
              <TouchableOpacity
                style={styles.subContainerHalf}
                onPress={handleEditDisabled}
                activeOpacity={0.7}
              >
                <Text style={[styles.subCardLabel, getSubCardLabelStyle(isDark)]}>
                  Other phone
                </Text>
                <Text style={getSubCardActionTextStyle(isDark, Boolean(otherPhone))}>
                  {otherPhone || 'Not set'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.card, getCardStyle(isDark)]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={[styles.headerIconBox, getHeaderIconBoxStyle(isDark)]}>
                  <Feather name="map-pin" size={18} color={isDark ? '#60A5FA' : '#2563EB'} />
                </View>
                <Text style={[styles.cardTitle, getCardTitleStyle(isDark)]}>Address</Text>
              </View>
            </View>

            <View style={[styles.cardDivider, getCardDividerStyle(isDark)]} />

            <View style={styles.addressBody}>
              <View style={styles.addressIllustrationWrapper}>
                <Image
                  source={require('../../../../../assets/images/address_illustration.png')}
                  style={styles.addressIllustration}
                  contentFit="contain"
                />
              </View>

              <View style={[styles.addressVerticalDivider, getAddressVerticalDividerStyle(isDark)]} />

              <View style={styles.addressContent}>
                <Text style={[styles.addressEmptyTitle, getAddressEmptyTitleStyle(isDark)]}>
                  {address ? 'Current address' : 'No address added'}
                </Text>
                <Text style={[styles.addressEmptySubtitle, getAddressEmptySubtitleStyle(isDark)]}>
                  {address || 'Add your street, city and postal code'}
                </Text>
                <TouchableOpacity
                  style={[styles.addAddressBtn, getAddAddressBtnStyle(isDark)]}
                  onPress={handleOpenAddressModal}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.addAddressBtnText, getAddAddressBtnTextStyle(isDark)]}>
                    {address ? 'Edit address' : '+ Add address'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TactilePressable
            style={getBottomEditBtnStyle(isDark)}
            onPress={handleEditDisabled}
            activeScale={1}
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
            accessibilityLabel="Edit Profile disabled"
          >
            <Feather name="lock" size={16} color={isDark ? '#64748B' : '#94A3B8'} />
            <Text style={getBottomEditBtnTextStyle(isDark)}>
              Edit Profile (Disabled)
            </Text>
          </TactilePressable>
        </ScrollView>

        <AddressBottomSheet
          isOpen={isAddressModalOpen}
          onClose={handleCloseAddressModal}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

export default ProfileScreen;
