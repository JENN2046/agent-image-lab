# v7.65 — VCPChat Surface Check Authorization Package v2

> **This document is a draft authorization package. It does not authorize execution.**
>
> **本文是授权包草案，不授权执行。基于 v7.64 静态审查证据重写。**

---

## 1. Carry-forward Context

```yaml
carry_forward_context:
  prior_v7_64_commit: f84a5f1
  prior_static_code_review_execution: true
  imageLabReview_surface_found: true
  contextBridge_exposure_found: true
  methods_found:
    - loadSession: read_only
    - previewDraft: read_only
    - submitDraft: write_capable
    - cancel: read_only (extra method)
  extra_method_cancel_explanation: >
    cancel exists on the bridge surface but was not in original
    v7.61 planning. It is read-only but NOT automatically allowed.
  lt06_a5_does_not_cover_vcpchat: true
```

## 2. Package Header

```yaml
v7_65_vcpchat_surface_check_authorization_package_v2:
  schema_version: v1
  package_type: authorization_package_draft
  status: prepared_not_granted
  phase: v7_65
  based_on_static_evidence: v7.64
  runtime_execution_authorized: false
```

## 3. Exact Scope

```yaml
exact_scope:
  surfaces_to_check:
    - VCPChat Review Console imageLabReview bridge surface

  default_allowed_methods:
    - method: imageLabReview.loadSession
      max_calls: 1
      classification: read_only
      evidence: v7.64_static_review
      purpose: load review session draft

    - method: imageLabReview.previewDraft
      max_calls: 1
      classification: read_only
      evidence: v7.64_static_review
      purpose: preview draft bundle

    total_max_calls: 2
    cannot_use_cancel_as_substitute: true

  optional_preflight_method:
    method: imageLabReview.cancel
    default_allowed: false
    requires_explicit_user_decision: true
    discovered_extra_method: true
    classification: read_only
    discovered_in: v7.64_static_review
    purpose: bridge heartbeat / sender validation / IPC path check
    max_calls_if_authorized: 1
    cannot_substitute_for_loadSession_or_previewDraft: true

  permanently_forbidden_methods:
    - method: imageLabReview.submitDraft
      classification: write_capable
      exclusion: permanent
      evidence: v7.64_static_review
      can_never_be_added_to_allowlist: true
      explanation: >
        submitDraft is the designated submission/write path.
        Its handler response includes stored, submitted_to_daily_note,
        and submitted_to_vcp_memory fields. Even though the current
        implementation returns all false, the method is designed for
        writes and is permanently excluded.

  no_other_methods_confirmed: true
```

## 4. cancel Preflight Probe

```yaml
cancel_preflight_probe:
  discovered_extra_method: true
  classification: read_only
  default_allowed: false
  requires_explicit_user_decision: true
  recommended_role: preflight_probe
  max_calls_if_authorized: 1
  purpose: bridge heartbeat / sender validation / IPC path check
  cannot_substitute_for_loadSession_or_previewDraft: true

  explanation: >
    cancel was discovered during v7.64 static code review as an
    extra method on the imageLabReview bridge surface. It is
    read-only (returns { cancelled: true }). It can serve as an
    optional preflight probe to verify bridge availability,
    sender validation, and IPC path health. Because it was not
    in the original planning scope, it is excluded by default.

  addition_procedure: >
    If the user decides to allow cancel as a preflight probe,
    they must explicitly state so
    (e.g., "批准 cancel 作为 VCPChat surface check preflight probe").
    After such authorization, total max calls = 3
    (cancel 1 + loadSession 1 + previewDraft 1).

  recommended_execution_order_if_authorized: >
    1. imageLabReview.cancel max 1 (preflight probe)
    2. imageLabReview.loadSession max 1
    3. imageLabReview.previewDraft max 1

  if_not_authorized:
    cancel_must_not_be_called: true
    total_max_calls: 2
    execution_order: >
      1. imageLabReview.loadSession max 1
      2. imageLabReview.previewDraft max 1

  future_test_route:
    - v7.66: cancel-only preflight authorization package
    - v7.67: execute exactly one cancel call after explicit authorization
    - cannot_skip: both phases require independent user authorization
    - cancel_standalone_authorization_must_precede_v7_65_execution: true
```

## 5. submitDraft Permanent Exclusion

```yaml
submitDraft_permanent_exclusion:
  classification: write_capable
  exclusion: permanent
  evidence: v7.64_static_review
  handler_write_operations: none_resolved
  designated_write_path: true
  can_never_be_added_to_allowlist: true
  explanation: >
    submitDraft is the designated submission/write path of the
    imageLabReview bridge. Its handler response includes
    stored, submitted_to_daily_note, and submitted_to_vcp_memory
    fields. Even though the current implementation returns all
    false, the method is designed for writes and is permanently
    excluded from any read-only surface check.
```

## 6. Endpoint Lock Status

```yaml
endpoint_lock_status:
  exact_endpoint: TBD
  locked: false
  execution_blocked_if_not_locked: true
  required_fields_before_execution:
    - exact Electron target window
    - exact remote-debug port (if used)
    - exact CDP endpoint (if used)
    - exact VCPChat executable path
    - exact VCPChat working directory
  blocked_until: future authorization package with locked endpoint

static_evidence_confirmed:
  exact_endpoint_not_required_for_static_review: true
  endpoint_must_be_locked_before_any_bridge_call: true
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

## 8. Abort Conditions

```yaml
abort_conditions:
  - method_not_loadSession_or_previewDraft
  - cancel_proposed_without_explicit_user_authorization
  - submitDraft_proposed_or_detected
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

## 9. Future Authorization Requirement

```yaml
future_authorization:
  requires_new_independent_authorization: true
  lt06_a5_does_not_cover_vcpchat: true

  preconditions_before_execution:
    - user_explicitly_grants_authorization
    - electron_start_authorized
    - remote_debug_start_authorized
    - bridge_read_only_call_authorized
    - exact_surfaces_confirmed
    - exact_methods_confirmed (loadSession, previewDraft only)
    - exact_payloads_confirmed
    - max_calls_confirmed (2 max, 1 per method)
    - cancel_not_authorized_unless_explicitly_stated
    - submitDraft_permanently_excluded
    - no_retry_confirmed
    - no_fallback_confirmed
    - redacted_summary_only_confirmed
    - exact_endpoint_locked
```

## 10. v7.61 vs v7.65 Changes

```yaml
changes_from_v7_61:
  - added: cancel method discovered and documented
  - added: cancel default blocked, requires explicit user decision
  - added: total max calls = 2 (cancel excluded)
  - added: if cancel authorized, total max calls must be recalculated
  - added: based_on_static_evidence: v7.64
  - added: submitDraft permanent exclusion with static evidence reference
  - added: exact_endpoint_locked requirement explicitly stated
  - changed: reporting policy refined with allowed_report_fields
  - changed: abort conditions include cancel-specific check

  unchanged:
    - loadSession max 1, previewDraft max 1
    - submitDraft permanently forbidden
    - no retry, no fallback
    - redacted summary only
    - raw bridge response forbidden
    - no runtime execution authorized
    - lt06_a5_does_not_cover_vcpchat
```
