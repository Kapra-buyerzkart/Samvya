import { KeyboardAvoidingScrollView } from '@/shared/components';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  getCardDividerStyle,
  getCountdownBoldStyle,
  getHeaderRowStyle,
  getInnerHaloStyle,
  getMiddleRingStyle,
  getOuterDashedCircleStyle,
  getSafeAreaStyle,
  getStatusBadgeStyle,
  getSummaryCardStyle,
  getTextColor,
  getTextColorStyle,
  styles,
} from './PunchSuccessScreen.styles';
import { usePunchSuccessScreen, type PunchSuccessScreenProps } from './usePunchSuccessScreen';

export function PunchSuccessScreen(props: PunchSuccessScreenProps): React.JSX.Element {
  const {
    isDark,
    insets,
    countdown,
    handleGoHome,
    formattedTime,
    period,
    formattedDate,
    shiftText,
    title,
    subtitle,
  } = usePunchSuccessScreen(props);

  return (
    <View style={[styles.safeArea, getSafeAreaStyle(isDark, insets)]}>
      <KeyboardAvoidingScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={[styles.headerRow, getHeaderRowStyle(isDark)]}>
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
              color={getTextColor(isDark)}
            />
            <Text style={[styles.headerTitle, getTextColorStyle(isDark)]}>
              Punch Verification
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentBody}>
          <View style={styles.graphicContainer} testID="success-check-graphic">
            <View style={[styles.outerDashedCircle, getOuterDashedCircleStyle(isDark)]}>
              <View style={[styles.middleRing, getMiddleRingStyle(isDark)]}>
                <View style={[styles.innerHalo, getInnerHaloStyle(isDark)]}>
                  <View style={styles.centerCircle}>
                    <Feather name="check" size={32} color="#FFFFFF" />
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.statusBadge, getStatusBadgeStyle(isDark)]}>
            <View style={styles.statusDot} />
            <Text style={styles.statusBadgeText}>RECORDED ON TIME</Text>
          </View>

          <Text
            style={[styles.titleText, getTextColorStyle(isDark)]}
            testID="punch-success-title"
          >
            {title}
          </Text>

          <Text style={styles.subtitleText}>{subtitle}</Text>

          <View style={[styles.summaryCard, getSummaryCardStyle(isDark)]}>
            <Text style={styles.timeLoggedLabel}>TIME LOGGED</Text>
            <View style={styles.timeRow}>
              <Text
                style={[styles.timeDigits, getTextColorStyle(isDark)]}
                testID="punch-time-digits"
              >
                {formattedTime}
              </Text>
              <Text style={styles.timePeriod}>{period}</Text>
            </View>

            <View style={[styles.cardHorizontalDivider, getCardDividerStyle(isDark)]} />

            <View style={styles.cardMetaRow}>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>DATE</Text>
                <Text
                  style={[styles.metaValue, getTextColorStyle(isDark)]}
                  testID="punch-date-val"
                >
                  {formattedDate}
                </Text>
              </View>

              <View style={[styles.cardVerticalDivider, getCardDividerStyle(isDark)]} />

              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>SHIFT</Text>
                <Text
                  style={[styles.metaValue, getTextColorStyle(isDark)]}
                  testID="punch-shift-val"
                >
                  {shiftText}
                </Text>
              </View>
            </View>
          </View>
        </View>

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
              <Text style={[styles.countdownBold, getCountdownBoldStyle(isDark)]}>
                {countdown}s
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingScrollView>
    </View>
  );
}

export default PunchSuccessScreen;
