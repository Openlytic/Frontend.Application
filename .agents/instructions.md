<!-- PURPOSE: Behavioral rules for autonomous coding agents in this repository. -->

# Openlytic Frontend Organization - Agent Instructions

## ClassName Composition Policy

1. Always use `cn` from `@/utils` for `className` composition (static and conditional).
2. Keep `cn` implementation in `utils/cn.ts` and export it through `utils/index.ts`.
3. While touching a file, safely migrate touched string-interpolated conditional class patterns to `cn(...)` without changing behavior.

## Forbidden Patterns

1. Do not use `clsx` directly in feature components for class composition.
2. Do not define/export `cn` anywhere other than `utils/cn.ts`.

## Validation

1. Run `npm run lint` after edits.
2. Run `npm run build` when making structural or cross-module changes.