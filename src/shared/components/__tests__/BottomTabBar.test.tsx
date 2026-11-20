import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { router, usePathname } from 'expo-router';
import { BottomTabBar } from '../BottomTabBar';

const mockUsePathname = usePathname as jest.Mock;

describe('BottomTabBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/(app)');
  });

  it('renders all four tabs with correct labels', async () => {
    const { getByText, getByTestId } = await render(<BottomTabBar />);

    expect(getByTestId('bottom-tab-bar')).toBeTruthy();

    expect(getByText('Home')).toBeTruthy();
    expect(getByText('History')).toBeTruthy();
    expect(getByText('Leave')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();

    expect(getByTestId('tab-btn-home')).toBeTruthy();
    expect(getByTestId('tab-btn-history')).toBeTruthy();
    expect(getByTestId('tab-btn-leave')).toBeTruthy();
    expect(getByTestId('tab-btn-profile')).toBeTruthy();
  });

  it('highlights Home as active when on home route', async () => {
    mockUsePathname.mockReturnValue('/(app)');
    const { getByTestId } = await render(<BottomTabBar />);

    const homeTab = getByTestId('tab-btn-home');
    expect(homeTab.props.accessibilityState).toEqual({ selected: true });

    const leaveTab = getByTestId('tab-btn-leave');
    expect(leaveTab.props.accessibilityState).toEqual({ selected: false });
  });

  it('highlights History as active when on attendance history route', async () => {
    mockUsePathname.mockReturnValue('/(app)/attendance/history');
    const { getByTestId } = await render(<BottomTabBar />);

    const historyTab = getByTestId('tab-btn-history');
    expect(historyTab.props.accessibilityState).toEqual({ selected: true });
  });

  it('highlights Leave as active when on leave request or status route', async () => {
    mockUsePathname.mockReturnValue('/(app)/leave/request');
    const { getByTestId } = await render(<BottomTabBar />);

    const leaveTab = getByTestId('tab-btn-leave');
    expect(leaveTab.props.accessibilityState).toEqual({ selected: true });
  });

  it('highlights Profile as active when on profile route', async () => {
    mockUsePathname.mockReturnValue('/(app)/profile');
    const { getByTestId } = await render(<BottomTabBar />);

    const profileTab = getByTestId('tab-btn-profile');
    expect(profileTab.props.accessibilityState).toEqual({ selected: true });
  });

  it('navigates to History when pressing History tab', async () => {
    mockUsePathname.mockReturnValue('/(app)');
    const { getByTestId } = await render(<BottomTabBar />);

    fireEvent.press(getByTestId('tab-btn-history'));
    expect(router.push).toHaveBeenCalledWith('/(app)/attendance/history');
  });

  it('navigates to Leave when pressing Leave tab', async () => {
    mockUsePathname.mockReturnValue('/(app)');
    const { getByTestId } = await render(<BottomTabBar />);

    fireEvent.press(getByTestId('tab-btn-leave'));
    expect(router.push).toHaveBeenCalledWith('/(app)/leave/request');
  });

  it('navigates to Profile when pressing Profile tab', async () => {
    mockUsePathname.mockReturnValue('/(app)');
    const { getByTestId } = await render(<BottomTabBar />);

    fireEvent.press(getByTestId('tab-btn-profile'));
    expect(router.push).toHaveBeenCalledWith('/(app)/profile');
  });

  it('navigates to Home when pressing Home tab from another screen', async () => {
    mockUsePathname.mockReturnValue('/(app)/leave/request');
    const { getByTestId } = await render(<BottomTabBar />);

    fireEvent.press(getByTestId('tab-btn-home'));
    expect(router.replace).toHaveBeenCalledWith('/(app)');
  });

  it('does not re-navigate if pressing already active tab', async () => {
    mockUsePathname.mockReturnValue('/(app)');
    const { getByTestId } = await render(<BottomTabBar />);

    fireEvent.press(getByTestId('tab-btn-home'));
    expect(router.replace).not.toHaveBeenCalled();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('hides tab bar on camera face verification and punch success screens', async () => {
    mockUsePathname.mockReturnValue('/(app)/attendance/face-verify');
    const { queryByTestId, rerender } = await render(<BottomTabBar />);

    expect(queryByTestId('bottom-tab-bar')).toBeNull();

    mockUsePathname.mockReturnValue('/(app)/attendance/punch-success');
    await rerender(<BottomTabBar />);

    expect(queryByTestId('bottom-tab-bar')).toBeNull();
  });
});
