import { useAuthStore } from '@/features/auth';
import { ApiError } from '@/shared/api';
import { appStorage } from '@/shared/storage';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import { attendanceApi } from '../../../api/attendanceApi';
import { FaceVerifyScreen } from '../FaceVerifyScreen';

const mockUseLocalSearchParams = jest.fn<{ action?: string }, []>(() => ({ action: 'punch-in' }));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
    setParams: jest.fn(),
  },
  useLocalSearchParams: () => mockUseLocalSearchParams(),
  useIsFocused: () => true,
}));

jest.mock('../../../api/attendanceApi', () => ({
  attendanceApi: {
    punch: jest.fn(),
  },
}));

jest.mock('@/features/location/domain/permissionMachine', () => ({
  checkLocationPermission: jest.fn(async () => ({ status: 'denied', canAskAgain: false })),
}));

jest.mock('@/features/location/domain/trackingSession', () => ({
  getActiveTrackingSession: jest.fn(() => null),
  startTrackingSession: jest.fn(() => ({ sessionId: 'sess_1', status: 'tracking' })),
  stopTrackingSession: jest.fn(),
}));

jest.mock('@/features/location/tasks/backgroundLocationTask', () => ({
  BACKGROUND_LOCATION_TASK: 'hrms-background-location-task',
  startBackgroundTracking: jest.fn(async () => true),
  stopBackgroundTracking: jest.fn(async () => undefined),
}));

const mockedAttendanceApi = attendanceApi as jest.Mocked<typeof attendanceApi>;

describe('FaceVerifyScreen', () => {
  const initialAuthState = useAuthStore.getState();
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    appStorage.clearAll();
    mockUseLocalSearchParams.mockReturnValue({ action: 'punch-in' });
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    useAuthStore.setState({
      ...initialAuthState,
      isAuthenticated: true,
      session: {
        tenantId: 10,
        memberId: 42,
        employmentId: 105,
        employmentPublicId: 'emp_pub_105',
      },
      user: {
        id: '42',
        name: 'Sajil Kumar',
        email: 'backupssajil@gmail.com',
        employeeCode: 'KAP0042',
        department: 'Engineering',
        dpdpConsentGiven: true,
      },
    });
  });

  afterEach(() => {
    cleanup();
    useAuthStore.setState(initialAuthState);
    alertSpy.mockRestore();
  });

  it('submits IN punch to /api/v1/attendance/punch after photo capture and shows success', async () => {
    mockUseLocalSearchParams.mockReturnValue({ action: 'punch-in' });
    mockedAttendanceApi.punch.mockResolvedValue({
      id: 88,
      employmentId: 105,
      punchTimeUtc: '2026-11-26T09:15:00.000Z',
      punchType: 'IN',
      raw: {},
    });

    const { getByTestId, findByTestId, findByText } = await render(<FaceVerifyScreen />);

    await fireEvent.press(getByTestId('shutter-capture-btn'));
    const uploadBtn = await findByTestId('upload-photo-btn');
    await fireEvent.press(uploadBtn);

    await waitFor(() => {
      expect(mockedAttendanceApi.punch).toHaveBeenCalledWith({
        employmentId: 105,
        punchTimeUtc: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        punchType: 'IN',
      });
    });

    expect(await findByText('Punch-in Successful.')).toBeTruthy();
  });

  it('submits OUT punch and displays error alert on server rejection', async () => {
    mockUseLocalSearchParams.mockReturnValue({ action: 'punch-out' });
    mockedAttendanceApi.punch.mockRejectedValue(
      new ApiError({ status: 409, message: 'No active punch-in found' }),
    );

    const { getByTestId, findByTestId, queryByText } = await render(<FaceVerifyScreen />);

    await fireEvent.press(getByTestId('shutter-capture-btn'));
    const uploadBtn = await findByTestId('upload-photo-btn');
    await fireEvent.press(uploadBtn);

    await waitFor(() => {
      expect(mockedAttendanceApi.punch).toHaveBeenCalledWith({
        employmentId: 105,
        punchTimeUtc: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        punchType: 'OUT',
      });
      expect(alertSpy).toHaveBeenCalledWith('Punch Out Failed', 'No active punch-in found');
    });

    expect(queryByText('Punch-out Successful.')).toBeNull();
  });
});
