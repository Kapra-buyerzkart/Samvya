import { cleanup, fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { useAuthStore } from '@/features/auth';
import { ApiError } from '@/shared/api';
import { leaveApi } from '../../../api/leaveApi';
import { LeaveHistoryScreen } from '../LeaveHistoryScreen';

jest.mock('../../../api/leaveApi', () => ({
  leaveApi: {
    getLeaveRequests: jest.fn(),
  },
}));

const mockedLeaveApi = leaveApi as jest.Mocked<typeof leaveApi>;

function toMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function toYmd(date: Date, day: number): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

describe('LeaveHistoryScreen', () => {
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
    const { getAllByText, getByText, getByTestId } = await render(<LeaveHistoryScreen />);

    expect(getAllByText('Leave History').length).toBeGreaterThanOrEqual(2);
    expect(getByTestId('leave-history-back-btn')).toBeTruthy();
    expect(getByText('0 days')).toBeTruthy();
    expect(getByText('Approved leave taken')).toBeTruthy();
    expect(getByText('Last 3 months')).toBeTruthy();
    expect(getByTestId('leave-history-empty')).toBeTruthy();
    expect(getByText('No leave requests found for this period.')).toBeTruthy();
    expect(mockedLeaveApi.getLeaveRequests).not.toHaveBeenCalled();
  });

  it('loads backend leave requests, supports error retry, filters by month, and paginates', async () => {
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 4, 1);

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

    mockedLeaveApi.getLeaveRequests.mockRejectedValueOnce(
      new ApiError({ status: 503, message: 'Leave service unavailable' }),
    );

    const { getByTestId, findByTestId, findByText, findAllByText, queryByText } = await render(
      <LeaveHistoryScreen />,
    );

    await waitFor(() => {
      expect(mockedLeaveApi.getLeaveRequests).toHaveBeenCalledWith(105);
    });

    const retryBanner = await findByTestId('leave-history-retry');

    mockedLeaveApi.getLeaveRequests.mockResolvedValueOnce([
      {
        leaveRequestId: 101,
        leaveTypeId: 1,
        leaveTypeName: 'Casual leave',
        startDate: toYmd(now, 20),
        endDate: toYmd(now, 20),
        totalDaysApplied: 1,
        status: 'APPROVED',
        reason: 'Family function',
      },
      {
        leaveRequestId: 102,
        leaveTypeId: 2,
        leaveTypeName: 'Sick leave',
        startDate: toYmd(now, 11),
        endDate: toYmd(now, 12),
        totalDaysApplied: 2,
        status: 'APPROVED',
        reason: 'Medical checkup and rest',
      },
      {
        leaveRequestId: 103,
        leaveTypeId: 1,
        leaveTypeName: 'Casual leave',
        startDate: toYmd(now, 5),
        endDate: toYmd(now, 5),
        totalDaysApplied: 1,
        status: 'PENDING',
        reason: 'Personal errand',
      },
      {
        leaveRequestId: 104,
        leaveTypeId: 3,
        leaveTypeName: 'Annual leave',
        startDate: toYmd(prevMonth, 15),
        endDate: toYmd(prevMonth, 15),
        totalDaysApplied: 1,
        status: 'APPROVED',
        reason: 'Short break',
      },
      {
        leaveRequestId: 105,
        leaveTypeId: 3,
        leaveTypeName: 'Annual leave',
        startDate: toYmd(sixMonthsAgo, 18),
        endDate: toYmd(sixMonthsAgo, 19),
        totalDaysApplied: 2,
        status: 'APPROVED',
        reason: 'Summer travel',
      },
    ]);

    fireEvent.press(retryBanner);

    await waitFor(() => {
      expect(getByTestId('summary-total-days')).toHaveTextContent('4 days');
    });
    expect(await findByText('1 of 2')).toBeTruthy();
    expect(await findByText('20')).toBeTruthy();
    expect(await findByText(/11 – 12/)).toBeTruthy();

    fireEvent.press(getByTestId('next-page-btn'));
    expect(await findByText('2 of 2')).toBeTruthy();
    expect((await findAllByText('15')).length).toBeGreaterThanOrEqual(1);

    fireEvent.press(getByTestId(`month-btn-${toMonthKey(prevMonth).toLowerCase()}`));
    expect((await findAllByText('15')).length).toBeGreaterThanOrEqual(1);
    expect(queryByText('20')).toBeNull();

    fireEvent.press(getByTestId('view-all-leaves-btn'));
    expect(await findByText('1 of 2')).toBeTruthy();

    fireEvent.press(getByTestId('filter-duration-btn'));
    fireEvent.press(await findByTestId('duration-option-6months'));
    await waitFor(() => {
      expect(getByTestId('summary-total-days')).toHaveTextContent('6 days');
    });
  });

  it('opens the leave detail modal when clicking a leave card and closes on close button', async () => {
    const now = new Date();

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

    mockedLeaveApi.getLeaveRequests.mockResolvedValueOnce([
      {
        leaveRequestId: 202,
        leaveTypeId: 2,
        leaveTypeName: 'Sick leave',
        startDate: toYmd(now, 11),
        endDate: toYmd(now, 12),
        totalDaysApplied: 2,
        status: 'APPROVED',
        reason: 'Medical checkup',
      },
    ]);

    const { getByTestId, findByText, findAllByText, findByTestId, queryByTestId } = await render(
      <LeaveHistoryScreen />,
    );

    const card = await findByTestId('leave-record-202');
    fireEvent.press(card);

    expect(await findByTestId('leave-detail-bottom-sheet')).toBeTruthy();
    expect((await findAllByText('Sick leave')).length).toBeGreaterThanOrEqual(2);
    expect((await findAllByText('Medical checkup')).length).toBeGreaterThanOrEqual(2);

    fireEvent.press(getByTestId('leave-detail-close-btn'));
    await waitFor(() => {
      expect(queryByTestId('leave-detail-bottom-sheet')).toBeNull();
    });
  });

  it('navigates back when back button is pressed', async () => {
    const { getByTestId } = await render(<LeaveHistoryScreen />);

    fireEvent.press(getByTestId('leave-history-back-btn'));
    expect(router.back).toHaveBeenCalled();
  });
});
