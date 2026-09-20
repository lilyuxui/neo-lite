import { useEffect, useState, type ReactNode } from "react";

import heroImage from "../../assets/home/hero.png";
import brandLogo from "../../assets/home/brand.svg";
import buildRefineIcon from "../../assets/home/build-refine.svg";
import foundationColours from "../../assets/home/foundation-colours.svg";
import foundationShadow from "../../assets/home/foundation-shadow.svg";
import foundationSpacing from "../../assets/home/foundation-spacing.svg";
import foundationTypography from "../../assets/home/foundation-typography.svg";
import logoIcon from "../../assets/home/logo-icon.svg";
import menuIcon from "../../assets/home/menu.svg?raw";
import chevronDownIcon from "../../assets/icons/chevron-down.svg?raw";
import xIcon from "../../assets/icons/x.svg?raw";
import { Icon, type IconName } from "../../assets/icons/Icon";
import verticalCardImage from "../../assets/images/image_vertical_card.png";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Checkbox } from "../../components/checkbox";
import { Input } from "../../components/input";
import { FIGMA_COMMUNITY_URL } from "../../constants/links";
import { cn } from "../../utils/cn";

type IconImageProps = {
  src: string;
  alt?: string;
  className?: string;
};

const whyCards = [
  {
    title: "Distinctive",
    body: "Bold borders, hard shadows, expressive type and pops of colour give Neo-Lite its own look — without making everything compete for attention.",
    className: "bg-muted",
  },
  {
    title: "Consistent",
    body: "A small set of shared tokens and patterns keeps things predictable. Components look and behave like they belong together, without needing lots of one-off styling.",
    className: "bg-background",
  },
  {
    title: "Made for built",
    body: "Design and implementation are considered together, so the ideas behind each component carry through into the React build.",
    className: "bg-[#f6f6ff]",
  },
];

const foundationCards = [
  {
    title: "Colour",
    body: "A mostly neutral palette, with purple for emphasis and focus, and red for destructive and error states.",
    visual: <IconImage src={foundationColours} className="h-[70px] w-[71px]" />,
    className: "bg-muted",
  },
  {
    title: "Typography",
    body: "Playfair Display adds character where it matters, while Nokora keeps everyday interface text clear and easy to read.",
    visual: <IconImage src={foundationTypography} className="h-[58px] w-[91px]" />,
    className: "bg-background",
  },
  {
    title: "Shadow",
    body: "Hard, offset shadows are one of Neo-Lite's defining details — used selectively to add depth and make interactions feel more expressive.",
    visual: <IconImage src={foundationShadow} className="size-[76px]" />,
    className: "bg-background",
  },
  {
    title: "Spacing",
    body: "A simple size scale keeps layout rhythm balanced and components consistent.",
    visual: <IconImage src={foundationSpacing} className="h-[40px] w-[80px]" />,
    className: "bg-[#f6f6ff]",
  },
];

const processCards = [
  {
    title: "Foundations → Figma",
    subtitle: "Design with intent",
    body: "Components are designed around real states, behaviours and use cases, not just how they look.",
    visual: <GeometricLogomark />,
    className: "bg-[#f6f6ff]",
  },
  {
    title: "Figma → Spec → React API",
    subtitle: "Define before building",
    body: "Each component gets a clear spec and React API before implementation, helping design decisions translate cleanly into code.",
    visual: <SpecGridIcon />,
    className: "bg-background",
  },
  {
    title: "Build → Storybook → Refine",
    subtitle: "Build, test and refine",
    body: "Storybook provides a place to test real interactions, review the details and keep improving the components.",
    visual: <IconImage src={buildRefineIcon} className="size-[72px]" />,
    className: "bg-muted",
  },
];

function IconImage({ src, alt = "", className }: IconImageProps) {
  return <img src={src} alt={alt} className={cn("block shrink-0", className)} />;
}

function Badge({
  children,
  icon,
  variant = "secondary",
}: {
  children: string;
  icon: IconName;
  variant?: "primary" | "secondary";
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center border border-border px-2 py-1 font-sans text-xs leading-[1.6]",
        variant === "primary"
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground",
      )}
    >
      <Icon name={icon} className="size-4" />
      <span className="px-2 uppercase">{children}</span>
    </span>
  );
}

function Section({
  label,
  title,
  centered = false,
}: {
  label: string;
  title: string;
  centered?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 px-6 font-sans",
        centered ? "items-center text-center" : "items-start",
      )}
    >
      <p className="text-sm leading-[1.6] text-[#5b5cce]">{label}</p>
      <h2 className="max-w-[760px] text-2xl leading-[1.25] text-[#0f172a] lg:text-[32px] lg:leading-[1.15]">
        {title}
      </h2>
    </div>
  );
}

function PageBand({
  id,
  children,
  className,
  containerClassName,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section id={id} className={cn("w-full border-x border-b border-border px-4 sm:px-8 lg:px-6", className)}>
      <div
        className={cn(
          "mx-auto w-full min-w-0 max-w-[1360px] border-x border-border",
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

function MobileMenu({ onNavigate, currentPage }: { onNavigate: () => void; currentPage: "home" | "overview" | "components" }) {
  const [componentsExpanded, setComponentsExpanded] = useState(true);

  return (
    <nav
      id="mobile-navigation"
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 top-[70px] z-40 overflow-y-auto border-x border-b border-border bg-muted px-8 py-12 sm:top-[78px] lg:hidden"
    >
      <div className="flex flex-col items-start gap-6">
        <a href="/" onClick={onNavigate} className={cn("text-lg font-medium leading-[1.4]", currentPage === "home" && "text-[#5b5cce]")}>
          Home
        </a>
        <a href="/overview" onClick={onNavigate} className={cn("text-lg font-medium leading-[1.4]", currentPage === "overview" && "text-[#5b5cce]")}>
          Overview
        </a>
        <div className="flex items-center gap-2">
          <a href="/components/badge" onClick={onNavigate} className={cn("text-lg font-medium leading-[1.4]", currentPage === "components" && "text-[#5b5cce]")}>Components</a>
        <button
          type="button"
          aria-label={componentsExpanded ? "Collapse component links" : "Expand component links"}
          aria-expanded={componentsExpanded}
          aria-controls="mobile-component-links"
          onClick={() => setComponentsExpanded((expanded) => !expanded)}
          className="inline-flex items-center text-lg font-medium leading-[1.4]"
        >
          <Icon
            svg={chevronDownIcon}
            className={cn("size-6 transition-transform", !componentsExpanded && "-rotate-90")}
          />
        </button>
        </div>
        {componentsExpanded ? (
          <ul id="mobile-component-links" className="flex flex-col gap-2 text-sm leading-[1.6]">
            {["Badge", "Button", "Card", "Checkbox", "Dialog", "Input", "Selection", "Tabs"].map((name) => (
              <li key={name}><a href={`/components/${name.toLowerCase()}`} onClick={onNavigate}>{name}</a></li>
            ))}
          </ul>
        ) : null}
      </div>
    </nav>
  );
}

export function Header({
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  currentPage = "home",
}: {
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  currentPage?: "home" | "overview" | "components";
}) {
  return (
    <header className="relative z-50 w-full border border-border bg-background px-4 sm:px-8 lg:px-6">
      <div className="mx-auto flex w-full max-w-[1360px] items-center justify-between border-x border-border p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2">
          <a href="/" aria-label="Neo-Lite home"><IconImage src={logoIcon} alt="" className="size-9 lg:size-12" /></a>
          <IconImage src={brandLogo} alt="Neo-Lite" className="hidden h-[22px] w-[108px] lg:block" />
        </div>
        <nav className="flex items-center gap-2 text-base leading-[1.6] sm:gap-6 lg:gap-9">
          <a href="/overview" onClick={onCloseMenu} aria-current={currentPage === "overview" ? "page" : undefined} className={currentPage === "overview" ? "text-[#5b5cce]" : "text-foreground"}>
            Overview
          </a>
          <a href="/components/badge" onClick={onCloseMenu} aria-current={currentPage === "components" ? "page" : undefined} className={currentPage === "components" ? "text-[#5b5cce]" : "text-foreground"}>
            Components
          </a>
        </nav>
        <div className="lg:hidden">
          <Button
            variant="primary"
            size="xs"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={onToggleMenu}
            className="[&>span]:h-9 [&>span]:w-9 [&>span]:px-0"
          >
            <Icon svg={menuOpen ? xIcon : menuIcon} className="size-5" />
          </Button>
        </div>
        <div className="hidden lg:block">
          <Button
            variant="primary"
            size="xs"
            leadingIcon={<Icon name="github" className="size-5" />}
          >
            Github
          </Button>
        </div>
      </div>
      {menuOpen ? <MobileMenu onNavigate={onCloseMenu} currentPage={currentPage} /> : null}
    </header>
  );
}

function Hero() {
  return (
    <PageBand
      containerClassName="bg-[#f6f6ff] px-6 py-6 sm:px-10 sm:py-10 lg:flex lg:items-center lg:justify-between lg:px-12 lg:pb-40 lg:pt-20"
    >
      <div className="flex w-full flex-col gap-8 lg:max-w-[640px] lg:pr-12">
        <div className="flex flex-col items-start gap-3 lg:flex-row">
          <Badge icon="star" variant="primary">
            Light neo-brutalism
          </Badge>
          <Badge icon="tailwind-css">Tailwind-CSS</Badge>
        </div>
        <div className="flex flex-col gap-8">
          <h1 className="text-[40px] font-bold leading-[1.12] text-foreground lg:text-[56px]">
            Neo-Lite UI
          </h1>
          <p className="max-w-[560px] text-lg font-medium leading-[1.4] text-foreground lg:text-2xl lg:font-normal lg:leading-[1.25]">
            A lightweight neo-brutalist React component library for sharp product
            interfaces, documentation pages, and reusable design-system examples.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="secondary"
              size="xs"
              className="lg:[&>span]:h-[50px] lg:[&>span]:px-3 lg:[&>span]:text-base"
              leadingIcon={<Icon name="storybook" />}
              trailingIcon={<Icon name="arrow-right" />}
            >
              Playground
            </Button>
            <Button
              variant="primary"
              size="xs"
              onClick={() => window.open(FIGMA_COMMUNITY_URL, "_blank", "noopener,noreferrer")}
              className="lg:[&>span]:h-[50px] lg:[&>span]:px-3 lg:[&>span]:text-base"
              leadingIcon={<Icon name="figma" />}
              trailingIcon={<Icon name="arrow-right" />}
            >
              Figma
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 h-[273px] w-[min(100%,285px)] overflow-hidden sm:h-[360px] sm:w-[376px] lg:mt-0 lg:h-[508px] lg:w-[529px]">
        <img src={heroImage} alt="" className="size-full object-contain" />
      </div>
    </PageBand>
  );
}

function WhyNeoLite() {
  return (
    <PageBand id="overview" containerClassName="pt-10 lg:pt-20">
      <div className="flex flex-col gap-6 lg:gap-12">
        <Section
          label="WHY NEO-LITE"
          title="Combines bold character of net-brutalism and light colour theme"
        />
        <div className="grid grid-cols-1 border-t border-border lg:grid-cols-3">
          {whyCards.map((card, index) => (
            <article
              key={card.title}
              className={cn(
                "min-h-[170px] border-border p-8 lg:min-h-[200px]",
                index < whyCards.length - 1 && "border-b lg:border-b-0 lg:border-r",
                card.className,
              )}
            >
              <h3 className="text-lg font-medium leading-[1.4] text-[#0f172a]">{card.title}</h3>
              <p className="mt-2 text-sm leading-[1.6] text-foreground">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </PageBand>
  );
}

function Foundations() {
  return (
    <PageBand containerClassName="py-10 lg:py-20">
      <div className="flex flex-col gap-6 lg:gap-12">
        <Section label="FOUNDATIONS" title="A set of tokens that shape the whole system" />
        <div className="mx-4 grid grid-cols-1 border-t border-l border-border sm:mx-6 lg:grid-cols-2">
          {foundationCards.map((card) => (
            <article
              key={card.title}
              className={cn(
                "flex min-h-[184px] flex-col items-start gap-6 border-r border-b border-border p-6 sm:flex-row sm:items-center sm:p-8",
                card.className,
              )}
            >
              <div className="flex w-[92px] shrink-0 justify-start sm:justify-center">{card.visual}</div>
              <div className="min-w-0">
                <h3 className="text-lg font-medium leading-[1.4] text-[#0f172a]">{card.title}</h3>
                <p className="mt-2 text-sm leading-[1.6] text-foreground">{card.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PageBand>
  );
}

function DecorationGrid() {
  return (
    <div aria-hidden="true" className="hidden w-full border-x border-b border-border px-6 lg:block">
      <div className="mx-auto h-6 w-full max-w-[1360px] border-x border-border" />
    </div>
  );
}

function ComponentsHeader() {
  return (
    <PageBand
      id="components"
      containerClassName="pb-6 pt-10 lg:pb-10 lg:pt-20"
    >
      <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="w-full min-w-0 lg:flex-1">
          <Section label="COMPONENTS" title="Tailwind-based Components" />
        </div>
        <div className="shrink-0 px-6 lg:pb-1">
          <Button
            variant="accent"
            size="xs"
            className="[&>span]:whitespace-nowrap"
            onClick={() => window.location.assign("/components/badge")}
            trailingIcon={<Icon name="arrow-right" className="size-5" />}
          >
            Browse components
          </Button>
        </div>
      </div>
    </PageBand>
  );
}

function ComponentsPreview() {
  return (
    <PageBand containerClassName="px-4 pb-0.5 pt-6 sm:px-6">
      <div className="flex min-h-[420px] items-center justify-center bg-neutral-50 p-6 sm:min-h-[520px] lg:min-h-[600px]">
        <DemoCard />
      </div>
    </PageBand>
  );
}

function DemoCard() {
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="w-full max-w-[336px] lg:max-w-[470px]"
      onChange={() => setSaved(false)}
      onReset={() => setSaved(false)}
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      <Card
        image={<img src={verticalCardImage} alt="" />}
        title="Enter your details"
        footer={
          <div className="flex w-full gap-2">
            <Button type="reset" variant="secondary" size="xs" className="flex-1 [&>span]:w-full">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="xs" className="flex-1 [&>span]:w-full">
              <span aria-live="polite">{saved ? "Saved" : "Save"}</span>
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-[1.6]">
            Make changes to your profile here. Click save when you're done.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            <Input name="firstName" label="First name" placeholder="Enter your first name" autoComplete="given-name" />
            <Input name="lastName" label="Last name" placeholder="Enter your last name" autoComplete="family-name" />
          </div>
          <Input name="email" type="email" label="Email" placeholder="Enter your email" autoComplete="email" />
          <label className="flex items-center gap-2.5 py-2 text-sm leading-[1.6]">
            <Checkbox name="marketing" />
            <span>Yes, I would like to receive marketing communications.</span>
          </label>
        </div>
      </Card>
    </form>
  );
}

function DesignToCode() {
  return (
    <PageBand containerClassName="py-10 lg:py-20">
      <div className="flex flex-col gap-6 lg:gap-12">
        <Section
          label="FROM DESIGN TO CODE"
          title="Neo-Lite treats design and code as parts of the same process"
        />
        <div className="mx-4 flex flex-col border-t border-l border-border sm:mx-6">
          {processCards.map((card) => (
            <article
              key={card.title}
              className={cn(
                "flex flex-col items-start gap-4 border-r border-b border-border p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8",
                card.className,
              )}
            >
              <div className="flex size-[72px] shrink-0 items-center justify-center">{card.visual}</div>
              <div className="min-w-0">
                <h3 className="text-xl font-bold leading-[1.4] text-foreground">{card.title}</h3>
                <p className="text-lg font-medium leading-[1.4] text-[#0f172a]">{card.subtitle}</p>
                <p className="mt-2 text-sm leading-[1.6] text-foreground">{card.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PageBand>
  );
}

function Resources() {
  return (
    <PageBand containerClassName="px-4 pb-[60px] pt-10 lg:px-6 lg:pb-[120px] lg:pt-20">
      <div className="flex flex-col items-center gap-6 lg:gap-12">
        <Section label="EXPLORE" title="Fully documented open resources." centered />
        <div className="flex flex-wrap justify-center gap-4 lg:gap-4">
          <Button variant="secondary" size="xs" leadingIcon={<Icon name="storybook" />}>
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
          <Button variant="primary" size="xs" leadingIcon={<Icon name="github" />}>
            Github
          </Button>
        </div>
      </div>
    </PageBand>
  );
}

export function Footer() {
  return (
    <footer className="w-full border-x border-b border-border px-4 sm:px-8 lg:px-6">
      <div className="mx-auto flex min-h-[74px] w-full max-w-[1360px] items-center justify-center border-x border-border p-6">
        <div className="flex w-full min-w-0 items-center justify-center gap-6">
          <div className="flex shrink-0 items-center gap-2">
            <IconImage src={logoIcon} alt="" className="size-6" />
            <p className="text-base font-bold leading-[1.4] text-foreground">Neo-Lite</p>
          </div>
          <p className="min-w-0 text-center text-sm leading-[1.6] text-foreground">
            2026 @ Design and build by Lily Yang
          </p>
        </div>
      </div>
    </footer>
  );
}

function GeometricLogomark() {
  return (
    <div className="relative h-[73px] w-[72px]">
      <span className="absolute left-[7px] top-[13px] h-[54px] w-[14px] border-2 border-border bg-[#1e1b4b]" />
      <span className="absolute left-[25px] top-[2px] h-[56px] w-[22px] -rotate-[28deg] border-2 border-border bg-[#8b5cf6]" />
      <span className="absolute left-[43px] top-[13px] h-[54px] w-[14px] border-2 border-border bg-[#ddd6fe] shadow-[3px_3px_0_0_#1e1b4b]" />
    </div>
  );
}

function SpecGridIcon() {
  return (
    <div className="relative size-[72px] overflow-hidden">
      <span className="absolute left-2.5 top-2.5 size-[52px] rounded-[2px] border-2 border-border bg-background" />
      {[0, 1, 2].flatMap((row) =>
        [0, 1, 2].map((column) => {
          const filled = column !== 1 || row === 1;
          return (
            <span
              key={`${row}-${column}`}
              className={cn(
                "absolute size-3 rounded-[1px]",
                filled ? (column === 1 ? "bg-[#8b5cf6]" : column === 2 ? "bg-[#ddd6fe]" : "bg-[#1e1b4b]") : "bg-transparent",
              )}
              style={{
                left: 14 + column * 16,
                top: 14 + row * 16,
              }}
            />
          );
        }),
      )}
    </div>
  );
}

export function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const closeOnDesktop = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [menuOpen]);

  return (
    <div id="home" className="min-h-screen w-full overflow-x-hidden break-words bg-background font-sans text-foreground">
      <Header
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onCloseMenu={() => setMenuOpen(false)}
      />
      <main inert={menuOpen} aria-hidden={menuOpen || undefined}>
        <Hero />
        <WhyNeoLite />
        <Foundations />
        <DecorationGrid />
        <ComponentsHeader />
        <ComponentsPreview />
        <DesignToCode />
        <Resources />
      </main>
      <div inert={menuOpen} aria-hidden={menuOpen || undefined}>
        <Footer />
      </div>
    </div>
  );
}
