import type { InputHTMLAttributes, ReactNode } from "react";
import { useId } from "react";

import { cn } from "../../utils/cn";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  leadingDecoration?: ReactNode;
  trailingDecoration?: ReactNode;
  containerClassName?: string;
}

export function Input({
  id,
  label,
  hint,
  error,
  leadingDecoration,
  trailingDecoration,
  containerClassName,
  className,
  disabled,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const message = error ?? hint;
  const messageId = message ? `${inputId}-${error ? "error" : "hint"}` : undefined;
  const describedBy = [ariaDescribedBy, messageId].filter(Boolean).join(" ");
  const hasError = Boolean(error);

  return (
    <div
      className={cn(
        "grid w-full gap-1 font-sans text-sm font-normal leading-[160%]",
        disabled && "opacity-[var(--disabled-opacity)]",
        containerClassName,
      )}
    >
      {label ? (
        <label
          htmlFor={inputId}
          className={hasError ? "text-error" : "text-foreground"}
        >
          {label}
        </label>
      ) : null}

      <div
        className={cn(
          "flex w-full items-center gap-2 rounded-sm border bg-background p-2 text-foreground",
          hasError
            ? "border-destructive-border [&:has(input:focus-visible)]:shadow-destructive-focus"
            : "border-border [&:has(input:focus-visible)]:shadow-focus",
        )}
      >
        {leadingDecoration ? (
          <span className="flex min-w-5 shrink-0 items-center justify-center p-0.5 text-foreground [&_svg]:size-4 [&_svg]:shrink-0">
            {leadingDecoration}
          </span>
        ) : null}

        <input
          id={inputId}
          className={cn(
            "min-w-0 flex-1 bg-transparent px-1 text-foreground outline-none placeholder:text-placeholder disabled:cursor-not-allowed",
            className,
          )}
          disabled={disabled}
          aria-describedby={describedBy || undefined}
          aria-invalid={hasError ? true : ariaInvalid}
          {...props}
        />

        {trailingDecoration ? (
          <span className="flex min-w-5 shrink-0 items-center justify-center p-0.5 text-foreground [&_svg]:size-4 [&_svg]:shrink-0">
            {trailingDecoration}
          </span>
        ) : null}
      </div>

      {message ? (
        <p
          id={messageId}
          className={hasError ? "text-error" : "text-muted-foreground"}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
