import React from 'react';
import {
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
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/shared/theme';
import { AppKeyboardAvoidingView } from '@/shared/components';
import {
  getCancelBtnStyle,
  getCancelBtnTextStyle,
  getCloseBtnStyle,
  getContainerStyle,
  getDropdownContainerStyle,
  getDropdownItemStyle,
  getDropdownItemTextStyle,
  getDropdownSearchInputStyle,
  getHandleBarStyle,
  getIconBoxStyle,
  getInputStyle,
  getLabelStyle,
  getNoticeTextStyle,
  getSelectorBoxStyle,
  getSelectorTextStyle,
  getSubtitleStyle,
  getTitleStyle,
  styles,
} from './AddressBottomSheet.styles';
import { type AddressBottomSheetProps, useAddressBottomSheet } from './useAddressBottomSheet';

export type { AddressBottomSheetProps };

function AddressFormInner(props: Omit<AddressBottomSheetProps, 'isOpen'>): React.JSX.Element {
  const { onClose } = props;
  const {
    insets,
    isDark,
    line1,
    line2,
    city,
    state,
    country,
    postalCode,
    errors,
    activeDropdown,
    dropdownSearch,
    filteredStates,
    filteredCountries,
    setLine2,
    setDropdownSearch,
    handleLine1Change,
    handleCityChange,
    handlePostalCodeChange,
    handleToggleDropdown,
    handleSelectState,
    handleSelectCountry,
    handleSave,
  } = useAddressBottomSheet(props);

  return (
    <AppKeyboardAvoidingView style={getContainerStyle(isDark)}>
      <View style={styles.handleWrapper} pointerEvents="none">
        <View style={getHandleBarStyle(isDark)} />
      </View>

      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={getIconBoxStyle(isDark)}>
            <Feather name="map-pin" size={20} color={isDark ? '#60A5FA' : '#2563EB'} />
          </View>
          <View style={styles.headerTextCol}>
            <Text style={getTitleStyle(isDark)}>Add address</Text>
            <Text style={getSubtitleStyle(isDark)}>Enter your address details</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={getCloseBtnStyle(isDark)}
          accessibilityRole="button"
          accessibilityLabel="Close"
          activeOpacity={0.7}
        >
          <Feather name="x" size={18} color={isDark ? '#94A3B8' : '#64748B'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.fieldGroup}>
          <Text style={getLabelStyle(isDark)}>Address line 1*</Text>
          <TextInput
            style={getInputStyle(isDark, errors.line1)}
            value={line1}
            onChangeText={handleLine1Change}
            placeholder="House / flat number, building, street"
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={getLabelStyle(isDark)}>Address line 2 (optional)</Text>
          <TextInput
            style={getInputStyle(isDark)}
            value={line2}
            onChangeText={setLine2}
            placeholder="Area, landmark"
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={getLabelStyle(isDark)}>City*</Text>
          <TextInput
            style={getInputStyle(isDark, errors.city)}
            value={city}
            onChangeText={handleCityChange}
            placeholder="Enter city"
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={getLabelStyle(isDark)}>State*</Text>
          <TouchableOpacity
            testID="state-selector"
            style={getSelectorBoxStyle(isDark, errors.state, activeDropdown === 'state')}
            onPress={() => handleToggleDropdown('state')}
            activeOpacity={0.7}
          >
            <Text style={getSelectorTextStyle(isDark, Boolean(state))} numberOfLines={1}>
              {state || 'Select state'}
            </Text>
            <Feather
              name={activeDropdown === 'state' ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={isDark ? '#60A5FA' : '#2563EB'}
            />
          </TouchableOpacity>

          {activeDropdown === 'state' && (
            <View style={getDropdownContainerStyle(isDark)}>
              <TextInput
                style={getDropdownSearchInputStyle(isDark)}
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
                    style={getDropdownItemStyle(isDark, state === s)}
                    onPress={() => handleSelectState(s)}
                  >
                    <Text style={getDropdownItemTextStyle(isDark, state === s)}>{s}</Text>
                    {state === s && (
                      <Feather name="check" size={16} color={isDark ? '#60A5FA' : '#2563EB'} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={getLabelStyle(isDark)}>Country*</Text>
          <TouchableOpacity
            testID="country-selector"
            style={getSelectorBoxStyle(isDark, errors.country, activeDropdown === 'country')}
            onPress={() => handleToggleDropdown('country')}
            activeOpacity={0.7}
          >
            <Text style={getSelectorTextStyle(isDark, Boolean(country))} numberOfLines={1}>
              {country || 'Select country'}
            </Text>
            <Feather
              name={activeDropdown === 'country' ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={isDark ? '#60A5FA' : '#2563EB'}
            />
          </TouchableOpacity>

          {activeDropdown === 'country' && (
            <View style={getDropdownContainerStyle(isDark)}>
              <TextInput
                style={getDropdownSearchInputStyle(isDark)}
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
                    style={getDropdownItemStyle(isDark, country === c)}
                    onPress={() => handleSelectCountry(c)}
                  >
                    <Text style={getDropdownItemTextStyle(isDark, country === c)}>{c}</Text>
                    {country === c && (
                      <Feather name="check" size={16} color={isDark ? '#60A5FA' : '#2563EB'} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={getLabelStyle(isDark)}>Postal code*</Text>
          <TextInput
            style={getInputStyle(isDark, errors.postalCode)}
            value={postalCode}
            onChangeText={handlePostalCodeChange}
            placeholder="Enter postal code"
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
            keyboardType="numeric"
          />
        </View>

        <Text style={getNoticeTextStyle(isDark)}>Required fields are marked with *.</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={getCancelBtnStyle(isDark)}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={getCancelBtnTextStyle(isDark)}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
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
