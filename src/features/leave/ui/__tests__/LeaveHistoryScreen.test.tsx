import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { LeaveHistoryScreen } from '../LeaveHistoryScreen';

describe('LeaveHistoryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header, leave by month summary metric, and pie chart slices according to reference design', async () => {
    const { getAllByText, getByText, getByTestId } = await render(<LeaveHistoryScreen />);

    // Header and Card title
    expect(getAllByText('Leave History').length).toBeGreaterThanOrEqual(2);
    expect(getByTestId('leave-history-back-btn')).toBeTruthy();

    // Summary Metric
    expect(getByText('Leave by month')).toBeTruthy();
    expect(getByText('5.5 days')).toBeTruthy();
    expect(getByText('Approved leave taken')).toBeTruthy();

    // Filter pill
    expect(getByText('Last 3 months')).toBeTruthy();
    expect(getByText('Sep-Nov 2026')).toBeTruthy();

    // Pie chart container (react-native-gifted-charts)
    expect(getByTestId('gifted-pie-chart-container')).toBeTruthy();

    // Month Selector Buttons
    expect(getByTestId('month-btn-sep')).toBeTruthy();
    expect(getByTestId('month-btn-oct')).toBeTruthy();
    expect(getByTestId('month-btn-nov')).toBeTruthy();

    // Default November list (3 items)
    expect(getByText('20')).toBeTruthy();
    expect(getByText('11-12')).toBeTruthy();
    expect(getByText('10')).toBeTruthy();
    expect(getByText('1 of 1')).toBeTruthy();
  });

  it('filters leave history items when another month is selected', async () => {
    const { getByTestId, queryByText, findByText, findAllByText } = await render(
      <LeaveHistoryScreen />,
    );

    // Tap Oct
    fireEvent.press(getByTestId('month-btn-oct'));
    expect(await findByText('15')).toBeTruthy();
    expect((await findAllByText('Oct')).length).toBeGreaterThanOrEqual(2);
    expect(queryByText('20')).toBeNull();

    // Tap Sep
    fireEvent.press(getByTestId('month-btn-sep'));
    expect(await findByText('28')).toBeTruthy();
    expect(await findByText('05')).toBeTruthy();
  });

  it('displays all records and paginates through them when View all is pressed', async () => {
    const { getByTestId, findByText } = await render(<LeaveHistoryScreen />);

    // Press View all 6
    fireEvent.press(getByTestId('view-all-leaves-btn'));

    // 6 records with 3 per page means 2 pages
    expect(await findByText('1 of 2')).toBeTruthy();

    // Press Next page
    fireEvent.press(getByTestId('next-page-btn'));
    expect(await findByText('2 of 2')).toBeTruthy();

    // Press Prev page
    fireEvent.press(getByTestId('prev-page-btn'));
    expect(await findByText('1 of 2')).toBeTruthy();
  });

  it('navigates back when back button is pressed', async () => {
    const { getByTestId } = await render(<LeaveHistoryScreen />);

    fireEvent.press(getByTestId('leave-history-back-btn'));
    expect(router.back).toHaveBeenCalled();
  });

  it('updates duration to 6 months and 1 year dynamically recalculating metrics and pie chart data', async () => {
    const { getByTestId, findByText, findByTestId } = await render(<LeaveHistoryScreen />);

    // Initial state: 3 months
    expect(await findByText('5.5 days')).toBeTruthy();

    // Open duration picker
    fireEvent.press(getByTestId('filter-duration-btn'));

    // Select 6 months
    fireEvent.press(await findByTestId('duration-option-6months'));

    // Verify dynamic update for 6 months
    expect(await findByText('10 days')).toBeTruthy();
    expect(await findByText('Jun-Nov 2026')).toBeTruthy();
    expect(await findByTestId('month-btn-jun')).toBeTruthy();

    // Open duration picker again and select 1 year
    fireEvent.press(getByTestId('filter-duration-btn'));
    fireEvent.press(await findByTestId('duration-option-1year'));

    // Verify dynamic update for 1 year
    expect(await findByText('16.5 days')).toBeTruthy();
    expect(await findByText('Dec 2025-Nov 2026')).toBeTruthy();
    expect(await findByTestId('month-btn-dec')).toBeTruthy();
  });
});
