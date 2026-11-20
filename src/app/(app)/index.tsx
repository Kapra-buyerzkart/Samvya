import { usePersistentShiftTimer } from '@/features/attendance';
import {
  getActiveTrackingSession,
  startBackgroundTracking,
  startTrackingSession,
  stopBackgroundTracking,
  stopTrackingSession,
} from '@/features/location';
import { PulsingStatusDot, TactilePressable } from '@/shared/animations';
import { AppBottomSheet, CircularProgressDial } from '@/shared/components';
import { FontFamily, useAppTheme } from '@/shared/theme';
import { Feather } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  return (
    <ImageBackground
      source={require('../../../assets/images/background_home.png')}
      style={[styles.backgroundImage, { backgroundColor: isDark ? '#020617' : '#F8FAFC' }]}
      imageStyle={{ opacity: isDark ? 0.05 : 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            !timer.isPunchedOut && { paddingTop: 46 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Row: Brand and Date */}
          <View style={styles.headerRow}>
            <Text style={[styles.brandTitle, { color: isDark ? '#F8FAFC' : '#0F1E36' }]}>
              Samavya
            </Text>
            <View style={styles.headerRight}>
              <Text style={[styles.headerDate, { color: isDark ? '#94A3B8' : '#1E293B' }]}>
                Thu 12 Nov 2026
              </Text>
              <TactilePressable
                onPress={() => router.push('/(app)/profile')}
                style={[
                  styles.settingsIconBtn,
                  {
                    backgroundColor: isDark ? '#1E293B' : 'rgba(255, 255, 255, 0.7)',
                    borderWidth: isDark ? 1 : 0,
                    borderColor: '#334155',
                  },
                ]}
                accessibilityLabel="My Profile"
              >
                <Feather name="user" size={18} color={isDark ? '#60A5FA' : '#1D4ED8'} />
              </TactilePressable>
              <TactilePressable
                onPress={() => router.push('/(app)/settings')}
                style={[
                  styles.settingsIconBtn,
                  {
                    backgroundColor: isDark ? '#1E293B' : 'rgba(255, 255, 255, 0.7)',
                    borderWidth: isDark ? 1 : 0,
                    borderColor: '#334155',
                  },
                ]}
                accessibilityLabel="Settings"
              >
                <Feather name="settings" size={18} color={isDark ? '#94A3B8' : '#475569'} />
              </TactilePressable>
            </View>
          </View>

          {/* Top Dropdowns: Hours & Location */}
          <View style={styles.dropdownsRow}>
            {/* Hours Selector */}
            <TactilePressable
              style={[
                styles.dropdownCard,
                {
                  backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                  borderColor: isDark ? '#1E293B' : '#CBD5E1',
                },
              ]}
              onPress={() => setShowHoursModal(true)}
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
                  borderColor: isDark ? '#1E293B' : '#CBD5E1',
                },
              ]}
              onPress={() => setShowLocationModal(true)}
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

          {/* Working Status Indicator with Pulsing Micro-Animation */}
          <View style={styles.statusIndicatorRow}>
            <PulsingStatusDot
              color={timer.isOnBreak ? '#D97706' : timer.isWorking ? '#2563EB' : '#64748B'}
              size={8}
            />
            <Text
              style={[
                styles.statusIndicatorText,
                { color: isDark ? '#F8FAFC' : '#0F172A' },
                timer.isOnBreak
                  ? styles.statusTextBreak
                  : timer.isPunchedOut
                    ? styles.statusTextOff
                    : null,
              ]}
            >
              {timer.isOnBreak ? 'On Break' : timer.isWorking ? 'Working' : 'Off Duty'}
            </Text>

            <View style={{ paddingTop: 50 }} />
          </View>

          {/* Circular Progress Hero Dial with Ambient Aura & Breathing Knob */}
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
                {' '}
                Break{' '}
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
                {' '}
                {timer.remainingDisplay}{' '}
              </Text>
              <Text style={[styles.infoBarTextMuted, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                remaining
              </Text>
            </View>
          </View>

          {/* Action Buttons with Spring Micro-Interactions */}
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

          {/* Weekly Work Progress Card -> Tap to open Employment Details */}
          <TactilePressable
            style={styles.weeklyCard}
            onPress={() => router.push('/(app)/employment')}
            activeScale={0.98}
            accessibilityRole="button"
            accessibilityLabel="View employment details and monthly work hours"
          >
            <View style={styles.weeklyHeader}>
              <View style={styles.weeklyTitleRow}>
                <Feather name="calendar" size={16} color={isDark ? '#94A3B8' : '#475569'} />
                <Text style={[styles.weeklyTitle, { color: isDark ? '#F8FAFC' : '#475569' }]}>
                  Weekly work
                </Text>
              </View>
              <View style={styles.weeklyHeaderRight}>
                <Text style={[styles.weeklyStats, { color: isDark ? '#94A3B8' : '#0F172A' }]}>
                  25h 30m / 40h
                </Text>
                <Feather name="chevron-right" size={15} color={isDark ? '#60A5FA' : '#1D4ED8'} />
              </View>
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

          {/* Dedicated Employment Details Action Button / Card */}
          <TactilePressable
            style={[
              styles.employmentBanner,
              {
                backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                borderColor: isDark ? '#1E293B' : '#E2E8F0',
              },
            ]}
            onPress={() => router.push('/(app)/employment')}
            activeScale={0.98}
            accessibilityRole="button"
            accessibilityLabel="Open Employment Details & Monthly Work Hours"
          >
            <View style={styles.employmentBannerLeft}>
              <View
                style={[
                  styles.employmentIconBadge,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                    borderColor: isDark ? '#334155' : '#BFDBFE',
                  },
                ]}
              >
                <Feather name="calendar" size={18} color={isDark ? '#60A5FA' : '#2563EB'} />
              </View>
              <View style={styles.employmentBannerTextCol}>
                <Text
                  style={[styles.employmentBannerTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                >
                  Employment details
                </Text>
                <Text
                  style={[
                    styles.employmentBannerSubtitle,
                    { color: isDark ? '#94A3B8' : '#64748B' },
                  ]}
                >
                  Monthly work hours &amp; employment history
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={isDark ? '#60A5FA' : '#1D4ED8'} />
          </TactilePressable>

          {/* Team Hybrid Presence Radar */}
          {/* <TeamRadarCard /> */}

          {/* Leave Balance Section */}
          <View style={styles.leaveSection}>
            <TactilePressable
              style={[
                styles.leaveHeaderBanner,
                {
                  backgroundColor: isDark ? '#0F172A' : 'rgba(238, 242, 255, 0.7)',
                  borderWidth: isDark ? 1 : 0,
                  borderColor: '#1E293B',
                },
              ]}
              onPress={handleRequestLeave}
              activeScale={0.97}
            >
              <View style={styles.leaveHeaderLeft}>
                <Feather name="calendar" size={16} color={isDark ? '#60A5FA' : '#1D4ED8'} />
                <Text style={[styles.leaveHeaderTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  Leave balance
                </Text>
              </View>
              <View>
                <Text style={[styles.leaveRequestLink, { color: isDark ? '#60A5FA' : '#1D4ED8' }]}>
                  Request leave &gt;
                </Text>
              </View>
            </TactilePressable>

            <TactilePressable
              style={[
                styles.leaveMetricsRow,
                isDark && {
                  backgroundColor: '#0F172A',
                  paddingVertical: 12,
                  paddingHorizontal: 8,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: '#1E293B',
                },
              ]}
              onPress={handleRequestLeave}
              activeScale={0.98}
            >
              {/* Days Remaining */}
              <View style={styles.leaveMetricCol}>
                <Text style={[styles.leaveMetricNumber, { color: isDark ? '#60A5FA' : '#1D4ED8' }]}>
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

          {/* Shortcuts & Diagnostics Tray */}
          <View
            style={[
              styles.shortcutsCard,
              {
                backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                borderColor: isDark ? '#1E293B' : '#E2E8F0',
              },
            ]}
          >
            <Text style={[styles.shortcutsTitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Quick Verification & Logs
            </Text>
            <View style={styles.shortcutsGrid}>
              <TactilePressable
                style={[
                  styles.shortcutBtn,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                    borderWidth: isDark ? 1 : 0,
                    borderColor: '#334155',
                  },
                ]}
                onPress={() =>
                  router.push({
                    pathname: '/(app)/attendance/face-verify',
                    params: { action: timer.isPunchedOut ? 'punch-in' : 'punch-out' },
                  })
                }
                activeScale={0.94}
              >
                <Feather name="camera" size={16} color={isDark ? '#60A5FA' : '#1D4ED8'} />
                <Text style={[styles.shortcutBtnText, { color: isDark ? '#F8FAFC' : '#334155' }]}>
                  Biometric Face
                </Text>
              </TactilePressable>

              <TactilePressable
                style={[
                  styles.shortcutBtn,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                    borderWidth: isDark ? 1 : 0,
                    borderColor: '#334155',
                  },
                ]}
                onPress={() => router.push('/(app)/attendance/manual-entry')}
                activeScale={0.94}
              >
                <Feather name="map-pin" size={16} color={isDark ? '#60A5FA' : '#1D4ED8'} />
                <Text style={[styles.shortcutBtnText, { color: isDark ? '#F8FAFC' : '#334155' }]}>
                  Manual GPS
                </Text>
              </TactilePressable>

              <TactilePressable
                style={[
                  styles.shortcutBtn,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                    borderWidth: isDark ? 1 : 0,
                    borderColor: '#334155',
                  },
                ]}
                onPress={() => router.push('/(app)/attendance/history')}
                activeScale={0.94}
              >
                <Feather name="activity" size={16} color={isDark ? '#60A5FA' : '#1D4ED8'} />
                <Text style={[styles.shortcutBtnText, { color: isDark ? '#F8FAFC' : '#334155' }]}>
                  Sync Queue
                </Text>
              </TactilePressable>
            </View>
          </View>
        </ScrollView>
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
    paddingBottom: 96,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 28,
    color: '#0F1E36',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerDate: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: '#1E293B',
  },
  settingsIconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  dropdownsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  dropdownCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
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
    marginBottom: 18,
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
    gap: 6,
    marginBottom: 14,
  },
  statusIndicatorText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
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
    fontSize: 26,
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
    marginBottom: 20,
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
    backgroundColor: '#254EB9',
    height: 52,
    borderRadius: 14,
    shadowColor: '#254EB9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  breakButtonActive: {
    backgroundColor: '#254EB9',
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
    height: 52,
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
    marginBottom: 22,
  },
  weeklyCard: {
    marginBottom: 20,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#0F172A',
  },
  weeklyHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  employmentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  employmentBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  employmentIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  employmentBannerTextCol: {
    flex: 1,
  },
  employmentBannerTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 15,
    marginBottom: 2,
  },
  employmentBannerSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E7FF',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
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
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  leaveHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  leaveHeaderTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 14,
    color: '#0F172A',
  },
  leaveRequestLink: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#1D4ED8',
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
    fontSize: 32,
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
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  shortcutsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginTop: 6,
  },
  shortcutsTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  shortcutBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 10,
  },
  shortcutBtnText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#334155',
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
  modalItemActive: {
    backgroundColor: '#EFF6FF',
  },
  modalItemText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  modalItemTextActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
});
