# Neo-Lite Menu Item Component Specification v0.1

## 1. Purpose

`MenuItem` is the Neo-Lite interactive item primitive used inside Menu surfaces.

This specification translates the Figma Menu Item component into a semantic React API without exposing Figma-only visual state props.

## 2. Figma Source

- File: `Neo-Lite UI Kit`
- File key: `VBhHP72Ge5M22csfOgeXt6`
- Component set node: `2025:10723`

Figma authoring property:

```ts
type FigmaMenuItemProps = {
  state?: "Default" | "Hover" | "Focus" | "Disabled" | "Selected";
};
```

Figma default:

```ts
state = "Default";
```

Do not expose this `state` prop in React.

## 3. Typography

Menu Item uses the Neo-Lite semantic `small` typography style:

```text
Font family: Nokora
Weight: 400
Size: 14px
Line height: 160%
Letter spacing: 0
```

## 4. Geometry

```text
min-height: 36px
width: 100%
padding-x: spacing/3 = 12px
padding-y: spacing/2 = 8px
gap: spacing/3 = 12px
border-radius: radius/sm = 4px
```

Figma preview width is `236px`; this is not a production component contract.

## 5. Color Tokens

```text
foreground              #000000
background              #ffffff
hover                   #dfdffe
selected                #000000
selected-foreground     #ffffff
focus-ring              #5b5cce
disabled-opacity        30%
```

Use semantic tokens rather than raw values.

## 6. States

### Default

```text
background: background
text: foreground
```

### Hover

```text
background: hover
text: foreground
```

This should come from real pointer hover.

### Focus

```text
background: background
text: foreground
focus ring: 0 0 0 2px var(--focus-ring)
```

Use real `:focus-visible`.

### Selected

```text
background: selected
text: selected-foreground
```

### Disabled

```text
background: background
text: foreground
opacity: var(--disabled-opacity)
```

Disabled must not be interactive.

## 7. Recommended React API

The base MenuItem should remain behavioural-context agnostic.

Recommended API:

```ts
export interface MenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}
```

Render a real button by default:

```html
<button type="button">
```

Native `disabled` comes from `ButtonHTMLAttributes`.

Recommended defaults:

```ts
type = "button";
selected = false;
```

Do not add:

```text
state
isHovered
isFocused
isDisabled
variant
```

## 8. Why a Button Primitive

The Figma Menu Item is interactive.

A native `<button>` provides:

```text
keyboard focus
Enter / Space activation
disabled semantics
accessible name
native click behaviour
```

For Selection/listbox usage, the higher-level Selection implementation may need different option semantics depending on the accessibility primitive chosen.

If Selection uses a trusted listbox/select primitive, adapt or wrap the MenuItem visual styles onto that primitive rather than forcing an actual `<button>` inside an ARIA listbox.

The visual contract belongs to MenuItem; the exact semantic element may be supplied by the higher-level accessible primitive.

## 9. Selected State

Expose:

```ts
selected?: boolean;
```

This maps to the Figma Selected visual state.

When selected:

```text
background: var(--selected)
color: var(--selected-foreground)
```

If used in an accessibility pattern that supports it, the controlling component should also expose the corresponding selected semantic state such as `aria-selected`.

Do not have the visual primitive guess the entire parent selection model.

## 10. Disabled

Use native:

```tsx
disabled
```

when rendered as a button.

Apply whole-item 30% opacity.

Disabled should not receive hover styling and should not activate.

## 11. Hover

Use real hover:

```text
hover background = var(--hover)
```

Do not expose `state="Hover"`.

Disabled hover must not override disabled appearance.

## 12. Focus

Use `:focus-visible`.

Focus effect:

```css
box-shadow: 0 0 0 2px var(--focus-ring);
```

Do not clip the outer focus ring.

Do not expose `state="Focus"`.

## 13. Width and Layout

Production MenuItem should fill its Menu container:

```text
width: 100%
```

Do not hard-code Figma's `236px`.

Text should align consistently and occupy available width.

## 14. Motion

No Menu Item animation is defined in Figma.

Do not copy Button lift/motion.

For v0.1:

```text
no translate
no hard hover shadow
no transition-all
```

## 15. Storybook

Recommended compact stories:

```text
Components
└── Menu Item
    ├── Playground
    └── Selected
```

Playground controls may include:

```text
children
disabled
selected
```

Hover and focus should use real interaction, not fake public state props.

## 16. Accessibility

When used standalone as a button:

1. Render a real button.
2. Default to `type="button"`.
3. Support keyboard activation.
4. Support native disabled.
5. Preserve ARIA/data props.
6. Use `:focus-visible`.
7. Selected styling must not rely only on colour when the parent interaction pattern requires a semantic selected state.

When used inside Selection/listbox, let the higher-level accessible primitive provide correct option semantics.

## 17. Acceptance Criteria

1. Minimum height is 36px.
2. Horizontal padding is 12px.
3. Vertical padding is 8px.
4. Radius is 4px.
5. Typography uses Neo-Lite `small`.
6. Default matches Figma.
7. Hover uses `--hover`.
8. Focus uses standard 2px focus ring.
9. Selected uses `--selected` / `--selected-foreground`.
10. Disabled uses 30% opacity.
11. Disabled does not hover/activate.
12. No public Figma `state` prop.
13. Width is not hard-coded to 236px.
14. No Button-style motion.
15. No unnecessary dependency.

## 18. Source of Truth

1. Neo-Lite Figma Menu Item
2. Neo-Lite semantic tokens
3. This specification
4. Implementation
