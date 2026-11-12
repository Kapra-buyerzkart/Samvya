// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaConsumer: ({ children }: { children: (insets: typeof inset) => React.ReactNode }) =>
      children(inset),
    useSafeAreaInsets: () => inset,
  };
});

// Mock react-native-mmkv
jest.mock('react-native-mmkv', () => {
  const storage = new Map<string, unknown>();
  return {
    createMMKV: () => ({
      getString: (key: string) => {
        const val = storage.get(key);
        return val != null ? String(val) : undefined;
      },
      getBoolean: (key: string) => {
        const val = storage.get(key);
        if (typeof val === 'boolean') return val;
        if (val === 'true') return true;
        if (val === 'false') return false;
        return undefined;
      },
      getNumber: (key: string) => {
        const val = storage.get(key);
        return typeof val === 'number' ? val : val != null ? Number(val) : undefined;
      },
      set: (key: string, value: unknown) => storage.set(key, value),
      delete: (key: string) => storage.delete(key),
      remove: (key: string) => storage.delete(key),
      contains: (key: string) => storage.has(key),
      clearAll: () => storage.clear(),
      getAllKeys: () => Array.from(storage.keys()),
    }),
    useMMKVString: () => [null, jest.fn()],
  };
});

// Mock expo-secure-store
jest.mock('expo-secure-store', () => {
  const store = new Map<string, string>();
  return {
    getItemAsync: jest.fn(async (key: string) => store.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      store.delete(key);
    }),
  };
});

// Mock react-native-vision-camera
jest.mock('react-native-vision-camera', () => ({
  Camera: {
    getCameraPermissionStatus: jest.fn(async () => 'authorized'),
    requestCameraPermission: jest.fn(async () => true),
  },
  VisionCamera: {
    cameraPermissionStatus: 'authorized',
    requestCameraPermission: jest.fn(async () => true),
  },
  useCameraDevice: jest.fn(() => ({ id: 'front-camera' })),
  useCameraPermission: jest.fn(() => ({
    hasPermission: true,
    requestPermission: jest.fn(async () => true),
    status: 'authorized',
    canRequestPermission: true,
  })),
}));
