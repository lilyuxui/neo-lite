import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../../utils/cn";

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Menu({ className, children, ...props }: MenuProps) {
  return (
    <div
      className={cn(
        "w-full rounded-sm border border-border bg-background p-2 shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
