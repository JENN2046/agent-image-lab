# BLOCKERS.md — Agent Image Lab

## Active Blockers

```text
1. Default A4 docs-only continuation is blocked unless the next task creates clear non-redundant product value.
2. Active A5 product image execution is blocked by dirty worktree until current local changes are made safe or explicitly checkpointed and fresh preflight passes.
3. Active A5 product image execution is blocked by execution surface mismatch: the approval phrase matches AUTH-PENDING-20260512-001, but no safe callable VCPToolBox / DoubaoGen execution entry is available in the current tool surface. Native/local runners require additional scope such as env/config or plugin-dir access and must not be substituted silently.
4. AUTH-PENDING-20260512-001 has been consumed by one DoubaoGen process attempt. It failed with no image, and retry_limit=0 blocks another generation call without a new explicit retry authorization.
5. Exact DoubaoGen provider root cause is unavailable from retained evidence because raw stdout/stderr was not printed or retained; only an inconclusive provider/API-layer failure category can be recorded.
6. The newly approved diagnostic retry was also consumed once and failed with sanitized_error_category=quota_or_rate_limit. Immediate further retries are blocked unless provider quota/rate-limit conditions are resolved or a new explicit generation path is approved.
```

## Current Mainline Quality Stop

```text
latest_quality_stop: v7.221
latest_synced_commit_before_board_calibration: c605bd7
continue_A4_docs_only_by_default: false
next_requires_new_value_or_explicit_authorization: true
```

## Standing External-Read Gate

```text
Real VCPChat, real VCPToolBox, and real manifest reads are blocked until the user provides explicit authorization with exact paths, allowed file list, allowed excerpts, forbidden excerpts, reviewer, and stop conditions.
```

## Standing Remote-Action Gate

```text
Guarded local commits are authorized only when all project auto-commit conditions pass. Push, tag, release, PR, merge, or remote issue changes require explicit separate authorization, standing authorization, and passing preflight.
```

## Standing Real-Execution Gate

```text
Plugin calls, API calls, DailyNote writes, VCP memory writes, image creation, runtime execution, and executable Adapter entrypoints require explicit separate authorization.
```

## Standing A5 Production-Execution Gate

```text
Without an active authorization package, production actions remain blocked. A5 authorization must name exact target systems, allowed paths or objects, allowed commands or operations, forbidden operations, write boundaries, validation requirements, rollback path, reviewer, and stop conditions.
```

## Historical Closed Gates

```text
Validator Governance Chain v1: closed
batch_005_allowed_now: false
production_candidate_002_allowed_now: false
memory_write_path_allowed_now: false

Historical A5 actions consumed their respective authorizations. They do not authorize new provider contact, plugin/API calls, DailyNote writes, VCP memory writes, image creation, runtime integration, tag, push, release, or external repository modification.
```

## Blocker Template

```text
## BLOCKER-YYYYMMDD-NN — Title

Status:
Detected during:
Task:
Reason:
Hard stop gate:
Files involved:
Validation state:
Why the agent stopped:
Required human decision:
Safe next action:
Rollback or cleanup path:
```
