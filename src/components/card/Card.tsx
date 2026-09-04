import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../../utils/cn";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  image?: ReactNode;
  badges?: ReactNode;

  subtitle?: ReactNode;
  title: ReactNode;

  children?: ReactNode;
  footer?: ReactNode;
}

export function Card({
  image,
  badges,
  subtitle,
  title,
  children,
  footer,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "group/card w-full rounded-sm",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex w-full overflow-hidden rounded-sm border border-border bg-card text-card-foreground transition-[box-shadow,transform] duration-[var(--duration)] ease-[var(--easing)] group-hover/card:translate-y-[var(--transform-hover-offset)] group-hover/card:shadow-md motion-reduce:transition-none motion-reduce:group-hover/card:translate-y-0",
          "flex-col",
        )}
      >
        {image ? (
          <div
            className={cn(
              "overflow-hidden bg-muted [&>img]:size-full [&>img]:object-cover",
              "aspect-[343/206] w-full border-b border-border",
            )}
          >
            {image}
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="grid w-full gap-2 px-4 pt-4">
            {badges ? (
              <div className="flex flex-wrap items-center gap-2">{badges}</div>
            ) : null}

            {subtitle ? (
              <div className="font-sans text-base font-light leading-[160%] text-card-foreground">
                {subtitle}
              </div>
            ) : null}

            <div className="font-sans text-lg font-medium leading-[140%] text-card-foreground">
              {title}
            </div>
          </div>

          {children ? (
            <div
              className={cn(
                "w-full px-4 pb-4 pt-2 font-sans text-base font-normal leading-[160%] text-card-foreground",
                "flex-1",
              )}
            >
              {children}
            </div>
          ) : null}

          {footer ? (
            <div className="flex w-full items-center justify-end gap-2 p-4">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
