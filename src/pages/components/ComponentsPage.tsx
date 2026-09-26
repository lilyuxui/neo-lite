import { useEffect, useState } from "react";

import bookmarkIcon from "../../assets/icons/bookmark.svg?raw";
import verticalCardImage from "../../assets/images/image_vertical_card.png";
import { Icon } from "../../assets/icons/Icon";
import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Checkbox } from "../../components/checkbox";
import { Dialog } from "../../components/dialog";
import { Input } from "../../components/input";
import { Selection } from "../../components/selection";
import { Tab, Tabs } from "../../components/tabs";
import { Footer, Header } from "../home/HomePage";
import { cn } from "../../utils/cn";
import { CodeViewer } from "./CodeViewer";
import { componentExamples } from "./componentExamples";

const componentDocs = [
  { slug: "badge", name: "Badge", description: "A compact label used to communicate status, category or supporting information.", code: componentExamples.badge },
  { slug: "button", name: "Button", description: "An action control for common tasks and important decisions.", code: componentExamples.button },
  { slug: "card", name: "Card", description: "A contained surface for related content and actions.", code: componentExamples.card },
  { slug: "checkbox", name: "Checkbox", description: "A control for selecting one or more independent options.", code: componentExamples.checkbox },
  { slug: "dialog", name: "Dialog", description: "A focused layer for decisions or information that needs attention.", code: componentExamples.dialog },
  { slug: "input", name: "Input", description: "A field for entering and editing a single value.", code: componentExamples.input },
  { slug: "selection", name: "Selection", description: "A compact way to choose one option from a list.", code: componentExamples.selection },
  { slug: "tabs", name: "Tabs", description: "Switch between related views without leaving the page.", code: componentExamples.tabs },
] as const;

type ComponentSlug = (typeof componentDocs)[number]["slug"];
const badgeVariants = ["accent", "secondary", "primary", "destructive"] as const;

function BadgePreview() {
  const icon = <Icon svg={bookmarkIcon} className="size-4" />;
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      {badgeVariants.map((variant) => (
        <Badge key={variant} variant={variant} leadingIcon={icon} className="capitalize">{variant}</Badge>
      ))}
    </div>
  );
}

function ComponentPreview({ slug }: { slug: ComponentSlug }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  switch (slug) {
    case "badge":
      return <BadgePreview />;
    case "button":
      return <div className="flex flex-wrap items-center justify-center gap-4">{(["accent", "secondary", "primary", "destructive"] as const).map((variant) => <Button key={variant} variant={variant} className="capitalize">{variant}</Button>)}</div>;
    case "card":
      return <Card className="max-w-[280px]" image={<img src={verticalCardImage} alt="" />} title="Your profile">Manage your details in one place.</Card>;
    case "checkbox":
      return <div className="flex flex-col gap-4"><label className="flex items-center gap-2"><Checkbox defaultChecked />Receive updates</label><label className="flex items-center gap-2"><Checkbox />Save my preferences</label></div>;
    case "dialog":
      return <><Button variant="primary" onClick={() => setDialogOpen(true)}>Open dialog</Button><Dialog open={dialogOpen} onOpenChange={setDialogOpen} title="Confirm action" footer={<Button variant="primary" onClick={() => setDialogOpen(false)}>Done</Button>}>This is a Neo-Lite dialog.</Dialog></>;
    case "input":
      return <Input containerClassName="max-w-[320px]" label="Email" type="email" placeholder="you@example.com" />;
    case "selection":
      return <div className="w-full max-w-[320px]"><Selection label="Role" options={[{ value: "designer", label: "Designer" }, { value: "developer", label: "Developer" }, { value: "other", label: "Other" }]} /></div>;
    case "tabs":
      return <Tabs defaultValue="overview"><Tab value="overview">Overview</Tab><Tab value="activity">Activity</Tab><Tab value="settings">Settings</Tab></Tabs>;
  }
}

function PreviewFrame({ slug, code, label }: { slug: ComponentSlug; code: string; label: string }) {
  return (
    <div className="min-w-0 border border-border p-4 lg:p-6">
      <div className="flex min-h-[206px] w-full items-center justify-center lg:min-h-[154px]">
        <ComponentPreview slug={slug} />
      </div>
      <CodeViewer code={code} label={label} />
    </div>
  );
}

function ComponentSidebar({ active }: { active: ComponentSlug }) {
  return (
    <aside className="hidden w-[318px] shrink-0 border-r border-border bg-muted px-8 py-12 lg:block">
      <h2 className="mb-6 text-lg font-medium leading-[1.4]">Components</h2>
      <nav aria-label="Components" className="flex flex-col">
        {componentDocs.map(({ slug, name }) => (
          <a key={slug} href={`/components/${slug}`} aria-current={slug === active ? "page" : undefined} className={cn("flex min-h-[38px] items-center rounded-sm px-3 text-sm leading-[1.6] transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-focus-ring", slug === active && "bg-selected text-selected-foreground hover:bg-selected")}>{name}</a>
        ))}
      </nav>
    </aside>
  );
}

export function ComponentsPage({ slug = "badge" }: { slug?: string }) {
  const doc = componentDocs.find((item) => item.slug === slug) ?? componentDocs[0];
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
    <div className="flex w-full flex-col overflow-x-hidden bg-background font-sans text-foreground lg:min-h-screen">
      <Header currentPage="components" menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((open) => !open)} onCloseMenu={() => setMenuOpen(false)} />
      <main inert={menuOpen} aria-hidden={menuOpen || undefined} className="border-x border-b border-border px-4 sm:px-8 lg:flex-1 lg:px-6">
        <div className="mx-auto flex h-full min-h-0 w-full max-w-[1360px] border-x border-border lg:min-h-[calc(100vh-170px)]">
          <ComponentSidebar active={doc.slug} />
          <section className="min-w-0 flex-1 px-6 pb-10 pt-6 sm:px-10 sm:pt-10 lg:px-12 lg:pb-12 lg:pt-20">
            <div className="flex flex-col gap-8 lg:gap-9">
              <div className="flex flex-col gap-8">
                <h1 className="text-[40px] font-bold leading-[1.12] lg:text-[56px]">{doc.name}</h1>
                <p className="text-base leading-[1.6] lg:text-lg">{doc.description}</p>
              </div>
              <PreviewFrame slug={doc.slug} code={doc.code} label={doc.name} />
            </div>
          </section>
        </div>
      </main>
      <div inert={menuOpen} aria-hidden={menuOpen || undefined}><Footer /></div>
    </div>
  );
}
