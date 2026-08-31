import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import checkIcon from "../../assets/icons/check.svg?raw";
import chevronDownIcon from "../../assets/icons/chevron-down.svg?raw";
import chevronUpIcon from "../../assets/icons/chevron-up.svg?raw";
import { Icon } from "../../assets/icons/Icon";
import { Menu, MenuItem } from "../menu";
import { cn } from "../../utils/cn";

export interface SelectionOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectionProps {
  options: SelectionOption[];

  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;

  label?: ReactNode;
  placeholder?: ReactNode;

  error?: boolean;
  disabled?: boolean;

  name?: string;
  required?: boolean;

  className?: string;
}

export function Selection({
  options,
  value,
  defaultValue,
  onValueChange,
  label,
  placeholder = "Select an option",
  error = false,
  disabled = false,
  name,
  required = false,
  className,
}: SelectionProps) {
  const generatedId = useId();
  const triggerId = `${generatedId}-trigger`;
  const labelId = label ? `${generatedId}-label` : undefined;
  const valueId = `${generatedId}-value`;
  const listboxId = `${generatedId}-listbox`;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [open, setOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedValue = value ?? uncontrolledValue;
  const selectedIndex = options.findIndex((option) => option.value === selectedValue);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const isControlled = value !== undefined;

  const enabledIndexes = useMemo(
    () =>
      options.flatMap((option, index) =>
        option.disabled ? [] : [index],
      ),
    [options],
  );

  function getInitialActiveIndex(direction: "first" | "last" = "first") {
    if (selectedIndex >= 0 && !options[selectedIndex]?.disabled) {
      return selectedIndex;
    }

    return direction === "last"
      ? enabledIndexes[enabledIndexes.length - 1] ?? -1
      : enabledIndexes[0] ?? -1;
  }

  function openListbox(direction: "first" | "last" = "first") {
    if (disabled || enabledIndexes.length === 0) {
      return;
    }

    setActiveIndex(getInitialActiveIndex(direction));
    setOpen(true);
  }

  function closeListbox({ focusTrigger = true } = {}) {
    setOpen(false);

    if (focusTrigger) {
      triggerRef.current?.focus();
    }
  }

  function moveActiveIndex(direction: 1 | -1) {
    if (enabledIndexes.length === 0) {
      return;
    }

    const currentPosition = enabledIndexes.indexOf(activeIndex);
    const nextPosition =
      currentPosition === -1
        ? direction === 1
          ? 0
          : enabledIndexes.length - 1
        : (currentPosition + direction + enabledIndexes.length) %
          enabledIndexes.length;

    setActiveIndex(enabledIndexes[nextPosition]);
  }

  function selectOption(index: number) {
    const option = options[index];

    if (!option || option.disabled) {
      return;
    }

    if (!isControlled) {
      setUncontrolledValue(option.value);
    }

    onValueChange?.(option.value);
    closeListbox();
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open ? closeListbox() : openListbox();
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      openListbox("first");
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      openListbox("last");
    }
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeListbox();
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActiveIndex(1);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActiveIndex(-1);
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(enabledIndexes[0] ?? -1);
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1);
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectOption(activeIndex);
    }

    if (event.key === "Tab") {
      setOpen(false);
    }
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    optionRefs.current[activeIndex]?.focus();
  }, [activeIndex, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative grid w-full gap-1 font-sans text-sm font-normal leading-[160%]",
        disabled && "opacity-[var(--disabled-opacity)]",
        className,
      )}
    >
      {label ? (
        <span
          id={labelId}
          className={error ? "text-error" : "text-foreground"}
        >
          {label}
        </span>
      ) : null}

      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-labelledby={labelId ? `${labelId} ${valueId}` : undefined}
        aria-invalid={error || undefined}
        aria-required={required || undefined}
        onClick={() => {
          if (open) {
            closeListbox({ focusTrigger: false });
          } else {
            openListbox();
          }
        }}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "flex w-full items-center gap-2 rounded-sm border bg-background p-2 text-foreground outline-none disabled:cursor-not-allowed",
          error
            ? "border-destructive-border focus-visible:shadow-destructive-focus"
            : "border-border focus-visible:shadow-focus",
          open && (error ? "shadow-destructive-focus" : "shadow-focus"),
        )}
      >
        <span
          id={valueId}
          className={cn(
            "min-w-0 flex-1 px-1 text-left",
            selectedOption ? "text-foreground" : "text-placeholder",
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="flex w-5 shrink-0 items-center justify-center p-0.5 text-foreground">
          <Icon svg={open ? chevronUpIcon : chevronDownIcon} />
        </span>
      </button>

      {name ? (
        <input
          type="hidden"
          name={name}
          value={selectedValue}
          required={required}
          disabled={disabled}
        />
      ) : null}

      {open ? (
        <Menu
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          className="absolute top-full z-50 mt-1"
        >
          {options.map((option, index) => {
            const selected = option.value === selectedValue;
            const optionId = `${generatedId}-option-${index}`;

            return (
              <MenuItem
                key={option.value}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                id={optionId}
                role="option"
                selected={selected}
                leadingDecoration={
                  selected ? <Icon svg={checkIcon} /> : undefined
                }
                disabled={option.disabled}
                aria-selected={selected}
                aria-disabled={option.disabled || undefined}
                data-disabled={option.disabled ? "true" : undefined}
                tabIndex={index === activeIndex && !option.disabled ? 0 : -1}
                onClick={() => selectOption(index)}
                onKeyDown={handleOptionKeyDown}
                onMouseEnter={() => {
                  if (!option.disabled) {
                    setActiveIndex(index);
                  }
                }}
              >
                {option.label}
              </MenuItem>
            );
          })}
        </Menu>
      ) : null}
    </div>
  );
}
