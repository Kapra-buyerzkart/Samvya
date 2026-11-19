import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { FaceVerifyCameraView } from '../FaceVerifyCameraView';

describe('FaceVerifyCameraView (New Capture & Review Design)', () => {
  it('renders live camera viewfinder, shutter button, torch toggle, and camera flip', async () => {
    const handlePunch = jest.fn();
    const handleCancel = jest.fn();

    const { getByText, getByTestId } = await render(
      <FaceVerifyCameraView
        actionText="Punch Out"
        isCameraActive={true}
        onPunch={handlePunch}
        onCancel={handleCancel}
      />,
    );

    expect(getByText('Face verification')).toBeTruthy();
    expect(getByTestId('toggle-torch-btn')).toBeTruthy();
    expect(getByTestId('shutter-capture-btn')).toBeTruthy();
    expect(getByTestId('flip-camera-btn')).toBeTruthy();
  });

  it('allows toggling camera position and torch', async () => {
    const { getByTestId, getByLabelText } = await render(
      <FaceVerifyCameraView actionText="Punch Out" isCameraActive={true} />,
    );

    const flipBtn = getByTestId('flip-camera-btn');
    fireEvent.press(flipBtn);

    await waitFor(() => {
      expect(getByLabelText('Switch to front camera')).toBeTruthy();
    });

    const torchBtn = getByTestId('toggle-torch-btn');
    fireEvent.press(torchBtn);

    await waitFor(() => {
      expect(getByLabelText('Flash On')).toBeTruthy();
    });
  });

  it('captures photo on shutter press, displays Retake & Upload, and allows retake', async () => {
    const handlePunch = jest.fn();

    const { getByTestId, getByText } = await render(
      <FaceVerifyCameraView
        actionText="Punch Out"
        isCameraActive={true}
        onPunch={handlePunch}
      />,
    );

    const shutterBtn = getByTestId('shutter-capture-btn');
    expect(shutterBtn).toBeTruthy();

    fireEvent.press(shutterBtn);

    await waitFor(() => {
      expect(getByText('Retake')).toBeTruthy();
      expect(getByText('Upload')).toBeTruthy();
    });

    fireEvent.press(getByText('Retake'));

    await waitFor(() => {
      expect(getByTestId('shutter-capture-btn')).toBeTruthy();
    });
  });

  it('triggers onPunch when Upload is pressed on the review screen', async () => {
    const handlePunch = jest.fn();

    const { getByTestId, getByText } = await render(
      <FaceVerifyCameraView
        actionText="Punch In"
        isCameraActive={true}
        onPunch={handlePunch}
      />,
    );

    fireEvent.press(getByTestId('shutter-capture-btn'));

    await waitFor(() => {
      expect(getByText('Upload')).toBeTruthy();
    });

    fireEvent.press(getByText('Upload'));

    await waitFor(() => {
      expect(handlePunch).toHaveBeenCalledTimes(1);
    });
  });

  it('renders loading state on upload button when isPunching is true in review mode', async () => {
    const handlePunch = jest.fn();

    const { getByTestId, getByLabelText } = await render(
      <FaceVerifyCameraView
        actionText="Punch In"
        isCameraActive={true}
        isPunching={true}
        onPunch={handlePunch}
      />,
    );

    fireEvent.press(getByTestId('shutter-capture-btn'));

    await waitFor(() => {
      expect(getByLabelText('Uploading...')).toBeTruthy();
    });
  });
});
