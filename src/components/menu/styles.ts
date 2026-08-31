import { cn } from "../../utils/cn";

export const menuClassName =
  "w-full rounded-sm border border-border bg-background p-2 shadow-sm";

export function menuItemClassName({
  selected = false,
  className,
}: {
  selected?: boolean;
  className?: string;
}) {
  return cn(
    "flex min-h-9 w-full items-center gap-2 rounded-sm px-3 py-2 text-left font-sans text-sm font-normal leading-[160%] outline-none focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-[var(--disabled-opacity)] data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-[var(--disabled-opacity)]",
    selected
      ? "bg-selected text-selected-foreground"
      : "bg-background text-foreground hover:bg-hover data-[disabled=true]:hover:bg-background",
    className,
  );
}
