import { cn } from "../../utils/cn";

export interface IconProps {
  svg: string;
  className?: string;
  ariaLabel?: string;
}

function normaliseSvg(svg: string) {
  return svg
    .replaceAll('fill="black"', 'fill="currentColor"')
    .replaceAll("fill='black'", "fill='currentColor'")
    .replaceAll('stroke="black"', 'stroke="currentColor"')
    .replaceAll("stroke='black'", "stroke='currentColor'");
}

export function Icon({ svg, className, ariaLabel }: IconProps) {
  return (
    <span
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      data-neo-lite-icon
      role={ariaLabel ? "img" : undefined}
      className={cn(
        "inline-block size-4 shrink-0 text-current [&_svg]:block [&_svg]:size-full",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: normaliseSvg(svg) }}
    />
  );
}
