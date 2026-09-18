import arrowRightIcon from "./arrow-right.svg?raw";
import figmaIcon from "./figma.svg?raw";
import githubIcon from "./github.svg?raw";
import reactIcon from "./react.svg?raw";
import starIcon from "./star.svg?raw";
import storybookIcon from "./storybook.svg?raw";
import tailwindCssIcon from "./tailwind-css.svg?raw";
import { cn } from "../../utils/cn";

const icons = {
  "arrow-right": arrowRightIcon,
  figma: figmaIcon,
  github: githubIcon,
  react: reactIcon,
  star: starIcon,
  storybook: storybookIcon,
  "tailwind-css": tailwindCssIcon,
};

export type IconName = keyof typeof icons;

type IconProps = ({ svg: string; name?: never } | { name: IconName; svg?: never }) & {
  className?: string;
  ariaLabel?: string;
};

function normaliseSvg(svg: string) {
  return svg
    .replaceAll('fill="black"', 'fill="currentColor"')
    .replaceAll("fill='black'", "fill='currentColor'")
    .replaceAll('stroke="black"', 'stroke="currentColor"')
    .replaceAll("stroke='black'", "stroke='currentColor'");
}

export function Icon({ svg, name, className, ariaLabel }: IconProps) {
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
      dangerouslySetInnerHTML={{ __html: normaliseSvg(name ? icons[name] : svg) }}
    />
  );
}
