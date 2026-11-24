import { AppBottomSheet } from '@/shared/components';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { type LeaveHistoryRecord } from '../../../model/leaveHistoryData';
import {
  getCloseBtnStyle,
  getDescriptionBoxStyle,
  getDescriptionTextStyle,
  getDividerStyle,
  getDocIconBoxStyle,
  getMetricLabelStyle,
  getMetricValueStyle,
  getMetricsBoxStyle,
  getSectionTitleStyle,
  getSubtitleTextStyle,
  getTitleTextStyle,
  styles,
} from './LeaveDetailModal.styles';

export interface LeaveDetailModalProps {
  isOpen: boolean;
  record: LeaveHistoryRecord | null;
  isDark: boolean;
  onClose: () => void;
}

export function LeaveDetailModal({
  isOpen,
  record,
  isDark,
  onClose,
}: LeaveDetailModalProps): React.JSX.Element | null {
  if (!record) {
    return null;
  }

  const formattedDate = `${record.dateDisplay.replace('-', ' - ')} ${record.monthDisplay}`;
  const leaveType = record.leaveType || 'Sick \n leave';

  return (
    <AppBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      showHandle={true}
      showCloseButton={false}
      detents={[0, 'content']}
      testID="leave-detail-bottom-sheet"
    >
      <View style={styles.sheetContent}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={[styles.docIconBox, getDocIconBoxStyle(isDark)]}>
              <Feather name="file-text" size={20} color={isDark ? '#60A5FA' : '#1D4ED8'} />
            </View>
            <View style={styles.headerTextCol}>
              <Text style={[styles.headerTitle, getTitleTextStyle(isDark)]}>Leave History</Text>
              <Text style={[styles.headerSubtitle, getSubtitleTextStyle(isDark)]}>
                leaves from the selected time
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.closeBtn, getCloseBtnStyle(isDark)]}
            onPress={onClose}
            activeOpacity={0.7}
            testID="leave-detail-close-btn"
            accessibilityRole="button"
            accessibilityLabel="Close leave details"
          >
            <Feather name="x" size={18} color={isDark ? '#94A3B8' : '#64748B'} />
          </TouchableOpacity>
        </View>

        <View style={[styles.metricsBox, getMetricsBoxStyle(isDark)]}>
          <View style={styles.metricCol}>
            <Text style={[styles.metricLabel, getMetricLabelStyle(isDark)]}>Number of days</Text>
            <Text style={[styles.metricValue, getMetricValueStyle(isDark)]}>
              {record.durationLabel}
            </Text>
          </View>

          <View style={[styles.divider, getDividerStyle(isDark)]} />

          <View style={styles.metricColCenter}>
            <Text style={[styles.metricLabel, getMetricLabelStyle(isDark)]}>Date of leave</Text>
            <Text style={[styles.metricValue, getMetricValueStyle(isDark)]}>{formattedDate}</Text>
          </View>

          <View style={[styles.divider, getDividerStyle(isDark)]} />

          <View style={styles.metricCol}>
            <Text style={[styles.metricLabel, getMetricLabelStyle(isDark)]}>Leave type</Text>
            <Text style={[styles.metricValue, getMetricValueStyle(isDark)]}> {leaveType}</Text>
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeaderTitle, getSectionTitleStyle(isDark)]}>
            Reason requested
          </Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{record.status}</Text>
          </View>
        </View>

        <View style={[styles.descriptionBox, getDescriptionBoxStyle(isDark)]}>
          <Text style={[styles.descriptionText, getDescriptionTextStyle(isDark)]}>
            {record.reasonDescription}
          </Text>
        </View>
      </View>
    </AppBottomSheet>
  );
}
