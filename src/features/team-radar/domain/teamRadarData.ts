import { OfficeCapacity, TeamMember, TomorrowPlan, WorkLocationType } from './types';

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Priya Sharma',
    role: 'Lead Product Designer',
    department: 'Design',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    locationType: 'office',
    locationDetails: 'Floor 3 • Desk 22',
    deskId: '3F-D22',
    status: 'active',
    checkInTime: '09:10 AM',
    workedHours: '3h 40m',
    collaborationStatus: 'Open for design reviews ☕',
    email: 'priya.sharma@samavya.internal',
  },
  {
    id: 'tm-2',
    name: 'Aarav Mehta',
    role: 'Principal Engineer',
    department: 'Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    locationType: 'office',
    locationDetails: 'Floor 3 • Desk 18',
    deskId: '3F-D18',
    status: 'active',
    checkInTime: '08:45 AM',
    workedHours: '4h 05m',
    collaborationStatus: 'Reviewing PRs • Ask anything',
    email: 'aarav.mehta@samavya.internal',
  },
  {
    id: 'tm-3',
    name: 'Sneha Patel',
    role: 'Senior Frontend Dev',
    department: 'Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    locationType: 'remote',
    locationDetails: 'Home • Koramangala',
    status: 'active',
    checkInTime: '09:30 AM',
    workedHours: '3h 20m',
    collaborationStatus: 'Deep focus on Design System 🎧',
    email: 'sneha.patel@samavya.internal',
  },
  {
    id: 'tm-4',
    name: 'Rohan Das',
    role: 'Cloud Architect',
    department: 'DevOps',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    locationType: 'remote',
    locationDetails: 'Home • Whitefield',
    status: 'break',
    checkInTime: '09:00 AM',
    workedHours: '3h 50m',
    collaborationStatus: 'Taking a 15m coffee break ☕',
    email: 'rohan.das@samavya.internal',
  },
  {
    id: 'tm-5',
    name: 'Vikram Singhania',
    role: 'Solutions Director',
    department: 'Client Success',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    locationType: 'client',
    locationDetails: 'Axis Bank Innovation Hub',
    status: 'active',
    checkInTime: '10:00 AM',
    workedHours: '2h 50m',
    collaborationStatus: 'Client workshop & sprint demo 📊',
    email: 'vikram.s@samavya.internal',
  },
  {
    id: 'tm-6',
    name: 'Ananya Reddy',
    role: 'QA Engineering Lead',
    department: 'Quality',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    locationType: 'office',
    locationDetails: 'Floor 2 • Mobile Lab',
    deskId: '2F-L04',
    status: 'active',
    checkInTime: '09:15 AM',
    workedHours: '3h 35m',
    collaborationStatus: 'Running release test suite 🧪',
    email: 'ananya.reddy@samavya.internal',
  },
  {
    id: 'tm-7',
    name: 'Devraj Kapoor',
    role: 'Product Manager',
    department: 'Product',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    locationType: 'office',
    locationDetails: 'Floor 3 • Desk 05',
    deskId: '3F-D05',
    status: 'break',
    checkInTime: '08:50 AM',
    workedHours: '4h 00m',
    collaborationStatus: 'Grab a tea anytime',
    email: 'devraj.k@samavya.internal',
  },
];

export const INITIAL_OFFICE_CAPACITY: OfficeCapacity = {
  occupiedDesks: 16,
  totalDesks: 24,
  floor: 'Floor 3 (Engineering & Product)',
  hotDesksAvailable: 8,
};

export function filterMembers(
  members: TeamMember[],
  filter: 'all' | WorkLocationType,
): TeamMember[] {
  if (filter === 'all') return members;
  return members.filter((m) => m.locationType === filter);
}

export function getLocationCounts(members: TeamMember[]): {
  all: number;
  office: number;
  remote: number;
  client: number;
} {
  return {
    all: members.length,
    office: members.filter((m) => m.locationType === 'office').length,
    remote: members.filter((m) => m.locationType === 'remote').length,
    client: members.filter((m) => m.locationType === 'client').length,
  };
}

export function simulatePingMember(member: TeamMember): string {
  return `Sent collaboration nudge to ${member.name.split(' ')[0]}! 👋`;
}

export function simulateDeskReservation(capacity: OfficeCapacity): OfficeCapacity {
  if (capacity.hotDesksAvailable <= 0) return capacity;
  return {
    ...capacity,
    occupiedDesks: capacity.occupiedDesks + 1,
    hotDesksAvailable: capacity.hotDesksAvailable - 1,
  };
}

export function getTomorrowHeadline(rsvp: TomorrowPlan, countAtHq = 5): string {
  if (rsvp === 'office') {
    return `You're joining ${countAtHq} teammates at HQ tomorrow! 🎉`;
  }
  if (rsvp === 'remote') {
    return `Working remotely tomorrow. ${countAtHq} teammates will be at HQ.`;
  }
  if (rsvp === 'client') {
    return `Scheduled at client site tomorrow.`;
  }
  return `Planning tomorrow? ${countAtHq} teammates will be at HQ.`;
}
