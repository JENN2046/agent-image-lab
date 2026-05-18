# v7.69 — Port Check Authorization Package

> **This document is a draft authorization package for a future exactly-one port conflict check. It does not authorize execution.**
>
> **本文是未来恰好一次端口冲突检测的授权包草案。它不授权执行。**

---

## 1. Carry-forward Context

```yaml
carry_forward_context:
  prior_v7_68_commit: 44e50e2
  prior_v7_68_document: v7_68_exact_port_selection_planning
  preferred_port: 9222
  fallback_port: 9223
  bridge_access_strategy_locked: true
  cancel_payload_locked: true
  exact_cancel_payload: {}
  cancel_max_calls: 1
  retry_allowed: false
  fallback_allowed: false
  exact_endpoint_fully_locked: false
  exact_port_selected: false
  execution_authorized: false
  runtime_execution: false
```

## 2. Package Header

```yaml
v7_69_port_check_authorization_package:
  schema_version: v1
  package_type: authorization_package_draft
  status: prepared_not_granted
  phase: v7_69
  scope: port_check_only
  runtime_execution: false
  port_check_executed: false
```

## 3. Exact Scope

```yaml
exact_scope:
  allowed_commands:
    - id: port_check_primary
      description: Check if port 9222 is in use
      command: >
        Get-Process -Id (Get-NetTCPConnection -LocalPort 9222
        -ErrorAction SilentlyContinue).OwningProcess
        | Select-Object ProcessName, Id
      platform: Windows
      max_calls: 1
      classification: read_only

    - id: port_check_fallback
      description: Check if port 9223 is in use (only if 9222 is occupied)
      command: >
        Get-Process -Id (Get-NetTCPConnection -LocalPort 9223
        -ErrorAction SilentlyContinue).OwningProcess
        | Select-Object ProcessName, Id
      platform: Windows
      max_calls: 1
      classification: read_only
      run_condition: only if 9222 is occupied by a non-VCPChat process

  total_max_commands: 2
  total_max_commands_if_9222_free: 1
  total_max_commands_if_9222_occupied: 2

  permanently_forbidden_in_this_package:
    - action: electron_launch
    - action: remote_debug_start
    - action: cdp_connect
    - action: bridge_call
    - action: cancel_call
    - action: loadSession_call
    - action: previewDraft_call
    - action: submitDraft_call
    - action: any_file_write
    - action: any_DailyNote_write
    - action: any_VCP_memory_write
    - action: any_MCP_call
    - method: any_native_vcp_route

  constraints:
    port_check_is_read_only: true
    port_check_does_not_launch_electron: true
    port_check_does_not_start_remote_debug: true
    port_check_does_not_connect_cdp: true
    port_check_does_not_call_bridge: true
    port_check_does_not_call_cancel: true
```

## 4. Authorization Conditions

```yaml
authorization_conditions:
  execution_authorized_by_this_document: false
  user_explicit_authorization_required: true
  user_authorization_phrase: "批准 v7.69 端口检测"

  preconditions:
    - condition: user_explicitly_authorizes_port_check
      status: false
    - condition: port_check_command_locked
      status: true
    - condition: max_commands_confirmed
      status: true
    - condition: electron_launch_not_authorized
      status: true
    - condition: remote_debug_not_authorized
      status: true
    - condition: cdp_not_authorized
      status: true
    - condition: bridge_not_authorized
      status: true
    - condition: cancel_not_authorized
      status: true
```

## 5. Reporting Policy

```yaml
reporting_policy:
  raw_port_check_output: false
  redacted_summary_only: true

  allowed_report_fields:
    - port_9222_status (free / occupied_by_vcpchat / occupied_by_other)
    - port_9223_status (free / occupied_by_vcpchat / occupied_by_other)
    - check_count (max 2)
    - selected_port_if_port_9222_free
    - redacted_owning_process_name_if_vcpchat
    - redacted_owning_process_id
```

## 6. Abort Conditions

```yaml
abort_conditions:
  - more_than_2_port_checks_executed
  - electron_started_during_this_package
  - remote_debug_started_during_this_package
  - cdp_connected_during_this_package
  - bridge_called_during_this_package
  - cancel_called_during_this_package
  - loadSession_called_during_this_package
  - previewDraft_called_during_this_package
  - submitDraft_called_during_this_package
  - any_file_written_during_this_package
  - any_DailyNote_written_during_this_package
  - any_VCP_memory_written_during_this_package
```

## 7. Current Invariants

```yaml
current_invariants:
  port_check_executed: false
  electron_started: false
  remote_debug_started: false
  cdp_used: false
  bridge_called: false
  cancel_called: false
  loadSession_called: false
  previewDraft_called: false
  submitDraft_called: false
  execution_authorized: false
  runtime_execution: false
  exact_endpoint_fully_locked: false
  exact_port_selected: false
  cdp_endpoint_concrete: false
```
