export type AttendanceBarStatus = 'recorded' | 'lesser' | 'no_entry';

export interface DayWorkHours {
  day: number;
  dayOfWeek: string;
  hours: number;
  formattedHours: string;
  status: AttendanceBarStatus;
  isToday?: boolean;
  isHoliday?: boolean;
  isWeekend?: boolean;
}

export interface MonthlyWorkHoursSummary {
  year: number;
  month: number; // 1-12
  monthName: string;
  workingDays: number;
  totalHoursFormatted: string;
  daysRecorded: number;
  dailyRecords: DayWorkHours[];
}

export interface EmploymentHistoryItem {
  id: string;
  designation: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  isPrimary: boolean;
  employeeCode: string;
  organisation: string;
  office: string;
  department: string;
  employmentType: string;
  workArrangement: string;
  effectivePeriod: string;
  confirmation: string;
  joinedDate: string;
  lastWorkingDay: string;
  relievedDate: string;
}
