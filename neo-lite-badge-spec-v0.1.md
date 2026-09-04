# Neo-Lite Badge Component Specification v0.1

## 1. Purpose

`Badge` is a compact Neo-Lite status/label primitive used to display short categorical or contextual information.

It is non-interactive in v0.1.

## 2. Figma Source

- File: `Neo-Lite UI Kit`
- File key: `VBhHP72Ge5M22csfOgeXt6`
- Component set node: `6:1566`

Figma authoring props:

```ts
type FigmaBadgeProps = {
  showIcon?: boolean;
  variants?: "accent" | "secondary" | "primary" | "destructive";
};
```

Figma default:

```ts
showIcon = true;
variants = "accent";
```

The production React API should not mirror `showIcon` as a boolean.

## 3. Variants

Supported visual variants:

```text
accent
secondary
primary
destructive
```

### Accent

```text
background: var(--accent)
border: 1px solid var(--border)
text/icon: var(--foreground)
```

### Secondary

```text
background: var(--secondary)
border: 1px solid var(--border)
text/icon: var(--foreground)
```

### Primary

```text
background: var(--primary)
border: 1px solid var(--border)
text/icon: var(--primary-foreground)
```

### Destructive

```text
background: var(--destructive)
border: 1px solid var(--destructive-border)
text/icon: var(--foreground)
```

## 4. Geometry

Outer Badge:

```text
display: inline-flex
align-items: center
justify-content: center
padding-x: spacing/2 = 8px
padding-y: spacing/1 = 4px
width: intrinsic
```

The inspected Figma variants do not use a rounded corner value on the outer Badge, so do not invent rounding unless the design is updated.

## 5. Typography

Badge label uses:

```text
Font family: Nokora
Weight: 400
Size: 12px
Line height: 160%
Letter spacing: 0
```

Use the existing Neo-Lite typography/token convention if available.

## 6. Optional Leading Icon

Figma shows a 16px leading icon.

React should expose:

```ts
leadingIcon?: React.ReactNode;
```

rather than:

```ts
showIcon?: boolean;
```

Geometry:

```text
icon: 16 × 16px
```

The label content uses:

```text
padding-x: 8px
```

which creates the spacing between icon and label in the inspected Figma component.

Do not add an extra arbitrary gap on top of this unless needed to match the design.

## 7. Icon Colour

Prefer icons that use `currentColor`.

Expected:

```text
accent / secondary / destructive
→ foreground

primary
→ primary-foreground
```

Do not hard-code black or white icon fills inside Badge.

## 8. Recommended React API

```ts
export type BadgeVariant =
  | "accent"
  | "secondary"
  | "primary"
  | "destructive";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  leadingIcon?: React.ReactNode;
}
```

Recommended default:

```ts
variant = "accent";
```

Render a semantic inline element:

```html
<span>
```

Do not add:

```text
showIcon
state
size
interactive
disabled
```

in v0.1.

## 9. Why `span`

Badge is presentational and inline by default.

A semantic inline element fits usage such as:

```tsx
<p>
  Status <Badge>New</Badge>
</p>
```

Do not render a button unless an interactive Badge is intentionally designed later.

## 10. Content

Use `children` for the Badge label:

```tsx
<Badge>New</Badge>
```

With icon:

```tsx
<Badge leadingIcon={<ArrowLeftIcon aria-hidden />}>
  Badge
</Badge>
```

Do not expose a separate `label` prop.

## 11. Accessibility

Badge should:

- remain non-interactive
- preserve consumer ARIA/data attributes
- allow consumers to supply meaningful text through children
- treat decorative icons as `aria-hidden` in usage examples

Do not add button semantics.

## 12. Motion

No Badge motion or interaction states are defined in Figma.

Do not add:

```text
hover state
focus state
press state
Button lift
shadow
transition-all
```

## 13. Storybook

Recommended compact structure:

```text
Components
└── Badge
    ├── Playground
    ├── Variants
    └── With Icon
```

### Playground

Controls:

```text
children
variant
```

Do not expose arbitrary ReactNode icon through a text control.

### Variants

Show all four:

```text
accent
secondary
primary
destructive
```

with the same label for visual comparison.

### With Icon

Use a stable project icon and demonstrate all variants with the same 16px leading icon.

## 14. Acceptance Criteria

1. Supports accent, secondary, primary, destructive.
2. Default variant is accent.
3. Horizontal padding is 8px.
4. Vertical padding is 4px.
5. Label typography is Nokora 12px / 160%.
6. Icon target is 16px.
7. Width remains intrinsic.
8. Accent uses accent background + border.
9. Secondary uses secondary background + border.
10. Primary uses primary background + border + primary foreground.
11. Destructive uses destructive background + destructive border.
12. `leadingIcon` renders before children.
13. Icon inherits current text colour where possible.
14. No public `showIcon` boolean.
15. No public state prop.
16. No interaction/motion invented.
17. No unnecessary dependency.
18. No temporary Figma asset URLs remain.

## 15. Source of Truth

Priority:

1. Neo-Lite Figma Badge (`6:1566`)
2. Neo-Lite semantic tokens
3. This specification
4. React implementation
