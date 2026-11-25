import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TeamRadarCard } from '../TeamRadarCard';

describe('TeamRadarCard', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders radar card header, live count badge, and capacity meter', async () => {
    const { getByText, getByTestId } = await render(<TeamRadarCard />);

    expect(getByTestId('team-radar-card')).toBeTruthy();
    expect(getByText('Team Presence Radar')).toBeTruthy();
    expect(getByText('Engineering & Product Team')).toBeTruthy();

    // Live count badge
    expect(getByText('4 at HQ')).toBeTruthy();

    // Capacity box
    expect(getByText('Floor 3 (Engineering & Product)')).toBeTruthy();
    expect(getByText('16/24 Desks (67%)')).toBeTruthy();
    expect(getByText('8 Hot Desks available')).toBeTruthy();
    expect(getByText('Book Desk')).toBeTruthy();
  });

  it('filters member list when switching filter tabs', async () => {
    const { getByTestId, getByText, queryByText } = await render(<TeamRadarCard />);

    // Initially "All" is active, Priya (office), Sneha (remote), Vikram (client) are present
    expect(getByText('Priya Sharma')).toBeTruthy();
    expect(getByText('Sneha Patel')).toBeTruthy();
    expect(getByText('Vikram Singhania')).toBeTruthy();

    // Switch to "In Office"
    fireEvent.press(getByTestId('filter-tab-office'));
    await waitFor(() => {
      expect(getByText('Priya Sharma')).toBeTruthy();
      expect(queryByText('Sneha Patel')).toBeNull();
      expect(queryByText('Vikram Singhania')).toBeNull();
    });

    // Switch to "Remote"
    fireEvent.press(getByTestId('filter-tab-remote'));
    await waitFor(() => {
      expect(queryByText('Priya Sharma')).toBeNull();
      expect(getByText('Sneha Patel')).toBeTruthy();
      expect(queryByText('Vikram Singhania')).toBeNull();
    });

    // Switch to "Client"
    fireEvent.press(getByTestId('filter-tab-client'));
    await waitFor(() => {
      expect(queryByText('Priya Sharma')).toBeNull();
      expect(queryByText('Sneha Patel')).toBeNull();
      expect(getByText('Vikram Singhania')).toBeTruthy();
    });

    // Switch back to "All"
    fireEvent.press(getByTestId('filter-tab-all'));
    await waitFor(() => {
      expect(getByText('Priya Sharma')).toBeTruthy();
      expect(getByText('Sneha Patel')).toBeTruthy();
      expect(getByText('Vikram Singhania')).toBeTruthy();
    });
  });

  it('allows booking a hot desk and updates capacity meter', async () => {
    const { getByTestId, getByText } = await render(<TeamRadarCard />);

    const bookDeskBtn = getByTestId('book-desk-btn');
    expect(getByText('Book Desk')).toBeTruthy();
    expect(getByText('16/24 Desks (67%)')).toBeTruthy();

    // Click book desk
    fireEvent.press(bookDeskBtn);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Hot Desk Confirmed! 🎯',
      expect.stringContaining('Reserved Desk 3F-HotDesk-09 on Floor 3'),
    );

    await waitFor(() => {
      expect(getByText('Desk Reserved')).toBeTruthy();
      expect(getByText('17/24 Desks (71%)')).toBeTruthy();
      expect(getByText('7 Hot Desks available')).toBeTruthy();
    });

    // Attempting to book again triggers already reserved notice
    fireEvent.press(bookDeskBtn);
    expect(Alert.alert).toHaveBeenCalledWith(
      'Desk Already Reserved',
      expect.stringContaining('already booked desk'),
    );
  });

  it('fires onPingPress and shows alert when tapping Ping button on teammate', async () => {
    const onPingPress = jest.fn();
    const { getByTestId } = await render(<TeamRadarCard onPingPress={onPingPress} />);

    // Ping Aarav Mehta (tm-2)
    const pingBtn = getByTestId('ping-btn-tm-2');
    fireEvent.press(pingBtn);

    expect(onPingPress).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'tm-2', name: 'Aarav Mehta' }),
    );
    expect(Alert.alert).toHaveBeenCalledWith(
      'Collaboration Ping Sent',
      'Sent collaboration nudge to Aarav! 👋',
    );
  });

  it('opens teammate detail sheet and supports quick actions inside sheet', async () => {
    const onMemberPress = jest.fn();
    const { getByTestId, getByText, getAllByText, queryByTestId } = await render(
      <TeamRadarCard onMemberPress={onMemberPress} />,
    );

    // Tap Priya Sharma card
    const priyaCard = getByTestId('member-card-tm-1');
    fireEvent.press(priyaCard);

    expect(onMemberPress).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'tm-1', name: 'Priya Sharma' }),
    );

    // Sheet should be mounted and visible
    await waitFor(() => {
      expect(getByTestId('member-detail-sheet')).toBeTruthy();
    });
    expect(getByText('Teammate Presence')).toBeTruthy();
    expect(getAllByText('Floor 3 • Desk 22').length).toBeGreaterThanOrEqual(2);
    expect(getByText('3F-D22 (Confirmed Attendance)')).toBeTruthy();

    // Test ping from sheet
    const sheetPingBtn = getByTestId('sheet-ping-action');
    fireEvent.press(sheetPingBtn);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Collaboration Ping Sent',
      'Sent collaboration nudge to Priya! 👋',
    );
    // Sheet closes
    await waitFor(() => {
      expect(queryByTestId('member-detail-sheet')).toBeNull();
    });

    // Open sheet again for coffee sync action
    fireEvent.press(getByTestId('member-card-tm-1'));
    await waitFor(() => {
      expect(getByTestId('member-detail-sheet')).toBeTruthy();
    });

    const sheetCoffeeBtn = getByTestId('sheet-coffee-action');
    fireEvent.press(sheetCoffeeBtn);

    expect(Alert.alert).toHaveBeenCalledWith(
      '1:1 Coffee Sync',
      expect.stringContaining('Priya Sharma'),
    );
    await waitFor(() => {
      expect(queryByTestId('member-detail-sheet')).toBeNull();
    });
  });

  it('updates tomorrow hybrid sync RSVP plan', async () => {
    const { getByTestId, getByText } = await render(<TeamRadarCard />);

    expect(getByText('Tomorrow\'s Hybrid Sync')).toBeTruthy();
    expect(getByText('Planning tomorrow? 5 teammates will be at HQ.')).toBeTruthy();

    // Select At HQ
    fireEvent.press(getByTestId('rsvp-office-btn'));
    await waitFor(() => {
      expect(getByText("You're joining 5 teammates at HQ tomorrow! 🎉")).toBeTruthy();
    });

    // Toggle off
    fireEvent.press(getByTestId('rsvp-office-btn'));
    await waitFor(() => {
      expect(getByText('Planning tomorrow? 5 teammates will be at HQ.')).toBeTruthy();
    });

    // Select Remote
    fireEvent.press(getByTestId('rsvp-remote-btn'));
    await waitFor(() => {
      expect(getByText('Working remotely tomorrow. 5 teammates will be at HQ.')).toBeTruthy();
    });

    // Select Client
    fireEvent.press(getByTestId('rsvp-client-btn'));
    await waitFor(() => {
      expect(getByText('Scheduled at client site tomorrow.')).toBeTruthy();
    });
  });
});
