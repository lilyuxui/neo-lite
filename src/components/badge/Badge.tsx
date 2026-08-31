import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../../utils/cn";

export type BadgeVariant =
  | "accent"
  | "secondary"
  | "primary"
  | "destructive";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  leadingIcon?: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  accent: "border border-border bg-accent text-foreground",
  secondary: "border border-border bg-secondary text-foreground",
  primary: "border-0 bg-primary text-primary-foreground",
  destructive: "border border-destructive-border bg-destructive text-foreground",
};

export function Badge({
  variant = "accent",
  leadingIcon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center justify-center px-2 py-1 font-sans text-xs font-normal leading-[160%] [&_svg]:shrink-0 [&_[data-neo-lite-icon]]:shrink-0 [&_[data-neo-lite-icon]]:size-4",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {leadingIcon ? (
        <span className="inline-flex size-4 shrink-0 items-center justify-center">
          {leadingIcon}
        </span>
      ) : null}
      <span className={leadingIcon ? "px-2" : undefined}>{children}</span>
    </span>
  );
}
