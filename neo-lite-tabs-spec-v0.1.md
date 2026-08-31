# Neo-Lite Tabs Component Specification v0.1

## 1. Purpose

`Tabs` is the Neo-Lite tab-list container and selection controller.

It groups multiple `Tab` components, owns the selected value, provides tab-list accessibility semantics, and coordinates keyboard interaction.

This v0.1 covers only the tab selector/navigation strip. Tab panels are intentionally out of scope because no panel component is currently defined in Figma.

## 2. Figma Source

- File: `Neo-Lite UI Kit`
- File key: `VBhHP72Ge5M22csfOgeXt6`
- Component node: `2034:677`

Figma authoring API:

```ts
type FigmaTabsProps = {
  className?: string;
  children?: React.ReactNode | null;
};
```

Figma example:

```text
Tabs
├── active Tab
└── inactive Tab(s)
```

## 3. Visual Anatomy

```text
Tabs
└── Tab list
    ├── Tab
    ├── Tab
    └── Tab
```

No `TabPanel` is included in v0.1.

## 4. Geometry

```text
background: var(--background)
border: 1px solid var(--foreground)
border-radius: 4px
padding: spacing/1 = 4px
gap: spacing/1 = 4px
display: flex
align-items: center
width: intrinsic by default
```

Tabs should grow according to its children unless consumer layout requests another width.

Do not force full width.

## 5. Recommended React API

```ts
export interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}
```

Usage:

```tsx
<Tabs defaultValue="overview">
  <Tab value="overview">Overview</Tab>
  <Tab value="activity">Activity</Tab>
  <Tab value="settings">Settings</Tab>
</Tabs>
```

Controlled:

```tsx
<Tabs
  value={activeTab}
  onValueChange={setActiveTab}
>
  ...
</Tabs>
```

Do not add:

```text
activeIndex
selectedIndex
tabs array
variant
size
```

## 6. Controlled and Uncontrolled State

Support controlled:

```ts
value?: string;
onValueChange?: (value: string) => void;
```

Support uncontrolled:

```ts
defaultValue?: string;
```

Rules:

- only one Tab is active
- selecting a new Tab updates active value
- `onValueChange` fires when active value changes
- disabled Tabs cannot become active through user interaction

## 7. Selection Context

Tabs should internally provide selection context to Tab children.

Conceptually:

```ts
{
  value: string | undefined;
  setValue: (value: string) => void;
}
```

It may also provide private focus-management helpers.

Do not expose the context as public API.

## 8. Accessibility Semantics

Render Tabs with:

```text
role="tablist"
```

Each Tab exposes:

```text
role="tab"
aria-selected=true/false
```

Follow an accessible WAI-ARIA Tabs interaction pattern.

## 9. Keyboard Interaction

Support:

```text
ArrowRight
→ next enabled Tab

ArrowLeft
→ previous enabled Tab

Home
→ first enabled Tab

End
→ last enabled Tab
```

Wrap focus at the ends unless an existing trusted primitive follows another established pattern.

Disabled Tabs should be skipped.

## 10. Activation Model

Recommended v0.1: automatic activation.

When keyboard focus moves to another enabled Tab:

```text
focus moves
+
selected value updates
```

If a trusted tabs primitive already exists in the project, prefer its correct accessible behaviour rather than hand-rolling an inconsistent state machine.

## 11. Click Interaction

Clicking an enabled Tab:

```text
sets active value
moves/retains focus appropriately
calls onValueChange
```

Clicking a disabled Tab does nothing.

## 12. Active Visual State

Tabs does not style active state directly.

The active child Tab uses:

```text
background: var(--selected)
text/icon: var(--selected-foreground)
```

Inactive children use:

```text
background: var(--background)
text/icon: var(--foreground)
```

## 13. Focus Visual State

Visual focus belongs to the individual Tab.

Standard effect:

```css
box-shadow: 0 0 0 2px var(--focus-ring);
```

Do not add a focus ring around the whole Tabs container unless later designed.

## 14. Width and Overflow

Figma shows a compact intrinsic-width tab strip.

Default:

```text
width: fit-content / intrinsic
```

Do not force `width: 100%`.

Do not invent scroll/overflow behaviour in v0.1 unless required by the existing codebase.

## 15. Tab Panels

Tab panels are excluded from v0.1.

Do not add:

```text
TabPanel
Tabs.Panel
panelId
aria-controls panel wiring
```

until a panel/content design exists.

Consumers may use selected value externally:

```tsx
const [tab, setTab] = React.useState("overview");

<>
  <Tabs value={tab} onValueChange={setTab}>
    <Tab value="overview">Overview</Tab>
    <Tab value="activity">Activity</Tab>
  </Tabs>

  {tab === "overview" && <Overview />}
  {tab === "activity" && <Activity />}
</>
```

## 16. Child Validation

Tabs is intended to contain `Tab` children.

Do not over-engineer runtime child validation in v0.1.

Avoid brittle displayName/type checks unless the project already follows that convention.

## 17. Disabled Tabs

Individual Tabs use native:

```tsx
disabled
```

Tabs must ensure disabled children:

- are not selectable
- are skipped by keyboard navigation
- do not become active through user interaction

If externally controlled `value` points to a disabled Tab, do not silently mutate consumer state.

## 18. className Behaviour

`className` applies to the visible tablist container.

Preserve consumer:

```text
role
aria-*
data-*
id
className
```

Do not add unnecessary slot-class APIs.

## 19. Motion

No Tabs motion is defined in Figma.

Do not add sliding indicators, animated underlines, translate effects, Button motion, or `transition-all`.

## 20. Storybook

Recommended:

```text
Components
└── Tabs
    ├── Playground
    ├── With Icons
    └── Disabled
```

### Playground

Use real interactive Tabs:

```tsx
<Tabs defaultValue="overview">
  <Tab value="overview">Overview</Tab>
  <Tab value="activity">Activity</Tab>
  <Tab value="settings">Settings</Tab>
</Tabs>
```

Do not create stories for Active, Inactive, Hover, Focus, Active focus, or Inactive focus. These emerge through real interaction.

### With Icons

```tsx
<Tabs defaultValue="back">
  <Tab
    value="back"
    leadingIcon={<ArrowLeftIcon aria-hidden />}
  >
    Back
  </Tab>
  <Tab value="details">Details</Tab>
</Tabs>
```

Use stable project icons that visually match Figma.

### Disabled

```tsx
<Tabs defaultValue="overview">
  <Tab value="overview">Overview</Tab>
  <Tab value="activity" disabled>Activity</Tab>
  <Tab value="settings">Settings</Tab>
</Tabs>
```

Verify disabled keyboard skipping and non-activation.

## 21. Accessibility Requirements

1. Tabs renders `role="tablist"`.
2. Tab renders `role="tab"`.
3. Active Tab exposes `aria-selected="true"`.
4. Inactive Tabs expose `aria-selected="false"`.
5. Roving focus is managed appropriately.
6. ArrowLeft / ArrowRight work.
7. Home / End work.
8. Disabled Tabs are skipped.
9. Controlled and uncontrolled selection work.
10. Focus uses visible Neo-Lite focus styling.
11. No fake focus public props exist.
12. Accessibility does not rely only on colour.

## 22. Acceptance Criteria

1. Container background uses `--background`.
2. Container border is 1px `--foreground`.
3. Radius is 4px.
4. Padding is 4px.
5. Gap between Tabs is 4px.
6. Tabs remain intrinsic width by default.
7. Controlled `value` works.
8. Uncontrolled `defaultValue` works.
9. `onValueChange` works.
10. Only one Tab is selected.
11. Active state derives from Tab value.
12. Clicking changes selection.
13. Keyboard navigation follows the activation model.
14. Home / End work.
15. Disabled Tabs are skipped and cannot activate.
16. Active Tab uses selected styling.
17. Active focus preserves selected styling and adds focus ring.
18. Inactive hover uses `--hover`.
19. No public Figma `state` props.
20. No `active` prop is required on Tab.
21. No TabPanel API in v0.1.
22. No sliding indicator or new motion.
23. No unnecessary dependency.

## 23. Source of Truth

1. Neo-Lite Figma Tabs (`2034:677`)
2. Neo-Lite Figma Tab (`2034:652`)
3. `neo-lite-tab-spec-v0.1.md`
4. Neo-Lite semantic tokens
5. This specification
6. React implementation
