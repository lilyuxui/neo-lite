# Neo-Lite Card Component Specification v0.1

## 1. Purpose

`Card` is a reusable Neo-Lite content container for presenting an image, optional badges, subtitle, title, body content, and footer actions.

The Figma component defines two orientations and their hover states:

```text
Vertical
Vertical-hover
Horizontal
Horizontal-hover
```

React should expose orientation and semantic content slots rather than a Figma-style combined `variant` state.

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
    | "Horizontal"
    | "Vertical-hover"
    | "Horizontal-hover";
};
```

These should not map 1:1 to the public React API.

## 3. Recommended React API

```ts
export type CardOrientation = "vertical" | "horizontal";

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: CardOrientation;

  image?: React.ReactNode;
  badges?: React.ReactNode;

  subtitle?: React.ReactNode;
  title: React.ReactNode;

  children?: React.ReactNode;
  footer?: React.ReactNode;
}
```

Recommended default:

```ts
orientation = "vertical";
```

Do not expose:

```text
variant="Vertical-hover"
hovered
image=true/false
badge
content
```

Hover is real interaction, not a public state prop.

## 4. Overall Visual Contract

All orientations use:

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
```

Use the existing Neo-Lite semantic mapping where available:

```text
hover:shadow-md
```

Do not add Button-style translation/lift unless separately designed.

## 5. Orientation: Vertical

Figma reference geometry:

```text
width: 343px
height: 492px
```

These are design-example dimensions, not strict production width/height contracts.

Production should preserve the vertical structure while allowing content-responsive sizing.

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

## 6. Orientation: Horizontal

Figma reference geometry:

```text
width: 555px
```

Image region:

```text
width: 214px
height: full card height
border-right: 1px solid var(--card-foreground)
```

Content region fills remaining width.

Structure:

```text
Card
├── Image
└── Main
    ├── Header
    │   ├── Badges
    │   ├── Subtitle
    │   └── Title
    ├── Content
    └── Footer
```

Do not hard-code 555px or 214px unless needed for the Storybook example. Production layout should remain responsive.

## 7. Image Area

Figma image wrapper uses:

```text
background: var(--neutral-100)
overflow: hidden
```

Vertical:

```text
height: 206px
border-bottom: 1px solid var(--border)
```

Horizontal:

```text
width: 214px
align-self: stretch
border-right: 1px solid var(--card-foreground)
```

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
width: 100%
```

Vertical orientation:

```text
flex-grow: 1
```

Horizontal orientation:

```text
content sizes naturally
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

Figma defines hover separately for each orientation:

```text
Vertical-hover
Horizontal-hover
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

Figma example dimensions should not become strict API contracts:

```text
Vertical: 343px × 492px
Horizontal: 555px wide
```

Recommended production behaviour:

```text
width: 100% of consumer container
max/intrinsic sizing controlled by consumer
```

For horizontal orientation on narrow screens, do not invent an automatic orientation switch unless explicitly designed.

Consumers can choose vertical orientation responsively.

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

Figma does not define Card translation or animation.

Do not add:

```text
translate
scale
lift
transition-all
animated shadow movement
```

Hover shadow may change immediately.

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
    ├── Vertical
    └── Horizontal
```

### Playground

Controls:

```text
orientation
title
subtitle
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

### Vertical

Reproduce the Figma vertical example.

### Horizontal

Reproduce the Figma horizontal example.

Do not create separate hover stories.

Hover should be validated through real pointer interaction.

## 22. Example Composition

```tsx
<Card
  orientation="vertical"
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

1. Supports `vertical` and `horizontal` orientations.
2. Default orientation is vertical.
3. Uses card background.
4. Uses 1px border.
5. Uses 4px radius.
6. Uses `box-shadow-2` on real hover.
7. No public hover-state prop.
8. No Card lift/translation.
9. Image slot is optional.
10. Badges slot is optional.
11. Existing Badge component is reusable in header.
12. Subtitle uses Neo-Lite blockquote typography.
13. Title uses Neo-Lite h5 typography.
14. Body uses Neo-Lite paragraph typography.
15. Header uses 16px horizontal/top padding.
16. Header gap is 8px.
17. Content uses 8px top / 16px horizontal padding.
18. Footer uses 16px padding.
19. Footer gap is 8px.
20. Existing Button is reusable in footer.
21. Figma dimensions are not hard-coded as universal production sizes.
22. No public `image` boolean.
23. No public Figma combined `variant` states.
24. Card remains non-interactive by default.
25. No temporary Figma asset URLs remain.
26. No unnecessary dependency is added.

## 24. Source of Truth

Priority:

1. Neo-Lite Figma Card (`2028:11305`)
2. Existing Neo-Lite Badge component/spec
3. Existing Neo-Lite Button component/spec
4. Neo-Lite semantic tokens
5. This specification
6. React implementation
