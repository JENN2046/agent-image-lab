# Docs Archive C1a Physical Move Execution Record

Status: C1a physical move completed validated
Mode: A4.8 local exact-file move
Authorization package: `docs/archive/DOCS_ARCHIVE_C1A_MOVE_AUTHORIZATION_PACKAGE.md`
Candidate source: `docs/archive/DOCS_ARCHIVE_YAML_AWARE_ZERO_REFERENCE_CANDIDATES.md`

This record documents the C1a physical move execution. It does not authorize any further movement.

## Scope Executed

The C1a move used the exact `276` candidate rows from:

```text
docs/archive/DOCS_ARCHIVE_YAML_AWARE_ZERO_REFERENCE_CANDIDATES.md
```

Execution result:

```yaml
moved_files: 276
created_parent_directories: 4
mode: exact_file_move_only
source_list: docs/archive/DOCS_ARCHIVE_YAML_AWARE_ZERO_REFERENCE_CANDIDATES.md
glob_move_used: false
delete_used: false
overwrite_used: false
stage_commit_push: false
```

Created parent directories:

```text
docs/archive/numbered_legacy/
docs/archive/phases/v10/
docs/archive/phases/v7/
docs/archive/phases/v8/
```

## Boundaries Preserved

The execution did not:

- move current authority docs
- move `docs/00_project_roadmap.md`
- move files outside the exact C1.3 list
- delete files
- overwrite destinations
- change validator behavior
- split scripts
- process `runs/`
- stage, commit, push, tag, release, or deploy
- execute A5
- call provider, plugin, API, DailyNote, VCP memory, or runtime
- read `.env`, secrets, private paths, real manifests, VCPChat, or VCPToolBox

## Validation

Validation completed after the exact-file move:

```powershell
git diff --check
node scripts\validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

Post-move operational reference scan completed:

```powershell
rg -n "docs[/\\](v[0-9]|[0-9])" README.md PROJECT_MASTER_PLAN.md .agent_board scripts tests docs
```

Result:

```yaml
operational_reference_hits_for_moved_candidates: 0
moved_candidate_rows: 276
source_still_exists: 0
destination_exists: 276
moved_status_rows: 276
```

## Rollback

Rollback, if needed, must use the same exact C1.3 candidate list:

```text
for each moved row:
  move Future target back to Current path
```

Do not delete archive directories during rollback unless a separate cleanup task is authorized.

## Recommended Next

C1b reference-map dry-run is recorded in `docs/archive/DOCS_ARCHIVE_C1B_REFERENCE_MAP_DRY_RUN.md`. Do not move additional files until a separate authorization names the next exact move set.
