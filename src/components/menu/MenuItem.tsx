import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { menuItemClassName } from "./styles";

export interface MenuItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  leadingDecoration?: ReactNode;
}

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
  (
    {
      selected = false,
      leadingDecoration,
      type = "button",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={menuItemClassName({ selected, className })}
        {...props}
      >
        {leadingDecoration ? (
          <span className="flex w-5 shrink-0 items-center justify-center p-0.5 [&_svg]:size-4 [&_svg]:shrink-0">
            {leadingDecoration}
          </span>
        ) : null}
        <span className="min-w-0 flex-1">{children}</span>
      </button>
    );
  },
);

MenuItem.displayName = "MenuItem";
