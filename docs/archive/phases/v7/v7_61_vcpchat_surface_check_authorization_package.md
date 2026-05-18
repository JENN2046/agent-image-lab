# v7.61 — VCPChat Surface Check Authorization Package

> **This document is a draft authorization package. It does not authorize execution.**
>
> **LT-06 A5 (v7.59) does not cover VCPChat surface checks. A separate independent authorization is required.**
>
> **本文是授权包草案，不授权执行。LT-06 A5 不覆盖 VCPChat surface check，需要独立的另行授权。**

---

## 1. Carry-forward Context

```yaml
carry_forward_context:
  prior_lt06_executed: true
  prior_lt06_phase: v7.59
  prior_lt06_commit: da3a045
  prior_lt06_a5_consumed: true
  prior_lt06_a5_remaining: 0
  lt06_executed_in_this_phase: false
  lt06_a5_does_not_cover_vcpchat: true
  vcpchat_surface_planning_completed: v7.60
  vcpchat_surface_planning_commit: d3bbdd1
```

## 2. Package Header

```yaml
v7_61_vcpchat_surface_check_authorization_package:
  schema_version: v1
  package_type: authorization_package_draft
  status: prepared_not_granted
  phase: v7_61

  authorization:
    A5_requested_by_this_document: false
    A5_granted: false
    execution_authorized: false
    lt06_a5_does_not_cover_this_package: true
```

## 3. Exact Scope

```yaml
exact_scope:
  surfaces_to_check:
    - VCPChat Review Console imageLabReview bridge surface

  allowed_bridge_methods_only:
    - imageLabReview.loadSession
    - imageLabReview.previewDraft

  permanently_forbidden_bridge_methods:
    - imageLabReview.submitDraft
    - any_write_method
    - any_memory_write_method
    - any_image_generation_method
    - any_retry_method
    - any_fallback_method
```

## 4. Exact Payload Schema

```yaml
exact_payload_schema:
  loadSession:
    method: imageLabReview.loadSession
    params:
      sessionId: string (opaque, no private path)

  previewDraft:
    method: imageLabReview.previewDraft
    params:
      draftId: string (opaque, no private path)

  max_calls_per_method: 1
  total_max_calls: 2
  retry_allowed: false
  fallback_allowed: false
```

## 5. Forbidden Paths

```yaml
forbidden_paths:
  - submitDraft
  - record_memory
  - search_memory
  - tools/call (for any MCP tool)
  - /mcp/codex-memory
  - /v1/human/tool
  - /v1/chat/completions
  - /v1/chatvcp/completions
  - /plugin-callback/:pluginName/:taskId
  - DailyNote write
  - VCP memory write
  - image generation
  - image binary read
```

## 6. Abort Conditions

```yaml
abort_conditions:
  - method_not_loadSession_or_previewDraft
  - params_contain_private_path
  - response_contains_unredacted_path
  - response_contains_unredacted_memory_id
  - response_requests_followup_write
  - submitDraft_proposed_by_response
  - connection_timeout
  - malformed_response
  - any_file_write_detected
  - any_DailyNote_write_detected
  - any_VCP_memory_write_detected
```

## 7. Reporting Policy

```yaml
reporting_policy:
  raw_bridge_response_allowed: false
  raw_structuredContent_allowed: false
  redacted_summary_only: true
  private_path_exposure_forbidden: true

  allowed_report_fields:
    - response_status
    - call_count
    - methods_called
    - endpoint_used_redacted
    - side_effect_summary
    - top_level_keys_present
    - redacted_error_type_if_any
```

## 8. Future Authorization Requirement

```yaml
future_authorization:
  requires_new_independent_a5_or_equivalent: true
  lt06_a5_does_not_cover_vcpchat: true
  preconditions_before_execution:
    - user_explicitly_grants_authorization
    - electron_start_authorized
    - remote_debug_start_authorized
    - bridge_read_only_call_authorized
    - exact_surfaces_confirmed
    - exact_methods_confirmed
    - exact_payloads_confirmed
    - max_calls_confirmed
    - no_retry_confirmed
    - no_fallback_confirmed
    - redacted_summary_only_confirmed
```

## 9. Copyable Authorization Request Block (Draft Only)

```text
AUTHORIZATION REQUEST DRAFT — NOT SUBMITTED

I request independent authorization for a one-time read-only VCPChat surface check using only:

Bridge methods:
- imageLabReview.loadSession (max 1 call)
- imageLabReview.previewDraft (max 1 call)

Total: max 2 calls, no retry, no fallback.

Endpoint: VCPChat bridge (exact endpoint TBD per environment)

Forbidden:
- submitDraft
- any memory write
- any image generation
- any native VCP route
- any MCP route
- any DailyNote write
- raw response recording

This request, if later submitted, authorizes only the two read-only bridge calls above and nothing else.
LT-06 A5 (v7.59) does not cover this request.
```
