import React from 'react';
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {
  ModalBottomSheet,
  type ModalBottomSheetProps,
  BottomSheet,
  BottomSheetProvider,
  type BottomSheetProps,
  type ModalDetent,
  type Detent,
  type SurfaceStyle,
} from '@swmansion/react-native-bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { FontFamily, useAppTheme } from '@/shared/theme';

export interface AppBottomSheetProps {
  /** Whether the bottom sheet is open. */
  isOpen: boolean;
  /** Callback fired when sheet dismissal is requested (via drag, scrim tap, back button, or close button). */
  onClose: () => void;
  /** Sheet header title (optional). */
  title?: string;
  /** Children content. */
  children: React.ReactNode;
  /** Snap points for the sheet. Defaults to `[0, 'content']`. */
  detents?: ModalDetent[];
  /** Open detent index to snap to when `isOpen` is true. Defaults to 1 (content). */
  openIndex?: number;
  /** Whether to show the top drag handle indicator. Defaults to true. */
  showHandle?: boolean;
  /** Whether to show the header close (X) button when a title is provided. Defaults to true. */
  showCloseButton?: boolean;
  /** Scrim background color behind the sheet. Defaults to semi-transparent dark slate. */
  scrimColor?: ColorValue;
  /** Shape and shadow of the sheet surface. */
  surfaceStyle?: StyleProp<SurfaceStyle>;
  /** Optional background fill node for the surface. */
  surface?: React.ReactNode;
  /** Content container style. */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Whether to use full window overlay. */
  windowOverlay?: boolean;
  /** Accessibility label for scrim. */
  scrimAccessibilityLabel?: string;
  /** Test identifier. */
  testID?: string;
}

/**
 * Reusable AppBottomSheet built on top of `@swmansion/react-native-bottom-sheet`.
 * Provides native Fabric gestures, content-based sizing, theme integration,
 * an accessible drag handle, and safe area insets.
 */
export function AppBottomSheet({
  isOpen,
  onClose,
  title,
  children,
  detents = [0, 'content'],
  openIndex = 1,
  showHandle = true,
  showCloseButton = true,
  scrimColor = 'rgba(15, 23, 42, 0.45)',
  surfaceStyle,
  surface,
  contentContainerStyle,
  windowOverlay = false,
  scrimAccessibilityLabel = 'Close bottom sheet',
  testID,
}: AppBottomSheetProps): React.JSX.Element | null {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  if (!isOpen) {
    return null;
  }

  const activeIndex = openIndex;

  const defaultSurfaceStyle: SurfaceStyle = {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderCurve: 'continuous',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  };

  return (
    <ModalBottomSheet
      index={activeIndex}
      detents={detents}
      scrimColor={scrimColor}
      scrimAccessibilityLabel={scrimAccessibilityLabel}
      windowOverlay={windowOverlay}
      lazy
      surfaceStyle={[defaultSurfaceStyle, surfaceStyle]}
      surface={
        surface ?? (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: theme.isDark ? '#1E293B' : '#FFFFFF' },
            ]}
          />
        )
      }
      onCloseRequest={onClose}
      onIndexChange={(idx) => {
        if (idx === 0) {
          onClose();
        }
      }}
    >
      <View
        testID={testID}
        style={[
          styles.container,
          {
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        {/* Drag Handle Indicator */}
        {showHandle && (
          <View style={styles.handleWrapper} pointerEvents="none">
            <View
              style={[
                styles.handleBar,
                { backgroundColor: theme.isDark ? '#475569' : '#CBD5E1' },
              ]}
            />
          </View>
        )}

        {/* Optional Header */}
        {title ? (
          <View style={styles.headerRow}>
            <Text
              style={[
                styles.headerTitle,
                { color: theme.isDark ? '#F8FAFC' : '#0F172A' },
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
            {showCloseButton && (
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.closeButton}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Feather
                  name="x"
                  size={20}
                  color={theme.isDark ? '#94A3B8' : '#64748B'}
                />
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        {/* Sheet Content */}
        <View style={[styles.content, contentContainerStyle]}>{children}</View>
      </View>
    </ModalBottomSheet>
  );
}

// Re-export underlying swmansion primitives and types for advanced custom use cases
export {
  ModalBottomSheet,
  BottomSheet,
  BottomSheetProvider,
};

export type {
  ModalBottomSheetProps,
  BottomSheetProps,
  ModalDetent,
  Detent,
  SurfaceStyle,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  handleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    lineHeight: 24,
    flex: 1,
  },
  closeButton: {
    padding: 4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
});
