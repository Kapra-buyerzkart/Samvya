import { useAuthStore } from '@/features/auth';
import { ApiError } from '@/shared/api';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { Alert, StyleSheet } from 'react-native';
import { leaveApi } from '../../../api';
import { RequestLeaveScreen } from '../RequestLeaveScreen';

jest.mock('../../../api', () => {
  const actual = jest.requireActual('../../../api') as typeof import('../../../api');
  return {
    extractLeaveOverlapConfirmation: actual.extractLeaveOverlapConfirmation,
    leaveApi: {
      getEligibleLeaveTypes: jest.fn(),
      getLeaveBalances: jest.fn(),
      submitLeaveRequest: jest.fn(),
    },
  };
});

const mockedLeaveApi = leaveApi as jest.Mocked<typeof leaveApi>;

describe('RequestLeaveScreen', () => {
  const initialAuthState = useAuthStore.getState();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ ...initialAuthState, session: null, user: null });
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(async () => {
    await cleanup();
    useAuthStore.setState(initialAuthState);
    jest.restoreAllMocks();
  });

  it('renders all redesigned sections according to reference design', async () => {
    const { getByText, getByTestId } = await render(<RequestLeaveScreen />);

    // Header with available days badge
    expect(getByText('Request leave')).toBeTruthy();
    expect(getByTestId('available-days-badge')).toHaveTextContent('14 days available');

    // Summary Metrics
    expect(getByText('Allocated')).toBeTruthy();
    expect(getByTestId('summary-allocated-value')).toHaveTextContent('18 days');
    expect(getByText('Taken')).toBeTruthy();
    expect(getByTestId('summary-taken-value')).toHaveTextContent('4 days');
    expect(getByText('Pending')).toBeTruthy();
    expect(getByTestId('summary-pending-value')).toHaveTextContent('0 days');

    // Leave type dropdown card
    expect(getByTestId('leave-type-dropdown')).toBeTruthy();
    expect(getByTestId('selected-leave-type-name')).toHaveTextContent('Earned Leaves');

    // Calendar card
    expect(
      StyleSheet.flatten(getByTestId('request-leave-calendar-card').props.style),
    ).toMatchObject({
      backgroundColor: '#FFFFFF',
      borderColor: '#E2E8F0',
    });
    expect(getByText('November 2026')).toBeTruthy();
    expect(getByText('Sun')).toBeTruthy();
    expect(getByText('Mon')).toBeTruthy();

    // Selected breakdown card
    expect(getByTestId('selected-breakdown-card')).toBeTruthy();
    expect(getByText('SELECTED BREAKDOWN')).toBeTruthy();
    expect(getByTestId('add-date-btn')).toBeTruthy();

    // Reason section with Leave status pill
    expect(getByText('Reason')).toBeTruthy();
    expect(getByTestId('approval-status-btn')).toBeTruthy();
    expect(getByText('Leave status')).toBeTruthy();

    // Totals card
    expect(getByTestId('request-totals-card')).toBeTruthy();
    expect(getByTestId('total-requested-value')).toHaveTextContent('0 days');
    expect(getByTestId('balance-after-approval-value')).toHaveTextContent('14 days');

    // Submit button
    expect(getByTestId('submit-request-btn')).toBeTruthy();
  });

  it('toggles per-day duration between Full day and Half day in breakdown and updates totals', async () => {
    const { getByTestId } = await render(<RequestLeaveScreen />);

    await fireEvent.press(getByTestId('day-slot-2026-11-24'));
    await fireEvent.press(getByTestId('day-slot-2026-11-25'));

    expect(getByTestId('breakdown-row-2026-11-24')).toBeTruthy();
    expect(getByTestId('breakdown-row-2026-11-25')).toBeTruthy();
    expect(getByTestId('total-requested-value')).toHaveTextContent('2 days');
    expect(getByTestId('balance-after-approval-value')).toHaveTextContent('12 days');

    await fireEvent.press(getByTestId('breakdown-duration-2026-11-25'));
    expect(getByTestId('breakdown-days-2026-11-25')).toHaveTextContent('0.5 day');
    expect(getByTestId('total-requested-value')).toHaveTextContent('1.5 days');
    expect(getByTestId('balance-after-approval-value')).toHaveTextContent('12.5 days');

    await fireEvent.press(getByTestId('breakdown-remove-2026-11-25'));
    expect(getByTestId('total-requested-value')).toHaveTextContent('1 day');

    await fireEvent.press(getByTestId('add-date-btn'));
    expect(getByTestId('breakdown-row-2026-11-25')).toBeTruthy();
    expect(getByTestId('total-requested-value')).toHaveTextContent('2 days');
  });

  it('navigates through calendar months', async () => {
    const { getByText, getByTestId } = await render(<RequestLeaveScreen />);

    expect(getByText('November 2026')).toBeTruthy();

    await fireEvent.press(getByTestId('next-month-btn'));
    await waitFor(() => {
      expect(getByText('December 2026')).toBeTruthy();
    });

    await fireEvent.press(getByTestId('prev-month-btn'));
    await waitFor(() => {
      expect(getByText('November 2026')).toBeTruthy();
    });
  });

  it('allows selecting start date and end date from calendar', async () => {
    const { getByTestId } = await render(<RequestLeaveScreen />);

    await fireEvent.press(getByTestId('day-slot-2026-11-16'));
    await waitFor(() => {
      expect(getByTestId('breakdown-row-2026-11-16')).toBeTruthy();
    });

    await fireEvent.press(getByTestId('day-slot-2026-11-20'));
    await waitFor(() => {
      expect(getByTestId('breakdown-row-2026-11-20')).toBeTruthy();
      expect(getByTestId('total-requested-value')).toHaveTextContent('5 days');
    });
  });

  it('validates missing dates or reason on submit', async () => {
    const { getByTestId } = await render(<RequestLeaveScreen />);

    await fireEvent.press(getByTestId('submit-request-btn'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Missing Date',
        'Please select at least a start date for your leave.',
      );
    });

    await fireEvent.press(getByTestId('day-slot-2026-11-12'));
    await waitFor(() => {
      expect(getByTestId('breakdown-row-2026-11-12')).toBeTruthy();
    });

    await fireEvent.press(getByTestId('submit-request-btn'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Reason Required',
        'Please enter a reason for your leave request.',
      );
    });

    const input = getByTestId('reason-input');
    await fireEvent.changeText(input, 'Annual family vacation');
    expect(getByTestId('reason-input').props.value).toBe('Annual family vacation');

    await fireEvent.press(getByTestId('submit-request-btn'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Request Submitted',
        expect.stringContaining('sent for approval'),
        expect.any(Array),
      );
    });
  });

  it('loads eligible leave types and balances from APIs and submits leave request', async () => {
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

    mockedLeaveApi.getEligibleLeaveTypes.mockResolvedValue([
      { id: 1, name: 'Casual Leave', code: 'CL' },
      { id: 2, name: 'Sick Leave', code: 'SL' },
    ]);
    mockedLeaveApi.getLeaveBalances.mockResolvedValue({
      allocated: 18,
      taken: 4,
      pending: 1,
      available: 13,
      byType: [
        {
          leaveTypeId: 1,
          leaveTypeName: 'Casual Leave',
          allocated: 12,
          taken: 3,
          pending: 1,
          available: 8,
        },
        {
          leaveTypeId: 2,
          leaveTypeName: 'Sick Leave',
          allocated: 6,
          taken: 1,
          pending: 0,
          available: 5,
        },
      ],
    });
    mockedLeaveApi.submitLeaveRequest.mockResolvedValueOnce({
      leaveRequestId: 901,
      status: 'PENDING',
      raw: { leaveRequestId: 901 },
    });

    const { getByTestId } = await render(<RequestLeaveScreen />);

    await waitFor(() => {
      expect(getByTestId('selected-leave-type-name')).toHaveTextContent('Casual Leave');
    });
    expect(getByTestId('summary-allocated-value')).toHaveTextContent('12 days');
    expect(getByTestId('summary-taken-value')).toHaveTextContent('3 days');
    expect(getByTestId('summary-pending-value')).toHaveTextContent('1 day');
    expect(getByTestId('available-days-badge')).toHaveTextContent('8 days available');

    await fireEvent.press(getByTestId('leave-type-dropdown'));
    await fireEvent.press(getByTestId('leave-type-pill-2'));
    await waitFor(() => {
      expect(getByTestId('selected-leave-type-name')).toHaveTextContent('Sick Leave');
      expect(getByTestId('summary-allocated-value')).toHaveTextContent('6 days');
      expect(getByTestId('available-days-badge')).toHaveTextContent('5 days available');
    });

    await fireEvent.press(getByTestId('day-slot-2026-11-16'));
    await fireEvent.press(getByTestId('day-slot-2026-11-17'));
    await fireEvent.changeText(getByTestId('reason-input'), 'Medical appointment');
    await fireEvent.press(getByTestId('submit-request-btn'));

    await waitFor(() => {
      expect(mockedLeaveApi.submitLeaveRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          employmentId: 105,
          leaveTypeId: 2,
          startDate: '2026-11-16',
          endDate: '2026-11-17',
          isHalfDayStart: false,
          isHalfDayEnd: false,
          totalDaysApplied: 2,
          reason: 'Medical appointment',
          requestId: expect.any(String),
        }),
      );
      expect(Alert.alert).toHaveBeenCalledWith(
        'Request Submitted',
        expect.stringContaining('2 days'),
        expect.any(Array),
      );
    });
  });

  it('handles LEAVE_OVERLAP confirmation and retry banner cleanly', async () => {
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

    mockedLeaveApi.getEligibleLeaveTypes.mockRejectedValueOnce(
      new ApiError({ status: 503, message: 'Leave service down' }),
    );
    mockedLeaveApi.getLeaveBalances.mockRejectedValueOnce(
      new ApiError({ status: 503, message: 'Leave service down' }),
    );

    const { getByTestId, findByTestId } = await render(<RequestLeaveScreen />);

    const retryBanner = await findByTestId('request-leave-retry');

    mockedLeaveApi.getEligibleLeaveTypes.mockResolvedValue([
      { id: 1, name: 'Casual Leave', code: 'CL' },
    ]);
    mockedLeaveApi.getLeaveBalances.mockResolvedValue({
      allocated: 10,
      taken: 2,
      pending: 0,
      available: 8,
      byType: [
        {
          leaveTypeId: 1,
          leaveTypeName: 'Casual Leave',
          allocated: 10,
          taken: 2,
          pending: 0,
          available: 8,
        },
      ],
    });

    await fireEvent.press(retryBanner);
    await waitFor(() => {
      expect(getByTestId('selected-leave-type-name')).toHaveTextContent('Casual Leave');
    });

    mockedLeaveApi.submitLeaveRequest
      .mockRejectedValueOnce(
        new ApiError({ status: 409, message: 'LEAVE_OVERLAP:ovp_confirm_123' }),
      )
      .mockResolvedValueOnce({ leaveRequestId: 777, status: 'PENDING', raw: {} });

    await fireEvent.press(getByTestId('day-slot-2026-11-12'));
    await fireEvent.press(getByTestId('breakdown-duration-2026-11-12'));
    await fireEvent.changeText(getByTestId('reason-input'), 'Half day errand');
    await fireEvent.press(getByTestId('submit-request-btn'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Overlapping Leave Detected',
        expect.stringContaining('overlap'),
        expect.any(Array),
      );
    });

    const overlapAlertCall = (Alert.alert as jest.Mock).mock.calls.find(
      ([title]) => title === 'Overlapping Leave Detected',
    );
    const buttons = overlapAlertCall?.[2] as { text: string; onPress?: () => void }[];
    await act(async () => {
      buttons.find((b) => b.text === 'Confirm & Submit')?.onPress?.();
    });

    await waitFor(() => {
      expect(mockedLeaveApi.submitLeaveRequest).toHaveBeenCalledTimes(2);
      const secondCall = mockedLeaveApi.submitLeaveRequest.mock.calls[1]?.[0];
      expect(secondCall).toMatchObject({
        employmentId: 105,
        leaveTypeId: 1,
        startDate: '2026-11-12',
        endDate: '2026-11-12',
        isHalfDayStart: true,
        isHalfDayEnd: false,
        totalDaysApplied: 0.5,
        overlapConfirmation: 'ovp_confirm_123',
      });
    });
  });

  it('navigates to leave status screen when tapping header pill', async () => {
    const { getByTestId } = await render(<RequestLeaveScreen />);

    await fireEvent.press(getByTestId('approval-status-btn'));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/(app)/leave/status');
    });
  });
});
