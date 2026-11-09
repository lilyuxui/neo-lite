# Neo-Lite Radio Group --- React API & Implementation Specification

**Version:** v0.1\
**Status:** Ready for implementation\
**Figma source of truth:** Neo-Lite UI Kit --- Radio Group, node
`2379:889`\
**Related component:** Radio Button --- node `2380:917`\
**Stack:** React + TypeScript strict + Tailwind CSS v4

## 1. Figma component model

The Radio Group component set currently exposes:

``` text
Checked=False
Checked=True
```

The group is a composition of Radio Button controls. The Figma `Checked`
property demonstrates which option is selected; in React, selection
belongs to the group's **value**, not to a group-level boolean.

Therefore do not reproduce the Figma authoring property literally as:

``` tsx
<RadioGroup checked />
```

Instead use a value-based group API.

## 2. Proposed React API

Recommended composition API:

``` ts
export interface RadioGroupProps
  extends Omit<
    React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    "onChange"
  > {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;

  name: string;

  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;

  orientation?: "vertical" | "horizontal";

  children: React.ReactNode;
}
```

Usage:

``` tsx
<RadioGroup
  name="plan"
  label="Choose a plan"
  value={plan}
  onValueChange={setPlan}
>
  <RadioButton value="standard" label="Standard" />
  <RadioButton value="premium" label="Premium" />
</RadioGroup>
```

Uncontrolled:

``` tsx
<RadioGroup
  name="plan"
  label="Choose a plan"
  defaultValue="standard"
>
  <RadioButton value="standard" label="Standard" />
  <RadioButton value="premium" label="Premium" />
</RadioGroup>
```

## 3. Why value-based instead of `checked`

Figma's Radio Group `Checked=True/False` is useful for demonstrating a
radio option visually, but a React group represents a mutually exclusive
set.

The correct behavioural model is:

``` text
group value = "standard"

Standard → checked
Premium  → unchecked
```

not:

``` text
group checked = true
```

`RadioGroup` should supply group context such as:

``` text
name
current value
onValueChange
disabled state if inherited
required state if inherited
```

`RadioButton` derives its checked state by comparing its own `value`
with the group's value.

## 4. RadioButton integration

When a RadioButton is inside RadioGroup:

``` tsx
<RadioButton value="standard" label="Standard" />
```

it should not require consumers to repeat:

``` tsx
name="plan"
checked={value === "standard"}
onChange={...}
```

RadioGroup should provide those through internal React context.

Recommended internal model:

``` ts
interface RadioGroupContextValue {
  name: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  onValueChange: (value: string) => void;
}
```

This context is internal implementation detail, not a public export
unless the repository has a strong established reason.

A RadioButton should still work independently with normal native radio
props.

## 5. Orientation

The inspected Figma Radio Group example is vertically composed.

If Figma component properties explicitly provide an orientation property
elsewhere in the component set, mirror it.

Otherwise, for v0.1 prefer:

``` ts
orientation?: "vertical" | "horizontal"
```

only if the repository needs both layouts now.

If there is no horizontal design/use case, simplify v0.1 to
vertical-only and omit `orientation`. **Do not invent a horizontal
visual treatment merely for API symmetry.**

Codex should re-inspect the latest Figma component properties before
implementation and choose the narrower API if only vertical is designed.

## 6. Label, hint and error

Only implement group-level `label`, `hint`, and `error` if they align
with the current Neo-Lite form-field conventions or are present in the
latest Figma design.

If included:

``` text
label → names the group
hint  → supporting description
error → validation message
```

Use semantic associations (`legend`, `aria-describedby`, etc.) rather
than visual-only text.

Do not invent a new form-field architecture inside RadioGroup. Reuse
existing Neo-Lite patterns.

## 7. Semantic structure

Prefer native grouping:

``` tsx
<fieldset>
  <legend>Choose a plan</legend>

  <RadioButton ... />
  <RadioButton ... />
</fieldset>
```

Each RadioButton should ultimately contain a native:

``` html
<input type="radio" name="plan">
```

Using the same `name` creates the native mutually exclusive radio group.

If the design requires a wrapper that cannot use fieldset/legend
cleanly, preserve equivalent accessible group naming. A radio group
needs an accessible group name when its purpose is not otherwise clear.
citeturn861691search0turn861691search5

## 8. Selection behaviour

Exactly zero or one option may be selected.

On selection:

1.  the selected RadioButton becomes checked;
2.  the previously selected RadioButton becomes unchecked;
3.  controlled mode calls `onValueChange(newValue)`;
4.  uncontrolled mode updates internal value and calls `onValueChange`
    if provided.

Do not support multiple selected values.

Do not toggle a selected radio back to unchecked by clicking it again.
Radio buttons choose one value; they are not checkboxes.

## 9. Controlled and uncontrolled modes

Controlled:

``` tsx
<RadioGroup
  name="delivery"
  value={delivery}
  onValueChange={setDelivery}
>
  ...
</RadioGroup>
```

Uncontrolled:

``` tsx
<RadioGroup
  name="delivery"
  defaultValue="pickup"
>
  ...
</RadioGroup>
```

Follow normal React controlled/uncontrolled semantics.

Do not maintain internal selected state that fights a controlled
`value`.

## 10. Keyboard behaviour

Radio Group must follow standard radio interaction.

Expected behaviour outside a toolbar:

  -----------------------------------------------------------------------
  Key                                 Behaviour
  ----------------------------------- -----------------------------------
  Tab                                 Move focus into the group; checked
                                      option receives focus, or first
                                      option if none is checked

  Shift + Tab                         Move focus out/back through the
                                      normal tab sequence

  Space                               Check the focused radio

  Right Arrow                         Focus and select next radio; wrap
                                      at end

  Down Arrow                          Focus and select next radio; wrap
                                      at end

  Left Arrow                          Focus and select previous radio;
                                      wrap at start

  Up Arrow                            Focus and select previous radio;
                                      wrap at start
  -----------------------------------------------------------------------

This is the WAI-ARIA APG radio-group interaction model.
citeturn861691search0

With native same-name radio inputs, preserve native browser behaviour
where it correctly provides this interaction. Do not replace native
behaviour with unnecessary custom roving-tabindex JavaScript.

If custom focus management becomes necessary because of implementation
structure, follow the established roving-tabindex pattern rather than
inventing another keyboard model.
citeturn861691search1turn861691search3

## 11. Disabled behaviour

Support group-level disabled if it fits existing Neo-Lite form APIs:

``` tsx
<RadioGroup disabled ...>
```

A disabled group should disable all contained RadioButtons unless an
established project convention says otherwise.

Individual RadioButtons may also be disabled.

Do not allow a child to override a disabled parent group back to
enabled.

Use the existing Neo-Lite disabled visual treatment. Do not invent
Radio-specific disabled colours.

## 12. Required behaviour

If `required` is supported at group level, ensure the resulting native
form behaviour correctly requires a selection from the group.

Avoid adding `aria-required` when native required radio semantics
already communicate the requirement unless needed by the chosen
structure.

## 13. Visual layout and tokens

The inspected Radio Group composition uses the existing Radio Button
visual component.

Observed group/component foundations include:

``` text
background
border
foreground
selected
radius/md
spacing/3
paragraph small/regular
```

The group must compose RadioButton rather than recreate its indicator,
label typography or checked state.

Do not duplicate Radio Button styles in RadioGroup.

## 14. Typography

The updated Radio Group and Radio Button designs use the canonical Neo-Lite `small` text style for radio labels:

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

Radio Group must inherit/reuse the Radio Button label typography rather than redefining it.

Codex must:

1. reuse the existing Neo-Lite `small` typography style/token;
2. avoid a `radio-label` or `radio-group-label` typography token;
3. avoid duplicating the font declaration in Radio Group;
4. reconcile the shared `small` style only if the repository currently differs from this latest Figma source;
5. keep Figma internal variable names such as `Static/Label Large/Size` out of the public React API.

## 15. Storybook

Recommended compact stories:

1.  **Default** --- three options, one selected.
2.  **Unselected** --- no initial selection if supported.
3.  **Controlled** --- interactive value change.
4.  **Disabled** --- group/individual disabled option if useful.
5.  **Validation** --- only if label/hint/error are part of the actual
    API.

Do not create separate stories for every child RadioButton hover/focus
state; those belong to Radio Button interaction.

Storybook should make it easy to verify keyboard arrow navigation.

## 16. Accessibility acceptance criteria

Implementation is complete only when:

-   options are programmatically grouped;
-   the group has an accessible name when required;
-   every RadioButton has an accessible label;
-   no more than one option is checked;
-   checked state is programmatically exposed;
-   Tab enters/exits the group naturally;
-   arrow keys move/select among options according to standard radio
    behaviour;
-   Space selects the focused option;
-   disabled options cannot be selected;
-   visible focus matches the Neo-Lite focus design;
-   clicking a visible option label selects that option.

The WAI-ARIA APG describes radio groups as mutually exclusive controls
with one checked item at most, and defines the arrow-key selection model
above. citeturn861691search0

## 17. Suggested implementation sequence

1.  Inspect existing Neo-Lite form components and package conventions.
2.  Re-inspect Figma Radio Group `2379:889` and Radio Button `2380:917`.
3.  Inspect current typography/tokens, especially the new Geist
    `paragraph small/regular`.
4.  Implement/update RadioButton first.
5.  Implement RadioGroup context and native grouping.
6.  Add controlled/uncontrolled value handling.
7.  Verify native keyboard behaviour before adding any custom keyboard
    code.
8.  Add compact Storybook coverage.
9.  Compare all checked/unchecked and interaction states against Figma.
10. Run existing validation commands.

At minimum:

``` bash
npm run typecheck
npm run build-storybook
```

Run lint/tests only if those scripts already exist.

## 18. Do-not rules

Do not:

-   expose Radio Group `checked: boolean`;
-   expose Figma interaction `State` props;
-   duplicate RadioButton visual implementation inside RadioGroup;
-   implement multi-select;
-   allow clicking a selected radio to deselect it like a checkbox;
-   manually implement ARIA radio semantics when native radio inputs can
    provide them;
-   add custom keyboard JavaScript unless native behaviour is
    insufficient;
-   invent horizontal layout if it is not designed/needed;
-   invent Radio-specific colours or typography;
-   hardcode token values;
-   add new dependencies for this component;
-   use `transition-all`;
-   alter unrelated Neo-Lite components.

## 19. Definition of done

-   Radio Group composes the RadioButton component.
-   Group selection is value-based, not boolean.
-   Controlled and uncontrolled selection work.
-   Same-name native radio semantics are preserved.
-   Figma checked/unchecked visuals match.
-   Radio Button hover/focus designs work through real interaction.
-   Keyboard interaction follows standard radio behaviour.
-   Typography matches/reconciles the latest Figma source.
-   Existing Neo-Lite tokens are reused.
-   TypeScript strict validation passes.
-   Storybook build passes.
