# Neo-Lite Menu Item Component Specification v0.1

## 1. Purpose

`MenuItem` is the Neo-Lite interactive item primitive used inside Menu surfaces.

This specification includes support for an optional leading decoration/icon while preserving the existing visual states and interaction model.

## 2. Figma Source

- File: `Neo-Lite UI Kit`
- File key: `VBhHP72Ge5M22csfOgeXt6`
- Component set node: `2025:10723`
- Selected-with-check usage example: `2077:360`

Updated Figma authoring props:

```ts
type FigmaMenuItemProps = {
  showLeftDecoration?: boolean;
  state?: "Default" | "Hover" | "Focus" | "Disabled" | "Selected";
};
```

Figma defaults:

```ts
showLeftDecoration = false;
state = "Default";
```

Do not expose Figma `state` or `showLeftDecoration` directly in React.

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
gap: spacing/2 = 8px
border-radius: radius/sm = 4px
```

The updated Figma component changes the content gap to 8px.

Do not hard-code the Figma preview width of 236px.

## 5. Leading Decoration Geometry

When present:

```text
decoration container width: 20px
icon/content target: 16 × 16px
internal padding: 2px
gap to label: 8px
```

The decoration must not change the MenuItem minimum height.

Figma uses a 16px icon inside the 20px decoration area.

## 6. Color Tokens

Use existing semantic tokens:

```text
foreground              #000000
background              #ffffff
hover                   #dfdffe
selected                #000000
selected-foreground     #ffffff
focus-ring              #5b5cce
disabled-opacity        30%
```

Do not hard-code state colors in `MenuItem.tsx`.

## 7. States

### Default

```text
background: background
text: foreground
decoration: foreground/currentColor
```

### Hover

```text
background: hover
text: foreground
decoration: foreground/currentColor
```

Use real pointer hover.

### Focus

```text
background: background
text: foreground
focus ring: 0 0 0 2px var(--focus-ring)
decoration: foreground/currentColor
```

Use real `:focus-visible`.

### Selected

```text
background: selected
text: selected-foreground
decoration: selected-foreground/currentColor
```

The selected example at Figma node `2077:360` shows a leading check icon.

The check icon is an example of using the decoration slot; it is not automatically injected by MenuItem.

### Disabled

```text
background: background
text: foreground
opacity: var(--disabled-opacity)
```

Disabled must not activate or receive hover styling.

## 8. Recommended React API

```ts
export interface MenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  leadingDecoration?: React.ReactNode;
}
```

Render a real:

```html
<button type="button">
```

by default.

Recommended defaults:

```ts
type = "button";
selected = false;
```

Do not add:

```text
state
variant
isHovered
isFocused
isDisabled
showLeftDecoration
leftIconName
iconType
```

The presence of `leadingDecoration` determines whether the decoration is shown.

## 9. Leading Decoration Slot

Expose:

```ts
leadingDecoration?: React.ReactNode;
```

Render it before the label.

Example:

```tsx
<MenuItem leadingDecoration={<Icon aria-hidden />}>
  Label
</MenuItem>
```

The component owns the geometry:

```text
20px decoration area
16px visual target
2px internal padding
8px gap to label
```

Consumers provide the actual decoration content.

## 10. Selected Check Example

The updated Figma usage example shows:

```text
Selected MenuItem
├── check icon
└── Label
```

Expected React usage:

```tsx
<MenuItem
  selected
  leadingDecoration={<CheckIcon aria-hidden />}
>
  Label
</MenuItem>
```

Important:

- `selected` does not automatically render a check icon.
- Parent components such as Selection decide whether selected items should include a check.
- This keeps MenuItem reusable for selected states where no icon is desired.

## 11. Decoration Colour

The decoration should inherit the item's current foreground wherever possible.

Prefer icon components that use:

```css
currentColor
```

Expected inheritance:

```text
Default / Hover / Focus / Disabled
→ foreground

Selected
→ selected-foreground
```

Do not hard-code icon fill/stroke to black or white inside MenuItem.

## 12. Decoration Accessibility

Do not automatically force arbitrary decoration content to `aria-hidden`.

For decorative icons, consumer usage should be:

```tsx
<CheckIcon aria-hidden />
```

If the decoration conveys unique information not already communicated by the item label or selected semantics, the consumer remains responsible for making it accessible.

The decoration must not become a separate interactive target.

## 13. Selected State

Expose:

```ts
selected?: boolean;
```

When selected:

```text
background: var(--selected)
color: var(--selected-foreground)
```

If used in an accessibility pattern such as Selection/listbox, the controlling parent should expose the appropriate semantic selected state, such as `aria-selected`.

Do not have standalone MenuItem guess the parent selection model.

## 14. Disabled

Use native:

```tsx
disabled
```

when rendered as a button.

Apply whole-item 30% opacity.

Disabled should not:

- activate
- receive hover styling
- receive interactive focus styling

Do not add `isDisabled`.

## 15. Hover

Use real hover:

```text
hover background = var(--hover)
```

Do not expose `state="Hover"`.

Disabled hover must not override disabled appearance.

## 16. Focus

Use `:focus-visible`.

Focus effect:

```css
box-shadow: 0 0 0 2px var(--focus-ring);
```

Do not clip the outer focus ring.

Do not expose `state="Focus"`.

## 17. Width and Layout

Production MenuItem should fill its Menu container:

```text
width: 100%
```

Text should flex to use remaining space.

Leading decoration should remain fixed at its 20px geometry.

Do not hard-code 236px.

## 18. Motion

No Menu Item motion is defined in Figma.

Do not add Button-style lift or translation.

## 19. Storybook

Recommended compact structure:

```text
Components
└── Menu Item
    ├── Playground
    ├── With Decoration
    └── Selected
```

### Playground

Controls:

```text
children
disabled
selected
```

Use real hover and focus interaction.

Do not expose arbitrary ReactNode decoration through a text control.

### With Decoration

Example:

```tsx
<MenuItem leadingDecoration={<ExampleIcon aria-hidden />}>
  Label
</MenuItem>
```

Use an existing stable project icon.

### Selected

Demonstrate the Figma usage:

```tsx
<MenuItem
  selected
  leadingDecoration={<CheckIcon aria-hidden />}
>
  Label
</MenuItem>
```

Verify that the icon inherits `selected-foreground`.

## 20. Selection Integration

Selection may use the leading decoration slot to show a check icon for the selected option.

Conceptually:

```tsx
<MenuItem
  selected={isSelected}
  leadingDecoration={
    isSelected ? <CheckIcon aria-hidden /> : undefined
  }
>
  {option.label}
</MenuItem>
```

However, if Selection uses a listbox/select primitive that does not literally render the standalone MenuItem button, reuse the MenuItem visual contract and leading-decoration geometry on that primitive.

Accessibility semantics take priority over mechanically reusing the button DOM element.

## 21. Accessibility

When used standalone:

1. Render a real button.
2. Default to `type="button"`.
3. Support keyboard activation.
4. Support native disabled.
5. Preserve ARIA/data props.
6. Use `:focus-visible`.
7. Preserve `leadingDecoration`.
8. Decorative icons should be hidden from assistive technology by the consumer.
9. Decoration must not be separately interactive.
10. Parent interaction patterns remain responsible for selected semantics.

## 22. Acceptance Criteria

1. Minimum height is 36px.
2. Horizontal padding is 12px.
3. Vertical padding is 8px.
4. Content gap is 8px.
5. Radius is 4px.
6. Typography uses Neo-Lite `small`.
7. Default matches Figma.
8. Hover uses `--hover`.
9. Focus uses standard 2px focus ring.
10. Selected uses `--selected` / `--selected-foreground`.
11. Disabled uses 30% opacity.
12. Disabled does not hover/activate.
13. `leadingDecoration` renders before the label.
14. Decoration container is 20px wide.
15. Decoration target is 16 × 16px.
16. Decoration uses 2px internal padding.
17. Selected check example matches Figma.
18. Selected decoration inherits selected foreground colour.
19. Selected does not automatically inject a check.
20. No public Figma `state` prop.
21. No public `showLeftDecoration` boolean.
22. Width is not hard-coded to 236px.
23. No Button-style motion.
24. No unnecessary dependency.

## 23. Source of Truth

Priority:

1. Neo-Lite Figma Menu Item component (`2025:10723`)
2. Selected-with-check example (`2077:360`)
3. Neo-Lite semantic tokens
4. This specification
5. Implementation
