import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  distinctSourceBadge: {
    backgroundColor: '#78350F',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FDE68A',
    fontWeight: '700',
    fontSize: 11,
  },
  card: {
    padding: 16,
    backgroundColor: '#0F172A',
  },
  sectionTitle: {
    color: '#F8FAFC',
    marginBottom: 4,
  },
  hint: {
    color: '#94A3B8',
    marginBottom: 16,
  },
  originalFixBox: {
    backgroundColor: '#1E293B',
    padding: 8,
    borderRadius: 6,
    marginBottom: 16,
  },
  originalFixText: {
    color: '#CBD5E1',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#F8FAFC',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  textArea: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#F8FAFC',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    marginTop: 4,
  },
  mapVerifyButton: {
    marginBottom: 16,
  },
  photoSection: {
    marginBottom: 20,
  },
  photoAttachedBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    padding: 8,
    borderRadius: 6,
  },
  photoAttachedText: {
    color: '#A7F3D0',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
  loader: {
    marginTop: 12,
  },
});

export const getCardStyle = (isDark: boolean): ViewStyle[] => [
  styles.card,
  {
    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
    borderColor: isDark ? '#334155' : '#E2E8F0',
  },
];

export const getSectionTitleStyle = (isDark: boolean): TextStyle[] => [
  styles.sectionTitle,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

export const getHintStyle = (isDark: boolean): TextStyle[] => [
  styles.hint,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getOriginalFixBoxStyle = (isDark: boolean): ViewStyle[] => [
  styles.originalFixBox,
  { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
];

export const getOriginalFixTextStyle = (isDark: boolean): TextStyle[] => [
  styles.originalFixText,
  { color: isDark ? '#CBD5E1' : '#475569' },
];

export const getLabelStyle = (isDark: boolean): TextStyle[] => [
  styles.label,
  { color: isDark ? '#E2E8F0' : '#334155' },
];

export const getInputStyle = (isDark: boolean, hasError?: boolean): TextStyle[] => [
  styles.input,
  {
    backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
    borderColor: isDark ? '#334155' : '#CBD5E1',
    color: isDark ? '#F8FAFC' : '#0F172A',
  },
  ...(hasError ? [styles.inputError] : []),
];

export const getTextAreaStyle = (isDark: boolean, hasError?: boolean): TextStyle[] => [
  styles.textArea,
  {
    backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
    borderColor: isDark ? '#334155' : '#CBD5E1',
    color: isDark ? '#F8FAFC' : '#0F172A',
  },
  ...(hasError ? [styles.inputError] : []),
];

export const getPhotoAttachedBoxStyle = (isDark: boolean): ViewStyle[] => [
  styles.photoAttachedBox,
  { backgroundColor: isDark ? '#064E3B' : '#D1FAE5' },
];

export const getPhotoAttachedTextStyle = (isDark: boolean): TextStyle[] => [
  styles.photoAttachedText,
  { color: isDark ? '#A7F3D0' : '#065F46' },
];
