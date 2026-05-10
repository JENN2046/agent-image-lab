# v7.58i — memory_overview Execution Runbook

## 1. Purpose

Future execution runbook for a `memory_overview`-only LT-06 dry-run. **Not for current execution.**

## 2. Runbook

```yaml
memory_overview_execution_runbook:
  schema_version: v1
  phase: v7_58i
  runbook_status: prepared_not_executed

  execution_allowed_now: false
  requires_independent_A5: true

  exact_call_policy:
    exact_payload_id: lt06-memory-overview-001
    exact_jsonrpc_method: tools/call
    exact_tool_name: memory_overview
    exact_arguments: {}
    initialize_call_allowed: false
    tools_list_call_allowed: false
    resources_list_call_allowed: false
    ping_call_allowed: false

  response_redaction_policy:
    raw_structuredContent_allowed_in_report: false
    raw_response_allowed_in_report: false
    report_only_redacted_summary: true

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
      - counts_only
      - redacted_error_type_if_any

  redaction_rules:
    private_absolute_path: replace_with_REDACTED_PATH
    file_name: summarize_or_count_only
    memory_id: replace_with_REDACTED_MEMORY_ID
    source_file: replace_with_REDACTED_SOURCE
    audit_path: replace_with_REDACTED_AUDIT_PATH

  future_execution_constraints:
    max_real_calls: 1
    retry_allowed: false
    fallback_allowed: false
    allowed_tool: memory_overview
    blocked_tools:
      - search_memory
      - record_memory

  abort_conditions:
    - tool_name_not_memory_overview
    - payload_contains_write_intent
    - response_requests_followup_call
    - response_indicates_write_side_effect
    - connection_timeout
    - malformed_response
    - unexpected_file_write_detected
    - raw_structuredContent_requested_for_report
    - response_contains_unredacted_private_path
    - response_contains_unredacted_memory_id

  closeout_required_after_future_execution:
    - call_count
    - endpoint_used
    - tool_name_used
    - side_effect_summary
    - redacted_response_summary
    - no_retry_confirmation
```

## 3. Rules

- Timeout must not trigger a retry.
- Malformed response must not trigger a retry.
- Fallback must not be triggered.
- A second real call requires independent authorization.
- No raw response in reports — only redacted summary.
