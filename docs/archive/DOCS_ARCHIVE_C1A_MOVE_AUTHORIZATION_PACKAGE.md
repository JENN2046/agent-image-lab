# Docs Archive C1a Physical Move Authorization Package

Status: C1a dry-run authorization package
Mode: A4.8 local documentation only
Candidate source: `docs/archive/DOCS_ARCHIVE_YAML_AWARE_ZERO_REFERENCE_CANDIDATES.md`
Execution record: `docs/archive/DOCS_ARCHIVE_C1A_MOVE_EXECUTION_RECORD.md`

This package defines the narrow authorization shape for a future C1a docs archive physical move. It is not itself a move authorization.

## Non-Authorization

This C1a dry run does not authorize:

- moving docs
- deleting files
- changing validator behavior
- splitting scripts
- processing `runs/`
- staging, committing, pushing, tagging, releasing, or deploying
- executing A5
- calling provider, plugin, API, DailyNote, VCP memory, or runtime
- reading `.env`, secrets, private paths, real manifests, VCPChat, or VCPToolBox

## Proposed Move Scope

Future C1a may move only the exact candidates listed in:

```text
docs/archive/DOCS_ARCHIVE_YAML_AWARE_ZERO_REFERENCE_CANDIDATES.md
```

The C1.3 list contains:

```yaml
historical_candidate_files_scanned: 1194
c1_2_markdown_target_zero_reference_candidates: 460
c1_3_yaml_aware_zero_reference_candidates: 276
candidates_removed_by_yaml_aware_references: 184
yaml_aware_external_referenced_candidates: 918
docs_archive_planning_reference_rows_excluded_from_blocker_scan: 477
```

The exact move allowlist for a future C1a task must be copied from the C1.3 table rows only. Do not infer additional files from patterns.

## Destination Rules

Allowed future destinations:

| Source pattern | Destination pattern |
| --- | --- |
| `docs/vN_*` | `docs/archive/phases/vN/<same_filename>` |
| `docs/[0-9]*` | `docs/archive/numbered_legacy/<same_filename>` |

The move must preserve filenames exactly.

## Explicitly Forbidden In C1a

C1a must not move:

- current authority docs
- `docs/PROJECT_STRUCTURE.md`
- `docs/PROJECT_RESTRUCTURE_PREFLIGHT_PLAN.md`
- any `docs/archive/` planning record
- `docs/00_project_roadmap.md`
- any doc with hard-surface, validator, test, README, `PROJECT_MASTER_PLAN.md`, or `.agent_board` operational references
- any file not listed in `docs/archive/DOCS_ARCHIVE_YAML_AWARE_ZERO_REFERENCE_CANDIDATES.md`
- any `runs/` file
- any image, binary, cache, log, DB, local path, secret, or env file

## Pre-Move Required Checks

Before any future physical move:

```powershell
git status --short --branch
git diff --check
node scripts\validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

The worktree must be reviewed for user-owned changes. A dirty worktree is not automatically a blocker, but C1a must not overwrite unrelated changes.

The candidate list must still contain exactly `276` table rows:

```powershell
(Select-String -Path docs\archive\DOCS_ARCHIVE_YAML_AWARE_ZERO_REFERENCE_CANDIDATES.md -Pattern '^\| [0-9]+ \|' | Measure-Object).Count
```

Expected result:

```text
276
```

## Future Move Execution Shape

If explicitly authorized later, the move should be implemented as a reversible exact-file operation:

```text
for each exact row in docs/archive/DOCS_ARCHIVE_YAML_AWARE_ZERO_REFERENCE_CANDIDATES.md:
  source = Current path
  destination = Future target
  create destination parent directory if missing
  move source to destination
```

Do not use broad glob moves.
Do not use deletion.
Do not use `git add .`.
Do not stage or commit unless separately authorized.

## Post-Move Required Checks

After a future C1a move:

```powershell
git status --short --branch
git diff --check
node scripts\validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

Run an operational reference scan excluding `docs/archive/` planning records. It should not report missing old paths from README, `PROJECT_MASTER_PLAN.md`, `.agent_board`, `scripts`, or `tests`.

## Rollback Plan

If validation fails after a future C1a move:

```text
for each exact row moved:
  move destination back to source
```

Rollback must use the same exact C1.3 list. Do not delete archive directories during rollback unless a separate cleanup task is authorized.

After rollback:

```powershell
git status --short --branch
git diff --check
node scripts\validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

## Stop Conditions

Stop before or during future C1a if any of these appears:

- candidate count is not `276`
- a source path is missing before the move
- a destination path already exists
- an exact row points outside `docs/`
- a destination points outside `docs/archive/`
- a current authority doc would move
- `docs/00_project_roadmap.md` would move
- a validator-bound or hard-surface referenced doc would move
- `git diff --check` fails
- `node scripts\validate_agent_board_state.js` fails
- `powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1` fails
- a move requires deletion, overwrite, broad globbing, or destructive cleanup
- the task would touch `runs/`, image files, secrets, `.env`, cache, DB, or private paths
- the task would require A5, provider, plugin, API, DailyNote, VCP memory, runtime, real manifest, VCPChat, or VCPToolBox actions
- the task would require staging, commit, push, tag, release, or deploy without separate explicit authorization

## Authorization Needed Later

A future real C1a move requires a separate explicit user authorization similar to:

```text
Authorize C1a docs archive physical move using only the 276 exact rows in docs/archive/DOCS_ARCHIVE_YAML_AWARE_ZERO_REFERENCE_CANDIDATES.md.
Allowed operation: move each listed source to its listed future target.
Forbidden: delete, overwrite existing destination, move unlisted files, change validators, stage, commit, push, tag, release, deploy, A5, provider/plugin/API/image generation/DailyNote/VCP memory/runtime/real manifest/VCPChat/VCPToolBox.
Validation: git status --short --branch; git diff --check; node scripts\validate_agent_board_state.js; powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1.
Rollback: move each destination back to its source using the same exact list if validation fails.
```

## Recommended Next

Review this package. If it is acceptable, the next step can be a separate C1a execution authorization. Without that authorization, keep planning only.
