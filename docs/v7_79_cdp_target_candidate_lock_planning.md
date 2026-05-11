# v7.79 — CDP Target Candidate Lock Planning

> **Planning phase for locking the CDP target candidate identified in v7.78. No raw JSON available; planning based on redacted summary only. This document does not authorize execution.**
>
> **规划阶段，用于锁定 v7.78 识别的 CDP target candidate。无原始 JSON 可用；仅基于 redacted summary 规划。本文不授权执行。**

---

## 1. Carry-forward Context

```yaml
carry_forward:
  prior_v7_78_commit: 1b8ea7a
  prior_phase: v7.78 CDP Target Discovery Execution Closeout
  cdp_json_accessed: true
  json_requests_executed: 1
  target_count: 2
  page_target_count: 2
  selected_target_candidate_kind: page
  selected_target_title_keywords_redacted: redacted_title_len=7
  selected_target_url_kind: file
  raw_json_response_recorded: false
  cdp_connected: false
  cdp_websocket_connected: false
```

## 2. Planning Scope

```yaml
planning:
  phase: v7.79
  document_type: planning_only
  runtime_execution: false

  candidate_source: v7.78_redacted_summary_only
  candidate_lock_status: planning_only
  candidate_identity_fully_locked: false

  known_candidate_fields:
    - target_count: 2
    - page_target_count: 2
    - selected_target_candidate_kind: page
    - selected_target_url_kind: file
    - selected_target_title_keywords_redacted: "redacted_title_len=7"

  missing_fields_requiring_future_action:
    - raw_target_id
    - webSocketDebuggerUrl
    - full_url
    - full_title
```

## 3. Lock Requirements

```yaml
lock_requirements:
  websocket_debugger_url_locked: false
  raw_target_id_locked: false

  candidate_identity_fully_locked: false

  second_json_request_allowed: false
  second_json_request_requires_new_authorization: true

  authorization_status:
    cdp_websocket_connect_authorized: false
    runtime_evaluate_authorized: false
    bridge_call_authorized: false
    cancel_call_authorized: false
```

## 4. Next Steps (Planning Only)

```yaml
next_steps_planning_only:
  - option_a: "Request new authorization for second /json access to capture webSocketDebuggerUrl and target ID for exact locking"
    requires_new_authorization: true
    status: not_requested

  - option_b: "Proceed with CDP WebSocket connect using known target selector (title match) without exact target ID"
    risk: target_selection_ambiguity
    status: not_evaluated

  - option_c: "Request authorization for Runtime.evaluate on all discovered targets to identify correct target"
    risk: broader_scope_than_needed
    status: not_evaluated
```

## 5. Safety Verification

| Check | Result |
|-------|--------|
| /json accessed (this phase) | false |
| CDP WebSocket connected | false |
| Runtime.evaluate called | false |
| Bridge called | false |
| Cancel called | false |
| Electron relaunched | false |
| Second json request | false |

## 6. Final State

| Field | Value |
|-------|-------|
| cdp_target_candidate_lock_planning_defined | true |
| candidate_source | v7.78_redacted_summary_only |
| target_count | 2 |
| page_target_count | 2 |
| selected_target_candidate_kind | page |
| selected_target_url_kind | file |
| selected_target_title_keywords_redacted | redacted_title_len=7 |
| candidate_lock_status | planning_only |
| candidate_identity_fully_locked | false |
| websocket_debugger_url_locked | false |
| raw_target_id_locked | false |
| second_json_request_allowed | false |
| second_json_request_requires_new_authorization | true |
| cdp_websocket_connect_authorized | false |
| runtime_evaluate_authorized | false |
| bridge_call_authorized | false |
| cancel_call_authorized | false |
| cdp_json_accessed (this phase) | false |
| cdp_connected | false |
| runtime_evaluate_called | false |
| bridge_called | false |
| cancel_called | false |
| next | v7.79a Push Readiness Gate |
