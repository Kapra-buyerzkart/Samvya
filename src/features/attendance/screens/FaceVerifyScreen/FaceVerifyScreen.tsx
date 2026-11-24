import { PunchSuccessScreen } from '@/features/attendance/screens/PunchSuccessScreen';
import { FaceVerifyCameraView } from '@/features/face';
import { Button, Card, ThemedText } from '@/shared/components';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './FaceVerifyScreen.styles';
import { useFaceVerifyScreen } from './useFaceVerifyScreen';

export function FaceVerifyScreen(): React.JSX.Element {
  const {
    t,
    isFaceCheckInEnabled,
    isFocused,
    actionText,
    isPunching,
    punchSuccess,
    navigateBack,
    handleCancel,
    handleFallbackToManual,
    handlePunch,
  } = useFaceVerifyScreen();

  if (punchSuccess) {
    return (
      <PunchSuccessScreen
        type={punchSuccess.type}
        timestamp={punchSuccess.timestamp}
        onDismiss={navigateBack}
      />
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {isFaceCheckInEnabled ? (
          <FaceVerifyCameraView
            actionText={actionText}
            isCameraActive={isFocused}
            isPunching={isPunching}
            onPunch={handlePunch}
            onCancel={handleCancel}
            onFallbackToManual={handleFallbackToManual}
          />
        ) : (
          <View style={styles.disabledContainer}>
            <Card style={styles.disabledCard}>
              <ThemedText variant="heading" style={styles.disabledTitle}>
                Camera Punch Disabled
              </ThemedText>
              <ThemedText variant="body" style={styles.disabledText}>
                Camera punch is turned off by administrative policy. Please check in using
                hardware GPS or supervisor-approved manual entry.
              </ThemedText>
              <Button
                title="Use Supervisor Approval (Manual GPS)"
                variant="primary"
                onPress={handleFallbackToManual}
                style={styles.actionBtn}
              />
              <Button
                title={t('common.cancel')}
                variant="secondary"
                onPress={handleCancel}
                style={styles.actionBtn}
              />
            </Card>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

export default FaceVerifyScreen;
