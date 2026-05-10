# v7.70 — Port Check Execution Authorization Gate

> **This document is the authorization gate for a future exactly-one port conflict check. Execution requires explicit user authorization.**
>
> **本文是未来恰好一次端口冲突检测的执行授权门。执行需要用户明确授权。**

---

## 1. Carry-forward Context

```yaml
carry_forward_context:
  prior_v7_69_commit: bc46ec7
  prior_v7_69_document: v7_69_port_check_authorization_package
  primary_check_port: 9222
  fallback_check_port: 9223
  exact_port_check_command_locked: true
  max_port_check_commands: 2
  max_if_9222_free: 1
  max_if_9222_occupied: 2
  port_check_executed: false
  electron_started: false
  remote_debug_started: false
  cdp_used: false
  bridge_called: false
  cancel_called: false
  execution_authorized: false
  runtime_execution: false
```

## 2. Package Header

```yaml
v7_70_port_check_execution_authorization_gate:
  schema_version: v1
  gate_type: execution_authorization_gate
  status: prepared_not_granted
  phase: v7_70
  scope: port_check_execution
  runtime_execution: false
  port_check_executed: false
```

## 3. Exact Commands

```yaml
exact_commands:

  primary_command:
    id: port_check_9222
    port: 9222
    robust_spec: |
      Query Get-NetTCPConnection -LocalPort 9222.
      - No connection found   → "port_9222_status: free"
      - Owning process name matches "electron" → "port_9222_status: occupied_by_vcpchat"
      - Owning process name is something else  → "port_9222_status: occupied_by_other"
      - Get-Process errors on the PID          → "port_9222_status: check_error"
    command: >
      $c=Get-NetTCPConnection -LocalPort 9222 -ErrorAction 0;
      if(!$c){'port_9222_status: free';exit};
      $p=Get-Process -Id $c.OwningProcess -ErrorAction 0;
      if(!$p){'port_9222_status: check_error';exit};
      if($p.ProcessName-eq'electron'){'port_9222_status: occupied_by_vcpchat'}
      else{'port_9222_status: occupied_by_other'}
    platform: Windows
    max_calls: 1
    run_condition: always
    classification: read_only

  fallback_command:
    id: port_check_9223
    port: 9223
    robust_spec: |
      Query Get-NetTCPConnection -LocalPort 9223.
      Same 4-case output as primary: free / occupied_by_vcpchat / occupied_by_other / check_error.
    command: >
      $c=Get-NetTCPConnection -LocalPort 9223 -ErrorAction 0;
      if(!$c){'port_9223_status: free';exit};
      $p=Get-Process -Id $c.OwningProcess -ErrorAction 0;
      if(!$p){'port_9223_status: check_error';exit};
      if($p.ProcessName-eq'electron'){'port_9223_status: occupied_by_vcpchat'}
      else{'port_9223_status: occupied_by_other'}
    platform: Windows
    max_calls: 1
    run_condition: only if 9222 is occupied by a non-VCPChat process
    classification: read_only

  total_max_calls: 2
  max_calls_if_9222_free: 1
  max_calls_if_9222_occupied: 2
```

## 4. Authorization

```yaml
authorization:
  authorized_by_this_document: false
  user_explicit_authorization_required: true
  user_authorization_phrase: "批准 v7.70 端口检测"

  pre_execution_conditions:
    - condition: user_explicitly_authorizes_port_check
      required: true
      status: false
    - condition: primary_command_locked
      required: true
      status: true
    - condition: fallback_command_locked
      required: true
      status: true
    - condition: max_calls_confirmed
      required: true
      status: true
    - condition: no_electron_launch
      required: true
      status: true
    - condition: no_remote_debug
      required: true
      status: true
    - condition: no_cdp
      required: true
      status: true
    - condition: no_bridge_call
      required: true
      status: true
    - condition: no_cancel_call
      required: true
      status: true
```

## 5. Reporting Policy

```yaml
reporting:
  raw_command_output: false
  redacted_summary_only: true

  allowed_report_fields:
    - port_9222_status (free / occupied_by_vcpchat / occupied_by_other / check_error)
    - port_9223_status (free / occupied_by_vcpchat / occupied_by_other / check_error)
    - total_commands_executed (1 or 2)
    - selected_port_if_9222_free
    - redacted_owning_process_name
    - redacted_owning_process_id
```

## 6. Abort Conditions

```yaml
abort_conditions:
  - more_than_2_commands_executed
  - electron_started_during_execution
  - remote_debug_started_during_execution
  - cdp_connected_during_execution
  - bridge_called_during_execution
  - cancel_called_during_execution
  - loadSession_called_during_execution
  - previewDraft_called_during_execution
  - submitDraft_called_during_execution
  - any_file_written_during_execution
  - any_DailyNote_written_during_execution
  - any_VCP_memory_written_during_execution
  - any_MCP_call_during_execution
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
