# Agent Image Lab Project Master Plan

Purpose: short index for current project direction. This file is not the only
source of truth. Detailed history and operating authority remain in `README.md`,
`docs/00_project_roadmap.md`, `AGENTS.md`, and `.agent_board/`.

## Current Baseline

```text
branch: master
synced_head: a8f3d70
origin_master: a8f3d70
status: v7.225 balanced codex exec Worker/Verifier contract patch completed_validated
mode: A4 docs-only governance-minimal patch
```

## Product Direction

Agent Image Lab remains a VCP-native visual production orchestration layer.
The product mainline should return to concrete Review Console, prompt package,
authorization package, and production-readiness surfaces after this governance
patch.

## Active Boundaries

```text
A5: not authorized
provider contact: not authorized
runtime execution: not authorized
plugin call: not authorized
image generation: not authorized
DailyNote / VCP memory write: not authorized
real manifest / VCPChat / VCPToolBox read: not authorized
tag / release / deploy / push: not authorized by this file
```

## Operating Model

Use one persistent commander as the source of judgment. Use temporary
`codex exec` Workers only for exact task contracts. Use read-only Verifiers only
for evidence review. The commander remains responsible for final scope review,
validation interpretation, staging, commit decisions, and next-task selection.

## Recommended Next

Return to a real product-mainline task. Do not create another governance-only
gate unless it resolves a concrete blocker discovered during product work.
