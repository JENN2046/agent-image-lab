# v7.66 — VCPChat cancel-only Preflight Authorization Package

> **This document is a draft authorization package. It does not authorize execution.**
>
> **本文是授权包草案，不授权执行。**

---

## 1. Carry-forward Context

```yaml
carry_forward_context:
  prior_v7_65_commit: 5a3b4e4
  prior_v7_65_document: authorization_package_v2
  cancel_discovered_in: v7.64_static_review
  cancel_classification: read_only
  cancel_role: optional_preflight_probe
  cancel_default_allowed_in_v7_65: false
  cancel_requires_explicit_user_decision: true
  lt06_a5_does_not_cover_vcpchat: true
  exact_endpoint_locked: false
```

## 2. v7.65 Post-push Minor Note Resolution

```yaml
v7_65_post_push_minor_note_resolution:
  note: no_other_methods_confirmed: true 容易误读。
  resolution:
    documented_bridge_methods_complete: true
    no_methods_beyond_v7_64_inventory: true
    extra_method_cancel_documented: true
  applied_in: v7_66_closeout
```

## 3. Package Header

```yaml
v7_66_vcpchat_cancel_only_preflight_authorization_package:
  schema_version: v1
  package_type: authorization_package_draft
  status: prepared_not_granted
  phase: v7_66
  scope: cancel_only_preflight
  runtime_execution_authorized: false
  based_on_static_evidence: v7.64
```

## 4. Exact Scope

```yaml
exact_scope:
  allowed_method_if_later_authorized:
    - method: imageLabReview.cancel
      max_calls: 1
      classification: read_only
      evidence: v7.64_static_review
      purpose:
        - bridge heartbeat verification
        - sender validation check
        - IPC path health check

  permanently_forbidden_in_this_package:
    - method: imageLabReview.loadSession
      reason: loadSession is not part of cancel-only preflight scope
    - method: imageLabReview.previewDraft
      reason: previewDraft is not part of cancel-only preflight scope
    - method: imageLabReview.submitDraft
      reason: permanently excluded as write_capable

  execution_order_if_authorized:
    - 1. imageLabReview.cancel max 1

  total_max_calls: 1

  constraints:
    cancel_does_not_replace_loadSession_or_previewDraft: true
    cancel_only_checks_bridge_availability: true
    cancel_success_does_not_imply_loadSession_or_previewDraft_success: true
```

## 5. Endpoint Lock Status

```yaml
endpoint_lock_status:
  exact_endpoint: TBD
  locked: false
  execution_blocked_if_not_locked: true
  endpoint_must_be_locked_before_cancel_call: true
```

## 6. Reporting Policy

```yaml
reporting_policy:
  raw_bridge_response_allowed: false
  raw_structuredContent_allowed: false
  redacted_summary_only: true
  private_path_exposure_forbidden: true

  allowed_report_fields:
    - response_status
    - call_count (max 1)
    - methods_called
    - endpoint_used_redacted
    - side_effect_summary
    - top_level_keys_present
    - redacted_error_type_if_any
```

## 7. Abort Conditions

```yaml
abort_conditions:
  - method_not_cancel
  - cancel_called_more_than_once
  - loadSession_proposed_or_detected
  - previewDraft_proposed_or_detected
  - submitDraft_proposed_or_detected
  - params_contain_private_path
  - response_contains_unredacted_path
  - response_contains_unredacted_memory_id
  - response_requests_followup_write
  - connection_timeout
  - malformed_response
  - any_file_write_detected
  - any_DailyNote_write_detected
  - any_VCP_memory_write_detected
```

## 8. Future Execution Requirement

```yaml
future_execution_requirement:
  this_document_authorizes_execution: false
  execution_requires_explicit_user_authorization: true
  recommended_execution_phase: v7.67
  preconditions_before_execution:
    - user_explicitly_grants_authorization_for_cancel_preflight
    - electron_start_authorized
    - remote_debug_start_authorized
    - bridge_read_only_call_authorized
    - exact_endpoint_locked
    - exact_payload_confirmed
    - max_calls_confirmed (1)
    - cancel_only_confirmed
    - loadSession_not_authorized_in_this_package
    - previewDraft_not_authorized_in_this_package
    - submitDraft_permanently_excluded
    - no_retry_confirmed
    - no_fallback_confirmed
    - redacted_summary_only_confirmed
```

## 9. Method Inventory Clarification

```yaml
method_inventory_clarification:
  documented_bridge_methods_complete: true
  no_methods_beyond_v7_64_inventory: true
  extra_method_cancel_documented: true
  all_imageLabReview_methods:
    - loadSession: read_only
    - previewDraft: read_only
    - submitDraft: write_capable
    - cancel: read_only
  methods_outside_cancel_only_scope:
    - loadSession
    - previewDraft
    - submitDraft
  permanently_excluded:
    - submitDraft
```
