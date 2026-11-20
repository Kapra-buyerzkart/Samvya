import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image, ImageSource } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, usePathname } from 'expo-router';
import { FontFamily, useAppTheme } from '@/shared/theme';

export type TabId = 'home' | 'history' | 'leave' | 'profile';

export interface TabItem {
  id: TabId;
  label: string;
  icon: ImageSource | number;
  testID: string;
}

export const TABS: TabItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: require('../../../assets/samagra/icons/home.png'),
    testID: 'tab-btn-home',
  },
  {
    id: 'history',
    label: 'History',
    icon: require('../../../assets/samagra/icons/history.png'),
    testID: 'tab-btn-history',
  },
  {
    id: 'leave',
    label: 'Leave',
    icon: require('../../../assets/samagra/icons/leave.png'),
    testID: 'tab-btn-leave',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: require('../../../assets/samagra/icons/profile.png'),
    testID: 'tab-btn-profile',
  },
];

export function BottomTabBar(): React.JSX.Element | null {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const theme = useAppTheme();
  const isDark = theme.isDark;

  // Determine active tab based on pathname
  const activeTab = useMemo<TabId>(() => {
    if (pathname.includes('/attendance/history')) return 'history';
    if (pathname.includes('/leave')) return 'leave';
    if (
      pathname.includes('/profile') ||
      pathname.includes('/employment') ||
      pathname.includes('/settings')
    ) {
      return 'profile';
    }
    return 'home';
  }, [pathname]);

  // Hide on modal / camera / full-screen flows
  const shouldHide = useMemo(() => {
    return (
      pathname.includes('attendance/face-verify') ||
      pathname.includes('attendance/manual-entry') ||
      pathname.includes('attendance/punch-success') ||
      pathname.includes('login') ||
      pathname.includes('consent')
    );
  }, [pathname]);

  if (shouldHide) {
    return null;
  }

  const handleTabPress = (tabId: TabId) => {
    if (activeTab === tabId) return;

    switch (tabId) {
      case 'home':
        router.replace('/(app)');
        break;
      case 'history':
        router.push('/(app)/attendance/history');
        break;
      case 'leave':
        router.push('/(app)/leave/request');
        break;
      case 'profile':
        router.push('/(app)/profile');
        break;
    }
  };

  return (
    <View
      style={[
        styles.dockContainer,
        {
          backgroundColor: isDark ? '#0B1120' : '#FFFFFF',
          borderTopColor: isDark ? '#1E293B' : '#E2E8F0',
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
      testID="bottom-tab-bar"
    >
      <View style={styles.tabsRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => handleTabPress(tab.id)}
              activeOpacity={0.7}
              testID={tab.testID}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${tab.label} tab`}
            >
              <View
                style={[
                  styles.iconPill,
                  isActive && {
                    backgroundColor: isDark
                      ? 'rgba(37, 99, 235, 0.2)'
                      : '#EFF6FF',
                  },
                ]}
              >
                <Image
                  source={tab.icon}
                  style={[
                    styles.tabIcon,
                    {
                      tintColor: isActive
                        ? '#2563EB'
                        : isDark
                          ? '#64748B'
                          : '#94A3B8',
                    },
                  ]}
                  contentFit="contain"
                />
              </View>

              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive
                      ? '#2563EB'
                      : isDark
                        ? '#64748B'
                        : '#94A3B8',
                    fontFamily: isActive ? FontFamily.bold : FontFamily.medium,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {tab.label}
              </Text>

              <View
                style={[
                  styles.activeDot,
                  {
                    backgroundColor: isActive ? '#2563EB' : 'transparent',
                  },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dockContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingTop: 8,
    paddingHorizontal: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconPill: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
