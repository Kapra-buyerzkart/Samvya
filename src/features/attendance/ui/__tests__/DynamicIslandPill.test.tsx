import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { DynamicIslandPill } from '../DynamicIslandPill';
import { router, usePathname } from 'expo-router';
import { usePersistentShiftTimer } from '../../hooks/usePersistentShiftTimer';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
  usePathname: jest.fn(() => '/(app)'),
}));

jest.mock('../../hooks/usePersistentShiftTimer');

const mockUsePersistentShiftTimer = usePersistentShiftTimer as jest.Mock;
const mockUsePathname = usePathname as jest.Mock;

describe('DynamicIslandPill', () => {
  const mockStartBreak = jest.fn();
  const mockResumeWork = jest.fn();
  const mockPunchOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/(app)');
    mockUsePersistentShiftTimer.mockReturnValue({
      shiftState: {
        status: 'punched_in',
        workLocation: 'Work from home',
        hoursType: 'Regular',
      },
      status: 'punched_in',
      isWorking: true,
      isOnBreak: false,
      isPunchedOut: false,
      workLocation: 'Work from home',
      hoursType: 'Regular',
      workedDisplay: '2h 15m 30s',
      workedHours: 2,
      workedMinutes: 15,
      remainingDisplay: '5h 45m',
      breakDisplay: '20m',
      progressFraction: 0.35,
      startBreak: mockStartBreak,
      resumeWork: mockResumeWork,
      punchOut: mockPunchOut,
    });
  });

  it('renders collapsed pill when on-duty', async () => {
    const { getByTestId, getByText } = await render(<DynamicIslandPill />);

    expect(getByTestId('dynamic-island-container')).toBeTruthy();
    expect(getByTestId('dynamic-island-pill')).toBeTruthy();
    expect(getByText('On Duty')).toBeTruthy();
    expect(getByText('2h 15m')).toBeTruthy();
    expect(getByText('35%')).toBeTruthy();
  });

  it('expands into full live activity card on tap', async () => {
    const { getByTestId, getByText } = await render(<DynamicIslandPill />);

    fireEvent.press(getByTestId('dynamic-island-pill'));

    await waitFor(() => {
      expect(getByTestId('dynamic-island-expanded')).toBeTruthy();
      expect(getByText('Active Shift')).toBeTruthy();
      expect(getByText('• Work from home')).toBeTruthy();
      expect(getByText('Time Logged')).toBeTruthy();
      expect(getByText('2h 15m 30s')).toBeTruthy();
      expect(getByText('5h 45m')).toBeTruthy();
      expect(getByText('Take Break')).toBeTruthy();
      expect(getByText('Punch Out')).toBeTruthy();
    });
  });

  it('triggers startBreak when Take Break button is pressed in expanded view', async () => {
    const { getByTestId, getByText } = await render(<DynamicIslandPill />);

    fireEvent.press(getByTestId('dynamic-island-pill'));

    await waitFor(() => {
      expect(getByText('Take Break')).toBeTruthy();
    });

    fireEvent.press(getByTestId('dynamic-island-break-toggle'));
    expect(mockStartBreak).toHaveBeenCalledTimes(1);
  });

  it('renders break state and triggers resumeWork when in break mode', async () => {
    mockUsePersistentShiftTimer.mockReturnValue({
      shiftState: {
        status: 'on_break',
        workLocation: 'Headquarters',
        hoursType: 'Regular',
      },
      status: 'on_break',
      isWorking: false,
      isOnBreak: true,
      isPunchedOut: false,
      workLocation: 'Headquarters',
      hoursType: 'Regular',
      workedDisplay: '3h 10m 00s',
      workedHours: 3,
      workedMinutes: 10,
      remainingDisplay: '4h 50m',
      breakDisplay: '15m',
      progressFraction: 0.4,
      startBreak: mockStartBreak,
      resumeWork: mockResumeWork,
      punchOut: mockPunchOut,
    });

    const { getByTestId, getByText } = await render(<DynamicIslandPill />);

    expect(getByText('Break')).toBeTruthy();
    expect(getByText('15m')).toBeTruthy();

    fireEvent.press(getByTestId('dynamic-island-pill'));

    await waitFor(() => {
      expect(getByText('Break in Progress')).toBeTruthy();
      expect(getByText('Resume Work')).toBeTruthy();
    });

    fireEvent.press(getByTestId('dynamic-island-break-toggle'));
    expect(mockResumeWork).toHaveBeenCalledTimes(1);
  });

  it('navigates to face verification screen when Punch Out is tapped', async () => {
    const { getByTestId } = await render(<DynamicIslandPill />);

    fireEvent.press(getByTestId('dynamic-island-pill'));

    await waitFor(() => {
      expect(getByTestId('dynamic-island-punch-out')).toBeTruthy();
    });

    fireEvent.press(getByTestId('dynamic-island-punch-out'));

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/(app)/attendance/face-verify',
      params: { action: 'punch-out' },
    });
  });

  it('hides when punched out unless forceVisible is set', async () => {
    mockUsePersistentShiftTimer.mockReturnValue({
      shiftState: {
        status: 'punched_out',
        workLocation: 'Work from home',
        hoursType: 'Regular',
      },
      status: 'punched_out',
      isWorking: false,
      isOnBreak: false,
      isPunchedOut: true,
      workedDisplay: '0h 00m 00s',
      workedHours: 0,
      workedMinutes: 0,
      remainingDisplay: '8h 00m',
      breakDisplay: '0m',
      progressFraction: 0,
      startBreak: mockStartBreak,
      resumeWork: mockResumeWork,
      punchOut: mockPunchOut,
    });

    const { queryByTestId } = await render(<DynamicIslandPill />);
    expect(queryByTestId('dynamic-island-container')).toBeNull();

    const forced = await render(<DynamicIslandPill forceVisible />);
    expect(forced.queryByTestId('dynamic-island-container')).toBeTruthy();
  });

  it('hides when on face-verification screen to not obstruct camera', async () => {
    mockUsePathname.mockReturnValue('/(app)/attendance/face-verify');

    const { queryByTestId } = await render(<DynamicIslandPill />);
    expect(queryByTestId('dynamic-island-container')).toBeNull();
  });
});
