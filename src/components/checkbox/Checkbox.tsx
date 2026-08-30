import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type InputHTMLAttributes,
} from "react";

import { cn } from "../../utils/cn";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  indeterminate?: boolean;
  error?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      indeterminate = false,
      error = false,
      disabled,
      className,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <span
        className={cn(
          "relative inline-grid size-4 place-items-center align-middle",
          disabled && "opacity-[var(--disabled-opacity)]",
          className,
        )}
        data-indeterminate={indeterminate || undefined}
        data-error={error || undefined}
      >
        <input
          {...props}
          ref={inputRef}
          type="checkbox"
          disabled={disabled}
          aria-invalid={ariaInvalid ?? (error ? true : undefined)}
          className="peer absolute inset-0 z-10 size-4 cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
        />

        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute m-px size-3.5 border bg-background",
            error ? "border-destructive-border" : "border-border",
            "peer-checked:m-0 peer-checked:size-4 peer-checked:border-border peer-checked:bg-accent peer-checked:shadow-sm peer-focus-visible:shadow-focus",
            "peer-checked:peer-focus-visible:shadow-[var(--selected-focus-shadow)]",
            error &&
              "peer-checked:border-destructive-border peer-checked:bg-destructive peer-focus-visible:shadow-destructive-focus peer-checked:peer-focus-visible:shadow-[var(--selected-destructive-focus-shadow)]",
            indeterminate &&
              "m-0 size-4 border-border bg-accent shadow-sm peer-focus-visible:shadow-[var(--selected-focus-shadow)]",
            !indeterminate && "[&_svg]:hidden peer-checked:[&_svg]:block",
          )}
        >
          <svg
            viewBox="0 0 14 14"
            fill="none"
            className={cn("size-3.5 text-foreground", indeterminate && "block")}
          >
            {indeterminate ? (
              <path
                d="M3 7h8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
              />
            ) : (
              <path
                d="M3 7.25 5.75 10 11 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
            )}
          </svg>
        </span>
      </span>
    );
  },
);

Checkbox.displayName = "Checkbox";
