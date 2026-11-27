import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { PulsingStatusDot, TactilePressable } from '@/shared/animations';
import { AppBottomSheet } from '@/shared/components';
import { getTomorrowHeadline } from '../../domain/teamRadarData';
import { type TomorrowPlan, type WorkLocationType } from '../../domain/types';
import {
  getBookDeskBtnStyle,
  getBookDeskBtnTextStyle,
  getCapacityBoxStyle,
  getCapacityFillStyle,
  getCapacityFloorTextStyle,
  getCapacityTrackStyle,
  getCapacityValueTextStyle,
  getCardContainerStyle,
  getCollabBubbleStyle,
  getCollabBubbleTextStyle,
  getDeptBadgeStyle,
  getDeptBadgeTextStyle,
  getFilterPillStyle,
  getFilterPillTextStyle,
  getHotDeskTextStyle,
  getLiveBadgeStyle,
  getLiveBadgeTextStyle,
  getLocationChipTextStyle,
  getMemberNameTextStyle,
  getMemberRoleTextStyle,
  getMemberRowStyle,
  getQuickPingBtnStyle,
  getQuickPingTextStyle,
  getRadarIconBubbleStyle,
  getSectionSubtitleStyle,
  getSectionTitleStyle,
  getSheetActionBtnSecondaryStyle,
  getSheetActionBtnSecondaryTextStyle,
  getSheetMetaLabelStyle,
  getSheetMetaValueStyle,
  getSheetNameStyle,
  getSheetRoleStyle,
  getSheetSectionBoxStyle,
  getSheetStatusTextStyle,
  getTimeChipTextStyle,
  getTomorrowBoxStyle,
  getTomorrowChipStyle,
  getTomorrowChipTextStyle,
  getTomorrowHeadlineStyle,
  getTomorrowTitleStyle,
  styles,
} from './TeamRadarCard.styles';
import { type TeamRadarCardProps, useTeamRadarCard } from './useTeamRadarCard';

export type { TeamRadarCardProps };

const FILTER_OPTIONS: { key: 'all' | WorkLocationType; label: string; testID: string }[] = [
  { key: 'all', label: 'All', testID: 'filter-tab-all' },
  { key: 'office', label: '🏢 In Office', testID: 'filter-tab-office' },
  { key: 'remote', label: '🏠 Remote', testID: 'filter-tab-remote' },
  { key: 'client', label: '📍 Client', testID: 'filter-tab-client' },
];

const TOMORROW_OPTIONS: {
  plan: Exclude<TomorrowPlan, null>;
  label: string;
  accessibilityLabel: string;
  testID: string;
}[] = [
  {
    plan: 'office',
    label: '🏢 At HQ',
    accessibilityLabel: 'Plan to be at HQ tomorrow',
    testID: 'rsvp-office-btn',
  },
  {
    plan: 'remote',
    label: '🏠 Remote',
    accessibilityLabel: 'Plan to work remotely tomorrow',
    testID: 'rsvp-remote-btn',
  },
  {
    plan: 'client',
    label: '📍 Client',
    accessibilityLabel: 'Plan client visit tomorrow',
    testID: 'rsvp-client-btn',
  },
];

export function TeamRadarCard({
  onMemberPress,
  onPingPress,
  showMemberDetailSheet = true,
}: TeamRadarCardProps): React.JSX.Element {
  const {
    isDark,
    capacity,
    selectedFilter,
    selectedMember,
    tomorrowPlan,
    bookedDesk,
    counts,
    filteredList,
    capacityPercent,
    setSelectedFilter,
    setSelectedMember,
    handlePing,
    handleCardPress,
    handleBookDesk,
    handleSelectTomorrow,
    handleSheetPing,
    handleCoffeeSync,
  } = useTeamRadarCard({ onMemberPress, onPingPress });

  return (
    <View style={getCardContainerStyle(isDark)} testID="team-radar-card">
      <View style={styles.headerRow}>
        <View style={styles.headerTitleLeft}>
          <View style={getRadarIconBubbleStyle(isDark)}>
            <Feather name="radio" size={17} color={isDark ? '#60A5FA' : '#2563EB'} />
          </View>
          <View>
            <View style={styles.titleWithPulse}>
              <Text style={getSectionTitleStyle(isDark)}>Team Presence Radar</Text>
              <PulsingStatusDot color="#10B981" size={7} />
            </View>
            <Text style={getSectionSubtitleStyle(isDark)}>Engineering &amp; Product Team</Text>
          </View>
        </View>

        <View style={getLiveBadgeStyle(isDark)}>
          <Text style={getLiveBadgeTextStyle(isDark)}>{counts.office} at HQ</Text>
        </View>
      </View>

      <View style={getCapacityBoxStyle(isDark)}>
        <View style={styles.capacityHeader}>
          <View style={styles.capacityLabelRow}>
            <Feather name="layers" size={14} color={isDark ? '#94A3B8' : '#64748B'} />
            <Text style={getCapacityFloorTextStyle(isDark)}>{capacity.floor}</Text>
          </View>
          <Text style={getCapacityValueTextStyle(isDark)}>
            {capacity.occupiedDesks}/{capacity.totalDesks} Desks ({capacityPercent}%)
          </Text>
        </View>

        <View style={getCapacityTrackStyle(isDark)}>
          <View style={getCapacityFillStyle(capacityPercent)} />
        </View>

        <View style={styles.capacityFooterRow}>
          <View style={styles.hotDeskBadge}>
            <View
              style={[
                styles.dotSmall,
                { backgroundColor: capacity.hotDesksAvailable > 0 ? '#10B981' : '#EF4444' },
              ]}
            />
            <Text style={getHotDeskTextStyle(isDark)}>
              {capacity.hotDesksAvailable} Hot Desks available
            </Text>
          </View>

          <TactilePressable
            onPress={handleBookDesk}
            style={getBookDeskBtnStyle(isDark, bookedDesk)}
            accessibilityRole="button"
            accessibilityLabel="Reserve a hot desk at headquarters"
            testID="book-desk-btn"
          >
            <Feather
              name={bookedDesk ? 'check' : 'plus'}
              size={12}
              color={bookedDesk ? '#10B981' : isDark ? '#60A5FA' : '#2563EB'}
            />
            <Text style={getBookDeskBtnTextStyle(isDark, bookedDesk)}>
              {bookedDesk ? 'Desk Reserved' : 'Book Desk'}
            </Text>
          </TactilePressable>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {FILTER_OPTIONS.map((option) => {
          const isSelected = selectedFilter === option.key;
          return (
            <TactilePressable
              key={option.key}
              onPress={() => setSelectedFilter(option.key)}
              style={getFilterPillStyle(isDark, isSelected)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              testID={option.testID}
            >
              <Text style={getFilterPillTextStyle(isDark, isSelected)}>
                {option.label} ({counts[option.key]})
              </Text>
            </TactilePressable>
          );
        })}
      </ScrollView>

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
              style={getMemberRowStyle(isDark)}
              accessibilityRole="button"
              accessibilityLabel={`${member.name}, ${member.role}, located at ${member.locationDetails}`}
              testID={`member-card-${member.id}`}
            >
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

              <View style={styles.memberInfoCol}>
                <View style={styles.memberNameRow}>
                  <Text style={getMemberNameTextStyle(isDark)} numberOfLines={1}>
                    {member.name}
                  </Text>
                  <View style={getDeptBadgeStyle(isDark)}>
                    <Text style={getDeptBadgeTextStyle(isDark)}>{member.department}</Text>
                  </View>
                </View>

                <Text style={getMemberRoleTextStyle(isDark)} numberOfLines={1}>
                  {member.role}
                </Text>

                <View style={styles.locationChipRow}>
                  <Feather name={locationIcon} size={12} color={locationColor} />
                  <Text style={getLocationChipTextStyle(isDark)} numberOfLines={1}>
                    {member.locationDetails}
                  </Text>
                  <Text style={getTimeChipTextStyle(isDark)}>• {member.checkInTime}</Text>
                </View>

                <View style={getCollabBubbleStyle(isDark)}>
                  <Text style={getCollabBubbleTextStyle(isDark)} numberOfLines={1}>
                    {member.collaborationStatus}
                  </Text>
                </View>
              </View>

              <TactilePressable
                onPress={() => handlePing(member)}
                style={getQuickPingBtnStyle(isDark)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`Ping ${member.name}`}
                testID={`ping-btn-${member.id}`}
              >
                <Feather name="send" size={14} color={isDark ? '#60A5FA' : '#2563EB'} />
                <Text style={getQuickPingTextStyle(isDark)}>Ping</Text>
              </TactilePressable>
            </TactilePressable>
          );
        })}
      </View>

      <View style={getTomorrowBoxStyle(isDark)}>
        <View style={styles.tomorrowHeader}>
          <Feather name="calendar" size={14} color={isDark ? '#60A5FA' : '#2563EB'} />
          <Text style={getTomorrowTitleStyle(isDark)}>Tomorrow&apos;s Hybrid Sync</Text>
        </View>

        <Text style={getTomorrowHeadlineStyle(isDark)}>
          {getTomorrowHeadline(tomorrowPlan, 5)}
        </Text>

        <View style={styles.tomorrowOptionsRow}>
          {TOMORROW_OPTIONS.map((item) => {
            const isSelected = tomorrowPlan === item.plan;
            return (
              <TactilePressable
                key={item.plan}
                onPress={() => handleSelectTomorrow(item.plan)}
                style={getTomorrowChipStyle(isDark, isSelected)}
                accessibilityRole="button"
                accessibilityLabel={item.accessibilityLabel}
                testID={item.testID}
              >
                <Text style={getTomorrowChipTextStyle(isDark, isSelected)}>{item.label}</Text>
              </TactilePressable>
            );
          })}
        </View>
      </View>

      {showMemberDetailSheet && selectedMember && (
        <AppBottomSheet
          isOpen={Boolean(selectedMember)}
          onClose={() => setSelectedMember(null)}
          title="Teammate Presence"
          testID="member-detail-sheet"
        >
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeaderRow}>
              <Image
                source={{ uri: selectedMember.avatarUrl }}
                style={styles.sheetAvatar}
                contentFit="cover"
              />
              <View style={styles.sheetHeaderDetails}>
                <Text style={getSheetNameStyle(isDark)}>{selectedMember.name}</Text>
                <Text style={getSheetRoleStyle(isDark)}>
                  {selectedMember.role} • {selectedMember.department}
                </Text>
                <View style={styles.sheetStatusBadge}>
                  <View
                    style={[
                      styles.dotSmall,
                      { backgroundColor: selectedMember.status === 'break' ? '#F59E0B' : '#10B981' },
                    ]}
                  />
                  <Text style={getSheetStatusTextStyle(isDark)}>
                    {selectedMember.status === 'break' ? 'On Break' : 'Actively On Duty'} (Checked in {selectedMember.checkInTime})
                  </Text>
                </View>
              </View>
            </View>

            <View style={getSheetSectionBoxStyle(isDark)}>
              <View style={styles.sheetMetaRow}>
                <Feather name="map-pin" size={16} color={isDark ? '#60A5FA' : '#2563EB'} />
                <View style={styles.sheetMetaCol}>
                  <Text style={getSheetMetaLabelStyle(isDark)}>Current Work Location</Text>
                  <Text style={getSheetMetaValueStyle(isDark)}>
                    {selectedMember.locationDetails}
                  </Text>
                </View>
              </View>

              {selectedMember.deskId && (
                <View style={styles.sheetMetaRowSpaced}>
                  <Feather name="check-circle" size={16} color="#10B981" />
                  <View style={styles.sheetMetaCol}>
                    <Text style={getSheetMetaLabelStyle(isDark)}>Desk Assignment</Text>
                    <Text style={getSheetMetaValueStyle(isDark)}>
                      {selectedMember.deskId} (Confirmed Attendance)
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.sheetMetaRowSpaced}>
                <Feather name="message-circle" size={16} color={isDark ? '#F59E0B' : '#D97706'} />
                <View style={styles.sheetMetaCol}>
                  <Text style={getSheetMetaLabelStyle(isDark)}>Collaboration Status</Text>
                  <Text style={getSheetMetaValueStyle(isDark)}>
                    {selectedMember.collaborationStatus}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.sheetActions}>
              <TactilePressable
                onPress={() => handleSheetPing(selectedMember)}
                style={styles.sheetActionBtnPrimary}
                testID="sheet-ping-action"
              >
                <Feather name="send" size={15} color="#FFFFFF" />
                <Text style={styles.sheetActionBtnPrimaryText}>Send Desk Ping 👋</Text>
              </TactilePressable>

              <TactilePressable
                onPress={() => handleCoffeeSync(selectedMember)}
                style={getSheetActionBtnSecondaryStyle(isDark)}
                testID="sheet-coffee-action"
              >
                <Feather name="coffee" size={15} color={isDark ? '#60A5FA' : '#2563EB'} />
                <Text style={getSheetActionBtnSecondaryTextStyle(isDark)}>
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
