import { StyleSheet, type ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    position: 'relative',
  },
  chartAuraCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: 'center',
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const getChartAuraBgStyle = (isDark: boolean): ViewStyle => ({
  backgroundColor: isDark
    ? 'rgba(59, 130, 246, 0.18)'
    : 'rgba(59, 130, 246, 0.12)',
});
