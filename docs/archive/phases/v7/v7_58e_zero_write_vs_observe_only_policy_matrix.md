# v7.58e — Zero-write vs Observe-only Policy Matrix

## 1. Purpose

Define the policy distinction between zero-write and observe-only routes, and classify each candidate tool.

## 2. Policy Matrix

```yaml
zero_write_vs_observe_only_policy_matrix:
  schema_version: v1
  phase: v7_58e

  definitions:
    zero_write:
      description: No file system mutation, no audit log write, no side effect of any kind
      requirements:
        - no fs.writeFile/appendFile
        - no plugin execution
        - no DailyNote/VCP memory write
        - no audit log write
        - no file creation

    observe_only:
      description: May write audit or observability data to local logs, but must not write to DailyNote, VCP memory, or trigger plugin execution
      requirements:
        - no plugin execution
        - no DailyNote/VCP memory write
        - audit log write allowed (file append only)
        - must be explicitly authorized by policy

    write:
      description: Any route that can trigger plugin execution, DailyNote write, or VCP memory write
      requirements:
        - excluded from LT-06

  classifications:
    memory_overview:
      type: zero_write
      evidence: Confirmed — only fs.readFile, fs.stat, fs.readdir, fs.access
      LT06_allowed: true
      needs_policy_exception: false

    search_memory:
      type: observe_only
      evidence: >
        Has recall audit write (appends to logs/codex-memory-recall.jsonl).
        Does not call processToolCall or executePlugin.
      LT06_allowed: true_if_observe_only_policy_accepted
      needs_policy_exception: true
      mitigation: no_audit_mode_would_upgrade_to_zero_write

    record_memory:
      type: write
      evidence: Calls executeToolCallWithContext → processToolCall(CodexMemoryBridge) → writeDiary
      LT06_allowed: false
      needs_policy_exception: not_applicable

  current_decision:
    if_absolute_zero_write:
      allowed_route: memory_overview only
      search_memory: blocked_or_requires_no_audit_mode
      record_memory: excluded

    if_observe_only_allowed:
      allowed_route:
        - search_memory
        - memory_overview
      condition: recall_audit_write_exception_explicitly_authorized
      record_memory: excluded
```
