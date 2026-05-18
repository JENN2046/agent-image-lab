# Docs Archive Migration Manifest

Status: C1 dry-run manifest
Mode: A4.8 local documentation only
Base plan: `docs/PROJECT_RESTRUCTURE_PREFLIGHT_PLAN.md`
Reference policy: `docs/archive/DOCS_ARCHIVE_REFERENCE_POLICY.md`
Zero-reference candidates: `docs/archive/DOCS_ARCHIVE_ZERO_REFERENCE_CANDIDATES.md`
YAML-aware zero-reference candidates: `docs/archive/DOCS_ARCHIVE_YAML_AWARE_ZERO_REFERENCE_CANDIDATES.md`
C1a move authorization package: `docs/archive/DOCS_ARCHIVE_C1A_MOVE_AUTHORIZATION_PACKAGE.md`
C1a move execution record: `docs/archive/DOCS_ARCHIVE_C1A_MOVE_EXECUTION_RECORD.md`
C1b reference map dry-run: `docs/archive/DOCS_ARCHIVE_C1B_REFERENCE_MAP_DRY_RUN.md`
C1c remaining docs classification dry-run: `docs/archive/DOCS_ARCHIVE_C1C_REMAINING_DOCS_CLASSIFICATION_DRY_RUN.md`
C1d exact-move authorization package dry-run: `docs/archive/DOCS_ARCHIVE_C1D_EXACT_MOVE_AUTHORIZATION_PACKAGE_DRY_RUN.md`
C1d move execution record: `docs/archive/DOCS_ARCHIVE_C1D_MOVE_EXECUTION_RECORD.md`
C1d post-move reference map dry-run: `docs/archive/DOCS_ARCHIVE_C1D_POST_MOVE_REFERENCE_MAP_DRY_RUN.md`
C1e remaining docs reclassification refresh: `docs/archive/DOCS_ARCHIVE_C1E_REMAINING_DOCS_RECLASSIFICATION_REFRESH.md`

This manifest records proposed future archive targets for historical `docs/` records. It is not a file-move authorization.

## Boundary

This dry run did not:

- move docs
- delete files
- split scripts
- process `runs/`
- stage, commit, push, tag, release, or deploy
- execute A5
- call provider, plugin, API, DailyNote, VCP memory, or runtime
- read `.env`, secrets, private paths, real manifests, VCPChat, or VCPToolBox

## Inventory Snapshot

Read-only scan of top-level `docs/*.md` found:

| Class | Count | Decision |
| --- | ---: | --- |
| `v*` phase docs | 961 | future archive candidate |
| numbered legacy docs | 233 | future archive candidate |
| current authority docs | 2 | keep in place |
| other docs | 88 | manual review before any archive move |

Phase-doc count by major version:

| Version | Count | Future target |
| --- | ---: | --- |
| `v6` | 1 | `docs/archive/phases/v6/` |
| `v7` | 630 | `docs/archive/phases/v7/` |
| `v8` | 38 | `docs/archive/phases/v8/` |
| `v9` | 25 | `docs/archive/phases/v9/` |
| `v10` | 20 | `docs/archive/phases/v10/` |
| `v11` | 18 | `docs/archive/phases/v11/` |
| `v12` | 9 | `docs/archive/phases/v12/` |
| `v13` | 17 | `docs/archive/phases/v13/` |
| `v14` | 203 | `docs/archive/phases/v14/` |

## Proposed Path Mapping Rules

These rules are the dry-run migration manifest. They define old path to future target path without moving files.

| Old path pattern | Future target pattern | Classification | Status |
| --- | --- | --- | --- |
| `docs/v6_*.md` | `docs/archive/phases/v6/<same_filename>` | future archive | not moved |
| `docs/v7_*.md` | `docs/archive/phases/v7/<same_filename>` | future archive | not moved |
| `docs/v8_*.md` | `docs/archive/phases/v8/<same_filename>` | future archive | not moved |
| `docs/v9_*.md` | `docs/archive/phases/v9/<same_filename>` | future archive | not moved |
| `docs/v10_*.md` | `docs/archive/phases/v10/<same_filename>` | future archive | not moved |
| `docs/v11_*.md` | `docs/archive/phases/v11/<same_filename>` | future archive | not moved |
| `docs/v12_*.md` | `docs/archive/phases/v12/<same_filename>` | future archive | not moved |
| `docs/v13_*.md` | `docs/archive/phases/v13/<same_filename>` | future archive | not moved |
| `docs/v14_*.md` | `docs/archive/phases/v14/<same_filename>` | future archive | not moved |
| `docs/[0-9]*_*.md` | `docs/archive/numbered_legacy/<same_filename>` | future archive | not moved |
| `docs/PROJECT_STRUCTURE.md` | keep at `docs/PROJECT_STRUCTURE.md` | current authority | do not move |
| `docs/PROJECT_RESTRUCTURE_PREFLIGHT_PLAN.md` | keep at `docs/PROJECT_RESTRUCTURE_PREFLIGHT_PLAN.md` | current authority | do not move |
| `docs/*.md` not matched above | `docs/archive/manual_review/<same_filename>` only after review | manual review | not moved |

## Sample Mappings

Representative examples:

| Old path | Future target | Status |
| --- | --- | --- |
| `docs/v14_001_route_selection_gate.md` | `docs/archive/phases/v14/v14_001_route_selection_gate.md` | not moved |
| `docs/v14_079_review_report_final_local_closeout_gate.md` | `docs/archive/phases/v14/v14_079_review_report_final_local_closeout_gate.md` | not moved |
| `docs/v10_001_closeout_and_project_route_reset_gate.md` | `docs/archive/phases/v10/v10_001_closeout_and_project_route_reset_gate.md` | not moved |
| `docs/v7_0_real_production_landing_preflight.md` | `docs/archive/phases/v7/v7_0_real_production_landing_preflight.md` | not moved |
| `docs/00_project_roadmap.md` | `docs/archive/numbered_legacy/00_project_roadmap.md` | not moved |
| `docs/123_v4_6_local_commit_scope_manifest.md` | `docs/archive/numbered_legacy/123_v4_6_local_commit_scope_manifest.md` | not moved |
| `docs/HISTORICAL_DOCS_COMPACTION_INDEX.md` | manual review before any archive target | not moved |
| `docs/LEGACY_DOCS_CONTEXT_QUARANTINE.md` | manual review before any archive target | not moved |

## Required Compatibility Before Any Move

Before a physical C1 move, create or verify:

- README references distinguish current authority from archive records.
- `PROJECT_MASTER_PLAN.md` old references are either preserved as historical references or updated with archive paths.
- `.agent_board` references remain resume-safe.
- Validators that read exact `docs/` paths are checked before and after any move.
- No `scripts/validate_mvp.ps1` expectation relies on a moved path without a wrapper, redirect, or updated reference.

## C1 Move Preconditions

Physical archive movement remains blocked until a separate task explicitly approves it and names:

- exact files or path classes to move
- destination directories
- compatibility or redirect strategy
- validation commands
- rollback plan
- stop conditions

## Validation For This Dry Run

Required validation:

```powershell
git diff --check
node scripts\validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

## Recommended Next Step

Use `docs/archive/DOCS_ARCHIVE_REFERENCE_POLICY.md` before any physical move. C1 physical movement remains blocked until an exact file list, compatibility strategy, validation plan, rollback plan, and stop conditions are separately approved.
