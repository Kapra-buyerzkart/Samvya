export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  employeeCode: string;
  department: string;
  dpdpConsentGiven: boolean;
}

