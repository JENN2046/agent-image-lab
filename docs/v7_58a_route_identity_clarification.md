# v7.58a — Route Identity Clarification

## 1. Purpose

Clarify the identity and boundaries of the Codex Memory MCP sidecar route.

## 2. Route Identity

```yaml
route_identity:
  name: Codex Memory MCP sidecar
  route_file: routes/codexMemoryMcp.js
  transport: JSON-RPC 2.0 over HTTP (Express)
  endpoint: /mcp/codex-memory
  server_name: vcp_codex_memory

  tools:
    - name: record_memory
      type: explicit_write_route
      handler: executeToolCallWithContext → processToolCall("CodexMemoryBridge")
      decision: excluded

    - name: search_memory
      type: read_candidate_with_audit_write
      handler: searchCodexMemory() — direct module call, not processToolCall
      audit_write: >
        Calls ragDiaryPlugin._buildCodexRecallAuditPayload() then
        ragDiaryPlugin._recordCodexRecallAudit() which appends to
        logs/codex-memory-recall.jsonl. This is a file write side effect.
      decision: blocked_until_no_audit_mode_or_policy_exception

    - name: memory_overview
      type: zero_write_candidate
      handler: buildCodexMemoryOverview() — direct module call, not processToolCall
      operations: fs.readFile, fs.stat, fs.readdir, fs.access only
      audit_write: none
      decision: primary_candidate_for_strict_zero_write

  routes_not_in_scope:
    - POST /v1/human/tool
    - POST /v1/chat/completions
    - POST /v1/chatvcp/completions
    - POST /plugin-callback/:pluginName/:taskId
```
