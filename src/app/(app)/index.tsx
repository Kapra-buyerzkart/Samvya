import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  getActiveTrackingSession,
  startBackgroundTracking,
  startTrackingSession,
  stopBackgroundTracking,
  stopTrackingSession,
  type TrackingSessionState,
} from '@/features/location';

type HourType = 'Regular' | 'Overtime' | 'Flexible';
type WorkLocation = 'Work from home' | 'Headquarters' | 'Client site';

export default function HomeScreen(): React.JSX.Element {
  const [session, setSession] = useState<TrackingSessionState | null>(() =>
    getActiveTrackingSession(),
  );
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakMinutes, setBreakMinutes] = useState(20);
  const [hoursType, setHoursType] = useState<HourType>('Regular');
  const [workLocation, setWorkLocation] = useState<WorkLocation>('Work from home');
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [workedSeconds, setWorkedSeconds] = useState(5400); // 1h 30m = 5400s

  const isTracking = session !== null && session.status === 'tracking';

  // Live timer for working duration
  useEffect(() => {
    if (!isOnBreak) {
      const timer = setInterval(() => {
        setWorkedSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOnBreak]);

  // Format seconds into "1h 30m"
  const hours = Math.floor(workedSeconds / 3600);
  const minutes = Math.floor((workedSeconds % 3600) / 60);
  const workedDisplay = `${hours}h ${minutes < 10 ? '0' : ''}${minutes}m`;

  // Remaining time of 8h (28800s)
  const remainingTotalSeconds = Math.max(0, 8 * 3600 - workedSeconds);
  const remHours = Math.floor(remainingTotalSeconds / 3600);
  const remMinutes = Math.floor((remainingTotalSeconds % 3600) / 60);
  const remainingDisplay = `${remHours}h ${remMinutes < 10 ? '0' : ''}${remMinutes}m`;

  const handleToggleBreak = (): void => {
    if (!isOnBreak) {
      setIsOnBreak(true);
      setBreakMinutes((prev) => prev + 1);
      Alert.alert('Break Started', 'You are now on break. Work timer is paused.');
    } else {
      setIsOnBreak(false);
      Alert.alert('Break Ended', 'Welcome back! Work timer has resumed.');
    }
  };

  const handlePunchOut = (): void => {
    Alert.alert(
      'Punch Out Verification',
      'Punch-out requires a live photo and location check.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Verify Face & Location',
          onPress: () => {
            router.push('/(app)/attendance/face-verify');
          },
        },
        {
          text: 'Quick Punch Out',
          style: 'destructive',
          onPress: async () => {
            stopTrackingSession();
            await stopBackgroundTracking();
            setSession(null);
            Alert.alert('Punched Out', 'Shift ended successfully.');
          },
        },
      ],
    );
  };

  const handlePunchIn = async (): Promise<void> => {
    try {
      const newSession = startTrackingSession(
        `sess_${Date.now()}`,
        'usr_default_employee',
      );
      await startBackgroundTracking(newSession.sessionId, 'usr_default_employee');
      setSession(newSession);
      Alert.alert('Punched In', 'Shift started with live background GPS tracking.');
    } catch {
      Alert.alert('Notice', 'Started shift.');
    }
  };

  const handleRequestLeave = (): void => {
    Alert.alert(
      'Request Leave',
      'You have 14 days remaining in your annual leave allocation.\n\nWould you like to submit a leave request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply Leave',
          onPress: () => {
            Alert.alert('Application Submitted', 'Your leave request has been forwarded to HR for approval.');
          },
        },
      ],
    );
  };

  return (
    <LinearGradient
      colors={['#EBF2FB', '#F3F7FD', '#FAFCFF', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Row: Brand and Date */}
          <View style={styles.headerRow}>
            <Text style={styles.brandTitle}>Samavya</Text>
            <View style={styles.headerRight}>
              <Text style={styles.headerDate}>Thu 12 Nov 2026</Text>
              <TouchableOpacity
                onPress={() => router.push('/(app)/settings')}
                style={styles.settingsIconBtn}
                activeOpacity={0.7}
              >
                <Feather name="settings" size={18} color="#475569" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Top Dropdowns: Hours & Location */}
          <View style={styles.dropdownsRow}>
            {/* Hours Selector */}
            <TouchableOpacity
              style={styles.dropdownCard}
              onPress={() => setShowHoursModal(true)}
              activeOpacity={0.8}
            >
              <View style={styles.dropdownIconContainer}>
                <Feather name="clock" size={20} color="#0F172A" />
              </View>
              <View style={styles.dropdownTextCol}>
                <Text style={styles.dropdownLabel}>Hours</Text>
                <Text style={styles.dropdownValue}>{hoursType}</Text>
              </View>
              <Feather name="chevron-down" size={18} color="#64748B" />
            </TouchableOpacity>

            {/* Location Selector */}
            <TouchableOpacity
              style={styles.dropdownCard}
              onPress={() => setShowLocationModal(true)}
              activeOpacity={0.8}
            >
              <View style={styles.dropdownIconContainer}>
                <Feather name="home" size={20} color="#0F172A" />
              </View>
              <View style={styles.dropdownTextCol}>
                <Text style={styles.dropdownLabel}>Location</Text>
                <Text style={styles.dropdownValue} numberOfLines={1}>
                  {workLocation}
                </Text>
              </View>
              <Feather name="chevron-down" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Shift Banner */}
          <View style={styles.shiftBanner}>
            <View style={styles.shiftLeft}>
              <Feather name="calendar" size={16} color="#64748B" />
              <Text style={styles.shiftLabel}>Shift</Text>
            </View>
            <View style={styles.shiftDivider} />
            <Text style={styles.shiftTime}>09:00 AM - 06 : 00 PM</Text>
          </View>

          {/* Working Status Indicator */}
          <View style={styles.statusIndicatorRow}>
            <Feather
              name="clock"
              size={18}
              color={isOnBreak ? '#D97706' : '#2563EB'}
            />
            <Text
              style={[
                styles.statusIndicatorText,
                isOnBreak ? styles.statusTextBreak : null,
              ]}
            >
              {isOnBreak ? 'On Break' : 'Working'}
            </Text>
          </View>

          {/* Circular Progress Hero Dial */}
          <View style={styles.dialWrapper}>
            <View style={styles.dialContainer}>
              {/* Outer Track */}
              <View style={styles.dialTrack} />

              {/* Progress Arc (representing ~1h 30m / 8h) */}
              <View style={styles.dialProgressArc} />

              {/* White Knob on Arc End */}
              <View style={styles.dialKnob} />

              {/* Inner White Disc */}
              <View style={styles.dialCenter}>
                <Text style={styles.workedLabel}>Worked today</Text>
                <Text style={styles.workedTime}>{workedDisplay}</Text>
                <Text style={styles.workedTarget}>of 8h</Text>
              </View>
            </View>
          </View>

          {/* Break and Remaining Info Bar */}
          <View style={styles.infoBar}>
            <View style={styles.infoBarItem}>
              <Feather name="coffee" size={16} color="#475569" />
              <Text style={styles.infoBarTextMuted}> Break </Text>
              <Text style={styles.infoBarTextBold}>{breakMinutes}m</Text>
            </View>
            <View style={styles.infoBarDivider} />
            <View style={styles.infoBarItem}>
              <Feather name="clock" size={16} color="#475569" />
              <Text style={styles.infoBarTextBold}> {remainingDisplay} </Text>
              <Text style={styles.infoBarTextMuted}>remaining</Text>
            </View>
          </View>

          {/* Action Buttons: Start Break & Punch Out */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.breakButton, isOnBreak && styles.breakButtonActive]}
              onPress={handleToggleBreak}
              activeOpacity={0.85}
            >
              <Feather
                name={isOnBreak ? 'play' : 'pause'}
                size={18}
                color="#FFFFFF"
              />
              <Text style={styles.breakButtonText}>
                {isOnBreak ? 'Resume work' : 'Start break'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.punchOutButton}
              onPress={isTracking ? handlePunchOut : handlePunchIn}
              activeOpacity={0.85}
            >
              <Feather
                name={isTracking ? 'log-out' : 'log-in'}
                size={18}
                color="#0F172A"
              />
              <Text style={styles.punchOutButtonText}>
                {isTracking ? 'Punch out' : 'Punch in'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Helper Subtext */}
          <Text style={styles.punchNote}>
            Punch-out requires a live photo and location.
          </Text>

          {/* Weekly Work Progress Card */}
          <View style={styles.weeklyCard}>
            <View style={styles.weeklyHeader}>
              <View style={styles.weeklyTitleRow}>
                <Feather name="calendar" size={16} color="#475569" />
                <Text style={styles.weeklyTitle}>Weekly work</Text>
              </View>
              <Text style={styles.weeklyStats}>25h 30m / 40h</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: '63.75%' }]} />
            </View>
          </View>

          {/* Leave Balance Section */}
          <View style={styles.leaveSection}>
            <View style={styles.leaveHeaderBanner}>
              <View style={styles.leaveHeaderLeft}>
                <Feather name="calendar" size={16} color="#1D4ED8" />
                <Text style={styles.leaveHeaderTitle}>Leave balance</Text>
              </View>
              <TouchableOpacity onPress={handleRequestLeave} activeOpacity={0.7}>
                <Text style={styles.leaveRequestLink}>Request leave &gt;</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.leaveMetricsRow}>
              {/* Days Remaining */}
              <View style={styles.leaveMetricCol}>
                <Text style={[styles.leaveMetricNumber, styles.leaveMetricBlue]}>
                  14
                </Text>
                <Text style={styles.leaveMetricLabel}>days remaining</Text>
              </View>

              <View style={styles.metricDivider} />

              {/* Days Allocated */}
              <View style={styles.leaveMetricCol}>
                <Text style={styles.leaveMetricNumber}>18</Text>
                <Text style={styles.leaveMetricLabel}>days allocated</Text>
              </View>

              <View style={styles.metricDivider} />

              {/* Days Taken */}
              <View style={styles.leaveMetricCol}>
                <Text style={styles.leaveMetricNumber}>4</Text>
                <Text style={styles.leaveMetricLabel}>days taken</Text>
              </View>
            </View>
          </View>

          {/* Shortcuts & Diagnostics Tray */}
          <View style={styles.shortcutsCard}>
            <Text style={styles.shortcutsTitle}>Quick Verification & Logs</Text>
            <View style={styles.shortcutsGrid}>
              <TouchableOpacity
                style={styles.shortcutBtn}
                onPress={() => router.push('/(app)/attendance/face-verify')}
                activeOpacity={0.8}
              >
                <Feather name="camera" size={16} color="#1D4ED8" />
                <Text style={styles.shortcutBtnText}>Biometric Face</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shortcutBtn}
                onPress={() => router.push('/(app)/attendance/manual-entry')}
                activeOpacity={0.8}
              >
                <Feather name="map-pin" size={16} color="#1D4ED8" />
                <Text style={styles.shortcutBtnText}>Manual GPS</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shortcutBtn}
                onPress={() => router.push('/(app)/attendance/history')}
                activeOpacity={0.8}
              >
                <Feather name="activity" size={16} color="#1D4ED8" />
                <Text style={styles.shortcutBtnText}>Sync Queue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Hours Selector Modal */}
      <Modal visible={showHoursModal} transparent animationType="fade">
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowHoursModal(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Work Hours</Text>
            {(['Regular', 'Overtime', 'Flexible'] as HourType[]).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.modalItem,
                  hoursType === type && styles.modalItemActive,
                ]}
                onPress={() => {
                  setHoursType(type);
                  setShowHoursModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    hoursType === type && styles.modalItemTextActive,
                  ]}
                >
                  {type}
                </Text>
                {hoursType === type && (
                  <Feather name="check" size={18} color="#1D4ED8" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Location Selector Modal */}
      <Modal visible={showLocationModal} transparent animationType="fade">
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowLocationModal(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Work Location</Text>
            {(['Work from home', 'Headquarters', 'Client site'] as WorkLocation[]).map(
              (loc) => (
                <TouchableOpacity
                  key={loc}
                  style={[
                    styles.modalItem,
                    workLocation === loc && styles.modalItemActive,
                  ]}
                  onPress={() => {
                    setWorkLocation(loc);
                    setShowLocationModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      workLocation === loc && styles.modalItemTextActive,
                    ]}
                  >
                    {loc}
                  </Text>
                  {workLocation === loc && (
                    <Feather name="check" size={18} color="#1D4ED8" />
                  )}
                </TouchableOpacity>
              ),
            )}
          </View>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F1E36',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerDate: {
    fontSize: 14,
    fontWeight: '500',
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
    fontSize: 12,
    color: '#64748B',
    marginBottom: 1,
  },
  dropdownValue: {
    fontSize: 14,
    fontWeight: '700',
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
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  shiftDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 12,
  },
  shiftTime: {
    fontSize: 14,
    fontWeight: '600',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  statusTextBreak: {
    color: '#D97706',
  },
  dialWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dialContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dialTrack: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 10,
    borderColor: '#E2EDFD',
  },
  dialProgressArc: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 10,
    borderColor: 'transparent',
    borderTopColor: '#1D4ED8',
    borderRightColor: '#1D4ED8',
    transform: [{ rotate: '-25deg' }],
  },
  dialKnob: {
    position: 'absolute',
    top: 56,
    left: 196,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 3.5,
    borderColor: '#1D4ED8',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dialCenter: {
    width: 184,
    height: 184,
    borderRadius: 92,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  workedLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 2,
  },
  workedTime: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  workedTarget: {
    fontSize: 13,
    fontWeight: '500',
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
    fontSize: 13,
    color: '#64748B',
  },
  infoBarTextBold: {
    fontSize: 13,
    fontWeight: '700',
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
    backgroundColor: '#D97706',
  },
  breakButtonText: {
    fontSize: 15,
    fontWeight: '600',
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
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  punchNote: {
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
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  weeklyStats: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
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
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  leaveRequestLink: {
    fontSize: 13,
    fontWeight: '600',
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
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  leaveMetricBlue: {
    color: '#1D4ED8',
  },
  leaveMetricLabel: {
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
    fontSize: 12,
    fontWeight: '600',
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
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
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
