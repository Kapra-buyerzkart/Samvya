import React from 'react';
import {
  ColorValue,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { Feather } from '@expo/vector-icons';
import { FontFamily, useAppTheme } from '@/shared/theme';

export interface AppBottomSheetProps {
  /** Whether the modal is open. */
  isOpen: boolean;
  /** Callback fired when modal dismissal is requested (via scrim tap, back button, or close button). */
  onClose: () => void;
  /** Modal header title (optional). */
  title?: string;
  /** Children content. */
  children: React.ReactNode;
  /** Kept for backwards compatibility. */
  detents?: unknown[];
  /** Kept for backwards compatibility. */
  openIndex?: number;
  /** Kept for backwards compatibility. */
  showHandle?: boolean;
  /** Whether to show the header close (X) button when a title is provided. Defaults to true. */
  showCloseButton?: boolean;
  /** Scrim background color behind the modal. */
  scrimColor?: ColorValue;
  /** Kept for backwards compatibility. */
  surfaceStyle?: StyleProp<ViewStyle>;
  /** Kept for backwards compatibility. */
  surface?: React.ReactNode;
  /** Content container style. */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Kept for backwards compatibility. */
  windowOverlay?: boolean;
  /** Accessibility label for scrim. */
  scrimAccessibilityLabel?: string;
  /** Test identifier. */
  testID?: string;
}

/**
 * Standard UI Modal wrapper built on React Native's `<Modal>`.
 * Provides centered dialog presentation, scrim tap-to-close, keyboard avoidance,
 * and consistent light/dark fine-line borders.
 */
export function AppBottomSheet({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  scrimColor = 'rgba(15, 23, 42, 0.5)',
  contentContainerStyle,
  scrimAccessibilityLabel = 'Close modal',
  testID,
}: AppBottomSheetProps): React.JSX.Element | null {
  const theme = useAppTheme();

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.overlay}>
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: scrimColor }]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={scrimAccessibilityLabel}
        />
        <View
          testID={testID}
          style={[
            styles.dialog,
            {
              backgroundColor: theme.isDark ? '#0F172A' : '#FFFFFF',
              borderColor: theme.isDark ? '#1E293B' : '#E2E8F0',
            },
          ]}
        >
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

          <View style={[styles.content, contentContainerStyle]}>{children}</View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '85%',
    borderRadius: 18,
    borderWidth: 1,
    paddingBottom: 16,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
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
