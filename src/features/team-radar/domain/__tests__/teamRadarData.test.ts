import {
  INITIAL_OFFICE_CAPACITY,
  INITIAL_TEAM_MEMBERS,
  filterMembers,
  getLocationCounts,
  getTomorrowHeadline,
  simulateDeskReservation,
  simulatePingMember,
} from '../teamRadarData';
import { TeamMember } from '../types';

describe('teamRadarData domain helpers', () => {
  it('returns initial team members with expected shape', () => {
    expect(INITIAL_TEAM_MEMBERS.length).toBeGreaterThan(0);
    const first = INITIAL_TEAM_MEMBERS[0]!;
    expect(first.id).toBeDefined();
    expect(first.name).toBeDefined();
    expect(first.locationType).toMatch(/^(office|remote|client)$/);
  });

  describe('filterMembers', () => {
    it('returns all members when filter is "all"', () => {
      const result = filterMembers(INITIAL_TEAM_MEMBERS, 'all');
      expect(result).toHaveLength(INITIAL_TEAM_MEMBERS.length);
    });

    it('filters only office members', () => {
      const result = filterMembers(INITIAL_TEAM_MEMBERS, 'office');
      expect(result.every((m) => m.locationType === 'office')).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('filters only remote members', () => {
      const result = filterMembers(INITIAL_TEAM_MEMBERS, 'remote');
      expect(result.every((m) => m.locationType === 'remote')).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('filters only client members', () => {
      const result = filterMembers(INITIAL_TEAM_MEMBERS, 'client');
      expect(result.every((m) => m.locationType === 'client')).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getLocationCounts', () => {
    it('calculates exact counts for each location type', () => {
      const counts = getLocationCounts(INITIAL_TEAM_MEMBERS);
      expect(counts.all).toBe(INITIAL_TEAM_MEMBERS.length);
      expect(counts.office + counts.remote + counts.client).toBe(counts.all);
    });
  });

  describe('simulatePingMember', () => {
    it('formats a friendly nudge with first name', () => {
      const member: TeamMember = {
        id: 'test-1',
        name: 'Arjun Das',
        role: 'Dev',
        department: 'Eng',
        avatarUrl: 'https://example.com/avatar.jpg',
        locationType: 'office',
        locationDetails: 'Floor 3',
        status: 'active',
        checkInTime: '09:00 AM',
        workedHours: '2h 10m',
        collaborationStatus: 'Available',
        email: 'arjun@example.com',
      };
      const message = simulatePingMember(member);
      expect(message).toBe('Sent collaboration nudge to Arjun! 👋');
    });
  });

  describe('simulateDeskReservation', () => {
    it('increments occupied desks and decrements available hot desks', () => {
      const initial = { ...INITIAL_OFFICE_CAPACITY };
      const updated = simulateDeskReservation(initial);
      expect(updated.occupiedDesks).toBe(initial.occupiedDesks + 1);
      expect(updated.hotDesksAvailable).toBe(initial.hotDesksAvailable - 1);
    });

    it('does not change capacity if no hot desks available', () => {
      const full = { ...INITIAL_OFFICE_CAPACITY, hotDesksAvailable: 0 };
      const updated = simulateDeskReservation(full);
      expect(updated.occupiedDesks).toBe(full.occupiedDesks);
      expect(updated.hotDesksAvailable).toBe(0);
    });
  });

  describe('getTomorrowHeadline', () => {
    it('returns default prompt when plan is null', () => {
      expect(getTomorrowHeadline(null, 5)).toBe('Planning tomorrow? 5 teammates will be at HQ.');
    });

    it('returns office RSVP confirmation', () => {
      expect(getTomorrowHeadline('office', 6)).toBe("You're joining 6 teammates at HQ tomorrow! 🎉");
    });

    it('returns remote RSVP confirmation', () => {
      expect(getTomorrowHeadline('remote', 6)).toBe('Working remotely tomorrow. 6 teammates will be at HQ.');
    });

    it('returns client RSVP confirmation', () => {
      expect(getTomorrowHeadline('client', 6)).toBe('Scheduled at client site tomorrow.');
    });
  });
});
