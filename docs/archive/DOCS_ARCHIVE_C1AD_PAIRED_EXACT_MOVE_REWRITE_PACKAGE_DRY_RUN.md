# Docs Archive C1ad Paired Exact Move Rewrite Package Dry-Run

Status: C1ad paired exact move/rewrite package dry-run completed.

Mode: A4.8 local docs-only dry-run package generation.

Machine-readable package: `docs/archive/DOCS_ARCHIVE_C1AD_PAIRED_EXACT_MOVE_REWRITE_PACKAGE.csv`

## Scope

- Candidate records: 200
- Current paths existing: 200
- Archive targets already existing: 0
- Records with scripts refs: 0
- Records with tests refs: 0
- Records with human-navigation risk: 39
- Records with blocker labels: 39

## Risk Buckets

| Risk bucket | Records |
| --- | ---: |
| agent_board_only | 93 |
| agent_board_plus_docs | 68 |
| human_navigation | 39 |

## Parent Directory Preview

| Target parent | Records | Exists now |
| --- | ---: | --- |
| `docs\archive\numbered_legacy` | 1 | True |
| `docs\archive\phases\v10` | 19 | True |
| `docs\archive\phases\v11` | 18 | False |
| `docs\archive\phases\v12` | 9 | False |
| `docs\archive\phases\v13` | 17 | False |
| `docs\archive\phases\v14` | 24 | False |
| `docs\archive\phases\v7` | 56 | True |
| `docs\archive\phases\v8` | 31 | True |
| `docs\archive\phases\v9` | 25 | False |

## Required Execution Shape If Approved Later

A future execution must pair each exact file move with exact source-reference rewrites in the same batch, because standalone rewrite was already blocked by missing archive targets.

Execution must stay under the current safety thresholds unless Jenn separately authorizes more: no more than 20 file moves per batch and no more than 50 replacement hits per batch.

## Non-Execution

No files were moved. No references were rewritten. No wrappers were created. No validator behavior was changed.

## Recommended Next

C1ae paired package verifier review, then C1af split decision.
