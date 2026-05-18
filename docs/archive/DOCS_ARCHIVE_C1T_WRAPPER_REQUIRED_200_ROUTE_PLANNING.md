# Docs Archive C1t Wrapper-Required 200 Route Planning

Status: C1t wrapper-required 200 route planning completed validated.

Mode: A4.8 local docs-only route planning.

Source classification: `docs/archive/DOCS_ARCHIVE_C1E_REMAINING_DOCS_RECLASSIFICATION_REFRESH.md`

Prior checkpoint: `1f333df docs: complete C1 archive reference migration`

## Purpose

C1t decides the route for the remaining `wrapper-required` lane after C1n-C1s closed the docs-only-reference lane.

This is a planning record only. It does not create wrappers, rewrite references, move files, change validator behavior, or authorize push.

## Current Evidence

| Metric | Count |
| --- | ---: |
| Wrapper-required records from C1e | 200 |
| Records with `.agent_board` references | 186 |
| Records with `README.md` references | 39 |
| Records with `PROJECT_MASTER_PLAN.md` references | 25 |
| Records with non-archive `docs/` references | 89 |
| Records with scripts references | 0 |
| Records referenced only by `.agent_board` among active surfaces | 106 |
| Human-navigation candidate records | 39 |
| Maximum active refs on one wrapper-required record | 10 |

## Route Decision

Do not create 200 wrappers by default.

The dominant blocker is not runtime compatibility. It is stale or current-status navigation, especially `.agent_board` resume surfaces. Creating wrappers for every record would preserve old navigation debt instead of separating real human navigation from stale status references.

Proceed in this order:

1. C1u wrapper-required link graph dry-run.
2. C1v `.agent_board` stale wrapper-reference cleanup package dry-run.
3. C1w human-navigation reference package dry-run for README / PROJECT_MASTER_PLAN / still-current docs references.
4. C1x residual wrapper allowlist package dry-run only for records that still need stable old-path entrypoints after cleanup.

## Commander Review

The highest-value next local task is C1u. It should produce an exact link graph for all 200 wrapper-required records and separate:

- `.agent_board` stale resume references.
- README / PROJECT_MASTER_PLAN navigation references.
- non-archive docs references that can be exact-rewritten.
- residual records that may require old-path wrapper entrypoints.

This route preserves the ability to create wrappers later, but it prevents premature wrapper creation from becoming the default solution.

## Non-Authorization

C1t does not authorize:

- wrapper creation
- reference rewrite
- file movement
- validator behavior changes
- broad prefix allowlists
- staging or commit beyond local guarded docs-only rules
- push, tag, release, or deploy
- provider/API/plugin/MCP calls
- image generation
- DailyNote or VCP memory writes
- runtime, real manifest, VCPChat, or VCPToolBox reads

## Stop Conditions

Stop before any task that requires wrapper creation, file movement, production/runtime behavior, external reads, image generation, memory writes, or remote actions.

Push remains separately blocked until Jenn gives an exact `git push origin master` authorization.

## Recommended Next

C1u wrapper-required link graph dry-run.
