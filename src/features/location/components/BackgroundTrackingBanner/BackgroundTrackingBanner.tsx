import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, ThemedText } from '@/shared/components';
import { useAppTheme } from '@/shared/theme';
import { TrackingSessionState } from '../../domain/types';

interface BackgroundTrackingBannerProps {
  session: TrackingSessionState | null;
}

export function BackgroundTrackingBanner({
  session,
}: BackgroundTrackingBannerProps): React.JSX.Element | null {
  const theme = useAppTheme();
  const isDark = theme.isDark;

  if (!session || session.status !== 'tracking') {
    return null;
  }

  const isStationary = session.lastFix?.isStationary ?? false;
  const accuracy = session.lastFix?.accuracy
    ? `±${Math.round(session.lastFix.accuracy)}m`
    : 'Acquiring';

  return (
    <Card
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
          borderColor: isDark ? '#334155' : '#E2E8F0',
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.indicatorContainer}>
          <View style={[styles.pulseDot, styles.pulseDotActive]} />
          <ThemedText
            variant="body"
            style={[styles.title, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
          >
            Live Route Tracking Active
          </ThemedText>
        </View>
        <View
          style={[
            styles.badge,
            { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
          ]}
        >
          <ThemedText
            variant="caption"
            style={[styles.badgeText, { color: isDark ? '#94A3B8' : '#475569' }]}
          >
            {isStationary ? 'Stationary (Power Save)' : 'Moving'}
          </ThemedText>
        </View>
      </View>

      <ThemedText
        variant="caption"
        style={[styles.subtext, { color: isDark ? '#94A3B8' : '#475569' }]}
      >
        On-duty tracking • Fix accuracy: {accuracy} • {session.pointsRecorded} breadcrumbs logged
      </ThemedText>

      <ThemedText variant="caption" style={styles.privacyNotice}>
        Tracking stops automatically when you clock out.
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#059669', // Emerald active
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#94A3B8',
    marginRight: 8,
  },
  pulseDotActive: {
    backgroundColor: '#10B981',
  },
  title: {
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  subtext: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  privacyNotice: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
