import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { AttendanceStatusScreen } from '../AttendanceStatusScreen';

describe('AttendanceStatusScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header, month title, and selected day card according to reference design', async () => {
    const { getByText, getByTestId, getAllByText } = await render(<AttendanceStatusScreen />);

    // Header
    expect(getByText('Attendance status')).toBeTruthy();
    expect(getByTestId('attendance-status-back-btn')).toBeTruthy();

    // Month
    expect(getByTestId('current-month-label')).toHaveTextContent('November 2026');

    // Weekday headers
    expect(getByText('Sun')).toBeTruthy();
    expect(getByText('Mon')).toBeTruthy();
    expect(getByText('Tue')).toBeTruthy();
    expect(getByText('Wed')).toBeTruthy();
    expect(getByText('Thu')).toBeTruthy();
    expect(getByText('Fri')).toBeTruthy();
    expect(getByText('Sat')).toBeTruthy();

    // Legend
    expect(getAllByText('Approved').length).toBeGreaterThanOrEqual(2);
    expect(getByText('Pending review')).toBeTruthy();

    // Default selected day: 19 Nov 2026
    expect(getByTestId('selected-day-title')).toHaveTextContent('Thu, 19 Nov 2026');
    expect(getByText('Selfies recorded · IST')).toBeTruthy();

    // Punch times matching design
    expect(getByText('Punch-in')).toBeTruthy();
    expect(getByText('Morning')).toBeTruthy();
    expect(getByTestId('punch-in-time')).toHaveTextContent('09:02 AM');

    expect(getByText('Punch-out')).toBeTruthy();
    expect(getByText('Evening')).toBeTruthy();
    expect(getByTestId('punch-out-time')).toHaveTextContent('05:34 PM');
  });

  it('cycles months when clicking previous and next month buttons', async () => {
    const { getByTestId, findByText } = await render(<AttendanceStatusScreen />);

    expect(getByTestId('current-month-label')).toHaveTextContent('November 2026');

    // Click previous month
    fireEvent.press(getByTestId('prev-month-btn'));
    expect(await findByText('October 2026')).toBeTruthy();

    // Click next month
    fireEvent.press(getByTestId('next-month-btn'));
    expect(await findByText('November 2026')).toBeTruthy();
  });

  it('updates selected day card when another date is tapped', async () => {
    const { getByTestId } = await render(<AttendanceStatusScreen />);

    // Tap day 13 (pending day)
    fireEvent.press(getByTestId('attendance-day-13'));
    await waitFor(() => {
      expect(getByTestId('selected-day-title')).toHaveTextContent('Fri, 13 Nov 2026');
      expect(getByTestId('punch-in-time')).toHaveTextContent('09:30 AM');
      expect(getByTestId('punch-out-time')).toHaveTextContent('06:15 PM');
    });
  });

  it('navigates back when pressing back button', async () => {
    const { getByTestId } = await render(<AttendanceStatusScreen />);

    fireEvent.press(getByTestId('attendance-status-back-btn'));
    expect(router.back).toHaveBeenCalled();
  });
});
