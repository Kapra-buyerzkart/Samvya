import Constants from 'expo-constants';

const DEFAULT_API_ORIGIN = 'https://hrmsapi.samagra360.com';

/**
 * Normalizes the configured API base URL into an origin without trailing
 * slashes or `/api/v1` / `/v1` suffixes so Postman-style `/api/v1/...` paths
 * resolve consistently across environments.
 */
export function normalizeApiOrigin(rawUrl: string | undefined): string {
  const trimmed = (rawUrl ?? '').trim();
  if (!trimmed) {
    return DEFAULT_API_ORIGIN;
  }

  let normalized = trimmed.replace(/\/+$/, '');
  if (normalized.endsWith('/api/v1')) {
    normalized = normalized.slice(0, -'/api/v1'.length);
  } else if (normalized.endsWith('/v1')) {
    normalized = normalized.slice(0, -'/v1'.length);
  }

  return normalized || DEFAULT_API_ORIGIN;
}

export function getApiOrigin(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  const extraUrl = Constants.expoConfig?.extra?.apiBaseUrl as string | undefined;
  return normalizeApiOrigin(envUrl || extraUrl);
}

export function buildApiUrl(path: string): string {
  const origin = getApiOrigin();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${normalizedPath}`;
}
