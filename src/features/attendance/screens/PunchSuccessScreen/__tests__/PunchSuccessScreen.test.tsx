import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { PunchSuccessScreen } from '../PunchSuccessScreen';

describe('PunchSuccessScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders all elements correctly for punch out according to reference design', async () => {
    const fixedTime = new Date('2026-11-19T09:02:00').getTime();
    const { getByText, getByTestId } = await render(
      <PunchSuccessScreen type="punch-out" timestamp={fixedTime} />,
    );

    // Header
    expect(getByText('Punch Verification')).toBeTruthy();
    expect(getByTestId('punch-success-back-btn')).toBeTruthy();

    // Concentric graphic & status badge
    expect(getByTestId('success-check-graphic')).toBeTruthy();
    expect(getByText('RECORDED ON TIME')).toBeTruthy();

    // Heading & Subtitle
    expect(getByText('Punch-out Successful.')).toBeTruthy();
    expect(getByText('Have a productive and focused workday ahead.')).toBeTruthy();

    // Time Logged Card
    expect(getByText('TIME LOGGED')).toBeTruthy();
    expect(getByTestId('punch-time-digits')).toHaveTextContent('09:02');
    expect(getByText('AM')).toBeTruthy();

    // Meta: Date & Shift
    expect(getByText('DATE')).toBeTruthy();
    expect(getByTestId('punch-date-val')).toHaveTextContent('Thu, 19 Nov 2026');
    expect(getByText('SHIFT')).toBeTruthy();
    expect(getByTestId('punch-shift-val')).toHaveTextContent('09:00 – 18:00');

    // Home button & countdown
    expect(getByTestId('go-to-home-btn')).toBeTruthy();
    expect(getByText('Go to home page')).toBeTruthy();
    expect(getByText(/Auto-returning in/)).toBeTruthy();
  });

  it('renders correctly for punch in', async () => {
    const { getByText } = await render(
      <PunchSuccessScreen type="punch-in" />,
    );

    expect(getByText('Punch-in Successful.')).toBeTruthy();
  });

  it('calls onDismiss when clicking Go to home page button', async () => {
    const onDismissMock = jest.fn();
    const { getByTestId } = await render(
      <PunchSuccessScreen type="punch-out" onDismiss={onDismissMock} />,
    );

    fireEvent.press(getByTestId('go-to-home-btn'));
    expect(onDismissMock).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when clicking the header back button', async () => {
    const onDismissMock = jest.fn();
    const { getByTestId } = await render(
      <PunchSuccessScreen type="punch-out" onDismiss={onDismissMock} />,
    );

    fireEvent.press(getByTestId('punch-success-back-btn'));
    expect(onDismissMock).toHaveBeenCalledTimes(1);
  });

  it('navigates automatically when 5-second countdown finishes', async () => {
    const onDismissMock = jest.fn();
    await render(<PunchSuccessScreen type="punch-out" onDismiss={onDismissMock} />);

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(onDismissMock).toHaveBeenCalledTimes(1);
  });
});
