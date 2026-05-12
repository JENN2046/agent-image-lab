# Agent Image Lab Project Master Plan

Purpose: short index for current project direction. This file is not the only
source of truth. Detailed history and operating authority remain in `README.md`,
`docs/00_project_roadmap.md`, `AGENTS.md`, and `.agent_board/`.

## Current Baseline

```text
branch: master
source_head_before_v7_243: 03fd398
origin_master_at_v7_243_start: 03fd398
status: v7.243 product image A5 generation authorization draft
mode: A4.5 docs-only preflight-pending authorization record
```

## Product Direction

Agent Image Lab remains a VCP-native visual production orchestration layer.
The product mainline has returned to image workflow planning. The Prompt Package
Builder now defines the first controllable artifact before generation
authorization or provider contact: a reviewable product image prompt package.
v7.228 adds the fillable instance template for that package without creating a
real generation task. v7.229 adds the human review checklist and status taxonomy
that decide whether a package may be referenced by a future A5 authorization
draft. v7.230 adds the non-executing handoff template from approved package to
future A5 authorization draft inputs. v7.231 defines the future generated asset
status taxonomy and review surface fields. v7.232 defines the non-writing
memory suitability decision matrix. v7.233 links these artifacts into a single
Delivery / Review Surface Package. v7.234 turns the chain into an operator
runbook. v7.235 validates the chain with a synthetic matte ceramic coffee mug
walkthrough. v7.236 confirms the chain is ready for a non-active A5
authorization draft, not active execution. v7.237 creates that non-active draft.
v7.238 reviews it as safe A4 paperwork while keeping active A5 blocked. v7.239
creates a non-executing generation plan draft to provide a future plan
reference. v7.240 confirms the plan draft and authorization draft are
compatible at paper level while keeping active A5 blocked. v7.241 patches the
non-active authorization draft with the plan ref/version while leaving all
executable A5 fields blocked. v7.242 classifies the remaining active
authorization gaps and separates A4 paper-preparable fields from fields that
must wait for explicit active authorization. v7.243 now keeps a one-page
preflight-pending authorization draft with plugin/model/call-count/output and
approval fields recorded, while `execute_now=false` keeps real execution
blocked.

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

Active preflight against `docs/product_image_active_authorization_package_skeleton.md`
is blocked by dirty worktree. Next action is
`resolve_dirty_worktree_before_a5_execution`: make the current local changes safe
or explicitly checkpoint them, then rerun preflight. Do not call plugins,
generate images, save output, write memory, or perform remote/version actions
unless fresh preflight passes and a separate execution decision is made.
