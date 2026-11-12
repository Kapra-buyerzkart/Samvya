import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, ThemedText } from '@/shared/components';
import { TrackingSessionState } from '../domain/types';

interface BackgroundTrackingBannerProps {
  session: TrackingSessionState | null;
}

export function BackgroundTrackingBanner({
  session,
}: BackgroundTrackingBannerProps): React.JSX.Element | null {
  if (!session || session.status !== 'tracking') {
    return null;
  }

  const isStationary = session.lastFix?.isStationary ?? false;
  const accuracy = session.lastFix?.accuracy
    ? `±${Math.round(session.lastFix.accuracy)}m`
    : 'Acquiring';

  return (
    <Card style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.indicatorContainer}>
          <View style={[styles.pulseDot, styles.pulseDotActive]} />
          <ThemedText variant="body" style={styles.title}>
            Live Route Tracking Active
          </ThemedText>
        </View>
        <View style={styles.badge}>
          <ThemedText variant="caption" style={styles.badgeText}>
            {isStationary ? 'Stationary (Power Save)' : 'Moving'}
          </ThemedText>
        </View>
      </View>

      <ThemedText variant="caption" style={styles.subtext}>
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
    backgroundColor: '#0F172A',
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
    color: '#F8FAFC',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#1E293B',
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
