import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ModalBottomSheet,
  type ModalDetent,
  type SurfaceStyle,
} from '@swmansion/react-native-bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { FontFamily, useAppTheme } from '@/shared/theme';
import { AppKeyboardAvoidingView } from '@/shared/components';
import { useAuthStore } from '@/features/auth/model/authStore';

export interface AddressBottomSheetProps {
  /** Whether the bottom sheet is open */
  isOpen: boolean;
  /** Callback fired when sheet dismissal is requested */
  onClose: () => void;
  /** Optional callback fired after address is saved successfully */
  onSaved?: (formattedAddress: string) => void;
  /** Initial address line 1 */
  initialLine1?: string;
  /** Initial address line 2 */
  initialLine2?: string;
  /** Initial city */
  initialCity?: string;
  /** Initial state */
  initialState?: string;
  /** Initial country */
  initialCountry?: string;
  /** Initial postal code */
  initialPostalCode?: string;
}

const COMMON_COUNTRIES = [
  'India',
  'United States',
  'United Kingdom',
  'United Arab Emirates',
  'Canada',
  'Australia',
  'Singapore',
  'Germany',
  'Saudi Arabia',
  'Other',
];

const COMMON_STATES = [
  'Karnataka',
  'Maharashtra',
  'Delhi',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Gujarat',
  'Kerala',
  'Haryana',
  'West Bengal',
  'Rajasthan',
  'Punjab',
  'Andhra Pradesh',
  'Madhya Pradesh',
  'Bihar',
  'Other',
];

function AddressFormInner({
  onClose,
  onSaved,
  initialLine1,
  initialLine2,
  initialCity,
  initialState,
  initialCountry,
  initialPostalCode,
}: Omit<AddressBottomSheetProps, 'isOpen'>): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const isDark = theme.isDark;
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  // Form states initialized with fallback to user's saved profile values
  const [line1, setLine1] = useState(initialLine1 ?? user?.addressLine1 ?? '');
  const [line2, setLine2] = useState(initialLine2 ?? user?.addressLine2 ?? '');
  const [city, setCity] = useState(initialCity ?? user?.city ?? '');
  const [state, setState] = useState(initialState ?? user?.state ?? '');
  const [country, setCountry] = useState(initialCountry ?? user?.country ?? '');
  const [postalCode, setPostalCode] = useState(
    initialPostalCode ?? user?.postalCode ?? '',
  );

  // Validation error flags
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  // Inline dropdown state
  const [activeDropdown, setActiveDropdown] = useState<'state' | 'country' | null>(null);
  const [dropdownSearch, setDropdownSearch] = useState('');

  const handleSave = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!line1.trim()) newErrors.line1 = true;
    if (!city.trim()) newErrors.city = true;
    if (!state.trim()) newErrors.state = true;
    if (!country.trim()) newErrors.country = true;
    if (!postalCode.trim()) newErrors.postalCode = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert(
        'Missing Fields',
        'Please fill in all required fields marked with *.',
      );
      return;
    }

    // Format display address
    const addressParts: string[] = [];
    if (line1.trim()) addressParts.push(line1.trim());
    if (line2.trim()) addressParts.push(line2.trim());

    const cityStatePostal = [city.trim(), state.trim(), postalCode.trim()]
      .filter(Boolean)
      .join(', ');
    if (cityStatePostal) addressParts.push(cityStatePostal);
    if (country.trim()) addressParts.push(country.trim());

    const formattedAddress = addressParts.join('\n');

    // Persist to user store
    updateProfile({
      address: formattedAddress,
      addressLine1: line1.trim(),
      addressLine2: line2.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country.trim(),
      postalCode: postalCode.trim(),
    });

    onSaved?.(formattedAddress);
    onClose();
  };

  const filteredStates = COMMON_STATES.filter((item) =>
    item.toLowerCase().includes(dropdownSearch.trim().toLowerCase()),
  );

  const filteredCountries = COMMON_COUNTRIES.filter((item) =>
    item.toLowerCase().includes(dropdownSearch.trim().toLowerCase()),
  );

  return (
    <AppKeyboardAvoidingView style={[styles.container, isDark && { backgroundColor: '#0F172A' }]}>
      {/* Top Center Drag Handle */}
      <View style={styles.handleWrapper} pointerEvents="none">
        <View style={[styles.handleBar, isDark && { backgroundColor: '#334155' }]} />
      </View>

      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, isDark && { backgroundColor: '#1E293B' }]}>
            <Feather name="map-pin" size={20} color={isDark ? '#60A5FA' : '#2563EB'} />
          </View>
          <View style={styles.headerTextCol}>
            <Text style={[styles.title, isDark && { color: '#F8FAFC' }]}>Add address</Text>
            <Text style={[styles.subtitle, isDark && { color: '#94A3B8' }]}>Enter your address details</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={[styles.closeBtn, isDark && { backgroundColor: '#1E293B' }]}
          accessibilityRole="button"
          accessibilityLabel="Close"
          activeOpacity={0.7}
        >
          <Feather name="x" size={18} color={isDark ? '#94A3B8' : '#64748B'} />
        </TouchableOpacity>
      </View>

      {/* Form Scroll Area */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Field 1: Address line 1* */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, isDark && { color: '#E2E8F0' }]}>Address line 1*</Text>
          <TextInput
            style={[
              styles.input,
              isDark && { backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' },
              errors.line1 && styles.inputError,
            ]}
            value={line1}
            onChangeText={(text) => {
              setLine1(text);
              if (errors.line1) {
                setErrors((prev) => ({ ...prev, line1: false }));
              }
            }}
            placeholder="House / flat number, building, street"
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
          />
        </View>

        {/* Field 2: Address line 2 (optional) */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, isDark && { color: '#E2E8F0' }]}>Address line 2 (optional)</Text>
          <TextInput
            style={[
              styles.input,
              isDark && { backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' },
            ]}
            value={line2}
            onChangeText={setLine2}
            placeholder="Area, landmark"
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
          />
        </View>

        {/* Field 3: City* */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, isDark && { color: '#E2E8F0' }]}>City*</Text>
          <TextInput
            style={[
              styles.input,
              isDark && { backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' },
              errors.city && styles.inputError,
            ]}
            value={city}
            onChangeText={(text) => {
              setCity(text);
              if (errors.city) {
                setErrors((prev) => ({ ...prev, city: false }));
              }
            }}
            placeholder="Enter city"
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
          />
        </View>

        {/* Field 4: State* */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, isDark && { color: '#E2E8F0' }]}>State*</Text>
          <TouchableOpacity
            testID="state-selector"
            style={[
              styles.selectorBox,
              isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
              errors.state && styles.inputError,
              activeDropdown === 'state' && styles.selectorBoxActive,
            ]}
            onPress={() => {
              setDropdownSearch('');
              setActiveDropdown(activeDropdown === 'state' ? null : 'state');
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.selectorText,
                isDark && { color: '#F8FAFC' },
                !state && styles.selectorPlaceholder,
              ]}
              numberOfLines={1}
            >
              {state || 'Select state'}
            </Text>
            <Feather
              name={activeDropdown === 'state' ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={isDark ? '#60A5FA' : '#2563EB'}
            />
          </TouchableOpacity>

          {activeDropdown === 'state' && (
            <View style={[styles.dropdownContainer, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
              <TextInput
                style={[
                  styles.dropdownSearchInput,
                  isDark && { backgroundColor: '#0F172A', borderColor: '#334155', color: '#F8FAFC' },
                ]}
                value={dropdownSearch}
                onChangeText={setDropdownSearch}
                placeholder="Search state..."
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              />
              <ScrollView
                style={styles.dropdownList}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
              >
                {filteredStates.map((s) => (
                  <TouchableOpacity
                    key={s}
                    testID={`state-item-${s}`}
                    style={[
                      styles.dropdownItem,
                      state === s && (isDark ? { backgroundColor: '#1E3A8A' } : styles.dropdownItemActive),
                    ]}
                    onPress={() => {
                      setState(s);
                      if (errors.state) {
                        setErrors((prev) => ({ ...prev, state: false }));
                      }
                      setActiveDropdown(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        isDark && { color: '#F8FAFC' },
                        state === s && (isDark ? { color: '#60A5FA' } : styles.dropdownItemTextActive),
                      ]}
                    >
                      {s}
                    </Text>
                    {state === s && (
                      <Feather name="check" size={16} color={isDark ? '#60A5FA' : '#2563EB'} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Field 5: Country* */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, isDark && { color: '#E2E8F0' }]}>Country*</Text>
          <TouchableOpacity
            testID="country-selector"
            style={[
              styles.selectorBox,
              isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
              errors.country && styles.inputError,
              activeDropdown === 'country' && styles.selectorBoxActive,
            ]}
            onPress={() => {
              setDropdownSearch('');
              setActiveDropdown(
                activeDropdown === 'country' ? null : 'country',
              );
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.selectorText,
                isDark && { color: '#F8FAFC' },
                !country && styles.selectorPlaceholder,
              ]}
              numberOfLines={1}
            >
              {country || 'Select country'}
            </Text>
            <Feather
              name={activeDropdown === 'country' ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={isDark ? '#60A5FA' : '#2563EB'}
            />
          </TouchableOpacity>

          {activeDropdown === 'country' && (
            <View style={[styles.dropdownContainer, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
              <TextInput
                style={[
                  styles.dropdownSearchInput,
                  isDark && { backgroundColor: '#0F172A', borderColor: '#334155', color: '#F8FAFC' },
                ]}
                value={dropdownSearch}
                onChangeText={setDropdownSearch}
                placeholder="Search country..."
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              />
              <ScrollView
                style={styles.dropdownList}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
              >
                {filteredCountries.map((c) => (
                  <TouchableOpacity
                    key={c}
                    testID={`country-item-${c}`}
                    style={[
                      styles.dropdownItem,
                      country === c && (isDark ? { backgroundColor: '#1E3A8A' } : styles.dropdownItemActive),
                    ]}
                    onPress={() => {
                      setCountry(c);
                      if (errors.country) {
                        setErrors((prev) => ({ ...prev, country: false }));
                      }
                      setActiveDropdown(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        isDark && { color: '#F8FAFC' },
                        country === c && (isDark ? { color: '#60A5FA' } : styles.dropdownItemTextActive),
                      ]}
                    >
                      {c}
                    </Text>
                    {country === c && (
                      <Feather name="check" size={16} color={isDark ? '#60A5FA' : '#2563EB'} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Field 6: Postal code* */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, isDark && { color: '#E2E8F0' }]}>Postal code*</Text>
          <TextInput
            style={[
              styles.input,
              isDark && { backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' },
              errors.postalCode && styles.inputError,
            ]}
            value={postalCode}
            onChangeText={(text) => {
              setPostalCode(text);
              if (errors.postalCode) {
                setErrors((prev) => ({ ...prev, postalCode: false }));
              }
            }}
            placeholder="Enter postal code"
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
            keyboardType="numeric"
          />
        </View>

        {/* Required notice */}
        <Text style={[styles.noticeText, isDark && { color: '#94A3B8' }]}>Required fields are marked with *.</Text>

        {/* Actions: Cancel & Save address */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.cancelBtn, isDark && { backgroundColor: '#1E293B', borderColor: '#3B82F6' }]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.cancelBtnText, isDark && { color: '#60A5FA' }]}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveBtnText}>Save address</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppKeyboardAvoidingView>
  );
}

export function AddressBottomSheet({
  isOpen,
  ...props
}: AddressBottomSheetProps): React.JSX.Element {
  const theme = useAppTheme();
  const surfaceStyle: SurfaceStyle = {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderCurve: 'continuous',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  };

  const detents: ModalDetent[] = [0, '92%'];

  return (
    <ModalBottomSheet
      index={isOpen ? 1 : 0}
      detents={detents}
      scrimColor="rgba(15, 23, 42, 0.45)"
      scrimAccessibilityLabel="Close address modal"
      lazy
      surfaceStyle={surfaceStyle}
      surface={
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: theme.isDark ? '#0F172A' : '#FFFFFF' },
          ]}
        />
      }
      onCloseRequest={props.onClose}
      onIndexChange={(idx) => {
        if (idx === 0) {
          props.onClose();
        }
      }}
    >
      {isOpen ? <AddressFormInner key="address-form-open" {...props} /> : <View />}
    </ModalBottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  handleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 6,
  },
  handleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#BFDBFE',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13.5,
    color: '#0F172A',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: '#0F172A',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  selectorBox: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorBoxActive: {
    borderColor: '#2563EB',
  },
  selectorText: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: '#0F172A',
    flex: 1,
  },
  selectorPlaceholder: {
    color: '#94A3B8',
  },
  // Inline dropdown styles
  dropdownContainer: {
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    padding: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  dropdownSearchInput: {
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    fontSize: 13.5,
    fontFamily: FontFamily.regular,
    color: '#0F172A',
    marginBottom: 6,
  },
  dropdownList: {
    maxHeight: 180,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  dropdownItemActive: {
    backgroundColor: '#EFF6FF',
  },
  dropdownItemText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: '#0F172A',
  },
  dropdownItemTextActive: {
    fontFamily: FontFamily.semiBold,
    color: '#2563EB',
  },
  noticeText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 18,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: '#2563EB',
  },
  saveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
});
