import type { ButtonHTMLAttributes } from "react";

import { cn } from "../../utils/cn";

export interface MenuItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export function MenuItem({
  selected = false,
  type = "button",
  className,
  children,
  ...props
}: MenuItemProps) {
  return (
    <button
      type={type}
      className={cn(
        "flex min-h-9 w-full items-center gap-3 rounded-sm px-3 py-2 text-left font-sans text-sm font-normal leading-[160%] outline-none focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-[var(--disabled-opacity)]",
        selected
          ? "bg-selected text-selected-foreground"
          : "bg-background text-foreground hover:bg-hover",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
