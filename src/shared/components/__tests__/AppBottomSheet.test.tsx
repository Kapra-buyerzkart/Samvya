import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AppBottomSheet } from '../AppBottomSheet';

describe('AppBottomSheet', () => {
  it('renders content when open', async () => {
    const handleClose = jest.fn();
    const { getByText, getByTestId } = await render(
      <AppBottomSheet
        isOpen={true}
        onClose={handleClose}
        title="Sheet Title"
        testID="test-sheet"
      >
        <Text>Sheet Content Inside</Text>
      </AppBottomSheet>,
    );

    expect(getByText('Sheet Title')).toBeTruthy();
    expect(getByText('Sheet Content Inside')).toBeTruthy();
    expect(getByTestId('test-sheet')).toBeTruthy();
  });

  it('calls onClose when close button is pressed', async () => {
    const handleClose = jest.fn();
    const { getByLabelText } = await render(
      <AppBottomSheet
        isOpen={true}
        onClose={handleClose}
        title="Closable Sheet"
      >
        <Text>Content</Text>
      </AppBottomSheet>,
    );

    const closeBtn = getByLabelText('Close');
    fireEvent.press(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not render content when closed (lazy unmount in mock)', async () => {
    const handleClose = jest.fn();
    const { queryByText } = await render(
      <AppBottomSheet
        isOpen={false}
        onClose={handleClose}
        title="Closed Sheet"
      >
        <Text>Hidden Content</Text>
      </AppBottomSheet>,
    );

    expect(queryByText('Hidden Content')).toBeNull();
  });
});

