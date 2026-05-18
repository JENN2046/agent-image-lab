# Docs Archive C1d Move Execution Record

Status: C1d exact-file physical move completed validated
Mode: A4.8 local documentation archive movement
Authorization basis: user authorized C1d physical move after review of `docs/archive/DOCS_ARCHIVE_C1D_EXACT_MOVE_AUTHORIZATION_PACKAGE_DRY_RUN.md`
Source package: `docs/archive/DOCS_ARCHIVE_C1D_EXACT_MOVE_AUTHORIZATION_PACKAGE_DRY_RUN.md`

This record documents the physical move execution for the 208 C1c `future exact-move candidates`.

## Executed Scope

Only the exact 208 source and destination pairs listed in the C1d authorization package were moved.

Pre-move checks:

| Check | Count |
| --- | ---: |
| exact allowlist rows | 208 |
| missing source files | 0 |
| destinations already existing | 0 |
| missing destination parent directories | 0 |
| duplicate source paths | 0 |
| duplicate destination paths | 0 |
| invalid source path boundaries | 0 |
| invalid destination path boundaries | 0 |

Post-move checks:

| Check | Count |
| --- | ---: |
| moved files | 208 |
| source paths still existing | 0 |
| destination files existing | 208 |

## Boundary

This execution did not:

- move files outside the exact C1d 208-file allowlist
- delete unrelated files
- create wrappers
- rewrite references
- change validator behavior
- split scripts
- process `runs/`
- stage, commit, push, tag, release, or deploy
- execute A5
- call provider, plugin, API, DailyNote, VCP memory, or runtime
- read `.env`, secrets, private paths, real manifests, VCPChat, or VCPToolBox

## Result

The C1d physical move adds the second exact-file archive batch after C1a.

Post-move reference follow-up: `docs/archive/DOCS_ARCHIVE_C1D_POST_MOVE_REFERENCE_MAP_DRY_RUN.md`.

The remaining docs categories from C1c remain untouched:

- validator-blocked records
- wrapper-required records
- docs-only-reference records
- current authority docs
- docs/archive planning and execution records

## Validation

Completed validation:

- `git diff --check`
- `node scripts/validate_agent_board_state.js`
- `powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1`
