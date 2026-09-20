# Neo-Lite UI

Neo-Lite UI is a small, opinionated React component library and documentation website with a lightweight neo-brutalist visual language.

The system is designed in Figma, translated into component specifications, and implemented as accessible React, TypeScript, and Tailwind CSS v4 components. The public website presents the foundations and component examples, while Storybook remains a separate development environment for component testing.

## Design

Neo-Lite is characterized by:

- strong one-pixel borders
- hard offset shadows
- restrained corner radii
- a mostly neutral interface palette
- purple emphasis and focus states
- expressive headings with practical interface typography
- short, purposeful interaction motion

The design system has four sources of truth:

| Area | Source of truth |
| --- | --- |
| Visual design and intent | Figma |
| Tokens and theme values | `src/styles/theme.css` |
| Component behavior and public APIs | React components in `src/components` |
| Component development and state coverage | Storybook stories |

View the design file in the [Figma Community](https://www.figma.com/community/file/1683319542113903903).

## Technology

- React 19
- TypeScript 5
- Tailwind CSS 4
- Vite 6
- Storybook 9
- Shiki for documentation-site code highlighting

React and React DOM are peer dependencies for library consumers. This repository currently uses React 19 for local development.

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Install dependencies

```bash
npm install
```

### Start the Neo-Lite website

```bash
npm run dev
```

Vite serves the website at `http://localhost:5173` by default.

Primary routes:

- `/` - Home
- `/overview` - Design foundations
- `/components/badge` - Component documentation, starting with Badge
- `/components/button`
- `/components/card`
- `/components/checkbox`
- `/components/dialog`
- `/components/input`
- `/components/selection`
- `/components/tabs`

The website is independent from Storybook. Do not add website pages as Storybook stories.

### Start Storybook

```bash
npm run storybook
```

Storybook runs separately at `http://localhost:6006`. It is the component laboratory for inspecting variants, states, interactions, and edge cases.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the standalone Neo-Lite website with Vite |
| `npm run build` | Create a production website build in `dist` |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run storybook` | Start the Storybook development server on port 6006 |
| `npm run build-storybook` | Generate a static Storybook build |

## Using the Components

Import components from the package entry point and include the Neo-Lite theme once in the consuming application.

```tsx
import { Badge, Button, Card } from "neo-lite-ui";
import "neo-lite-ui/styles/theme.css";

export function Example() {
  return (
    <Card
      title="Your profile"
      badges={<Badge variant="accent">New</Badge>}
      footer={<Button variant="primary">Save</Button>}
    >
      Manage your details in one place.
    </Card>
  );
}
```

The package is currently marked `private`, so the example above describes the intended public API for workspace or future packaged use. It is not currently published to npm.

### Public Components

| Component | Purpose |
| --- | --- |
| `Badge` | Compact status, category, or supporting label |
| `Button` | Primary, secondary, accent, and destructive actions |
| `Card` | Structured content surface with optional media, badges, body, and footer |
| `Checkbox` | Binary and indeterminate selection control |
| `Dialog` | Accessible modal surface with focus management |
| `Input` | Single-line text input with labels, decorations, hints, and errors |
| `Menu` | Presentational popup surface for menu content |
| `MenuItem` | Interactive item used inside a Menu |
| `Selection` | Single-value dropdown selection control |
| `Tabs` and `Tab` | Keyboard-accessible tab selection group and items |

Public exports are maintained in `src/index.ts`.

## Theme and Tokens

The theme is defined in `src/styles/theme.css`. It contains:

- primitive neutral, purple, blue, green, yellow, and red colors
- semantic background, foreground, border, focus, state, and feedback colors
- Nokora and Playfair Display font families
- a 4px-based spacing scale with selected fine and layout values
- radius tokens from `--radius-sm` to `--radius-full`
- motion duration, easing, and hover offset tokens
- hard shadow tokens and focus rings
- component geometry such as button heights

Tailwind CSS v4 consumes these values through the `@theme inline` bridge in the same file. Prefer semantic utilities such as `bg-background`, `text-foreground`, and `border-border` over raw colors when a matching token exists.

Do not introduce hard-coded visual values when an existing Neo-Lite token represents the same design decision.

## Project Structure

```text
.
|-- .storybook/             Storybook configuration
|-- docs/                   Foundation and release-readiness documents
|-- src/
|   |-- assets/             Website images, illustrations, and icons
|   |-- components/         Reusable library components and stories
|   |-- constants/          Shared website constants and external links
|   |-- pages/              Standalone documentation website pages
|   |-- styles/             Neo-Lite theme and Tailwind token bridge
|   |-- utils/              Shared implementation utilities
|   |-- index.ts            Public component exports
|   `-- main.tsx            Website entry point and route selection
|-- neo-lite-*-spec-v0.1.md Component specifications
|-- package.json
|-- tsconfig.json
`-- vite.config.ts
```

Each component folder generally contains:

```text
Component.tsx
Component.stories.tsx
index.ts
```

## Documentation Website

The website is implemented in `src/pages` and rendered by `src/main.tsx`.

It currently includes:

- a responsive Home page
- a foundations Overview page covering color, spacing, radius, effects, and motion
- component documentation routes with live previews
- complete TSX examples with syntax highlighting
- copy-to-clipboard controls with success feedback
- shared responsive navigation and mobile menu behavior

The website uses a mobile-first responsive strategy:

- Mobile: below 640px
- Tablet: 640px to 1023px using `sm:` styles
- Desktop: 1024px and above using `lg:` styles

The mobile and desktop Figma frames are visual anchors. Layouts remain fluid between those anchors and content is constrained at wide viewport sizes.

For a production static deployment, configure the host to serve `index.html` as the fallback for routes such as `/overview` and `/components/badge`.

## Storybook Workflow

Storybook is intentionally separate from the documentation website.

Use stories to cover:

- variants and sizes
- default, hover, focus, disabled, selected, and error states
- content combinations
- keyboard and pointer interaction
- accessibility behavior
- long content and layout stress cases

Do not put Storybook-only behavior inside production components.

## Component Specifications

Every current component has one canonical specification named `neo-lite-<component>-spec-v0.1.md`.

The specifications document:

- component purpose
- Figma source nodes
- anatomy
- public React API
- variants and states
- token usage
- interactions and keyboard behavior
- accessibility requirements
- Storybook coverage
- acceptance criteria

When a specification changes, update the existing `v0.1` file rather than creating parallel versioned copies unless the project adopts a formal specification-versioning policy.

The shared foundation specification is available at `docs/neo-lite-foundations-v0.1.md`.

## Accessibility

Components should preserve native semantics wherever possible and provide equivalent keyboard behavior where custom interaction is required.

Current accessibility considerations include:

- visible keyboard focus using Neo-Lite focus tokens
- native form controls where practical
- modal focus movement, trapping, Escape handling, and focus restoration
- keyboard navigation for Selection and Tabs
- accessible labels for icon-only controls
- reduced-motion handling for hover transforms
- `aria` state exposure for interactive components

Accessibility behavior belongs in the React implementation, even when it is not represented explicitly in Figma.

## Development Workflow

Use the following sequence for component work:

```text
Figma design
-> design tokens
-> component specification
-> React API design
-> React and Tailwind implementation
-> Storybook validation
-> documentation website example
-> responsive and interaction QA
```

Before considering a change complete:

1. Check the relevant Figma component or page.
2. Reuse existing tokens, components, and icons.
3. Update the canonical component specification when behavior or API changes.
4. Add or update Storybook coverage.
5. Run `npm run typecheck`.
6. Run `npm run build`.
7. Verify affected website routes at mobile, tablet, and desktop widths.

## Design Resources

- [Neo-Lite UI Kit on Figma Community](https://www.figma.com/community/file/1683319542113903903)
- `neo-lite-project-context.md` for project principles and source-of-truth responsibilities
- `docs/neo-lite-foundations-v0.1.md` for the foundation token specification
- `docs/neo-lite-v0.1.0-release-readiness.md` for the current release checklist

## Project Status

Neo-Lite UI is a public repository under active development. The package is not currently published to npm, and its API and documentation may evolve as components are refined against Figma and exercised in Storybook.
