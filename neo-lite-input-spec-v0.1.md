# Neo-Lite Input Component Specification v0.1

## 1. Purpose

`Input` is the Neo-Lite single-line text-entry control.

This specification translates the Figma Input component into a production React API without mirroring Figma-only authoring props 1:1.

Figma remains the visual/design source of truth. React should expose a natural HTML-first API.

## 2. Figma Source

- File: `Neo-Lite UI Kit`
- File key: `VBhHP72Ge5M22csfOgeXt6`
- Component set node: `2008:1798`

Figma component properties:

```ts
type FigmaInputProps = {
  showLeftDecoration?: boolean;
  showRightDecoration?: boolean;
  state?:
    | "placeholder"
    | "default"
    | "focus"
    | "error"
    | "error-focus"
    | "disabled";
};
```

Figma defaults:

```ts
showLeftDecoration = false;
showRightDecoration = false;
state = "placeholder";
```

These describe Figma authoring states and should not become the public React API directly.

## 3. Visual Anatomy

```text
Input field
├── Label
├── Control
│   ├── Optional left decoration
│   ├── Native input
│   └── Optional right decoration
└── Hint / error message
```

The Figma examples use a fixed demonstration width of `254px`, but production should not hard-code this width. The component should naturally fill its parent.

## 4. Typography

All Input text uses the Neo-Lite `small` typography style:

```text
Font family: Nokora
Weight: 400
Size: 14px
Line height: 160%
Letter spacing: 0
```

Used for:

- label
- input value
- placeholder
- hint text
- error message

The component specification references the semantic Neo-Lite `small` typography style rather than the lower-level Figma variable that supplies its font-size value.

## 5. Spacing and Geometry

### Field wrapper

Vertical gap between label → control and control → hint:

```text
spacing/1 = 4px
```

### Control

```text
padding: spacing/2 = 8px
gap: spacing/2 = 8px
border: 1px solid
radius: radius/sm = 4px
background: background = #ffffff
```

The inner text area adds horizontal padding:

```text
spacing/1 = 4px
```

### Decorations

Figma decoration geometry:

```text
decoration container width: 20px
decoration internal padding: 2px
icon size: 16px
```

Left and right decorations are optional.

## 6. Color Tokens

The component uses existing Neo-Lite semantic tokens:

```css
--background: #ffffff;
--foreground: #000000;
--placeholder: #737373;
--border: #000000;
--muted-foreground: #888888;
--focus-ring: #5b5cce;
--error: #d40511;
--destructive-border: #d40511;
--disabled-opacity: 0.3;
```

No new component-specific color tokens are required for v0.1.

## 7. States

Figma defines six authoring states:

```text
placeholder
default
focus
error
error-focus
disabled
```

React should derive these from native input behaviour and props rather than exposing a public `state` prop.

### Placeholder

- label: foreground
- control border: standard border
- placeholder: placeholder color
- hint: muted foreground
- no focus ring

### Default

- label: foreground
- control border: standard border
- value: foreground
- hint: muted foreground
- no focus ring

### Focus

- standard border remains visible
- focus ring: `0 0 0 2px var(--focus-ring)`
- value: foreground
- label: foreground
- hint: muted foreground

Use native focus / `:focus-visible`; do not expose `state="focus"`.

### Error

- label: error
- control border: destructive-border
- value: foreground
- supporting/error message: error

### Error + Focus

- label: error
- control border: destructive-border
- focus ring uses destructive focus
- value: foreground
- supporting/error message: error

Use the existing Neo-Lite destructive focus token if already defined:

```css
--destructive-focus: #ffa7ac;
--destructive-focus-shadow: 0 0 0 2px var(--destructive-focus);
```

Do not hard-code `#ffa7ac` in `Input.tsx`.

### Disabled

The whole field uses:

```css
opacity: var(--disabled-opacity);
```

The native input must use the real HTML `disabled` attribute.

Disabled must not receive interactive focus styling.

## 8. Label

Recommended API:

```tsx
<Input
  label="Email"
  id="email"
/>
```

The implementation should correctly associate label and control:

```html
<label for="email">Email</label>
<input id="email" />
```

If no id is supplied, generate a stable id with React `useId()`.

## 9. Hint and Error Message

Recommended normal supporting text:

```tsx
<Input
  label="Email"
  hint="We'll never share your email."
/>
```

Recommended error:

```tsx
<Input
  label="Email"
  error="Enter a valid email address."
/>
```

Rule:

```text
error takes precedence over hint
```

Do not expose `state="error"` publicly.

## 10. Recommended React API

```ts
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  leadingDecoration?: React.ReactNode;
  trailingDecoration?: React.ReactNode;
  containerClassName?: string;
}
```

Examples:

```tsx
<Input
  label="Email"
  placeholder="you@example.com"
  hint="Use your work email."
/>
```

```tsx
<Input
  label="Email"
  defaultValue="wrong"
  error="Enter a valid email address."
/>
```

```tsx
<Input
  label="Search"
  leadingDecoration={<SearchIcon />}
  trailingDecoration={<ClearButton />}
/>
```

Do not expose:

```text
state
showLeftDecoration
showRightDecoration
```

Retain native attributes such as:

```text
type
name
value
defaultValue
placeholder
disabled
required
readOnly
autoComplete
inputMode
aria-*
data-*
```

## 11. `className` Behaviour

Recommended distinction:

```text
className
```

applies to the native `<input>` element.

```text
containerClassName
```

applies to the outer field wrapper.

If the library already has a different wrapper-level convention, stay consistent instead of introducing unnecessary props.

## 12. Error Semantics and Accessibility

When `error` is present:

- set `aria-invalid="true"`
- associate the error text with `aria-describedby`
- preserve consumer-provided `aria-describedby`
- give the error message a stable id

When only `hint` is present:

- associate it via `aria-describedby`

Example:

```html
<label for="email">Email</label>
<input
  id="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<p id="email-error">Enter a valid email address.</p>
```

Do not rely on color alone to communicate invalid state.

## 13. Decorations

React should accept content rather than Figma visibility booleans:

```tsx
leadingDecoration?: React.ReactNode;
trailingDecoration?: React.ReactNode;
```

Rules:

- Input owns decoration geometry
- icons should inherit `currentColor` where practical
- decorative icons should be hidden from assistive technology
- interactive trailing content must remain keyboard accessible
- do not use expiring Figma MCP asset URLs in committed code

## 14. Width

Figma preview width:

```text
254px
```

This is demonstration layout, not a component contract.

Production should naturally fill the parent:

```css
width: 100%;
```

Do not add a `fullWidth` prop in v0.1.

## 15. Size Variants

The inspected Figma Input currently defines one size only.

Do not introduce:

```ts
size?: "xs" | "sm" | "lg";
```

until corresponding Input sizes are designed in Figma.

## 16. Motion

No Input motion interaction is defined in the inspected component.

Do not automatically reuse Button's hover-lift treatment.

For v0.1:

```text
no hover lift
no hard hover shadow
no Button-style transform
```

Any future Input motion should first be intentionally designed and tokenised.

## 17. Focus Shadow Mapping

Standard focus:

```css
box-shadow: var(--focus-shadow);
```

Error focus:

```css
box-shadow: var(--destructive-focus-shadow);
```

If already bridged to Tailwind, preferred utilities are conceptually:

```text
focus-visible:shadow-focus
focus-visible:shadow-destructive-focus
```

Do not duplicate raw box-shadow values in `Input.tsx`.

## 18. Suggested Implementation Structure

```text
field wrapper
label
control shell
leading decoration
native input
trailing decoration
supporting message
```

Conceptually:

```tsx
<div className={fieldClasses}>
  {label && (
    <label htmlFor={inputId} className={labelClasses}>
      {label}
    </label>
  )}

  <div className={controlClasses}>
    {leadingDecoration && (
      <span className={decorationClasses}>
        {leadingDecoration}
      </span>
    )}

    <input
      id={inputId}
      className={inputClasses}
      {...inputProps}
    />

    {trailingDecoration && (
      <span className={decorationClasses}>
        {trailingDecoration}
      </span>
    )}
  </div>

  {message && (
    <p id={messageId} className={messageClasses}>
      {message}
    </p>
  )}
</div>
```

This is architectural guidance, not code to copy verbatim.

## 19. Storybook Requirements

Keep the submenu compact.

Recommended:

```text
Components
└── Input
    ├── Playground
    ├── With Decorations
    └── Error
```

Or even only `Playground` if it can demonstrate everything cleanly.

Useful controls:

```text
label
placeholder
hint
error
disabled
required
type
```

Do not create fake public state props for:

```text
focus
error-focus
placeholder
```

Focus should be tested with real browser interaction.

A compact QA view may show:

```text
Default
With value
Error
Disabled
Leading decoration
Trailing decoration
Both decorations
```

## 20. Acceptance Criteria

1. Field vertical gap is 4px.
2. Control padding is 8px.
3. Control internal gap is 8px.
4. Radius is 4px.
5. Border is 1px.
6. Typography is Nokora, 14px, 400, 160% line-height.
7. Placeholder uses `--placeholder`.
8. Value uses `--foreground`.
9. Default border uses `--border`.
10. Focus uses Neo-Lite standard focus shadow.
11. Error label uses `--error`.
12. Error border uses `--destructive-border`.
13. Error message uses `--error`.
14. Error + focus uses destructive focus shadow.
15. Disabled uses native `disabled` and whole-field 30% opacity.
16. Labels are programmatically associated with the input.
17. Hint/error text is associated via `aria-describedby`.
18. Error sets `aria-invalid`.
19. Decorations use React-node slots rather than booleans.
20. No public Figma-style `state` prop.
21. Figma preview width of 254px is not hard-coded.
22. No size API before sizes exist in Figma.
23. No new dependency is required.
24. Storybook uses real focus interaction.

## 21. Design-to-Code Token Reference

Figma variables used by this component:

```text
foreground              #000000
placeholder             #737373
spacing/3               12px
spacing/1               4px
spacing/2               8px
radius/sm               4px
background              #ffffff
border                  #000000
muted-foreground        #888888
disabled-opacity        30%
error                   #d40511
destructive-border      #d40511
focus-ring              #5b5cce
```

Figma focus effect:

```text
focus-1
DROP_SHADOW
color: focus-ring
offset: 0,0
blur: 0
spread: 2
```

Use existing Neo-Lite semantic CSS tokens and Tailwind bridge rather than raw values in the component.

## 22. v0.1 Scope

Included:

```text
single-line native input
label
placeholder/value
hint
error
focus
error-focus
disabled
leading decoration
trailing decoration
native HTML input attributes
accessible label/message relationships
```

Excluded until explicitly designed:

```text
multiple sizes
textarea
password reveal behaviour
clear-button behaviour
loading
character counter
prefix/suffix text API
floating labels
Button-style hover motion
fullWidth prop
form-library-specific integrations
```

## 23. Recommended Next Step

Before implementation, confirm these API decisions:

```text
1. Should label be owned by Input? Recommended: yes.
2. Should `error` contain the actual message? Recommended: yes.
3. Keep leading/trailing decoration slots in v0.1? Recommended: yes.
4. Should `className` target the input while `containerClassName` targets the field?
```

Once confirmed, implement `Input.tsx` from this specification and use Storybook as the visual comparison laboratory.
