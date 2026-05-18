# Docs Archive

Status: archive directory with planning records plus C1a, C1d, and C1f moved historical records
Mode: A4.8 local documentation

This directory is reserved for future historical documentation archives. Its presence does not authorize moving, deleting, staging, committing, pushing, tagging, releasing, deploying, or running any A5 action.

## Purpose

`docs/archive/` will eventually hold historical records that are useful for audit but should not compete with current authority documents.

The current authority remains:

- `AGENTS.md`
- `AGENTS.autopilot-overlay.md`
- `.agent_board/RUN_STATE.md`
- `.agent_board/TASK_QUEUE.md`
- `.agent_board/HANDOFF.md`
- `docs/PROJECT_STRUCTURE.md`
- `docs/PROJECT_RESTRUCTURE_PREFLIGHT_PLAN.md`
- `scripts/validate_mvp.ps1`

## Planning Records

- `docs/archive/DOCS_ARCHIVE_MIGRATION_MANIFEST.md` records proposed future archive targets.
- `docs/archive/DOCS_ARCHIVE_REFERENCE_POLICY.md` records the C1.1 reference policy and explains why validator-bound docs must not move yet.
- `docs/archive/DOCS_ARCHIVE_ZERO_REFERENCE_CANDIDATES.md` records the C1.2 exact zero-external-reference candidate list without authorizing movement.
- `docs/archive/DOCS_ARCHIVE_YAML_AWARE_ZERO_REFERENCE_CANDIDATES.md` records the C1.3 stricter candidate list using `.md/.yaml/.yml` target references while excluding archive planning records from blocker status.
- `docs/archive/DOCS_ARCHIVE_C1A_MOVE_AUTHORIZATION_PACKAGE.md` records the C1a physical move authorization shape without authorizing movement.
- `docs/archive/DOCS_ARCHIVE_C1A_MOVE_EXECUTION_RECORD.md` records the C1a exact-file physical move execution result.
- `docs/archive/DOCS_ARCHIVE_C1B_REFERENCE_MAP_DRY_RUN.md` records the C1b post-move reference map and confirms old-path operational reference impact.
- `docs/archive/DOCS_ARCHIVE_C1C_REMAINING_DOCS_CLASSIFICATION_DRY_RUN.md` records the C1c remaining top-level historical docs classification without authorizing wrappers, reference rewrites, or additional movement.
- `docs/archive/DOCS_ARCHIVE_C1D_EXACT_MOVE_AUTHORIZATION_PACKAGE_DRY_RUN.md` records the C1d exact-move authorization package dry-run for 208 future exact-move candidates without moving files.
- `docs/archive/DOCS_ARCHIVE_C1D_MOVE_EXECUTION_RECORD.md` records the authorized C1d exact-file physical move of those 208 files.
- `docs/archive/DOCS_ARCHIVE_C1D_POST_MOVE_REFERENCE_MAP_DRY_RUN.md` records the C1d post-move reference map and confirms operational old-path reference impact.
- `docs/archive/DOCS_ARCHIVE_C1E_REMAINING_DOCS_RECLASSIFICATION_REFRESH.md` records the C1e refreshed classification of remaining top-level historical docs after C1a and C1d.
- `docs/archive/DOCS_ARCHIVE_C1F_EXACT_MOVE_AUTHORIZATION_PACKAGE_DRY_RUN.md` records the C1f exact-move authorization package dry-run for 20 future exact-move candidates without moving files.
- `docs/archive/DOCS_ARCHIVE_C1F_MOVE_EXECUTION_RECORD.md` records the authorized C1f exact-file physical move of those 20 files.
- `docs/archive/DOCS_ARCHIVE_C1F_POST_MOVE_REFERENCE_MAP_DRY_RUN.md` records the C1f post-move reference map and confirms operational old-path reference impact.
- `docs/archive/DOCS_ARCHIVE_C1G_EXACT_FILE_COMMIT_READINESS_AUDIT.md` records the exact-file commit readiness audit for the accumulated C1 archive migration changes without staging or committing.
- `docs/archive/DOCS_ARCHIVE_C1H_REMAINING_ARCHIVE_ROUTE_DECISION_DRY_RUN.md` records the post-C1f remaining archive route decision and confirms there are no remaining exact-move safe candidates in the C1e batch.
- `docs/archive/DOCS_ARCHIVE_C1I_DOCS_ONLY_REFERENCE_LINK_GRAPH_DRY_RUN.md` records the current link graph for the 67 docs-only-reference records and separates 65 rewrite-planning targets from 2 zero-reference drift candidates.
- `docs/archive/DOCS_ARCHIVE_C1J_DOCS_ONLY_REFERENCE_REWRITE_PACKAGE_DRY_RUN.md` records the docs-only-reference rewrite package dry-run with 29 source docs and 65 target replacement rules, without executing rewrites.
- `docs/archive/DOCS_ARCHIVE_C1K_DOCS_ONLY_REFERENCE_REWRITE_AUTHORIZATION_PACKAGE_DRY_RUN.md` records the C1k rewrite execution authorization package dry-run, including source allowlist, replacement rules, preflight/postflight, and future exact approval text.
- `docs/archive/DOCS_ARCHIVE_C1L_EXACT_FILE_COMMIT_READINESS_AUDIT.md` records the exact-file commit readiness audit for the current C1h-C1k route-planning changes without staging or committing.

## Non-Authorization

This README does not authorize:

- moving any `docs/` file
- deleting historical records
- changing validators or test fixtures
- processing `runs/`
- reading secrets or private local paths
- provider, plugin, API, DailyNote, VCP memory, runtime, VCPChat, VCPToolBox, or real manifest actions
- staging, committing, pushing, tagging, releasing, or deploying

## Future Layout

Planned archive buckets:

```text
docs/archive/phases/v6/
docs/archive/phases/v7/
docs/archive/phases/v8/
docs/archive/phases/v9/
docs/archive/phases/v10/
docs/archive/phases/v11/
docs/archive/phases/v12/
docs/archive/phases/v13/
docs/archive/phases/v14/
docs/archive/numbered_legacy/
docs/archive/manual_review/
```

Physical movement requires a separate approved C1 move task after the dry-run manifest is reviewed.
