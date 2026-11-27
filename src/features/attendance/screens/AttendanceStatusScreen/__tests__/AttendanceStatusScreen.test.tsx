import React from 'react';
import { StyleSheet } from 'react-native';
import { cleanup, render, fireEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/features/auth';
import { ApiError } from '@/shared/api';
import { attendanceApi } from '../../../api/attendanceApi';
import { AttendanceStatusScreen } from '../AttendanceStatusScreen';

jest.mock('../../../api/attendanceApi', () => ({
  getMonthDateRange: (year: number, month: number) => {
    const lastDay = new Date(year, month, 0).getDate();
    return {
      fromDate: `${year}-${String(month).padStart(2, '0')}-01`,
      toDate: `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`,
    };
  },
  attendanceApi: {
    getEmploymentAttendanceRange: jest.fn(),
    getEmploymentMonthlyAttendance: jest.fn(),
  },
}));

const mockedAttendanceApi = attendanceApi as jest.Mocked<typeof attendanceApi>;

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function createEmptyMonthlySummary(year: number, month1Based: number) {
  const daysInMonth = new Date(year, month1Based, 0).getDate();
  return {
    year,
    month: month1Based,
    monthName: `${MONTH_NAMES[month1Based - 1]} ${year}`,
    workingDays: 21,
    totalHoursFormatted: '0hrs',
    daysRecorded: 0,
    dailyRecords: Array.from({ length: daysInMonth }, (_, idx) => ({
      day: idx + 1,
      dayOfWeek: 'Mon',
      hours: 0,
      formattedHours: '0h',
      status: 'no_entry' as const,
      isToday: false,
      isHoliday: false,
      isWeekend: false,
    })),
  };
}

describe('AttendanceStatusScreen', () => {
  const initialAuthState = useAuthStore.getState();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ ...initialAuthState, session: null, user: null });
  });

  afterEach(() => {
    cleanup();
    useAuthStore.setState(initialAuthState);
  });

  it('renders empty state without dummy data when employmentId is missing', async () => {
    const now = new Date();
    const expectedMonthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;

    const { getByText, getByTestId } = await render(<AttendanceStatusScreen />);

    expect(getByText('Attendance status')).toBeTruthy();
    expect(getByTestId('attendance-status-back-btn')).toBeTruthy();

    expect(StyleSheet.flatten(getByTestId('attendance-calendar-card').props.style)).toMatchObject({
      backgroundColor: '#FFFFFF',
      borderColor: '#E2E8F0',
    });
    expect(StyleSheet.flatten(getByTestId('attendance-punch-card').props.style)).toMatchObject({
      backgroundColor: '#FFFFFF',
      borderColor: '#E2E8F0',
    });

    expect(getByTestId('current-month-label')).toHaveTextContent(expectedMonthLabel);
    expect(getByTestId('monthly-total-hours')).toHaveTextContent('—');
    expect(getByTestId('monthly-days-recorded')).toHaveTextContent('—');
    expect(getByTestId('monthly-working-days')).toHaveTextContent('—');
    expect(getByText('No active employment selected')).toBeTruthy();
    expect(getByTestId('punch-in-time')).toHaveTextContent('—');
    expect(getByTestId('punch-out-time')).toHaveTextContent('—');
    expect(mockedAttendanceApi.getEmploymentAttendanceRange).not.toHaveBeenCalled();
    expect(mockedAttendanceApi.getEmploymentMonthlyAttendance).not.toHaveBeenCalled();
  });

  it('cycles months when clicking previous and next month buttons', async () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const { getByTestId, findByText } = await render(<AttendanceStatusScreen />);

    expect(getByTestId('current-month-label')).toHaveTextContent(
      `${MONTH_NAMES[currentMonth]} ${currentYear}`,
    );

    fireEvent.press(getByTestId('prev-month-btn'));
    expect(await findByText(`${MONTH_NAMES[prevMonth]} ${prevYear}`)).toBeTruthy();

    fireEvent.press(getByTestId('next-month-btn'));
    expect(await findByText(`${MONTH_NAMES[currentMonth]} ${currentYear}`)).toBeTruthy();
  });

  it('navigates back when pressing back button', async () => {
    const { getByTestId } = await render(<AttendanceStatusScreen />);

    fireEvent.press(getByTestId('attendance-status-back-btn'));
    expect(router.back).toHaveBeenCalled();
  });

  it('loads range and monthly attendance from backend API when authenticated and supports retry', async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month1Based = now.getMonth() + 1;
    const padM = String(month1Based).padStart(2, '0');
    const lastDay = new Date(year, month1Based, 0).getDate();
    const prevMonth1Based = month1Based === 1 ? 12 : month1Based - 1;
    const prevYear = month1Based === 1 ? year - 1 : year;
    const prevPadM = String(prevMonth1Based).padStart(2, '0');
    const prevLastDay = new Date(prevYear, prevMonth1Based, 0).getDate();
    const todayDay = now.getDate();
    const todayKey = `${year}-${padM}-${String(todayDay).padStart(2, '0')}`;

    useAuthStore.setState({
      ...initialAuthState,
      isAuthenticated: true,
      session: {
        tenantId: 10,
        memberId: 42,
        employmentId: 105,
        employmentPublicId: 'emp_pub_105',
      },
    });

    mockedAttendanceApi.getEmploymentAttendanceRange.mockRejectedValueOnce(
      new ApiError({ status: 503, message: 'Service temporarily down' }),
    );
    mockedAttendanceApi.getEmploymentMonthlyAttendance.mockResolvedValueOnce(
      createEmptyMonthlySummary(year, month1Based),
    );

    const { getByTestId, findByTestId } = await render(<AttendanceStatusScreen />);

    await waitFor(() => {
      expect(mockedAttendanceApi.getEmploymentAttendanceRange).toHaveBeenCalledWith({
        employmentId: 105,
        fromDate: `${year}-${padM}-01`,
        toDate: `${year}-${padM}-${String(lastDay).padStart(2, '0')}`,
      });
      expect(mockedAttendanceApi.getEmploymentMonthlyAttendance).toHaveBeenCalledWith({
        employmentId: 105,
        year,
        month: month1Based,
      });
    });

    const retryBanner = await findByTestId('attendance-retry-banner');

    mockedAttendanceApi.getEmploymentAttendanceRange.mockResolvedValueOnce([
      {
        dateKey: todayKey,
        status: 'approved',
        punchInTimeUtc: `${todayKey}T03:45:00.000Z`,
        punchOutTimeUtc: `${todayKey}T12:30:00.000Z`,
        punchInDisplay: '09:15 AM',
        punchInPeriod: 'Morning',
        punchOutDisplay: '06:00 PM',
        punchOutPeriod: 'Evening',
        workedMinutes: 525,
        subtitle: 'Biometric verified',
      },
    ]);
    mockedAttendanceApi.getEmploymentMonthlyAttendance.mockResolvedValueOnce({
      ...createEmptyMonthlySummary(year, month1Based),
      workingDays: 22,
      totalHoursFormatted: '148hrs 30m',
      daysRecorded: 18,
    });

    await fireEvent.press(retryBanner);

    await waitFor(() => {
      expect(getByTestId('punch-in-time')).toHaveTextContent('09:15 AM');
      expect(getByTestId('punch-out-time')).toHaveTextContent('06:00 PM');
      expect(getByTestId('monthly-total-hours')).toHaveTextContent('148hrs 30m');
      expect(getByTestId('monthly-days-recorded')).toHaveTextContent('18');
      expect(getByTestId('monthly-working-days')).toHaveTextContent('22');
      expect(getByTestId('selected-day-worked-hours')).toHaveTextContent('8h 45m worked');
    });

    mockedAttendanceApi.getEmploymentAttendanceRange.mockResolvedValueOnce([]);
    mockedAttendanceApi.getEmploymentMonthlyAttendance.mockResolvedValueOnce(
      createEmptyMonthlySummary(prevYear, prevMonth1Based),
    );
    await fireEvent.press(getByTestId('prev-month-btn'));

    await waitFor(() => {
      expect(mockedAttendanceApi.getEmploymentAttendanceRange).toHaveBeenLastCalledWith({
        employmentId: 105,
        fromDate: `${prevYear}-${prevPadM}-01`,
        toDate: `${prevYear}-${prevPadM}-${String(prevLastDay).padStart(2, '0')}`,
      });
      expect(mockedAttendanceApi.getEmploymentMonthlyAttendance).toHaveBeenLastCalledWith({
        employmentId: 105,
        year: prevYear,
        month: prevMonth1Based,
      });
    });
  });

  it('maps days records and monthly summary without marking empty days as approved', async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month1Based = now.getMonth() + 1;
    const padM = String(month1Based).padStart(2, '0');

    useAuthStore.setState({
      ...initialAuthState,
      isAuthenticated: true,
      session: {
        tenantId: 10,
        memberId: 42,
        employmentId: 105,
        employmentPublicId: 'emp_pub_105',
      },
    });

    mockedAttendanceApi.getEmploymentAttendanceRange.mockResolvedValueOnce([
      {
        dateKey: `${year}-${padM}-15`,
        status: 'approved',
        hasAttendanceData: false,
        isWeekend: true,
        punchInTimeUtc: null,
        punchOutTimeUtc: null,
        punchInDisplay: '—',
        punchInPeriod: 'Not recorded',
        punchOutDisplay: '—',
        punchOutPeriod: 'Not recorded',
        workedMinutes: 0,
        subtitle: 'Scheduled off day',
      },
      {
        dateKey: `${year}-${padM}-18`,
        status: 'pending',
        hasAttendanceData: true,
        punchInTimeUtc: `${year}-${padM}-18T03:30:00.000Z`,
        punchOutTimeUtc: null,
        punchInDisplay: '09:00 AM',
        punchInPeriod: 'Morning',
        punchOutDisplay: '—',
        punchOutPeriod: 'Not recorded',
        workedMinutes: 0,
        subtitle: 'Punch-out pending',
      },
      {
        dateKey: `${year}-${padM}-19`,
        status: 'approved',
        hasAttendanceData: true,
        punchInTimeUtc: `${year}-${padM}-19T03:45:00.000Z`,
        punchOutTimeUtc: `${year}-${padM}-19T12:30:00.000Z`,
        punchInDisplay: '09:15 AM',
        punchInPeriod: 'Morning',
        punchOutDisplay: '06:00 PM',
        punchOutPeriod: 'Evening',
        workedMinutes: 525,
        subtitle: 'Recorded via HRMS',
      },
    ]);
    mockedAttendanceApi.getEmploymentMonthlyAttendance.mockResolvedValueOnce(
      createEmptyMonthlySummary(year, month1Based),
    );

    const { getByTestId, getByText, findByText, queryByText } = await render(<AttendanceStatusScreen />);

    fireEvent.press(getByTestId('attendance-day-19'));
    expect(await findByText('09:15 AM')).toBeTruthy();

    fireEvent.press(getByTestId('attendance-day-18'));
    expect(await findByText('Punch-out pending')).toBeTruthy();
    expect(getByTestId('punch-in-time')).toHaveTextContent('09:00 AM');
    expect(getByTestId('punch-out-time')).toHaveTextContent('—');

    fireEvent.press(getByTestId('attendance-day-15'));
    expect(await findByText('Scheduled off day')).toBeTruthy();
    expect(getByTestId('punch-in-time')).toHaveTextContent('—');
    expect(queryByText('Not recorded')).toBeNull();
    expect(getByText('No log')).toBeTruthy();
  });
});
