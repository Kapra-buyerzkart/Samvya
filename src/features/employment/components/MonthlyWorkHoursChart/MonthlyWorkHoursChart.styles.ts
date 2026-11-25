import { StyleSheet } from 'react-native';
import { FontFamily } from '@/shared/theme';

export const CHART_HEIGHT = 130;
export const Y_AXIS_LABELS = ['8h', '6h', '4h', '2h', '0h'];
export const BAR_WIDTH = 13;
export const COLUMN_WIDTH = 26;

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 12,
  },
  plotContainer: {
    flexDirection: 'row',
    height: CHART_HEIGHT + 48,
    position: 'relative',
  },
  yAxisColumn: {
    width: 26,
    height: CHART_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 2,
  },
  yAxisLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    lineHeight: 12,
  },
  chartWrapper: {
    flex: 1,
    position: 'relative',
    height: CHART_HEIGHT + 36,
  },
  gridlinesLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: CHART_HEIGHT,
  },
  gridline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderWidth: 0.5,
    borderStyle: 'dashed',
  },
  scrollContent: {
    paddingHorizontal: 4,
    alignItems: 'flex-end',
    height: CHART_HEIGHT + 36,
  },
  barColumn: {
    width: COLUMN_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: CHART_HEIGHT + 36,
  },
  barTrackArea: {
    height: CHART_HEIGHT,
    width: COLUMN_WIDTH,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  solidBar: {
    width: BAR_WIDTH,
    borderRadius: 7,
  },
  noEntryBar: {
    width: BAR_WIDTH,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  barSelectedRing: {
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  xAxisLabelContainer: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  xAxisLabel: {
    fontSize: 12,
  },
  tooltipWrapper: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 20,
    width: 80,
  },
  tooltipBubble: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  tooltipText: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 11,
  },
  tooltipPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  anchorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 1.5,
    marginTop: 2,
  },
  todayMarkerContainer: {
    position: 'absolute',
    top: -24,
    bottom: 0,
    alignItems: 'center',
    zIndex: 10,
    width: COLUMN_WIDTH,
  },
  todayBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  todayBadgeText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 9,
    letterSpacing: 0.2,
  },
  todayDashedLine: {
    flex: 1,
    width: 1,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    marginVertical: 2,
  },
  todayBaseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 1,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'transparent',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendSquare: {
    width: 13,
    height: 13,
    borderRadius: 3,
  },
  legendDashedSquare: {
    width: 13,
    height: 13,
    borderRadius: 3,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  legendText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
  },
});
