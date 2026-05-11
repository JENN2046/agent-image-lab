# v7.73 — Electron Launch Authorization Package

> **This document defines an inactive authorization package for a future single VCPChat Electron launch with remote-debug port 9222. This document does not authorize execution.**
>
> **本文定义未来一次 VCPChat Electron 启动的未激活授权包。本文不授权执行。**

---

## 1. Carry-forward Context

```yaml
carry_forward:
  prior_v7_72_commit: 9a3493c
  prior_phase: v7.72 Concrete CDP Endpoint Lock Patch
  selected_port: 9222
  concrete_cdp_endpoint: "http://127.0.0.1:9222"
  exact_endpoint_fully_locked: true
  port_9223_checked: false
  port_9223_not_needed_reason: 9222_free
```

## 2. Authorization Package Scope

```yaml
authorization_package:
  phase: v7.73
  package_type: authorization_package_draft
  package_status: prepared_not_granted
  runtime_execution: false

  launch_purpose: "Prepare VCPChat renderer for future cancel preflight via remote-debug CDP"

  selected_port: 9222
  concrete_cdp_endpoint: "http://127.0.0.1:9222"
  exact_endpoint_fully_locked: true

  launch_command_locked: true
  launch_command: "npm start -- --remote-debugging-port=9222"
  launch_cwd: "<vcpchat_root>"
  max_launch_attempts: 1

  electron_launch_authorized: false
  cdp_connection_authorized: false
  bridge_call_authorized: false
  cancel_call_authorized: false
  loadSession_authorized: false
  previewDraft_authorized: false
  submitDraft_authorized: false
```

## 3. Launch Command Details

```yaml
launch_command_details:
  command: "npm start -- --remote-debugging-port=9222"
  working_directory: "<vcpchat_root>"
  platform: Windows
  max_attempts: 1
  retry_allowed: false
  fallback_allowed: false

  post_launch:
    cdp_connect: false
    bridge_call: false
    cancel_call: false
    port_9223_check: false

  permanently_forbidden_in_this_package:
    - cdp_connect
    - bridge_call
    - cancel_call
    - loadSession / previewDraft / submitDraft
    - mcp_codex_memory_call
    - port_check_re_execution
    - port_9223_check
    - DailyNote_write
    - VCP_memory_write
    - image_generation
    - lt06_execution
```

## 4. Safety Gates

```yaml
safety_gates:
  pre_launch:
    - electron_not_running_check: required
    - port_9222_free_check: required (confirmed by v7.71)
    - vcpchat_worktree_clean_check: required

  post_launch:
    - electron_process_confirmed: required
    - remote_debug_port_confirmed: required
    - cdp_endpoint_not_connected: enforced (not authorized by this package)
    - bridge_not_called: enforced
    - cancel_not_called: enforced
```

## 5. Final State

| Field | Value |
|-------|-------|
| electron_launch_authorization_package_defined | true |
| selected_port | 9222 |
| concrete_cdp_endpoint | http://127.0.0.1:9222 |
| launch_command_locked | true |
| max_electron_launch_attempts | 1 |
| cdp_connection_authorized | false |
| bridge_call_authorized | false |
| cancel_call_authorized | false |
| electron_started | false |
| remote_debug_started | false |
| cdp_used | false |
| bridge_called | false |
| cancel_called | false |
| execution_authorized | false |
| runtime_execution | false |
| next | v7.73a Push Readiness Gate |
