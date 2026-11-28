import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/features/auth';
import { useAppTheme } from '@/shared/theme';

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

export const COMMON_COUNTRIES = [
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

export const STATES_BY_COUNTRY: Record<string, string[]> = {
  India: [
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
  ],
  'United States': ['California', 'New York', 'Texas', 'Washington', 'Florida', 'Illinois', 'Other'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland', 'Other'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Other'],
  Canada: ['Ontario', 'British Columbia', 'Quebec', 'Alberta', 'Other'],
  Australia: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'Other'],
  Singapore: ['Central Region', 'East Region', 'North Region', 'North-East Region', 'West Region'],
  Germany: ['Bavaria', 'Berlin', 'Hamburg', 'Hesse', 'North Rhine-Westphalia', 'Other'],
  'Saudi Arabia': ['Riyadh', 'Makkah', 'Eastern Province', 'Madinah', 'Other'],
  Other: ['Other'],
};

export const COMMON_STATES = STATES_BY_COUNTRY.India;

export const SUBREGIONS_BY_STATE: Record<string, string[]> = {
  Karnataka: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi', 'Other'],
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Other'],
  Delhi: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Other'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Other'],
  Telangana: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Other'],
  'Uttar Pradesh': ['Noida', 'Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Other'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Other'],
  Kerala: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Other'],
  Haryana: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Other'],
  'West Bengal': ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur', 'Other'],
  Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Other'],
  Punjab: ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Other'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Other'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur', 'Other'],
  Bihar: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Other'],
  California: ['San Francisco', 'Los Angeles', 'San Diego', 'San Jose', 'Other'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Other'],
  Texas: ['Austin', 'Dallas', 'Houston', 'San Antonio', 'Other'],
  England: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Other'],
  Dubai: ['Downtown Dubai', 'Dubai Marina', 'Deira', 'Business Bay', 'Other'],
  Ontario: ['Toronto', 'Ottawa', 'Mississauga', 'Waterloo', 'Other'],
};

export function useAddressBottomSheet({
  onClose,
  onSaved,
  initialLine1,
  initialLine2,
  initialCity,
  initialState,
  initialCountry,
  initialPostalCode,
}: Omit<AddressBottomSheetProps, 'isOpen'>) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const isDark = theme.isDark;
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [line1, setLine1] = useState(initialLine1 ?? user?.addressLine1 ?? '');
  const [line2, setLine2] = useState(initialLine2 ?? user?.addressLine2 ?? '');
  const [city, setCity] = useState(initialCity ?? user?.city ?? '');
  const [state, setState] = useState(initialState ?? user?.state ?? '');
  const [country, setCountry] = useState(initialCountry ?? user?.country ?? '');
  const [postalCode, setPostalCode] = useState(initialPostalCode ?? user?.postalCode ?? '');
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [activeDropdown, setActiveDropdown] = useState<'state' | 'country' | 'city' | null>(null);
  const [dropdownSearch, setDropdownSearch] = useState('');

  const clearError = (key: string) => {
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleLine1Change = (text: string) => {
    setLine1(text);
    clearError('line1');
  };

  const handleCityChange = (text: string) => {
    setCity(text);
    clearError('city');
  };

  const handlePostalCodeChange = (text: string) => {
    setPostalCode(text);
    clearError('postalCode');
  };

  const handleToggleDropdown = (field: 'state' | 'country' | 'city') => {
    if (field === 'state' && !country) {
      Alert.alert('Select Country', 'Please select a country first.');
      return;
    }
    if (field === 'city' && !state) {
      Alert.alert('Select State', 'Please select a state first.');
      return;
    }
    setDropdownSearch('');
    setActiveDropdown(activeDropdown === field ? null : field);
  };

  const handleSelectState = (selectedState: string) => {
    if (selectedState !== state) {
      setCity('');
    }
    setState(selectedState);
    clearError('state');
    setActiveDropdown(null);
  };

  const handleSelectCity = (selectedCity: string) => {
    setCity(selectedCity === 'Other' ? '' : selectedCity);
    clearError('city');
    setActiveDropdown(null);
  };

  const handleSelectCountry = (selectedCountry: string) => {
    if (selectedCountry !== country) {
      setState('');
      setCity('');
    }
    setCountry(selectedCountry);
    clearError('country');
    setActiveDropdown(null);
  };

  const handleSave = () => {
    const newErrors: Record<string, boolean> = {};
    if (!line1.trim()) newErrors.line1 = true;
    if (!city.trim()) newErrors.city = true;
    if (!state.trim()) newErrors.state = true;
    if (!country.trim()) newErrors.country = true;
    if (!postalCode.trim()) newErrors.postalCode = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert('Missing Fields', 'Please fill in all required fields marked with *.');
      return;
    }

    const addressParts: string[] = [];
    if (line1.trim()) addressParts.push(line1.trim());
    if (line2.trim()) addressParts.push(line2.trim());

    const cityStatePostal = [city.trim(), state.trim(), postalCode.trim()]
      .filter(Boolean)
      .join(', ');
    if (cityStatePostal) addressParts.push(cityStatePostal);
    if (country.trim()) addressParts.push(country.trim());

    const formattedAddress = addressParts.join('\n');

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

  const filteredStates = useMemo(() => {
    if (!country) return [];
    const countryStates = STATES_BY_COUNTRY[country] ?? ['Other'];
    return countryStates.filter((item) =>
      item.toLowerCase().includes(dropdownSearch.trim().toLowerCase()),
    );
  }, [country, dropdownSearch]);

  const filteredSubregions = useMemo(() => {
    if (!state) return [];
    const list = SUBREGIONS_BY_STATE[state] ?? ['Other'];
    return list.filter((item) =>
      item.toLowerCase().includes(dropdownSearch.trim().toLowerCase()),
    );
  }, [state, dropdownSearch]);

  const filteredCountries = useMemo(
    () =>
      COMMON_COUNTRIES.filter((item) =>
        item.toLowerCase().includes(dropdownSearch.trim().toLowerCase()),
      ),
    [dropdownSearch],
  );

  return {
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
    filteredSubregions,
    filteredCountries,
    setLine2,
    setDropdownSearch,
    handleLine1Change,
    handleCityChange,
    handlePostalCodeChange,
    handleToggleDropdown,
    handleSelectState,
    handleSelectCity,
    handleSelectCountry,
    handleSave,
  };
}
