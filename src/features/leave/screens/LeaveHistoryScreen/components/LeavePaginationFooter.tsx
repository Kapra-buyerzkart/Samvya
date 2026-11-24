import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FontFamily } from '@/shared/theme';

interface LeavePaginationFooterProps {
  currentPage: number;
  totalPages: number;
  isDark: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function LeavePaginationFooter({
  currentPage,
  totalPages,
  isDark,
  onPrevPage,
  onNextPage,
}: LeavePaginationFooterProps): React.JSX.Element {
  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <View style={styles.paginationFooter}>
      <View style={styles.paginationIndicators}>
        {Array.from({ length: totalPages }).map((_, i) => (
          <View
            key={i}
            style={[
              i + 1 === currentPage ? styles.paginationPillActive : styles.paginationDot,
            ]}
          />
        ))}
        <Text style={getPaginationTextStyle(isDark)}>
          {currentPage} of {totalPages}
        </Text>
      </View>

      <View style={styles.paginationButtons}>
        <TouchableOpacity
          onPress={onPrevPage}
          disabled={isPrevDisabled}
          style={getPageNavBtnStyle(isDark, isPrevDisabled)}
          activeOpacity={0.7}
          testID="prev-page-btn"
          accessibilityRole="button"
          accessibilityLabel="Previous page"
        >
          <Feather
            name="chevron-left"
            size={18}
            color={isPrevDisabled ? '#94A3B8' : isDark ? '#F8FAFC' : '#0F294A'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNextPage}
          disabled={isNextDisabled}
          style={getPageNavBtnStyle(isDark, isNextDisabled)}
          activeOpacity={0.7}
          testID="next-page-btn"
          accessibilityRole="button"
          accessibilityLabel="Next page"
        >
          <Feather
            name="chevron-right"
            size={18}
            color={isNextDisabled ? '#94A3B8' : isDark ? '#F8FAFC' : '#0F294A'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  paginationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 8,
  },
  paginationIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  paginationPillActive: {
    width: 22,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#1D4ED8',
  },
  paginationDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#CBD5E1',
  },
  paginationText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    marginLeft: 6,
  },
  paginationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  pageNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNavBtnDisabled: {
    opacity: 0.4,
  },
});

export const getPaginationTextStyle = (isDark: boolean): TextStyle[] => [
  styles.paginationText,
  { color: isDark ? '#94A3B8' : '#64748B' },
];

export const getPageNavBtnStyle = (isDark: boolean, isDisabled: boolean): ViewStyle[] => {
  const result: ViewStyle[] = [
    styles.pageNavBtn,
    {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderColor: isDark ? '#334155' : '#CBD5E1',
    },
  ];
  if (isDisabled) {
    result.push(styles.pageNavBtnDisabled);
  }
  return result;
};
