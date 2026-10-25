import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import calendarIcon from "../../assets/icons/date-picker/calendar.svg?raw";
import { Icon } from "../../assets/icons/Icon";
import { cn } from "../../utils/cn";
import { CalendarPanel } from "./Calendar";
import {
  addMonths,
  isBeforeDay,
  resolveLocale,
  startOfDay,
  startOfMonth,
  type WeekStart,
} from "./date-utils";

export interface DateRange {
  from?: Date;
  to?: Date;
}

export type DatePickerMode = "single" | "range";

interface DatePickerBaseProps {
  label?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  locale?: string;
  weekStartsOn?: WeekStart;
  className?: string;
}

export interface SingleDatePickerProps extends DatePickerBaseProps {
  mode?: "single";
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
}

export interface RangeDatePickerProps extends DatePickerBaseProps {
  mode: "range";
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
}

export type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;

function getInitialMonth(props: DatePickerProps) {
  if (props.mode === "range") {
    return startOfMonth(props.value?.from ?? props.defaultValue?.from ?? new Date());
  }

  return startOfMonth(props.value ?? props.defaultValue ?? new Date());
}

/** A picker-only date field with an accessible single or range calendar popup. */
export function DatePicker(props: DatePickerProps) {
  const {
    mode = "single",
    label = "Date",
    hint,
    placeholder,
    disabled = false,
    required = false,
    minDate,
    maxDate,
    isDateDisabled,
    locale,
    weekStartsOn = 0,
    className,
  } = props;
  const isRangeMode = mode === "range";
  const resolvedLocale = resolveLocale(locale);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const generatedId = useId();
  const labelId = `${generatedId}-label`;
  const valueId = `${generatedId}-value`;
  const hintId = hint ? `${generatedId}-hint` : undefined;
  const popupId = `${generatedId}-popup`;
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => getInitialMonth(props));
  const [uncontrolledSingleValue, setUncontrolledSingleValue] = useState(
    props.mode === "range" ? undefined : props.defaultValue,
  );
  const [uncontrolledRangeValue, setUncontrolledRangeValue] = useState<DateRange | undefined>(
    props.mode === "range" ? props.defaultValue : undefined,
  );

  const singleValue =
    props.mode === "range" ? undefined : (props.value ?? uncontrolledSingleValue);
  const rangeValue =
    props.mode === "range" ? (props.value ?? uncontrolledRangeValue) : undefined;
  const singleIsControlled = props.mode !== "range" && props.value !== undefined;
  const rangeIsControlled = props.mode === "range" && props.value !== undefined;

  const displayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(resolvedLocale, {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    [resolvedLocale],
  );

  const displayValue = isRangeMode
    ? rangeValue?.from && rangeValue.to
      ? `${displayFormatter.format(rangeValue.from)} - ${displayFormatter.format(rangeValue.to)}`
      : rangeValue?.from
        ? `${displayFormatter.format(rangeValue.from)} - End date`
        : undefined
    : singleValue
      ? displayFormatter.format(singleValue)
      : undefined;
  const resolvedPlaceholder =
    placeholder ?? (isRangeMode ? "Start date - End date" : "Select a date");

  function closePicker({ restoreFocus = true } = {}) {
    setOpen(false);
    if (restoreFocus) {
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }

  function openPicker() {
    if (disabled) {
      return;
    }

    const selectedDate = isRangeMode ? rangeValue?.from : singleValue;
    if (selectedDate) {
      setVisibleMonth(startOfMonth(selectedDate));
    }
    setOpen(true);
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        closePicker({ restoreFocus: false });
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closePicker();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function selectSingleDate(date: Date) {
    if (props.mode === "range") {
      return;
    }

    const normalizedDate = startOfDay(date);
    if (!singleIsControlled) {
      setUncontrolledSingleValue(normalizedDate);
    }
    props.onValueChange?.(normalizedDate);
    closePicker();
  }

  function selectRangeDate(date: Date) {
    if (props.mode !== "range") {
      return;
    }

    const normalizedDate = startOfDay(date);
    let nextRange: DateRange;
    let complete = false;

    if (!rangeValue?.from || rangeValue.to) {
      nextRange = { from: normalizedDate };
    } else if (isBeforeDay(normalizedDate, rangeValue.from)) {
      nextRange = { from: normalizedDate };
    } else {
      nextRange = { from: rangeValue.from, to: normalizedDate };
      complete = true;
    }

    if (!rangeIsControlled) {
      setUncontrolledRangeValue(nextRange);
    }
    props.onValueChange?.(nextRange);

    if (complete) {
      closePicker();
    }
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" && !open) {
      event.preventDefault();
      openPicker();
    }
  }

  const sharedCalendarProps = {
    minDate,
    maxDate,
    isDateDisabled,
    locale: resolvedLocale,
    weekStartsOn,
    showOutsideDays: true,
  };

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative grid w-full max-w-[296px] gap-1 font-sans text-xs font-normal leading-[120%]",
        disabled && "opacity-[var(--disabled-opacity)]",
        className,
      )}
    >
      <span id={labelId} className="text-foreground">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </span>

      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? popupId : undefined}
          aria-labelledby={`${labelId} ${valueId}`}
          aria-describedby={hintId}
          aria-required={required || undefined}
          className={cn(
            "flex w-full items-center gap-2 rounded-sm border border-border bg-background p-2 text-left outline-none disabled:cursor-not-allowed",
            "focus-visible:shadow-focus",
            open && "shadow-focus",
          )}
          onClick={() => (open ? closePicker({ restoreFocus: false }) : openPicker())}
          onKeyDown={handleTriggerKeyDown}
        >
          <span className="flex w-5 shrink-0 items-center justify-center p-0.5 text-foreground [&_[data-neo-lite-icon]]:size-4">
            <Icon svg={calendarIcon} />
          </span>
          <span
            id={valueId}
            className={cn("min-w-0 flex-1 px-1", displayValue ? "text-foreground" : "text-placeholder")}
          >
            {displayValue ?? resolvedPlaceholder}
          </span>
        </button>

        {open ? (
          <div
            id={popupId}
            role="dialog"
            aria-label={`${label} calendar`}
            className="absolute left-0 top-full z-50 mt-1"
          >
            {isRangeMode ? (
              <>
                <div className="overflow-hidden rounded-sm border border-border bg-background shadow-sm sm:hidden">
                  <CalendarPanel
                    {...sharedCalendarProps}
                    embedded
                    autoFocus
                    navigation="all"
                    rangeMode
                    month={visibleMonth}
                    onMonthChange={setVisibleMonth}
                    rangeFrom={rangeValue?.from}
                    rangeTo={rangeValue?.to}
                    onDaySelect={selectRangeDate}
                  />
                </div>
                <div className="hidden w-[594px] overflow-hidden rounded-sm border border-border bg-background shadow-sm sm:flex">
                  <CalendarPanel
                    {...sharedCalendarProps}
                    embedded
                    autoFocus
                    navigation="leading"
                    rangeMode
                    month={visibleMonth}
                    onMonthChange={setVisibleMonth}
                    rangeFrom={rangeValue?.from}
                    rangeTo={rangeValue?.to}
                    onDaySelect={selectRangeDate}
                  />
                  <CalendarPanel
                    {...sharedCalendarProps}
                    embedded
                    navigation="trailing"
                    rangeMode
                    month={addMonths(visibleMonth, 1)}
                    onMonthChange={(nextMonth) => setVisibleMonth(addMonths(nextMonth, -1))}
                    rangeFrom={rangeValue?.from}
                    rangeTo={rangeValue?.to}
                    onDaySelect={selectRangeDate}
                  />
                </div>
              </>
            ) : (
              <CalendarPanel
                {...sharedCalendarProps}
                autoFocus
                value={singleValue}
                month={visibleMonth}
                onMonthChange={setVisibleMonth}
                onDaySelect={selectSingleDate}
              />
            )}
          </div>
        ) : null}
      </div>

      {hint ? (
        <span id={hintId} className="text-subtle-foreground">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
