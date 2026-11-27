import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AppBottomSheet } from '@/shared/components';
import { FontFamily } from '@/shared/theme';
import { type EntityId, type OrganizationOption } from '../../../api/authApi';

export interface OrganizationPickerSheetProps {
  isOpen: boolean;
  organizations: OrganizationOption[];
  switchingTenantId: EntityId | null;
  isDark: boolean;
  onSelect: (tenantId: EntityId) => void;
  onClose: () => void;
}

export const OrganizationPickerSheet = React.memo(function OrganizationPickerSheet({
  isOpen,
  organizations,
  switchingTenantId,
  isDark,
  onSelect,
  onClose,
}: OrganizationPickerSheetProps): React.JSX.Element {
  return (
    <AppBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Select organization"
      testID="organization-picker-sheet"
    >
      <View style={styles.container}>
        <Text style={getSubtitleStyle(isDark)}>
          Your account belongs to multiple organizations. Choose one to continue.
        </Text>

        {organizations.length === 0 ? (
          <View style={getEmptyBoxStyle(isDark)}>
            <Text style={getEmptyTextStyle(isDark)}>
              No organizations available for this account.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {organizations.map((org) => {
              const isSelecting = switchingTenantId === org.tenantId;
              return (
                <TouchableOpacity
                  key={String(org.tenantId)}
                  style={getOrgItemStyle(isDark, isSelecting)}
                  onPress={() => onSelect(org.tenantId)}
                  disabled={switchingTenantId !== null}
                  activeOpacity={0.75}
                  testID={`org-option-${org.tenantId}`}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${org.name}`}
                >
                  <View style={getIconBoxStyle(isDark)}>
                    <Feather
                      name="briefcase"
                      size={18}
                      color={isDark ? '#60A5FA' : '#1D4ED8'}
                    />
                  </View>

                  <View style={styles.orgInfo}>
                    <Text style={getOrgNameStyle(isDark)} numberOfLines={1}>
                      {org.name}
                    </Text>
                    {org.role || org.code ? (
                      <Text style={getOrgMetaStyle(isDark)} numberOfLines={1}>
                        {[org.role, org.code].filter(Boolean).join(' · ')}
                      </Text>
                    ) : null}
                  </View>

                  {isSelecting ? (
                    <ActivityIndicator size="small" color={isDark ? '#60A5FA' : '#1D4ED8'} />
                  ) : (
                    <Feather
                      name="chevron-right"
                      size={18}
                      color={isDark ? '#94A3B8' : '#64748B'}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </AppBottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 14,
    paddingBottom: 8,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 13.5,
    lineHeight: 19,
  },
  list: {
    gap: 10,
  },
  orgItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgInfo: {
    flex: 1,
  },
  orgName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
  },
  orgMeta: {
    fontFamily: FontFamily.regular,
    fontSize: 12.5,
    marginTop: 2,
  },
  emptyBox: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: 13.5,
  },
});

const getSubtitleStyle = (isDark: boolean): TextStyle[] => [
  styles.subtitle,
  { color: isDark ? '#94A3B8' : '#475569' },
];

const getOrgItemStyle = (
  isDark: boolean,
  isSelecting: boolean,
): (ViewStyle | { backgroundColor: string; borderColor: string })[] => [
  styles.orgItem,
  {
    backgroundColor: isSelecting
      ? isDark
        ? '#1E3A5F'
        : '#EFF6FF'
      : isDark
        ? '#0F172A'
        : '#F8FAFC',
    borderColor: isSelecting
      ? '#2563EB'
      : isDark
        ? '#334155'
        : '#E2E8F0',
  },
];

const getIconBoxStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
  styles.iconBox,
  { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
];

const getOrgNameStyle = (isDark: boolean): TextStyle[] => [
  styles.orgName,
  { color: isDark ? '#F8FAFC' : '#0F172A' },
];

const getOrgMetaStyle = (isDark: boolean): TextStyle[] => [
  styles.orgMeta,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

const getEmptyBoxStyle = (
  isDark: boolean,
): (ViewStyle | { backgroundColor: string })[] => [
  styles.emptyBox,
  { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' },
];

const getEmptyTextStyle = (isDark: boolean): TextStyle[] => [
  styles.emptyText,
  { color: isDark ? '#94A3B8' : '#64748B' },
];
