# Neo-Lite Tab Component Specification v0.1

## 1. Purpose

`Tab` is the individual interactive item used inside the Neo-Lite `Tabs` component.

It owns the visual and interaction styling for one tab, while the parent `Tabs` component owns selection state and group-level keyboard behaviour.

## 2. Figma Source

- File: `Neo-Lite UI Kit`
- File key: `VBhHP72Ge5M22csfOgeXt6`
- Component set node: `2034:652`

Figma authoring props:

```ts
type FigmaTabProps = {
  showIcon?: boolean;
  state?:
    | "Disabled"
    | "Inactive"
    | "Inactive hover"
    | "Inactive focus"
    | "Active"
    | "Active focus";
};
```

Figma defaults:

```ts
showIcon = false;
state = "Inactive";
```

These are Figma authoring controls and should not become the React public API directly.

## 3. Typography

All Tab text uses the Neo-Lite semantic `small` typography style:

```text
Font family: Nokora
Weight: 400
Size: 14px
Line height: 160%
Letter spacing: 0
```

## 4. Geometry

```text
padding: spacing/2 = 8px
gap: spacing/1 = 4px
border-radius: 4px
display: flex
align-items: center
justify-content: center
width: intrinsic
```

The Tab should hug its content by default.

## 5. Optional Leading Icon

Figma exposes `showIcon`, but React should expose:

```ts
leadingIcon?: React.ReactNode;
```

Geometry:

```text
icon size: 20 × 20px
gap to label: 4px
```

The icon should inherit `currentColor` where possible.

Expected colour inheritance:

```text
Inactive / Hover / Focus / Disabled
→ foreground

Active / Active focus
→ selected-foreground
```

Do not expose `showIcon`.

## 6. Visual States

React derives visual state from parent Tabs selection plus real browser interaction.

### Inactive

```text
background: var(--background)
text/icon: var(--foreground)
```

### Inactive Hover

```text
background: var(--hover)
text/icon: var(--foreground)
```

Use real pointer hover.

### Inactive Focus

```text
background: var(--background)
text/icon: var(--foreground)
focus ring: 0 0 0 2px var(--focus-ring)
```

Use real `:focus-visible`.

### Active

```text
background: var(--selected)
text/icon: var(--selected-foreground)
```

### Active Focus

```text
background: var(--selected)
text/icon: var(--selected-foreground)
focus ring: 0 0 0 2px var(--focus-ring)
```

The focus ring must not replace the selected background.

### Disabled

```text
background: var(--background)
text/icon: var(--foreground)
opacity: var(--disabled-opacity)
```

Disabled tabs must not activate.

## 7. Recommended React API

```ts
export interface TabProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
  leadingIcon?: React.ReactNode;
}
```

Render a real:

```html
<button type="button">
```

The parent `Tabs` component determines active state.

Do not expose:

```text
state
active
selected
showIcon
isDisabled
variant
```

Native `disabled` comes from `ButtonHTMLAttributes`.

## 8. Value

Each Tab requires:

```ts
value: string;
```

Example:

```tsx
<Tab value="overview">Overview</Tab>
```

The display label does not need to equal the value.

## 9. Selection Ownership

`Tab` must not own independent selection state.

Active state is derived conceptually from:

```text
tab.value === tabs.value
```

Parent Tabs should provide current selected value through private internal context or equivalent implementation.

## 10. Accessibility

When used inside `Tabs`:

```text
role="tab"
aria-selected=true/false
tabIndex managed by Tabs
```

The parent owns:

```text
tablist semantics
selected value
roving focus
ArrowLeft / ArrowRight
Home / End
activation behaviour
```

Disabled tabs should be skipped appropriately during keyboard navigation.

## 11. Focus

Use real `:focus-visible`.

Figma effect:

```css
box-shadow: 0 0 0 2px var(--focus-ring);
```

Use the existing semantic focus token/utility where available.

Do not clip the focus ring.

## 12. Hover

Only inactive enabled tabs use:

```text
background: var(--hover)
```

Active tabs remain selected.

Disabled tabs must not receive hover treatment.

## 13. Motion

No Tab motion is defined in Figma.

Do not add Button lift, translate, hard hover shadow, or `transition-all`.

## 14. className Behaviour

`className` applies to the Tab root.

Compose consumer classes with required internal classes using existing project conventions.

## 15. Storybook

Standalone Tab Storybook is optional because most meaningful behaviour occurs inside `Tabs`.

If retained:

```text
Components
└── Tab
    ├── Playground
    └── With Icon
```

Do not expose fake active, hover, or focus controls solely for Storybook.

## 16. Acceptance Criteria

1. Uses Neo-Lite `small` typography.
2. Padding is 8px.
3. Gap is 4px.
4. Radius is 4px.
5. Leading icon is 20px.
6. Inactive uses background + foreground.
7. Inactive hover uses `--hover`.
8. Inactive focus uses the 2px focus ring.
9. Active uses `--selected` / `--selected-foreground`.
10. Active focus preserves selected background and adds focus ring.
11. Disabled uses 30% opacity.
12. Disabled does not activate.
13. `leadingIcon` renders before the label.
14. No public Figma `state` prop.
15. No public `active` prop.
16. No public `showIcon` boolean.
17. Tab does not own selection state.
18. No Button-style motion.
19. No unnecessary dependency.

## 17. Source of Truth

1. Neo-Lite Figma Tab (`2034:652`)
2. Neo-Lite semantic tokens
3. This specification
4. React implementation
