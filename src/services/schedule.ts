import type { TeamType, ShiftType, CalculatedDay, Holiday, Vacation } from '../types';

export type CycleState = 'WORK_1' | 'WORK_2' | 'WORK_3' | 'OFF_1' | 'OFF_2' | 'OFF_3';

export function differenceInDays(targetDateStr: string, baseDateStr: string): number {
  const target = new Date(targetDateStr + 'T00:00:00');
  const base = new Date(baseDateStr + 'T00:00:00');
  const diffTime = target.getTime() - base.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calcula a Data-Base da Equipe A a partir da situação do usuário em uma data de referência
 */
export function calculateBaseDateFromStatus(
  referenceDateStr: string,
  team: TeamType,
  statusState: CycleState
): string {
  const stateIndexMap: Record<CycleState, number> = {
    WORK_1: 0,
    WORK_2: 1,
    WORK_3: 2,
    OFF_1: 3,
    OFF_2: 4,
    OFF_3: 5,
  };

  const userIndex = stateIndexMap[statusState];
  let cycleIndexA = userIndex;

  if (team === 'C' || team === 'D') {
    cycleIndexA = (userIndex - 3 + 6) % 6;
  }

  const refDate = new Date(referenceDateStr + 'T00:00:00');
  refDate.setDate(refDate.getDate() - cycleIndexA);
  return formatDateISO(refDate);
}

export function getCycleStateFromDay(calculatedDay: CalculatedDay): CycleState {
  if (calculatedDay.isWorkDay) {
    if (calculatedDay.cycleDay === 1) return 'WORK_1';
    if (calculatedDay.cycleDay === 2) return 'WORK_2';
    return 'WORK_3';
  } else {
    if (calculatedDay.cycleDay === 1) return 'OFF_1';
    if (calculatedDay.cycleDay === 2) return 'OFF_2';
    return 'OFF_3';
  }
}

export function calculateScheduleDay(
  dateStr: string,
  team: TeamType,
  baseDateStr: string,
  vacations: Vacation[] = [],
  holidays: Holiday[] = []
): CalculatedDay {
  const daysDiff = differenceInDays(dateStr, baseDateStr);
  const cycleIndexA = ((daysDiff % 6) + 6) % 6;

  let rawIndex = cycleIndexA;
  let shift: ShiftType = 'DAY';

  switch (team) {
    case 'A':
      shift = 'DAY';
      rawIndex = cycleIndexA;
      break;
    case 'B':
      shift = 'NIGHT';
      rawIndex = cycleIndexA;
      break;
    case 'C':
      shift = 'DAY';
      rawIndex = (cycleIndexA + 3) % 6;
      break;
    case 'D':
      shift = 'NIGHT';
      rawIndex = (cycleIndexA + 3) % 6;
      break;
  }

  const isWorkDay = rawIndex < 3;
  const cycleDay = isWorkDay ? rawIndex + 1 : rawIndex - 2;

  const isVacation = vacations.some((v) => {
    return dateStr >= v.startDate && dateStr <= v.endDate;
  });

  let status: CalculatedDay['status'] = isWorkDay ? 'WORK' : 'OFF';
  if (isVacation) {
    status = 'VACATION';
  }

  const holiday = holidays.find((h) => h.date === dateStr);
  const isHolidayWork = isWorkDay && Boolean(holiday);

  return {
    date: dateStr,
    team,
    shift,
    status,
    cycleDay,
    isWorkDay,
    isVacation,
    holiday,
    isHolidayWork,
  };
}

export function calculateMonthSchedule(
  year: number,
  month: number,
  team: TeamType,
  baseDateStr: string,
  vacations: Vacation[] = [],
  holidays: Holiday[] = []
): CalculatedDay[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthDays: CalculatedDay[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    const calculated = calculateScheduleDay(dateStr, team, baseDateStr, vacations, holidays);
    monthDays.push(calculated);
  }

  return monthDays;
}

export function getNextShiftChangeInfo(
  currentDateStr: string,
  team: TeamType,
  baseDateStr: string,
  vacations: Vacation[] = [],
  holidays: Holiday[] = []
) {
  const todayCalc = calculateScheduleDay(currentDateStr, team, baseDateStr, vacations, holidays);
  let daysUntilChange = 0;
  let checkDate = new Date(currentDateStr + 'T00:00:00');

  for (let i = 1; i <= 7; i++) {
    checkDate.setDate(checkDate.getDate() + 1);
    const nextDateStr = formatDateISO(checkDate);
    const nextCalc = calculateScheduleDay(nextDateStr, team, baseDateStr, vacations, holidays);

    if (nextCalc.isWorkDay !== todayCalc.isWorkDay) {
      daysUntilChange = i;
      break;
    }
  }

  let nextOffDate = '';
  let nextWorkDate = '';

  let searchDate = new Date(currentDateStr + 'T00:00:00');
  for (let i = 0; i <= 30; i++) {
    const sDateStr = formatDateISO(searchDate);
    const sCalc = calculateScheduleDay(sDateStr, team, baseDateStr, vacations, holidays);

    if (!nextOffDate && !sCalc.isWorkDay) {
      nextOffDate = sDateStr;
    }
    if (!nextWorkDate && sCalc.isWorkDay && (i > 0 || !todayCalc.isWorkDay)) {
      nextWorkDate = sDateStr;
    }

    if (nextOffDate && nextWorkDate) break;
    searchDate.setDate(searchDate.getDate() + 1);
  }

  return {
    todayCalc,
    daysUntilChange,
    nextOffDate,
    nextWorkDate,
  };
}
