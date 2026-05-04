# v0.7 Real Execution Authorization Gate

本文是 Photo Studio OS 最小真实执行前的独立授权门。当前文件不是授权记录，不调用插件、不调用 API、不写 DailyNote、不写文件、不创建图片。

## 当前状态

```yaml
authorization_gate_status:
  phase: v0.7_real_execution_gate
  candidate_id: DoubaoGen
  gatekeeper_boundary_status: blocked_until_authorized
  review_console_approval_status: pending
  dry_run_rehearsal_status: completed_zero_call
  user_real_execution_authorized: false
  real_execution_allowed: false
```

## 必填授权字段

真实执行前，用户必须另发独立授权，至少包含：

```yaml
required_authorization_fields:
  selected_plugin_id: pending
  max_plugin_calls: pending
  input_reference: pending
  output_directory_ref: pending
  overwrite_existing_files_allowed: false
  rollback_plan: pending
  gatekeeper_approved: pending
  review_console_human_approved: pending
  daily_note_direct_write_allowed: false
  memory_delta_only: true
```

## 合格授权示例

```yaml
authorization_template:
  statement: "我授权 v0.7 Photo Studio OS 最小真实执行"
  selected_plugin_id: DoubaoGen
  max_plugin_calls: 1
  input_reference: "<受控输入引用，不含敏感原文>"
  output_directory_ref: "<受控输出目录引用>"
  overwrite_existing_files_allowed: false
  rollback_plan: "<明确回滚方案>"
  gatekeeper_approved: true
  review_console_human_approved: true
  daily_note_direct_write_allowed: false
  memory_delta_only: true
```

## 拒绝规则

以下任一情况出现时，不得执行：

- 授权没有明确写出 `selected_plugin_id`。
- `max_plugin_calls` 不是明确数字或大于 1。
- 输入引用、输出目录引用或回滚方案缺失。
- 允许覆盖已有文件。
- 允许直接写 DailyNote。
- 没有 Gatekeeper 和 Review Console 双审批。
- 包含密钥、token、cookie、密码、私密路径或客户隐私原文。

## 当前结论

```yaml
authorization_gate_decision:
  status: waiting_for_explicit_user_authorization
  real_execution_allowed: false
  selected_plugin_for_execution: null
  max_plugin_calls_authorized: 0
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  file_write_performed: false
  image_file_created: false
```
