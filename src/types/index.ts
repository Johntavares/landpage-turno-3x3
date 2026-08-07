export type TeamType = 'A' | 'B' | 'C' | 'D';

export type ShiftType = 'DAY' | 'NIGHT';

export type DayStatus = 'WORK' | 'OFF' | 'VACATION';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  team: TeamType;
  baseDate: string; // ISO YYYY-MM-DD
  theme: 'light' | 'dark' | 'system';
  createdAt?: string;
}

export interface Vacation {
  id: string;
  userId?: string;
  startDate: string; // ISO YYYY-MM-DD
  endDate: string;   // ISO YYYY-MM-DD
  note?: string;
  createdAt?: string;
}

export interface Holiday {
  id: string;
  date: string;      // ISO YYYY-MM-DD
  name: string;
  type: 'NATIONAL' | 'MUNICIPAL' | 'CUSTOM';
  description?: string;
}

export interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  active: boolean;
  displayOrder: number;
  location?: 'HOME' | 'PROFILE' | 'ALL';
}


export interface CalculatedDay {
  date: string; // YYYY-MM-DD
  team: TeamType;
  shift: ShiftType;
  status: DayStatus;
  cycleDay: number; // 1, 2, 3 (work) or 1, 2, 3 (off)
  isWorkDay: boolean;
  isVacation: boolean;
  holiday?: Holiday;
  isHolidayWork: boolean; // Holiday falling on work day (100% pay alert)
  notes?: string;
}

export interface MonthlySummary {
  monthName: string;
  totalWorkDays: number;
  totalOffDays: number;
  totalVacationDays: number;
  workedHolidaysCount: number;
}
