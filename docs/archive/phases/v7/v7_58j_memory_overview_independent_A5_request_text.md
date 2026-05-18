# v7.58j — Independent A5 Request Text Draft: memory_overview-only LT-06 Read-only Dry-run

> **This document is a draft A5 request text. It does not itself request A5, grant A5, or authorize execution. The user must issue a separate explicit A5 authorization before any real call.**
>
> **本文只是 A5 request 文案草案，不是 A5 请求本身，不是 A5 授权，也不授权执行。任何真实调用前，必须由用户另行明确授予独立 A5。**

---

## 1. Request Header

```yaml
independent_A5_request_text:
  schema_version: v1
  phase: v7_58j
  request_status: draft_not_submitted
  authorization_requested_by_this_document: false
  authorization_granted: false
  LT06_execution_allowed_by_this_document: false

  requested_future_action:
    name: LT-06 memory_overview-only real read-only dry-run
    max_real_calls: 1
    retry_allowed: false
    fallback_allowed: false
```

---

## 2. Exact Route

```yaml
target_identity:
  selected_target: VCPToolBox_embedded_6005
  exact_base_url: http://127.0.0.1:6005
  exact_endpoint_url: http://127.0.0.1:6005/mcp/codex-memory
  standalone_codex_memory_7605_selected: false

exact_route:
  transport: MCP_JSON_RPC
  http_method: POST
  endpoint: /mcp/codex-memory
  jsonrpc_method: tools/call
  tool_name: memory_overview

  allowed_tool_only:
    - memory_overview

  forbidden_tools:
    - search_memory
    - record_memory

  forbidden_native_routes:
    - POST /v1/human/tool
    - POST /v1/chat/completions
    - POST /v1/chatvcp/completions
    - POST /plugin-callback/:pluginName/:taskId
```

---

## 3. Exact Payload

Only the exact payload below is authorized. No broad request shape. No `auditWindow`. No `limit`. No non-empty `arguments`.

```json
{
  "jsonrpc": "2.0",
  "id": "lt06-memory-overview-001",
  "method": "tools/call",
  "params": {
    "name": "memory_overview",
    "arguments": {}
  }
}
```

```yaml
payload_policy:
  exact_payload_only: true
  broad_request_shape_superseded: true
  arguments_required_shape: {}
  auditWindow_allowed: false
  limit_allowed: false
  non_empty_arguments_allowed: false
```

---

## 4. Forbidden JSON-RPC Methods

No MCP discovery, no handshake, no second call.

```yaml
forbidden_jsonrpc_methods:
  - initialize
  - notifications/initialized
  - ping
  - tools/list
  - resources/list
  - resources/templates/list
```

- No `initialize` handshake.
- No `tools/list`.
- No `resources/list`.
- No `ping`.
- No second call of any kind.

---

## 5. One-call / No-retry / No-fallback

```yaml
one_call_policy:
  max_real_calls: 1
  retry_allowed: false
  fallback_allowed: false
  second_call_requires_new_independent_A5: true

  timeout_behavior:
    retry_on_timeout: false
    action: abort_and_closeout

  malformed_response_behavior:
    retry_on_malformed_response: false
    action: abort_and_closeout

  fallback_routes_forbidden:
    - search_memory
    - record_memory
    - native_vcp_routes
    - VCPChat_bridge
```

---

## 6. Response Redaction Policy

Raw structuredContent and raw response must never appear in the report. Only a redacted summary with numeric counts.

```yaml
response_redaction_policy:
  raw_structuredContent_allowed_in_report: false
  raw_response_allowed_in_report: false
  redacted_summary_only: true

  forbidden_report_fields:
    - paths
    - auditLogPath
    - recallLogPath
    - processDiaryPath
    - knowledgeDiaryPath
    - filePath
    - fullPath
    - sourceFile
    - topSourceFile
    - sourceFiles
    - memoryIds
    - raw recentAudit
    - raw recentFiles
    - raw memoryLinks
    - raw adaptive
    - raw recall.recent

  allowed_report_fields:
    - response_status
    - call_count
    - endpoint_used_redacted
    - tool_name_used
    - side_effect_summary
    - top_level_keys_present
    - numeric_counts_only
    - redacted_error_type_if_any
```

### Counts-only definition (addresses Pro P2_003)

```yaml
counts_only_definition:
  numeric_counts_only: true
  forbidden_under_counts_only:
    - sample_values
    - file_basenames
    - path_suffixes
    - memory_id_prefixes
    - raw_recent_item_excerpts
    - source_file_basenames
    - audit_log_line_excerpts
```

---

## 7. Side-effect Constraints

```yaml
side_effect_constraints:
  file_write_allowed: false
  audit_log_write_allowed: false
  DailyNote_write_allowed: false
  VCP_memory_write_allowed: false
  plugin_execution_allowed: false
  image_generation_allowed: false
  image_binary_read_allowed: false
  VCPChat_bridge_allowed: false
```

---

## 8. Abort Conditions

```yaml
abort_conditions:
  - tool_name_not_memory_overview
  - arguments_not_empty_object
  - method_not_tools_call
  - unexpected_jsonrpc_method
  - response_requests_followup_call
  - response_indicates_write_side_effect
  - connection_timeout
  - malformed_response
  - raw_structuredContent_requested_for_report
  - response_contains_unredacted_private_path
  - response_contains_unredacted_memory_id
  - any_file_write_detected
  - any_DailyNote_write_detected
  - any_VCP_memory_write_detected
```

---

## 9. Required Future Closeout Fields

```yaml
required_future_execution_closeout_fields:
  call_count:
  endpoint_used_redacted:
  jsonrpc_method_used:
  tool_name_used:
  exact_payload_id:
  retry_performed: false
  fallback_performed: false
  raw_response_recorded: false
  raw_structuredContent_recorded: false
  redacted_summary_only: true
  side_effect_summary:
  abort_condition_triggered:
  final_status:
```

---

## 10. Copyable A5 Request Block (Draft Only)

```yaml
copyable_request_block:
  status: draft_only_not_submitted
  user_must_submit_separately: true
```

```text
A5 REQUEST DRAFT — NOT SUBMITTED BY THIS DOCUMENT

I request independent A5 authorization for exactly one real read-only LT-06 dry-run call using only:

POST http://127.0.0.1:6005/mcp/codex-memory
JSON-RPC method: tools/call
tool: memory_overview
arguments: {}

This request targets the VCPToolBox embedded MCP route on port 6005.
It does not target the standalone codex-memory sidecar on port 7605.

本请求目标是 VCPToolBox 后端 6005 内嵌 MCP 路由，不是 7605 独立 codex-memory sidecar。

Exact payload:
{
  "jsonrpc": "2.0",
  "id": "lt06-memory-overview-001",
  "method": "tools/call",
  "params": {
    "name": "memory_overview",
    "arguments": {}
  }
}

Constraints:
- one real call only
- no retry
- no fallback
- no initialize / tools_list / resources_list / ping
- no search_memory
- no record_memory
- no native VCP routes
- no VCPChat bridge
- no DailyNote write
- no VCP memory write
- no image generation
- no raw response reporting
- redacted summary only

This A5 request, if later submitted by the user, authorizes only the single memory_overview call above and nothing else.
```
