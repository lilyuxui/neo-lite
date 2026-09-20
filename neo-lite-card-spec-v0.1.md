# Neo-Lite Card Component Specification v0.1

## 1. Purpose

`Card` is a reusable Neo-Lite content container for presenting an image, optional badges, subtitle, title, body content, and footer actions.

The Card component supports the vertical visual variant only:

```text
Vertical
Vertical-hover
```

React should expose semantic content slots rather than a Figma-style combined `variant` state.

## 2. Figma Source

- File: `Neo-Lite UI Kit`
- File key: `VBhHP72Ge5M22csfOgeXt6`
- Component set node: `2028:11305`

Figma authoring props:

```ts
type FigmaCardProps = {
  badge?: React.ReactNode | null;
  content?: React.ReactNode | null;
  image?: boolean;
  variant?:
    | "Vertical"
    | "Vertical-hover";
};
```

These should not map 1:1 to the public React API.

## 3. Recommended React API

```ts
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  image?: React.ReactNode;
  badges?: React.ReactNode;

  subtitle?: React.ReactNode;
  title: React.ReactNode;

  children?: React.ReactNode;
  footer?: React.ReactNode;
}
```

Do not expose:

```text
variant="Vertical-hover"
variant="Horizontal"
variant="Horizontal-hover"
orientation
hovered
image=true/false
badge
content
```

Hover is real interaction, not a public state prop.

## 4. Overall Visual Contract

Card uses:

```text
background: var(--card)
border: 1px solid var(--border)
border-radius: 4px
overflow: hidden
```

Default:

```text
no hard shadow
```

Hover:

```text
box-shadow-2
4px 4px 0 0 var(--shadow-color)
translateY(-4px)
```

Use the existing Neo-Lite semantic mapping where available:

```text
hover:shadow-md
```

The hover transform and shadow should be applied to a visual child inside the
Card while the outer container remains the stable hover target. This prevents
pointer enter/leave loops when the cursor is positioned on the card edge.

## 5. Orientation: Vertical

Figma reference geometry:

```text
width: 343px
height: 492px
```

These are design-example dimensions, not strict production width/height contracts.

Production should preserve the vertical structure while being fully responsive to its parent container.

The Card root should use:

```text
width: 100%
```

and should not own a fixed production width.

Structure:

```text
Card
├── Image
├── Header
│   ├── Badges
│   ├── Subtitle
│   └── Title
├── Content
└── Footer
```

## 7. Image Area

Figma image wrapper uses:

```text
background: var(--neutral-100)
overflow: hidden
```

Vertical:

```text
width: 100%
aspect-ratio: 343 / 206
border-bottom: 1px solid var(--border)
```

The Figma reference is approximately 343px × 206px. Treat that as an aspect-ratio contract, not a fixed pixel size.

The actual illustration in Figma is example content, not part of the core Card API.

React should accept:

```ts
image?: React.ReactNode;
```

Do not expose `image?: boolean`.

If `image` is omitted, omit the image region cleanly.

## 8. Badges

Figma shows two badges in the header.

Badge row:

```text
display: flex
gap: 8px
align-items: center
```

React should accept:

```ts
badges?: React.ReactNode;
```

This lets callers compose existing `Badge` components:

```tsx
<Card
  badges={
    <>
      <Badge variant="secondary">Badge</Badge>
      <Badge variant="primary">Badge</Badge>
    </>
  }
/>
```

Do not duplicate Badge styling inside Card.

## 9. Header

Header:

```text
padding-top: 16px
padding-left/right: 16px
gap: 8px
width: 100%
```

Header content:

```text
Badges
Subtitle
Title
```

Subtitle and title are stacked.

## 10. Subtitle Typography

Use Neo-Lite `blockquote` style:

```text
Font family: Nokora
Weight: 300
Size: 16px
Line height: 160%
Letter spacing: 0
Color: var(--card-foreground)
```

## 11. Title Typography

Use Neo-Lite `h5` style:

```text
Font family: Nokora
Weight: 500
Size: 18px
Line height: 140%
Letter spacing: 0
Color: var(--card-foreground)
```

## 12. Content Area

Content region:

```text
padding-top: 8px
padding-left/right: 16px
padding-bottom: 16px
width: 100%
```

Content behavior:

```text
flex-grow: 1
```

Body copy uses Neo-Lite paragraph style:

```text
Font family: Nokora
Weight: 400
Size: 16px
Line height: 160%
Color: var(--card-foreground)
```

React uses:

```ts
children?: React.ReactNode;
```

Do not expose a separate `content` prop.

## 13. Footer

Footer:

```text
padding: 16px
gap: 8px
display: flex
align-items: center
justify-content: flex-end
width: 100%
```

The Figma example contains two existing Buttons:

```text
Accent
Primary
```

React should accept:

```ts
footer?: React.ReactNode;
```

Consumers compose existing Button components.

Do not duplicate Button styling inside Card.

## 14. Hover State

Figma defines a vertical hover state:

```text
Vertical-hover
```

The only inspected visual difference is:

```text
box-shadow-2
```

Therefore React should use real hover:

```text
:hover
→ shadow-md
```

Do not expose:

```ts
hovered?: boolean;
```

Do not add background changes, translation, scale, or other hover effects not present in Figma.

## 15. Interactivity

The current Card design is a presentational container.

Do not make the whole Card clickable by default.

Do not render Card as:

```html
<button>
```

or:

```html
<a>
```

unless a future interactive-card design is intentionally added.

Interactive footer controls remain separate Buttons.

## 16. Width and Responsiveness

Card must be responsive to its parent container.

Production root:

```text
width: 100%
```

Do not hard-code the Figma reference widths:

```text
343px
```

The parent controls the Card's available width.

### Image responsiveness

The image region scales with Card width while preserving:

```text
aspect-ratio: 343 / 206
```

Do not use a fixed `height: 206px` in production.

The media itself should preserve its intended aspect ratio with an aspect-ratio wrapper and appropriate object-fit behaviour.

## 17. Radius

Card uses:

```text
4px
```

matching Neo-Lite `radius/sm`.

## 18. Shadow

Hover uses:

```text
box-shadow-2
4px 4px 0 0 var(--shadow-color)
```

Use existing Tailwind semantic mapping:

```text
shadow-md
```

if already mapped in `theme.css`.

Do not hard-code raw shadow values if a semantic utility exists.

## 19. Motion

Card hover uses the same Neo-Lite Y-only hover lift as Button:

```text
translateY(-4px)
duration: 150ms
easing: ease-out
```

The movement must consume the Neo-Lite motion/transform token rather than
hard-coding `-4px` in `Card.tsx`.

Animate only:

```text
transform
box-shadow
```

Do not use:

```text
scale
transition-all
animated layout properties
```

Respect `prefers-reduced-motion`: remove the hover translation and transition
when reduced motion is requested, while preserving the hover shadow.

## 20. Accessibility

Card should:

- render as a semantic neutral container by default
- preserve consumer `aria-*`, `data-*`, `id`, and `className`
- not create nested interactive conflicts
- rely on child Button/Badge semantics
- require meaningful `alt` text on consumer-supplied images when relevant

Card itself does not need a role by default.

## 21. Storybook

Recommended compact structure:

```text
Components
└── Card
    ├── Playground
    └── Without image
```

### Playground

Controls:

```text
title
subtitle
showImage
showBadges
showButtons
```

Use real hover interaction.

Compose:

```text
image
badges
body content
footer Buttons
```

using existing Neo-Lite components.

### Without image

Reproduce the vertical Card composition with the optional image slot omitted.

Do not create separate hover stories.

Hover should be validated through real pointer interaction.

## 22. Example Composition

```tsx
<Card
  image={<ExampleImage />}
  badges={
    <>
      <Badge variant="secondary">Badge</Badge>
      <Badge variant="primary">Badge</Badge>
    </>
  }
  subtitle="This is the subtitle"
  title="This is the card title"
  footer={
    <>
      <Button variant="accent">Label</Button>
      <Button variant="primary">Label</Button>
    </>
  }
>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</Card>
```

## 23. Acceptance Criteria

1. Supports the vertical Card variant only.
2. Does not expose an orientation prop.
3. Uses card background.
4. Uses 1px border.
5. Uses 4px radius.
6. Uses `box-shadow-2` on real hover.
7. No public hover-state prop.
8. Card hover uses Y-only translation on an inner visual child while the outer container remains the stable hover target.
9. Image slot is optional.
10. Badges slot is optional.
11. Existing Badge component is reusable in header.
12. Subtitle uses Neo-Lite blockquote typography.
13. Title uses Neo-Lite h5 typography.
14. Body uses Neo-Lite paragraph typography.
15. Header uses 16px horizontal/top padding.
16. Header gap is 8px.
17. Content uses 8px top / 16px horizontal / 16px bottom padding.
18. Footer uses 16px padding.
19. Footer gap is 8px.
20. Existing Button is reusable in footer.
21. Card root is responsive and fills its parent width.
22. Image uses aspect ratio 343 / 206 rather than fixed 206px height.
23. Horizontal Card variant is not exposed.
24. Figma dimensions are reference-only, not universal production sizes.
25. No public `image` boolean.
26. No public Figma combined `variant` states.
27. Card remains non-interactive by default.
28. No temporary Figma asset URLs remain.
29. No unnecessary dependency is added.

## 24. Source of Truth

Priority:

1. Neo-Lite Figma Card (`2028:11305`)
2. Existing Neo-Lite Badge component/spec
3. Existing Neo-Lite Button component/spec
4. Neo-Lite semantic tokens
5. This specification
6. React implementation
