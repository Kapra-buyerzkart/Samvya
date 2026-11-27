import { TeamRadarCard, type TeamMember } from '@/features/team-radar';
import { AppBottomSheet } from '@/shared/components';
import { FontFamily } from '@/shared/theme';
import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  type HolidayItem,
  type PayslipPreviewSummary,
} from '../homeData';
import {
  getModalItemStyle,
  getModalItemTextStyle,
  styles as screenStyles,
} from '../HomeScreen.styles';
import { type HoursTypeOption, type LocationOption } from '../useHomeScreen';

export interface HomeModalsProps {
  isDark: boolean;
  showHoursModal: boolean;
  showLocationModal: boolean;
  showHolidayModal: boolean;
  showPayslipModal: boolean;
  showTeamModal: boolean;
  hoursType: string;
  workLocation: string;
  hoursOptions: readonly HoursTypeOption[];
  locationOptions: readonly LocationOption[];
  holidays: HolidayItem[];
  payslipPreview: PayslipPreviewSummary;
  onCloseHours: () => void;
  onCloseLocation: () => void;
  onCloseHoliday: () => void;
  onClosePayslip: () => void;
  onCloseTeam: () => void;
  onSelectHoursType: (type: HoursTypeOption) => void;
  onSelectLocation: (loc: LocationOption) => void;
}

type HolidayFilter = 'all' | 'remaining' | 'observed';

export function HomeModals({
  isDark,
  showHoursModal,
  showLocationModal,
  showHolidayModal,
  showPayslipModal,
  showTeamModal,
  hoursType,
  workLocation,
  hoursOptions,
  locationOptions,
  holidays,
  payslipPreview,
  onCloseHours,
  onCloseLocation,
  onCloseHoliday,
  onClosePayslip,
  onCloseTeam,
  onSelectHoursType,
  onSelectLocation,
}: HomeModalsProps): React.JSX.Element {
  const [holidayFilter, setHolidayFilter] = useState<HolidayFilter>('all');

  const filteredHolidays = useMemo(() => {
    if (holidayFilter === 'remaining') {
      return holidays.filter((item) => !item.observed);
    }
    if (holidayFilter === 'observed') {
      return holidays.filter((item) => item.observed);
    }
    return holidays;
  }, [holidayFilter, holidays]);

  const remainingCount = holidays.filter((item) => !item.observed).length;
  const observedCount = holidays.filter((item) => item.observed).length;

  const handleTeamMemberPress = (member: TeamMember): void => {
    Alert.alert(
      member.name,
      `${member.role} (${member.department})\nLocation: ${member.locationDetails}\nStatus: ${member.collaborationStatus}`,
    );
  };

  return (
    <>
      <AppBottomSheet
        isOpen={showHoursModal}
        onClose={onCloseHours}
        title="Select Work Hours"
        testID="hours-bottom-sheet"
      >
        <View style={screenStyles.sheetList}>
          {hoursOptions.map((type) => (
            <TouchableOpacity
              key={type}
              style={getModalItemStyle(isDark, hoursType === type)}
              onPress={() => onSelectHoursType(type)}
              activeOpacity={0.7}
            >
              <Text style={getModalItemTextStyle(isDark, hoursType === type)}>{type}</Text>
              {hoursType === type && (
                <Feather name="check" size={18} color={isDark ? '#60A5FA' : '#1D4ED8'} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </AppBottomSheet>

      <AppBottomSheet
        isOpen={showLocationModal}
        onClose={onCloseLocation}
        title="Select Work Location"
        testID="location-bottom-sheet"
      >
        <View style={screenStyles.sheetList}>
          {locationOptions.map((loc) => (
            <TouchableOpacity
              key={loc}
              style={getModalItemStyle(isDark, workLocation === loc)}
              onPress={() => onSelectLocation(loc)}
              activeOpacity={0.7}
            >
              <Text style={getModalItemTextStyle(isDark, workLocation === loc)}>{loc}</Text>
              {workLocation === loc && (
                <Feather name="check" size={18} color={isDark ? '#60A5FA' : '#1D4ED8'} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </AppBottomSheet>

      <AppBottomSheet
        isOpen={showHolidayModal}
        onClose={onCloseHoliday}
        title="Holiday Calendar 2026"
        testID="holiday-calendar-sheet"
      >
        <View style={styles.filterRow}>
          {(
            [
              { key: 'all', label: `All (${holidays.length})` },
              { key: 'remaining', label: `Remaining (${remainingCount})` },
              { key: 'observed', label: `Observed (${observedCount})` },
            ] as const
          ).map((tab) => {
            const active = holidayFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active
                      ? '#1D4ED8'
                      : isDark
                        ? '#0F172A'
                        : '#EFF4FF',
                  },
                ]}
                onPress={() => setHolidayFilter(tab.key)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: active ? '#FFFFFF' : isDark ? '#CBD5E1' : '#1D4ED8' },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView
          style={styles.holidayScroll}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {filteredHolidays.map((holiday) => (
            <View
              key={holiday.id}
              style={[
                styles.holidayRow,
                {
                  backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                  borderColor: isDark ? '#1E293B' : '#E2E8F0',
                },
              ]}
            >
              <View style={styles.holidayLeft}>
                <Text style={[styles.holidayName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  {holiday.name}
                </Text>
                <Text style={[styles.holidayMeta, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  {holiday.dayName}, {holiday.dateLabel} · {holiday.type}
                </Text>
              </View>
              <View
                style={[
                  styles.holidayStatusPill,
                  {
                    backgroundColor: holiday.observed
                      ? isDark
                        ? '#1E293B'
                        : '#E2E8F0'
                      : isDark
                        ? 'rgba(16, 185, 129, 0.2)'
                        : '#DCFCE7',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.holidayStatusText,
                    {
                      color: holiday.observed
                        ? isDark
                          ? '#94A3B8'
                          : '#475569'
                        : isDark
                          ? '#34D399'
                          : '#15803D',
                    },
                  ]}
                >
                  {holiday.observed ? 'Observed' : 'Upcoming'}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </AppBottomSheet>

      <AppBottomSheet
        isOpen={showPayslipModal}
        onClose={onClosePayslip}
        title="Payslip Preview"
        testID="payslip-preview-sheet"
      >
        <View
          style={[
            styles.payslipCard,
            {
              backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
              borderColor: isDark ? '#1E293B' : '#E2E8F0',
            },
          ]}
        >
          <View style={styles.payslipTopRow}>
            <Text style={[styles.payslipMonth, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              {payslipPreview.monthLabel}
            </Text>
            <View style={styles.payslipBadge}>
              <Text style={styles.payslipBadgeText}>{payslipPreview.status}</Text>
            </View>
          </View>
          <View style={styles.payslipStatRow}>
            <Text style={[styles.payslipLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Gross earnings
            </Text>
            <Text style={[styles.payslipVal, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              {payslipPreview.grossEarnings}
            </Text>
          </View>
          <View style={styles.payslipStatRow}>
            <Text style={[styles.payslipLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Deductions
            </Text>
            <Text style={[styles.payslipVal, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              {payslipPreview.deductions}
            </Text>
          </View>
          <View style={styles.payslipStatRow}>
            <Text style={[styles.payslipLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Pay date
            </Text>
            <Text style={[styles.payslipVal, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              {payslipPreview.payDate}
            </Text>
          </View>
        </View>
        <Text style={[styles.payslipNote, { color: isDark ? '#94A3B8' : '#64748B' }]}>
          Detailed itemized payslips and PDF download will unlock once Payroll API sync is connected.
        </Text>
      </AppBottomSheet>

      <AppBottomSheet
        isOpen={showTeamModal}
        onClose={onCloseTeam}
        title="Team Presence & Radar"
        testID="team-radar-sheet"
      >
        <ScrollView
          style={styles.teamScroll}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          <TeamRadarCard
            showMemberDetailSheet={false}
            onMemberPress={handleTeamMemberPress}
          />
        </ScrollView>
      </AppBottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  filterChipText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
  },
  holidayScroll: {
    maxHeight: 360,
  },
  holidayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  holidayLeft: {
    flex: 1,
    paddingRight: 8,
  },
  holidayName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13.5,
    marginBottom: 2,
  },
  holidayMeta: {
    fontFamily: FontFamily.regular,
    fontSize: 11.5,
  },
  holidayStatusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  holidayStatusText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
  },
  payslipCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 8,
  },
  payslipTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  payslipMonth: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
  },
  payslipBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  payslipBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#15803D',
  },
  payslipStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payslipLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
  },
  payslipVal: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13.5,
    fontVariant: ['tabular-nums'],
  },
  payslipNote: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 6,
  },
  teamScroll: {
    maxHeight: 460,
  },
});
