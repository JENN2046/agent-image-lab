# v7.67 — Cancel Preflight Endpoint Lock and Execution Authorization Gate

> **This document defines the exact endpoint, payload, and authorization conditions for a future exactly-one cancel preflight call. It does not authorize execution.**
>
> **本文定义未来恰好一次 cancel preflight 调用的确切 endpoint、payload 和授权条件。本文不授权执行。**

---

## 1. Carry-forward Context

```yaml
carry_forward_context:
  prior_v7_66_commit: d24c716
  prior_v7_66_document: v7_66_vcpchat_cancel_only_preflight_authorization_package
  cancel_classification: read_only
  cancel_role: optional_preflight_probe
  cancel_purpose:
    - bridge heartbeat verification
    - sender validation check
    - IPC path health check
  max_calls: 1
  retry_allowed: false
  fallback_allowed: false
  lt06_a5_does_not_cover_vcpchat: true
```

## 2. Endpoint Lock — Bridge Access Surface

```yaml
endpoint_lock:
  bridge_access_strategy: remote_debug_cdp

  electron_launch:
    target: VCPChat
    launcher: npm start
    cwd: <vcpchat_root>
    remote_debug_port_candidate: 9222
    remote_debug_port_alternative: 9223
    exact_port: TBD_BY_OPERATOR

  cdp_connection:
    endpoint: http://127.0.0.1:<remote_debug_port>
    target_discovery: /json
    renderer_target_selector: type == "page" && url contains "index.html"
    max_target_discovery_attempts: 3

  bridge_access:
    method: Runtime.evaluate
    expression: window.imageLabReview.cancel({})
    objectGroup: image_lab_cancel_preflight
    returnByValue: true

  bridge_availability_check:
    pre_evaluate_probe: window.imageLabReview !== undefined
    probe_failure_action: abort — bridge surface not available
```

## 3. Exact Cancel Payload

```yaml
exact_cancel_payload:
  payload: {}
  schema_version: v1
  method: imageLabReview.cancel
  max_calls: 1
  retry: false
  fallback: false
  expression: window.imageLabReview.cancel({})
  response_structure:
    expected: { cancelled: true }
    raw_response_recorded: false
    redacted_summary_only: true
```

## 4. Execution Order

```yaml
execution_order_if_authorized:
  step_0:
    action: start Electron with remote-debug
    required_user_authorization: true
    max_attempts: 1
  step_1:
    action: connect CDP to renderer target
    max_attempts: 3
  step_2:
    action: probe window.imageLabReview surface
    precheck: window.imageLabReview !== undefined
    on_missing: abort — do not proceed
  step_3:
    action: call imageLabReview.cancel({})
    max_calls: 1
    response: redacted summary only
  step_4:
    action: close CDP connection
    required: true
  step_5:
    action: do not close Electron (window remains open for future steps)

total_max_calls: 1
allowed_methods:
  - imageLabReview.cancel
forbidden_methods:
  - imageLabReview.loadSession
  - imageLabReview.previewDraft
  - imageLabReview.submitDraft
```

## 5. Authorization Conditions

Execution requires all of the following:

| # | Condition | Status |
|---|-----------|--------|
| 1 | User explicitly grants authorization for cancel preflight | required |
| 2 | Electron launch authorized | required |
| 3 | Remote-debug start authorized | required |
| 4 | CDP connection authorized | required |
| 5 | Bridge read-only call authorized | required |
| 6 | Exact endpoint locked | required |
| 7 | Exact payload confirmed ({}) | required |
| 8 | Max calls confirmed (1) | required |
| 9 | cancel-only confirmed | required |
| 10 | loadSession not authorized in this package | required |
| 11 | previewDraft not authorized in this package | required |
| 12 | submitDraft permanently excluded | required |
| 13 | No retry confirmed | required |
| 14 | No fallback confirmed | required |
| 15 | Redacted summary only confirmed | required |
| 16 | `execution_authorized` set to true in v7.67 gate document | required |

```yaml
execution_authorized_by_this_document: false
user_explicit_authorization_required: true
user_authorization_phrase: "批准 v7.67 cancel preflight"
```

## 6. Reporting Policy

```yaml
reporting_policy:
  raw_bridge_response_allowed: false
  raw_structuredContent_allowed: false
  redacted_summary_only: true
  private_path_exposure_forbidden: true
  bridge_endpoint_redacted: true
  electron_process_info_redacted: true

  allowed_report_fields:
    - response_status
    - call_count (max 1)
    - methods_called
    - endpoint_used_redacted
    - bridge_surface_available (boolean)
    - redacted_error_type_if_any
    - side_effect_summary
```

## 7. Abort Conditions

```yaml
abort_conditions:
  - method_not_cancel
  - cancel_called_more_than_once
  - loadSession_proposed_or_detected
  - previewDraft_proposed_or_detected
  - submitDraft_proposed_or_detected
  - bridge_surface_not_available
  - cdp_connection_failed_after_max_attempts
  - target_discovery_failed
  - electron_launch_failed
  - params_contain_private_path
  - response_contains_unredacted_path
  - response_requests_followup_write
  - connection_timeout
  - malformed_response
  - any_file_write_detected
  - any_DailyNote_write_detected
  - any_VCP_memory_write_detected
```

## 8. Pre-execution Checklist

Before calling cancel, operator must confirm:

```yaml
pre_execution_checklist:
  - user_explicitly_grants_authorization_for_cancel_preflight: false
  - electron_start_authorized: false
  - remote_debug_start_authorized: false
  - cdp_connection_authorized: false
  - bridge_read_only_call_authorized: false
  - exact_endpoint_locked: true
  - exact_payload_confirmed: true
  - max_calls_confirmed: true (1)
  - cancel_only_confirmed: true
  - loadSession_not_authorized_in_this_package: true
  - previewDraft_not_authorized_in_this_package: true
  - submitDraft_permanently_excluded: true
  - no_retry_confirmed: true
  - no_fallback_confirmed: true
  - redacted_summary_only_confirmed: true
  - execution_authorized_by_user: false (set true only after explicit authorization)
```

## 9. Method Restrictions

```yaml
method_restrictions:
  package_type: cancel_only_preflight_endpoint_lock_and_authorization_gate
  cancel:
    allowed: true
    max_calls: 1
    payload: {}
    response: redacted_summary_only
  loadSession:
    allowed: false
    reason: not part of cancel-only preflight scope
  previewDraft:
    allowed: false
    reason: not part of cancel-only preflight scope
  submitDraft:
    allowed: false
    reason: permanently excluded as write_capable
  any_ipc_runtime_beyond_defined_methods:
    allowed: false
    reason: scope is strictly limited to cancel preflight
```

## 10. Future Execution Requirement

```yaml
future_execution_requirement:
  this_document_authorizes_execution: false
  execution_authorized: false
  runtime_execution: false
  execution_requires_explicit_user_authorization: true
  user_authorization_phrase: "批准 v7.67 cancel preflight"
  recommended_execution_phase: v7.67e (after this gate is pushed and user authorizes)
  
  preconditions_before_execution:
    - condition: user_explicitly_grants_v7_67_cancel_preflight
      status: false
    - condition: exact_endpoint_locked
      status: true
    - condition: exact_payload_confirmed
      status: true
    - condition: max_calls_confirmed
      status: true
    - condition: cancel_only_confirmed
      status: true
    - condition: no_retry_confirmed
      status: true
    - condition: no_fallback_confirmed
      status: true
    - condition: redacted_summary_only_confirmed
      status: true
```
