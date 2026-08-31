# Neo-Lite Selection Component Specification v0.2

## 1. Purpose

`Selection` is the Neo-Lite single-value selection control that opens a dropdown list of options.

It combines:

```text
Selection field
+
Dropdown menu
+
Menu items
```

This specification translates the Figma Selection component into a production React API without mirroring Figma-only authoring props 1:1.

Figma remains the visual/design source of truth. React should expose a semantic selection API.

## 2. Figma Source

- File: `Neo-Lite UI Kit`
- File key: `VBhHP72Ge5M22csfOgeXt6`
- Component set node: `2023:10287`

Figma authoring property:

```ts
type FigmaSelectionProps = {
  state?:
    | "Default"
    | "Filled"
    | "Opened"
    | "Error"
    | "Disabled"
    | "Expanded";
};
```

Figma default:

```ts
state = "Default";
```

These are design-authoring states and should not become the React public API.

## 3. Component Dependencies

Standalone Figma components have now been inspected and specified separately:

```text
Menu
- Figma node: 2025:10333
- Spec: neo-lite-menu-spec-v0.1.md

Menu Item
- Figma node: 2025:10723
- Spec: neo-lite-menu-item-spec-v0.1.md
```

Selection should reuse these visual primitives rather than duplicate their styling.

Recommended architecture:

```text
Menu
├── owns popup-surface visuals
└── does not own popup behaviour

MenuItem
├── owns item geometry and visual states
└── does not own Selection's value model

Selection
├── owns label
├── owns trigger
├── owns open/close behaviour
├── owns selected value
├── owns listbox/select accessibility
└── composes Menu + MenuItem visual contracts
```

Recommended implementation dependency order:

```text
Menu
→ MenuItem
→ Selection
```

The standalone primitives establish the visual contracts. Selection remains responsible for the higher-level select/listbox behaviour.

## 4. Visual Anatomy

```text
Selection field
├── Label
├── Trigger
│   ├── Value / placeholder
│   └── Chevron
└── Dropdown menu (when expanded)
    ├── Menu item
    ├── Menu item
    └── Menu item
```

The Figma preview width is:

```text
254px
```

This is demonstration geometry and should not be hard-coded in production.

The component should naturally fill its parent.

## 5. Typography

All Selection text uses the Neo-Lite semantic `small` typography style:

```text
Font family: Nokora
Weight: 400
Size: 14px
Line height: 160%
Letter spacing: 0
```

Used for:

- label
- placeholder
- selected value
- menu item text

Do not document or expose the lower-level Figma variable name as the semantic typography API.

## 6. Field Wrapper Geometry

```text
display: flex
direction: column
gap: spacing/1 = 4px
width: 100%
```

## 7. Trigger Geometry

The trigger visually matches the Neo-Lite Input control foundation:

```text
background: background
border: 1px solid border
border-radius: radius/sm = 4px
padding: spacing/2 = 8px
gap: spacing/2 = 8px
width: 100%
```

The value area adds horizontal padding:

```text
spacing/1 = 4px
```

The right decoration area uses:

```text
width: 20px
internal padding: 2px
icon size: 16px
```

## 8. Trigger Content

### Placeholder

```text
color: placeholder
```

### Selected value

```text
color: foreground
```

### Chevron

Closed state:

```text
chevron-down
```

Expanded state:

```text
chevron-up
```

Use a stable project asset or matching project icon.

Do not commit temporary Figma MCP asset URLs.

## 9. Trigger States

React should derive states from semantic props and interaction rather than expose a public `state` prop.

### Default

```text
label: foreground
placeholder: placeholder
border: border
focus ring: none
```

### Filled

```text
label: foreground
value: foreground
border: border
```

### Opened / Expanded

Figma uses:

```text
border: border
focus ring: 0 0 0 2px var(--focus-ring)
```

The expanded trigger shows chevron-up.

Do not clip the outer focus ring.

### Error

```text
label: error
value: foreground
border: destructive-border
```

The inspected Selection component does not show an error message area.

### Disabled

Apply:

```css
opacity: var(--disabled-opacity);
```

to the whole field.

The trigger must not open when disabled.

## 10. Dropdown Menu Composition

When expanded, Selection composes the standalone Neo-Lite `Menu` primitive.

Selection should not reproduce Menu surface classes independently.

The `Menu` visual contract is defined by:

```text
neo-lite-menu-spec-v0.1.md
```

Key Menu geometry:

```text
background: background
border: 1px solid border
border-radius: radius/sm = 4px
padding: spacing/2 = 8px
hard shadow: box-shadow-1
width: 100%
```

Figma hard shadow:

```css
box-shadow: 3px 3px 0 0 var(--shadow-color);
```

The Menu must align to the Selection trigger width.

Do not hard-code the Figma preview width of 254px.

Selection owns popup positioning and open/close behaviour; `Menu` owns only the popup surface visuals.

## 11. Menu Item Composition

Selection options should use the standalone Neo-Lite `MenuItem` visual contract.

The `MenuItem` contract is defined by:

```text
neo-lite-menu-item-spec-v0.1.md
```

Key geometry:

```text
min-height: 36px
width: 100%
horizontal padding: spacing/3 = 12px
vertical padding: spacing/2 = 8px
gap: spacing/3 = 12px
border-radius: radius/sm = 4px
```

The standalone Menu Item defines these visual states:

```text
Default
Hover
Focus
Disabled
Selected
```

Their production equivalents must come from real interaction and semantic state:

```text
Default  → normal option
Hover    → real pointer hover
Focus    → real keyboard/focus state
Disabled → option disabled state, when supported
Selected → option value matches Selection value
```

Selection must not expose Figma-style MenuItem `state` props.

### Selected option

Selected MenuItem visuals:

```text
background: selected
foreground: selected-foreground
```

The controlling Selection/listbox implementation must also expose the correct semantic selected state, such as `aria-selected`, when appropriate.

### Hover

Hover uses:

```text
background: hover
foreground: foreground
```

### Focus

Focus uses:

```text
0 0 0 2px var(--focus-ring)
```

Do not clip the outer focus ring.

### Disabled option

The standalone MenuItem design includes a disabled state using:

```text
opacity: var(--disabled-opacity)
```

Therefore Selection options may support per-option disabled state in v0.2.

## 12. Menu Positioning

The dropdown menu should open below the trigger and align to its width.

The implementation must not affect surrounding document layout in a way that differs from expected dropdown behaviour.

Prefer a proper positioning primitive if the project already uses one.

If no positioning library exists, implement the simplest robust solution consistent with the codebase.

Do not add a dependency without a demonstrated need.

## 13. Recommended Data Model

Selection should work from option data rather than requiring consumers to manually construct Menu/MenuItem nodes.

The standalone MenuItem design now establishes a disabled item state, so the v0.2 option model may include:

```ts
export interface SelectionOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}
```

`disabled` is optional.

Do not add additional option-level features until corresponding designs exist, such as:

```text
icon
description
destructive
group
separator
submenu
```

## 14. Recommended React API

```ts
export interface SelectionOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectionProps {
  options: SelectionOption[];

  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;

  label?: React.ReactNode;
  placeholder?: React.ReactNode;
  error?: boolean;
  disabled?: boolean;

  name?: string;
  required?: boolean;

  className?: string;
}
```

Recommended default:

```ts
placeholder = "Select an option";
```

Do not expose:

```text
state
opened
expanded
filled
showChevron
```

Visual state should be derived from:

```text
value/defaultValue
open state
error
disabled
```

## 15. Controlled and Uncontrolled Value

Support:

```tsx
<Selection
  options={options}
  value={value}
  onValueChange={setValue}
/>
```

and:

```tsx
<Selection
  options={options}
  defaultValue="item-1"
/>
```

Do not require consumers to manually pass selected label text separately from the selected value.

The component should resolve the selected label from `options`.

## 16. Open State

Open/closed state should normally remain internal.

Do not expose `state="Opened"` or `state="Expanded"`.

For v0.1, a public controlled `open` API is not required unless the chosen implementation primitive naturally exposes and benefits from it.

If later needed, this can evolve to:

```ts
open?: boolean;
defaultOpen?: boolean;
onOpenChange?: (open: boolean) => void;
```

Do not add these prematurely.

## 17. Error State

Expose:

```ts
error?: boolean;
```

because the current Figma Selection shows only error styling and no error message area.

When `error` is true:

- label uses `--error`
- trigger border uses `--destructive-border`
- set appropriate `aria-invalid`

Do not add an `errorMessage` prop until supporting text is intentionally designed.

## 18. Disabled State

Expose:

```ts
disabled?: boolean;
```

Disabled behaviour:

- whole Selection field uses 30% opacity
- trigger cannot open
- keyboard interaction is blocked
- selected value / placeholder remains visible
- chevron remains visible

## 19. Label

Unlike Checkbox, the Selection Figma component includes its own label.

So the Selection API should own:

```ts
label?: React.ReactNode;
```

The label must be programmatically associated with the trigger/control.

If the implementation uses a button-based trigger, use `aria-labelledby`.

## 20. Native Select vs Custom Select

The Figma component includes a custom dropdown menu, focus treatment, hard shadow, and custom menu item geometry.

A plain native:

```html
<select>
```

will not reproduce this reliably across browsers.

Therefore the recommended implementation is a custom accessible select/listbox pattern rather than styling a native select.

The implementation must preserve:

- accessible name
- keyboard navigation
- open/close semantics
- selected state
- disabled state
- form compatibility where appropriate

Do not implement the trigger/menu as arbitrary divs without correct ARIA and keyboard behaviour.


### Primitive composition

The accessible Selection implementation should reuse the Neo-Lite Menu and MenuItem visual contracts while allowing the chosen accessibility primitive to own the required DOM roles and interaction model.

Do not sacrifice correct select/listbox semantics solely to reuse the standalone MenuItem's default element type.

## 21. Accessibility Pattern

Recommended semantics:

```text
button / combobox trigger
+
listbox popup
+
option items
```

Depending on the implementation primitive, ensure equivalent ARIA semantics.

Expected behaviour:

- Enter / Space opens
- Arrow keys navigate options
- Escape closes
- selected option is announced
- disabled prevents interaction
- focus returns appropriately on close
- trigger exposes expanded state
- popup relationship is communicated

Do not hand-roll a complex accessibility state machine if the project already uses a trusted primitive.

## 22. Form Integration

Because Selection behaves like a form field, support:

```ts
name?: string;
required?: boolean;
```

If the custom selection primitive does not participate in native form submission automatically, synchronize the selected value via an internal hidden input:

```html
<input type="hidden" name="..." value="..." />
```

Only render that hidden input when `name` is supplied.

## 23. className Behaviour

Recommended:

```text
className
```

applies to the outer field wrapper.

The trigger should continue to fill the wrapper width.

Do not introduce multiple styling props in v0.1.

## 24. Width

Production:

```text
width: 100%
```

Figma preview:

```text
254px
```

The preview width is not a component contract.

Do not add:

```ts
fullWidth?: boolean;
```

## 25. Motion

No opening/closing animation is defined in the inspected Selection Figma component.

For v0.1:

```text
no Button-style lift
no translate
no animated hard shadow
no arbitrary dropdown animation
```

State changes may be immediate.

Any future menu motion should first be designed and tokenised.

## 26. Storybook Requirements

Recommended compact structure:

```text
Components
└── Selection
    ├── Playground
    ├── Error
    └── Disabled
```

The Playground should use realistic option data including:

```text
normal options
one selected option
at least one disabled option
```

Expose meaningful controls such as:

```text
label
placeholder
disabled
error
required
```

Use real selection interaction.

Do not create fake stories or public props for:

```text
Filled
Opened
Expanded
Hover
Focus
Selected
```

These states should emerge naturally from value and real interaction.

The Playground should make it possible to validate:

```text
placeholder
selected value
open menu
hovered item
keyboard-focused item
selected item
disabled item
error trigger
disabled Selection
```

## 27. Menu / MenuItem Integration Rules

The standalone Menu and MenuItem components have been inspected and specified.

Selection should consume those visual contracts rather than duplicate them.

### Menu

Selection provides:

```text
open/close state
positioning
popup relationship
listbox/select semantics
```

Menu provides:

```text
background
border
radius
padding
hard shadow
container layout
```

### MenuItem

Selection provides:

```text
option value
selected state
disabled state
keyboard navigation
ARIA option semantics
selection callbacks
```

MenuItem provides:

```text
item geometry
typography
default styling
hover styling
focus styling
selected styling
disabled styling
```

### Semantic adaptation

Do not force the standalone MenuItem's default `<button>` implementation into Selection if that creates invalid or awkward listbox semantics.

If the accessible select/listbox primitive renders its own option element, apply/reuse the MenuItem visual classes or styling contract on that option primitive.

In other words:

```text
reuse MenuItem design contract
≠
necessarily nest a button inside every option
```

Accessibility semantics take priority over mechanically reusing a DOM element.

## 28. Acceptance Criteria

1. Label matches Figma.
2. Placeholder uses semantic placeholder colour.
3. Filled value uses foreground.
4. Trigger geometry matches Input-style 8px padding / 4px radius.
5. Chevron is 16px inside a 20px decoration area.
6. Open trigger uses the Neo-Lite purple focus ring.
7. Expanded state swaps chevron-down to chevron-up.
8. Menu aligns to trigger width.
9. Menu uses 8px padding.
10. Menu uses 1px border.
11. Menu uses 4px radius.
12. Menu uses 3px hard shadow.
13. Menu items have minimum height 36px.
14. Menu item padding matches 12px horizontal / 8px vertical.
15. Menu item hover uses `--hover`.
16. Keyboard focus uses the standard Neo-Lite focus ring.
17. Selected option uses `--selected` / `--selected-foreground`.
18. Selected option exposes the correct semantic selected state.
19. Disabled option uses MenuItem disabled styling and cannot be selected.
20. Error label uses `--error`.
21. Error trigger border uses `--destructive-border`.
22. Disabled field uses 30% opacity.
23. Disabled Selection cannot open.
24. No public Figma `state` prop exists.
25. Selection supports controlled value.
26. Selection supports uncontrolled default value.
27. Selected label resolves from option data.
28. Keyboard interaction is accessible.
29. Popup semantics are accessible.
30. Menu visual styling is sourced from the Menu primitive/contract rather than duplicated.
31. Option visual styling is sourced from the MenuItem primitive/contract rather than duplicated.
32. No hard-coded 254px production width.
33. No Button-style motion is introduced.
34. No temporary Figma asset URLs remain in committed code.
35. No unnecessary dependency is added.

## 29. Design-to-Code Token Reference

Figma variables used:

```text
foreground               #000000
small                    Nokora Regular / 14px / 160%
placeholder              #737373
spacing/1                4px
spacing/2                8px
spacing/3                12px
3xs                      2px
radius/sm                4px
background               #ffffff
border                   #000000
focus-ring               #5b5cce
shadow-color             #000000
box shadow 1 x           3px
box shadow 1 y           3px
error                    #d40511
destructive-border       #d40511
disabled-opacity         30%
```

Effects:

```text
focus-1
0 0 0 2px focus-ring

box-shadow-1
3px 3px 0 0 shadow-color
```

## 30. v0.1 Scope

Included:

```text
single-value selection
label
placeholder
selected value
open/close
dropdown menu
menu items
menu item hover/focus/selected states
disabled options
error visual state
disabled
controlled value
uncontrolled value
keyboard accessibility
form field naming
```

Excluded until intentionally designed:

```text
multi-select
searchable select
free text
grouped options
option icons
option descriptions
menu separators
submenus
async options
loading
clear button
multiple sizes
error message
custom menu motion
```

## 31. Source of Truth

Priority order:

1. Neo-Lite Figma Selection component
2. Neo-Lite Figma Menu component + `neo-lite-menu-spec-v0.1.md`
3. Neo-Lite Figma Menu Item component + `neo-lite-menu-item-spec-v0.1.md`
4. Neo-Lite CSS semantic tokens
5. This specification
6. React implementation details

If implementation conflicts with Figma, Figma wins.
