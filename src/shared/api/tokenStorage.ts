import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'hrms.auth.access_token';
const REFRESH_TOKEN_KEY = 'hrms.auth.refresh_token';
const KEYCHAIN_SERVICE = 'com.hrms.attendance.auth';
const MAX_CHUNK_SIZE = 1800;

const webSessionFallback = new Map<string, string>();

function getSecureStoreOptions(): SecureStore.SecureStoreOptions {
  const options: SecureStore.SecureStoreOptions = {
    keychainService: KEYCHAIN_SERVICE,
  };

  if (SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY !== undefined) {
    options.keychainAccessible = SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY;
  }

  return options;
}

function getChunkCountKey(baseKey: string): string {
  return `${baseKey}.__chunks`;
}

function getChunkKey(baseKey: string, index: number): string {
  return `${baseKey}.__chunk_${index}`;
}

async function setRawValue(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    webSessionFallback.set(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value, getSecureStoreOptions());
}

async function getRawValue(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return webSessionFallback.get(key) ?? null;
  }
  return SecureStore.getItemAsync(key, getSecureStoreOptions());
}

async function deleteRawValue(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    webSessionFallback.delete(key);
    return;
  }
  await SecureStore.deleteItemAsync(key, getSecureStoreOptions());
}

async function deleteSecureEntry(baseKey: string): Promise<void> {
  const chunkCountRaw = await getRawValue(getChunkCountKey(baseKey));
  const chunkCount = chunkCountRaw ? Number.parseInt(chunkCountRaw, 10) : 0;

  if (Number.isInteger(chunkCount) && chunkCount > 0) {
    const chunkDeletes = Array.from({ length: chunkCount }, (_, i) =>
      deleteRawValue(getChunkKey(baseKey, i)),
    );
    await Promise.all([
      ...chunkDeletes,
      deleteRawValue(getChunkCountKey(baseKey)),
      deleteRawValue(baseKey),
    ]);
    return;
  }

  await deleteRawValue(baseKey);
}

async function setSecureEntry(baseKey: string, value: string): Promise<void> {
  await deleteSecureEntry(baseKey);

  if (value.length <= MAX_CHUNK_SIZE) {
    await setRawValue(baseKey, value);
    return;
  }

  const chunkCount = Math.ceil(value.length / MAX_CHUNK_SIZE);
  const writes: Promise<void>[] = [];
  for (let i = 0; i < chunkCount; i++) {
    const slice = value.slice(i * MAX_CHUNK_SIZE, (i + 1) * MAX_CHUNK_SIZE);
    writes.push(setRawValue(getChunkKey(baseKey, i), slice));
  }
  writes.push(setRawValue(getChunkCountKey(baseKey), String(chunkCount)));
  await Promise.all(writes);
}

async function getSecureEntry(baseKey: string): Promise<string | null> {
  const chunkCountRaw = await getRawValue(getChunkCountKey(baseKey));
  const chunkCount = chunkCountRaw ? Number.parseInt(chunkCountRaw, 10) : 0;

  if (Number.isInteger(chunkCount) && chunkCount > 0) {
    const chunks = await Promise.all(
      Array.from({ length: chunkCount }, (_, i) => getRawValue(getChunkKey(baseKey, i))),
    );
    if (chunks.some((c) => c === null)) {
      return null;
    }
    return chunks.join('');
  }

  return getRawValue(baseKey);
}

export interface StoredTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    return getSecureEntry(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return getSecureEntry(REFRESH_TOKEN_KEY);
  },

  async getTokens(): Promise<StoredTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      getSecureEntry(ACCESS_TOKEN_KEY),
      getSecureEntry(REFRESH_TOKEN_KEY),
    ]);
    return { accessToken, refreshToken };
  },

  async setTokens(tokens: { accessToken: string; refreshToken?: string | null }): Promise<void> {
    await setSecureEntry(ACCESS_TOKEN_KEY, tokens.accessToken);
    if (tokens.refreshToken) {
      await setSecureEntry(REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      deleteSecureEntry(ACCESS_TOKEN_KEY),
      deleteSecureEntry(REFRESH_TOKEN_KEY),
    ]);
  },
};
