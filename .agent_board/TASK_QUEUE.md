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
1. If user asks for release movement, request explicit commit/tag/push scope and run preflight.
2. If user asks to keep local progress moving, continue Review Console runtime prototype validation hardening.
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
