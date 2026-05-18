# v7.80 — Target Lock Route Decision

> **Route decision: option A (second /json access for exact target lock material) selected. options B and C rejected. No runtime execution.**
>
> **路线裁决：选择选项 A（第二次 /json 访问以获取精确 target lock 素材）。选项 B 和 C 被拒绝。不涉及 runtime 执行。**

---

## 1. Carry-forward Context

```yaml
carry_forward:
  prior_v7_79_commit: 0c6b493
  prior_phase: v7.79 CDP Target Candidate Lock Planning
  candidate_source: v7.78_redacted_summary_only
  target_count: 2
  page_target_count: 2
  selected_target_candidate_kind: page
  selected_target_url_kind: file
  candidate_lock_status: planning_only
  candidate_identity_fully_locked: false
  second_json_request_allowed: false
  cdp_websocket_connect_authorized: false
  runtime_evaluate_authorized: false
```

## 2. Route Decision

```yaml
route_decision:
  phase: v7.80
  document_type: route_decision
  runtime_execution: false
  decision_date: 2026-05-11

  options_considered:
    - option_a: "Request new authorization for second /json access to capture exact target lock material"
    - option_b: "Proceed with CDP WebSocket connect using known target selector without exact target ID"
    - option_c: "Runtime.evaluate on all discovered targets to identify correct target"

  selected_route: option_a_second_json_for_exact_lock

  rejected_routes:
    option_b:
      status: rejected
      reason: target_selection_ambiguity
      details: "Without exact target ID, WebSocket connect to wrong target cannot be ruled out when multiple page targets exist."
    option_c:
      status: rejected
      reason: broader_scope_than_needed
      details: "Runtime.evaluate on all targets introduces unnecessary execution surface. A controlled second /json access is strictly narrower."
```

## 3. Future Authorization Scope (Route A)

```yaml
future_authorization_scope_route_a:
  second_json_request_required: true
  second_json_request_authorized_now: false
  second_json_request_scope: exact_target_lock_only

  raw_json_response_still_forbidden: true

  allowed_future_redacted_fields:
    - target_count
    - page_target_count
    - selected_target_candidate_kind
    - selected_target_url_kind
    - selected_target_title_keywords_redacted
    - raw_target_id_hash_or_short_fingerprint_only
    - websocket_debugger_url_presence_boolean

  forbidden_future_fields:
    - raw_json
    - full_webSocketDebuggerUrl
    - full_raw_target_id
    - full_url
    - full_title
    - devtoolsFrontendUrl
    - raw_page_content
```

## 4. Current Authorization Status

```yaml
current_authorization:
  cdp_websocket_connect_authorized: false
  runtime_evaluate_authorized: false
  bridge_call_authorized: false
  cancel_call_authorized: false
  second_json_request_authorized: false
```

## 5. Safety Verification

| Check | Result |
|-------|--------|
| /json accessed (this phase) | false |
| CDP WebSocket connected | false |
| Runtime.evaluate called | false |
| Bridge called | false |
| Cancel called | false |
| Known untracked file touched | false |

## 6. Final State

| Field | Value |
|-------|-------|
| target_lock_route_decision_completed | true |
| selected_route | option_a_second_json_for_exact_lock |
| rejected_route_b_reason | target_selection_ambiguity |
| rejected_route_c_reason | broader_scope_than_needed |
| second_json_request_required | true |
| second_json_request_authorized_now | false |
| second_json_request_scope | exact_target_lock_only |
| raw_json_response_still_forbidden | true |
| full_websocket_debugger_url_forbidden | true |
| full_raw_target_id_forbidden | true |
| full_url_forbidden | true |
| full_title_forbidden | true |
| cdp_websocket_connect_authorized | false |
| runtime_evaluate_authorized | false |
| bridge_call_authorized | false |
| cancel_call_authorized | false |
| cdp_json_accessed | false |
| cdp_connected | false |
| runtime_evaluate_called | false |
| bridge_called | false |
| cancel_called | false |
| known_untracked_file_touched | false |
| next | v7.80a Push Readiness Gate |
