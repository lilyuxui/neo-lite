# Neo-Lite Date Picker --- React API & Implementation Specification

**Version:** v0.1\
**Status:** Ready for implementation\
**Design source of truth:** Figma --- Neo-Lite UI Kit, Date Picker node
`2347:8382`\
**Stack:** React + TypeScript strict + Tailwind CSS v4\
**Component scope:** DayButton, Calendar, DatePicker\
**Design modes:** Basic and Range; Default and Expanded\
**Input model:** Picker-only (not free-text editable)

> Figma is the visual source of truth. Inspect the linked component and
> its nested components before implementation. Reuse existing Neo-Lite
> components, tokens, utilities, patterns, and accessibility conventions
> rather than recreating them.

------------------------------------------------------------------------

## 1. Goal

Add a Neo-Lite date-picker system composed from three layers:

1.  **DayButton** --- internal/low-level calendar day control.
2.  **Calendar** --- reusable single-month calendar.
3.  **DatePicker** --- field + popover composition supporting
    single-date and date-range selection.

The React API should model product behaviour, not Figma authoring
properties. Do not expose props such as `State="Hover"`,
`State="Focus"`, `Today=true`, or combined visual variants merely
because they exist in Figma.

------------------------------------------------------------------------

## 2. Required design-system foundation updates

Before implementing the components, inspect the existing token and
typography definitions and update them to match Figma.

### 2.1 Colour primitive

Add/confirm:

``` css
--neutral-600: #5e5e5e;
```

Figma primitive:

``` text
neutral/600 → #5E5E5E
```

Do not renumber or rebalance the existing neutral scale.

### 2.2 Semantic colours

Add/confirm these semantic roles:

``` css
--subtle-foreground: var(--neutral-600);
--selected-subtle-foreground: var(--neutral-300);
```

Figma mappings:

``` text
subtle-foreground          → neutral/600 → #5E5E5E
selected-subtle-foreground → neutral/300 → #C8C8C8
```

Purpose:

-   `foreground` remains the primary text colour.
-   `subtle-foreground` is lower-emphasis supporting text on a normal
    surface.
-   `selected-foreground` remains primary text on a selected surface.
-   `selected-subtle-foreground` is lower-emphasis supporting text on a
    selected surface.

The Calendar's **Today** label is the first intended consumer, but these
are semantic system tokens and must not be named after Calendar or
Today.

Do not create `today-foreground`, `calendar-muted`, or similar
component-specific colour tokens.

### 2.3 Typography

The updated Figma component exposes/uses:

``` text
extra small
Nokora Regular
12px
120% line height

small
Nokora Regular
14px
160% line height
```

The current Figma `small` style is backed by the 14px size variable
(`Static/Label Large/Size` in the inspected design data).

Before editing typography code:

1.  Inspect the current Neo-Lite text-style/token implementation.
2.  Reconcile it with the updated Figma styles.
3.  Preserve existing public naming where it already matches Figma.
4.  Add `extra small` only if it is not already represented.
5.  Do not create duplicate aliases for the same text style merely to
    mirror internal Figma variable names.

Figma internal variable names such as `Static/Label Large/Size` are
implementation details of the design file and are **not** required to
become public CSS or React API names.

### 2.4 Spacing

The previously identified spacing mismatch has been corrected in Figma.

Re-inspect the current spacing variables before changing code. Preserve
Neo-Lite's canonical spacing system and use existing spacing
tokens/utilities throughout these components.

Do not:

-   introduce arbitrary pixel spacing where a Neo-Lite token exists;
-   renumber existing spacing tokens;
-   create Calendar-specific spacing tokens unless a genuinely reusable
    semantic need is discovered.

### 2.5 Existing tokens reused by this design

The inspected design also uses existing Neo-Lite foundations including:

``` text
foreground
background
border
focus-ring
selected
selected-foreground
secondary
neutral/200
radius/sm
focus-1
box-shadow-1
```

Reuse the existing implementation of these tokens. Do not duplicate
them.

------------------------------------------------------------------------

# 3. Component architecture

``` text
DatePicker
├── picker field / trigger
└── popover
    ├── Calendar                         (basic)
    └── Calendar + Calendar              (range)
        └── DayButton
```

Responsibilities must remain separated:

### DayButton

Owns presentation and interaction for one calendar day.

It does **not** own:

-   date arithmetic;
-   month navigation;
-   range logic;
-   popup state;
-   formatted field values.

### Calendar

Owns one visible month:

-   month heading;
-   previous/next navigation controls when applicable;
-   weekday headings;
-   calendar grid;
-   roving keyboard focus;
-   rendering DayButtons.

It does **not** own the picker field or popup.

### DatePicker

Owns the complete picker experience:

-   picker-only field/trigger;
-   open/closed state;
-   single or range selection;
-   value formatting for display;
-   popup positioning/dismissal;
-   one Calendar for basic mode;
-   two coordinated Calendars for range mode;
-   focus transfer and restoration.

------------------------------------------------------------------------

# 4. DayButton

## 4.1 Export decision

Prefer keeping `DayButton` internal unless Neo-Lite intentionally wants
to expose calendar primitives publicly.

Recommended:

``` ts
// public
export { Calendar, DatePicker }

// internal to calendar implementation
DayButton
```

If the existing package convention exports all meaningful atoms, it may
be exported, but do not expose visual-state props.

## 4.2 Proposed props

``` ts
type DayButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "value"
> & {
  date: Date;
  label: string;
  isToday?: boolean;
  isSelected?: boolean;
  isOutsideMonth?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  isInRange?: boolean;
};
```

`disabled` should come from the native button props rather than a
duplicated custom prop.

`label` is the visible day-of-month string. The Calendar normally
derives it.

If the project already has a date abstraction or uses a date library,
adapt `Date` to existing conventions rather than introducing a new
dependency solely for this API.

## 4.3 State model

Treat these as independent state dimensions:

``` text
today
selected
outside month
disabled
range start
range end
in range
focus-visible
hover
```

Do not create compound React props such as:

``` ts
state="today-hover"
state="selected-focus"
variant="outside-month-selected"
```

Hover and focus are DOM/CSS interaction states, not public React state
props.

## 4.4 Today label

The visible Today treatment is supporting information within the same
button.

Default/hover:

``` text
day number → foreground
Today      → subtle-foreground
```

Selected:

``` text
day number → selected-foreground
Today      → selected-subtle-foreground
```

The date number and Today label form **one interactive button**. Today
must not be a nested interactive element.

## 4.5 Outside-month days

Match the new Figma outside-month design exactly.

Outside-month is a presentation/context state, not synonymous with
disabled.

Unless product behaviour explicitly disables outside-month dates,
clicking an outside-month date should be allowed and should
select/navigate to that date as appropriate.

Do not infer disabled behaviour from reduced visual emphasis.

## 4.6 Focus

Use the existing Neo-Lite focus token/effect.

Selected + focus must preserve both:

-   selected appearance;
-   clearly visible focus indication.

Do not replace selected styling with focus styling.

Use `:focus-visible` rather than showing keyboard-style focus treatment
for every pointer click unless the existing Neo-Lite convention
intentionally does otherwise.

------------------------------------------------------------------------

# 5. Calendar

## 5.1 Proposed public API

``` ts
export type CalendarValue = Date | undefined;

export interface CalendarProps {
  value?: CalendarValue;
  defaultValue?: CalendarValue;
  onValueChange?: (date: Date) => void;

  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;

  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;

  showOutsideDays?: boolean;

  locale?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  className?: string;
}
```

Use the project's existing controlled/uncontrolled conventions if they
differ.

### Defaults

Recommended:

``` ts
showOutsideDays = true
```

because outside-month states are explicitly designed.

For initial visible month:

1.  controlled `month`;
2.  otherwise `defaultMonth`;
3.  otherwise selected `value`;
4.  otherwise today.

For initial keyboard focus:

1.  selected date if present and available;
2.  otherwise today if visible/available;
3.  otherwise first available date in the visible month.

## 5.2 Do not add these APIs

Avoid premature props such as:

``` ts
dayVariant
todayColor
selectedColor
renderDay
dayClassName
headerClassName
showTodayLabel
hoverState
focusState
```

The first version should remain opinionated and visually Neo-Lite.

Only add rendering escape hatches if the repository already establishes
that pattern.

## 5.3 Month and year navigation

Calendar uses the four navigation controls shown in Figma.

``` text
«   ‹   October 2026   ›   »
│   │                  │   │
│   └─ Previous month  │   └─ Next year
└───── Previous year   └───── Next month
```

Navigation behaviour is fixed:

  Control              Behaviour                Accessible name
  -------------------- ------------------------ ------------------
  Double left arrow    Move back one year       `Previous year`
  Single left arrow    Move back one month      `Previous month`
  Single right arrow   Move forward one month   `Next month`
  Double right arrow   Move forward one year    `Next year`

The **single-arrow buttons always navigate by one month**.

The **double-arrow buttons always navigate by one year**, preserving the
displayed month where possible. For example:

``` text
October 2026 + Next year → October 2027
March 2027 + Previous year → March 2026
```

Use accessible names on all icon-only navigation controls. The icon
shape alone is not an accessible label.

Use existing Neo-Lite button/icon-button conventions where visually
compatible; otherwise implement the minimal calendar navigation controls
matching Figma while reusing system tokens, sizing and focus behaviour.

Do not expose separate consumer callbacks such as `onPreviousMonth`,
`onNextMonth`, `onPreviousYear`, or `onNextYear`. Navigation should
update the Calendar's normal month state and call `onMonthChange` when
that controlled API is used.

### Navigation in basic/single-calendar mode

For a single visible Calendar:

-   single arrows change the visible month by ±1 month;
-   double arrows change the visible month by ±1 year;
-   keyboard focus should remain on an appropriate date where possible;
-   if the equivalent focused date does not exist in the destination
    month/year, move focus to the nearest valid calendar date rather
    than producing an invalid date.

### Navigation in desktop range mode

When Range DatePicker displays two calendars, treat them as one
coordinated consecutive-month viewport.

If the visible pair is:

``` text
October 2026 | November 2026
```

then:

``` text
Next month     → November 2026 | December 2026
Previous month → September 2026 | October 2026

Next year      → October 2027 | November 2027
Previous year  → October 2025 | November 2025
```

The two desktop calendars must remain consecutive after navigation. Do
not allow navigation to produce duplicate months or disconnected month
pairs.

The navigation controls operate on the coordinated range-calendar
viewport rather than allowing each panel to drift independently, unless
the Figma design explicitly assigns controls differently.

### Navigation in mobile range mode

Range mode shows one Calendar on mobile, so the same controls operate on
that single visible month:

-   single arrows → ±1 month;
-   double arrows → ±1 year.

Any in-progress `from` selection must remain intact while the user
navigates to another month or year to choose `to`.

### Announcements

The visible month/year heading must update after either month or year
navigation.

Use an appropriate polite announcement strategy so assistive technology
is informed when the visible calendar period changes.

## 5.4 Calendar grid semantics

Implement the calendar as a proper calendar grid, not a list of 35--42
unrelated tabbable buttons.

Recommended semantics:

``` text
grid
  row
    columnheader × 7
  row
    gridcell/day × 7
```

Only one date should participate in the normal Tab sequence at a time.

Use roving tabindex for days.

## 5.5 Keyboard behaviour

Required:

  Key                 Behaviour
  ------------------- ---------------------------
  Arrow Left          Previous day
  Arrow Right         Next day
  Arrow Up            Previous week
  Arrow Down          Next week
  Home                First day of current week
  End                 Last day of current week
  Page Up             Previous month
  Page Down           Next month
  Shift + Page Up     Previous year
  Shift + Page Down   Next year
  Enter / Space       Select focused date

Moving keyboard focus across a month boundary should update the visible
month appropriately.

Disabled dates must not be selectable. Follow the project's
accessibility convention for whether keyboard navigation skips disabled
dates or may focus but not activate them; prefer skipping if no existing
convention exists.

## 5.6 Date semantics

Keep these concepts independent:

``` text
today
selected date
keyboard-focused date
visible month
disabled date
outside-month date
```

Never use a single generic `active` state to represent them.

------------------------------------------------------------------------

# 6. DatePicker

## 6.1 Public value types

``` ts
export interface DateRange {
  from?: Date;
  to?: Date;
}

export type DatePickerMode = "single" | "range";
```

Prefer a discriminated union so the value type follows the mode.

``` ts
interface DatePickerBaseProps {
  label?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;

  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;

  locale?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  className?: string;
}

export interface SingleDatePickerProps extends DatePickerBaseProps {
  mode?: "single";
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
}

export interface RangeDatePickerProps extends DatePickerBaseProps {
  mode: "range";
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
}

export type DatePickerProps =
  | SingleDatePickerProps
  | RangeDatePickerProps;
```

### Why `mode`, not `type`

Use `mode` for React even though Figma uses `Type=Basic/Range`.

Figma's `Type` is an authoring property. In React:

-   `mode="single"` describes selection behaviour clearly.
-   `mode="range"` is conventional and clear.
-   avoid exposing `type="basic"` because `type` already has HTML
    meaning and "basic" does not describe the value model.

## 6.2 Picker-only field

The field is intentionally **not editable text input**.

Do not implement parsing, manual typing, input masks, invalid typed-date
handling, or free-text date entry.

The field acts as a trigger/display control.

It should:

-   visually match the Figma picker field;
-   display placeholder when empty;
-   display formatted selected date/date range when populated;
-   open the calendar popup on activation;
-   expose expanded/collapsed state accessibly;
-   be disabled when `disabled=true`.

Do not use a writable `<input>` simply because the design resembles
Input.

Prefer an accessible button/trigger styled to match the field, unless
the existing Neo-Lite field architecture already provides a semantically
correct read-only trigger primitive.

## 6.3 Open state

The Figma `State=Default/Expanded` property maps to runtime open state,
not a public visual variant.

Recommended optional controlled API only if consistent with existing
components:

``` ts
open?: boolean;
defaultOpen?: boolean;
onOpenChange?: (open: boolean) => void;
```

If Neo-Lite's current components do not expose controlled popup state,
keep this internal for v1 rather than adding API surface unnecessarily.

Do **not** expose:

``` ts
state="expanded"
state="default"
```

## 6.4 Single-date behaviour

`mode="single"`:

-   render one Calendar;
-   selecting a valid day updates the value;
-   after selection, close the popup;
-   return focus to the trigger;
-   display the formatted selected date.

Recommended display formatting should use `Intl.DateTimeFormat` or the
project's existing date utility rather than a new formatting dependency.

## 6.5 Range behaviour

`mode="range"`:

-   render two coordinated adjacent Calendars at desktop/component width
    matching Figma;
-   the two calendars show consecutive months;
-   selecting the first date establishes `from`;
-   selecting the second valid date establishes `to`;
-   visually represent range start, range end, and dates between them
    exactly as Figma;
-   do not allow the two visible month panels to drift into the same
    month;
-   navigation should preserve consecutive-month coordination.

Selection rule recommendation:

1.  no range → click sets `from`;
2.  only `from` → later/equal date completes `to`;
3.  only `from` → earlier date restarts the range from the earlier date;
4.  completed range → next selection starts a new range.

Keep the popup open after choosing `from`.

After `to` is chosen, close the picker **only if that matches the
intended Figma/product interaction**. If Figma does not specify this,
prefer closing after a complete range because the picker is
selection-only and has no Apply action.

Do not invent Apply/Cancel buttons.

## 6.6 Range accessibility

Announce enough information for a screen-reader user to distinguish:

-   range start;
-   range end;
-   selected/in-range dates;
-   today;
-   unavailable dates.

Do not rely on background colour alone to communicate range membership.

## 6.7 Popup behaviour

The expanded calendar surface should:

-   match Figma dimensions, border, radius, shadow and spacing;
-   appear anchored to the trigger;
-   dismiss on Escape;
-   dismiss on outside pointer interaction;
-   restore focus to the trigger when dismissed;
-   manage layering correctly;
-   remain keyboard accessible.

Use an existing project popover/dialog primitive if one exists and can
accurately express the design/interaction. Do not add a dependency
before inspecting the repository.

------------------------------------------------------------------------

# 7. Visual implementation rules

## 7.1 Figma is authoritative

For exact values not enumerated in this spec---dimensions, gaps,
padding, icon sizing, weekday spacing, day geometry, range treatment,
borders and positioning---inspect node `2347:8382` and its nested
components.

Do not approximate a common date picker from memory.

## 7.2 Token use

Use semantic tokens where they exist.

Examples:

``` text
primary date text        → foreground
Today supporting text    → subtle-foreground
selected primary text    → selected-foreground
selected Today text      → selected-subtle-foreground
selected surface         → selected
focus                    → focus-ring / existing focus effect
surface                  → background
border                   → border
```

Do not hardcode these resolved hex values inside component files.

## 7.3 Icons

Reuse the project's existing icon system/assets.

Do not redraw chevrons as ad-hoc SVGs if an exact existing icon is
available.

Icon-only navigation controls require accessible names.

## 7.4 Motion

Do not add motion that is not designed.

If an existing Neo-Lite popup transition convention exists, reuse it.
Otherwise the date picker may open/close without inventing animation.

Do not use `transition-all`.

------------------------------------------------------------------------

# 8. Controlled and uncontrolled behaviour

Where value/defaultValue pairs are supported, follow normal React
semantics:

-   `value` + callback = controlled;
-   `defaultValue` = initial uncontrolled value;
-   do not switch unpredictably between controlled/uncontrolled state;
-   internal state must not overwrite a controlled value.

The same applies to Calendar month state if
`month/defaultMonth/onMonthChange` are implemented.

------------------------------------------------------------------------

# 9. Date comparison rules

Do not compare `Date` objects by object identity.

Normalize comparisons to calendar dates in the user's/local display
context.

Avoid accidental failures caused by time-of-day values.

Unless the repository already has a date utility, create small internal
helpers for:

``` text
same calendar day
before/after calendar day
start of month
add/subtract day
add/subtract month
month grid generation
range membership
date availability
```

Do not add a large date dependency solely for this component unless the
repository already uses one.

------------------------------------------------------------------------

# 10. Storybook

Keep Storybook useful but compact.

## DatePicker stories

Required:

1.  **Basic** --- empty/default picker.
2.  **Basic selected** --- selected date.
3.  **Range** --- empty range picker.
4.  **Range selected** --- completed range.
5.  **States** --- disabled and constrained-date example if useful.

The stories should be interactive; do not create separate stories for
every hover/focus visual state.

Use Storybook interactions/controls or natural browser interaction for
hover/focus where practical.

## Calendar story

Include one focused Calendar story if Calendar is a public export.

Show:

-   today;
-   selected date;
-   outside-month days;
-   navigation;
-   keyboard operation.

## DayButton story

Only add a DayButton story if DayButton is publicly exported or the
repository intentionally documents internal atoms.

Do not create a large submenu of combinatorial state stories.

------------------------------------------------------------------------

# 11. Accessibility acceptance criteria

The implementation is not complete unless:

-   the picker trigger has an accessible name;
-   expanded/collapsed state is conveyed;
-   popup relationship is conveyed appropriately;
-   previous/next month controls have accessible names;
-   weekday headers are meaningful;
-   days have meaningful accessible names including full date;
-   today is programmatically distinguishable;
-   selected state is programmatically distinguishable;
-   disabled dates cannot be selected;
-   keyboard users can navigate the grid without tabbing through every
    day;
-   selected and focus states remain visually distinct;
-   Escape dismisses the popup;
-   focus is restored sensibly after dismissal/selection;
-   range state is not communicated by colour alone.

------------------------------------------------------------------------

# 12. Suggested file structure

Adapt to the repository's current component conventions; do not force
this exact structure if the project uses another established pattern.

``` text
src/components/
  date-picker/
    DatePicker.tsx
    DatePicker.stories.tsx
    date-picker.types.ts
    date-utils.ts

  calendar/
    Calendar.tsx
    Calendar.stories.tsx
    DayButton.tsx
```

If Neo-Lite uses one directory per public component, follow that
pattern.

Do not reorganise unrelated existing components.

------------------------------------------------------------------------

# 13. Public exports

Recommended public exports:

``` ts
export { Calendar } from "...";
export type { CalendarProps, CalendarValue } from "...";

export { DatePicker } from "...";
export type {
  DatePickerProps,
  SingleDatePickerProps,
  RangeDatePickerProps,
  DateRange,
} from "...";
```

Keep `DayButton` private initially unless there is a clear public use
case consistent with the rest of Neo-Lite.

------------------------------------------------------------------------

# 14. Implementation sequence for Codex

1.  Inspect the repository structure and existing component conventions.
2.  Inspect current `theme.css` / token definitions and typography
    implementation.
3.  Inspect existing Input, Button/icon-button, Dialog/popover-like
    behaviour, focus styles and Storybook patterns.
4.  Re-inspect Figma node `2347:8382` and nested Day Button/Calendar
    nodes before coding.
5.  Update the design-system foundations:
    -   neutral/600;
    -   subtle-foreground;
    -   selected-subtle-foreground;
    -   updated/new text styles;
    -   any corrected spacing definitions required by the current Figma
        source of truth.
6.  Implement internal date utilities.
7.  Implement DayButton.
8.  Implement Calendar and keyboard model.
9.  Implement DatePicker single mode.
10. Implement DatePicker range mode.
11. Add compact Storybook coverage.
12. Verify against Figma at representative states/sizes.
13. Run the project's existing validation commands.

At minimum run the existing equivalents of:

``` bash
npm run typecheck
npm run build-storybook
```

Run lint/tests only if those scripts/configurations exist. Do not
introduce lint/test infrastructure solely for this component.

------------------------------------------------------------------------

# 15. Do-not rules

Do **not**:

-   redesign the Figma component;
-   hardcode colours that already have tokens;
-   create Calendar-specific colour tokens for generic semantic roles;
-   expose Figma `Type` or `State` props directly in React;
-   expose hover/focus as React props;
-   make Today a separate interactive element;
-   treat outside-month as automatically disabled;
-   make every calendar day a Tab stop;
-   use one `active` state for focus, today and selection;
-   make the picker field free-text editable;
-   add date parsing/masking;
-   add Apply/Cancel/Today actions that are not in the design;
-   invent new motion;
-   use `transition-all`;
-   add a date library without first checking existing dependencies;
-   add a new popup library without checking existing primitives;
-   duplicate existing Neo-Lite components;
-   add arbitrary fixed widths beyond what is structurally required by
    the Figma component;
-   change unrelated components or foundations;
-   reintroduce previously removed/deprecated API patterns elsewhere in
    Neo-Lite.

------------------------------------------------------------------------

# 16. Definition of done

The work is complete when:

-   foundation/token changes match the latest Figma source;
-   DayButton visually matches all designed states including
    outside-month and selected+focus;
-   Today uses the new subtle semantic foreground roles;
-   Calendar matches Figma and supports full keyboard navigation;
-   DatePicker is picker-only;
-   Basic mode supports single-date selection;
-   Range mode supports coordinated two-calendar range selection;
-   popup dismissal/focus behaviour is accessible;
-   controlled/uncontrolled APIs behave correctly;
-   Storybook demonstrates the useful public states without
    combinatorial clutter;
-   no Figma authoring-only props leak into the React API;
-   TypeScript strict validation passes;
-   Storybook build passes;
-   visual comparison against Figma shows no material mismatch.
