# Project Restructure Preflight Plan

Status: C0.5 plan landed, execution not authorized
Mode: A4.8 local documentation and resume-surface sync only
Base contract: `AGENTS.md`

This document records the Route C aggressive restructure preflight design. It is a migration blueprint, not a migration authorization.

## Non-Authorization

This plan does not authorize:

- moving old files
- deleting files
- staging or committing
- push, tag, release, or deploy
- A5 execution
- provider, plugin, API, DailyNote, VCP memory, or runtime actions
- image generation, image conversion, or `preview.webp` creation
- real manifest, VCPChat, or VCPToolBox reads
- touching `.env`, secret, token, cache, or private local path values
- changing dependencies
- processing `runs/` or tracked image evidence

## Current Evidence

Read-only C-preflight observed these high-level counts:

```text
docs: 1291 files
tests: 351 files
scripts: 321 files
review_console: 147 files
```

The main structure pressure points are:

- `docs/` contains a large historical phase record set.
- `scripts/` mixes validators, runners, debug helpers, runtime checks, and A5-adjacent tools.
- `tests/schema_examples/` is tightly coupled to many historical validators.
- `runs/` contains local runtime output and historical tracked evidence and must not be treated as portable source of truth.
- `.agent_board/` is the active resume rail but contains very large state files.

## Migration Table

| Current path | Recommended target | Classification | Notes |
| --- | --- | --- | --- |
| `docs/v*.md` | `docs/archive/phases/v*/` | archivable | Move only after an index and reference map exist. |
| `docs/[0-9]*.md` | `docs/archive/numbered_legacy/` | archivable | Legacy numbered records should be demoted, not deleted. |
| `docs/PROJECT_STRUCTURE.md` | keep in place | must_keep | Current structure authority. |
| `docs/PROJECT_RESTRUCTURE_PREFLIGHT_PLAN.md` | keep in place | must_keep | Route C migration blueprint. |
| `scripts/validate_mvp.ps1` | keep in place | do_not_move | Aggregate validation entry point. |
| `scripts/validate_v*.js` | `scripts/validators/legacy/v*/` | requires_wrapper | Old paths need compatibility wrappers before any move. |
| `scripts/validate_*.js` domain validators | `scripts/validators/<domain>/` | requires_wrapper | Move only after imports and MVP wiring are mapped. |
| `scripts/lib/` | keep or `scripts/validators/lib/` | manual_confirm | Shared helper location; moving can break many validators. |
| `scripts/run_*`, `scripts/execute_*`, `scripts/open_runtime_*` | `scripts/a5_runners/` or `scripts/blocked_runners/` | manual_confirm | A5 or runtime-adjacent; old path should become a refusal wrapper if moved. |
| `tests/schema_examples/v*.example.*` | `tests/fixtures/legacy/phases/` | requires_wrapper | Many validators reference exact paths. |
| `tests/fixtures/` | keep in place | must_keep | Already a fixture bucket. |
| `review_console/static_prototype/` | keep in place | must_keep | Safe static prototype surface. |
| `review_console/runtime_prototype/` | keep in place with stronger boundary docs | do_not_move_initially | Runtime semantics are sensitive; avoid first-wave movement. |
| `review_console/embed_contract/` | keep in place initially | manual_confirm | Integration planning records, not runtime authorization. |
| `runs/` | do not migrate | do_not_touch | Local-only and A5 evidence risk; separate human decision required. |
| `asset_archive/accepted_samples/` | keep in place | must_keep | New Git-portable preview capsule path. |
| `asset_archive/accepted/` | keep as legacy bucket | legacy_keep | Do not write new accepted sample capsules here. |
| `accepted_samples/` | keep in place | must_keep | Registry and category indexes. |
| `.agent_board/` | keep in place | must_keep | Active resume rail; later archival requires separate plan. |

## Compatibility Requirements

Before any physical move, create compatibility surfaces:

- Old `scripts/validate_v*.js` paths should remain callable as wrappers.
- `scripts/validate_mvp.ps1` should be updated only after wrappers pass.
- Old `tests/schema_examples/...` paths should remain available or have explicit redirect manifests.
- README, `PROJECT_MASTER_PLAN.md`, `.agent_board`, and validation checklist references must be updated in the same batch as any path move.
- Runner paths should not silently execute from a new location; moved runner entry points should fail closed unless an active A5 package authorizes the exact action.

## A5 Hard Stops

Route C must stop before:

- `runs/` cleanup, migration, or image handling
- real image files such as `.jpg`, `.jpeg`, `.png`, `.webp`
- provider runners and real generation scripts
- runtime and remote debug scripts
- push, tag, release, deploy, or publication paths
- `.env`, secret, token, cookie, cache, or private local path reads
- real VCPChat, VCPToolBox, or manifest reads
- DailyNote or VCP memory writes

## Batch Plan

### Batch C1: Docs Archive Index

Purpose:

- Add an archive index for historical docs.
- Define which docs are current authority and which are historical records.
- Do not move files in the first C1 dry run.

Validation:

```powershell
git diff --check
node scripts\validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

Rollback:

- Revert only the new index and README references.
- No moved files should exist in C1 dry run.

### Batch C2: Validator Layering

Purpose:

- Introduce wrappers and a validator index before moving validators.
- Keep `scripts/validate_mvp.ps1` as the stable aggregate entry point.

Validation:

```powershell
git diff --check
node --check <changed-wrapper-or-validator.js>
node scripts\validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

Rollback:

- Point wrappers back to the original validator files.
- Keep old paths intact until full validation passes.

### Batch C3: Runtime And Prototype Boundary Split

Purpose:

- Clarify `review_console/static_prototype/`, `runtime_prototype/`, `embed_contract/`, and `exports/` boundaries.
- Add guard documentation or refusal wrappers where needed.
- Do not integrate runtime or touch real VCPChat/VCPToolBox.

Validation:

```powershell
git diff --check
node scripts\validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

Rollback:

- Restore old README and boundary docs.
- Do not move runtime files in the first C3 pass.

### Batch C4: Local-Only Evidence Cleanup Design

Purpose:

- Produce a tracked-local-only inventory for `runs/`, images, cache/db files, local paths, and generated artifacts.
- Do not clean, delete, move, or untrack files without a separate human-approved plan.

Validation:

```powershell
git diff --check
node scripts\validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

Rollback:

- Revert only the inventory document.
- No filesystem cleanup should occur in C4 preflight.

## Recommended Next Step

Run Batch C1 as a dry-run manifest task:

```text
Create a docs archive migration manifest that lists old docs paths and proposed archive targets, but do not move files.
```

C1 physical movement remains unauthorized until the manifest is reviewed and explicitly approved.
