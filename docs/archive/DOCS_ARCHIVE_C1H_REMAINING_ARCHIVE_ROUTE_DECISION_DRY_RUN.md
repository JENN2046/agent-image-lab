# Docs Archive C1h Remaining Archive Route Decision Dry Run

Status: C1h remaining archive route decision dry-run completed validated
Mode: A4.8 local documentation and route decision only
Source baseline: `a51c5c5 docs: archive C1f docs migration records`
Primary source classification: `docs/archive/DOCS_ARCHIVE_C1E_REMAINING_DOCS_RECLASSIFICATION_REFRESH.md`
Last move closeout: `docs/archive/DOCS_ARCHIVE_C1F_POST_MOVE_REFERENCE_MAP_DRY_RUN.md`

This dry run decides the next safe Route C archive path after C1f was committed and pushed. It does not move files, rewrite references, create wrappers, stage, commit, push, tag, release, deploy, or authorize any A5 action.

## Boundary

This dry run did not:

- move docs
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

## Repository Reality

| Check | Result |
| --- | --- |
| branch | `master` |
| upstream | `origin/master` |
| ahead / behind before C1h edit | `0 / 0` |
| source commit | `a51c5c5` |
| source worktree | clean |
| C1f committed and pushed | true |

## Current Remaining Archive Inventory

C1h rechecked the C1e classification table against the current filesystem after C1f.

| Metric | Count |
| --- | ---: |
| C1e rows checked | 710 |
| current remaining top-level historical docs | 690 |
| C1e rows now missing because C1f moved them | 20 |
| remaining future exact-move candidates | 0 |

## Remaining By Classification

| Classification | Count | Route decision |
| --- | ---: | --- |
| validator-blocked | 423 | do not move; first build validator/test dependency map and compatibility plan |
| wrapper-required | 200 | do not move; first design wrapper/reference rewrite strategy |
| docs-only-reference | 67 | eligible only for a docs-link update or wrapper plan dry-run, not bare movement |
| future exact-move candidates | 0 | no more exact-file physical move packages should be prepared from C1e |

## Remaining By Version Or Bucket

| Version or bucket | Count |
| --- | ---: |
| numbered_legacy | 226 |
| v6 | 1 |
| v7 | 141 |
| v8 | 31 |
| v9 | 25 |
| v10 | 19 |
| v11 | 18 |
| v12 | 9 |
| v13 | 17 |
| v14 | 203 |

## Route Decision

C1h closes the `exact-move safe candidate` lane for the C1e batch.

The next archive work must not be another physical move package unless a new scan produces new zero-active-reference candidates. Based on current C1e/C1f evidence, Route C should split into three local planning lanes:

1. `C1i docs-only-reference link graph dry-run`
   - Target: 67 docs-only-reference records.
   - Goal: map non-archive docs links that would need updating or wrapper coverage.
   - Allowed now: local dry-run report only.
   - Not allowed: moving files, rewriting references, creating wrappers, staging, committing, pushing.

2. `C1j wrapper-required navigation strategy dry-run`
   - Target: 200 wrapper-required records.
   - Goal: separate README / PROJECT_MASTER_PLAN / `.agent_board` / human-navigation references from lower-risk docs references, then decide whether wrappers or exact reference rewrites are safer.
   - Allowed now: local dry-run report only.
   - Not allowed: wrappers, reference rewrites, moves, staging, committing, pushing.

3. `C1k validator-blocked dependency map dry-run`
   - Target: 423 validator-blocked records.
   - Goal: identify scripts/tests that pin exact historical doc paths and determine whether validators can be made archive-aware without loosening checks.
   - Allowed now: local dry-run report only.
   - Not allowed: validator behavior changes, compatibility wrappers, moves, staging, committing, pushing.

## Recommended Next Step

Run `C1i docs-only-reference link graph dry-run` first.

Reason: it has the lowest operational risk because the 67 records are not referenced by scripts, tests, README, PROJECT_MASTER_PLAN, AGENTS, or `.agent_board`. It still must not move files yet, because non-archive docs references need a concrete update or wrapper strategy.

## Stop Conditions

Stop before:

- any physical move
- any reference rewrite
- any wrapper creation
- any validator behavior change
- any staging or commit
- any push, tag, release, or deploy
- any A5 action
- any provider/API/plugin/MCP/image generation/DailyNote/VCP memory/runtime/real manifest/VCPChat/VCPToolBox action
- any `.env`, `.env.local`, secret, token, cookie, or private path read

## Decision Summary

Route C remains viable, but the safe lane has changed:

```text
completed: C1f exact-file physical move for the last 20 zero-active-reference candidates
current: C1h route decision confirms no remaining exact-move candidates
next: C1i docs-only-reference link graph dry-run
blocked: additional physical moves until a reference/wrapper/validator compatibility plan exists
```
