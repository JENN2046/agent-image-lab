# TASK_QUEUE.md — Agent Image Lab Sustained Autopilot

Persistent task queue for guarded local work.

This board does not authorize external reads, VCPToolBox/VCPChat changes, plugin calls, DailyNote writes, API calls, pushes, tags, releases, dependency changes, destructive commands, or writes outside the workspace root.

---

## Current Mission

```text
Post-closeout state. Validator Governance Chain v1 closed (106→0, 4 batches clean_closed). v7.170 patch implementation completed. Next major route not selected.
```

---

## Current Mode

```text
A4.5 — Smart Local Autopilot under A4 — Sustained Local Autopilot boundaries
```

---

## Hard Stop Gates

Stop before:

- real VCPChat read without a concrete active authorization package and passing preflight
- real VCPToolBox read without a concrete active authorization package and passing preflight
- real manifest read without a concrete active authorization package and passing preflight
- config/env/log/secret read
- raw source copy from external repos
- IPC / preload / renderer implementation in VCPChat
- executable Adapter implementation
- plugin/API/DailyNote call without a concrete active authorization package and passing preflight
- image file creation without a concrete active authorization package and passing preflight
- VCP memory write without a concrete active authorization package and passing preflight
- push / PR / merge / tag / release without a concrete active version-action package and passing preflight
- dependency change without a concrete active dependency-change package and passing preflight
- write outside workspace root without a concrete active external-write package and passing preflight
- A5 — Autonomous Production Execution without an active explicit authorization package and passing preflight

---

## Queue

### in_progress

```text
none — v7.170 patch implementation completed
```

### todo

```text
1. Recommended: authorize v7.171 Patch Static Review and Syntax Validation Gate
```

### done

```text
1. v7.168 Post-Closeout Code Surface Review (A0 read-only) — 28 files inspected, 3 P1/4 P2/2 P3 findings.
2. v7.169 Agent Board and Validator Patch Gate (docs-only) — 5 repair scopes defined, implementation not authorized.
3. v7.170 Agent Board and Validator Patch Implementation — 5/5 scopes executed, node --check passed, committed and pushed.
```

### blocked

```text
1. Next major route not selected. Batch 005 not allowed. production_candidate_002 not allowed. memory_write_path not allowed. Real execution requires fresh explicit authorization.
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
