import {
  useId,
  useMemo,
  useState,
  type FieldsetHTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "../../utils/cn";
import { RadioGroupContext } from "./RadioGroupContext";

export interface RadioGroupProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange"> {
  name: string;
  disabled?: boolean;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
}

/** A value-based group of mutually exclusive Neo-Lite RadioButton options. */
export function RadioGroup({
  name,
  value,
  defaultValue,
  onValueChange,
  label,
  hint,
  error,
  children,
  className,
  disabled = false,
  required = false,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: RadioGroupProps) {
  const generatedId = useId();
  const message = error ?? hint;
  const messageId = message ? `${generatedId}-${error ? "error" : "hint"}` : undefined;
  const describedBy = [ariaDescribedBy, messageId].filter(Boolean).join(" ");
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const selectedValue = value ?? uncontrolledValue;
  const isControlled = value !== undefined;

  const contextValue = useMemo(
    () => ({
      name,
      value: selectedValue,
      disabled,
      required,
      onValueChange: (nextValue: string) => {
        if (!isControlled) {
          setUncontrolledValue(nextValue);
        }

        onValueChange?.(nextValue);
      },
    }),
    [disabled, isControlled, name, onValueChange, required, selectedValue],
  );

  return (
    <fieldset
      {...props}
      disabled={disabled}
      aria-describedby={describedBy || undefined}
      aria-invalid={error ? true : ariaInvalid}
      className={cn(
        "m-0 grid min-w-0 gap-1 border-0 p-0 font-sans text-sm font-normal leading-[160%]",
        disabled && "opacity-[var(--disabled-opacity)]",
        className,
      )}
    >
      {label ? (
        <legend className={cn("mb-1 p-0", error ? "text-error" : "text-foreground")}>
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </legend>
      ) : null}

      <RadioGroupContext.Provider value={contextValue}>
        <div className="grid gap-3">{children}</div>
      </RadioGroupContext.Provider>

      {message ? (
        <p id={messageId} className={cn("m-0 mt-1", error ? "text-error" : "text-muted-foreground")}>
          {message}
        </p>
      ) : null}
    </fieldset>
  );
}
