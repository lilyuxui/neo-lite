# Neo-Lite UI — Project Context

## Project Overview

Neo-Lite UI is a small, opinionated React component library with its own visual identity and design-token system.

It is not an application-specific UI implementation and it is not a wrapper around shadcn.

The design system is designed in Figma first. Components are then specified and intentionally translated into reusable React + TypeScript + Tailwind CSS v4 components.

---

## Design Principles

Neo-Lite has a lightweight neo-brutalist visual language characterised by:

- strong borders
- hard offset shadows
- restrained rounded corners
- expressive but controlled colour
- distinctive typography
- clear interaction states
- simple component geometry

The Neo-Lite theme CSS and Figma variables are the source of truth for visual design decisions.

Do not introduce:

- shadcn styling
- default Tailwind aesthetics
- generic SaaS styling
- visual decisions that are not present in the Neo-Lite system

---

## Technology

The component library uses:

- React
- TypeScript
- Tailwind CSS v4
- Neo-Lite CSS design tokens
- Storybook

Avoid unnecessary dependencies and abstractions.

Components should be portable and reusable rather than coupled to a particular application.

---

## Component Development Workflow

Neo-Lite follows this workflow:

```text
Figma design
→ design tokens
→ component specification
→ React API design
→ React/Tailwind implementation
→ Storybook validation
→ visual and interaction refinement
```

Do not treat Figma-generated code as production code.

Figma describes the intended design and behaviour. The React implementation should translate that into a clean, maintainable component API.

---

## Public API Principle

A consumer of Neo-Lite should not need to understand how the component is structured in Figma.

Figma properties are design-authoring controls.

React props are developer-facing API decisions.

They may correspond conceptually, but they do not need to map 1:1.

Prefer the simplest semantic React API that faithfully reproduces the Figma design.

Treat component APIs as public library APIs.

Prefer:

- predictable prop names
- semantic APIs
- composability
- clear TypeScript types
- reusable exports
- code examples that can be documented easily

Avoid:

- application-specific assumptions
- hidden behaviour
- unnecessary dependencies
- excessive abstractions
- Figma-specific implementation details leaking into the public API

---

## Storybook

Storybook acts as the component laboratory for Neo-Lite.

Each component will eventually have Storybook stories covering:

- variants
- sizes
- states
- content combinations
- accessibility
- interaction behaviour
- edge cases

Components should be implemented in a way that makes their public API easy to exercise independently in Storybook.

Do not put Storybook-specific logic inside production components.

Storybook is primarily a development and validation environment rather than the final public documentation experience.

It can contain stress tests, unusual combinations, interaction tests, and other development-focused examples that would not necessarily appear on the public documentation website.

---

## Future Documentation Platform

Neo-Lite may later have a dedicated documentation website that acts as the central platform for the design system.

The website may demonstrate:

- live components
- component variants
- interactive examples
- usage documentation
- API documentation
- design-token documentation
- installation instructions
- React/Tailwind code examples
- accessibility guidance

The documentation website should be considered the polished public-facing representation of Neo-Lite, while Storybook remains the component development laboratory.

Future documentation requirements should influence clean API design, but should not cause unnecessary architecture to be built now.

---

## Source-of-Truth Responsibilities

### Figma — Design Source

Figma defines:

- design tokens
- visual states
- component anatomy
- variants
- sizes
- interaction intent

### React Component Library — Implementation Source

The React library defines:

- public component APIs
- behaviour
- accessibility
- semantic HTML
- production component implementations

### Storybook — Component Laboratory

Storybook is used to:

- validate implementation against Figma
- inspect variants and sizes
- test interaction states
- test accessibility
- explore edge cases
- stress-test component APIs
- refine components before considering them stable

### Documentation Website — Public Platform

The future Neo-Lite documentation website may provide:

- polished component demonstrations
- API references
- code examples
- usage guidance
- token documentation
- accessibility guidance
- installation and getting-started documentation

---

## Current Scope

Keep the project intentionally small.

Do not prematurely build infrastructure for every possible future requirement.

The immediate goal is to build high-quality Neo-Lite components, validate them in Storybook, and establish a repeatable:

```text
Figma
→ specification
→ API
→ implementation
→ Storybook
```

workflow.

Future documentation requirements should influence clean API design, but should not cause unnecessary architecture to be built now.

When making implementation decisions, prefer the simplest solution that:

1. faithfully implements the Neo-Lite design,
2. provides a clean public API,
3. is accessible,
4. is reusable,
5. is easy to test in Storybook,
6. can be documented cleanly later.

Do not add complexity solely because it might theoretically be useful in the future.
