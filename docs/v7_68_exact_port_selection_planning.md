# v7.68 — Exact Port Selection Planning

> **This document plans the exact remote-debug port selection for a future cancel preflight call. It does not launch Electron, start remote-debug, connect CDP, or call the bridge.**
>
> **本文规划未来 cancel preflight 调用的确切 remote-debug 端口选择。不启动 Electron、不启动 remote-debug、不连接 CDP、不调用 bridge。**

---

## 1. Carry-forward Context

```yaml
carry_forward_context:
  prior_v7_67_commit: 3bb90ca
  prior_v7_67_document: v7_67_cancel_preflight_endpoint_lock_and_authorization_gate
  bridge_access_strategy_locked: true
  bridge_access_strategy: remote_debug_cdp
  cancel_payload_locked: true
  exact_cancel_payload: {}
  cancel_max_calls: 1
  retry_allowed: false
  fallback_allowed: false
  exact_endpoint_fully_locked: false
  exact_port_selected: false
  cdp_endpoint_concrete: false
  execution_authorized: false
  runtime_execution: false
```

## 2. Port Selection Policy

```yaml
port_selection_policy:
  preferred_port: 9222
  fallback_port: 9223
  selection_criteria:
    - primary: use 9222 if not in use by another process
    - fallback: use 9223 if 9222 is occupied
    - manual_override: operator may specify an alternative port if both 9222 and 9223 are occupied

  port_conflict_check:
    command: >
      Get-Process -Id (Get-NetTCPConnection -LocalPort <port> -ErrorAction SilentlyContinue).OwningProcess
      | Select-Object ProcessName, Id
    platform: Windows
    notes: >
      If the owning process is VCPChat (electron.exe), the port is already in use by the target.
      If the owning process is something else, the port is occupied by a different application.
    do_not_run: true
    run_condition: only when operator explicitly authorizes port check

  electron_launch:
    command: >
      cd <vcpchat_root> && npm start
    platform: Windows
    remote_debug_flag: --remote-debugging-port=<port>
    notes: >
      VCPChat must be launched with --remote-debugging-port=<port> flag.
      Without this flag, CDP will not be available.
    do_not_run: true
    run_condition: only when operator explicitly authorizes Electron launch
```

## 3. CDP Endpoint

```yaml
cdp_endpoint_specification:
  format: http://127.0.0.1:<port>
  concrete_endpoint: TBD_AFTER_PORT_SELECTION
  target_discovery: http://127.0.0.1:<port>/json
  renderer_target_selector: type == "page" && url contains "index.html"

  notes: >
    Once port is selected and VCPChat is launched with --remote-debugging-port=<port>,
    the concrete CDP endpoint becomes http://127.0.0.1:<selected_port>.
    At that point exact_endpoint_fully_locked becomes true.

  cancel_execution_expression: window.imageLabReview.cancel({})
```

## 4. Port Selection Decision Record

```yaml
port_selection_decision_record:
  phase: v7.68
  status: planning_only
  operator_decision_required: true
  decision_fields:
    - selected_port: TBD_BY_OPERATOR
    - confirmation_command_output: TBD_BY_OPERATOR
    - electron_launch_authorized: false
    - remote_debug_start_authorized: false
    - cdp_connection_authorized: false

  pre_selection_checks:
    - check_port_9222_available
    - check_port_9223_available
    - confirm_vcpchat_root_path
    - confirm_electron_available
```

## 5. Lock Status After Port Selection

Once the operator selects the port and confirms it:

```yaml
lock_status_after_port_selection:
  exact_endpoint_fully_locked: true
  exact_port_selected: true
  cdp_endpoint_concrete: true
  concrete_endpoint: http://127.0.0.1:<selected_port>
  still_blocked_until_user_authorization:
    - electron_launch_authorized
    - remote_debug_start_authorized
    - cdp_connection_authorized
    - bridge_call_authorized
    - cancel_execution_authorized
```

## 6. Current Invariants

```yaml
current_invariants:
  exact_endpoint_fully_locked: false
  exact_port_selected: false
  cdp_endpoint_concrete: false
  execution_authorized: false
  runtime_execution: false
  cancel_called: false
  electron_started: false
  remote_debug_started: false
  cdp_used: false
  bridge_called: false
  loadSession_called: false
  previewDraft_called: false
  submitDraft_called: false
```
