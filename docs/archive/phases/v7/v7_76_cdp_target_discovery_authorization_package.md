# v7.76 — CDP Target Discovery Authorization Package

> **This document defines an inactive authorization package for a future single CDP target discovery via /json endpoint. This document does not authorize execution.**
>
> **本文定义未来一次 CDP target discovery（/json 端点）的未激活授权包。本文不授权执行。**

---

## 1. Carry-forward Context

```yaml
carry_forward:
  prior_v7_75_commit: c7c8913
  prior_phase: v7.75 Electron Runtime State Closeout
  electron_already_running: true
  electron_processes_observed: 5
  selected_port: 9222
  concrete_cdp_endpoint: "http://127.0.0.1:9222"
  remote_debug_port_9222_listening: true
  cdp_connected: false
  cdp_used: false
  cdp_json_accessed: false
```

## 2. Authorization Package Scope

```yaml
authorization_package:
  phase: v7.76
  package_type: authorization_package_draft
  package_status: prepared_not_granted
  runtime_execution: false

  purpose: "Discover CDP renderer target for future cancel preflight"
  target_discovery_url: "http://127.0.0.1:9222/json"
  max_json_requests: 1
  raw_json_response_forbidden: true
  redacted_summary_only: true

  allowed:
    - http_get_json_target_discovery_only

  not_authorized:
    - websocket_cdp_connect
    - runtime_evaluate
    - bridge_call
    - cancel_call
    - loadSession / previewDraft / submitDraft

  permanently_forbidden:
    - websocket_cdp_connect
    - runtime_evaluate
    - bridge_call
    - cancel_call
    - loadSession / previewDraft / submitDraft
    - electron_relaunch
    - port_check_re_execution
    - port_9223_check
    - mcp_codex_memory_call
    - DailyNote_write
    - VCP_memory_write
    - image_generation
    - lt06_execution
```

## 3. Target Discovery Details

```yaml
target_discovery_details:
  url: "http://127.0.0.1:9222/json"
  method: HTTP GET
  max_requests: 1
  retry_allowed: false
  fallback_allowed: false

  expected_response_type: JSON
  raw_response_recorded: false
  redacted_summary_only: true

  data_fields_allowed_in_report:
    - target_count
    - target_type_page_count
    - target_url_kind (file / http / about)
    - target_title_keywords
  data_fields_forbidden_in_report:
    - raw_json
    - webSocketDebuggerUrl
    - devtoolsFrontendUrl
    - full_url
    - full_title
    - raw_id
    - raw_page_content
```

## 4. Safety Gates

```yaml
safety_gates:
  pre_discovery:
    - electron_running: required (confirmed by v7.75)
    - port_9222_listening: required (confirmed by v7.75)
    - cdp_not_already_connected: required

  post_discovery:
    - websocket_not_connected: enforced
    - runtime_evaluate_not_called: enforced
    - bridge_not_called: enforced
    - cancel_not_called: enforced
```

## 5. Final State

| Field | Value |
|-------|-------|
| cdp_target_discovery_authorization_package_defined | true |
| target_discovery_url | http://127.0.0.1:9222/json |
| max_json_requests | 1 |
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
| next | v7.76a Push Readiness Gate |
