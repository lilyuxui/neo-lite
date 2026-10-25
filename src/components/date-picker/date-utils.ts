export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function addDays(date: Date, amount: number) {
  const nextDate = startOfDay(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function addYears(date: Date, amount: number) {
  return new Date(date.getFullYear() + amount, date.getMonth(), 1);
}

export function isSameDay(first: Date | undefined, second: Date | undefined) {
  return Boolean(
    first &&
      second &&
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate(),
  );
}

export function isSameMonth(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth()
  );
}

export function isBeforeDay(first: Date, second: Date) {
  return startOfDay(first).getTime() < startOfDay(second).getTime();
}

export function isAfterDay(first: Date, second: Date) {
  return startOfDay(first).getTime() > startOfDay(second).getTime();
}

export function isBetweenDays(date: Date, from?: Date, to?: Date) {
  if (!from || !to) {
    return false;
  }

  const value = startOfDay(date).getTime();
  return value > startOfDay(from).getTime() && value < startOfDay(to).getTime();
}

export function getMonthDays(month: Date, weekStartsOn: WeekStart) {
  const firstDay = startOfMonth(month);
  const lastDay = endOfMonth(month);
  const leadingDays = (firstDay.getDay() - weekStartsOn + 7) % 7;
  const trailingDays = (weekStartsOn + 6 - lastDay.getDay() + 7) % 7;
  const totalDays = leadingDays + lastDay.getDate() + trailingDays;
  const gridStart = addDays(firstDay, -leadingDays);

  return Array.from({ length: totalDays }, (_, index) => addDays(gridStart, index));
}

export function getWeekdayDates(weekStartsOn: WeekStart) {
  const sunday = new Date(2026, 0, 4);
  return Array.from({ length: 7 }, (_, index) =>
    addDays(sunday, weekStartsOn + index),
  );
}

export function isDateUnavailable(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  isDateDisabled?: (date: Date) => boolean,
) {
  return Boolean(
    (minDate && isBeforeDay(date, minDate)) ||
      (maxDate && isAfterDay(date, maxDate)) ||
      isDateDisabled?.(date),
  );
}

export function findAvailableDate(
  initialDate: Date,
  direction: 1 | -1,
  minDate?: Date,
  maxDate?: Date,
  isDateDisabled?: (date: Date) => boolean,
) {
  let candidate = startOfDay(initialDate);

  for (let attempts = 0; attempts < 3660; attempts += 1) {
    if (!isDateUnavailable(candidate, minDate, maxDate, isDateDisabled)) {
      return candidate;
    }

    candidate = addDays(candidate, direction);
  }

  return undefined;
}

export function resolveLocale(locale?: string) {
  return locale ?? "en-AU";
}
