# v7.74 — Electron Launch Execution Authorization Gate

> **This document defines the launch command, exact parameters, and authorization conditions for a future single VCPChat Electron launch with remote-debug port 9222. This document does not authorize execution.**
>
> **本文定义未来一次 VCPChat Electron launch 的启动命令、确切参数和授权条件。本文不授权执行。**

---

## 1. Carry-forward Context

```yaml
carry_forward:
  prior_v7_73_commit: eb47b68
  prior_phase: v7.73 Electron Launch Authorization Package
  selected_port: 9222
  concrete_cdp_endpoint: "http://127.0.0.1:9222"
  exact_endpoint_fully_locked: true
  launch_command_locked: true
  launch_command: "npm start -- --remote-debugging-port=9222"
  max_launch_attempts: 1
```

## 2. Execution Authorization Gate

```yaml
execution_gate:
  phase: v7.74
  gate_type: execution_authorization_gate
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
  retry_allowed: false
  fallback_allowed: false

  cdp_connection_authorized: false
  bridge_call_authorized: false
  cancel_call_authorized: false
  loadSession_authorized: false
  previewDraft_authorized: false
  submitDraft_authorized: false
```

## 3. Exact Launch Command

```yaml
exact_launch_command:
  command: "npm start -- --remote-debugging-port=9222"
  working_directory: "<vcpchat_root>"
  platform: Windows
  max_attempts: 1
  retry: false
  fallback: false

  post_launch_restrictions:
    cdp_connect: false
    bridge_call: false
    cancel_call: false
    port_9223_check: false
```

## 4. Permanently Forbidden

```yaml
permanently_forbidden_in_this_gate:
  - cdp_connect
  - bridge_call
  - cancel_call
  - loadSession_call
  - previewDraft_call
  - submitDraft_call
  - mcp_codex_memory_call
  - port_check_re_execution
  - port_9223_check
  - electron_second_launch
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

  pre_launch_checks:
    - electron_not_already_running: required
    - port_9222_free: required (confirmed by v7.71)
    - vcpchat_worktree_clean: required

  post_launch_boundary:
    - electron_process_confirmed: allowed
    - remote_debug_port_confirmed: allowed
    - cdp_endpoint_not_connected: enforced
    - bridge_not_called: enforced
    - cancel_not_called: enforced
```

## 6. Safety Verification

| Check | Result |
|-------|--------|
| Electron started | false |
| Remote-debug started | false |
| CDP used | false |
| Bridge called | false |
| Cancel called | false |
| Port check re-executed | false |

## 7. Final State

| Field | Value |
|-------|-------|
| electron_launch_execution_gate_defined | true |
| selected_port | 9222 |
| concrete_cdp_endpoint | http://127.0.0.1:9222 |
| launch_command_locked | true |
| max_electron_launch_attempts | 1 |
| retry_allowed | false |
| fallback_allowed | false |
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
| next | v7.74a Push Readiness Gate |
