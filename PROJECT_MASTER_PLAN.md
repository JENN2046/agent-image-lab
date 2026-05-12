# Agent Image Lab Project Master Plan

Purpose: short index for current project direction. This file is not the only
source of truth. Detailed history and operating authority remain in `README.md`,
`docs/00_project_roadmap.md`, `AGENTS.md`, and `.agent_board/`.

## Current Baseline

```text
branch: master
source_head_before_v7_226: cbe3fc6
origin_master_at_v7_226_start: cbe3fc6
status: v7.226 image workflow product return gate
mode: A4 product planning / image workflow return
```

## Product Direction

Agent Image Lab remains a VCP-native visual production orchestration layer.
The product mainline has returned to image workflow planning. The next highest
value A4 product task is the Prompt Package Builder because it improves the
first controllable artifact before generation authorization or provider contact.

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

Proceed to `v7.227_prompt_package_builder_taskbook_gate`. Do not create another
governance-only gate unless it resolves a concrete blocker discovered during
product work.
