import React from 'react';
import { StyleSheet } from 'react-native';
import { cleanup, render, fireEvent, waitFor } from '@testing-library/react-native';
import { attendanceApi } from '@/features/attendance/api/attendanceApi';
import { useAuthStore } from '@/features/auth';
import { ApiError } from '@/shared/api';
import { employmentApi } from '../../../api/employmentApi';
import { type EmploymentHistoryItem, type MonthlyWorkHoursSummary } from '../../../domain/types';
import { EmploymentDetailsScreen } from '../EmploymentDetailsScreen';

jest.mock('@/features/attendance/api/attendanceApi', () => ({
  attendanceApi: {
    getEmploymentMonthlyAttendance: jest.fn(),
  },
}));

jest.mock('../../../api/employmentApi', () => ({
  employmentApi: {
    loadEmploymentHistory: jest.fn(),
  },
}));

const mockedAttendanceApi = attendanceApi as jest.Mocked<typeof attendanceApi>;
const mockedEmploymentApi = employmentApi as jest.Mocked<typeof employmentApi>;

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

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function buildMonthSummary(year: number, month: number): MonthlyWorkHoursSummary {
  const daysInMonth = new Date(year, month, 0).getDate();
  return {
    year,
    month,
    monthName: `${MONTH_NAMES[month - 1] ?? 'January'} ${year}`,
    workingDays: 20,
    totalHoursFormatted: '96hrs 15m',
    daysRecorded: 12,
    dailyRecords: Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      if (day === 2) {
        return {
          day,
          dayOfWeek: 'Mon',
          hours: 6,
          formattedHours: '6h',
          status: 'recorded',
        };
      }
      if (day === 5) {
        return {
          day,
          dayOfWeek: 'Thur',
          hours: 8,
          formattedHours: '8h',
          status: 'recorded',
        };
      }
      return {
        day,
        dayOfWeek: 'Wed',
        hours: 0,
        formattedHours: '0h',
        status: 'no_entry',
      };
    }),
  };
}

describe('EmploymentDetailsScreen', () => {
  const initialAuthState = useAuthStore.getState();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ ...initialAuthState, session: null, user: null });
  });

  afterEach(() => {
    cleanup();
    useAuthStore.setState(initialAuthState);
  });

  it('uses an unobstructed ScrollView with nested scroll and bottom tab-bar clearance', async () => {
    const { getByTestId, queryByTestId } = await render(<EmploymentDetailsScreen />);

    const scrollView = getByTestId('employment-details-scroll-view');
    expect(queryByTestId('employment-details-scroll-view-dismiss-touchable')).toBeNull();
    expect(scrollView.props.nestedScrollEnabled).toBe(true);
    expect(StyleSheet.flatten(scrollView.props.style)).toMatchObject({ flex: 1 });
    expect(StyleSheet.flatten(scrollView.props.contentContainerStyle)).toMatchObject({
      flexGrow: 1,
      paddingBottom: 116,
    });
  });

  it('renders plain off-white background and solid white focused cards without dummy data', async () => {
    const { getByTestId, getByText, queryByText } = await render(<EmploymentDetailsScreen />);

    expect(StyleSheet.flatten(getByTestId('employment-details-screen').props.style)).toMatchObject({
      backgroundColor: '#F4F6FA',
    });
    expect(StyleSheet.flatten(getByTestId('monthly-work-hours-card').props.style)).toMatchObject({
      backgroundColor: '#FFFFFF',
      borderColor: '#E2E8F0',
    });
    expect(StyleSheet.flatten(getByTestId('employment-history-card').props.style)).toMatchObject({
      backgroundColor: '#FFFFFF',
      borderColor: '#E2E8F0',
    });

    expect(getByText('Employment details')).toBeTruthy();
    expect(getByTestId('employment-month-empty')).toBeTruthy();
    expect(getByTestId('employment-history-empty')).toBeTruthy();
    expect(getByTestId('employment-history-count')).toHaveTextContent('0');

    expect(queryByText('77hrs 30m')).toBeNull();
    expect(queryByText('HR Manager')).toBeNull();
    expect(queryByText('KAP0002')).toBeNull();
    expect(queryByText('Test Organisation')).toBeNull();
  });

  it('shows shimmer placeholders while loading and replaces them with API data', async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

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

    const monthDeferred = createDeferred<MonthlyWorkHoursSummary>();
    const historyDeferred = createDeferred<EmploymentHistoryItem[]>();
    mockedAttendanceApi.getEmploymentMonthlyAttendance.mockReturnValueOnce(monthDeferred.promise);
    mockedEmploymentApi.loadEmploymentHistory.mockReturnValueOnce(historyDeferred.promise);

    const { getByTestId, queryByTestId, findByText, getByLabelText } = await render(
      <EmploymentDetailsScreen />,
    );

    expect(getByTestId('employment-month-shimmer')).toBeTruthy();
    expect(getByTestId('employment-history-shimmer')).toBeTruthy();
    expect(getByTestId('employment-history-count')).toHaveTextContent('—');

    monthDeferred.resolve(buildMonthSummary(year, month));
    historyDeferred.resolve([
      {
        id: '105',
        designation: 'Staff Engineer',
        status: 'Active',
        isPrimary: true,
        employeeCode: 'SAM-909',
        organisation: 'Samavya Tech',
        office: 'Kochi Hub',
        department: 'Platform',
        employmentType: 'Permanent',
        workArrangement: 'Hybrid',
        effectivePeriod: '01 Oct 2026 · Open ended',
        confirmation: 'Confirmed · 01 Oct 2026',
        joinedDate: '01 Oct 2026',
        lastWorkingDay: 'Not recorded',
        relievedDate: 'Not recorded',
      },
    ]);

    expect(await findByText('96hrs 15m')).toBeTruthy();
    expect(await findByText('Staff Engineer')).toBeTruthy();
    expect(queryByTestId('employment-month-shimmer')).toBeNull();
    expect(queryByTestId('employment-history-shimmer')).toBeNull();
    expect(getByTestId('employment-history-count')).toHaveTextContent('1');

    fireEvent.press(getByLabelText('Day 2, Mon, 6 hours'));
    expect(await findByText('Mon. 6h')).toBeTruthy();
  });

  it('cycles months when clicking previous and next month buttons', async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    const currentLabel = `${MONTH_NAMES[month - 1]} ${year}`;
    const prevLabel = `${MONTH_NAMES[prevMonth - 1]} ${prevYear}`;

    const { getByText, findByText, getByLabelText } = await render(
      <EmploymentDetailsScreen />,
    );

    expect(getByText(currentLabel)).toBeTruthy();

    fireEvent.press(getByLabelText('Previous month'));
    expect(await findByText(prevLabel)).toBeTruthy();

    fireEvent.press(getByLabelText('Next month'));
    expect(await findByText(currentLabel)).toBeTruthy();
  });

  it('shows retry banners on error without dummy fallbacks and loads real API data on retry', async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

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

    mockedAttendanceApi.getEmploymentMonthlyAttendance.mockRejectedValueOnce(
      new ApiError({ status: 500, message: 'Server unavailable' }),
    );
    mockedEmploymentApi.loadEmploymentHistory.mockRejectedValueOnce(
      new ApiError({ status: 502, message: 'Employment service unavailable' }),
    );

    const { getByTestId, findByTestId, findByText, queryByText, getByLabelText } = await render(
      <EmploymentDetailsScreen />,
    );

    await waitFor(() => {
      expect(mockedAttendanceApi.getEmploymentMonthlyAttendance).toHaveBeenCalledWith({
        employmentId: 105,
        year,
        month,
      });
    });

    const monthRetry = await findByTestId('employment-month-retry');
    const historyRetry = await findByTestId('employment-history-retry');
    expect(queryByText('77hrs 30m')).toBeNull();
    expect(queryByText('HR Manager')).toBeNull();

    mockedAttendanceApi.getEmploymentMonthlyAttendance.mockResolvedValueOnce(
      buildMonthSummary(year, month),
    );
    mockedEmploymentApi.loadEmploymentHistory.mockResolvedValueOnce([
      {
        id: '105',
        designation: 'Lead Architect',
        status: 'Active',
        isPrimary: true,
        employeeCode: 'SAM-105',
        organisation: 'Samavya Inc',
        office: 'Remote Hub',
        department: 'Core Engineering',
        employmentType: 'Full-Time',
        workArrangement: 'Remote',
        effectivePeriod: '01 Jan 2026 · Open ended',
        confirmation: 'Confirmed · 01 Jul 2026',
        joinedDate: '01 Jan 2026',
        lastWorkingDay: 'Not recorded',
        relievedDate: 'Not recorded',
      },
      {
        id: '88',
        designation: 'Senior Developer',
        status: 'Inactive',
        isPrimary: false,
        employeeCode: 'SAM-088',
        organisation: 'Samavya Labs',
        office: 'Bengaluru',
        department: 'Product',
        employmentType: 'Contract',
        workArrangement: 'On-site',
        effectivePeriod: '01 Jan 2024 · 31 Dec 2025',
        confirmation: 'Confirmed',
        joinedDate: '01 Jan 2024',
        lastWorkingDay: '31 Dec 2025',
        relievedDate: '31 Dec 2025',
      },
    ]);

    await fireEvent.press(monthRetry);
    await fireEvent.press(historyRetry);

    expect(await findByText('96hrs 15m')).toBeTruthy();
    expect(await findByText('12 days recorded')).toBeTruthy();
    expect(await findByText('Lead Architect')).toBeTruthy();
    expect(await findByText('Senior Developer')).toBeTruthy();
    expect(getByTestId('employment-history-count')).toHaveTextContent('2');

    mockedAttendanceApi.getEmploymentMonthlyAttendance.mockResolvedValueOnce({
      ...buildMonthSummary(prevYear, prevMonth),
      workingDays: 22,
      totalHoursFormatted: '140hrs',
      daysRecorded: 18,
    });

    await fireEvent.press(getByLabelText('Previous month'));
    await waitFor(() => {
      expect(mockedAttendanceApi.getEmploymentMonthlyAttendance).toHaveBeenLastCalledWith({
        employmentId: 105,
        year: prevYear,
        month: prevMonth,
      });
    });
    expect(await findByText('140hrs')).toBeTruthy();
  });
});
