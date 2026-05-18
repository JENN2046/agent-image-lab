# Docs Archive C1f Post-Move Reference Map Dry Run

Status: C1f post-move reference-map dry-run completed validated
Mode: A4.8 local documentation and reference audit only
Move record: `docs/archive/DOCS_ARCHIVE_C1F_MOVE_EXECUTION_RECORD.md`
Authorization package: `docs/archive/DOCS_ARCHIVE_C1F_EXACT_MOVE_AUTHORIZATION_PACKAGE_DRY_RUN.md`

This report reviews reference impact after the authorized C1f exact-file physical move of 20 docs into `docs/archive/phases/v7/`.

## Boundary

This dry run did not:

- move additional docs
- delete files
- create wrappers
- rewrite references
- change validator behavior
- split scripts
- process `runs/`
- stage, commit, push, tag, release, or deploy
- execute A5
- call provider, plugin, API, DailyNote, VCP memory, MCP, or runtime
- read `.env`, `.env.local`, secrets, private paths, real manifests, VCPChat, or VCPToolBox

## Scan Scope

The scan checked exact string references for both:

- the 20 old `docs/v7_*` source paths listed in the C1f package
- the 20 new `docs/archive/phases/v7/*` destination paths listed in the C1f package

Scanned surfaces:

- `README.md`
- `PROJECT_MASTER_PLAN.md`
- `AGENTS.md`
- `AGENTS.autopilot-overlay.md`
- `.agent_board/`
- `scripts/`
- `tests/`
- `docs/`

The scan covered tracked and untracked local text-like project files visible in the current workspace.

## Summary

| Metric | Count |
| --- | ---: |
| C1f moved candidates | 20 |
| scanned files | 2477 |
| old-path hit records | 124 |
| old-path hit total | 140 |
| new-path hit records | 84 |
| new-path hit total | 84 |
| unique old paths referenced | 20 |
| unique new paths referenced | 20 |

## Old-Path Reference Risk Classification

| Risk class | Records | Total hits | Decision |
| --- | ---: | ---: | --- |
| operational (`scripts/`, `tests/`) | 0 | 0 | no validator/script/test blocker found |
| authority/navigation (`README.md`, `PROJECT_MASTER_PLAN.md`, `AGENTS.md`, `AGENTS.autopilot-overlay.md`) | 0 | 0 | no current authority blocker found |
| `.agent_board` status surfaces | 0 | 0 | no board-level stale old-path blocker found |
| non-archive docs references | 0 | 0 | no top-level docs blocker found |
| archive planning or audit records | 124 | 140 | expected historical/audit references; keep as record |

## New-Path Reference Classification

| Source type | Records | Total hits | Decision |
| --- | ---: | ---: | --- |
| `docs/archive` | 84 | 84 | expected archive planning references |
| operational (`scripts/`, `tests/`) | 0 | 0 | no runtime or validation dependency added |
| authority/navigation | 0 | 0 | no required navigation update found beyond C1f status docs |

## Top Old-Path Reference Files

These are not blockers because every old-path hit is inside `docs/archive`.

| File | Records | Total hits | Classification |
| --- | ---: | ---: | --- |
| `docs/archive/DOCS_ARCHIVE_C1C_REMAINING_DOCS_CLASSIFICATION_DRY_RUN.md` | 20 | 22 | prior classification record |
| `docs/archive/DOCS_ARCHIVE_C1E_REMAINING_DOCS_RECLASSIFICATION_REFRESH.md` | 20 | 29 | source classification refresh |
| `docs/archive/DOCS_ARCHIVE_C1F_EXACT_MOVE_AUTHORIZATION_PACKAGE_DRY_RUN.md` | 20 | 20 | authorization package |
| `docs/archive/DOCS_ARCHIVE_C1F_MOVE_EXECUTION_RECORD.md` | 20 | 20 | move execution record |
| `docs/archive/phases/v7/v7_101_vcpchat_read_only_surface_evidence_report.md` | 13 | 14 | archived historical reference |
| `docs/archive/phases/v7/v7_158_batch_004_authorization_gate.md` | 5 | 5 | archived historical reference |
| `docs/archive/phases/v7/v7_163_batch_004_rescan_authorization_gate.md` | 5 | 5 | archived historical reference |
| `docs/archive/DOCS_ARCHIVE_ZERO_REFERENCE_CANDIDATES.md` | 4 | 4 | earlier candidate record |
| `docs/archive/phases/v7/v7_154_batch_003_correction_implementation_gate_closeout.md` | 2 | 2 | archived historical reference |
| `docs/archive/phases/v7/v7_72_concrete_cdp_endpoint_lock_patch_closeout.md` | 1 | 1 | archived historical reference |

## Top New-Path Reference Files

| File | Records | Total hits | Classification |
| --- | ---: | ---: | --- |
| `docs/archive/DOCS_ARCHIVE_C1C_REMAINING_DOCS_CLASSIFICATION_DRY_RUN.md` | 20 | 20 | prior target map |
| `docs/archive/DOCS_ARCHIVE_C1E_REMAINING_DOCS_RECLASSIFICATION_REFRESH.md` | 20 | 20 | refreshed target map |
| `docs/archive/DOCS_ARCHIVE_C1F_EXACT_MOVE_AUTHORIZATION_PACKAGE_DRY_RUN.md` | 20 | 20 | authorization package target map |
| `docs/archive/DOCS_ARCHIVE_C1F_MOVE_EXECUTION_RECORD.md` | 20 | 20 | move execution record target map |
| `docs/archive/DOCS_ARCHIVE_ZERO_REFERENCE_CANDIDATES.md` | 4 | 4 | earlier target map |

## Breakage Assessment

No C1f post-move breakage was detected in operational or current authority surfaces:

- `scripts/`: no old-path references to the 20 C1f moved files
- `tests/`: no old-path references to the 20 C1f moved files
- `README.md`: no old-path references to the 20 C1f moved files
- `PROJECT_MASTER_PLAN.md`: no old-path references to the 20 C1f moved files
- `AGENTS.md`: no old-path references to the 20 C1f moved files
- `AGENTS.autopilot-overlay.md`: no old-path references to the 20 C1f moved files
- `.agent_board/`: no old-path references to the 20 C1f moved files
- non-archive `docs/`: no old-path references to the 20 C1f moved files

The remaining old-path references are historical references inside archive planning records and archived documents. They should not be rewritten automatically because they preserve the audit history of the migration.

## Decision

C1f does not require wrapper files or immediate reference rewrites for the 20 moved files.

The next safe C-route step is an exact-file commit readiness audit for the accumulated C1 archive migration changes, unless the project owner requests another local archive classification step first.

Do not proceed to additional physical moves, wrapper generation, reference rewrites, staging, commit, or push without separate explicit authorization.
