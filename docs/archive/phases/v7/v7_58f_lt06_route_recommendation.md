# v7.58f — LT-06 Route Recommendation

## 1. Purpose

Recommend the LT-06 no-write route based on v7.58 side-effect analysis.

## 2. Recommendation

```yaml
lt06_route_recommendation:
  schema_version: v1
  phase: v7_58f

  primary_recommendation:
    route: MCP tools/call memory_overview
    type: zero_write
    endpoint: POST /mcp/codex-memory (JSON-RPC body: {"method":"tools/call","params":{"name":"memory_overview","arguments":{}}})
    confidence: verified
    reason: >
      memory_overview is the only tool that performs zero file writes, zero
      plugin execution, and zero audit log writes. It reads JSONL audit files
      and diary file metadata without mutating anything.

  secondary_recommendation:
    route: MCP tools/call search_memory
    type: observe_only (unless no-audit mode is available)
    note: >
      search_memory has a recall audit write (appends to JSONL log). If the
      project policy accepts file-appends for observability during LT-06,
      search_memory becomes usable. If absolute zero write is required,
      search_memory remains blocked.

  excluded:
    - record_memory (explicit write route, must not be called)

  next_steps_before_LT06:
    - name: confirm_memory_overview_arguments
      detail: >
        memory_overview takes optional auditWindow (10-2000) and limit (1-50).
        Default values (500, 10) are safe — no write regardless of input.
    - name: verify_ragDiaryPlugin_dependency_for_search_memory
      detail: >
        search_memory requires ragDiaryPlugin. If the RAG plugin has write
        side effects during embedding, search_memory may inherit them.
        This needs verification before using search_memory.
    - name: decide_zero_write_vs_observe_only_policy
      detail: >
        Project must decide whether audit log file appends are acceptable
        during LT-06 read-only dry-run.

  final:
    request_A5_now: false
    execute_LT06_now: false
    real_LT06_execution_ready: false
```
