import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../../utils/cn";
import { menuClassName } from "./styles";

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Menu({ className, children, ...props }: MenuProps) {
  return (
    <div
      className={cn(menuClassName, className)}
      {...props}
    >
      {children}
    </div>
  );
}
