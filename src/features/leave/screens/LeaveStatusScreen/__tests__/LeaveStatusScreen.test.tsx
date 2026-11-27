import React from 'react';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/features/auth';
import { ApiError } from '@/shared/api';
import { leaveApi } from '../../../api';
import { LeaveStatusScreen } from '../LeaveStatusScreen';
import { MONTH_NAMES } from '../useLeaveStatusScreen';

jest.mock('../../../api', () => {
  const actual = jest.requireActual('../../../api') as typeof import('../../../api');
  return {
    extractLeaveOverlapConfirmation: actual.extractLeaveOverlapConfirmation,
    leaveApi: {
      getEligibleLeaveTypes: jest.fn(),
      getLeaveBalances: jest.fn(),
      getLeaveRequests: jest.fn(),
      getLeaveCalendarMonth: jest.fn(),
      getLeaveLedger: jest.fn(),
    },
  };
});

const mockedLeaveApi = leaveApi as jest.Mocked<typeof leaveApi>;

function setupAuthenticatedApiMocks() {
  useAuthStore.setState({
    ...useAuthStore.getState(),
    session: {
      tenantId: 1,
      memberId: 1,
      employmentId: 105,
      employmentPublicId: 'EMP-105',
    },
  });

  mockedLeaveApi.getEligibleLeaveTypes.mockResolvedValue([
    { id: 1, name: 'Sick leaves', code: 'SL', allocatedDays: 6, takenDays: 2, availableDays: 4 },
    { id: 2, name: 'Casual leaves', code: 'CL', allocatedDays: 4, takenDays: 1, availableDays: 3 },
    { id: 3, name: 'Earned leave', code: 'EL', allocatedDays: 8, takenDays: 1, availableDays: 7 },
  ]);

  mockedLeaveApi.getLeaveBalances.mockResolvedValue({
    allocated: 18,
    taken: 4,
    pending: 0,
    available: 14,
    byType: [
      {
        leaveTypeId: 1,
        leaveTypeName: 'Sick leaves',
        leaveTypeCode: 'SL',
        allocated: 6,
        taken: 2,
        pending: 0,
        available: 4,
      },
      {
        leaveTypeId: 2,
        leaveTypeName: 'Casual leaves',
        leaveTypeCode: 'CL',
        allocated: 4,
        taken: 1,
        pending: 0,
        available: 3,
      },
      {
        leaveTypeId: 3,
        leaveTypeName: 'Earned leave',
        leaveTypeCode: 'EL',
        allocated: 8,
        taken: 1,
        pending: 0,
        available: 7,
      },
    ],
  });

  mockedLeaveApi.getLeaveCalendarMonth.mockResolvedValue([
    { dateKey: '2026-11-23', status: 'APPROVED', leaveTypeId: 2, leaveTypeName: 'Casual leaves' },
  ]);

  mockedLeaveApi.getLeaveLedger.mockResolvedValue([
    { id: 1, leaveTypeId: 2, leaveTypeName: 'Casual leaves', entryType: 'CARRY_FORWARD', days: 2 },
  ]);

  mockedLeaveApi.getLeaveRequests.mockResolvedValue([
    {
      leaveRequestId: 101,
      leaveTypeId: 2,
      leaveTypeName: 'Casual leaves',
      startDate: '2026-11-23',
      endDate: '2026-11-24',
      totalDaysApplied: 2,
      status: 'APPROVED',
      reason: 'Family event',
      createdAtUtc: '2026-11-19T08:00:00Z',
    },
    {
      leaveRequestId: 102,
      leaveTypeId: 2,
      leaveTypeName: 'Casual leaves',
      startDate: '2026-10-12',
      endDate: '2026-10-12',
      totalDaysApplied: 1,
      status: 'REJECTED',
      reason: 'Personal errand',
      createdAtUtc: '2026-10-10T09:00:00Z',
    },
    {
      leaveRequestId: 103,
      leaveTypeId: 1,
      leaveTypeName: 'Sick leaves',
      startDate: '2026-11-04',
      endDate: '2026-11-04',
      totalDaysApplied: 1,
      status: 'APPROVED',
      reason: 'Clinic visit',
      createdAtUtc: '2026-11-03T07:00:00Z',
    },
    {
      leaveRequestId: 104,
      leaveTypeId: 3,
      leaveTypeName: 'Earned leave',
      startDate: '2026-11-21',
      endDate: '2026-11-21',
      totalDaysApplied: 1,
      status: 'APPROVED',
      reason: 'Travel',
      createdAtUtc: '2026-11-18T10:00:00Z',
    },
  ]);
}

describe('LeaveStatusScreen', () => {
  const initialAuthState = useAuthStore.getState();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedLeaveApi.getEligibleLeaveTypes.mockReset();
    mockedLeaveApi.getLeaveBalances.mockReset();
    mockedLeaveApi.getLeaveRequests.mockReset();
    mockedLeaveApi.getLeaveCalendarMonth.mockReset();
    mockedLeaveApi.getLeaveLedger.mockReset();
    useAuthStore.setState({ ...initialAuthState, session: null, user: null });
    (router.canGoBack as jest.Mock).mockReturnValue(true);
  });

  afterEach(async () => {
    await cleanup();
    useAuthStore.setState(initialAuthState);
    jest.restoreAllMocks();
  });

  it('renders empty state with zero dummy data when unauthenticated', async () => {
    const now = new Date();
    const expectedMonthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
    const { getByText, getByTestId } = await render(<LeaveStatusScreen />);

    expect(getByText('Leave status')).toBeTruthy();
    expect(getByTestId('leave-status-back-btn')).toBeTruthy();
    expect(getByTestId('current-month-label')).toHaveTextContent(expectedMonthLabel);
    expect(getByTestId('summary-total-leaves')).toHaveTextContent('00');
    expect(getByTestId('summary-balance-leaves')).toHaveTextContent('00');
    expect(getByTestId('summary-leaves-taken')).toHaveTextContent('00');
    expect(getByTestId('approval-empty-state')).toBeTruthy();
    expect(mockedLeaveApi.getEligibleLeaveTypes).not.toHaveBeenCalled();
    expect(mockedLeaveApi.getLeaveBalances).not.toHaveBeenCalled();
    expect(mockedLeaveApi.getLeaveRequests).not.toHaveBeenCalled();
  });

  it('loads live leave balances and approval records when authenticated', async () => {
    setupAuthenticatedApiMocks();
    const { getByText, getAllByText, getByTestId } = await render(<LeaveStatusScreen />);

    await waitFor(() => {
      expect(getByTestId('summary-total-leaves')).toHaveTextContent('04');
      expect(getByTestId('summary-balance-leaves')).toHaveTextContent('03');
      expect(getByTestId('summary-leaves-taken')).toHaveTextContent('01');
      expect(getByText('19 Nov 2026')).toBeTruthy();
      expect(getByText('23 Nov 2026')).toBeTruthy();
      expect(getByText('10 Oct 2026')).toBeTruthy();
      expect(getByText('12 Oct 2026')).toBeTruthy();
    });

    expect(getAllByText('Approved').length).toBeGreaterThanOrEqual(2);
    expect(getByText('Rejected')).toBeTruthy();
    expect(getAllByText('Edit').length).toBe(2);
    expect(getByTestId('edit-leave-request-101')).toBeTruthy();
    expect(getByTestId('edit-leave-request-102')).toBeTruthy();
  });

  it('switches leave type tabs and updates displayed live approval records', async () => {
    setupAuthenticatedApiMocks();
    const { getByTestId, getByText } = await render(<LeaveStatusScreen />);

    await waitFor(() => {
      expect(getByTestId('summary-total-leaves')).toHaveTextContent('04');
    });

    await fireEvent.press(getByTestId('leave-type-tab-sick'));
    await waitFor(() => {
      expect(getByTestId('leave-type-tab-sick').props.accessibilityState).toEqual({
        selected: true,
      });
      expect(getByTestId('summary-total-leaves')).toHaveTextContent('06');
      expect(getByTestId('summary-balance-leaves')).toHaveTextContent('04');
      expect(getByTestId('summary-leaves-taken')).toHaveTextContent('02');
      expect(getByText('3 Nov 2026')).toBeTruthy();
      expect(getByText('4 Nov 2026')).toBeTruthy();
    });

    await fireEvent.press(getByTestId('leave-type-tab-earned'));
    await waitFor(() => {
      expect(getByTestId('leave-type-tab-earned').props.accessibilityState).toEqual({
        selected: true,
      });
      expect(getByTestId('summary-total-leaves')).toHaveTextContent('08');
      expect(getByTestId('summary-balance-leaves')).toHaveTextContent('07');
      expect(getByTestId('summary-leaves-taken')).toHaveTextContent('01');
      expect(getByText('18 Nov 2026')).toBeTruthy();
      expect(getByText('21 Nov 2026')).toBeTruthy();
    });
  });

  it('shows retry banner when all leave APIs fail and reloads on tap', async () => {
    useAuthStore.setState({
      ...initialAuthState,
      session: {
        tenantId: 1,
        memberId: 1,
        employmentId: 105,
        employmentPublicId: 'EMP-105',
      },
    });
    mockedLeaveApi.getEligibleLeaveTypes.mockRejectedValue(
      new ApiError({ message: 'Network down', status: 503 }),
    );
    mockedLeaveApi.getLeaveBalances.mockRejectedValue(
      new ApiError({ message: 'Network down', status: 503 }),
    );
    mockedLeaveApi.getLeaveRequests.mockRejectedValue(
      new ApiError({ message: 'Network down', status: 503 }),
    );
    mockedLeaveApi.getLeaveCalendarMonth.mockRejectedValue(
      new ApiError({ message: 'Network down', status: 503 }),
    );
    mockedLeaveApi.getLeaveLedger.mockRejectedValue(
      new ApiError({ message: 'Network down', status: 503 }),
    );

    const { getByTestId, queryByTestId } = await render(<LeaveStatusScreen />);

    await waitFor(() => {
      expect(getByTestId('leave-status-retry-banner')).toBeTruthy();
    });

    setupAuthenticatedApiMocks();
    await fireEvent.press(getByTestId('leave-status-retry-banner'));

    await waitFor(() => {
      expect(queryByTestId('leave-status-retry-banner')).toBeNull();
      expect(getByTestId('summary-total-leaves')).toHaveTextContent('04');
    });
  });

  it('opens and closes the Carry forwards bottom sheet with live balance summary', async () => {
    setupAuthenticatedApiMocks();
    const { getByTestId, getByText, getByLabelText, queryByTestId } = await render(
      <LeaveStatusScreen />,
    );

    await waitFor(() => {
      expect(getByTestId('summary-total-leaves')).toHaveTextContent('04');
    });

    await fireEvent.press(getByTestId('carry-forwards-btn'));

    await waitFor(() => {
      expect(getByTestId('carry-forwards-bottom-sheet')).toBeTruthy();
      expect(getByText('Casual leaves · Carry forwards')).toBeTruthy();
      expect(getByText('3 days')).toBeTruthy();
    });

    await fireEvent.press(getByLabelText('Close'));

    await waitFor(() => {
      expect(queryByTestId('carry-forwards-bottom-sheet')).toBeNull();
    });
  });

  it('navigates to leave history, attendance, and edit leave screens', async () => {
    setupAuthenticatedApiMocks();
    const { getByTestId } = await render(<LeaveStatusScreen />);

    await waitFor(() => {
      expect(getByTestId('edit-leave-request-101')).toBeTruthy();
    });

    await fireEvent.press(getByTestId('view-leave-history-btn'));
    expect(router.push).toHaveBeenCalledWith('/(app)/leave/history');

    await fireEvent.press(getByTestId('attendance-nav-btn'));
    expect(router.push).toHaveBeenCalledWith('/(app)/attendance/history');

    await fireEvent.press(getByTestId('edit-leave-request-101'));
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/(app)/leave/edit',
      params: {
        leaveType: 'casual',
        requestId: '101',
        status: 'approved',
        submittedDate: '19 Nov 2026',
        leaveTypeId: '2',
        startDate: '2026-11-23',
        endDate: '2026-11-24',
        reason: 'Family event',
        duration: 'Full days',
        originalRange: '23 Nov 2026 – 24 Nov 2026 · 2 working days',
      },
    });
  });

  it('navigates back and cycles months and status filters', async () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? now.getFullYear() + 1 : now.getFullYear();

    const { getByTestId, getByText } = await render(<LeaveStatusScreen />);

    await fireEvent.press(getByTestId('next-month-btn'));
    await waitFor(() => {
      expect(getByTestId('current-month-label')).toHaveTextContent(
        `${MONTH_NAMES[nextMonth]} ${nextYear}`,
      );
    });

    await fireEvent.press(getByTestId('prev-month-btn'));
    await waitFor(() => {
      expect(getByTestId('current-month-label')).toHaveTextContent(
        `${MONTH_NAMES[currentMonth]} ${now.getFullYear()}`,
      );
    });

    await fireEvent.press(getByTestId('filter-by-status-btn'));
    await waitFor(() => {
      expect(getByText('Status: Approved')).toBeTruthy();
    });

    await fireEvent.press(getByTestId('leave-status-back-btn'));
    expect(router.back).toHaveBeenCalled();
  });

  it('displays pending leave requests from getLeaveRequests in Approval status and filters to Pending', async () => {
    setupAuthenticatedApiMocks();
    mockedLeaveApi.getLeaveRequests.mockResolvedValue([
      {
        leaveRequestId: 201,
        leaveTypeId: 2,
        leaveTypeName: 'Casual leaves',
        startDate: '2026-11-28',
        endDate: '2026-11-28',
        totalDaysApplied: 1,
        status: 'PENDING',
        reason: 'Doctor appointment',
        createdAtUtc: '2026-11-25T09:00:00Z',
      },
      {
        leaveRequestId: 202,
        leaveTypeId: 2,
        leaveTypeName: 'Casual leaves',
        startDate: '2026-11-10',
        endDate: '2026-11-10',
        totalDaysApplied: 1,
        status: 'APPROVED',
        reason: 'Personal day',
        createdAtUtc: '2026-11-05T09:00:00Z',
      },
    ]);

    const { getByTestId, getByText, queryByText } = await render(<LeaveStatusScreen />);

    await waitFor(() => {
      expect(getByText('Pending approval')).toBeTruthy();
      expect(getByText('Awaiting review')).toBeTruthy();
      expect(getByText('25 Nov 2026')).toBeTruthy();
      expect(getByTestId('edit-leave-request-201')).toBeTruthy();
      expect(getByTestId('edit-leave-request-202')).toBeTruthy();
    });

    // Cycle filter: all -> approved -> pending
    await fireEvent.press(getByTestId('filter-by-status-btn'));
    await fireEvent.press(getByTestId('filter-by-status-btn'));

    await waitFor(() => {
      expect(getByText('Status: Pending')).toBeTruthy();
      expect(getByText('Pending approval')).toBeTruthy();
      expect(queryByText('5 Nov 2026')).toBeNull();
    });
  });

  it('maps Submitted month calendar entries to pending dates for the matching leave type', async () => {
    setupAuthenticatedApiMocks();
    mockedLeaveApi.getLeaveCalendarMonth.mockResolvedValue([
      { dateKey: '2026-11-05', status: 'Submitted', leaveTypeId: 1, leaveTypeName: 'Sick Leave' },
      { dateKey: '2026-11-06', status: 'REJECTED', leaveTypeId: 1, leaveTypeName: 'Sick Leave' },
    ]);

    const { getByTestId } = await render(<LeaveStatusScreen />);
    await fireEvent.press(getByTestId('leave-type-tab-sick'));

    await waitFor(() => {
      expect(getByTestId('leave-type-tab-sick').props.accessibilityState).toEqual({
        selected: true,
      });
    });

    const getCircleStyle = (testId: string) => {
      const node = getByTestId(testId).children[0] as unknown as {
        props: { style: StyleProp<ViewStyle> };
      };
      return StyleSheet.flatten(node.props.style);
    };

    expect(getCircleStyle('status-day-2026-11-04')).toMatchObject({
      width: 44,
      height: 44,
      borderRadius: 22,
      borderColor: '#10B981',
    });
    expect(getCircleStyle('status-day-2026-11-05')).toMatchObject({
      width: 44,
      height: 44,
      borderRadius: 22,
      borderColor: '#EAB308',
    });
    expect(getCircleStyle('status-day-2026-11-06')).toMatchObject({
      width: 44,
      height: 44,
      borderRadius: 22,
      borderColor: '#EF4444',
    });
  });
});
