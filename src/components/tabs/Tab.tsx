import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { cn } from "../../utils/cn";
import { useTabsContext } from "./Tabs";

export interface TabProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
  leadingIcon?: ReactNode;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  (
    {
      value,
      leadingIcon,
      type = "button",
      disabled = false,
      className,
      children,
      onClick,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const tabRef = useRef<HTMLButtonElement>(null);
    const {
      value: selectedValue,
      registerTab,
      unregisterTab,
      selectTab,
      moveFocus,
    } = useTabsContext();
    const selected = selectedValue === value;

    useImperativeHandle(ref, () => tabRef.current as HTMLButtonElement, []);

    useEffect(() => {
      registerTab({ value, disabled, ref: tabRef });

      return () => {
        unregisterTab(value);
      };
    }, [disabled, registerTab, unregisterTab, value]);

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
      onClick?.(event);

      if (event.defaultPrevented || disabled) {
        return;
      }

      selectTab(value);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
      onKeyDown?.(event);

      if (event.defaultPrevented || disabled) {
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveFocus(value, 1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveFocus(value, -1);
      }

      if (event.key === "Home") {
        event.preventDefault();
        moveFocus(value, "first");
      }

      if (event.key === "End") {
        event.preventDefault();
        moveFocus(value, "last");
      }
    }

    return (
      <button
        ref={tabRef}
        type={type}
        role="tab"
        aria-selected={selected}
        disabled={disabled}
        tabIndex={selected ? 0 : -1}
        className={cn(
          "inline-flex items-center justify-center gap-1 rounded-sm p-2 font-sans text-sm font-normal leading-[160%] outline-none focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-[var(--disabled-opacity)] [&_svg]:shrink-0 [&_[data-neo-lite-icon]]:shrink-0",
          selected
            ? "bg-selected text-selected-foreground"
            : "bg-background text-foreground hover:bg-hover",
          className,
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {leadingIcon ? (
          <span className="inline-flex size-5 shrink-0 items-center justify-center [&_svg]:size-5 [&_[data-neo-lite-icon]]:size-5">
            {leadingIcon}
          </span>
        ) : null}
        {children}
      </button>
    );
  },
);

Tab.displayName = "Tab";
