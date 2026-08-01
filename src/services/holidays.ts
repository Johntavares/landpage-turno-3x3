import type { Holiday } from '../types';

export function getNationalHolidays(year: number): Holiday[] {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  const easterDate = new Date(year, month - 1, day);

  const goodFridayDate = new Date(easterDate);
  goodFridayDate.setDate(easterDate.getDate() - 2);

  const carnivalDate = new Date(easterDate);
  carnivalDate.setDate(easterDate.getDate() - 47);

  const corpusChristiDate = new Date(easterDate);
  corpusChristiDate.setDate(easterDate.getDate() + 60);

  const format = (d: Date) => {
    const y = d.getFullYear();
    const mStr = String(d.getMonth() + 1).padStart(2, '0');
    const dStr = String(d.getDate()).padStart(2, '0');
    return `${y}-${mStr}-${dStr}`;
  };

  const holidays: Holiday[] = [
    { id: `br-1-${year}`, date: `${year}-01-01`, name: 'Confraternização Universal', type: 'NATIONAL' },
    { id: `br-carnival-${year}`, date: format(carnivalDate), name: 'Carnaval', type: 'NATIONAL' },
    { id: `br-goodfriday-${year}`, date: format(goodFridayDate), name: 'Sexta-feira Santa', type: 'NATIONAL' },
    { id: `br-4-${year}`, date: `${year}-04-21`, name: 'Tiradentes', type: 'NATIONAL' },
    { id: `br-5-${year}`, date: `${year}-05-01`, name: 'Dia do Trabalhador', type: 'NATIONAL' },
    { id: `br-corpus-${year}`, date: format(corpusChristiDate), name: 'Corpus Christi', type: 'NATIONAL' },
    { id: `br-9-${year}`, date: `${year}-09-07`, name: 'Independência do Brasil', type: 'NATIONAL' },
    { id: `br-10-${year}`, date: `${year}-10-12`, name: 'Nossa Senhora Aparecida', type: 'NATIONAL' },
    { id: `br-11-2-${year}`, date: `${year}-11-02`, name: 'Finados', type: 'NATIONAL' },
    { id: `br-11-15-${year}`, date: `${year}-11-15`, name: 'Proclamação da República', type: 'NATIONAL' },
    { id: `br-11-20-${year}`, date: `${year}-11-20`, name: 'Dia da Consciência Negra', type: 'NATIONAL' },
    { id: `br-12-${year}`, date: `${year}-12-25`, name: 'Natal', type: 'NATIONAL' },
  ];

  return holidays;
}
