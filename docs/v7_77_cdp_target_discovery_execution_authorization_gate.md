# v7.77 — CDP Target Discovery Execution Authorization Gate

> **This document defines the exact target discovery request, response policy, and authorization conditions for a future single CDP target discovery via /json. This document does not authorize execution.**
>
> **本文定义未来一次 CDP target discovery（/json）的确切请求、响应策略和授权条件。本文不授权执行。**

---

## 1. Carry-forward Context

```yaml
carry_forward:
  prior_v7_76_commit: 957780a
  prior_phase: v7.76 CDP Target Discovery Authorization Package
  electron_already_running: true
  electron_processes_observed: 5
  selected_port: 9222
  concrete_cdp_endpoint: "http://127.0.0.1:9222"
  remote_debug_port_9222_listening: true
  cdp_json_accessed: false
  cdp_connected: false
```

## 2. Execution Authorization Gate

```yaml
execution_gate:
  phase: v7.77
  gate_type: execution_authorization_gate
  package_status: prepared_not_granted
  runtime_execution: false

  purpose: "Discover CDP renderer target for future cancel preflight"

  exact_url: "http://127.0.0.1:9222/json"
  method: HTTP_GET
  max_requests: 1
  retry_allowed: false
  fallback_allowed: false

  raw_json_response_forbidden: true
  redacted_summary_only: true

  websocket_cdp_connect_authorized: false
  runtime_evaluate_authorized: false
  bridge_call_authorized: false
  cancel_call_authorized: false
  loadSession_authorized: false
  previewDraft_authorized: false
  submitDraft_authorized: false
```

## 3. Response Policy

```yaml
response_policy:
  raw_response_recorded: false
  redacted_summary_only: true

  allowed_report_fields:
    - target_count (number of targets in /json response)
    - page_target_count (number of type=page targets)
    - selected_target_candidate_kind (e.g. "page", "iframe")
    - selected_target_title_keywords_redacted (redacted title keywords only)
    - selected_target_url_kind (file / http / about / chrome)

  forbidden_report_fields:
    - raw_json
    - webSocketDebuggerUrl
    - devtoolsFrontendUrl
    - raw_target_id
    - full_url
    - full_title
    - raw_page_content
    - any_single_target_keys_full
```

## 4. Permanently Forbidden

```yaml
permanently_forbidden_in_this_gate:
  - cdp_websocket_connect
  - runtime_evaluate
  - bridge_call
  - cancel_call
  - loadSession_call
  - previewDraft_call
  - submitDraft_call
  - electron_relaunch
  - mcp_codex_memory_call
  - port_check_re_execution
  - port_9223_check
  - DailyNote_write
  - VCP_memory_write
  - image_generation
  - lt06_execution
  - any_native_vcp_route
```

## 5. Authorization Conditions

```yaml
authorization:
  authorized_by_this_document: false
  user_explicit_authorization_required: true
  execution_blocked_if_not_authorized: true

  pre_discovery_checks:
    - electron_running: required (confirmed by v7.75)
    - port_9222_listening: required (confirmed by v7.75)
    - cdp_not_already_connected: required

  post_discovery_boundary:
    - raw_json_not_recorded: enforced
    - redacted_summary_only: enforced
    - websocket_not_connected: enforced
    - runtime_evaluate_not_called: enforced
    - bridge_not_called: enforced
    - cancel_not_called: enforced
```

## 6. Safety Verification

| Check | Result |
|-------|--------|
| /json accessed | false |
| CDP WebSocket connected | false |
| Runtime.evaluate called | false |
| Bridge called | false |
| Cancel called | false |
| Electron relaunched | false |

## 7. Final State

| Field | Value |
|-------|-------|
| cdp_target_discovery_execution_gate_defined | true |
| target_discovery_url | http://127.0.0.1:9222/json |
| max_json_requests | 1 |
| retry_allowed | false |
| fallback_allowed | false |
| raw_json_response_forbidden | true |
| redacted_summary_only | true |
| websocket_cdp_connect_authorized | false |
| runtime_evaluate_authorized | false |
| bridge_call_authorized | false |
| cancel_call_authorized | false |
| cdp_json_accessed | false |
| cdp_connected | false |
| runtime_evaluate_called | false |
| bridge_called | false |
| cancel_called | false |
| execution_authorized | false |
| runtime_execution | false |
| next | v7.77a Push Readiness Gate |
