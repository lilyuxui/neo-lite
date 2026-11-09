# Neo-Lite Radio Button --- React API & Implementation Specification

**Version:** v0.1\
**Status:** Ready for implementation\
**Figma source of truth:** Neo-Lite UI Kit --- Radio Button, node
`2380:917`\
**Stack:** React + TypeScript strict + Tailwind CSS v4

## 1. Figma component model

The Radio Button component set contains these designed combinations:

``` text
Checked=False, State=Default
Checked=False, State=Hover
Checked=False, State=Focus

Checked=True,  State=Default
Checked=True,  State=Hover
Checked=True,  State=Focus
```

Meaningful React state:

``` text
Checked → checked
```

Figma `State=Default | Hover | Focus` is an authoring mechanism for
documenting interaction states. It must **not** become a React `state`
prop.

Implement hover and focus from actual browser interaction:

``` text
:hover
:focus-visible
```

## 2. Proposed React API

Prefer a native radio input so browser form semantics, disabled
behaviour and keyboard interaction remain available.

``` ts
export interface RadioButtonProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "size"
  > {
  label: React.ReactNode;
}
```

Example:

``` tsx
<RadioButton
  name="plan"
  value="standard"
  label="Standard"
/>
```

Controlled:

``` tsx
<RadioButton
  name="plan"
  value="standard"
  label="Standard"
  checked={value === "standard"}
  onChange={() => setValue("standard")}
/>
```

The API intentionally inherits native:

``` text
checked
defaultChecked
disabled
required
name
value
onChange
id
aria-*
```

Do not duplicate these as Neo-Lite-specific props.

## 3. Checked state

`checked` maps directly to Figma `Checked=True`.

Unchecked:

``` text
Checked=False
```

Checked:

``` text
Checked=True
```

The visual indicator must derive from the native input's actual checked
state.

Do not expose:

``` ts
selected
isSelected
state="checked"
variant="checked"
```

## 4. Interaction states

### Default

Match the corresponding Figma Checked=True/False Default variant.

### Hover

Match Figma `State=Hover` using real pointer hover.

The designed hover treatment includes Neo-Lite's hard-shadow language.
Use the existing `box-shadow-1` token/effect where shown in Figma.

The label and radio control should behave as one interactive hit target.

### Focus

Match Figma `State=Focus` with `:focus-visible`.

Use the existing Neo-Lite focus treatment:

``` text
focus-ring → #5B5CCE
focus-1    → 2px focus treatment
```

Focus must remain visually distinguishable for both checked and
unchecked states.

Do not expose:

``` tsx
<RadioButton state="hover" />
<RadioButton state="focus" />
```

Storybook may demonstrate these visual states through pseudo-state
tooling if the project already supports it, but the component API must
not.

## 5. Structure and hit target

Recommended semantic structure:

``` tsx
<label>
  <input type="radio" />
  <span aria-hidden="true">{/* visual radio */}</span>
  <span>{label}</span>
</label>
```

The exact markup may adapt to existing Neo-Lite conventions.

Requirements:

-   clicking the visible indicator selects the radio;
-   clicking the label selects the radio;
-   the entire designed row/hit area should be interactive;
-   do not nest interactive elements inside the label;
-   preserve native form behaviour.

## 6. Tokens observed in Figma

Reuse existing Neo-Lite tokens rather than hardcoding resolved values.

Observed colour/effect roles:

``` text
foreground        → #000000
subtle-foreground → #5E5E5E
background        → #FFFFFF
border            → #000000
selected          → #000000
neutral/200       → #E7E5E4
focus-ring        → #5B5CCE
focus-1           → existing 2px focus effect
box-shadow-1      → existing 3px × 3px hard shadow
shadow-color      → #000000
```

Observed geometry/foundation references include:

``` text
spacing/2
spacing/3
spacing/4
radius/sm
radius/md
```

Use their current canonical values from the repository/Figma variables.
Do not reproduce resolved pixel values as component-local constants
where a token exists.

## 7. Typography

The updated Radio Button design now uses the canonical Neo-Lite `small` text style for its label:

```text
small
font family: Nokora
font style: Regular
font size: 14px
font weight: 400
line height: 160%
letter spacing: 0
```

Figma currently resolves this through:

```text
Static/Label Large/Size → 14
small → Nokora Regular, 14px, 160%
```

Implementation requirements:

1. reuse the existing Neo-Lite `small` typography style/token;
2. do not create a Radio-specific label typography token;
3. do not hardcode the label font properties in Radio Button if the shared text style already exists;
4. if the repository's current `small` implementation differs from the latest Figma source, update/reconcile the shared style rather than introducing a local override;
5. treat Figma internal variable names such as `Static/Label Large/Size` as design-file implementation details, not required public CSS/React names.

## 8. Disabled behaviour

The inspected component set does not expose a separate Figma `Disabled`
variant.

Still preserve native `disabled` support because Radio Button is a form
control.

If the existing Neo-Lite system has a canonical disabled treatment, use
it. Do not invent a new Radio-only disabled palette.

If Figma does not yet define the exact disabled visual, keep the
implementation conservative and consistent with existing Neo-Lite
disabled semantics rather than creating a new visual language.

## 9. Accessibility

Prefer native `<input type="radio">`.

Each radio must have an accessible label. The visible `label` should
normally provide it.

Checked state must be programmatically available through native radio
semantics.

Do not add redundant `role="radio"` or `aria-checked` when using a
native radio input.

The WAI-ARIA radio-group pattern expects only one option in a group to
be checked and arrow-key navigation between grouped radios. Native HTML
radio groups provide the appropriate underlying form semantics;
RadioGroup should coordinate the group contract.
citeturn861691search0

## 10. Storybook

Keep coverage compact.

Recommended stories:

1.  **Default** --- unchecked and checked examples.
2.  **Interaction states** --- demonstrate hover/focus naturally or with
    existing pseudo-state tooling.
3.  **Disabled** --- only if useful to document inherited Neo-Lite
    disabled behaviour.

Do not create separate public stories for every Figma permutation if one
interactive story can demonstrate them.

## 11. Do-not rules

Do not:

-   expose Figma `State` as a React prop;
-   expose `hover`, `focus`, `isHovered`, or `isFocused`;
-   duplicate native `checked` with `selected`;
-   use a button/div as the radio when native radio semantics can
    support the design;
-   hardcode token colours;
-   create Radio-specific semantic colours;
-   make only the small circle clickable while the visible label/row
    appears interactive;
-   invent motion not present in Figma;
-   use `transition-all`;
-   add a dependency solely to implement a radio input;
-   silently ignore the current Geist paragraph-small typography shown
    in Figma.

## 12. Definition of done

-   Checked=False and Checked=True visually match Figma.
-   Default, Hover and Focus states match Figma through real
    interaction.
-   Native checked/defaultChecked/disabled/name/value semantics work.
-   Label and control form one usable hit target.
-   Focus is visible in both checked and unchecked states.
-   Existing Neo-Lite tokens/effects are reused.
-   Latest typography is reconciled with the design system.
-   TypeScript strict validation passes.
-   Storybook build passes.
