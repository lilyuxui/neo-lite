# Neo-Lite Dialog Component Specification v0.1

## 1. Purpose

`Dialog` is the Neo-Lite modal surface used to present focused content that requires user attention before returning to the underlying interface.

The Figma component defines the dialog shell, header, content area, close control, and footer actions.

The production React implementation should preserve proper modal accessibility and focus management rather than treating Dialog as a purely visual container.

## 2. Figma Source

- File: `Neo-Lite UI Kit`
- File key: `VBhHP72Ge5M22csfOgeXt6`
- Component node: `2026:11048`

Figma authoring API:

```ts
type FigmaDialogProps = {
  className?: string;
  children?: React.ReactNode | null;
};
```

The design contains:

```text
Dialog
├── Modal overlay
├── Header
│   ├── Title
│   └── Dismiss button
├── Content
│   └── Slot / children
└── Footer
    ├── Cancel button
    └── Submit button
```

## 3. Overall Geometry

Figma dialog shell:

```text
width: 640px
background: var(--card)
border: 1px solid var(--border)
border-radius: var(--radius-md) = 8px
box-shadow: var(--shadow-2)
display: flex
direction: column
overflow: hidden
```

Production should not hard-code 640px as the only possible width.

Recommended default behaviour:

```text
width: min(640px, available viewport width - safe margin)
```

The component should remain responsive on narrow screens.

## 4. Modal Overlay

Dialog should render above a modal overlay that covers the viewport.

Overlay:

```text
position: fixed
inset: 0
background: rgba(0, 0, 0, 0.2)
```

The overlay must block pointer interaction with background content while the Dialog is open.

Clicking the overlay may dismiss the Dialog by calling:

```ts
onOpenChange(false)
```

## 5. Header

Header:

```text
padding: spacing/4 = 16px
border-bottom: 1px solid var(--border)
width: 100%
```

Header row:

```text
display: flex
align-items: center
justify-content: space-between
```

### Title

Use Neo-Lite `h4` typography:

```text
Font family: Nokora
Weight: 700
Size: 20px
Line height: 140%
Letter spacing: 0
Color: var(--card-foreground)
```

## 6. Dismiss Button

The Figma design uses a 24 × 24px `Icon / x` inside a designed dismiss button.

The production implementation should expose a real interactive close button, not a bare icon.

Recommended visual target:

```text
icon: 24 × 24px
button padding: 2px
button radius: var(--radius-full)
```

Dismiss button states:

```text
Default:
  background: transparent
  border: 2px solid transparent

Hover:
  background: var(--hover)
  border: 2px solid transparent

Focus:
  background: transparent
  border: 2px solid var(--focus-ring)

Focus-hover:
  background: var(--hover)
  border: 2px solid var(--focus-ring)
```

Focus styling should use native focus-visible behaviour.

The close button must have an accessible name such as:

```text
aria-label="Close dialog"
```

Reuse a stable project close icon if available.

Do not commit temporary Figma MCP asset URLs.

## 7. Content Area

Content section:

```text
padding: spacing/4 = 16px
border-bottom: 1px solid var(--border)
width: 100%
```

The Figma example uses a 234px-high placeholder slot. This is demonstration geometry, not a production height contract.

Production content should size naturally.

Recommended:

```text
content width: 100%
content height: auto
```

If content can become large, allow the body area to scroll without scrolling the whole page behind the dialog.

If the Dialog has no footer, the content section should not render a bottom divider that visually stacks with the Dialog shell border.

## 8. Footer

Footer:

```text
padding: 16px
width: 100%
```

Action row:

```text
display: flex
gap: 8px
align-items: center
justify-content: flex-end
```

The Figma example uses:

```text
Cancel → secondary Button
Submit → primary Button
```

The production Dialog should reuse the existing Neo-Lite `Button` component rather than reimplement button styling.

## 9. Recommended React API

Recommended v0.1 API:

```ts
export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: React.ReactNode;
  children: React.ReactNode;

  footer?: React.ReactNode;

  closeLabel?: string;
  className?: string;
}
```

Recommended default:

```ts
closeLabel = "Close dialog";
```

Usage:

```tsx
<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Edit profile"
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </>
  }
>
  <ProfileForm />
</Dialog>
```

## 10. Why Footer Is a Slot

Do not hard-code `Cancel` and `Submit` props into the Dialog API.

Prefer:

```ts
footer?: React.ReactNode;
```

This allows:

```text
one action
two actions
three actions
destructive confirmation
custom button labels
loading actions
no footer
```

while keeping Dialog focused on layout and modal behaviour.

## 11. Why Title Is a Prop

The Figma component defines a first-class title in its header.

Expose:

```ts
title: React.ReactNode;
```

rather than requiring consumers to manually construct the entire header.

This enables consistent title semantics and accessible labelling.

## 12. Open State

Dialog should support controlled open state:

```ts
open: boolean;
onOpenChange: (open: boolean) => void;
```

For v0.1, controlled state is sufficient.

Do not add `defaultOpen` unless the project already has a strong uncontrolled-dialog convention.

## 12. Modal Semantics

Dialog must behave as a true modal.

Use appropriate semantics:

```text
role="dialog"
aria-modal="true"
```

The dialog title must label the dialog through:

```text
aria-labelledby
```

or equivalent semantics provided by a trusted dialog primitive.

## 13. Focus Management

When opened:

```text
focus moves into the dialog
```

While open:

```text
keyboard focus remains trapped within the dialog
```

When closed:

```text
focus returns to the element that opened it
```

Do not hand-roll fragile focus trapping if a trusted accessible dialog primitive is already installed.

## 14. Keyboard Interaction

Required:

```text
Escape
→ closes the dialog
```

Close button activation also closes.

Footer actions may close or remain open depending on consumer logic.

## 15. Backdrop / Overlay

The inspected Figma node shows the dialog shell itself but does not define an overlay/backdrop token or visual.

Do not invent a strong visual overlay style without design guidance.

However, a modal implementation may still require an interaction-blocking overlay layer.

If the chosen accessible primitive requires an overlay, keep it visually minimal and consistent with existing project conventions.

Do not introduce a new semantic overlay token unless intentionally designed.

## 16. Outside Click

Recommended v0.1 behaviour:

```text
outside pointer interaction may close
```

only if this matches the chosen accessible primitive and project conventions.

Do not let outside click bypass explicit `onOpenChange`.

If the project prefers persistent confirmation dialogs later, that behaviour can be made configurable in a future version.

## 17. Width and Responsiveness

Figma width:

```text
640px
```

Production recommendation:

```text
max-width: 640px
width: calc(100% - safe horizontal margin)
```

Do not force 640px on narrow screens.

No public `size` prop is required in v0.1.

## 18. Reuse Existing Components

Reuse the existing Neo-Lite `Button` component in Dialog Storybook/examples.

Do not copy Button classes into Dialog.

If an existing accessible Dialog primitive/library is already installed, prefer adapting it to Neo-Lite visuals rather than recreating focus trap / portal / Escape behaviour manually.

## 19. Portal

A production modal should normally render in a portal or equivalent top-level layer so it is not clipped by ancestor overflow or stacking contexts.

Prefer existing project/primitive portal behaviour.

Do not add unnecessary custom portal infrastructure if the chosen dialog primitive already handles it.

## 20. Z-Index / Layering

Dialog must appear above page content and prevent background interaction.

Use the project's existing layering conventions if present.

Do not invent a broad z-index scale solely for this component.

## 21. Scrolling

For large content:

```text
header stays at top of dialog
footer stays at bottom
body may scroll
```

Do not allow the underlying page to scroll as the primary interaction while a modal is open if the chosen primitive already handles scroll locking.

## 22. Motion

No Dialog animation is defined in the inspected Figma component.

For v0.1:

```text
no scale animation
no fade animation requirement
no slide animation
no Button-style movement
```

If an existing dialog primitive has default motion, disable or minimize it unless it is already consistent with project conventions.

Do not invent motion tokens.

## 23. className Behaviour

`className` applies to the visible dialog surface.

Do not use it for the overlay.

Preserve consumer styling hooks without allowing them to bypass essential accessibility behaviour.

## 24. Suggested Storybook Structure

Keep it compact:

```text
Components
└── Dialog
    ├── Playground
    ├── Long Content
    └── Without Footer
```

### Playground

Include a real trigger button that opens the Dialog.

Example:

```tsx
<Button onClick={() => setOpen(true)}>
  Open dialog
</Button>
```

Dialog:

```tsx
<Dialog
  open={open}
  onOpenChange={setOpen}
  title="This is the dialog title"
  footer={
    <>
      <Button
        variant="secondary"
        onClick={() => setOpen(false)}
      >
        Cancel
      </Button>

      <Button variant="primary">
        Submit
      </Button>
    </>
  }
>
  Dialog content
</Dialog>
```

Use actual open/close interaction rather than fake Storybook visual states.

### Long Content

Demonstrate body scrolling and responsive height behaviour.

### Without Footer

Verify footer is omitted cleanly when `footer` is undefined.

## 25. Accessibility Requirements

1. Dialog uses correct modal semantics.
2. Title labels the dialog.
3. Close button has accessible name.
4. Focus enters dialog when opened.
5. Focus is trapped while open.
6. Escape closes.
7. Focus returns to trigger when closed.
8. Background interaction is blocked while open.
9. Footer buttons remain normal accessible Button components.
10. Content remains keyboard reachable.
11. Close icon itself is decorative; button owns accessible label.

## 26. Acceptance Criteria

1. Surface uses `--card`.
2. Text uses `--card-foreground`.
3. Border is 1px `--border`.
4. Radius is 8px.
5. Header padding is 16px.
6. Header has bottom border.
7. Title uses Neo-Lite `h4`.
8. Close icon is 16px.
9. Close control is a real accessible button.
10. Content padding is 16px.
11. Content height is not hard-coded to 234px.
12. Content section has bottom border.
13. Footer padding is 16px.
14. Footer action gap is 8px.
15. Footer actions align right.
16. Existing Button component is reused.
17. Default desktop max width matches 640px design.
18. Narrow-screen width is responsive.
19. `open` controlled state works.
20. `onOpenChange` works.
21. Escape closes.
22. Close button closes.
23. Focus trapping works.
24. Focus restoration works.
25. Correct dialog ARIA semantics exist.
26. Footer can be omitted.
27. No fake visual state prop exists.
28. No Figma placeholder height is hard-coded.
29. No unnecessary dependency is added.
30. No temporary Figma asset URLs remain.

## 27. Source of Truth

Priority:

1. Neo-Lite Figma Dialog (`2026:11048`)
2. Existing Neo-Lite Button component/spec
3. Neo-Lite semantic tokens
4. This specification
5. React implementation
