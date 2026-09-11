# Neo-Lite Foundations v0.1

This is the canonical foundation reference for the Neo-Lite UI `v0.1.0` MVP component release.

It documents the implemented token system as it exists today across:

```text
Figma
-> CSS custom properties
-> Tailwind v4 utilities
-> component usage
```

This document does not introduce a redesign, a new palette, a new component, or a documentation website.

## Source Of Truth

The implemented visual foundation is defined in `src/styles/theme.css`.

Figma remains the design source for approved visual intent. The current React implementation and latest component specs are the source of truth for the `v0.1.0` release contract.

Foundation references inspected for this audit:

- `neo-lite-project-context.md`
- `docs/neo-lite-v0.1.0-release-readiness.md`
- `src/styles/theme.css`
- `package.json`
- production components under `src/components`
- Storybook stories under `src/components`
- current component specification markdown files

Note: most component specs currently live at the repository root. The `docs/` directory currently contains release/foundation documentation.

## Package Entry Points

Consumers import components from the package root:

```ts
import { Button, Card, Input } from "neo-lite-ui";
```

Consumers import the foundation CSS explicitly:

```ts
import "neo-lite-ui/styles/theme.css";
```

The theme CSS is exported through `package.json` as:

```json
"./styles/theme.css": "./src/styles/theme.css"
```

## Tailwind v4 Model

Neo-Lite uses Tailwind CSS v4 through CSS-first configuration.

`src/styles/theme.css` contains:

```css
@import "tailwindcss";

@theme inline {
  /* token bridge */
}
```

There is no separate Tailwind config file in the current repo. Tailwind utilities such as `bg-accent`, `border-border`, `text-card-foreground`, and `shadow-md` are produced by the `@theme inline` bridge.

## Primitive Color Tokens

Primitive tokens store raw colour values. Components should prefer semantic tokens unless a spec explicitly calls for a primitive token.

| Figma/token role | CSS custom property | Value | Tailwind utility |
| --- | --- | --- | --- |
| Neutral 950 | `--neutral-950` | `#000000` | Not bridged directly |
| Neutral 900 | `--neutral-900` | `#232323` | Not bridged directly |
| Neutral 800 | `--neutral-800` | `#333333` | Not bridged directly |
| Neutral 700 | `--neutral-700` | `#484848` | Not bridged directly |
| Neutral 500 | `--neutral-500` | `#737373` | Not bridged directly |
| Neutral 400 | `--neutral-400` | `#888888` | Not bridged directly |
| Neutral 300 | `--neutral-300` | `#c8c8c8` | Not bridged directly |
| Neutral 200 | `--neutral-200` | `#e7e5e4` | Not bridged directly |
| Neutral 100 | `--neutral-100` | `#f7f6f4` | Not bridged directly |
| Neutral 50 | `--neutral-50` | `#f8f8f8` | Not bridged directly |
| Neutral 0 | `--neutral-0` | `#ffffff` | Not bridged directly |
| Purple 700 | `--purple-700` | `#5b5cce` | Not bridged directly |
| Purple 100 | `--purple-100` | `#dfdffe` | Not bridged directly |
| Red 800 | `--red-800` | `#9c050e` | Not bridged directly |
| Red 600 | `--red-600` | `#d40511` | Not bridged directly |
| Red 200 | `--red-200` | `#ffa7ac` | Not bridged directly |
| Red 100 | `--red-100` | `#ffdddf` | Not bridged directly |

## Semantic Color Tokens

Semantic colour tokens are the intended component-facing API.

| Figma role | CSS custom property | Value mapping | Tailwind utility examples | Current component usage |
| --- | --- | --- | --- | --- |
| Background | `--background` | `var(--neutral-0)` | `bg-background`, `text-background` | Body, Input, Selection, Menu, Tab, Tabs |
| Foreground | `--foreground` | `var(--neutral-950)` | `text-foreground`, `border-foreground` | Body, Badge, Input, Selection, Tabs, Tab, icons |
| Card | `--card` | `var(--neutral-0)` | `bg-card` | Card, Dialog |
| Card foreground | `--card-foreground` | `var(--neutral-950)` | `text-card-foreground` | Card, Dialog |
| Muted | `--muted` | `var(--neutral-100)` | `bg-muted` | Card image fallback area |
| Muted foreground | `--muted-foreground` | `var(--neutral-400)` | `text-muted-foreground` | Input hint text |
| Placeholder | `--placeholder` | `var(--neutral-500)` | `text-placeholder`, `placeholder:text-placeholder` | Input placeholder, Selection placeholder |
| Border | `--border` | `var(--neutral-950)` | `border-border` | Badge, Button, Card, Dialog, Input, Menu, Selection |
| Input border | `--input-border` | `var(--neutral-950)` | `border-input` | Available bridge; current Input uses `border-border` |
| Focus ring | `--focus-ring` | `var(--purple-700)` | `border-focus-ring` | Dialog dismiss button focus border |
| Hover | `--hover` | `var(--purple-100)` | `bg-hover` | Dialog dismiss, MenuItem, Tab, Input story clear button |
| Selected | `--selected` | `var(--neutral-950)` | `bg-selected` | MenuItem, Tab |
| Selected foreground | `--selected-foreground` | `var(--neutral-0)` | `text-selected-foreground` | MenuItem, Tab |
| Primary | `--primary` | `var(--neutral-950)` | `bg-primary` | Button, Badge |
| Primary hover | `--primary-hover` | `var(--neutral-700)` | `bg-primary-hover` | Primary Button hover |
| Primary foreground | `--primary-foreground` | `var(--neutral-0)` | `text-primary-foreground` | Button, Badge |
| Secondary | `--secondary` | `var(--neutral-0)` | `bg-secondary` | Button, Badge |
| Secondary foreground | `--secondary-foreground` | `var(--neutral-950)` | `text-secondary-foreground` | Button |
| Accent | `--accent` | `var(--purple-100)` | `bg-accent` | Button, Badge, Checkbox checked state |
| Accent foreground | `--accent-foreground` | `var(--neutral-950)` | `text-accent-foreground` | Button |
| Destructive | `--destructive` | `var(--red-100)` | `bg-destructive` | Button, Badge, Checkbox error checked state |
| Destructive foreground | `--destructive-foreground` | `var(--neutral-950)` | `text-destructive-foreground` | Button |
| Destructive border | `--destructive-border` | `var(--red-600)` | `border-destructive-border` | Button, Badge, Checkbox, Input, Selection |
| Destructive focus | `--destructive-focus` | `var(--red-200)` | Not bridged directly | Used through `--destructive-focus-shadow` |
| Error | `--error` | `var(--red-600)` | `text-error` | Input and Selection labels/messages |

## Typography Tokens

| Figma role | CSS custom property | Value | Tailwind utility | Current component usage |
| --- | --- | --- | --- | --- |
| Sans family | `--font-family-sans` | `"Nokora", sans-serif` | `font-sans` | All components |
| Serif family | `--font-family-serif` | `"Playfair Display", serif` | `font-serif` | Available, not used by v0.1 components |

Fonts are loaded by `theme.css` from Google Fonts:

```css
@import url("https://fonts.googleapis.com/css2?family=Nokora:wght@300;400;500;700&family=Playfair+Display&display=swap");
```

Component typography currently uses Tailwind font-size utilities plus explicit line-height values:

| Component area | Utility pattern |
| --- | --- |
| Badge | `text-xs`, `font-normal`, `leading-[160%]` |
| Button | `text-sm`, `text-base`, `text-xl`, `font-normal`, `leading-none` |
| Input, Selection, MenuItem, Tab | `text-sm`, `font-normal`, `leading-[160%]` |
| Card subtitle/body | `text-base`, `leading-[160%]` |
| Card title | `text-lg`, `font-medium`, `leading-[140%]` |
| Dialog title | `text-xl`, `font-bold`, `leading-[140%]` |

No additional typography tokens are required for `v0.1.0`.

## Spacing Tokens

Spacing tokens are defined as a 4px scale.

| Figma role | CSS custom property | Value | Tailwind utility examples | Current usage |
| --- | --- | --- | --- | --- |
| spacing/1 | `--spacing-1` | `4px` | `p-1`, `gap-1`, `px-1` | Input field gap, Button xs gap, Tabs gap/padding |
| spacing/2 | `--spacing-2` | `8px` | `p-2`, `px-2`, `py-2`, `gap-2` | Badge padding, Input control, Menu, MenuItem, Button sm gap, Card gaps |
| spacing/3 | `--spacing-3` | `12px` | `px-3`, `gap-3` | MenuItem horizontal padding, Button sm padding, Button lg gap |
| spacing/4 | `--spacing-4` | `16px` | `p-4`, `px-4`, `gap-4` | Card content/footer, Dialog sections, Button lg padding |
| spacing/5 | `--spacing-5` | `20px` | `p-5` | Available, not directly used by v0.1 components |
| spacing/6 | `--spacing-6` | `24px` | `p-6` | Available, not directly used by v0.1 components |
| spacing/7 | `--spacing-7` | `28px` | `p-7` | Available, not directly used by v0.1 components |
| spacing/8 | `--spacing-8` | `32px` | `p-8` | Used in responsive calc values as raw `32px` |
| spacing/9 | `--spacing-9` | `36px` | `p-9` | Available, not directly used by v0.1 components |
| spacing/10 | `--spacing-10` | `40px` | `p-10` | Available, not directly used by v0.1 components |
| spacing/11 | `--spacing-11` | `44px` | `p-11` | Available, not directly used by v0.1 components |
| spacing/12 | `--spacing-12` | `48px` | `p-12` | Available, not directly used by v0.1 components |

Small implementation-only adjustments such as `p-0.5`, `m-px`, and `p-[2px]` are used for icon alignment, checkbox sizing, and dismiss-button geometry where the component specs require those exact dimensions.

## Radius Tokens

| Figma role | CSS custom property | Value | Tailwind utility | Current component usage |
| --- | --- | --- | --- | --- |
| radius/sm | `--radius-sm` | `4px` | `rounded-sm` | Button focus target, Button visual, Card, Checkbox visual sizing context, Input, Menu, MenuItem, Selection, Tab, Tabs |
| radius/md | `--radius-md` | `8px` | `rounded-md` | Dialog surface |
| radius/lg | `--radius-lg` | `10px` | `rounded-lg` | Available, not directly used by v0.1 components |
| radius/xl | `--radius-xl` | `24px` | `rounded-xl` | Available, not directly used by v0.1 components |
| radius/full | `--radius-full` | `9999px` | `rounded-full` | Dialog dismiss button, Input story clear button |

## State Tokens

| Figma/state role | CSS custom property | Value | Tailwind usage | Current component usage |
| --- | --- | --- | --- | --- |
| Disabled opacity | `--disabled-opacity` | `0.3` | `opacity-[var(--disabled-opacity)]` | Button, Checkbox, Input, MenuItem, Selection, Tab |

Disabled state should use real native disabled semantics where the component is a form control or button.

## Motion Tokens

| Figma/motion role | CSS custom property | Value | Tailwind usage | Current component usage |
| --- | --- | --- | --- | --- |
| Duration | `--duration` | `150ms` | `duration-[var(--duration)]` | Button, Card, Dialog dismiss, Input story clear button |
| Easing | `--easing` | `ease-out` | `ease-[var(--easing)]` | Button, Card, Dialog dismiss, Input story clear button |
| Hover lift offset | `--transform-hover-offset` | `-4px` | `translate-y-[var(--transform-hover-offset)]` | Button visual child, Card visual child |

The Neo-Lite hover lift is Y-only. Components that use it keep the outer element as the stable hit target and move an inner visual child to avoid edge hover loops.

Motion-reduction support is implemented on Button and Card with `motion-reduce:transition-none` and `motion-reduce:...translate-y-0`.

## Effect Tokens

| Figma effect role | CSS custom property | Value | Tailwind utility | Current component usage |
| --- | --- | --- | --- | --- |
| Shadow colour | `--shadow-color` | `var(--neutral-950)` | Not bridged directly | Used by shadow tokens |
| box-shadow-1 | `--shadow-1` | `3px 3px 0 0 var(--shadow-color)` | `shadow-sm` | Menu, Checkbox checked state |
| box-shadow-2 | `--shadow-2` | `4px 4px 0 0 var(--shadow-color)` | `shadow-md` | Button hover, Card hover, Dialog surface |
| focus-1 | `--focus-shadow` | `0 0 0 2px var(--focus-ring)` | `shadow-focus` | Button, Checkbox, Input, MenuItem, Selection, Tab |
| destructive focus | `--destructive-focus-shadow` | `0 0 0 2px var(--destructive-focus)` | `shadow-destructive-focus` | Button, Checkbox, Input, Selection |
| selected focus | `--selected-focus-shadow` | `var(--focus-shadow), var(--shadow-1)` | `shadow-[var(--selected-focus-shadow)]` | Checkbox checked/indeterminate focus |
| selected destructive focus | `--selected-destructive-focus-shadow` | `var(--destructive-focus-shadow), var(--shadow-1)` | `shadow-[var(--selected-destructive-focus-shadow)]` | Checkbox error checked focus |

The selected checkbox focus shadows place the focus ring before the hard selected shadow so the focus state remains visually above the checked-state shadow.

## Component Geometry Tokens

| Component role | CSS custom property | Value | Tailwind usage | Current component usage |
| --- | --- | --- | --- | --- |
| Button xs height | `--button-height-xs` | `38px` | `h-[var(--button-height-xs)]` | Button xs and xs icon-only width |
| Button sm height | `--button-height-sm` | `50px` | `h-[var(--button-height-sm)]` | Button sm and sm icon-only width |
| Button lg height | `--button-height-lg` | `64px` | `h-[var(--button-height-lg)]` | Button lg and lg icon-only width |

These are component geometry tokens, not general spacing tokens.

## Base Styles

`theme.css` establishes a small global baseline:

- all elements use `box-sizing: border-box`
- `body` margin is reset to `0`
- `body` uses `--background`, `--foreground`, and `--font-family-sans`
- native form controls inherit font styles
- placeholders use `--placeholder`

No additional global/base stylesheet is present in the current repository.

## Component Usage Matrix

| Component | Foundation usage summary |
| --- | --- |
| Badge | Semantic variant colours, 1px borders, `font-sans`, intrinsic width |
| Button | Semantic variant colours, 1px border, button height tokens, hover lift token, hard hover shadow, focus shadows |
| Card | Card semantic colours, 1px border, 4px radius, optional muted image area, hover lift token, hard hover shadow |
| Checkbox | Background/accent/destructive tokens, hard selected shadow, focus/destructive/selected compound shadows, disabled opacity |
| Dialog | Card semantic surface, 1px border, 8px radius, hard shadow, hover/focus dismiss styling, responsive viewport calculations |
| Input | Background/foreground/placeholder/error tokens, 1px borders, focus/destructive focus shadows, disabled opacity |
| Menu | Background, border, 4px radius, 8px padding, hard shadow-1 |
| MenuItem | Background/foreground/hover/selected tokens, 4px radius, focus shadow, disabled opacity |
| Selection | Input-like trigger tokens, Menu/MenuItem composition, placeholder/error/focus tokens, disabled opacity |
| Tab | Background/foreground/hover/selected tokens, 4px radius, focus shadow, disabled opacity |
| Tabs | Background and foreground border, 4px radius, 4px padding/gap |

## Known v0.1 Token Notes

- `--input-border` is bridged to Tailwind as `border-input`, but current Input implementation uses `border-border` because it aliases the same value in `v0.1.0`.
- Primitive colour tokens are intentionally not exposed as Tailwind colour utilities; components use semantic aliases.
- `--destructive-focus`, `--shadow-color`, combined selected focus shadows, motion values, disabled opacity, and button heights are used through semantic effect tokens or arbitrary Tailwind values rather than full utility bridges.
- Current published source is TypeScript source plus CSS tokens. There is no compiled `dist` output in the v0.1.0 package setup.
