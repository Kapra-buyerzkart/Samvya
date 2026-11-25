import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EmploymentDetailsScreen } from '../EmploymentDetailsScreen';

describe('EmploymentDetailsScreen', () => {
  it('renders the navigation title and both cards correctly', async () => {
    const { getByText } = await render(<EmploymentDetailsScreen />);

    // Header title
    expect(getByText('Employment details')).toBeTruthy();

    // Card 1: Monthly work hours
    expect(getByText('Monthly work hours')).toBeTruthy();
    expect(getByText('November 2026')).toBeTruthy();
    expect(getByText('24 working days')).toBeTruthy();
    expect(getByText('Total hours')).toBeTruthy();
    expect(getByText('77hrs 30m')).toBeTruthy();
    expect(getByText('10 days recorded')).toBeTruthy();

    // Card 2: Employment history
    expect(getByText('Employment history')).toBeTruthy();
    expect(getByText('HR Manager')).toBeTruthy();
    expect(getByText('Active')).toBeTruthy();
    expect(getByText('Primary')).toBeTruthy();
    expect(getByText('KAP0002')).toBeTruthy();
    expect(getByText('EMPLOYMENT TYPE')).toBeTruthy();
    expect(getByText('Employee')).toBeTruthy();
    expect(getByText('WORK ARRANGEMENT')).toBeTruthy();
    expect(getByText('On-site')).toBeTruthy();
    expect(getByText('EFFECTIVE PERIOD')).toBeTruthy();
    expect(getByText('21 Oct 2026 · Open ended')).toBeTruthy();
    expect(getByText('CONFIRMATION')).toBeTruthy();
    expect(getByText('Confirmed · 21 Oct 2026')).toBeTruthy();
    expect(getByText('Joined 21 Oct 2026')).toBeTruthy();
    expect(getByText('Last working day: Not recorded')).toBeTruthy();
    expect(getByText('Relieved: Not recorded')).toBeTruthy();
  });

  it('cycles months when clicking previous and next month buttons', async () => {
    const { getByText, findByText, getByLabelText } = await render(
      <EmploymentDetailsScreen />,
    );

    expect(getByText('November 2026')).toBeTruthy();

    // Click previous month
    const prevBtn = getByLabelText('Previous month');
    fireEvent.press(prevBtn);
    expect(await findByText('October 2026')).toBeTruthy();

    // Click next month
    const nextBtn = getByLabelText('Next month');
    fireEvent.press(nextBtn);
    expect(await findByText('November 2026')).toBeTruthy();
  });

  it('allows tapping day bars to update the selected day tooltip', async () => {
    const { getByText, findByText, getByLabelText } = await render(
      <EmploymentDetailsScreen />,
    );

    // Default Day 5 is selected with "Thur. 8h"
    expect(getByText('Thur. 8h')).toBeTruthy();

    // Press Day 2
    const day2Btn = getByLabelText('Day 2, Mon, 6 hours');
    fireEvent.press(day2Btn);
    expect(await findByText('Mon. 6h')).toBeTruthy();
  });
});
