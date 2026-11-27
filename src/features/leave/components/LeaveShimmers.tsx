import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ShimmerBar, useShimmerProgress } from '@/shared/components';

export function LeaveStatusShimmer({ isDark }: { isDark: boolean }): React.JSX.Element {
  const progress = useShimmerProgress();
  const cardBg = isDark ? '#0F172A' : '#FFFFFF';
  const cardBorder = isDark ? '#1E293B' : '#E2E8F0';

  return (
    <View testID="leave-status-shimmer" accessibilityLabel="Loading leave status">
      {/* Summary & Actions Card Shimmer */}
      <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <View style={styles.rowBetween}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.colStart}>
              <ShimmerBar width={42} height={34} borderRadius={8} isDark={isDark} progress={progress} />
              <ShimmerBar
                width={70}
                height={12}
                borderRadius={5}
                isDark={isDark}
                progress={progress}
                style={styles.mt6}
              />
            </View>
          ))}
        </View>
        <View style={styles.btnRow}>
          <ShimmerBar width="48%" height={44} borderRadius={12} isDark={isDark} progress={progress} />
          <ShimmerBar width="48%" height={44} borderRadius={12} isDark={isDark} progress={progress} />
        </View>
      </View>

      {/* Calendar Shimmer */}
      <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <View style={styles.weekdaysRow}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <ShimmerBar key={i} width={28} height={12} borderRadius={4} isDark={isDark} progress={progress} />
          ))}
        </View>
        {[0, 1, 2, 3].map((row) => (
          <View key={row} style={styles.calRow}>
            {[0, 1, 2, 3, 4, 5, 6].map((col) => (
              <ShimmerBar key={col} width={30} height={30} borderRadius={15} isDark={isDark} progress={progress} />
            ))}
          </View>
        ))}
      </View>

      {/* Approval Status Card Shimmer */}
      <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <ShimmerBar width={140} height={20} borderRadius={6} isDark={isDark} progress={progress} />
        <ShimmerBar
          width={190}
          height={12}
          borderRadius={5}
          isDark={isDark}
          progress={progress}
          style={styles.mt6}
        />
        <View style={styles.timelineGroup}>
          {[0, 1].map((i) => (
            <View key={i} style={styles.timelineRow}>
              <ShimmerBar width={34} height={34} borderRadius={9} isDark={isDark} progress={progress} />
              <ShimmerBar
                width="78%"
                height={16}
                borderRadius={6}
                isDark={isDark}
                progress={progress}
                style={styles.ml12}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export function LeaveHistoryShimmer({ isDark }: { isDark: boolean }): React.JSX.Element {
  const progress = useShimmerProgress();
  const cardBg = isDark ? '#0F172A' : '#FFFFFF';
  const cardBorder = isDark ? '#1E293B' : '#E2E8F0';

  return (
    <View testID="leave-history-shimmer" accessibilityLabel="Loading leave history">
      <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <ShimmerBar width={130} height={16} borderRadius={6} isDark={isDark} progress={progress} />
        <View style={styles.pieShimmerRow}>
          <ShimmerBar width={116} height={116} borderRadius={58} isDark={isDark} progress={progress} />
          <View style={styles.pieLegendCol}>
            {[0, 1, 2].map((i) => (
              <ShimmerBar
                key={i}
                width="100%"
                height={14}
                borderRadius={5}
                isDark={isDark}
                progress={progress}
                style={styles.mb10}
              />
            ))}
          </View>
        </View>
      </View>

      {[0, 1, 2].map((i) => (
        <View key={i} style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <View style={styles.rowBetween}>
            <ShimmerBar width={120} height={16} borderRadius={6} isDark={isDark} progress={progress} />
            <ShimmerBar width={74} height={22} borderRadius={11} isDark={isDark} progress={progress} />
          </View>
          <ShimmerBar
            width={160}
            height={12}
            borderRadius={5}
            isDark={isDark}
            progress={progress}
            style={styles.mt10}
          />
        </View>
      ))}
    </View>
  );
}

export function RequestLeaveShimmer({ isDark }: { isDark: boolean }): React.JSX.Element {
  const progress = useShimmerProgress();
  const cardBg = isDark ? '#0F172A' : '#FFFFFF';
  const cardBorder = isDark ? '#1E293B' : '#E2E8F0';

  return (
    <View testID="request-leave-shimmer" accessibilityLabel="Loading leave balances">
      <View style={[styles.summaryStrip, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.colCenter}>
            <ShimmerBar width={52} height={12} borderRadius={5} isDark={isDark} progress={progress} />
            <ShimmerBar
              width={44}
              height={18}
              borderRadius={6}
              isDark={isDark}
              progress={progress}
              style={styles.mt6}
            />
          </View>
        ))}
      </View>

      <View style={[styles.typeCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <ShimmerBar width={40} height={40} borderRadius={12} isDark={isDark} progress={progress} />
        <View style={styles.ml12}>
          <ShimmerBar width={130} height={16} borderRadius={6} isDark={isDark} progress={progress} />
          <ShimmerBar
            width={88}
            height={12}
            borderRadius={5}
            isDark={isDark}
            progress={progress}
            style={styles.mt6}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  summaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colStart: {
    alignItems: 'flex-start',
  },
  colCenter: {
    flex: 1,
    alignItems: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
  timelineGroup: {
    marginTop: 18,
    gap: 14,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieShimmerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 18,
  },
  pieLegendCol: {
    flex: 1,
  },
  mt6: {
    marginTop: 6,
  },
  mt10: {
    marginTop: 10,
  },
  ml12: {
    marginLeft: 12,
  },
  mb10: {
    marginBottom: 10,
  },
});
