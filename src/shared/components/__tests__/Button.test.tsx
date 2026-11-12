import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders title and responds to press events', async () => {
    const handlePress = jest.fn();
    const { getByText } = await render(
      <Button title="Check In" onPress={handlePress} />,
    );

    const buttonElement = getByText('Check In');
    expect(buttonElement).toBeTruthy();

    fireEvent.press(buttonElement);
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('renders in disabled state without firing press', async () => {
    const handlePress = jest.fn();
    const { getByText } = await render(
      <Button title="Check In" onPress={handlePress} disabled />,
    );

    fireEvent.press(getByText('Check In'));
    expect(handlePress).not.toHaveBeenCalled();
  });
});
