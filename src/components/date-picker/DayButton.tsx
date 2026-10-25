import { forwardRef, type ButtonHTMLAttributes, type KeyboardEvent } from "react";

import { cn } from "../../utils/cn";

interface DayButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "value"> {
  date: Date;
  label: string;
  isToday?: boolean;
  isSelected?: boolean;
  isOutsideMonth?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  isInRange?: boolean;
  onDayKeyDown?: (event: KeyboardEvent<HTMLButtonElement>, date: Date) => void;
}

export const DayButton = forwardRef<HTMLButtonElement, DayButtonProps>(function DayButton(
  {
    date,
    label,
    isToday = false,
    isSelected = false,
    isOutsideMonth = false,
    isRangeStart = false,
    isRangeEnd = false,
    isInRange = false,
    disabled,
    className,
    onDayKeyDown,
    ...props
  },
  ref,
) {
  const selected = isSelected || isRangeStart || isRangeEnd;

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      data-date={date.toISOString()}
      data-range-start={isRangeStart || undefined}
      data-range-end={isRangeEnd || undefined}
      data-in-range={isInRange || undefined}
      className={cn(
        "relative flex size-10 flex-col items-center justify-center border-0 p-1 font-sans text-xs font-normal leading-[120%] outline-none",
        "bg-background text-foreground hover:bg-hover focus-visible:z-10 focus-visible:shadow-focus",
        isOutsideMonth && "text-subtle-foreground",
        isInRange &&
          "!bg-[var(--neutral-200)] hover:!bg-[var(--neutral-200)]",
        selected &&
          "!bg-selected text-selected-foreground hover:!bg-selected focus-visible:shadow-focus",
        disabled &&
          "cursor-not-allowed opacity-[var(--disabled-opacity)] hover:bg-background",
        className,
      )}
      onKeyDown={(event) => onDayKeyDown?.(event, date)}
      {...props}
    >
      <span>{label}</span>
      {isToday ? (
        <span
          className={selected ? "text-selected-subtle-foreground" : "text-subtle-foreground"}
        >
          Today
        </span>
      ) : null}
    </button>
  );
});
