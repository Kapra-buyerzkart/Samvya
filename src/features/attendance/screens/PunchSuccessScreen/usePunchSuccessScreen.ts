import { useAppTheme } from '@/shared/theme';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface PunchSuccessScreenProps {
  type?: 'punch-in' | 'punch-out';
  timestamp?: number;
  shiftText?: string;
  onDismiss?: () => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function usePunchSuccessScreen(props: PunchSuccessScreenProps) {
  const {
    type = 'punch-out',
    timestamp,
    shiftText = '09:00 – 18:00',
    onDismiss,
  } = props;

  const theme = useAppTheme();
  const isDark = theme.isDark;
  const insets = useSafeAreaInsets();

  const [countdown, setCountdown] = useState(5);
  const onDismissRef = React.useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  const handleGoHome = (): void => {
    if (onDismissRef.current) {
      onDismissRef.current();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGoHome();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dateObj = timestamp ? new Date(timestamp) : new Date();
  const rawHours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const period = rawHours >= 12 ? 'PM' : 'AM';
  const hours12 = String(rawHours % 12 || 12).padStart(2, '0');
  const formattedTime = `${hours12}:${minutes}`;

  const dayName = WEEKDAYS[dateObj.getDay()];
  const dayNum = dateObj.getDate();
  const monthName = MONTHS[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  const formattedDate = `${dayName}, ${dayNum} ${monthName} ${year}`;

  const isPunchIn = type === 'punch-in';
  const title = isPunchIn ? 'Punch-in Successful.' : 'Punch-out Successful.';
  const subtitle = isPunchIn
    ? 'Have a productive and focused workday ahead.'
    : 'Have a productive and focused workday ahead.';

  return {
    isDark,
    insets,
    countdown,
    handleGoHome,
    formattedTime,
    period,
    formattedDate,
    shiftText,
    title,
    subtitle,
  };
}
