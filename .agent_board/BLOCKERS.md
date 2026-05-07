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
Historical v7.42/v7.43 status: execution remains blocked for the inactive authorization package template and dry-run-only script creation phases.
Current v10.8 status: active single-batch A5 authorization package was provided, VCPChat no-write bridge smoke passed, human review authorized production continuation, one DoubaoGen generation was performed in v10.4, and one stronger no-text retry was performed in v10.5. Both generated assets were rejected. v10.8 records a positive still-life generation preflight gate, but does not authorize execution. Do not call plugin/API/DailyNote again, write VCP memory, create additional images, commit, tag, push, PR, or release until the user approves the locked prompt and explicitly authorizes real generation parameters or version action.
```

## Standing Remote-Debug Relaunch Gate

```text
The real scripts/run_vcpchat_review_console_remote_debug_smoke.ps1 file exists as a dry-run-only local script. v7.44 ran it in default dry-run blocked mode and launched VCPChat after explicit user authorization. v7.45 attempted authorized CDP read-only access, but no available endpoint was exposed. Historical v7.45 status: CDP access remains blocked for that attempt. v7.46 received explicit remote-debug relaunch authorization, stopped the old VCPChat/Electron processes, relaunched VCPChat with remote-debug enabled, read CDP targets, and ran one read-only Runtime.evaluate surface check. Any bridge method invocation, VCPChat/VCPToolBox source read or modification, plugin/API/DailyNote/VCP memory/image action, push/tag/release, or deeper remote-debug verification still requires a new explicit authorization scope or active A5 authorization package.
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
