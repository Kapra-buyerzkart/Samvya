import {
  DayWorkHours,
  EmploymentHistoryItem,
  MonthlyWorkHoursSummary,
} from '../domain/types';

export const DEFAULT_EMPLOYMENT_HISTORY: EmploymentHistoryItem = {
  id: 'emp_hist_1',
  designation: 'HR Manager',
  status: 'Active',
  isPrimary: true,
  employeeCode: 'KAP0002',
  organisation: 'Test Organisation',
  office: 'Head office',
  department: 'HR',
  employmentType: 'Employee',
  workArrangement: 'On-site',
  effectivePeriod: '21 Oct 2026 · Open ended',
  confirmation: 'Confirmed · 21 Oct 2026',
  joinedDate: '21 Oct 2026',
  lastWorkingDay: 'Not recorded',
  relievedDate: 'Not recorded',
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

export function getMonthName(year: number, month: number): string {
  const name = MONTH_NAMES[month - 1] ?? 'November';
  return `${name} ${year}`;
}

export function getMonthlyWorkHoursData(
  year: number,
  month: number,
): MonthlyWorkHoursSummary {
  // If November 2026, return the exact dataset from the design
  if (year === 2026 && month === 11) {
    const dailyRecords: DayWorkHours[] = [
      {
        day: 1,
        dayOfWeek: 'Sun',
        hours: 6.8,
        formattedHours: '6h 50m',
        status: 'recorded',
        isWeekend: true,
      },
      {
        day: 2,
        dayOfWeek: 'Mon',
        hours: 6.0,
        formattedHours: '6h',
        status: 'recorded',
      },
      {
        day: 3,
        dayOfWeek: 'Tue',
        hours: 7.2,
        formattedHours: '7h 15m',
        status: 'recorded',
      },
      {
        day: 4,
        dayOfWeek: 'Wed',
        hours: 5.0,
        formattedHours: '5h',
        status: 'lesser',
      },
      {
        day: 5,
        dayOfWeek: 'Thur',
        hours: 8.0,
        formattedHours: '8h',
        status: 'recorded',
      },
      {
        day: 6,
        dayOfWeek: 'Fri',
        hours: 6.3,
        formattedHours: '6h 20m',
        status: 'recorded',
      },
      {
        day: 7,
        dayOfWeek: 'Sat',
        hours: 0,
        formattedHours: '0h',
        status: 'no_entry',
        isWeekend: true,
      },
      {
        day: 8,
        dayOfWeek: 'Sun',
        hours: 4.8,
        formattedHours: '4h 50m',
        status: 'lesser',
        isWeekend: true,
      },
      {
        day: 9,
        dayOfWeek: 'Mon',
        hours: 0,
        formattedHours: '0h',
        status: 'no_entry',
        isHoliday: true, // Red indicator from design
      },
      {
        day: 10,
        dayOfWeek: 'Tue',
        hours: 8.0,
        formattedHours: '8h',
        status: 'recorded',
      },
      {
        day: 11,
        dayOfWeek: 'Wed',
        hours: 6.8,
        formattedHours: '6h 50m',
        status: 'recorded',
      },
      {
        day: 12,
        dayOfWeek: 'Thur',
        hours: 6.8,
        formattedHours: '6h 50m',
        status: 'recorded',
      },
      {
        day: 13,
        dayOfWeek: 'Fri',
        hours: 0,
        formattedHours: '0h',
        status: 'no_entry',
        isToday: true, // Marked "Today" with vertical dashed guide
      },
      // Rest of November days 14-30
      ...Array.from({ length: 17 }, (_, i) => {
        const day = i + 14;
        const date = new Date(2026, 10, day);
        const dayOfWeek = DAY_NAMES[date.getDay()] ?? 'Mon';
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        return {
          day,
          dayOfWeek,
          hours: 0,
          formattedHours: '0h',
          status: 'no_entry' as const,
          isWeekend,
        };
      }),
    ];

    return {
      year: 2026,
      month: 11,
      monthName: 'November 2026',
      workingDays: 24,
      totalHoursFormatted: '77hrs 30m',
      daysRecorded: 10,
      dailyRecords,
    };
  }

  // Dynamic calculation for other calendar months
  const daysInMonth = new Date(year, month, 0).getDate();
  const dailyRecords: DayWorkHours[] = [];
  let workingDays = 0;
  let daysRecorded = 0;
  let totalMinutes = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = DAY_NAMES[date.getDay()] ?? 'Mon';
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    if (!isWeekend) {
      workingDays++;
    }

    // Generate realistic simulated work pattern
    if (!isWeekend && day <= Math.min(daysInMonth, 20)) {
      const isFull = (day * 3 + month) % 4 !== 0;
      const hours = isFull ? 8 : 5.5;
      const mins = hours * 60;
      totalMinutes += mins;
      daysRecorded++;

      dailyRecords.push({
        day,
        dayOfWeek,
        hours,
        formattedHours: isFull ? '8h' : '5h 30m',
        status: isFull ? 'recorded' : 'lesser',
      });
    } else {
      dailyRecords.push({
        day,
        dayOfWeek,
        hours: 0,
        formattedHours: '0h',
        status: 'no_entry',
        isWeekend,
      });
    }
  }

  const totalHrs = Math.floor(totalMinutes / 60);
  const remMins = totalMinutes % 60;
  const totalHoursFormatted = remMins > 0 ? `${totalHrs}hrs ${remMins}m` : `${totalHrs}hrs`;

  return {
    year,
    month,
    monthName: getMonthName(year, month),
    workingDays,
    totalHoursFormatted: totalMinutes > 0 ? totalHoursFormatted : '0hrs',
    daysRecorded,
    dailyRecords,
  };
}
