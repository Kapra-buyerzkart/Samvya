import { useAuthStore } from '@/features/auth';
import { leaveApi } from '@/features/leave';
import { ApiError } from '@/shared/api';
import { appStorage } from '@/shared/storage';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert, type AlertButton } from 'react-native';
import { attendanceApi, getWeekDateRange } from '../../../api/attendanceApi';
import { punchInShift } from '../../../domain/shiftTimer';
import { HomeScreen } from '../HomeScreen';

jest.mock('@/features/leave', () => {
  const actual = jest.requireActual('@/features/leave') as typeof import('@/features/leave');
  return {
    ...actual,
    leaveApi: {
      ...actual.leaveApi,
      getLeaveBalances: jest.fn(async () => ({
        allocated: 0,
        taken: 0,
        pending: 0,
        available: 0,
        byType: [],
      })),
    },
  };
});

jest.mock('../../../api/attendanceApi', () => {
  const actual = jest.requireActual('../../../api/attendanceApi') as typeof import('../../../api/attendanceApi');
  return {
    ...actual,
    attendanceApi: {
      punch: jest.fn(),
      getEmploymentAttendanceRange: jest.fn(async () => []),
      getEmploymentMonthlyAttendance: jest.fn(),
    },
  };
});

const mockedAttendanceApi = attendanceApi as jest.Mocked<typeof attendanceApi>;
const mockedLeaveApi = leaveApi as jest.Mocked<typeof leaveApi>;
const alertSpy = jest.spyOn(Alert, 'alert');

describe('HomeScreen', () => {
  const initialAuthState = useAuthStore.getState();

  beforeEach(() => {
    jest.clearAllMocks();
    appStorage.clearAll();
    alertSpy.mockReset();
    mockedAttendanceApi.getEmploymentAttendanceRange.mockResolvedValue([]);
    mockedLeaveApi.getLeaveBalances.mockResolvedValue({
      allocated: 0,
      taken: 0,
      pending: 0,
      available: 0,
      byType: [],
    });
    useAuthStore.setState({
      ...initialAuthState,
      session: null,
      user: {
        id: '101',
        name: 'Peter S',
        email: 'peter@samavya.test',
        employeeCode: 'SAM-101',
        department: 'Engineering',
        dpdpConsentGiven: true,
      },
    });
  });

  const setAuthenticatedSession = () => {
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
        id: '101',
        name: 'Peter S',
        email: 'peter@samavya.test',
        employeeCode: 'SAM-101',
        department: 'Engineering',
        dpdpConsentGiven: true,
      },
    });
  };

  afterEach(() => {
    cleanup();
    useAuthStore.setState(initialAuthState);
  });

  it('renders greeting, hero dial, quick actions, weekly work, leave rings, and bento cards', async () => {
    const { getByText, getByTestId } = await render(<HomeScreen />);

    expect(getByTestId('home-greeting-name').props.children.join('')).toBe('Hello, Peter S');
    expect(getByText('Shift')).toBeTruthy();
    expect(getByText('09:00 AM - 06 : 00 PM')).toBeTruthy();
    expect(getByText('Worked today')).toBeTruthy();
    expect(getByText('of 8h')).toBeTruthy();
    expect(getByTestId('btn-punch-action')).toBeTruthy();
    expect(getByTestId('btn-break-toggle')).toBeTruthy();

    expect(getByText('Apply Leave')).toBeTruthy();
    expect(getByText('Time sheet')).toBeTruthy();
    expect(getByText('Payslip')).toBeTruthy();
    expect(getByText('Team')).toBeTruthy();
    expect(getByTestId('home-leave-status-btn')).toBeTruthy();
    expect(getByText('Leave status')).toBeTruthy();

    expect(getByText('Weekly work')).toBeTruthy();
    expect(getByText('15h 48m')).toBeTruthy();
    expect(getByText('Wed, 08 Nov')).toBeTruthy();
    expect(getByText('Employment details')).toBeTruthy();

    expect(getByText('Sick leaves')).toBeTruthy();
    expect(getByText('Earned leaves')).toBeTruthy();
    expect(getByText('Casual leaves')).toBeTruthy();
    expect(getByText('Holiday Calendar')).toBeTruthy();
    expect(getByText('Leave History')).toBeTruthy();
  });

  it('handles punch action button tap properly', async () => {
    const { getByTestId } = await render(<HomeScreen />);
    const punchBtn = getByTestId('btn-punch-action');

    await fireEvent.press(punchBtn);
    expect(Alert.alert).toHaveBeenCalled();
  });

  it('renders current employment heading and employment number at top', async () => {
    const { getByText, getByTestId } = await render(<HomeScreen />);

    expect(getByText('Current Employment')).toBeTruthy();
    expect(getByTestId('home-employment-number').props.children).toBe('SAM-101');
  });

  it('navigates from quick actions, employment card, leave rings, and leave history', async () => {
    const { getByTestId } = await render(<HomeScreen />);

    await fireEvent.press(getByTestId('quick-action-apply-leave'));
    expect(router.push).toHaveBeenCalledWith('/(app)/leave/request');

    await fireEvent.press(getByTestId('quick-action-time-sheet'));
    expect(router.push).toHaveBeenCalledWith('/(app)/attendance/history');

    await fireEvent.press(getByTestId('home-leave-status-btn'));
    expect(router.push).toHaveBeenCalledWith('/(app)/leave/status');

    await fireEvent.press(getByTestId('card-employment-details'));
    expect(router.push).toHaveBeenCalledWith('/(app)/employment');

    await fireEvent.press(getByTestId('leave-rings-row'));
    expect(router.push).toHaveBeenCalledWith('/(app)/leave/status');

    await fireEvent.press(getByTestId('card-leave-history'));
    expect(router.push).toHaveBeenCalledWith('/(app)/leave/history');
  });

  it('updates selected weekly day bar and opens Holiday Calendar, Payslip, and Team sheets', async () => {
    const { getByLabelText, getByTestId, getByText, queryByText } = await render(<HomeScreen />);

    await fireEvent.press(getByTestId('weekly-bar-mon'));
    expect(getByText('Mon, 06 Nov')).toBeTruthy();

    await fireEvent.press(getByTestId('card-holiday-calendar'));
    await waitFor(() => {
      expect(getByText('Holiday Calendar 2026')).toBeTruthy();
    });
    await fireEvent.press(getByLabelText('Close'));
    await waitFor(() => {
      expect(queryByText('Holiday Calendar 2026')).toBeNull();
    });

    await fireEvent.press(getByTestId('quick-action-payslip'));
    await waitFor(() => {
      expect(getByText('Payslip Preview')).toBeTruthy();
    });
    await fireEvent.press(getByLabelText('Close'));
    await waitFor(() => {
      expect(queryByText('Payslip Preview')).toBeNull();
    });

    await fireEvent.press(getByTestId('quick-action-team'));
    await waitFor(() => {
      expect(getByText('Team Presence & Radar')).toBeTruthy();
      expect(getByTestId('team-radar-card')).toBeTruthy();
    });
  });

  it('calls attendanceApi.punch with OUT payload on Quick Punch Out and navigates to punch-success', async () => {
    setAuthenticatedSession();
    punchInShift('Work from home', 'Regular');
    mockedAttendanceApi.punch.mockResolvedValue({
      id: 501,
      employmentId: 105,
      punchTimeUtc: '2026-11-26T18:00:00.000Z',
      punchType: 'OUT',
      raw: {},
    });
    alertSpy.mockImplementation((_title, _msg, buttons) => {
      const quickOutBtn = buttons?.find((b: AlertButton) => b.text === 'Quick Punch Out');
      quickOutBtn?.onPress?.();
    });

    const { getByTestId } = await render(<HomeScreen />);
    await fireEvent.press(getByTestId('btn-punch-action'));

    await waitFor(() => {
      expect(mockedAttendanceApi.punch).toHaveBeenCalledWith({
        employmentId: 105,
        punchTimeUtc: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        punchType: 'OUT',
      });
      expect(router.push).toHaveBeenCalledWith({
        pathname: '/(app)/attendance/punch-success',
        params: {
          action: 'punch-out',
          timestamp: expect.any(String),
        },
      });
    });
  });

  it('defaults HomeScreen to Punch in (off duty) and calls attendanceApi.punch with IN payload', async () => {
    setAuthenticatedSession();
    mockedAttendanceApi.punch.mockResolvedValue({
      id: 502,
      employmentId: 105,
      punchTimeUtc: '2026-11-26T09:00:00.000Z',
      punchType: 'IN',
      raw: {},
    });
    alertSpy.mockImplementation((_title, _msg, buttons) => {
      const quickInBtn = buttons?.find((b: AlertButton) => b.text === 'Quick Punch In');
      quickInBtn?.onPress?.();
    });

    const { getByTestId, getByText } = await render(<HomeScreen />);
    expect(getByText('Off duty')).toBeTruthy();
    expect(getByText('Punch in')).toBeTruthy();

    await fireEvent.press(getByTestId('btn-punch-action'));

    await waitFor(() => {
      expect(mockedAttendanceApi.punch).toHaveBeenCalledWith({
        employmentId: 105,
        punchTimeUtc: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        punchType: 'IN',
      });
      expect(router.push).toHaveBeenCalledWith({
        pathname: '/(app)/attendance/punch-success',
        params: {
          action: 'punch-in',
          timestamp: expect.any(String),
        },
      });
    });
  });

  it('shows failure alert and skips navigation when Quick Punch Out fails on server', async () => {
    setAuthenticatedSession();
    punchInShift('Work from home', 'Regular');
    mockedAttendanceApi.punch.mockRejectedValue(
      new ApiError({ status: 400, message: 'Already punched out for today' }),
    );
    alertSpy.mockImplementation((_title, _msg, buttons) => {
      const quickOutBtn = buttons?.find((b: AlertButton) => b.text === 'Quick Punch Out');
      quickOutBtn?.onPress?.();
    });

    const { getByTestId } = await render(<HomeScreen />);
    await fireEvent.press(getByTestId('btn-punch-action'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Punch Out Failed', 'Already punched out for today');
      expect(router.push).not.toHaveBeenCalled();
    });
  });

  it('hydrates Weekly work card from /api/v1/attendance/employment/{employmentId}', async () => {
    setAuthenticatedSession();
    const week = getWeekDateRange(new Date());
    mockedAttendanceApi.getEmploymentAttendanceRange.mockResolvedValue([
      {
        dateKey: week.days[0]!.dateKey,
        status: 'approved',
        punchInTimeUtc: null,
        punchOutTimeUtc: null,
        punchInDisplay: '09:00 AM',
        punchInPeriod: 'Morning',
        punchOutDisplay: '05:30 PM',
        punchOutPeriod: 'Evening',
        workedMinutes: 510,
        subtitle: 'Recorded via HRMS',
      },
    ]);

    const { findByText } = await render(<HomeScreen />);

    await waitFor(() => {
      expect(mockedAttendanceApi.getEmploymentAttendanceRange).toHaveBeenCalledWith({
        employmentId: 105,
        fromDate: week.fromDate,
        toDate: week.toDate,
      });
    });

    expect(await findByText('8h 30m')).toBeTruthy();
  });

  it('maps leaveApi getLeaveBalances response onto HomeScreen rings and Leave History card', async () => {
    setAuthenticatedSession();
    const currentYear = new Date().getFullYear();
    mockedLeaveApi.getLeaveBalances.mockResolvedValue({
      allocated: 24,
      taken: 6,
      pending: 1,
      available: 17,
      byType: [
        { leaveTypeId: 1, leaveTypeName: 'Sick Leave', allocated: 6, taken: 2, pending: 0, available: 4 },
        { leaveTypeId: 2, leaveTypeName: 'Earned Leave', allocated: 12, taken: 2, pending: 1, available: 9 },
        { leaveTypeId: 3, leaveTypeName: 'Casual Leave', allocated: 6, taken: 2, pending: 0, available: 4 },
      ],
    });

    const { findByText, findAllByText } = await render(<HomeScreen />);

    await waitFor(() => {
      expect(mockedLeaveApi.getLeaveBalances).toHaveBeenCalledWith(105, currentYear);
    });

    expect(await findByText('Sick Leave')).toBeTruthy();
    expect(await findByText('Earned Leave')).toBeTruthy();
    expect(await findByText('Casual Leave')).toBeTruthy();
    expect((await findAllByText('04')).length).toBe(2);
    expect(await findByText('09')).toBeTruthy();
    expect(await findByText('Of 12 days')).toBeTruthy();
    expect(await findByText('6d taken')).toBeTruthy();
    expect(await findByText('17d left')).toBeTruthy();
    expect(await findByText('24 total')).toBeTruthy();
  });
});
