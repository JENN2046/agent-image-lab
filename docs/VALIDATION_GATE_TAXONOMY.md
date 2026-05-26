# Validation Gate Taxonomy

This repository uses layered local validation gates. Gate names describe the
question they answer; they are not maturity claims beyond that scope.

## Gate Layers

| Command | Purpose | Scope |
| --- | --- | --- |
| `npm run validate:smoke` | Fast repository health check | Parse `package.json`, require core JS modules, syntax-check static Review Console JS, verify static server traversal guard, verify `.env.local` is not tracked, and verify `runs/` ignore rules block new image binaries. |
| `npm run validate:mvp` | Minimal product skeleton validation | Preview capsule plan-only behavior, existing capsule validation, read-only adapter dangerous-request blocking, NativeDoubao dry-run/preflight no API contact, NativeDoubao adapter fail-closed behavior, and static Review Console mock structure. |
| `npm run validate:capsule-regression` | Capsule product-core regression | The previous capsule product-core gate, now named as a regression layer. |
| `npm run validate:governance` | Governance consistency validation | The previous overgrown MVP gate: docs, roadmap, `.agent_board`, handoff, receipt, authorization, autopilot, historical phase, and governance regression checks. |
| `npm run validate:all` | Full local aggregate | Runs smoke, MVP core, capsule regression, and governance in order. |

## Compatibility

`npm run validate:legacy-mvp` is retained as a compatibility alias for the old
MVP semantics through `scripts/validate_governance.ps1`.

`npm run validate:capsules` is retained as a compatibility alias for
`npm run validate:capsule-regression`.

`npm run validate:mvp-core` is retained as an explicit alias for the new MVP
core validator.

## Boundaries

These gates do not authorize provider calls, secret value reads, image
generation, push, tag, release, deployment, or destructive operations. The MVP
core validator intentionally excludes `.agent_board`, historical phase docs,
governance ledger, commit readiness, and release readiness.
