import { usePersistentShiftTimer } from '@/features/attendance';
import {
  getActiveTrackingSession,
  startBackgroundTracking,
  startTrackingSession,
  stopBackgroundTracking,
  stopTrackingSession,
} from '@/features/location';
import { TactilePressable } from '@/shared/animations';
import {
  AppBottomSheet,
  CircularProgressDial,
  KeyboardAvoidingScrollView,
} from '@/shared/components';
import { FontFamily, useAppTheme } from '@/shared/theme';
import { Feather } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen(): React.JSX.Element {
  const timer = usePersistentShiftTimer();
  const theme = useAppTheme();
  const isDark = theme.isDark;

  const [showHoursModal, setShowHoursModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleToggleBreak = (): void => {
    if (!timer.isOnBreak) {
      timer.startBreak();
      Alert.alert('Break Started', 'You are now on break. Work timer is paused.');
    } else {
      timer.resumeWork();
      Alert.alert('Break Ended', 'Welcome back! Work timer has resumed.');
    }
  };

  const handlePunchOut = (): void => {
    Alert.alert(
      'Punch Out Verification',
      'Punch-out requires face verification and location check.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Quick Punch Out',
          style: 'destructive',
          onPress: async () => {
            timer.punchOut();
            stopTrackingSession();
            await stopBackgroundTracking();
            router.push({
              pathname: '/(app)/attendance/punch-success',
              params: { action: 'punch-out' },
            });
          },
        },
        {
          text: 'Verify Face & Location',
          onPress: () => {
            router.push({
              pathname: '/(app)/attendance/face-verify',
              params: { action: 'punch-out' },
            });
          },
        },
      ],
    );
  };

  const handlePunchIn = (): void => {
    Alert.alert(
      'Punch In Verification',
      'Punch-in requires face verification and location check.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Quick Punch In',
          onPress: async () => {
            try {
              timer.punchIn();
              const current = getActiveTrackingSession();
              if (!current || current.status !== 'tracking') {
                const newSession = startTrackingSession(
                  `sess_${Date.now()}`,
                  'usr_default_employee',
                );
                await startBackgroundTracking(newSession.sessionId, 'usr_default_employee');
              }
              router.push({
                pathname: '/(app)/attendance/punch-success',
                params: { action: 'punch-in' },
              });
            } catch {
              router.push({
                pathname: '/(app)/attendance/punch-success',
                params: { action: 'punch-in' },
              });
            }
          },
        },
        {
          text: 'Verify Face & Location',
          onPress: () => {
            router.push({
              pathname: '/(app)/attendance/face-verify',
              params: { action: 'punch-in' },
            });
          },
        },
      ],
    );
  };

  const handleRequestLeave = (): void => {
    router.push('/(app)/leave/request');
  };

  const handleViewLeaveHistory = (): void => {
    router.push('/(app)/leave/history');
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/background.png')}
      style={[styles.backgroundImage, { backgroundColor: isDark ? '#020617' : '#F8FAFC' }]}
      imageStyle={{ opacity: isDark ? 0.05 : 1 }}
      contentFit="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingScrollView
          contentContainerStyle={[styles.scrollContent, !timer.isPunchedOut && { paddingTop: 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Row: Brand and Date */}
          <View style={styles.headerRow}>
            <Text style={[styles.brandTitle, { color: isDark ? '#F8FAFC' : '#0F1E36' }]}>
              Samavya
            </Text>
            <Text style={[styles.headerDate, { color: isDark ? '#94A3B8' : '#1E293B' }]}>
              Thu 12 Nov 2026
            </Text>
          </View>

          {/* Top Dropdowns: Hours & Location */}
          <View style={styles.dropdownsRow}>
            {/* Hours Selector */}
            <TactilePressable
              style={[
                styles.dropdownCard,
                {
                  backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                  borderColor: isDark ? '#1E293B' : '#E2E8F0',
                },
              ]}
              onPress={() => setShowHoursModal(true)}
              activeScale={0.97}
              accessibilityRole="button"
              accessibilityLabel="Select Work Hours"
            >
              <View style={styles.dropdownIconContainer}>
                <Feather name="clock" size={20} color={isDark ? '#60A5FA' : '#0F172A'} />
              </View>
              <View style={styles.dropdownTextCol}>
                <Text style={[styles.dropdownLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Hours
                </Text>
                <Text style={[styles.dropdownValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  {timer.hoursType}
                </Text>
              </View>
              <Feather name="chevron-down" size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            </TactilePressable>

            {/* Location Selector */}
            <TactilePressable
              style={[
                styles.dropdownCard,
                {
                  backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                  borderColor: isDark ? '#1E293B' : '#E2E8F0',
                },
              ]}
              onPress={() => setShowLocationModal(true)}
              activeScale={0.97}
              accessibilityRole="button"
              accessibilityLabel="Select Work Location"
            >
              <View style={styles.dropdownIconContainer}>
                <Feather name="home" size={20} color={isDark ? '#60A5FA' : '#0F172A'} />
              </View>
              <View style={styles.dropdownTextCol}>
                <Text style={[styles.dropdownLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Location
                </Text>
                <Text
                  style={[styles.dropdownValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                  numberOfLines={1}
                >
                  {timer.workLocation}
                </Text>
              </View>
              <Feather name="chevron-down" size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            </TactilePressable>
          </View>

          {/* Shift Banner */}
          <View
            style={[
              styles.shiftBanner,
              {
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(238, 242, 255, 0.7)',
                borderColor: isDark ? '#334155' : '#D8B4FE',
              },
            ]}
          >
            <View style={styles.shiftLeft}>
              <Feather name="calendar" size={16} color={isDark ? '#94A3B8' : '#64748B'} />
              <Text style={[styles.shiftLabel, { color: isDark ? '#94A3B8' : '#475569' }]}>
                Shift
              </Text>
            </View>
            <View
              style={[styles.shiftDivider, { backgroundColor: isDark ? '#334155' : '#CBD5E1' }]}
            />
            <Text style={[styles.shiftTime, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              09:00 AM - 06 : 00 PM
            </Text>
          </View>

          {/* Working Status Indicator */}
          <View style={styles.statusIndicatorRow}>
            <Feather
              name={timer.isOnBreak ? 'coffee' : 'clock'}
              size={18}
              color={timer.isOnBreak ? '#D97706' : timer.isWorking ? '#2563EB' : '#64748B'}
            />
            <Text
              style={[
                styles.statusIndicatorText,
                { color: isDark ? '#F8FAFC' : '#0F172A' },
                timer.isOnBreak && styles.statusTextBreak,
                timer.isPunchedOut && styles.statusTextOff,
              ]}
            >
              {timer.isOnBreak ? 'On break' : timer.isWorking ? 'Working' : 'Off duty'}
            </Text>
          </View>

          {/* Circular Progress Hero Dial */}
          <View style={styles.dialWrapper}>
            <CircularProgressDial
              size={220}
              strokeWidth={10}
              progress={timer.progressFraction}
              trackColor={isDark ? '#1E293B' : '#DDEBFC'}
              progressColor={isDark ? '#3B82F6' : '#1D4ED8'}
              knobColor={isDark ? '#1E293B' : '#FFFFFF'}
              knobBorderColor={isDark ? '#3B82F6' : '#1D4ED8'}
              centerDiscColor={isDark ? '#0F172A' : '#FFFFFF'}
              knobSize={18}
              isActive={timer.isWorking}
              showAura={true}
            >
              <Text style={[styles.workedLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                Worked today
              </Text>
              <Text
                style={[styles.workedTime, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {timer.workedDisplay}
              </Text>
              <Text style={[styles.workedTarget, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                of 8h
              </Text>
            </CircularProgressDial>
          </View>

          {/* Break and Remaining Info Bar */}
          <View
            style={[
              styles.infoBar,
              {
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(238, 242, 255, 0.65)',
              },
            ]}
          >
            <View style={styles.infoBarItem}>
              <Feather name="coffee" size={16} color={isDark ? '#94A3B8' : '#475569'} />
              <Text style={[styles.infoBarTextMuted, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                {' '}Break{' '}
              </Text>
              <Text style={[styles.infoBarTextBold, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                {timer.breakDisplay}
              </Text>
            </View>
            <View
              style={[styles.infoBarDivider, { backgroundColor: isDark ? '#334155' : '#CBD5E1' }]}
            />
            <View style={styles.infoBarItem}>
              <Feather name="clock" size={16} color={isDark ? '#94A3B8' : '#475569'} />
              <Text style={[styles.infoBarTextBold, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                {' '}{timer.remainingDisplay}{' '}
              </Text>
              <Text style={[styles.infoBarTextMuted, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                remaining
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TactilePressable
              style={[
                styles.breakButton,
                timer.isOnBreak && styles.breakButtonActive,
                timer.isPunchedOut && styles.buttonDisabled,
              ]}
              onPress={handleToggleBreak}
              disabled={timer.isPunchedOut}
              activeScale={0.95}
            >
              <Feather name={timer.isOnBreak ? 'play' : 'pause'} size={18} color="#FFFFFF" />
              <Text style={styles.breakButtonText}>
                {timer.isOnBreak ? 'Resume work' : 'Start break'}
              </Text>
            </TactilePressable>

            <TactilePressable
              style={[
                styles.punchOutButton,
                {
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  borderColor: isDark ? '#334155' : '#0F172A',
                },
                timer.isPunchedOut && styles.punchInStyle,
              ]}
              onPress={timer.isPunchedOut ? handlePunchIn : handlePunchOut}
              activeScale={0.95}
            >
              <Feather
                name={timer.isPunchedOut ? 'log-in' : 'log-out'}
                size={18}
                color={timer.isPunchedOut ? '#FFFFFF' : isDark ? '#F8FAFC' : '#0F172A'}
              />
              <Text
                style={[
                  styles.punchOutButtonText,
                  { color: isDark ? '#F8FAFC' : '#0F172A' },
                  timer.isPunchedOut && styles.punchInText,
                ]}
              >
                {timer.isPunchedOut ? 'Punch in' : 'Punch out'}
              </Text>
            </TactilePressable>
          </View>

          {/* Helper Subtext */}
          <Text style={[styles.punchNote, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            {timer.isPunchedOut
              ? 'Punch-in requires a live photo and location.'
              : 'Punch-out requires a live photo and location.'}
          </Text>

          {/* Subtle Horizontal Divider */}
          <View style={[styles.sectionDivider, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]} />

          {/* Weekly Work Progress -> Tap to open Employment Details */}
          <TactilePressable
            style={styles.weeklyCard}
            onPress={() => router.push('/(app)/employment')}
            activeScale={0.99}
            accessibilityRole="button"
            accessibilityLabel="View employment details and weekly work hours"
          >
            <View style={styles.weeklyHeader}>
              <View style={styles.weeklyTitleRow}>
                <Feather name="calendar" size={16} color={isDark ? '#94A3B8' : '#475569'} />
                <Text style={[styles.weeklyTitle, { color: isDark ? '#F8FAFC' : '#475569' }]}>
                  Weekly work
                </Text>
              </View>
              <Text style={[styles.weeklyStats, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                25h 30m / 40h
              </Text>
            </View>
            <View
              style={[styles.progressBarTrack, { backgroundColor: isDark ? '#1E293B' : '#E0E7FF' }]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: '63.75%',
                    backgroundColor: isDark ? '#3B82F6' : '#2563EB',
                  },
                ]}
              />
            </View>
          </TactilePressable>

          {/* Subtle Horizontal Divider */}
          <View style={[styles.sectionDivider, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]} />

          {/* Leave Balance Section */}
          <View style={styles.leaveSection}>
            <TactilePressable
              style={[
                styles.leaveHeaderBanner,
                {
                  backgroundColor: isDark ? '#0F172A' : 'rgba(238, 242, 255, 0.7)',
                  borderColor: isDark ? '#1E293B' : 'transparent',
                },
              ]}
              onPress={handleRequestLeave}
              activeScale={0.98}
              accessibilityRole="button"
              accessibilityLabel="Request leave"
            >
              <View style={styles.leaveHeaderLeft}>
                <Feather name="calendar" size={16} color={isDark ? '#60A5FA' : '#1D4ED8'} />
                <Text style={[styles.leaveHeaderTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  Leave balance
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={isDark ? '#94A3B8' : '#475569'} />
            </TactilePressable>

            <TactilePressable
              style={styles.leaveMetricsRow}
              onPress={handleRequestLeave}
              activeScale={0.98}
            >
              {/* Days Remaining */}
              <View style={styles.leaveMetricCol}>
                <Text style={[styles.leaveMetricNumber, styles.leaveMetricBlue]}>
                  14
                </Text>
                <Text style={[styles.leaveMetricLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  days remaining
                </Text>
              </View>

              <View
                style={[styles.metricDivider, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}
              />

              {/* Days Allocated */}
              <View style={styles.leaveMetricCol}>
                <Text style={[styles.leaveMetricNumber, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  18
                </Text>
                <Text style={[styles.leaveMetricLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  days allocated
                </Text>
              </View>

              <View
                style={[styles.metricDivider, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}
              />

              {/* Days Taken */}
              <View style={styles.leaveMetricCol}>
                <Text style={[styles.leaveMetricNumber, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  4
                </Text>
                <Text style={[styles.leaveMetricLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  days taken
                </Text>
              </View>
            </TactilePressable>
          </View>

          {/* View Leave History Action Button */}
          <TactilePressable
            style={[
              styles.viewHistoryButton,
              {
                backgroundColor: isDark ? '#2563EB' : '#1D4ED8',
              },
            ]}
            onPress={handleViewLeaveHistory}
            activeScale={0.97}
            accessibilityRole="button"
            accessibilityLabel="View Leave history"
          >
            <Text style={styles.viewHistoryButtonText}>View Leave history</Text>
            <Feather name="arrow-right" size={18} color="#FFFFFF" />
          </TactilePressable>
        </KeyboardAvoidingScrollView>
      </SafeAreaView>

      {/* Hours Selector Bottom Sheet */}
      <AppBottomSheet
        isOpen={showHoursModal}
        onClose={() => setShowHoursModal(false)}
        title="Select Work Hours"
        testID="hours-bottom-sheet"
      >
        <View style={styles.sheetList}>
          {(['Regular', 'Overtime', 'Flexible'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.modalItem,
                timer.hoursType === type && {
                  backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                },
              ]}
              onPress={() => {
                timer.setHoursType(type);
                setShowHoursModal(false);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.modalItemText,
                  { color: isDark ? '#E2E8F0' : '#334155' },
                  timer.hoursType === type && {
                    color: isDark ? '#60A5FA' : '#1D4ED8',
                    fontWeight: '700',
                  },
                ]}
              >
                {type}
              </Text>
              {timer.hoursType === type && (
                <Feather name="check" size={18} color={isDark ? '#60A5FA' : '#1D4ED8'} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </AppBottomSheet>

      {/* Location Selector Bottom Sheet */}
      <AppBottomSheet
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        title="Select Work Location"
        testID="location-bottom-sheet"
      >
        <View style={styles.sheetList}>
          {(['Work from home', 'Headquarters', 'Client site'] as const).map((loc) => (
            <TouchableOpacity
              key={loc}
              style={[
                styles.modalItem,
                timer.workLocation === loc && {
                  backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                },
              ]}
              onPress={() => {
                timer.setWorkLocation(loc);
                setShowLocationModal(false);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.modalItemText,
                  { color: isDark ? '#E2E8F0' : '#334155' },
                  timer.workLocation === loc && {
                    color: isDark ? '#60A5FA' : '#1D4ED8',
                    fontWeight: '700',
                  },
                ]}
              >
                {loc}
              </Text>
              {timer.workLocation === loc && (
                <Feather name="check" size={18} color={isDark ? '#60A5FA' : '#1D4ED8'} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </AppBottomSheet>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 110,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 26,
    color: '#0F1E36',
    letterSpacing: -0.4,
  },
  headerDate: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: '#1E293B',
  },
  dropdownsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  dropdownCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  dropdownIconContainer: {
    marginRight: 8,
  },
  dropdownTextCol: {
    flex: 1,
  },
  dropdownLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#64748B',
    marginBottom: 1,
  },
  dropdownValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#0F172A',
  },
  shiftBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(238, 242, 255, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8B4FE',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  shiftLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shiftLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: '#475569',
  },
  shiftDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 12,
  },
  shiftTime: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#0F172A',
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  statusIndicatorText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    color: '#0F172A',
  },
  statusTextBreak: {
    color: '#D97706',
  },
  statusTextOff: {
    color: '#64748B',
  },
  dialWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  workedLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: '#64748B',
    marginBottom: 2,
  },
  workedTime: {
    fontFamily: FontFamily.headingBold,
    fontSize: 28,
    color: '#0F172A',
    letterSpacing: -0.3,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    paddingHorizontal: 6,
  },
  workedTarget: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(238, 242, 255, 0.65)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  infoBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoBarTextMuted: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#64748B',
  },
  infoBarTextBold: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#0F172A',
  },
  infoBarDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  breakButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    height: 50,
    borderRadius: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  breakButtonActive: {
    backgroundColor: '#1D4ED8',
  },
  breakButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  punchOutButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    height: 50,
    borderRadius: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  punchOutButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: '#0F172A',
  },
  punchInStyle: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },
  punchInText: {
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  punchNote: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionDivider: {
    height: 1,
    width: '100%',
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  weeklyCard: {
    marginBottom: 16,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weeklyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  weeklyTitle: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: '#475569',
  },
  weeklyStats: {
    fontFamily: FontFamily.headingBold,
    fontSize: 14,
    color: '#0F172A',
  },
  progressBarTrack: {
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#E0E7FF',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3.5,
    backgroundColor: '#2563EB',
  },
  leaveSection: {
    marginBottom: 20,
  },
  leaveHeaderBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(238, 242, 255, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  leaveHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leaveHeaderTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 15,
    color: '#0F172A',
  },
  leaveMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leaveMetricCol: {
    flex: 1,
    alignItems: 'center',
  },
  leaveMetricNumber: {
    fontFamily: FontFamily.headingBold,
    fontSize: 34,
    color: '#0F172A',
    marginBottom: 2,
    fontVariant: ['tabular-nums'],
  },
  leaveMetricBlue: {
    color: '#1D4ED8',
  },
  leaveMetricLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  metricDivider: {
    width: 1,
    height: 38,
    backgroundColor: '#CBD5E1',
  },
  viewHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1D4ED8',
    height: 52,
    borderRadius: 14,
    marginTop: 6,
    marginBottom: 20,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  viewHistoryButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  sheetList: {
    paddingBottom: 8,
    gap: 4,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  modalItemText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
});
