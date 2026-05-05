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
Commit, tag, push, release, PR, merge, or remote issue changes require explicit separate authorization.
```

## Standing Real-Execution Gate

```text
Plugin calls, API calls, DailyNote writes, VCP memory writes, image creation, and executable Adapter entrypoints require explicit separate authorization.
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
