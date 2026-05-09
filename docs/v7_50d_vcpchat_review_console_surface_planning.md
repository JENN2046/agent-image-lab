# v7.50d VCPChat Review Console Surface Planning

## 1. Purpose

本文件定义未来 VCPChat / Review Console 如何以只读方式展示 Agent Image Lab 的 read-only bridge dry-run 结果。
本阶段只规划 UI surface，不启动 VCPChat，不调用 bridge，不执行真实 UI 检查。

## 2. Preconditions

```yaml
preconditions:
  v7_50a_local_schema_validation: passed
  v7_50b_mock_payload_validation: passed
  v7_50c_repository_local_dry_run: passed
  dry_run_type: repository_local_text_only_refs
  payload_type: text_only_refs
  returned_refs_only: true
  real_vcp_call_performed: false
  vcpchat_bridge_call_performed: false
  memory_write_performed: false
  dailynote_write_performed: false
  image_binary_read: false
```

## 3. Surface Goal

未来 Review Console 只显示：

- project state
- bridge dry-run status
- returned text-only refs
- safety gate result
- closed_no_memory_write case state
- next allowed steps
- hard stops

必须明确不显示：

- 图片二进制
- raw API payload
- secrets
- private absolute path
- DailyNote 写入结果
- VCP memory 写入结果
- production_approved 误判

## 4. Proposed Surface Layout

```yaml
surface_sections:
  - header_status_bar
  - bridge_dry_run_summary
  - returned_text_only_refs_panel
  - safety_gates_panel
  - closed_case_status_panel
  - forbidden_payloads_panel
  - next_allowed_steps_panel
  - hard_stops_panel
```

#### header_status_bar

- phase: v7.50d
- mode: planning_only
- source phase: v7.50c
- bridge_mode: read_only

#### bridge_dry_run_summary

- dry_run_type
- status
- payload_type
- returned_refs_only
- VCP call performed
- VCPChat bridge call performed

#### returned_text_only_refs_panel

- 只显示 ref 路径
- 不显示文件全文
- 不显示图片内容

#### safety_gates_panel

- 11/11 pass
- closed case checks 7/7 pass

#### closed_case_status_panel

- current_case_state: closed_no_memory_write
- memory_write_skipped: true
- daily_note_write_skipped: true

#### forbidden_payloads_panel

- image_binary
- raw_request_payload
- raw_response_payload
- secrets
- private_absolute_path

#### next_allowed_steps_panel

- v7.50d surface check execution only if explicitly authorized
- new production candidate only with new plan and A5

#### hard_stops_panel

- do_not_call_bridge_without_authorization
- do_not_write_memory
- do_not_read_image_binary
- do_not_reopen_closed_no_memory_write_case

## 5. Surface Non-goals

- 不执行 bridge
- 不调用 VCP
- 不调用 VCPChat bridge
- 不读取图片
- 不写 memory
- 不重开 closed_no_memory_write case
- 不判断 production_approved
- 不做真实 UI rendering

## 6. Future Execution Boundary

未来如果进入 v7.50d execution，只允许做 VCPChat review console surface check planning 或本地静态 surface fixture check。
真实 VCPChat bridge / Electron surface 必须独立授权。
