export type WorkLocationType = 'office' | 'remote' | 'client';

export type AttendanceStatus = 'active' | 'break' | 'offline';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  avatarUrl: string;
  locationType: WorkLocationType;
  locationDetails: string; // e.g. "Floor 3 • Desk 14" or "Remote • Koramangala"
  status: AttendanceStatus;
  checkInTime: string;
  workedHours: string;
  collaborationStatus: string; // e.g. "Open for coffee ☕" or "In deep work 🎧"
  deskId?: string;
  email: string;
}

export interface OfficeCapacity {
  occupiedDesks: number;
  totalDesks: number;
  floor: string;
  hotDesksAvailable: number;
}

export type TomorrowPlan = 'office' | 'remote' | 'client' | null;
