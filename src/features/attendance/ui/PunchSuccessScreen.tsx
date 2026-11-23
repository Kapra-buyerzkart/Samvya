import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { KeyboardAvoidingScrollView } from '@/shared/components';
import { FontFamily, useAppTheme } from '@/shared/theme';

export interface PunchSuccessScreenProps {
  type?: 'punch-in' | 'punch-out';
  timestamp?: number;
  shiftText?: string;
  onDismiss?: () => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function PunchSuccessScreen({
  type = 'punch-out',
  timestamp,
  shiftText = '09:00 – 18:00',
  onDismiss,
}: PunchSuccessScreenProps): React.JSX.Element {
  const theme = useAppTheme();
  const isDark = theme.isDark;
  const insets = useSafeAreaInsets();

  const [countdown, setCountdown] = useState(5);
  const onDismissRef = React.useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  const handleGoHome = (): void => {
    if (onDismissRef.current) {
      onDismissRef.current();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)');
    }
  };

  // 5-second auto-returning countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGoHome();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time and date
  const dateObj = timestamp ? new Date(timestamp) : new Date();
  const rawHours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const period = rawHours >= 12 ? 'PM' : 'AM';
  const hours12 = String(rawHours % 12 || 12).padStart(2, '0');
  const formattedTime = `${hours12}:${minutes}`;

  const dayName = WEEKDAYS[dateObj.getDay()];
  const dayNum = dateObj.getDate();
  const monthName = MONTHS[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  const formattedDate = `${dayName}, ${dayNum} ${monthName} ${year}`;

  const isPunchIn = type === 'punch-in';
  const title = isPunchIn ? 'Punch-in Successful.' : 'Punch-out Successful.';
  const subtitle = isPunchIn
    ? 'Have a productive and focused workday ahead.'
    : 'Have a productive and focused workday ahead.';

  return (
    <View
      style={[
        styles.safeArea,
        {
          backgroundColor: isDark ? '#020617' : '#FFFFFF',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <KeyboardAvoidingScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Header */}
        <View
          style={[
            styles.headerRow,
            { borderBottomColor: isDark ? '#1E293B' : '#F1F5F9' },
          ]}
        >
          <TouchableOpacity
            onPress={handleGoHome}
            style={styles.backButton}
            activeOpacity={0.7}
            testID="punch-success-back-btn"
            accessibilityLabel="Back"
          >
            <Feather
              name="arrow-left"
              size={22}
              color={isDark ? '#F8FAFC' : '#0F172A'}
            />
            <Text
              style={[
                styles.headerTitle,
                { color: isDark ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              Punch Verification
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Body */}
        <View style={styles.contentBody}>
          {/* Concentric Circle Graphic */}
          <View style={styles.graphicContainer} testID="success-check-graphic">
            <View
              style={[
                styles.outerDashedCircle,
                { borderColor: isDark ? '#38BDF8' : '#93C5FD' },
              ]}
            >
              <View
                style={[
                  styles.middleRing,
                  {
                    borderColor: isDark ? '#1E293B' : '#DBEAFE',
                    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                  },
                ]}
              >
                <View
                  style={[
                    styles.innerHalo,
                    { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
                  ]}
                >
                  <View style={styles.centerCircle}>
                    <Feather name="check" size={32} color="#FFFFFF" />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Recorded On Time Pill Badge */}
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                borderColor: isDark ? '#3B82F6' : '#DBEAFE',
              },
            ]}
          >
            <View style={styles.statusDot} />
            <Text style={styles.statusBadgeText}>RECORDED ON TIME</Text>
          </View>

          {/* Heading */}
          <Text
            style={[
              styles.titleText,
              { color: isDark ? '#F8FAFC' : '#0F172A' },
            ]}
            testID="punch-success-title"
          >
            {title}
          </Text>

          {/* Subtitle */}
          <Text style={styles.subtitleText}>{subtitle}</Text>

          {/* Time Logged Card */}
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: isDark ? '#334155' : '#DBEAFE',
              },
            ]}
          >
            <Text style={styles.timeLoggedLabel}>TIME LOGGED</Text>
            <View style={styles.timeRow}>
              <Text
                style={[
                  styles.timeDigits,
                  { color: isDark ? '#F8FAFC' : '#0F172A' },
                ]}
                testID="punch-time-digits"
              >
                {formattedTime}
              </Text>
              <Text style={styles.timePeriod}>{period}</Text>
            </View>

            {/* Divider Line */}
            <View
              style={[
                styles.cardHorizontalDivider,
                { backgroundColor: isDark ? '#334155' : '#F1F5F9' },
              ]}
            />

            {/* Meta Row: Date & Shift */}
            <View style={styles.cardMetaRow}>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>DATE</Text>
                <Text
                  style={[
                    styles.metaValue,
                    { color: isDark ? '#F8FAFC' : '#0F172A' },
                  ]}
                  testID="punch-date-val"
                >
                  {formattedDate}
                </Text>
              </View>

              <View
                style={[
                  styles.cardVerticalDivider,
                  { backgroundColor: isDark ? '#334155' : '#F1F5F9' },
                ]}
              />

              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>SHIFT</Text>
                <Text
                  style={[
                    styles.metaValue,
                    { color: isDark ? '#F8FAFC' : '#0F172A' },
                  ]}
                  testID="punch-shift-val"
                >
                  {shiftText}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Button & Countdown Footer */}
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleGoHome}
            activeOpacity={0.8}
            testID="go-to-home-btn"
          >
            <Text style={styles.homeButtonText}>Go to home page</Text>
            <Feather name="arrow-right" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.countdownRow}>
            <Feather name="clock" size={13} color="#64748B" />
            <Text style={styles.countdownText}>
              Auto-returning in{' '}
              <Text
                style={[
                  styles.countdownBold,
                  { color: isDark ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                {countdown}s
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    marginLeft: 10,
  },
  contentBody: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  graphicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    marginTop: 4,
  },
  outerDashedCircle: {
    width: 126,
    height: 126,
    borderRadius: 63,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerHalo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginRight: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.8,
  },
  titleText: {
    fontSize: 26,
    fontFamily: FontFamily.bold,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
    marginBottom: 16,
  },
  summaryCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1.5,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  timeLoggedLabel: {
    fontSize: 12,
    letterSpacing: 1.2,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  timeDigits: {
    fontSize: 40,
    fontFamily: FontFamily.bold,
    fontWeight: '800',
    lineHeight: 46,
  },
  timePeriod: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    color: '#2563EB',
    marginLeft: 6,
    marginBottom: 6,
  },
  cardHorizontalDivider: {
    height: 1,
    marginVertical: 14,
    marginHorizontal: -18,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    letterSpacing: 0.8,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
  },
  cardVerticalDivider: {
    width: 1,
    height: 36,
    marginHorizontal: 14,
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  homeButton: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  homeButtonText: {
    fontSize: 16,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  countdownText: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
    color: '#64748B',
    marginLeft: 6,
  },
  countdownBold: {
    fontWeight: '700',
  },
});
