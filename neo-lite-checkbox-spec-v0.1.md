# Neo-Lite Checkbox Component Specification v0.1

## 1. Purpose

`Checkbox` is the Neo-Lite binary / indeterminate selection control.

This specification translates the Figma Checkbox component into a production React API without mirroring Figma-only authoring props 1:1.

Figma remains the visual/design source of truth. React should expose native checkbox semantics and a small, predictable public API.

## 2. Figma Source

- File: `Neo-Lite UI Kit`
- File key: `VBhHP72Ge5M22csfOgeXt6`
- Component set node: `2010:1914`

Figma authoring properties:

```ts
type FigmaCheckboxProps = {
  checked?: "False" | "True" | "Indeterminate";
  state?: "Default" | "Focus" | "Error" | "Error-focus" | "Disabled";
};
```

Figma defaults:

```ts
checked = "False";
state = "Default";
```

These are design-authoring controls and should not become the React public API directly.

## 3. Visual Anatomy

```text
Checkbox
└── Control
    ├── Background / border
    └── Optional mark
        ├── check
        └── minus
```

The inspected Figma node contains the checkbox control only. It does not include a label or supporting text.

For v0.1, keep the React `Checkbox` component focused on the native checkbox control.

## 4. Size and Geometry

The Checkbox occupies a fixed:

```text
16 × 16px
```

### Unchecked

Figma visually positions a 14 × 14px bordered square inside the 16 × 16px component bounds:

```text
control: 14 × 14px
offset: 1px from top and left
border: 1px solid
background: background
```

### Checked / Indeterminate

The selected control fills the full 16 × 16px with:

```text
border: 1px solid
background: accent
mark area: 14 × 14px
mark offset: 1px
```

The overall 16px footprint must stay stable between states.

## 5. Color Tokens

Use existing Neo-Lite semantic tokens:

```css
--background: #ffffff;
--foreground: #000000;
--border: #000000;
--accent: #dfdffe;
--focus-ring: #5b5cce;
--destructive: #ffdddf;
--destructive-border: #d40511;
--destructive-focus: #ffa7ac;
--shadow-color: #000000;
--disabled-opacity: 0.3;
```

Do not hard-code these colours in `Checkbox.tsx`.

## 6. Shadow and Focus Tokens

### Standard focus

```css
box-shadow: 0 0 0 2px var(--focus-ring);
```

### Destructive focus

```css
box-shadow: 0 0 0 2px var(--destructive-focus);
```

### Selected hard shadow

Checked and indeterminate controls use Figma `box-shadow-1`:

```css
box-shadow: 3px 3px 0 0 var(--shadow-color);
```

Use the existing Neo-Lite hard-shadow mapping where available:

```text
shadow-sm
```

### Selected + focus

Checked / indeterminate focus combines both:

```text
3px hard shadow
+
2px focus ring
```

Do not replace the hard shadow when adding focus.

## 7. States

React should derive states from native interaction and semantic props rather than expose a public `state` prop.

### Unchecked / Default

```text
background: background
border: border
mark: none
hard shadow: none
```

### Unchecked / Focus

```text
background: background
border: border
focus ring: standard focus
```

Use `:focus-visible`.

### Checked / Default

```text
background: accent
border: border
check mark: foreground
hard shadow: box-shadow-1
```

### Checked / Focus

```text
background: accent
border: border
check mark: foreground
hard shadow: box-shadow-1
focus ring: standard focus
```

### Indeterminate / Default

```text
background: accent
border: border
minus mark: foreground
hard shadow: box-shadow-1
```

### Indeterminate / Focus

```text
background: accent
border: border
minus mark: foreground
hard shadow: box-shadow-1
focus ring: standard focus
```

### Error / Unchecked

```text
background: background
border: destructive-border
```

### Error + Focus / Unchecked

```text
background: background
border: destructive-border
focus ring: destructive focus
```

### Error / Checked

```text
background: destructive
border: destructive-border
check mark: foreground
hard shadow: box-shadow-1
```

### Error + Focus / Checked

```text
background: destructive
border: destructive-border
check mark: foreground
hard shadow: box-shadow-1
focus ring: destructive focus
```

Figma does not currently define an indeterminate + error variant. Do not invent one for v0.1.

### Disabled

Apply:

```css
opacity: var(--disabled-opacity);
```

to the whole checkbox control.

Use the real HTML `disabled` attribute on the native input.

Disabled must not show interactive focus treatment.

## 8. Checked State

Use the native checkbox API:

```ts
checked?: boolean;
defaultChecked?: boolean;
onChange?: React.ChangeEventHandler<HTMLInputElement>;
```

These already come from `React.InputHTMLAttributes<HTMLInputElement>`.

Do not expose the Figma string API:

```ts
checked?: "False" | "True" | "Indeterminate";
```

## 9. Indeterminate State

HTML exposes indeterminate as a DOM property rather than a markup attribute.

Expose:

```ts
indeterminate?: boolean;
```

Synchronize it to:

```ts
input.indeterminate
```

using the native input ref and the approach appropriate to the project's React version.

Rules:

- `indeterminate={true}` renders the minus mark.
- `indeterminate` is visually distinct from checked.
- Do not encode indeterminate as a string `checked` value.
- Consumers decide how click/change transitions application state.

Example:

```tsx
<Checkbox
  checked={false}
  indeterminate
  aria-label="Select some items"
/>
```

## 10. Error State

Expose:

```ts
error?: boolean;
```

The inspected Checkbox contains no error message or supporting text, so `error` represents invalid visual/semantic state only.

When `error` is true:

- apply destructive visual styling
- set `aria-invalid="true"` unless a consumer explicitly supplies another ARIA value
- use destructive focus styling

Do not expose `state="Error"` or `variant="error"`.

## 11. Recommended React API

```ts
export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  indeterminate?: boolean;
  error?: boolean;
}
```

The component must always render:

```html
<input type="checkbox" />
```

Consumers must not be able to change `type`.

Native props remain available, including:

```text
id
name
checked
defaultChecked
disabled
required
readOnly
value
onChange
onFocus
onBlur
aria-label
aria-labelledby
aria-describedby
className
aria-*
data-*
```

## 12. Ref Behaviour

The implementation needs access to the native checkbox DOM node to synchronize `indeterminate`.

Preserve consumer ref support.

Use the ref pattern appropriate to the project's installed React version rather than assuming React 18 or React 19.

## 13. Native Semantics

Keep a real native:

```html
<input type="checkbox">
```

Do not implement it solely as:

```html
<div role="checkbox">
```

A custom visual layer may be used, but native semantics must remain intact.

Required behaviour:

- Space toggles
- disabled prevents interaction
- native form submission works
- `name` and `value` work
- controlled and uncontrolled use work
- focus reaches the checkbox
- assistive technology receives checked state

## 14. Visual Implementation

Use a custom visual control driven by the real native checkbox.

Conceptually:

```text
native checkbox input
+
visual 16px control
```

The native input may be visually hidden but must stay focusable and interactive.

Visual state derives from:

```text
checked
indeterminate
error
disabled
focus-visible
```

Do not use browser-default checkbox artwork.

## 15. Check and Minus Icons

Figma uses:

```text
Icon / check
Icon / minus
```

Mark area:

```text
14 × 14px
```

The mark uses Neo-Lite foreground.

For committed code:

- reuse an existing project icon only if its glyph clearly matches Figma
- otherwise download and commit the exact Figma SVG assets
- do not keep expiring Figma MCP asset URLs
- do not hand-draw replacements unless they already exist in the project and visually match

The visual marks are decorative because the native checkbox communicates state, so hide them from assistive technology.

## 16. className Behaviour

Recommended:

```text
className
```

applies to the outer checkbox/root so consumers can position the component.

Required internal geometry and state styling must not be accidentally replaced.

## 17. Label Composition

The v0.1 Checkbox does not own a label because the inspected Figma node is control-only.

Usage:

```tsx
<label>
  <Checkbox />
  <span>Remember me</span>
</label>
```

or use `aria-labelledby`.

Do not add a `label` prop until a labelled Checkbox/Field composition is intentionally designed.

## 18. Motion

No Checkbox motion is defined in Figma.

For v0.1:

```text
no hover lift
no translate
no animated hard shadow
no transition-all
```

Do not copy Button motion.

## 19. Storybook Requirements

Keep the submenu compact:

```text
Components
└── Checkbox
    ├── Playground
    └── Indeterminate
```

### Playground

Expose useful controls:

```text
checked
disabled
error
required
```

Use real browser focus interaction.

Do not create separate submenu stories for focus, error-focus, disabled, checked, or unchecked.

### Indeterminate

Keep one dedicated story because `indeterminate` is not a native HTML attribute and deserves an explicit example.

Validate:

```text
unchecked
checked
indeterminate
error unchecked
error checked
disabled unchecked
disabled checked
disabled indeterminate
focus-visible
error focus-visible
```

## 20. Accessibility Requirements

The implementation must:

1. Render a native `<input type="checkbox">`.
2. Support keyboard interaction.
3. Support controlled and uncontrolled checked state.
4. Support `disabled`.
5. Support accessible naming via external label / ARIA.
6. Synchronize the native `indeterminate` property.
7. Use `aria-invalid` for error state.
8. Preserve consumer ARIA attributes.
9. Hide decorative marks from assistive technology.
10. Use `:focus-visible`.
11. Preserve visible focus rings.
12. Communicate checked state with mark shape, not colour alone.

## 21. Acceptance Criteria

1. Overall footprint is exactly 16 × 16px.
2. Unchecked matches Figma.
3. Checked matches Figma.
4. Indeterminate matches Figma.
5. Checked / indeterminate use 3px hard shadow.
6. Standard focus uses purple focus ring.
7. Selected focus preserves both hard shadow and focus ring.
8. Error unchecked uses destructive border.
9. Error checked uses destructive background + border + hard shadow.
10. Error focus uses destructive focus ring.
11. Disabled applies 30% opacity.
12. Disabled uses native HTML `disabled`.
13. Controlled `checked` works.
14. `defaultChecked` works.
15. `indeterminate` synchronizes to DOM.
16. Native keyboard and form semantics work.
17. No public Figma `state` prop.
18. No string-valued Figma `checked` API.
19. No Button-style motion.
20. No unnecessary dependency.
21. Storybook uses real interaction states.
22. Icon assets are stable project assets rather than expiring MCP URLs.

## 22. Design-to-Code Token Reference

Figma variables/effects:

```text
background               #ffffff
border                   #000000
focus-ring               #5b5cce
destructive-border       #d40511
accent                   #dfdffe
shadow-color             #000000
box shadow 1 x           3px
box shadow 1 y           3px
foreground               #000000
destructive              #ffdddf
disabled-opacity         30%
```

Effects:

```text
focus-1
0 0 0 2px focus-ring

destructive-focus
0 0 0 2px destructive-focus

box-shadow-1
3px 3px 0 0 shadow-color

box-shadow-1-focus
3px 3px 0 0 shadow-color
+
0 0 0 2px focus-ring
```

Use existing Neo-Lite semantic CSS tokens and Tailwind bridge rather than raw values.

## 23. v0.1 Scope

Included:

```text
native checkbox
unchecked
checked
indeterminate
focus-visible
error
error-focus
disabled
controlled state
uncontrolled state
native form attributes
accessible naming
```

Excluded until intentionally designed:

```text
label prop
description / hint
error message
checkbox group
select-all group behaviour
multiple sizes
custom variants
loading
Button-style motion
```

## 24. Source of Truth

Priority order:

1. Neo-Lite Figma Checkbox component
2. Neo-Lite CSS semantic tokens
3. This specification
4. React implementation details

If implementation conflicts with Figma, Figma wins.
