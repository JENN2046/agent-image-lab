# v7.58i — memory_overview Route Contract

## 1. Purpose

Define the exact route contract for the `memory_overview`-only LT-06 planning surface.

## 2. Contract

```yaml
memory_overview_route_contract:
  schema_version: v1
  phase: v7_58i

  endpoint:
    transport: MCP_JSON_RPC
    http_method: POST
    path: /mcp/codex-memory
    jsonrpc_method: tools/call

  locked_tool:
    name: memory_overview
    allowed: true
    zero_write_classification: true

  blocked_tools:
    search_memory:
      allowed: false
      reason: recall_audit_write_to_jsonl
    record_memory:
      allowed: false
      reason: explicit_CodexMemoryBridge_write_route

  blocked_native_routes:
    - POST /v1/human/tool
    - POST /v1/chat/completions
    - POST /v1/chatvcp/completions
    - POST /plugin-callback/:pluginName/:taskId

  no_fallback:
    fallback_to_search_memory: false
    fallback_to_record_memory: false
    fallback_to_native_vcp_routes: false
```
