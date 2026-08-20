<!-- PURPOSE: Repository-specific guardrails for Copilot suggestions and code reviews. -->

# Copilot Instructions - Openlytic Frontend Organization

## ClassName Rules

1. Use `cn` from `@/utils` for all `className` composition.
2. Keep `cn` defined in `utils/cn.ts` and exported from `utils/index.ts`.
3. While editing a file, safely migrate touched string-interpolated conditional class patterns to `cn(...)` without changing behavior.

## Never

1. Never use `clsx` directly in component files for class composition.
2. Never define `cn` anywhere other than `utils/cn.ts`.