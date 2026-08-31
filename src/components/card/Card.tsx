import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../../utils/cn";

export type CardOrientation = "vertical" | "horizontal";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  orientation?: CardOrientation;

  image?: ReactNode;
  badges?: ReactNode;

  subtitle?: ReactNode;
  title: ReactNode;

  children?: ReactNode;
  footer?: ReactNode;
}

const orientationClasses: Record<CardOrientation, string> = {
  vertical: "flex-col",
  horizontal: "flex-row",
};

export function Card({
  orientation = "vertical",
  image,
  badges,
  subtitle,
  title,
  children,
  footer,
  className,
  ...props
}: CardProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        "flex w-full overflow-hidden rounded-sm border border-border bg-card text-card-foreground hover:shadow-md",
        orientationClasses[orientation],
        className,
      )}
      {...props}
    >
      {image ? (
        <div
          className={cn(
            "overflow-hidden bg-muted [&>img]:size-full [&>img]:object-cover",
            isHorizontal
              ? "min-h-full basis-[38.5%] shrink-0 border-r border-card-foreground"
              : "aspect-[343/206] w-full border-b border-border",
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
              "w-full px-4 pt-2 font-sans text-base font-normal leading-[160%] text-card-foreground",
              !isHorizontal && "flex-1",
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
  );
}
