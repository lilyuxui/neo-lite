# Neo-Lite UI v0.1.0 Release Readiness

This document freezes the current Neo-Lite component library scope for the first MVP component release.

## Release Scope

Version: `0.1.0`

Package: `neo-lite-ui`

Release intent: stable MVP component foundation before public documentation website work begins.

## Component Inventory

| Component | Public export | Storybook entry | Latest spec used |
| --- | --- | --- | --- |
| Badge | `Badge`, `BadgeProps`, `BadgeVariant` | `Components/Badge` | `neo-lite-badge-spec-v0.1.md` |
| Button | `Button`, `ButtonProps`, `ButtonSize`, `ButtonVariant` | `Components/Button` | `neo-lite-button-spec-v0.1.md` |
| Card | `Card`, `CardProps` | `Components/Card` | `neo-lite-card-spec-v0.1.md` |
| Checkbox | `Checkbox`, `CheckboxProps` | `Components/Checkbox` | `neo-lite-checkbox-spec-v0.1.md` |
| Dialog | `Dialog`, `DialogProps` | `Components/Dialog` | `neo-lite-dialog-spec-v0.1.md` |
| Input | `Input`, `InputProps` | `Components/Input` | `neo-lite-input-spec-v0.1.md` |
| Menu | `Menu`, `MenuProps` | `Components/Menu` | `neo-lite-menu-spec-v0.1.md` |
| MenuItem | `MenuItem`, `MenuItemProps` | `Components/Menu Item` | `neo-lite-menu-item-spec-v0.1.md` |
| Selection | `Selection`, `SelectionOption`, `SelectionProps` | `Components/Selection` | `neo-lite-selection-spec-v0.1.md` |
| Tab | `Tab`, `TabProps` | `Components/Tabs` | `neo-lite-tab-spec-v0.1.md` |
| Tabs | `Tabs`, `TabsProps` | `Components/Tabs` | `neo-lite-tabs-spec-v0.1.md` |

## Freeze Boundary

The v0.1.0 release does not include new components, a documentation website, extra layout primitives, or redesigned component behaviour.

Current specs and Figma-approved component behaviour are the source of truth. Older spec files remain historical references when a newer spec exists.

## Release Checks

Run these checks before tagging or publishing a release:

```bash
npm run typecheck
npm run build-storybook
npm pack --dry-run
```

Current freeze QA status:

| Check | Status |
| --- | --- |
| `npm run typecheck` | Passed |
| `npm run build-storybook` | Passed |
| `npm --cache /tmp/neo-lite-npm-cache pack --dry-run` | Passed |

No lint or test config is currently present in the repository.

## Release Notes

- `package.json` and `package-lock.json` are both at `0.1.0`.
- Public package exports are available from `src/index.ts`.
- Theme CSS is exported as `neo-lite-ui/styles/theme.css`.
- `.npmignore` explicitly excludes local build output, Storybook-only files, and the unused horizontal Card image from package packing.
- The package is currently marked `"private": true`; remove that only when an npm publishing workflow is intentionally approved.
