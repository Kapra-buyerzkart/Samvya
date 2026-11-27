import React from 'react';
import { Alert } from 'react-native';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '@/features/auth';
import { leaveApi } from '../../../api';
import { EditLeaveRequestScreen } from '../EditLeaveRequestScreen';

jest.mock('../../../api', () => {
  const actual = jest.requireActual('../../../api') as typeof import('../../../api');
  return {
    extractLeaveOverlapConfirmation: actual.extractLeaveOverlapConfirmation,
    leaveApi: {
      getEligibleLeaveTypes: jest.fn(),
      getLeaveRequests: jest.fn(),
      submitLeaveRequest: jest.fn(),
      cancelLeaveRequest: jest.fn(),
      withdrawLeaveRequest: jest.fn(),
    },
  };
});

jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
    replace: jest.fn(),
    push: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
}));

const mockedUseLocalSearchParams = useLocalSearchParams as jest.Mock;
const mockedLeaveApi = leaveApi as jest.Mocked<typeof leaveApi>;

describe('EditLeaveRequestScreen', () => {
  const initialAuthState = useAuthStore.getState();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ ...initialAuthState, session: null, user: null });
    (router.canGoBack as jest.Mock).mockReturnValue(true);
  });

  afterEach(async () => {
    await cleanup();
    useAuthStore.setState(initialAuthState);
    jest.restoreAllMocks();
  });

  describe('Rejected Request side', () => {
    beforeEach(() => {
      mockedUseLocalSearchParams.mockReturnValue({
        requestId: 'req-2',
        status: 'rejected',
        leaveType: 'casual',
        submittedDate: '25 Nov 2026',
        originalRange: '1–2 Dec 2026 · 2 working days',
        approverName: 'Ananya Kulkarni',
        rejectedReason: 'There is not enough employees at the requested days to complete the ERP task',
      });
    });

    it('renders rejected request UI with approver, rejected reason, and Re-type Your Reason', async () => {
      const { getByText, getByTestId, queryByTestId } = await render(<EditLeaveRequestScreen />);

      expect(getByText('Edit leave request')).toBeTruthy();
      expect(getByText('Rejected Request')).toBeTruthy();
      expect(getByText('Submitted 25 Nov 2026')).toBeTruthy();
      expect(queryByTestId('cancel-leave-btn')).toBeNull();
      expect(getByText('Original request')).toBeTruthy();
      expect(getByText('1–2 Dec 2026 · 2 working days')).toBeTruthy();
      expect(getByTestId('edit-approver-name')).toHaveTextContent('Ananya Kulkarni');
      expect(getByTestId('rejected-reason-card')).toBeTruthy();
      expect(
        getByText('There is not enough employees at the requested days to complete the ERP task'),
      ).toBeTruthy();
      expect(getByText('Updated request')).toBeTruthy();
      expect(getByText('Re-type Your Reason')).toBeTruthy();
      expect(getByTestId('edit-save-changes-btn')).toBeTruthy();
    });

    it('validates Re-type Your Reason and submits reapplication when valid', async () => {
      const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
      const { getByTestId, getByText } = await render(<EditLeaveRequestScreen />);

      await fireEvent.changeText(getByTestId('edit-secondary-reason-input'), '');
      await fireEvent.press(getByTestId('edit-save-changes-btn'));

      await waitFor(() => {
        expect(getByText('Please enter a valid reason to reapply.')).toBeTruthy();
      });
      expect(alertSpy).not.toHaveBeenCalled();

      await fireEvent.changeText(getByTestId('edit-secondary-reason-input'), 'Urgent Family meeting');
      await fireEvent.press(getByTestId('edit-save-changes-btn'));

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          'Reapplication Submitted',
          'Your leave request has been reapplied with your updated reason.',
          expect.any(Array),
        );
      });
    });
  });

  describe('Approved Request side', () => {
    beforeEach(() => {
      mockedUseLocalSearchParams.mockReturnValue({
        requestId: 'req-1',
        status: 'approved',
        leaveType: 'casual',
        submittedDate: '25 Nov 2026',
        approverName: 'Ananya Kulkarni',
      });
    });

    it('renders approved request UI with Cancel leave button and Reason for date change', async () => {
      const { getByText, getByTestId, queryByTestId } = await render(<EditLeaveRequestScreen />);

      expect(getByText('Approved Request')).toBeTruthy();
      expect(getByTestId('cancel-leave-btn')).toBeTruthy();
      expect(getByText('Cancel leave')).toBeTruthy();
      expect(queryByTestId('rejected-reason-card')).toBeNull();
      expect(getByText('Reason for date change')).toBeTruthy();
      expect(getByTestId('edit-approver-name')).toHaveTextContent('Ananya Kulkarni');
      expect(getByTestId('edit-save-changes-btn')).toBeTruthy();
    });

    it('prompts confirmation when pressing Cancel leave and cancels on confirm', async () => {
      const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
      const { getByTestId } = await render(<EditLeaveRequestScreen />);

      await fireEvent.press(getByTestId('cancel-leave-btn'));

      expect(alertSpy).toHaveBeenCalledWith(
        'Cancel approved leave',
        expect.any(String),
        expect.any(Array),
      );
    });

    it('allows changing leave type and duration via bottom sheets', async () => {
      const { getByTestId, getByText } = await render(<EditLeaveRequestScreen />);

      await fireEvent.press(getByTestId('edit-leave-type-btn'));
      await waitFor(() => {
        expect(getByTestId('edit-leave-type-option-Sick leave')).toBeTruthy();
      });
      await fireEvent.press(getByTestId('edit-leave-type-option-Sick leave'));
      await waitFor(() => {
        expect(getByText('Sick leave')).toBeTruthy();
      });

      await fireEvent.press(getByTestId('edit-duration-btn'));
      await waitFor(() => {
        expect(getByTestId('edit-duration-option-Half day')).toBeTruthy();
      });
      await fireEvent.press(getByTestId('edit-duration-option-Half day'));
      await waitFor(() => {
        expect(getByText('Half day')).toBeTruthy();
      });
    });
  });

  describe('API integration with active session', () => {
    beforeEach(() => {
      useAuthStore.setState({
        ...initialAuthState,
        session: {
          tenantId: 1,
          memberId: 1,
          employmentId: 105,
          employmentPublicId: 'EMP-105',
        },
      });
      mockedLeaveApi.getEligibleLeaveTypes.mockResolvedValue([
        { id: 2, name: 'Casual Leave', availableDays: 5 },
      ]);
      mockedLeaveApi.getLeaveRequests.mockResolvedValue([]);
      mockedLeaveApi.submitLeaveRequest.mockResolvedValue({
        leaveRequestId: 902,
        status: 'PENDING',
        raw: {},
      });
      mockedLeaveApi.cancelLeaveRequest.mockResolvedValue();
      mockedLeaveApi.withdrawLeaveRequest.mockResolvedValue();
    });

    it('submits appealsRequestId when reapplying a rejected leave request', async () => {
      jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
      mockedUseLocalSearchParams.mockReturnValue({
        requestId: '42',
        status: 'rejected',
        leaveType: 'casual',
        leaveTypeId: '2',
      });

      const { getByTestId } = await render(<EditLeaveRequestScreen />);

      await waitFor(() => {
        expect(mockedLeaveApi.getEligibleLeaveTypes).toHaveBeenCalledWith(105);
      });

      await fireEvent.changeText(getByTestId('edit-secondary-reason-input'), 'Urgent Family meeting');
      await fireEvent.press(getByTestId('edit-save-changes-btn'));

      await waitFor(() => {
        expect(mockedLeaveApi.submitLeaveRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            employmentId: 105,
            leaveTypeId: 2,
            appealsRequestId: '42',
            reason: 'Urgent Family meeting',
          }),
        );
      });
    });

    it('submits replacesRequestId when saving changes to an approved leave request', async () => {
      jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
      mockedUseLocalSearchParams.mockReturnValue({
        requestId: '55',
        status: 'approved',
        leaveType: 'casual',
        leaveTypeId: '2',
        reason: 'Family trip',
      });

      const { getByTestId } = await render(<EditLeaveRequestScreen />);

      await waitFor(() => {
        expect(mockedLeaveApi.getEligibleLeaveTypes).toHaveBeenCalledWith(105);
      });

      await fireEvent.changeText(getByTestId('edit-secondary-reason-input'), 'Got postponed');
      await fireEvent.press(getByTestId('edit-save-changes-btn'));

      await waitFor(() => {
        expect(mockedLeaveApi.submitLeaveRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            employmentId: 105,
            leaveTypeId: 2,
            replacesRequestId: '55',
            reason: 'Family trip (Got postponed)',
          }),
        );
      });
    });

    it('calls cancelLeaveRequest when confirming cancellation of an approved leave', async () => {
      const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
      mockedUseLocalSearchParams.mockReturnValue({
        requestId: '55',
        status: 'approved',
        leaveType: 'casual',
      });

      const { getByTestId } = await render(<EditLeaveRequestScreen />);

      await fireEvent.changeText(getByTestId('edit-secondary-reason-input'), 'Got postponed');
      await fireEvent.press(getByTestId('cancel-leave-btn'));

      const buttons = alertSpy.mock.calls[0]?.[2] as { onPress?: () => void }[];
      await act(async () => {
        buttons?.[1]?.onPress?.();
      });

      await waitFor(() => {
        expect(mockedLeaveApi.cancelLeaveRequest).toHaveBeenCalledWith(
          '55',
          expect.any(String),
          'Got postponed',
        );
      });
    });

    it('hydrates live request details and calls withdrawLeaveRequest for pending requests', async () => {
      const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
      mockedLeaveApi.getLeaveRequests.mockResolvedValue([
        {
          leaveRequestId: 77,
          leaveTypeId: 2,
          leaveTypeName: 'Casual Leave',
          startDate: '2026-12-10',
          endDate: '2026-12-11',
          totalDaysApplied: 2,
          status: 'Submitted',
          reason: 'Doctor visit',
          createdAtUtc: '2026-11-26T09:00:00Z',
          approverName: 'Vikram Rao',
        },
      ]);
      mockedUseLocalSearchParams.mockReturnValue({
        requestId: '77',
        status: 'pending',
        leaveType: 'casual',
      });

      const { getByTestId, getByText, getByDisplayValue } = await render(<EditLeaveRequestScreen />);

      await waitFor(() => {
        expect(getByText('Pending Request')).toBeTruthy();
        expect(getByText('Withdraw request')).toBeTruthy();
        expect(getByTestId('edit-submitted-date')).toHaveTextContent('Submitted 26 Nov 2026');
        expect(getByText('Thu, 10 Dec 2026')).toBeTruthy();
        expect(getByDisplayValue('Doctor visit')).toBeTruthy();
      });

      await fireEvent.changeText(getByTestId('edit-secondary-reason-input'), 'No longer needed');
      await fireEvent.press(getByTestId('cancel-leave-btn'));

      const buttons = alertSpy.mock.calls[0]?.[2] as { onPress?: () => void }[];
      await act(async () => {
        buttons?.[1]?.onPress?.();
      });

      await waitFor(() => {
        expect(mockedLeaveApi.withdrawLeaveRequest).toHaveBeenCalledWith('77', 'No longer needed');
      });
    });
  });
});
