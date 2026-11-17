import {
  DEFAULT_EMPLOYMENT_HISTORY,
  getMonthName,
  getMonthlyWorkHoursData,
} from '../data/employmentDataService';

describe('employmentDataService', () => {
  describe('November 2026 design specifications', () => {
    it('returns exact metrics matching the design for November 2026', () => {
      const data = getMonthlyWorkHoursData(2026, 11);

      expect(data.year).toBe(2026);
      expect(data.month).toBe(11);
      expect(data.monthName).toBe('November 2026');
      expect(data.workingDays).toBe(24);
      expect(data.totalHoursFormatted).toBe('77hrs 30m');
      expect(data.daysRecorded).toBe(10);
      expect(data.dailyRecords).toHaveLength(30);
    });

    it('contains correct record details for Day 5, Day 9, and Day 13', () => {
      const data = getMonthlyWorkHoursData(2026, 11);

      // Day 5: "Thur. 8h"
      const day5 = data.dailyRecords.find((d) => d.day === 5);
      expect(day5).toBeDefined();
      expect(day5?.dayOfWeek).toBe('Thur');
      expect(day5?.hours).toBe(8.0);
      expect(day5?.status).toBe('recorded');

      // Day 9: Red indicator (holiday / leave)
      const day9 = data.dailyRecords.find((d) => d.day === 9);
      expect(day9).toBeDefined();
      expect(day9?.isHoliday).toBe(true);
      expect(day9?.status).toBe('no_entry');

      // Day 13: "Today"
      const day13 = data.dailyRecords.find((d) => d.day === 13);
      expect(day13).toBeDefined();
      expect(day13?.isToday).toBe(true);

      // Day 7: Weekend no entry
      const day7 = data.dailyRecords.find((d) => d.day === 7);
      expect(day7).toBeDefined();
      expect(day7?.isWeekend).toBe(true);
      expect(day7?.status).toBe('no_entry');

      // Day 4: Lesser than 8h
      const day4 = data.dailyRecords.find((d) => d.day === 4);
      expect(day4).toBeDefined();
      expect(day4?.status).toBe('lesser');
    });
  });

  describe('Other months dynamic calculation', () => {
    it('calculates monthly summary dynamically for October 2026', () => {
      const data = getMonthlyWorkHoursData(2026, 10);

      expect(data.year).toBe(2026);
      expect(data.month).toBe(10);
      expect(data.monthName).toBe('October 2026');
      expect(data.dailyRecords).toHaveLength(31);
      expect(data.workingDays).toBeGreaterThan(0);
      expect(data.daysRecorded).toBeGreaterThan(0);
    });

    it('formats month names correctly with getMonthName', () => {
      expect(getMonthName(2026, 1)).toBe('January 2026');
      expect(getMonthName(2026, 11)).toBe('November 2026');
      expect(getMonthName(2027, 12)).toBe('December 2027');
    });
  });

  describe('DEFAULT_EMPLOYMENT_HISTORY', () => {
    it('contains expected employee profile data matching the design', () => {
      expect(DEFAULT_EMPLOYMENT_HISTORY.designation).toBe('HR Manager');
      expect(DEFAULT_EMPLOYMENT_HISTORY.status).toBe('Active');
      expect(DEFAULT_EMPLOYMENT_HISTORY.isPrimary).toBe(true);
      expect(DEFAULT_EMPLOYMENT_HISTORY.employeeCode).toBe('KAP0002');
      expect(DEFAULT_EMPLOYMENT_HISTORY.organisation).toBe('Test Organisation');
      expect(DEFAULT_EMPLOYMENT_HISTORY.office).toBe('Head office');
      expect(DEFAULT_EMPLOYMENT_HISTORY.department).toBe('HR');
      expect(DEFAULT_EMPLOYMENT_HISTORY.employmentType).toBe('Employee');
      expect(DEFAULT_EMPLOYMENT_HISTORY.workArrangement).toBe('On-site');
      expect(DEFAULT_EMPLOYMENT_HISTORY.effectivePeriod).toBe('21 Oct 2026 · Open ended');
      expect(DEFAULT_EMPLOYMENT_HISTORY.confirmation).toBe('Confirmed · 21 Oct 2026');
      expect(DEFAULT_EMPLOYMENT_HISTORY.joinedDate).toBe('21 Oct 2026');
    });
  });
});
