import {
  forwardRef,
  useContext,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "../../utils/cn";
import { RadioGroupContext } from "./RadioGroupContext";

export interface RadioButtonProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label: ReactNode;
  description?: ReactNode;
}

/** A native radio input presented as a Neo-Lite selectable card. */
export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    {
      id,
      label,
      description,
      className,
      checked,
      defaultChecked,
      disabled = false,
      required = false,
      name,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const group = useContext(RadioGroupContext);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const stringValue = value === undefined ? undefined : String(value);
    const isGrouped = Boolean(group && stringValue !== undefined);
    const resolvedDisabled = Boolean(disabled || group?.disabled);
    const visuallyDisabled = disabled && !group?.disabled;

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "relative flex items-center gap-2 font-sans text-sm font-normal leading-[160%]",
          isGrouped
            ? "w-fit"
            : "w-[244px] rounded-sm border border-border bg-background p-3 [&:has(input:checked)]:bg-[var(--neutral-200)] [&:has(input:focus-visible)]:shadow-focus",
          !resolvedDisabled &&
            (isGrouped ? "cursor-pointer" : "cursor-pointer hover:shadow-sm"),
          visuallyDisabled && "cursor-not-allowed opacity-[var(--disabled-opacity)]",
          className,
        )}
      >
        <input
          {...props}
          ref={ref}
          id={inputId}
          type="radio"
          name={group?.name ?? name}
          value={value}
          checked={isGrouped ? group?.value === stringValue : checked}
          defaultChecked={isGrouped ? undefined : defaultChecked}
          disabled={resolvedDisabled}
          required={group?.required || required}
          onChange={(event) => {
            onChange?.(event);

            if (
              !event.defaultPrevented &&
              event.currentTarget.checked &&
              group &&
              stringValue !== undefined
            ) {
              group.onValueChange(stringValue);
            }
          }}
          className="peer absolute inset-0 z-10 size-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
        />

        <span
          className={cn(
            "pointer-events-none flex min-w-0 flex-col",
            isGrouped ? "order-2" : "flex-1 gap-1",
          )}
        >
          <span className="text-foreground">{label}</span>
          {description ? (
            <span className="text-subtle-foreground">{description}</span>
          ) : null}
        </span>

        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none relative size-4 shrink-0 rounded-md border border-border bg-background peer-checked:[&>span]:block peer-focus-visible:shadow-focus",
            isGrouped && "order-1",
          )}
        >
          <span className="absolute left-1/2 top-1/2 hidden size-2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-selected" />
        </span>
      </label>
    );
  },
);

RadioButton.displayName = "RadioButton";
