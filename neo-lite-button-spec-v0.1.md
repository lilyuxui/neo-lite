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

Button height is fixed by size and must not vary according to whether the Button contains text, icons, or both.

### XS
- Height: 38px
- Horizontal padding: 8px
- Gap: 4px
- Icon: 20px
- Label: 14px
- Radius: 4px
- Border: 1px
- Suggested Tailwind geometry: `h-[38px] px-2 gap-1 rounded-sm`

### SM
- Height: 50px
- Horizontal padding: 12px
- Gap: 8px
- Icon: 24px
- Label: 16px
- Radius: 4px
- Border: 1px
- Suggested Tailwind geometry: `h-[50px] px-3 gap-2 rounded-sm`

### LG
- Height: 64px
- Horizontal padding: 16px
- Gap: 12px
- Icon: 24px
- Label: 20px
- Radius: 4px
- Border: 1px
- Suggested Tailwind geometry: `h-[64px] px-4 gap-3 rounded-sm`

Do not rely on vertical padding plus content height to determine the rendered height.

Icon-only Buttons use the same size API and must remain square:

```text
xs = 38 × 38px
sm = 50 × 50px
lg = 64 × 64px
```

Do not add public `icon-xs`, `icon-sm`, or `icon-lg` size values.

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

Apply the Neo-Lite hard shadow and hover-lift interaction.

```txt
Figma: box-shadow-2
CSS shadow: 4px 4px 0 0 var(--shadow-color)
Tailwind shadow: enabled:enabled:hover:shadow-md
```

Hover transform:

```txt
translateY(-4px)
```

This movement must consume the Neo-Lite motion/transform token rather than hard-coding `-4px` in `Button.tsx`.

Motion tokens:

```txt
duration = 150ms
easing = ease-out
transform/hover-offset = -4px
```

Animate only:

```txt
transform
box-shadow
background-color
```

Do not use `transition-all`.

Primary also uses:

```txt
enabled:enabled:hover:bg-primary-hover
```

Disabled Buttons must not move or receive hover shadow/background behaviour.

The hover transform and shadow should be applied to a visual child inside the
Button while the outer `<button>` remains the stable hit target, semantic
element, focus target, and disabled-state owner. This prevents pointer
enter/leave loops when the cursor is positioned on the button edge.

Respect `prefers-reduced-motion`: remove the hover translation and transition when reduced motion is requested, while preserving clear interaction/focus feedback.

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


### Motion Tokens

The Button hover interaction uses Neo-Lite motion variables defined in Figma:

```text
duration                 150ms
easing                   ease-out
transform/hover-offset   -4px
```

The implementation should map these to reusable CSS design tokens and consume those tokens from the Button implementation.

Do not hard-code these values directly in `Button.tsx`.

The intended interaction is:

```text
default
→ hover:
  translateY(-4px)
  + shadow-md
  + primary-hover background for Primary only

duration: 150ms
easing: ease-out
```

## 7. Suggested Variant Classes

### Accent

```txt
bg-accent
text-accent-foreground
border
border-border
enabled:hover:shadow-md
```

### Primary

```txt
bg-primary
text-primary-foreground
border
border-border
enabled:hover:bg-primary-hover
enabled:hover:shadow-md
```

### Secondary

```txt
bg-secondary
text-secondary-foreground
border
border-border
enabled:hover:shadow-md
```

### Destructive

```txt
bg-destructive
text-destructive-foreground
border
border-destructive-border
enabled:hover:shadow-md
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

Keep the Button submenu compact.

Recommended structure:

```text
Components
└── Button
    ├── Playground
    ├── Text Only
    ├── Leading Icon
    ├── Trailing Icon
    ├── Both Icons
    └── Icon Only
```

### Playground

The Playground should act as the main visual QA view.

It should render all four variants across all three sizes:

```text
accent
primary
secondary
destructive

×
xs
sm
lg
```

Useful controls can configure properties such as:

```text
children
disabled
```

Do not create separate submenu stories for:

```text
sizes
variants
disabled
hover
focus-visible
variant-size matrix
```

Hover and focus should use real browser interaction rather than fake React `state` props or Storybook-only styling.

### Content composition stories

Keep dedicated stories for:

- text only
- leading icon
- trailing icon
- both icons
- icon only

These stories are primarily for validating content composition and icon geometry.

## 11. Acceptance Criteria

The implementation is complete when:

- all four variants match Figma
- all three sizes match Figma
- XS is exactly 38px high
- SM is exactly 50px high
- LG is exactly 64px high
- text-only, leading-icon, trailing-icon, both-icon, and icon-only Buttons have identical height within the same size
- icon-only XS is 38 × 38px
- icon-only SM is 50 × 50px
- icon-only LG is 64 × 64px
- icon sizing matches Figma
- hover shadow matches Figma `box-shadow-2`
- hover movement uses the Neo-Lite `-4px` hover-offset token
- hover motion uses 150ms `ease-out`
- only transform, box-shadow, and background-color are transitioned
- reduced-motion preferences are respected
- primary hover background matches Figma
- focus ring matches Figma
- destructive focus ring matches Figma
- disabled state uses 30% opacity and has no hover movement
- no Figma-only `state` prop exists in React
- icon-only buttons are accessible
- implementation uses Neo-Lite semantic tokens
- Storybook Playground shows all variants × sizes
- Storybook submenu remains intentionally compact

## 12. Source of Truth

Priority order:

1. Neo-Lite Figma Button component
2. Neo-Lite CSS semantic tokens
3. This specification
4. Implementation details

If implementation conflicts with Figma, Figma wins.

If implementation can be simplified without changing behaviour or appearance, prefer the simpler implementation.
