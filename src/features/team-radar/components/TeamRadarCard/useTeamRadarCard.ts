import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useAppTheme } from '@/shared/theme';
import {
  filterMembers,
  getLocationCounts,
  INITIAL_OFFICE_CAPACITY,
  INITIAL_TEAM_MEMBERS,
  simulateDeskReservation,
  simulatePingMember,
} from '../../domain/teamRadarData';
import { TeamMember, TomorrowPlan, WorkLocationType } from '../../domain/types';

export interface TeamRadarCardProps {
  onMemberPress?: (member: TeamMember) => void;
  onPingPress?: (member: TeamMember) => void;
  showMemberDetailSheet?: boolean;
}

export function useTeamRadarCard({ onMemberPress, onPingPress }: TeamRadarCardProps) {
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

  const handleSheetPing = useCallback(
    (member: TeamMember) => {
      setSelectedMember(null);
      handlePing(member);
    },
    [handlePing],
  );

  const handleCoffeeSync = useCallback((member: TeamMember) => {
    Alert.alert('1:1 Coffee Sync', `Coffee sync invitation sent to ${member.name}! ☕`);
    setSelectedMember(null);
  }, []);

  return {
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
  };
}
