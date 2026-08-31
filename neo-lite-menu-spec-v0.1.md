# Neo-Lite Menu Component Specification v0.1

## 1. Purpose

`Menu` is a presentational Neo-Lite popup surface used to contain menu-like children such as `MenuItem`.

It provides the visual container contract only. It does not own open/close state, trigger behaviour, positioning, keyboard navigation, focus management, or selection state.

## 2. Figma Source

- File: `Neo-Lite UI Kit`
- File key: `VBhHP72Ge5M22csfOgeXt6`
- Component node: `2025:10333`

Figma authoring API:

```ts
type MenuProps = {
  className?: string;
  children?: React.ReactNode | null;
};
```

## 3. Anatomy

```text
Menu
└── Slot
    └── children
```

## 4. Geometry

```text
background: var(--background)
border: 1px solid var(--border)
border-radius: var(--radius-sm) = 4px
padding: var(--spacing-2) = 8px
hard shadow: box-shadow-1
width: 100% in production
```

Figma preview width is `254px`; this is demonstration geometry and should not be hard-coded.

The Figma slot is 36px high in the standalone example, but the production Menu should allow multiple children and grow naturally with content.

## 5. Shadow

Figma uses `box-shadow-1`:

```css
box-shadow: 3px 3px 0 0 var(--shadow-color);
```

Use the existing Neo-Lite semantic/Tailwind mapping where available:

```text
shadow-sm
```

## 6. Recommended React API

```ts
export interface MenuProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
```

`className` applies to the Menu root.

Do not add open/close or selection props to this primitive.

## 7. Behaviour Boundary

`Menu` does not own:

```text
trigger
open
defaultOpen
onOpenChange
placement
portal
focus management
keyboard navigation
selected value
```

Those belong to higher-level consumers such as `Selection` or another menu controller.

## 8. Accessibility

The visual `Menu` container does not decide the semantic role by itself because its consumers may use it in different accessible patterns.

Do not hard-code `role="menu"` in the base primitive unless every use case truly follows ARIA menu semantics.

Consumers such as Selection may apply appropriate listbox semantics through their behavioural primitive.

## 9. Motion

No Menu motion is defined in Figma.

Do not add animation or Button-style hover movement in v0.1.

## 10. Acceptance Criteria

1. Uses background semantic token.
2. Uses 1px semantic border.
3. Uses 4px radius.
4. Uses 8px internal padding.
5. Uses 3px hard shadow.
6. Width is not hard-coded to 254px.
7. Grows naturally with children.
8. Does not own popup behaviour.
9. Does not introduce unnecessary dependencies.
10. Uses existing Neo-Lite tokens.

## 11. Source of Truth

1. Neo-Lite Figma Menu
2. Neo-Lite semantic tokens
3. This specification
4. Implementation
