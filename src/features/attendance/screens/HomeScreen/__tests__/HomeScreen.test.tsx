import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';
import { Alert } from 'react-native';

jest.spyOn(Alert, 'alert');

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with timer display and action buttons', async () => {
    const { getByText, getByTestId } = await render(<HomeScreen />);

    expect(getByText('Samavya')).toBeTruthy();
    expect(getByText('Shift')).toBeTruthy();
    expect(getByText('09:00 AM - 06 : 00 PM')).toBeTruthy();
    expect(getByText('Worked today')).toBeTruthy();
    expect(getByText('of 8h')).toBeTruthy();
    expect(getByTestId('btn-punch-action')).toBeTruthy();
    expect(getByTestId('btn-break-toggle')).toBeTruthy();
  });

  it('handles punch action button tap properly', async () => {
    const { getByTestId } = await render(<HomeScreen />);
    const punchBtn = getByTestId('btn-punch-action');

    fireEvent.press(punchBtn);
    expect(Alert.alert).toHaveBeenCalled();
  });

  it('handles dropdown modal opening and closing', async () => {
    const { getByLabelText, getByText, queryByText } = await render(<HomeScreen />);

    const hoursDropdown = getByLabelText('Select Work Hours');
    fireEvent.press(hoursDropdown);

    await waitFor(() => {
      expect(getByText('Select Work Hours')).toBeTruthy();
    });

    const closeBtn = getByLabelText('Close');
    fireEvent.press(closeBtn);

    await waitFor(() => {
      expect(queryByText('Select Work Hours')).toBeNull();
    });
  });
});
