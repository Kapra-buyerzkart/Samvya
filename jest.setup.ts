// Mock react-native-worklets
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));

// Mock react-native-keyboard-controller
jest.mock('react-native-keyboard-controller', () =>
  require('react-native-keyboard-controller/jest'),
);

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  try {
    const {
      createJSReanimatedModule,
    } = require('react-native-reanimated/src/ReanimatedModule/js-reanimated');
    if (createJSReanimatedModule) {
      const dummy = createJSReanimatedModule();
      const proto = Object.getPrototypeOf(dummy);
      if (proto) {
        proto.setCSSEventHandler = () => {};
      }
    }
  } catch {
    // ignore
  }
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaConsumer: ({ children }: { children: (insets: typeof inset) => React.ReactNode }) =>
      children(inset),
    SafeAreaView: ({ children, ...props }: any) => React.createElement(View, props, children),
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

// Mock expo-image
jest.mock('expo-image', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Image: ({ children, ...props }: any) => React.createElement(View, props, children),
    ImageBackground: ({ children, ...props }: any) => React.createElement(View, props, children),
  };
});

// Mock expo-blur
jest.mock('expo-blur', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    BlurView: ({ children, ...props }: any) => React.createElement(View, props, children),
  };
});

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children, ...props }: any) => React.createElement(View, props, children),
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
jest.mock('react-native-vision-camera', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockCamera = ({ children, ...props }: any) =>
    React.createElement(View, { testID: 'vision-camera', ...props }, children);
  MockCamera.getCameraPermissionStatus = jest.fn(async () => 'authorized');
  MockCamera.requestCameraPermission = jest.fn(async () => true);
  return {
    Camera: MockCamera,
    VisionCamera: {
      cameraPermissionStatus: 'authorized',
      requestCameraPermission: jest.fn(async () => true),
    },
    useCameraDevice: jest.fn((position = 'front') => ({ id: `${position}-camera`, position })),
    useCameraPermission: jest.fn(() => ({
      hasPermission: true,
      requestPermission: jest.fn(async () => true),
      status: 'authorized',
      canRequestPermission: true,
    })),
  };
});

// Mock @swmansion/react-native-bottom-sheet
jest.mock('@swmansion/react-native-bottom-sheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    BottomSheet: ({ children, ...props }: any) =>
      React.createElement(View, { testID: 'bottom-sheet', ...props }, children),
    ModalBottomSheet: ({ children, index, ...props }: any) =>
      index > 0
        ? React.createElement(View, { testID: 'modal-bottom-sheet', ...props }, children)
        : null,
    BottomSheetProvider: ({ children }: any) => React.createElement(React.Fragment, null, children),
  };
});

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
    setParams: jest.fn(),
  },
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
    setParams: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  usePathname: jest.fn(() => '/'),
  useSegments: jest.fn(() => []),
  useIsFocused: () => true,
  Link: ({ children, ...props }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, props, children);
  },
}));
