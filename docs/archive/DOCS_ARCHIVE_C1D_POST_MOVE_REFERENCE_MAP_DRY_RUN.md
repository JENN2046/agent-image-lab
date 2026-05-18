# Docs Archive C1d Post-Move Reference Map Dry Run

Status: C1d post-move reference-map dry-run completed validated
Mode: A4.8 local documentation and reference audit only
Move record: `docs/archive/DOCS_ARCHIVE_C1D_MOVE_EXECUTION_RECORD.md`
Authorization package: `docs/archive/DOCS_ARCHIVE_C1D_EXACT_MOVE_AUTHORIZATION_PACKAGE_DRY_RUN.md`

This report reviews reference impact after the authorized C1d exact-file physical move of 208 docs into `docs/archive/phases/v7/`.

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
- call provider, plugin, API, DailyNote, VCP memory, or runtime
- read `.env`, secrets, private paths, real manifests, VCPChat, or VCPToolBox

## Scan Scope

The scan checked exact string references for both:

- the 208 old `docs/v7_*` source paths listed in the C1d package
- the 208 new `docs/archive/phases/v7/*` destination paths listed in the C1d package

Scanned surfaces:

- `README.md`
- `PROJECT_MASTER_PLAN.md`
- `AGENTS.md`
- `.agent_board/`
- `scripts/`
- `tests/`
- `docs/`

## Summary

| Metric | Count |
| --- | ---: |
| C1d moved candidates | 208 |
| scanned files | 1989 |
| old-path hit records | 769 |
| old-path hit total | 856 |
| new-path hit records | 561 |
| new-path hit total | 561 |
| unique old paths referenced | 208 |
| unique new paths referenced | 208 |

## Old-Path Reference Risk Classification

| Risk class | Records | Total hits | Decision |
| --- | ---: | ---: | --- |
| operational (`scripts/`, `tests/`) | 0 | 0 | no validator/script/test blocker found |
| authority/navigation (`README.md`, `PROJECT_MASTER_PLAN.md`, `AGENTS.md`) | 0 | 0 | no current authority blocker found |
| `.agent_board` status surfaces | 0 | 0 | no board-level stale old-path blocker found |
| non-archive docs references | 0 | 0 | no top-level docs blocker found |
| archive planning or audit records | 769 | 856 | expected historical/audit references; keep as record |

## New-Path Reference Classification

| Source type | Records | Total hits | Decision |
| --- | ---: | ---: | --- |
| `docs/archive` | 561 | 561 | expected archive planning references |
| operational (`scripts/`, `tests/`) | 0 | 0 | no runtime or validation dependency added |
| authority/navigation | 0 | 0 | no required navigation update found beyond C1d status docs |

## Top Old-Path Reference Files

These are not blockers because every old-path hit is inside `docs/archive`.

| File | Records | Total hits | Classification |
| --- | ---: | ---: | --- |
| `docs/archive/DOCS_ARCHIVE_C1C_REMAINING_DOCS_CLASSIFICATION_DRY_RUN.md` | 208 | 295 | source classification record |
| `docs/archive/DOCS_ARCHIVE_C1D_EXACT_MOVE_AUTHORIZATION_PACKAGE_DRY_RUN.md` | 208 | 208 | authorization package |
| `docs/archive/DOCS_ARCHIVE_ZERO_REFERENCE_CANDIDATES.md` | 145 | 145 | earlier candidate record |
| archived moved files under `docs/archive/phases/v7/` | 208 | 208 | historical self/cross references inside archived docs |

## Top New-Path Reference Files

| File | Records | Total hits | Classification |
| --- | ---: | ---: | --- |
| `docs/archive/DOCS_ARCHIVE_C1C_REMAINING_DOCS_CLASSIFICATION_DRY_RUN.md` | 208 | 208 | source classification target map |
| `docs/archive/DOCS_ARCHIVE_C1D_EXACT_MOVE_AUTHORIZATION_PACKAGE_DRY_RUN.md` | 208 | 208 | authorization package target map |
| `docs/archive/DOCS_ARCHIVE_ZERO_REFERENCE_CANDIDATES.md` | 145 | 145 | earlier candidate target map |

## Breakage Assessment

No C1d post-move breakage was detected in operational surfaces:

- `scripts/`: no old-path references to the 208 C1d moved files
- `tests/`: no old-path references to the 208 C1d moved files
- `README.md`: no old-path references to the 208 C1d moved files
- `PROJECT_MASTER_PLAN.md`: no old-path references to the 208 C1d moved files
- `AGENTS.md`: no old-path references to the 208 C1d moved files
- `.agent_board/`: no old-path references to the 208 C1d moved files
- non-archive `docs/`: no old-path references to the 208 C1d moved files

The remaining old-path references are historical references inside archive planning records and moved archived documents. They should not be rewritten automatically because they preserve the audit history of the migration.

## Decision

C1d does not require wrapper files or immediate reference rewrites for the 208 moved files.

Follow-up completed:

- C1e remaining-docs reclassification refresh: `docs/archive/DOCS_ARCHIVE_C1E_REMAINING_DOCS_RECLASSIFICATION_REFRESH.md`

The next safe C-route step after C1e is either:

- C1f exact-move authorization package dry-run for the remaining 20 future exact-move candidates
- exact-file commit readiness audit for the accumulated C1 archive migration changes

Do not proceed to additional physical moves, wrapper generation, reference rewrites, staging, commit, or push without separate explicit authorization.
