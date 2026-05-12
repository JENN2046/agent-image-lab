# Agent Image Lab Project Master Plan

Purpose: short index for current project direction. This file is not the only
source of truth. Detailed history and operating authority remain in `README.md`,
`docs/00_project_roadmap.md`, `AGENTS.md`, and `.agent_board/`.

## Current Baseline

```text
branch: master
source_head_before_v7_229: cd3414b
origin_master_at_v7_229_start: cd3414b
status: v7.229 prompt package human review checklist gate
mode: A4 docs-only product review planning
```

## Product Direction

Agent Image Lab remains a VCP-native visual production orchestration layer.
The product mainline has returned to image workflow planning. The Prompt Package
Builder now defines the first controllable artifact before generation
authorization or provider contact: a reviewable product image prompt package.
v7.228 adds the fillable instance template for that package without creating a
real generation task. v7.229 adds the human review checklist and status taxonomy
that decide whether a package may be referenced by a future A5 authorization
draft.

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

Proceed to `v7.230_prompt_package_a5_authorization_handoff_gate`. Define the
handoff fields from approved prompt package instance to an independent A5
authorization package, without activating A5 or selecting a provider.
