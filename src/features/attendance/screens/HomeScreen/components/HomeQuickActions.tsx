import { TactilePressable } from '@/shared/animations';
import { FontFamily } from '@/shared/theme';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface HomeQuickActionsProps {
  isDark: boolean;
  onApplyLeave: () => void;
  onTimeSheet: () => void;
  onPayslip: () => void;
  onTeam: () => void;
}

interface QuickActionConfig {
  key: 'apply-leave' | 'time-sheet' | 'payslip' | 'team';
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  lightBg: string;
  darkBg: string;
  lightIcon: string;
  darkIcon: string;
  testID: string;
}

const QUICK_ACTION_ITEMS: QuickActionConfig[] = [
  {
    key: 'apply-leave',
    label: 'Apply Leave',
    icon: 'calendar',
    lightBg: '#D8E2FE',
    darkBg: 'rgba(37, 99, 235, 0.25)',
    lightIcon: '#1D4ED8',
    darkIcon: '#60A5FA',
    testID: 'quick-action-apply-leave',
  },
  {
    key: 'time-sheet',
    label: 'Time sheet',
    icon: 'clock',
    lightBg: '#FFE5C4',
    darkBg: 'rgba(217, 119, 6, 0.25)',
    lightIcon: '#D97706',
    darkIcon: '#FBBF24',
    testID: 'quick-action-time-sheet',
  },
  {
    key: 'payslip',
    label: 'Payslip',
    icon: 'file-text',
    lightBg: '#CEF9D8',
    darkBg: 'rgba(16, 185, 129, 0.22)',
    lightIcon: '#059669',
    darkIcon: '#34D399',
    testID: 'quick-action-payslip',
  },
  {
    key: 'team',
    label: 'Team',
    icon: 'users',
    lightBg: '#E3D5FD',
    darkBg: 'rgba(124, 58, 237, 0.25)',
    lightIcon: '#7C3AED',
    darkIcon: '#A78BFA',
    testID: 'quick-action-team',
  },
];

export function HomeQuickActions({
  isDark,
  onApplyLeave,
  onTimeSheet,
  onPayslip,
  onTeam,
}: HomeQuickActionsProps): React.JSX.Element {
  const actionHandlers: Record<QuickActionConfig['key'], () => void> = {
    'apply-leave': onApplyLeave,
    'time-sheet': onTimeSheet,
    payslip: onPayslip,
    team: onTeam,
  };

  return (
    <View style={styles.row} testID="home-quick-actions">
      {QUICK_ACTION_ITEMS.map((item) => (
        <TactilePressable
          key={item.key}
          style={[
            styles.card,
            {
              backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
              borderColor: isDark ? '#1E293B' : '#E7EEFC',
            },
          ]}
          onPress={actionHandlers[item.key]}
          activeScale={0.96}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          testID={item.testID}
        >
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: isDark ? item.darkBg : item.lightBg },
            ]}
          >
            <Feather
              name={item.icon}
              size={18}
              color={isDark ? item.darkIcon : item.lightIcon}
            />
          </View>
          <Text
            style={[
              styles.label,
              { color: isDark ? '#E2E8F0' : '#0F172A' },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {item.label}
          </Text>
        </TactilePressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: 11.5,
    textAlign: 'center',
  },
});
