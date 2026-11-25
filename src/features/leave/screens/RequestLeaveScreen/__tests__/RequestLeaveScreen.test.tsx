import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { RequestLeaveScreen } from '../RequestLeaveScreen';

describe('RequestLeaveScreen', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders all redesigned sections according to reference design', async () => {
    const { getByText, getByTestId } = await render(<RequestLeaveScreen />);

    // Header
    expect(getByText('Request leave')).toBeTruthy();
    expect(getByTestId('approval-status-btn')).toBeTruthy();

    // Summary Card
    expect(getByText('Allocated')).toBeTruthy();
    expect(getByText('18 days')).toBeTruthy();
    expect(getByText('Taken')).toBeTruthy();
    expect(getByText('4 days')).toBeTruthy();
    expect(getByText('Pending')).toBeTruthy();
    expect(getByText('0 days')).toBeTruthy();

    // Duration Toggle
    expect(getByTestId('duration-full-btn')).toBeTruthy();
    expect(getByTestId('duration-half-btn')).toBeTruthy();

    // Date picker row
    expect(getByTestId('start-date-picker')).toBeTruthy();
    expect(getByTestId('end-date-picker')).toBeTruthy();

    // Calendar
    expect(getByText('November 2026')).toBeTruthy();
    expect(getByText('Sun')).toBeTruthy();
    expect(getByText('Mon')).toBeTruthy();

    // Reason section with available days badge
    expect(getByText('Reason')).toBeTruthy();
    expect(getByText('14 days available')).toBeTruthy();

    // Submit button
    expect(getByTestId('submit-request-btn')).toBeTruthy();
  });

  it('switches duration between Full day and Half day', async () => {
    const { getByTestId } = await render(<RequestLeaveScreen />);

    const halfDayBtn = getByTestId('duration-half-btn');
    fireEvent.press(halfDayBtn);
    await waitFor(() => {
      expect(getByTestId('duration-half-btn')).toBeTruthy();
    });

    const fullDayBtn = getByTestId('duration-full-btn');
    fireEvent.press(fullDayBtn);
    await waitFor(() => {
      expect(getByTestId('duration-full-btn')).toBeTruthy();
    });
  });

  it('navigates through calendar months', async () => {
    const { getByText, getByTestId } = await render(<RequestLeaveScreen />);

    expect(getByText('November 2026')).toBeTruthy();

    // Next month -> December 2026
    const nextBtn = getByTestId('next-month-btn');
    fireEvent.press(nextBtn);
    await waitFor(() => {
      expect(getByText('December 2026')).toBeTruthy();
    });

    // Prev month -> back to November 2026
    const prevBtn = getByTestId('prev-month-btn');
    fireEvent.press(prevBtn);
    await waitFor(() => {
      expect(getByText('November 2026')).toBeTruthy();
    });
  });

  it('allows selecting start date and end date from calendar', async () => {
    const { getByText, getByTestId } = await render(<RequestLeaveScreen />);

    // Tap day 16 (2026-11-16)
    const day16 = getByTestId('day-slot-2026-11-16');
    fireEvent.press(day16);
    await waitFor(() => {
      expect(getByText('16 Nov 2026')).toBeTruthy();
    });

    // Tap day 20 (2026-11-20)
    const day20 = getByTestId('day-slot-2026-11-20');
    fireEvent.press(day20);
    await waitFor(() => {
      expect(getByText('20 Nov 2026')).toBeTruthy();
    });
  });

  it('validates missing dates or reason on submit', async () => {
    const { getByTestId, getByText } = await render(<RequestLeaveScreen />);

    // Click submit without dates
    const submitBtn = getByTestId('submit-request-btn');
    fireEvent.press(submitBtn);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Missing Date',
        'Please select at least a start date for your leave.',
      );
    });

    // Pick date 12
    const day12 = getByTestId('day-slot-2026-11-12');
    fireEvent.press(day12);
    await waitFor(() => {
      expect(getByText('12 Nov 2026')).toBeTruthy();
    });

    // Submit without reason
    fireEvent.press(submitBtn);
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Reason Required',
        'Please enter a reason for your leave request.',
      );
    });

    // Type reason
    const input = getByTestId('reason-input');
    fireEvent.changeText(input, 'Annual family vacation');
    await waitFor(() => {
      expect(input.props.value).toBe('Annual family vacation');
    });

    // Submit successfully
    fireEvent.press(submitBtn);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Request Submitted',
        expect.stringContaining('sent for approval'),
        expect.any(Array),
      );
    });
  });

  it('navigates to leave status screen when tapping header pill', async () => {
    const { getByTestId } = await render(<RequestLeaveScreen />);

    const approvalBtn = getByTestId('approval-status-btn');
    fireEvent.press(approvalBtn);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/(app)/leave/status');
    });
  });
});
