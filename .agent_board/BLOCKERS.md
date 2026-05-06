# BLOCKERS.md — Agent Image Lab

## Active Blockers

```text
none
```

## Standing External-Read Gate

```text
Real VCPChat / VCPToolBox reads are blocked until the user provides explicit authorization with exact paths, allowed file list, allowed excerpts, forbidden excerpts, reviewer, and stop conditions.
```

## Standing Remote-Action Gate

```text
Guarded local commits are authorized by standing user instruction when all project auto-commit conditions pass. Tag, push, release, PR, merge, or remote issue changes still require explicit separate authorization.
```

## Standing Real-Execution Gate

```text
Plugin calls, API calls, DailyNote writes, VCP memory writes, image creation, and executable Adapter entrypoints require explicit separate authorization.
```

## Standing A5 Production-Execution Gate

```text
Without an active A5 authorization package, production actions remain blocked. A5 authorization must name exact target systems, allowed paths or objects, allowed commands or operations, forbidden operations, write boundaries, validation requirements, rollback path, reviewer, and stop conditions.
```

## Standing Remote-Debug Script Creation Gate

```text
The real scripts/run_vcpchat_review_console_remote_debug_smoke.ps1 file remains uncreated. Creating or running that executable remote-debug script requires an active script creation authorization package or active A5 authorization package.
v7.42 records an inactive authorization package template only; it does not activate script creation approval.
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
