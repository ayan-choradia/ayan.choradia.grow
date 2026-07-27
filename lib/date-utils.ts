import { format, addDays, isSaturday, isSunday, parseISO, startOfDay } from 'date-fns';

// Common stock/futures market holidays (YYYY-MM-DD)
export const MARKET_HOLIDAYS = [
  '2026-01-01', // New Year's Day
  '2026-01-19', // MLK Day / Independence Day
  '2026-01-26', // Republic Day
  '2026-04-03', // Good Friday
  '2026-05-25', // Memorial Day
  '2026-07-03', // Independence Day (Observed)
  '2026-09-07', // Labor Day
  '2026-10-02', // Gandhi Jayanti
  '2026-11-26', // Thanksgiving / Diwali
  '2026-12-25', // Christmas
];

export function isTradingDay(date: Date): boolean {
  if (isSaturday(date) || isSunday(date)) return false;
  const dateStr = format(date, 'yyyy-MM-dd');
  return !MARKET_HOLIDAYS.includes(dateStr);
}

export function getTodayOrNextTradingDay(inputDate: Date = new Date()): Date {
  let current = startOfDay(inputDate);
  while (!isTradingDay(current)) {
    current = addDays(current, 1);
  }
  return current;
}

export function getPreviousTradingDay(inputDate: Date = new Date()): Date {
  let current = addDays(startOfDay(inputDate), -1);
  while (!isTradingDay(current)) {
    current = addDays(current, -1);
  }
  return current;
}

export function formatDateForInput(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDateDisplay(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'EEEE, MMM d, yyyy');
}
