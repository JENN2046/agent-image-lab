# Docs Archive Reference Policy

Status: C1.1 dry-run policy
Mode: A4.8 local documentation only
Base manifest: `docs/archive/DOCS_ARCHIVE_MIGRATION_MANIFEST.md`

This policy records how historical `docs/` references must be handled before any physical archive move. It is not a file-move authorization.

## Boundary

This C1.1 dry run does not authorize:

- moving docs
- deleting files
- changing validator behavior
- splitting scripts
- processing `runs/`
- staging, committing, pushing, tagging, releasing, or deploying
- executing A5
- calling provider, plugin, API, DailyNote, VCP memory, or runtime
- reading `.env`, secrets, private paths, real manifests, VCPChat, or VCPToolBox

## Reference Impact Snapshot

The C1 reference-impact audit found `4769` matching references to historical or current structure docs across the reviewed surfaces.

Reference sources:

| Source type | References |
| --- | ---: |
| `scripts/` | 1446 |
| `.agent_board/` | 1323 |
| `docs/` | 1189 |
| `tests/` | 377 |
| `README.md` | 185 |
| `PROJECT_MASTER_PLAN.md` | 79 |
| `AGENTS.md` | 0 |

Candidate classification:

| Class | Count | C1.1 decision |
| --- | ---: | --- |
| zero external references | 460 | direct archive candidate after exact list generation |
| docs-only references | 126 | move only with doc link update or wrapper |
| hard surface or validator references | 608 | keep original path until compatibility exists |
| total historical candidates | 1194 | no physical move authorized by this policy |

Script impact:

| Surface | Count |
| --- | ---: |
| script files with docs references | 269 |
| validator files with docs references | 266 |
| total script references | 1446 |
| `scripts/validate_mvp.ps1` references | 236 |

## Reference Classes

### `current_authority_keep`

These paths remain canonical and must not be moved by C1:

- `docs/PROJECT_STRUCTURE.md`
- `docs/PROJECT_RESTRUCTURE_PREFLIGHT_PLAN.md`
- `docs/archive/README.md`
- `docs/archive/DOCS_ARCHIVE_MIGRATION_MANIFEST.md`
- `docs/archive/DOCS_ARCHIVE_REFERENCE_POLICY.md`

### `legacy_anchor_keep`

These historical paths currently behave as navigation or validation anchors. They must remain in place until the reference map is updated and validation passes.

Current high-risk anchor:

- `docs/00_project_roadmap.md`

Additional paths enter this class if they are referenced by:

- `scripts/`
- `tests/`
- `README.md`
- `PROJECT_MASTER_PLAN.md`
- `.agent_board/`

### `direct_archive_candidate`

A historical doc may enter this class only when it has zero external references outside itself.

Requirements before any move:

- generate an exact path list
- inspect for secrets or private paths
- confirm it is not a current authority doc
- run the required C1 validation after the move

### `docs_link_update_required`

A historical doc with only `docs/` references may move only when all affected docs references are updated in the same batch, or when the original path keeps a wrapper.

The wrapper must say that the record is historical and point to the archive target. A wrapper is for human navigation only unless validators are explicitly updated to accept it.

### `validator_blocked`

A historical doc referenced by scripts, validators, tests, README, `PROJECT_MASTER_PLAN.md`, or `.agent_board` must not move unless one of these compatibility paths exists:

- the original path remains in place
- every hard reference is updated in the same batch
- a validator-aware resolver is implemented and validated
- a wrapper preserves every token required by existing validators

Wrapper-only movement is not enough for validator-bound docs if the validator expects exact text tokens from the original file.

## Archive-Aware Resolver Policy

Future validators should prefer an archive-aware lookup instead of hard-coding one historical path forever.

Minimal resolver behavior:

```text
input: original docs path
1. if original path exists, read it
2. if original path is a vN phase doc, try docs/archive/phases/vN/<same_filename>
3. if original path is numbered legacy, try docs/archive/numbered_legacy/<same_filename>
4. if no path exists, fail with both attempted paths
```

Adoption rule:

- new validators may use the resolver
- old validators stay unchanged until a validator migration task explicitly updates them
- `scripts/validate_mvp.ps1` remains the stable aggregate entry point
- no C1 doc movement should require editing hundreds of validators in the same batch

## C1 Move Batches

### C1a: Zero-Reference Direct Archive

Allowed only after a generated exact list proves zero external references.

Expected scope:

- move only exact listed historical docs
- no current authority docs
- no validator-bound docs
- no `.agent_board` resume anchors

### C1b: Docs-Only Reference Archive

Allowed only after a reference update list exists.

Expected scope:

- move docs-only historical records
- update affected docs links in the same batch
- leave wrappers only where human navigation benefits from them

### C1c: Validator-Bound Archive

Blocked until compatibility exists.

Expected prerequisites:

- archive-aware resolver or exact reference updates
- `scripts/validate_mvp.ps1` compatibility plan
- affected validator list
- rollback plan
- validation pass before and after the move

## Required Validation For Any Future Move

```powershell
git diff --check
node scripts\validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

Additional checks for C1 physical movement:

```powershell
rg -n "docs[/\\](v[0-9]|[0-9])" README.md PROJECT_MASTER_PLAN.md .agent_board scripts tests docs
```

The second command is an impact review command, not a pass/fail validator by itself.

## Stop Conditions

Stop C1 movement if any of these appears:

- a current authority doc would move
- `docs/00_project_roadmap.md` would move before anchor replacement
- a validator-bound doc would move without resolver, update, or token-preserving wrapper
- `scripts/validate_mvp.ps1` would fail
- `.agent_board` would point to a missing path
- a move requires deletion instead of reversible relocation
- a move touches `runs/` or image binaries
- a task asks for A5, provider, plugin, API, DailyNote, VCP memory, runtime, real manifest, VCPChat, or VCPToolBox actions
- a task asks for staging, commit, push, tag, release, or deploy without separate explicit authorization

## Recommended Next

Do not execute C1 physical movement yet.

Recommended next local step:

```text
C1.2 generate exact zero-reference archive candidate list
```

C1.2 is recorded in `docs/archive/DOCS_ARCHIVE_ZERO_REFERENCE_CANDIDATES.md`. It is a dry-run candidate list only and does not move files.

C1.3 is recorded in `docs/archive/DOCS_ARCHIVE_YAML_AWARE_ZERO_REFERENCE_CANDIDATES.md`. It is the safer C1a candidate base because it checks `.md/.yaml/.yml` target references while excluding `docs/archive/` planning records from blocker status.

C1a authorization-package dry run is recorded in `docs/archive/DOCS_ARCHIVE_C1A_MOVE_AUTHORIZATION_PACKAGE.md`. It defines the future authorization shape, but does not authorize movement.

After C1a package review, the recommended next decision is whether to authorize a narrow C1a physical move from the YAML-aware exact list. That authorization must name the exact files, destination, rollback plan, validation commands, and stop conditions.
