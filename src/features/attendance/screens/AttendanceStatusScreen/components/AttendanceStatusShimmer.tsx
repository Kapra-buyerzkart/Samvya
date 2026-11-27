import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ShimmerBar, useShimmerProgress } from '@/shared/components';

export function AttendanceStatusShimmer({ isDark }: { isDark: boolean }): React.JSX.Element {
  const progress = useShimmerProgress();
  const cardBg = isDark ? '#0F172A' : '#FFFFFF';
  const cardBorder = isDark ? '#1E293B' : '#E2E8F0';
  const summaryBg = isDark ? 'rgba(30, 41, 59, 0.78)' : '#EDF2FD';
  const summaryBorder = isDark ? '#334155' : '#D6E2FA';

  return (
    <View testID="attendance-status-shimmer" accessibilityLabel="Loading attendance status">
      {/* Summary Banner Shimmer */}
      <View
        style={[
          styles.summaryCard,
          { backgroundColor: summaryBg, borderColor: summaryBorder },
        ]}
      >
        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.metricCol}>
            <ShimmerBar width={48} height={22} borderRadius={6} isDark={isDark} progress={progress} />
            <ShimmerBar
              width={64}
              height={11}
              borderRadius={5}
              isDark={isDark}
              progress={progress}
              style={styles.mt6}
            />
          </View>
        ))}
      </View>

      {/* Calendar Card Shimmer */}
      <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <View style={styles.weekdaysRow}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <ShimmerBar
              key={i}
              width={28}
              height={12}
              borderRadius={4}
              isDark={isDark}
              progress={progress}
            />
          ))}
        </View>
        {[0, 1, 2, 3].map((row) => (
          <View key={row} style={styles.calRow}>
            {[0, 1, 2, 3, 4, 5, 6].map((col) => (
              <ShimmerBar
                key={col}
                width={30}
                height={30}
                borderRadius={15}
                isDark={isDark}
                progress={progress}
              />
            ))}
          </View>
        ))}
      </View>

      {/* Punch Details Card Shimmer */}
      <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <View style={styles.rowBetween}>
          <View>
            <ShimmerBar width={130} height={18} borderRadius={6} isDark={isDark} progress={progress} />
            <ShimmerBar
              width={90}
              height={12}
              borderRadius={5}
              isDark={isDark}
              progress={progress}
              style={styles.mt6}
            />
          </View>
          <ShimmerBar width={74} height={22} borderRadius={11} isDark={isDark} progress={progress} />
        </View>

        {[0, 1].map((i) => (
          <View key={i} style={styles.punchRow}>
            <ShimmerBar width={48} height={48} borderRadius={14} isDark={isDark} progress={progress} />
            <View style={styles.punchMeta}>
              <ShimmerBar width={84} height={15} borderRadius={5} isDark={isDark} progress={progress} />
              <ShimmerBar
                width={58}
                height={12}
                borderRadius={5}
                isDark={isDark}
                progress={progress}
                style={styles.mt6}
              />
            </View>
            <ShimmerBar width={64} height={18} borderRadius={6} isDark={isDark} progress={progress} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  punchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  punchMeta: {
    flex: 1,
    marginLeft: 14,
  },
  mt6: {
    marginTop: 6,
  },
});
