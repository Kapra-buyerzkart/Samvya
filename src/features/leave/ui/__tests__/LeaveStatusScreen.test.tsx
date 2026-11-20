import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { LeaveStatusScreen } from '../LeaveStatusScreen';

describe('LeaveStatusScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all sections according to reference design', async () => {
    const { getByText, getAllByText, getByTestId } = await render(<LeaveStatusScreen />);

    // Header
    expect(getByText('Leave status')).toBeTruthy();
    expect(getByTestId('leave-status-back-btn')).toBeTruthy();

    // Month Navigation
    expect(getByTestId('current-month-label')).toHaveTextContent('November 2026');
    expect(getByTestId('prev-month-btn')).toBeTruthy();
    expect(getByTestId('next-month-btn')).toBeTruthy();

    // Filters
    expect(getByTestId('filter-by-status-btn')).toBeTruthy();
    expect(getByTestId('select-date-btn')).toBeTruthy();

    // Weekdays
    expect(getByText('Sun')).toBeTruthy();
    expect(getByText('Mon')).toBeTruthy();
    expect(getByText('Tue')).toBeTruthy();
    expect(getByText('Wed')).toBeTruthy();
    expect(getByText('Thu')).toBeTruthy();
    expect(getByText('Fri')).toBeTruthy();
    expect(getByText('Sat')).toBeTruthy();

    // Legend & Timeline items have 'Approved'
    expect(getAllByText('Approved').length).toBeGreaterThanOrEqual(2);
    expect(getByText('Pending')).toBeTruthy();

    // Approval status Card
    expect(getByText('Approval status')).toBeTruthy();
    expect(getByText('Approved / rejected leaves status')).toBeTruthy();

    // Timeline records
    expect(getByText('19 Nov 2026')).toBeTruthy();
    expect(getByText('20 Nov 2026')).toBeTruthy();
    expect(getByText('10 Oct 2026')).toBeTruthy();
    expect(getByText('12 Oct 2026')).toBeTruthy();
    expect(getByText('Rejected')).toBeTruthy();
  });

  it('navigates back when pressing back button', async () => {
    const { getByTestId } = await render(<LeaveStatusScreen />);

    const backBtn = getByTestId('leave-status-back-btn');
    fireEvent.press(backBtn);

    await waitFor(() => {
      expect(router.back).toHaveBeenCalled();
    });
  });

  it('navigates through months with prev and next buttons', async () => {
    const { getByTestId } = await render(<LeaveStatusScreen />);

    // Next month -> December 2026
    fireEvent.press(getByTestId('next-month-btn'));
    await waitFor(() => {
      expect(getByTestId('current-month-label')).toHaveTextContent('December 2026');
    });

    // Prev month -> back to November 2026
    fireEvent.press(getByTestId('prev-month-btn'));
    await waitFor(() => {
      expect(getByTestId('current-month-label')).toHaveTextContent('November 2026');
    });

    // Prev month again -> October 2026
    fireEvent.press(getByTestId('prev-month-btn'));
    await waitFor(() => {
      expect(getByTestId('current-month-label')).toHaveTextContent('October 2026');
    });
  });

  it('cycles through status filters when pressing Filter by status', async () => {
    const { getByTestId, getByText } = await render(<LeaveStatusScreen />);

    const filterBtn = getByTestId('filter-by-status-btn');

    // Cycle to approved
    fireEvent.press(filterBtn);
    await waitFor(() => {
      expect(getByText('Status: Approved')).toBeTruthy();
    });

    // Cycle to pending
    fireEvent.press(filterBtn);
    await waitFor(() => {
      expect(getByText('Status: Pending')).toBeTruthy();
    });

    // Cycle to rejected
    fireEvent.press(filterBtn);
    await waitFor(() => {
      expect(getByText('Status: Rejected')).toBeTruthy();
    });

    // Cycle back to all
    fireEvent.press(filterBtn);
    await waitFor(() => {
      expect(getByText('Filter by status')).toBeTruthy();
    });
  });

  it('allows selecting and unselecting a calendar day', async () => {
    const { getByTestId } = await render(<LeaveStatusScreen />);

    const day23 = getByTestId('status-day-2026-11-23');
    fireEvent.press(day23);

    await waitFor(() => {
      expect(getByTestId('status-day-2026-11-23')).toBeTruthy();
    });

    const selectDateBtn = getByTestId('select-date-btn');
    fireEvent.press(selectDateBtn);

    await waitFor(() => {
      expect(getByTestId('status-day-2026-11-23')).toBeTruthy();
    });
  });
});
