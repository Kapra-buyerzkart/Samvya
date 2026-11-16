import React, { useState } from 'react';
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
import { useAuthStore } from '@/features/auth';
import { FontFamily } from '@/shared/theme';

export function EditProfileScreen(): React.JSX.Element {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [name, setName] = useState(user?.name || 'Aarav Sharma');
  const [email, setEmail] = useState(user?.email || 'aarav.sharma@samavya.internal');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [department, setDepartment] = useState(user?.department || 'Field Operations');
  const [designation, setDesignation] = useState(user?.designation || 'Operations Specialist');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || '+91 91234 56789');
  const [location, setLocation] = useState(user?.location || 'Work from home');
  const [isSaving, setIsSaving] = useState(false);

  // Initials
  const initials = name
    .trim()
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AS';

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid work email address.');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Required', 'Please enter your mobile phone number.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        department: department.trim(),
        designation: designation.trim(),
        emergencyContact: emergencyContact.trim(),
        location: location.trim(),
      });
      setIsSaving(false);
      Alert.alert('Profile Updated', 'Your profile details have been successfully saved.', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    }, 400);
  };

  const handleChangePhoto = () => {
    Alert.alert('Change Profile Picture', 'Select photo source', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Take Photo', onPress: () => Alert.alert('Camera', 'Photo capture simulation.') },
      { text: 'Choose from Gallery', onPress: () => Alert.alert('Gallery', 'Image picker simulation.') },
    ]);
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
              <Text style={styles.navTitle}>Edit Profile</Text>
              <View style={styles.placeholderRight} />
            </View>

            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <TouchableOpacity
                  style={styles.cameraBtn}
                  onPress={handleChangePhoto}
                  activeOpacity={0.8}
                >
                  <Feather name="camera" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.7}>
                <Text style={styles.changePhotoText}>Change photo</Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.formCard}>
              {/* Full Name */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="user" size={18} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter full name"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Email Address */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="mail" size={18} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="name@samavya.internal"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Mobile Phone */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Mobile Phone</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="phone" size={18} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+91 98765 43210"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Department */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Department</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="briefcase" size={18} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={department}
                    onChangeText={setDepartment}
                    placeholder="Department"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              {/* Designation */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Designation / Role</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="award" size={18} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={designation}
                    onChangeText={setDesignation}
                    placeholder="e.g. Operations Specialist"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              {/* Emergency Contact */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Emergency Contact</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="shield" size={18} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={emergencyContact}
                    onChangeText={setEmergencyContact}
                    placeholder="+91 91234 56789"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Work Location */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Default Work Location</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="map-pin" size={18} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="e.g. Work from home / Head Office"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.85}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving Changes...' : 'Save Changes'}
              </Text>
              <Feather name="check" size={20} color="#FFFFFF" />
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#EFF6FF',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 32,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  cameraBtn: {
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
  changePhotoText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#1D4ED8',
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
  saveButton: {
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
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});

