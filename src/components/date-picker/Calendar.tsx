import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import chevronLeftIcon from "../../assets/icons/date-picker/chevron-left.svg?raw";
import chevronRightIcon from "../../assets/icons/date-picker/chevron-right.svg?raw";
import doubleChevronLeftIcon from "../../assets/icons/date-picker/double-chevron-left.svg?raw";
import doubleChevronRightIcon from "../../assets/icons/date-picker/double-chevron-right.svg?raw";
import { Icon } from "../../assets/icons/Icon";
import { cn } from "../../utils/cn";
import { Button } from "../button";
import { DayButton } from "./DayButton";
import {
  addDays,
  addMonths,
  addYears,
  findAvailableDate,
  getMonthDays,
  getWeekdayDates,
  isBetweenDays,
  isDateUnavailable,
  isSameDay,
  isSameMonth,
  resolveLocale,
  startOfDay,
  startOfMonth,
  type WeekStart,
} from "./date-utils";

export type CalendarValue = Date | undefined;

export interface CalendarProps {
  value?: CalendarValue;
  defaultValue?: CalendarValue;
  onValueChange?: (date: Date) => void;

  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;

  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  showOutsideDays?: boolean;
  locale?: string;
  weekStartsOn?: WeekStart;
  className?: string;
}

type CalendarNavigation = "all" | "leading" | "trailing";

interface InternalCalendarProps extends CalendarProps {
  navigation?: CalendarNavigation;
  embedded?: boolean;
  autoFocus?: boolean;
  rangeFrom?: Date;
  rangeTo?: Date;
  rangeMode?: boolean;
  onDaySelect?: (date: Date) => void;
}

function clampDayToMonth(day: number, month: Date) {
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return new Date(month.getFullYear(), month.getMonth(), Math.min(day, lastDay));
}

function NavigationButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="secondary"
      size="xs"
      aria-label={label}
      className="shrink-0"
      onClick={onClick}
    >
      <Icon svg={icon} />
    </Button>
  );
}

/** A single-month, keyboard-navigable Neo-Lite calendar. */
export function CalendarPanel({
  value,
  defaultValue,
  onValueChange,
  month,
  defaultMonth,
  onMonthChange,
  minDate,
  maxDate,
  isDateDisabled,
  showOutsideDays = true,
  locale,
  weekStartsOn = 0,
  className,
  navigation = "all",
  embedded = false,
  autoFocus = false,
  rangeFrom,
  rangeTo,
  rangeMode = false,
  onDaySelect,
}: InternalCalendarProps) {
  const resolvedLocale = resolveLocale(locale);
  const today = useMemo(() => startOfDay(new Date()), []);
  const initialValue = value ?? defaultValue;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const selectedValue = value ?? uncontrolledValue;
  const valueIsControlled = value !== undefined;

  const initialMonth = startOfMonth(month ?? defaultMonth ?? initialValue ?? today);
  const [uncontrolledMonth, setUncontrolledMonth] = useState(initialMonth);
  const visibleMonth = startOfMonth(month ?? uncontrolledMonth);
  const monthIsControlled = month !== undefined;
  const monthDays = useMemo(
    () => getMonthDays(visibleMonth, weekStartsOn),
    [visibleMonth.getFullYear(), visibleMonth.getMonth(), weekStartsOn],
  );

  const firstAvailableDate = useMemo(() => {
    const preferredDates = [selectedValue, today].filter(
      (date): date is Date =>
        Boolean(date) &&
        isSameMonth(date as Date, visibleMonth) &&
        !isDateUnavailable(date as Date, minDate, maxDate, isDateDisabled),
    );

    return (
      preferredDates[0] ??
      monthDays.find(
        (date) =>
          isSameMonth(date, visibleMonth) &&
          !isDateUnavailable(date, minDate, maxDate, isDateDisabled),
      ) ??
      monthDays.find((date) => !isDateUnavailable(date, minDate, maxDate, isDateDisabled)) ??
      visibleMonth
    );
  }, [isDateDisabled, maxDate, minDate, monthDays, selectedValue, today, visibleMonth]);

  const [focusedDate, setFocusedDate] = useState(firstAvailableDate);
  const dayRefs = useRef(new Map<number, HTMLButtonElement>());
  const shouldFocusDayRef = useRef(autoFocus);
  const headingId = useId();

  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(resolvedLocale, { month: "long", year: "numeric" }),
    [resolvedLocale],
  );
  const dayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(resolvedLocale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [resolvedLocale],
  );
  const weekdayShortFormatter = useMemo(
    () => new Intl.DateTimeFormat(resolvedLocale, { weekday: "short" }),
    [resolvedLocale],
  );
  const weekdayLongFormatter = useMemo(
    () => new Intl.DateTimeFormat(resolvedLocale, { weekday: "long" }),
    [resolvedLocale],
  );

  useEffect(() => {
    if (!isSameMonth(focusedDate, visibleMonth)) {
      setFocusedDate(firstAvailableDate);
    }
  }, [firstAvailableDate, focusedDate, visibleMonth]);

  useEffect(() => {
    if (!shouldFocusDayRef.current) {
      return;
    }

    shouldFocusDayRef.current = false;
    dayRefs.current.get(startOfDay(focusedDate).getTime())?.focus();
  }, [focusedDate, visibleMonth]);

  function updateMonth(nextMonth: Date) {
    const normalizedMonth = startOfMonth(nextMonth);

    if (!monthIsControlled) {
      setUncontrolledMonth(normalizedMonth);
    }

    onMonthChange?.(normalizedMonth);
  }

  function navigateMonth(amount: number) {
    updateMonth(addMonths(visibleMonth, amount));
  }

  function navigateYear(amount: number) {
    updateMonth(addYears(visibleMonth, amount));
  }

  function selectDate(date: Date) {
    if (isDateUnavailable(date, minDate, maxDate, isDateDisabled)) {
      return;
    }

    const normalizedDate = startOfDay(date);

    if (!rangeMode && !valueIsControlled) {
      setUncontrolledValue(normalizedDate);
    }

    if (!isSameMonth(normalizedDate, visibleMonth)) {
      updateMonth(normalizedDate);
    }

    if (!rangeMode) {
      onValueChange?.(normalizedDate);
    }
    onDaySelect?.(normalizedDate);
  }

  function focusDate(nextDate: Date, direction: 1 | -1) {
    const availableDate = findAvailableDate(
      nextDate,
      direction,
      minDate,
      maxDate,
      isDateDisabled,
    );

    if (!availableDate) {
      return;
    }

    shouldFocusDayRef.current = true;
    setFocusedDate(availableDate);

    if (!isSameMonth(availableDate, visibleMonth)) {
      updateMonth(availableDate);
    }
  }

  function handleDayKeyDown(event: KeyboardEvent<HTMLButtonElement>, date: Date) {
    let nextDate: Date | undefined;
    let direction: 1 | -1 = 1;

    switch (event.key) {
      case "ArrowLeft":
        nextDate = addDays(date, -1);
        direction = -1;
        break;
      case "ArrowRight":
        nextDate = addDays(date, 1);
        break;
      case "ArrowUp":
        nextDate = addDays(date, -7);
        direction = -1;
        break;
      case "ArrowDown":
        nextDate = addDays(date, 7);
        break;
      case "Home": {
        const offset = (date.getDay() - weekStartsOn + 7) % 7;
        nextDate = addDays(date, -offset);
        direction = -1;
        break;
      }
      case "End": {
        const offset = (weekStartsOn + 6 - date.getDay() + 7) % 7;
        nextDate = addDays(date, offset);
        break;
      }
      case "PageUp": {
        const nextMonth = event.shiftKey
          ? addYears(visibleMonth, -1)
          : addMonths(visibleMonth, -1);
        nextDate = clampDayToMonth(date.getDate(), nextMonth);
        direction = -1;
        break;
      }
      case "PageDown": {
        const nextMonth = event.shiftKey
          ? addYears(visibleMonth, 1)
          : addMonths(visibleMonth, 1);
        nextDate = clampDayToMonth(date.getDate(), nextMonth);
        break;
      }
      case "Enter":
      case " ":
        event.preventDefault();
        selectDate(date);
        return;
      default:
        return;
    }

    event.preventDefault();
    focusDate(nextDate, direction);
  }

  const showLeadingNavigation = navigation === "all" || navigation === "leading";
  const showTrailingNavigation = navigation === "all" || navigation === "trailing";
  const weeks = Array.from({ length: monthDays.length / 7 }, (_, weekIndex) =>
    monthDays.slice(weekIndex * 7, weekIndex * 7 + 7),
  );

  return (
    <div
      className={cn(
        "w-[296px] bg-background p-2 font-sans text-foreground",
        !embedded &&
          "overflow-hidden rounded-sm outline outline-1 outline-offset-[-1px] outline-border shadow-sm",
        className,
      )}
    >
      <div className="relative flex h-10 items-start justify-between">
        <div className="flex gap-1">
          {showLeadingNavigation ? (
            <>
              <NavigationButton
                label="Previous year"
                icon={doubleChevronLeftIcon}
                onClick={() => navigateYear(-1)}
              />
              <NavigationButton
                label="Previous month"
                icon={chevronLeftIcon}
                onClick={() => navigateMonth(-1)}
              />
            </>
          ) : null}
        </div>
        <h2
          id={headingId}
          aria-live="polite"
          className="pointer-events-none absolute inset-x-20 top-0 flex h-9 items-center justify-center whitespace-nowrap text-center text-sm font-normal leading-[160%]"
        >
          {monthFormatter.format(visibleMonth)}
        </h2>
        <div className="flex gap-1">
          {showTrailingNavigation ? (
            <>
              <NavigationButton
                label="Next month"
                icon={chevronRightIcon}
                onClick={() => navigateMonth(1)}
              />
              <NavigationButton
                label="Next year"
                icon={doubleChevronRightIcon}
                onClick={() => navigateYear(1)}
              />
            </>
          ) : null}
        </div>
      </div>

      <div role="grid" aria-labelledby={headingId} className="w-[280px]">
        <div role="row" className="grid h-8 grid-cols-7">
          {getWeekdayDates(weekStartsOn).map((weekday) => (
            <div
              key={weekday.getDay()}
              role="columnheader"
              aria-label={weekdayLongFormatter.format(weekday)}
              className="flex items-center justify-center text-xs font-normal leading-[120%] text-subtle-foreground"
            >
              {weekdayShortFormatter.format(weekday).slice(0, 2)}
            </div>
          ))}
        </div>

        {weeks.map((week) => (
          <div key={week[0].getTime()} role="row" className="grid h-10 grid-cols-7">
            {week.map((date) => {
              const outsideMonth = !isSameMonth(date, visibleMonth);
              const disabled = isDateUnavailable(date, minDate, maxDate, isDateDisabled);
              const isRangeStart = isSameDay(date, rangeFrom);
              const isRangeEnd = isSameDay(date, rangeTo);
              const inRange = isBetweenDays(date, rangeFrom, rangeTo);
              const selected = !rangeMode && isSameDay(date, selectedValue);
              const dateLabel = dayFormatter.format(date);
              const accessibleLabel = [
                dateLabel,
                isSameDay(date, today) ? "today" : undefined,
                isRangeStart ? "range start" : undefined,
                isRangeEnd ? "range end" : undefined,
                inRange ? "in selected range" : undefined,
                disabled ? "unavailable" : undefined,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <div key={date.getTime()} role="gridcell" className="size-10">
                  {showOutsideDays || !outsideMonth ? (
                    <DayButton
                      ref={(element) => {
                        const key = startOfDay(date).getTime();
                        if (element) {
                          dayRefs.current.set(key, element);
                        } else {
                          dayRefs.current.delete(key);
                        }
                      }}
                      date={date}
                      label={String(date.getDate())}
                      aria-label={accessibleLabel}
                      aria-current={isSameDay(date, today) ? "date" : undefined}
                      aria-selected={selected || isRangeStart || isRangeEnd || inRange}
                      disabled={disabled}
                      isToday={isSameDay(date, today)}
                      isSelected={selected}
                      isOutsideMonth={outsideMonth}
                      isRangeStart={isRangeStart}
                      isRangeEnd={isRangeEnd}
                      isInRange={inRange}
                      tabIndex={isSameDay(date, focusedDate) ? 0 : -1}
                      onFocus={() => setFocusedDate(date)}
                      onClick={() => selectDate(date)}
                      onDayKeyDown={handleDayKeyDown}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/** A single-month, keyboard-navigable Neo-Lite calendar. */
export function Calendar(props: CalendarProps) {
  return <CalendarPanel {...props} />;
}
