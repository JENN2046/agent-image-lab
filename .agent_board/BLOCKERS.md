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

## Standing Remote-Debug Script Execution Gate

```text
The real scripts/run_vcpchat_review_console_remote_debug_smoke.ps1 file exists as a dry-run-only local script. Running it for real remote-debug verification, launching VCPChat, accessing CDP, or enabling execution behavior requires explicit remote-debug script execution authorization or active A5 authorization package.
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
