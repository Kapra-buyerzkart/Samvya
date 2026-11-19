import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useAppTheme, FontFamily } from '@/shared/theme';
import { TactilePressable, PulsingStatusDot } from '@/shared/animations';
import { AppBottomSheet } from '@/shared/components';
import {
  INITIAL_TEAM_MEMBERS,
  INITIAL_OFFICE_CAPACITY,
  filterMembers,
  getLocationCounts,
  simulatePingMember,
  simulateDeskReservation,
  getTomorrowHeadline,
} from '../domain/teamRadarData';
import { TeamMember, TomorrowPlan, WorkLocationType } from '../domain/types';

export interface TeamRadarCardProps {
  onMemberPress?: (member: TeamMember) => void;
  onPingPress?: (member: TeamMember) => void;
}

export function TeamRadarCard({
  onMemberPress,
  onPingPress,
}: TeamRadarCardProps): React.JSX.Element {
  const theme = useAppTheme();
  const isDark = theme.isDark;

  const [members] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [capacity, setCapacity] = useState(INITIAL_OFFICE_CAPACITY);
  const [selectedFilter, setSelectedFilter] = useState<'all' | WorkLocationType>('all');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [tomorrowPlan, setTomorrowPlan] = useState<TomorrowPlan>(null);
  const [bookedDesk, setBookedDesk] = useState<boolean>(false);

  const counts = useMemo(() => getLocationCounts(members), [members]);
  const filteredList = useMemo(
    () => filterMembers(members, selectedFilter),
    [members, selectedFilter],
  );

  const capacityPercent = Math.round((capacity.occupiedDesks / capacity.totalDesks) * 100);

  const handlePing = useCallback(
    (member: TeamMember) => {
      onPingPress?.(member);
      const message = simulatePingMember(member);
      Alert.alert('Collaboration Ping Sent', message);
    },
    [onPingPress],
  );

  const handleCardPress = useCallback(
    (member: TeamMember) => {
      setSelectedMember(member);
      onMemberPress?.(member);
    },
    [onMemberPress],
  );

  const handleBookDesk = useCallback(() => {
    if (bookedDesk) {
      Alert.alert('Desk Already Reserved', 'You have already booked desk 3F-HotDesk-09 for today.');
      return;
    }
    if (capacity.hotDesksAvailable <= 0) {
      Alert.alert('HQ Full', 'No hot desks are available on Floor 3 today.');
      return;
    }
    setCapacity((prev) => simulateDeskReservation(prev));
    setBookedDesk(true);
    Alert.alert(
      'Hot Desk Confirmed! 🎯',
      'Reserved Desk 3F-HotDesk-09 on Floor 3. Check in with badge or face verify on arrival.',
    );
  }, [bookedDesk, capacity.hotDesksAvailable]);

  const handleSelectTomorrow = useCallback((plan: TomorrowPlan) => {
    setTomorrowPlan((prev) => (prev === plan ? null : plan));
  }, []);

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
          borderColor: isDark ? '#1E293B' : '#E2E8F0',
        },
      ]}
      testID="team-radar-card"
    >
      {/* 1. Header with Radar live pulse */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleLeft}>
          <View style={[styles.radarIconBubble, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
            <Feather name="radio" size={17} color={isDark ? '#60A5FA' : '#2563EB'} />
          </View>
          <View>
            <View style={styles.titleWithPulse}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Team Presence Radar
              </Text>
              <PulsingStatusDot color="#10B981" size={7} />
            </View>
            <Text style={[styles.sectionSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Engineering &amp; Product Team
            </Text>
          </View>
        </View>

        <View style={[styles.liveBadge, { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.2)' : '#DBEAFE' }]}>
          <Text style={[styles.liveBadgeText, { color: isDark ? '#93C5FD' : '#1D4ED8' }]}>
            {counts.office} at HQ
          </Text>
        </View>
      </View>

      {/* 2. Office Hot-Desking Capacity Meter */}
      <View
        style={[
          styles.capacityBox,
          {
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : '#F8FAFC',
            borderColor: isDark ? '#334155' : '#E2E8F0',
          },
        ]}
      >
        <View style={styles.capacityHeader}>
          <View style={styles.capacityLabelRow}>
            <Feather name="layers" size={14} color={isDark ? '#94A3B8' : '#64748B'} />
            <Text style={[styles.capacityFloorText, { color: isDark ? '#E2E8F0' : '#334155' }]}>
              {capacity.floor}
            </Text>
          </View>
          <Text style={[styles.capacityValueText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            {capacity.occupiedDesks}/{capacity.totalDesks} Desks ({capacityPercent}%)
          </Text>
        </View>

        {/* Capacity Bar */}
        <View style={[styles.capacityTrack, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
          <View
            style={[
              styles.capacityFill,
              {
                width: `${capacityPercent}%`,
                backgroundColor:
                  capacityPercent > 85 ? '#EF4444' : capacityPercent > 65 ? '#F59E0B' : '#10B981',
              },
            ]}
          />
        </View>

        {/* Capacity Action Row */}
        <View style={styles.capacityFooterRow}>
          <View style={styles.hotDeskBadge}>
            <View
              style={[
                styles.dotSmall,
                { backgroundColor: capacity.hotDesksAvailable > 0 ? '#10B981' : '#EF4444' },
              ]}
            />
            <Text style={[styles.hotDeskText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              {capacity.hotDesksAvailable} Hot Desks available
            </Text>
          </View>

          <TactilePressable
            onPress={handleBookDesk}
            style={[
              styles.bookDeskBtn,
              bookedDesk && styles.bookDeskBtnBooked,
              { backgroundColor: bookedDesk ? (isDark ? '#065F46' : '#DCFCE7') : isDark ? '#1E293B' : '#EFF6FF' },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Reserve a hot desk at headquarters"
            testID="book-desk-btn"
          >
            <Feather
              name={bookedDesk ? 'check' : 'plus'}
              size={12}
              color={bookedDesk ? '#10B981' : isDark ? '#60A5FA' : '#2563EB'}
            />
            <Text
              style={[
                styles.bookDeskBtnText,
                { color: bookedDesk ? '#10B981' : isDark ? '#60A5FA' : '#2563EB' },
              ]}
            >
              {bookedDesk ? 'Desk Reserved' : 'Book Desk'}
            </Text>
          </TactilePressable>
        </View>
      </View>

      {/* 3. Filter Segment Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        <TactilePressable
          onPress={() => setSelectedFilter('all')}
          style={[
            styles.filterPill,
            selectedFilter === 'all'
              ? [styles.filterPillActive, { backgroundColor: isDark ? '#2563EB' : '#2563EB' }]
              : [styles.filterPillInactive, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }],
          ]}
          accessibilityRole="tab"
          accessibilityState={{ selected: selectedFilter === 'all' }}
          testID="filter-tab-all"
        >
          <Text
            style={[
              styles.filterPillText,
              selectedFilter === 'all'
                ? styles.filterPillTextActive
                : { color: isDark ? '#94A3B8' : '#64748B' },
            ]}
          >
            All ({counts.all})
          </Text>
        </TactilePressable>

        <TactilePressable
          onPress={() => setSelectedFilter('office')}
          style={[
            styles.filterPill,
            selectedFilter === 'office'
              ? [styles.filterPillActive, { backgroundColor: isDark ? '#2563EB' : '#2563EB' }]
              : [styles.filterPillInactive, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }],
          ]}
          accessibilityRole="tab"
          accessibilityState={{ selected: selectedFilter === 'office' }}
          testID="filter-tab-office"
        >
          <Text
            style={[
              styles.filterPillText,
              selectedFilter === 'office'
                ? styles.filterPillTextActive
                : { color: isDark ? '#94A3B8' : '#64748B' },
            ]}
          >
            🏢 In Office ({counts.office})
          </Text>
        </TactilePressable>

        <TactilePressable
          onPress={() => setSelectedFilter('remote')}
          style={[
            styles.filterPill,
            selectedFilter === 'remote'
              ? [styles.filterPillActive, { backgroundColor: isDark ? '#2563EB' : '#2563EB' }]
              : [styles.filterPillInactive, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }],
          ]}
          accessibilityRole="tab"
          accessibilityState={{ selected: selectedFilter === 'remote' }}
          testID="filter-tab-remote"
        >
          <Text
            style={[
              styles.filterPillText,
              selectedFilter === 'remote'
                ? styles.filterPillTextActive
                : { color: isDark ? '#94A3B8' : '#64748B' },
            ]}
          >
            🏠 Remote ({counts.remote})
          </Text>
        </TactilePressable>

        <TactilePressable
          onPress={() => setSelectedFilter('client')}
          style={[
            styles.filterPill,
            selectedFilter === 'client'
              ? [styles.filterPillActive, { backgroundColor: isDark ? '#2563EB' : '#2563EB' }]
              : [styles.filterPillInactive, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }],
          ]}
          accessibilityRole="tab"
          accessibilityState={{ selected: selectedFilter === 'client' }}
          testID="filter-tab-client"
        >
          <Text
            style={[
              styles.filterPillText,
              selectedFilter === 'client'
                ? styles.filterPillTextActive
                : { color: isDark ? '#94A3B8' : '#64748B' },
            ]}
          >
            📍 Client ({counts.client})
          </Text>
        </TactilePressable>
      </ScrollView>

      {/* 4. Team Members List */}
      <View style={styles.memberList}>
        {filteredList.map((member) => {
          const isBreak = member.status === 'break';
          const isOffice = member.locationType === 'office';
          const isClient = member.locationType === 'client';

          const locationIcon = isOffice ? 'briefcase' : isClient ? 'map-pin' : 'home';
          const locationColor = isOffice ? '#2563EB' : isClient ? '#8B5CF6' : '#10B981';

          return (
            <TactilePressable
              key={member.id}
              onPress={() => handleCardPress(member)}
              style={[
                styles.memberRow,
                {
                  backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${member.name}, ${member.role}, located at ${member.locationDetails}`}
              testID={`member-card-${member.id}`}
            >
              {/* Avatar + Status Indicator */}
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: member.avatarUrl }}
                  style={styles.avatarImg}
                  contentFit="cover"
                  transition={200}
                />
                <View
                  style={[
                    styles.avatarStatusBadge,
                    { backgroundColor: isBreak ? '#F59E0B' : '#10B981' },
                  ]}
                />
              </View>

              {/* Details Column */}
              <View style={styles.memberInfoCol}>
                <View style={styles.memberNameRow}>
                  <Text
                    style={[styles.memberNameText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                    numberOfLines={1}
                  >
                    {member.name}
                  </Text>
                  <View
                    style={[
                      styles.deptBadge,
                      { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0' },
                    ]}
                  >
                    <Text
                      style={[styles.deptBadgeText, { color: isDark ? '#94A3B8' : '#475569' }]}
                    >
                      {member.department}
                    </Text>
                  </View>
                </View>

                {/* Role */}
                <Text
                  style={[styles.memberRoleText, { color: isDark ? '#94A3B8' : '#64748B' }]}
                  numberOfLines={1}
                >
                  {member.role}
                </Text>

                {/* Location Chip */}
                <View style={styles.locationChipRow}>
                  <Feather name={locationIcon} size={12} color={locationColor} />
                  <Text
                    style={[styles.locationChipText, { color: isDark ? '#CBD5E1' : '#334155' }]}
                    numberOfLines={1}
                  >
                    {member.locationDetails}
                  </Text>
                  <Text style={[styles.timeChipText, { color: isDark ? '#64748B' : '#94A3B8' }]}>
                    • {member.checkInTime}
                  </Text>
                </View>

                {/* Collaboration Bubble */}
                <View
                  style={[
                    styles.collabBubble,
                    {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                    },
                  ]}
                >
                  <Text
                    style={[styles.collabBubbleText, { color: isDark ? '#94A3B8' : '#475569' }]}
                    numberOfLines={1}
                  >
                    {member.collaborationStatus}
                  </Text>
                </View>
              </View>

              {/* Quick Ping Action Button */}
              <TactilePressable
                onPress={() => handlePing(member)}
                style={[
                  styles.quickPingBtn,
                  { backgroundColor: isDark ? '#0F172A' : '#EFF6FF' },
                ]}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`Ping ${member.name}`}
                testID={`ping-btn-${member.id}`}
              >
                <Feather name="send" size={14} color={isDark ? '#60A5FA' : '#2563EB'} />
                <Text style={[styles.quickPingText, { color: isDark ? '#60A5FA' : '#2563EB' }]}>
                  Ping
                </Text>
              </TactilePressable>
            </TactilePressable>
          );
        })}
      </View>

      {/* 5. Tomorrow's Hybrid Sync Planner */}
      <View
        style={[
          styles.tomorrowBox,
          {
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.4)' : '#F8FAFC',
            borderColor: isDark ? '#334155' : '#E2E8F0',
          },
        ]}
      >
        <View style={styles.tomorrowHeader}>
          <Feather name="calendar" size={14} color={isDark ? '#60A5FA' : '#2563EB'} />
          <Text style={[styles.tomorrowTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            Tomorrow&apos;s Hybrid Sync
          </Text>
        </View>

        <Text style={[styles.tomorrowHeadline, { color: isDark ? '#94A3B8' : '#64748B' }]}>
          {getTomorrowHeadline(tomorrowPlan, 5)}
        </Text>

        <View style={styles.tomorrowOptionsRow}>
          <TactilePressable
            onPress={() => handleSelectTomorrow('office')}
            style={[
              styles.tomorrowChip,
              tomorrowPlan === 'office'
                ? [styles.tomorrowChipActive, { backgroundColor: isDark ? '#1D4ED8' : '#2563EB' }]
                : { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#CBD5E1' },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Plan to be at HQ tomorrow"
            testID="rsvp-office-btn"
          >
            <Text
              style={[
                styles.tomorrowChipText,
                tomorrowPlan === 'office' ? styles.tomorrowChipTextActive : { color: isDark ? '#E2E8F0' : '#334155' },
              ]}
            >
              🏢 At HQ
            </Text>
          </TactilePressable>

          <TactilePressable
            onPress={() => handleSelectTomorrow('remote')}
            style={[
              styles.tomorrowChip,
              tomorrowPlan === 'remote'
                ? [styles.tomorrowChipActive, { backgroundColor: isDark ? '#1D4ED8' : '#2563EB' }]
                : { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#CBD5E1' },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Plan to work remotely tomorrow"
            testID="rsvp-remote-btn"
          >
            <Text
              style={[
                styles.tomorrowChipText,
                tomorrowPlan === 'remote' ? styles.tomorrowChipTextActive : { color: isDark ? '#E2E8F0' : '#334155' },
              ]}
            >
              🏠 Remote
            </Text>
          </TactilePressable>

          <TactilePressable
            onPress={() => handleSelectTomorrow('client')}
            style={[
              styles.tomorrowChip,
              tomorrowPlan === 'client'
                ? [styles.tomorrowChipActive, { backgroundColor: isDark ? '#1D4ED8' : '#2563EB' }]
                : { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#CBD5E1' },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Plan client visit tomorrow"
            testID="rsvp-client-btn"
          >
            <Text
              style={[
                styles.tomorrowChipText,
                tomorrowPlan === 'client' ? styles.tomorrowChipTextActive : { color: isDark ? '#E2E8F0' : '#334155' },
              ]}
            >
              📍 Client
            </Text>
          </TactilePressable>
        </View>
      </View>

      {/* 6. Member Detail Bottom Sheet Modal */}
      {selectedMember && (
        <AppBottomSheet
          isOpen={Boolean(selectedMember)}
          onClose={() => setSelectedMember(null)}
          title="Teammate Presence"
          testID="member-detail-sheet"
        >
          <View style={styles.sheetContent}>
            {/* Header info */}
            <View style={styles.sheetHeaderRow}>
              <Image
                source={{ uri: selectedMember.avatarUrl }}
                style={styles.sheetAvatar}
                contentFit="cover"
              />
              <View style={styles.sheetHeaderDetails}>
                <Text style={[styles.sheetName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  {selectedMember.name}
                </Text>
                <Text style={[styles.sheetRole, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  {selectedMember.role} • {selectedMember.department}
                </Text>
                <View style={styles.sheetStatusBadge}>
                  <View
                    style={[
                      styles.dotSmall,
                      { backgroundColor: selectedMember.status === 'break' ? '#F59E0B' : '#10B981' },
                    ]}
                  />
                  <Text style={[styles.sheetStatusText, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                    {selectedMember.status === 'break' ? 'On Break' : 'Actively On Duty'} (Checked in {selectedMember.checkInTime})
                  </Text>
                </View>
              </View>
            </View>

            {/* Location & Desk Card */}
            <View
              style={[
                styles.sheetSectionBox,
                { backgroundColor: isDark ? '#1E293B' : '#F1F5F9', borderColor: isDark ? '#334155' : '#E2E8F0' },
              ]}
            >
              <View style={styles.sheetMetaRow}>
                <Feather name="map-pin" size={16} color={isDark ? '#60A5FA' : '#2563EB'} />
                <View style={styles.sheetMetaCol}>
                  <Text style={[styles.sheetMetaLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    Current Work Location
                  </Text>
                  <Text style={[styles.sheetMetaValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    {selectedMember.locationDetails}
                  </Text>
                </View>
              </View>

              {selectedMember.deskId && (
                <View style={[styles.sheetMetaRow, { marginTop: 10 }]}>
                  <Feather name="check-circle" size={16} color="#10B981" />
                  <View style={styles.sheetMetaCol}>
                    <Text style={[styles.sheetMetaLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                      Desk Assignment
                    </Text>
                    <Text style={[styles.sheetMetaValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                      {selectedMember.deskId} (Confirmed Attendance)
                    </Text>
                  </View>
                </View>
              )}

              <View style={[styles.sheetMetaRow, { marginTop: 10 }]}>
                <Feather name="message-circle" size={16} color={isDark ? '#F59E0B' : '#D97706'} />
                <View style={styles.sheetMetaCol}>
                  <Text style={[styles.sheetMetaLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    Collaboration Status
                  </Text>
                  <Text style={[styles.sheetMetaValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    {selectedMember.collaborationStatus}
                  </Text>
                </View>
              </View>
            </View>

            {/* Quick Action Buttons */}
            <View style={styles.sheetActions}>
              <TactilePressable
                onPress={() => {
                  setSelectedMember(null);
                  handlePing(selectedMember);
                }}
                style={[styles.sheetActionBtnPrimary, { backgroundColor: '#2563EB' }]}
                testID="sheet-ping-action"
              >
                <Feather name="send" size={15} color="#FFFFFF" />
                <Text style={styles.sheetActionBtnPrimaryText}>Send Desk Ping 👋</Text>
              </TactilePressable>

              <TactilePressable
                onPress={() => {
                  Alert.alert('1:1 Coffee Sync', `Coffee sync invitation sent to ${selectedMember.name}! ☕`);
                  setSelectedMember(null);
                }}
                style={[
                  styles.sheetActionBtnSecondary,
                  { backgroundColor: isDark ? '#1E293B' : '#EFF6FF', borderColor: isDark ? '#334155' : '#BFDBFE' },
                ]}
                testID="sheet-coffee-action"
              >
                <Feather name="coffee" size={15} color={isDark ? '#60A5FA' : '#2563EB'} />
                <Text style={[styles.sheetActionBtnSecondaryText, { color: isDark ? '#60A5FA' : '#2563EB' }]}>
                  Grab Coffee / Sync ☕
                </Text>
              </TactilePressable>
            </View>
          </View>
        </AppBottomSheet>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radarIconBubble: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWithPulse: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: FontFamily.headingBold,
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    marginTop: 1,
  },
  liveBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  liveBadgeText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
  },
  capacityBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  capacityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  capacityLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  capacityFloorText: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
  },
  capacityValueText: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
  },
  capacityTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  capacityFill: {
    height: '100%',
    borderRadius: 3,
  },
  capacityFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hotDeskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  hotDeskText: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
  },
  bookDeskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bookDeskBtnBooked: {
    borderWidth: 1,
    borderColor: '#10B981',
  },
  bookDeskBtnText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
  },
  filterScroll: {
    gap: 8,
    paddingBottom: 10,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterPillActive: {},
  filterPillInactive: {},
  filterPillText: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontFamily: FontFamily.bold,
  },
  memberList: {
    gap: 8,
    marginTop: 4,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CBD5E1',
  },
  avatarStatusBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  memberInfoCol: {
    flex: 1,
    marginRight: 8,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberNameText: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
  },
  deptBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  deptBadgeText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
  },
  memberRoleText: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    marginTop: 1,
  },
  locationChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  locationChipText: {
    fontSize: 11,
    fontFamily: FontFamily.semiBold,
  },
  timeChipText: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
  },
  collabBubble: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 4,
  },
  collabBubbleText: {
    fontSize: 10,
    fontFamily: FontFamily.medium,
  },
  quickPingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
  },
  quickPingText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
  },
  tomorrowBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginTop: 12,
  },
  tomorrowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tomorrowTitle: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
  },
  tomorrowHeadline: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    marginBottom: 8,
  },
  tomorrowOptionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tomorrowChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  tomorrowChipActive: {
    borderColor: 'transparent',
  },
  tomorrowChipText: {
    fontSize: 11,
    fontFamily: FontFamily.semiBold,
  },
  tomorrowChipTextActive: {
    color: '#FFFFFF',
    fontFamily: FontFamily.bold,
  },
  sheetContent: {
    paddingBottom: 24,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sheetAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#CBD5E1',
  },
  sheetHeaderDetails: {
    flex: 1,
  },
  sheetName: {
    fontSize: 16,
    fontFamily: FontFamily.headingBold,
  },
  sheetRole: {
    fontSize: 12,
    fontFamily: FontFamily.medium,
    marginTop: 2,
  },
  sheetStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  sheetStatusText: {
    fontSize: 11,
    fontFamily: FontFamily.semiBold,
  },
  sheetSectionBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  sheetMetaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  sheetMetaCol: {
    flex: 1,
  },
  sheetMetaLabel: {
    fontSize: 10,
    fontFamily: FontFamily.medium,
  },
  sheetMetaValue: {
    fontSize: 13,
    fontFamily: FontFamily.semiBold,
    marginTop: 1,
  },
  sheetActions: {
    gap: 10,
  },
  sheetActionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  sheetActionBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: FontFamily.bold,
  },
  sheetActionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  sheetActionBtnSecondaryText: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
  },
});
