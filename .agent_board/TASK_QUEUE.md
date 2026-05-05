# TASK_QUEUE.md — Agent Image Lab Sustained Autopilot

Persistent task queue for guarded local work.

This board does not authorize external reads, VCPToolBox/VCPChat changes, plugin calls, DailyNote writes, API calls, pushes, tags, releases, dependency changes, destructive commands, or writes outside the workspace root.

---

## Current Mission

```text
Maintain and advance Agent Image Lab as a VCP-native visual production orchestration project while preserving no-execution / no-external-read gates until explicit user authorization is given.
```

---

## Current Mode

```text
A4-Guarded Sustained Local Autopilot
```

---

## Hard Stop Gates

Stop before:

- real VCPChat read
- real VCPToolBox read
- real manifest read
- config/env/log/secret read
- raw source copy from external repos
- IPC / preload / renderer implementation in VCPChat
- executable Adapter implementation
- plugin/API/DailyNote call
- image file creation
- VCP memory write
- push / PR / merge / tag / release
- dependency change
- write outside workspace root

---

## Queue

### in_progress

```text
none
```

### todo

```text
1. If user authorizes v5.10 version movement, run commit/push/PR/release preflight with exact scope.
2. If user asks for release movement, request explicit commit/tag/push scope and run preflight.
3. Keep Adapter and Review Console work in no-execution / no-external-read mode.
4. Update CHECKPOINT.md, RUN_STATE.md, VALIDATION_LOG.md, and HANDOFF.md after each meaningful batch.
```

### done

```text
1. Installed Agent Image Lab autopilot overlay files without overwriting existing project files.
2. Adjusted overlay local validation helpers to skip only known historical true-call execution records.
3. Added v4.0-v4.2 local runtime validation hardening.
4. Synchronized agent board files to current repository reality.
5. Added agent board state validation harness and integrated it into the local validation set.
6. Added local checkpoint readiness manifest validation for the v4.0-v4.5 local batch.
7. Added local commit scope manifest validation for the v4.0-v4.6 changed-file allowlist.
8. Recorded v4.6 pushed baseline and reconciled post-push state for the v4.7 local batch.
9. Added v4 index consistency validation for v4.0-v4.8 docs, schemas, scripts, and board indexes.
10. Recorded local v4.8 commit/tag readiness and push-pending state for v4.9.
11. Merged PR #1 and synced local master to origin/master before opening v5.0.
12. Completed v5.0 post-merge delivery readiness validation.
13. Completed v5.1 runtime delivery surface validation.
14. Completed v5.2 adapter delivery surface validation.
15. Completed v5.3 Review Console Adapter handoff validation.
16. Completed v5.4 local sync readiness preflight.
17. Completed v5.5 post-commit reconciliation checkpoint.
18. Completed v5.6 v5 index consistency validation.
19. Completed v5.7 local batch commit-readiness preflight.
20. Completed v5.8 handoff freshness validation.
21. Completed v5.9 expanded v5 index consistency validation.
22. Completed v5.10 local true-loop candidate delivery closeout.
```

### blocked

```text
none
```

### skipped

```text
none
```

---

## Task Template

```text
- [ ] ID:
      Title:
      Reason:
      Scope:
      Allowed files:
      Forbidden files/actions:
      Validation:
      Stop condition:
```

## Done Template

```text
- [x] ID:
      Title:
      Changed files:
      Validation:
      Result:
```
