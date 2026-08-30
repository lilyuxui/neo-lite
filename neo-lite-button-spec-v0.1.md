# Neo-Lite UI — Button Component Specification v0.1

## Purpose

The Button component provides a consistent interactive control for primary actions, secondary actions, accent actions, and destructive actions across Neo-Lite UI.

The implementation must use the Neo-Lite design tokens and Tailwind CSS v4 utilities. Do not hard-code colours, radii, shadows, or spacing where a token exists.

## 1. Variants

```ts
type ButtonVariant =
  | "accent"
  | "primary"
  | "secondary"
  | "destructive";
```

| Variant | Background | Foreground | Border | Hover |
|---|---|---|---|---|
| Accent | `accent` | `foreground` | `border` | hard shadow |
| Primary | `primary` | `primary-foreground` | `border` | `primary-hover` + hard shadow |
| Secondary | `secondary` | `secondary-foreground` | `border` | hard shadow |
| Destructive | `destructive` | `destructive-foreground` | `destructive-border` | hard shadow |

## 2. Sizes

```ts
type ButtonSize = "xs" | "sm" | "lg";
```

### XS
- Padding: 8px
- Gap: 4px
- Icon: 20px
- Label: 14px
- Radius: 4px
- Tailwind: `p-2 gap-1 rounded-sm`

### SM
- Padding: 12px
- Gap: 8px
- Icon: 24px
- Label: 16px
- Radius: 4px
- Tailwind: `p-3 gap-2 rounded-sm`

### LG
- Padding: 16px
- Gap: 12px
- Icon: 24px
- Label: 20px
- Radius: 4px
- Tailwind: `p-4 gap-3 rounded-sm`

## 3. States

Figma includes Default, Hover, Focus, and Disabled visual states.

In React, do not expose these as a `state` prop. Use native browser states:

```txt
:hover
:focus-visible
:disabled
```

### Default
No shadow.

### Hover
Apply Neo-Lite hard shadow:

```txt
Figma: box-shadow-2
CSS: 4px 4px 0 0 var(--shadow-color)
Tailwind: hover:shadow-md
```

Primary also uses:

```txt
hover:bg-primary-hover
```

### Focus
Standard variants:

```css
0 0 0 2px var(--focus-ring)
```

Destructive:

```css
0 0 0 2px var(--destructive-focus)
```

Use `focus-visible`.

### Disabled
- Opacity: 0.3
- Use native `disabled`
- No hover response while disabled

Suggested class:

```txt
disabled:opacity-[var(--disabled-opacity)]
```

## 4. Icons

Buttons support:
- leading icon
- trailing icon
- icon-only usage

Recommended props:

```ts
leadingIcon?: React.ReactNode;
trailingIcon?: React.ReactNode;
```

Example:

```tsx
<Button variant="primary" leadingIcon={<ArrowLeft />}>
  Label
</Button>
```

```tsx
<Button variant="secondary" trailingIcon={<ArrowRight />}>
  Label
</Button>
```

For icon-only buttons, do not expose Figma's `icon-xs`, `icon-sm`, or `icon-lg` as size values.

```tsx
<Button variant="accent" size="sm" aria-label="Next">
  <ArrowRight />
</Button>
```

Icon-only buttons must have an accessible name.

## 5. Recommended React API

```ts
type ButtonVariant =
  | "accent"
  | "primary"
  | "secondary"
  | "destructive";

type ButtonSize = "xs" | "sm" | "lg";

type ButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
  };
```

Recommended defaults:

```ts
variant = "accent";
size = "xs";
type = "button";
```

Do not expose:
- `state`
- `showLeftIcon`
- `showRightIcon`
- `icon-xs`
- `icon-sm`
- `icon-lg`

These are Figma implementation details.

## 6. Required Tailwind / Token Mapping

```css
--color-background: var(--background);
--color-foreground: var(--foreground);

--color-border: var(--border);

--color-primary: var(--primary);
--color-primary-hover: var(--primary-hover);
--color-primary-foreground: var(--primary-foreground);

--color-secondary: var(--secondary);
--color-secondary-foreground: var(--secondary-foreground);

--color-accent: var(--accent);
--color-accent-foreground: var(--accent-foreground);

--color-destructive: var(--destructive);
--color-destructive-foreground: var(--destructive-foreground);
--color-destructive-border: var(--destructive-border);

--shadow-sm: var(--shadow-1);
--shadow-md: var(--shadow-2);
```

Important:
- Button hover uses `shadow-md`
- This maps to Figma `box-shadow-2`
- `box-shadow-2 = 4px 4px 0 0 var(--shadow-color)`

## 7. Suggested Variant Classes

### Accent

```txt
bg-accent
text-accent-foreground
border
border-border
hover:shadow-md
```

### Primary

```txt
bg-primary
text-primary-foreground
border
border-border
hover:bg-primary-hover
hover:shadow-md
```

### Secondary

```txt
bg-secondary
text-secondary-foreground
border
border-border
hover:shadow-md
```

### Destructive

```txt
bg-destructive
text-destructive-foreground
border
border-destructive-border
hover:shadow-md
```

Shared classes:

```txt
inline-flex
items-center
justify-center
font-sans
disabled:pointer-events-none
disabled:opacity-[var(--disabled-opacity)]
```

## 8. Focus Classes

Standard variants:

```txt
focus-visible:outline-none
focus-visible:shadow-[var(--focus-shadow)]
```

Destructive:

```txt
focus-visible:outline-none
focus-visible:shadow-[var(--destructive-focus-shadow)]
```

If named Tailwind focus-shadow tokens are available, use them instead.

## 9. Behaviour Rules

The implementation must:
- render a real `<button>`
- default to `type="button"`
- forward native button props
- forward `className`
- support `disabled`
- support keyboard focus
- use `focus-visible`
- preserve semantic HTML
- avoid Figma-only visual state props
- avoid hard-coded colour and shadow values
- avoid reproducing Figma's generated conditional branches
- keep variant and size logic declarative

## 10. Storybook Requirements

Create stories for:
- all four variants
- all three sizes
- text only
- leading icon
- trailing icon
- both icons
- icon only
- disabled
- focus-visible
- hover
- a matrix showing variants × sizes

## 11. Acceptance Criteria

The implementation is complete when:
- all four variants match Figma
- all three sizes match Figma
- icon sizing matches Figma
- hover shadow matches Figma `box-shadow-2`
- primary hover background matches Figma
- focus ring matches Figma
- destructive focus ring matches Figma
- disabled state uses 30% opacity
- no Figma-only `state` prop exists in React
- icon-only buttons are accessible
- implementation uses Neo-Lite semantic tokens
- component is demonstrated in Storybook

## 12. Source of Truth

Priority order:

1. Neo-Lite Figma Button component
2. Neo-Lite CSS semantic tokens
3. This specification
4. Implementation details

If implementation conflicts with Figma, Figma wins.

If implementation can be simplified without changing behaviour or appearance, prefer the simpler implementation.
