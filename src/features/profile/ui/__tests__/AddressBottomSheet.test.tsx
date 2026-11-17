import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AddressBottomSheet } from '../AddressBottomSheet';
import { useAuthStore } from '@/features/auth/model/authStore';

describe('AddressBottomSheet', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: {
        id: 'usr_test',
        name: 'Peter S',
        email: 'peter@test.com',
        employeeCode: 'EMP-001',
        department: 'Engineering',
        dpdpConsentGiven: true,
        address: '',
      },
    });
  });

  it('renders all form fields from the design when open', async () => {
    const handleClose = jest.fn();
    const { getByText, getByPlaceholderText, getByTestId } = await render(
      <AddressBottomSheet isOpen={true} onClose={handleClose} />,
    );

    // Header
    expect(getByText('Add address')).toBeTruthy();
    expect(getByText('Enter your address details')).toBeTruthy();

    // Field labels & placeholders
    expect(getByText('Address line 1*')).toBeTruthy();
    expect(
      getByPlaceholderText('House / flat number, building, street'),
    ).toBeTruthy();

    expect(getByText('Address line 2 (optional)')).toBeTruthy();
    expect(getByPlaceholderText('Area, landmark')).toBeTruthy();

    expect(getByText('City*')).toBeTruthy();
    expect(getByPlaceholderText('Enter city')).toBeTruthy();

    expect(getByText('State*')).toBeTruthy();
    expect(getByText('Select state')).toBeTruthy();
    expect(getByTestId('state-selector')).toBeTruthy();

    expect(getByText('Country*')).toBeTruthy();
    expect(getByText('Select country')).toBeTruthy();
    expect(getByTestId('country-selector')).toBeTruthy();

    expect(getByText('Postal code*')).toBeTruthy();
    expect(getByPlaceholderText('Enter postal code')).toBeTruthy();

    // Notice & Buttons
    expect(getByText('Required fields are marked with *.')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Save address')).toBeTruthy();
  });

  it('calls onClose when Cancel is pressed', async () => {
    const handleClose = jest.fn();
    const { getByText } = await render(
      <AddressBottomSheet isOpen={true} onClose={handleClose} />,
    );

    await fireEvent.press(getByText('Cancel'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('saves address when all required fields are filled', async () => {
    const handleClose = jest.fn();
    const handleSaved = jest.fn();

    const { getByText, getByPlaceholderText, getByTestId } = await render(
      <AddressBottomSheet
        isOpen={true}
        onClose={handleClose}
        onSaved={handleSaved}
      />,
    );

    // Fill in inputs
    await fireEvent.changeText(
      getByPlaceholderText('House / flat number, building, street'),
      '42 Galaxy Heights',
    );
    await fireEvent.changeText(
      getByPlaceholderText('Area, landmark'),
      'Koramangala 4th Block',
    );
    await fireEvent.changeText(getByPlaceholderText('Enter city'), 'Bengaluru');

    // Select State
    await fireEvent.press(getByTestId('state-selector'));
    await fireEvent.press(getByTestId('state-item-Karnataka'));

    // Select Country
    await fireEvent.press(getByTestId('country-selector'));
    await fireEvent.press(getByTestId('country-item-India'));

    // Enter Postal Code
    await fireEvent.changeText(
      getByPlaceholderText('Enter postal code'),
      '560034',
    );

    // Save
    await fireEvent.press(getByText('Save address'));

    expect(handleSaved).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);

    const currentUser = useAuthStore.getState().user;
    expect(currentUser?.address).toContain('42 Galaxy Heights');
    expect(currentUser?.address).toContain('Bengaluru');
    expect(currentUser?.addressLine1).toBe('42 Galaxy Heights');
    expect(currentUser?.city).toBe('Bengaluru');
    expect(currentUser?.state).toBe('Karnataka');
    expect(currentUser?.country).toBe('India');
    expect(currentUser?.postalCode).toBe('560034');
  });
});
