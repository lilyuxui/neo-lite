import { useEffect, useState, type ReactNode } from "react";

import heroImage from "../../assets/overview/hero.png";
import { Icon } from "../../assets/icons/Icon";
import { Button } from "../../components/button";
import { FIGMA_COMMUNITY_URL, STORYBOOK_PATH } from "../../constants/links";
import { cn } from "../../utils/cn";
import { Footer, Header } from "../home/HomePage";

type TableRow = { cells: ReactNode[] };

const colourRoles = [
  { name: "neutral", colour: "var(--neutral-950)", usage: "Use across text, backgrounds, borders, surfaces and selected states." },
  { name: "brand", colour: "var(--purple-700)", usage: "Neo-Lite’s main accent colour. It’s used for emphasis, hover treatments and focus." },
  { name: "information", colour: "var(--blue-700)", usage: "Use for informative UI to provide informational feedback." },
  { name: "success", colour: "var(--green-700)", usage: "Use to communicate successful or positive outcomes." },
  { name: "yellow", colour: "var(--yellow-700)", usage: "Use when something needs attention without being destructive or blocking." },
  { name: "error", colour: "var(--red-600)", usage: "Use to communicate destructive actions, errors and other states that need immediate attention." },
];

const interfaceColours = [
  ["--neutral-0", "--background", "Main page and interface background"],
  ["--neutral-950", "--foreground", "Default text and icon colour"],
  ["--neutral-0", "--card", "Card and contained surface backgrounds"],
  ["--neutral-950", "--card-foreground", "Content placed on card surfaces"],
  ["--neutral-100", "--muted", "Subtle background areas"],
  ["--neutral-400", "--muted-foreground", "Lower-emphasis supporting content"],
  ["--neutral-500", "--placeholder", "Placeholder and low-emphasis input content"],
  ["--neutral-950", "--border", "Default component and surface borders"],
];

const spacingCore = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48];
const radiusScale = [
  { value: "4px", variable: "--radius-sm", radius: "var(--radius-sm)" },
  { value: "8px", variable: "--radius-md", radius: "var(--radius-md)" },
  { value: "10px", variable: "--radius-lg", radius: "var(--radius-lg)" },
  { value: "24px", variable: "--radius-xl", radius: "var(--radius-xl)" },
  { value: "9999px", variable: "--radius-full", radius: "var(--radius-full)" },
];

function PageBand({ children, id, className }: { children: ReactNode; id?: string; className?: string }) {
  return (
    <section id={id} className="w-full border-x border-b border-border px-4 sm:px-8 lg:px-6">
      <div className={cn("mx-auto w-full min-w-0 max-w-[1360px] border-x border-border", className)}>
        {children}
      </div>
    </section>
  );
}

function SectionHeading({ label, title, children }: { label: string; title: string; children?: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-4 px-6 text-[#0f172a]">
      <p className="text-sm leading-[1.6] text-[#5b5cce]">{label}</p>
      <h2 className="text-2xl leading-[1.25] lg:text-[32px] lg:leading-[1.15]">{title}</h2>
      {children ? <p className="text-base leading-[1.6]">{children}</p> : null}
    </div>
  );
}

function FoundationSection({ label, title, children, id, className }: { label: string; title: string; children: ReactNode; id: string; className?: string }) {
  return (
    <PageBand id={id} className={cn("flex flex-col gap-6 pt-10 lg:gap-12 lg:pb-10 lg:pt-20", className)}>
      <SectionHeading label={label} title={title}>
        {id === "colour" ? "Neutrals make up most of the interface, purple adds emphasis and focus, while blue, green, yellow and red communicate different types of feedback." : undefined}
      </SectionHeading>
      <div className="min-w-0 px-4 sm:px-6 lg:px-6">
        <div className="flex min-w-0 flex-col gap-6 border-t border-border py-8 lg:p-8">{children}</div>
      </div>
    </PageBand>
  );
}

function CopyBlock({ title, children, small = false }: { title: string; children: ReactNode; small?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      {small ? <h4 className="text-lg font-medium leading-[1.4] text-[#0f172a]">{title}</h4> : <h3 className="text-xl font-bold leading-[1.4] text-[#0f172a]">{title}</h3>}
      <div className="flex flex-col gap-2 text-sm leading-[1.6]">{children}</div>
    </div>
  );
}

function DataTable({ headings, rows, columns, columnClasses, centerRows = false }: { headings: string[]; rows: TableRow[]; columns?: string; columnClasses?: string[]; centerRows?: boolean }) {
  return (
    <div className="min-w-0 bg-[var(--neutral-50)] p-1 sm:p-4">
      <table className="w-full table-fixed border-separate border-spacing-x-0 border-spacing-y-2 text-left text-sm leading-[1.6]">
        <colgroup>
          {headings.map((heading, index) => <col key={heading} className={columnClasses?.[index]} style={columns ? { width: columns.split(" ")[index] } : undefined} />)}
        </colgroup>
        <thead>
          <tr>{headings.map((heading) => <th key={heading} scope="col" className="border-b border-[var(--neutral-300)] pb-1 pr-1 align-bottom text-sm font-normal leading-[1.4] sm:text-base">{heading}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>{row.cells.map((cell, cellIndex) => <td key={cellIndex} className={cn("break-words pr-1 [overflow-wrap:anywhere]", centerRows ? "align-middle" : "align-top")}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Swatch({ colour, label }: { colour: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className="size-5 shrink-0 border border-[var(--neutral-300)]" style={{ background: colour }} />
      <span>{label}</span>
    </span>
  );
}

function Colour() {
  return (
    <FoundationSection id="colour" label="COLOUR" title="Neo-Lite keeps colour simple and purposeful.">
      <CopyBlock title="Colour system">
        <p>Neo-Lite uses two levels of colour tokens: primitive colours and semantic colour roles.</p>
        <p><strong>Primitive colours tokens</strong> are the raw values in the palette. They provide the foundation for the colour system, but components should generally use semantic tokens rather than referencing primitive colours directly.</p>
        <p><strong>Semantic colour tokens</strong> describe how a colour is used rather than what the colour looks like. This keeps colour usage consistent and means components don&apos;t need to know which primitive colour represents a particular role.</p>
      </CopyBlock>
      <div className="flex flex-col gap-2">
        <CopyBlock title="Colour roles" small>
          <p>Colour roles describe the intention behind the color. For example, color roles are applied to buttons to differentiate between primary, secondary, warning, or dangerous actions.</p>
        </CopyBlock>
        <DataTable headings={["Roles", "Usage"]} columns="35% 65%" rows={colourRoles.map(({ name, colour, usage }) => ({ cells: [<Swatch colour={colour} label={name} />, usage] }))} />
      </div>
      <div className="flex flex-col gap-2">
        <CopyBlock title="Interfaces" small><p>Basic colours used for interface surfaces, text and borders.</p></CopyBlock>
        <DataTable headings={["Colour", "Variable", "Usage"]} columns="31% 34% 35%" rows={interfaceColours.map(([colour, variable, usage]) => ({ cells: [<Swatch colour={`var(${colour})`} label={colour} />, variable, usage] }))} />
        <p className="text-sm leading-[1.6]">Neutrals should remain the default choice. Accent and status colours are most useful when they stand out from an otherwise neutral interface.</p>
      </div>
      <div className="flex flex-col gap-6">
        <CopyBlock title="Interaction states" small>
          <p><strong>Hover</strong> provides a subtle visual response when an interactive element is hovered.</p>
        </CopyBlock>
        <DataTable headings={["Colour", "Variable", "Usage"]} columns="31% 34% 35%" rows={[{ cells: [<Swatch colour="var(--purple-100)" label="--purple-100" />, "--hover", "Hover backgrounds where the component calls for a highlighted surface."] }]} />
        <p className="text-sm leading-[1.6]"><strong>Selected</strong> makes the current or chosen option easy to recognise.</p>
        <DataTable headings={["Colour", "Variable", "Usage"]} columns="31% 34% 35%" rows={[
          { cells: [<Swatch colour="var(--neutral-950)" label="--neutral-950" />, "--selected", "Selected backgrounds"] },
          { cells: [<Swatch colour="var(--neutral-0)" label="--neutral-0" />, "--selected-foreground", "Text and icon colour in selected backgrounds"] },
        ]} />
        <p className="text-sm leading-[1.6]"><strong>Focus</strong> uses Neo-Lite&apos;s stronger purple to make keyboard focus clear against the surrounding interface.</p>
        <DataTable headings={["Colour", "Variable", "Usage"]} columns="31% 34% 35%" rows={[{ cells: [<Swatch colour="var(--purple-700)" label="--purple-700" />, "--focus-ring", "Keyboard focus indicators across interactive components."] }]} />
      </div>
    </FoundationSection>
  );
}

function SpacingRows({ values }: { values: number[] }) {
  return <DataTable headings={["Value", "Variable", "Visual representation"]} columns="28% 34% 38%" rows={values.map((value) => ({ cells: [`${value}px`, `--spacing-${value === 2 ? "0-5" : value / 4}`, <span aria-label={`${value} pixel spacing`} className="block h-5 max-w-full bg-[var(--purple-700)]" style={{ width: value }} />] }))} />;
}

function Spacing() {
  return (
    <FoundationSection id="spacing" label="SPACING" title="A simple rhythm, from small details to page layouts.">
      <CopyBlock title="Spacing"><p>Neo-Lite uses a 4px spacing rhythm for most components and layouts, with a 2px value for finer details and larger values for more generous page-level spacing.</p></CopyBlock>
      <div className="flex flex-col gap-2">
        <CopyBlock title="Spacing scale" small><p>For small adjustments where the core 4px rhythm is more space than you need.</p></CopyBlock>
        <SpacingRows values={[2]} />
        <p className="text-sm leading-[1.6]">The core scale covers most spacing inside components and between related elements.</p>
        <SpacingRows values={spacingCore} />
        <p className="text-sm leading-[1.6]">Layout - for larger values create more breathing room between page sections and major group of content.</p>
        <SpacingRows values={[64, 80]} />
      </div>
    </FoundationSection>
  );
}

function Radius() {
  return (
    <FoundationSection id="radius" label="RADIUS" title="A little softness, without losing the structure.">
      <CopyBlock title="Radius scale">
        <p>Neo-Lite uses a small radius scale to soften edges while keeping the strong, structured feel of the system.</p>
        <p>Smaller radii appear across most components, while larger values are reserved for elements that intentionally need a softer or fully rounded shape.</p>
      </CopyBlock>
      <DataTable headings={["Value", "Variable", "Visual representation"]} columnClasses={["w-[28%] lg:w-[200px]", "w-[34%] lg:w-[200px]", "w-[38%] lg:w-auto"]} centerRows rows={radiusScale.map(({ value, variable, radius }) => ({ cells: [value, variable, <span aria-label={`${value} radius`} className="block size-[60px] border border-border bg-white" style={{ borderRadius: radius }} />] }))} />
    </FoundationSection>
  );
}

function Effects() {
  return (
    <FoundationSection id="effects" label="EFFECTS" title="Hard shadows add depth and character.">
      <CopyBlock title="Shadows"><p>Neo-Lite uses hard, offset shadows with no blur. They&apos;re one of the more distinctive parts of the visual language, adding depth while keeping the interface graphic and structured.</p></CopyBlock>
      <div className="flex flex-col gap-2">
        <CopyBlock title="Shadow 1" small><p>A smaller shadow used for interactive moments and lighter emphasis.</p></CopyBlock>
        <DataTable headings={["Value", "Variable", "Usage"]} columns="34% 30% 36%" rows={[{ cells: ["3px 3px 0 0 var(--shadow-color)", "--shadow-1", "Interactive states such as Button hover"] }]} />
      </div>
      <div className="flex flex-col gap-2">
        <CopyBlock title="Shadow 2" small><p>A stronger shadow used when an element needs more separation from its surroundings.</p></CopyBlock>
        <DataTable headings={["Value", "Variable", "Usage"]} columns="34% 30% 36%" rows={[{ cells: ["4px 4px 0 0 var(--shadow-color)", "--shadow-2", "More prominent surfaces such as Cards and Dialogs"] }]} />
      </div>
    </FoundationSection>
  );
}

function Motion() {
  return (
    <FoundationSection id="motion" label="MOTION" title="Quick, subtle and purposeful.">
      <CopyBlock title="Motion"><p>Neo-Lite uses quick, subtle motion to clarify interactions without distracting from the content.</p></CopyBlock>
      <DataTable headings={["Value", "Variable"]} columns="40% 60%" rows={[
        { cells: ["150ms", "--duration"] },
        { cells: ["ease-out", "--easing"] },
        { cells: ["-4px", "--transform-hover-offset"] },
      ]} />
      <div className="flex flex-col gap-2">
        <CopyBlock title="Motion in action" small><p>Button hover is the clearest expression of Neo-Lite&apos;s motion language. The Button moves upward by 4px over 150ms while its hard shadow appears underneath.</p></CopyBlock>
        <p className="text-sm leading-[1.6]"><strong>Hover:</strong> translateY(-4px) + Shadow 1<br /><strong>Transition:</strong> 150ms · ease-out</p>
      </div>
    </FoundationSection>
  );
}

function Explore() {
  return (
    <PageBand className="flex flex-col items-center gap-6 px-4 pb-[60px] pt-10 sm:px-6 lg:gap-12 lg:px-6 lg:pb-[120px] lg:pt-20">
      <div className="text-center"><SectionHeading label="EXPLORE" title="Fully documented open resources." /></div>
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          variant="secondary"
          size="xs"
          leadingIcon={<Icon name="storybook" />}
          onClick={() => window.location.assign(STORYBOOK_PATH)}
        >
          Playground
        </Button>
        <Button
          variant="accent"
          size="xs"
          leadingIcon={<Icon name="figma" />}
          onClick={() => window.open(FIGMA_COMMUNITY_URL, "_blank", "noopener,noreferrer")}
        >
          Figma
        </Button>
        <Button variant="primary" size="xs" leadingIcon={<Icon name="github" />}>Github</Button>
      </div>
    </PageBand>
  );
}

export function OverviewPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    const closeOnDesktop = () => { if (window.innerWidth >= 1024) setMenuOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background font-sans text-foreground">
      <Header currentPage="overview" menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((open) => !open)} onCloseMenu={() => setMenuOpen(false)} />
      <main inert={menuOpen} aria-hidden={menuOpen || undefined}>
        <PageBand className="flex flex-col items-center gap-8 px-6 pb-10 pt-6 sm:px-10 sm:pt-10 lg:flex-row lg:justify-between lg:px-12 lg:pb-40 lg:pt-20">
          <div className="flex min-w-0 flex-col gap-8 lg:max-w-[640px] lg:pr-12">
            <h1 className="text-[40px] font-bold leading-[1.12] lg:text-[56px]">Overview</h1>
            <p className="text-lg font-medium leading-[1.4] lg:text-2xl lg:font-normal lg:leading-[1.25]">Neo-Lite is built around a small set of shared foundations include colour, typography, spacing, radius, effects and motion to give every component the same visual rhythm and personality.</p>
          </div>
          <img src={heroImage} alt="Neo-Lite foundation shapes" className="h-auto w-full max-w-[348px] object-contain lg:max-w-[456px]" />
        </PageBand>
        <Colour />
        <Spacing />
        <Radius />
        <Effects />
        <Motion />
        <Explore />
      </main>
      <div inert={menuOpen} aria-hidden={menuOpen || undefined}><Footer /></div>
    </div>
  );
}
