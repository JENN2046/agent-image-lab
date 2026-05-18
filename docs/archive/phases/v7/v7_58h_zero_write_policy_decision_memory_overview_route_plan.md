# v7.58h — Zero-write Policy Decision + memory_overview-only Route Planning

## 1. Purpose

Make a docs-only policy decision to adopt absolute zero-write for LT-06, narrowing the candidate route to `MCP tools/call memory_overview` only.

## 2. Policy Decision

```yaml
v7_58h_zero_write_policy_decision:
  schema_version: v1
  phase: v7_58h
  status: completed
  policy_type: absolute_zero_write

  decision:
    absolute_zero_write_required: true
    audit_log_write_allowed: false
    observe_only_exception_granted: false

  allowed_route:
    transport: MCP JSON-RPC
    endpoint: POST /mcp/codex-memory
    method: tools/call
    tool_name: memory_overview
    arguments_policy:
      allowed_arguments:
        - auditWindow
        - limit
      default_safe_arguments:
        auditWindow: null
        limit: null
      write_side_effects: false

  blocked_routes:
    search_memory:
      reason: recall_audit_write_to_jsonl
      can_be_reconsidered_if:
        - no_audit_mode_exists
        - explicit_observe_only_exception_granted
    record_memory:
      reason: explicit_CodexMemoryBridge_write_route
      permanently_excluded: true
    native_vcp_routes:
      - POST /v1/human/tool
      - POST /v1/chat/completions
      - POST /v1/chatvcp/completions
      - POST /plugin-callback/:pluginName/:taskId

  execution_decision:
    request_A5_now: false
    execute_LT06_now: false
    real_LT06_execution_ready: false
```

## 3. Why memory_overview only

`memory_overview` is the only currently classified strict zero-write candidate. It does not call PluginManager, does not execute plugins, does not write DailyNote, does not write VCP memory, and does not append recall audit logs. It only reads existing logs and metadata.

## 4. Why search_memory is blocked for now

`search_memory` may be useful later, but it appends recall audit data to `logs/codex-memory-recall.jsonl`. Under absolute zero-write policy, any file append is a write side effect. Therefore `search_memory` is blocked unless a no-audit mode is proven or an explicit observe-only exception is independently authorized.

## 5. Why this is not A5

This policy decision only narrows the candidate route. It does not authorize a real call, does not request A5, and does not execute LT-06.

## 6. Next Step

The next phase (v7.58i) will prepare a docs-only A5 planning package for a `memory_overview`-only LT-06 dry-run, still without execution authorization.
