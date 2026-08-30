import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../../utils/cn";

export type ButtonVariant = "accent" | "primary" | "secondary" | "destructive";
export type ButtonSize = "xs" | "sm" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  accent:
    "bg-accent text-accent-foreground border-border focus-visible:shadow-focus",
  primary:
    "bg-primary text-primary-foreground border-border hover:bg-primary-hover focus-visible:shadow-focus",
  secondary:
    "bg-secondary text-secondary-foreground border-border focus-visible:shadow-focus",
  destructive:
    "bg-destructive text-destructive-foreground border-destructive-border focus-visible:shadow-destructive-focus",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "h-[var(--button-height-xs)] px-2 gap-1 rounded-sm text-sm [&:has(>svg:only-child)]:w-[var(--button-height-xs)]",
  sm: "h-[var(--button-height-sm)] px-3 gap-2 rounded-sm text-base [&:has(>svg:only-child)]:w-[var(--button-height-sm)]",
  lg: "h-[var(--button-height-lg)] px-4 gap-3 rounded-sm text-xl [&:has(>svg:only-child)]:w-[var(--button-height-lg)]",
};

const iconClasses: Record<ButtonSize, string> = {
  xs: "size-5",
  sm: "size-6",
  lg: "size-6",
};

const iconSvgClasses: Record<ButtonSize, string> = {
  xs: "[&_svg]:size-5",
  sm: "[&_svg]:size-6",
  lg: "[&_svg]:size-6",
};

export function Button({
  variant = "accent",
  size = "xs",
  type = "button",
  leadingIcon,
  trailingIcon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center border font-sans font-normal leading-none transition-[background-color,box-shadow,transform] duration-[var(--duration)] ease-[var(--easing)] hover:translate-y-[var(--transform-hover-offset)] hover:shadow-md focus-visible:outline-none disabled:pointer-events-none disabled:opacity-[var(--disabled-opacity)] [&_svg]:shrink-0",
        sizeClasses[size],
        iconSvgClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {leadingIcon ? (
        <span
          aria-hidden="true"
          className={cn("inline-flex items-center justify-center", iconClasses[size])}
        >
          {leadingIcon}
        </span>
      ) : null}
      {children}
      {trailingIcon ? (
        <span
          aria-hidden="true"
          className={cn("inline-flex items-center justify-center", iconClasses[size])}
        >
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
}
