import { Linking, Platform } from 'react-native';

export function getMapsUrl(
  latitude: number,
  longitude: number,
  label = 'Worksite Location',
): { nativeUrl: string; webFallbackUrl: string } {
  const encodedLabel = encodeURIComponent(label);
  const webFallbackUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  if (Platform.OS === 'ios') {
    return {
      nativeUrl: `maps:0,0?q=${encodedLabel}@${latitude},${longitude}`,
      webFallbackUrl,
    };
  }

  if (Platform.OS === 'android') {
    return {
      nativeUrl: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodedLabel})`,
      webFallbackUrl,
    };
  }

  return {
    nativeUrl: webFallbackUrl,
    webFallbackUrl,
  };
}

export async function verifyCoordinatesInMaps(
  latitude: number,
  longitude: number,
  label = 'Worksite Location',
): Promise<boolean> {
  const { nativeUrl, webFallbackUrl } = getMapsUrl(latitude, longitude, label);

  try {
    const supported = await Linking.canOpenURL(nativeUrl);
    if (supported) {
      await Linking.openURL(nativeUrl);
      return true;
    }
  } catch {
    // Native maps app not found; proceed to web fallback
  }

  try {
    await Linking.openURL(webFallbackUrl);
    return true;
  } catch {
    return false;
  }
}
