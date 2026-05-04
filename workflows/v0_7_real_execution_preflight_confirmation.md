# v0.7 Real Execution Preflight Confirmation

本文是 Photo Studio OS 最小真实执行前的最终确认表。当前文件不是执行授权，不调用插件、不调用 API、不写 DailyNote、不写文件、不创建图片。

## 当前默认状态

```yaml
current_preflight_status:
  phase: v0.7_preflight
  scenario: Photo Studio OS
  candidate_id: DoubaoGen
  adapter_dry_run_verified: true
  manifest_review_status: manifest_reviewed_safe
  gatekeeper_boundary_defined: true
  review_console_approval_status: pending
  real_execution_authorized: false
  max_plugin_calls_authorized: 0
```

## 真实执行前必须填写

真实执行前必须由用户单独授权并填写以下字段：

```yaml
required_user_authorization:
  selected_plugin_id: pending_user_confirmation
  max_plugin_calls: pending_user_confirmation
  input_reference: pending_user_confirmation
  output_directory_ref: pending_user_confirmation
  overwrite_existing_files_allowed: false
  external_api_allowed_for_selected_plugin: pending_user_confirmation
  image_file_creation_allowed: pending_user_confirmation
  daily_note_direct_write_allowed: false
  rollback_plan_ref: pending_user_confirmation
  stop_conditions_acknowledged: false
```

## 最小真实执行约束

```yaml
minimal_real_execution_constraints:
  one_plugin_only: true
  one_task_only: true
  review_console_human_approval_required: true
  gatekeeper_approval_required: true
  output_directory_must_be_controlled: true
  rollback_plan_required: true
  memory_delta_write_mode: draft
  daily_note_direct_write_allowed: false
  git_binary_asset_write_allowed: false
  vcp_long_term_memory_binary_write_allowed: false
```

## 停止条件

任一条件成立必须停止，不得真实执行：

- 用户没有再次明确授权真实执行。
- 最大调用次数不是明确数字。
- 输出目录引用不明确或可能覆盖现有文件。
- 输入引用包含密钥、token、cookie、密码、私密路径或客户隐私原文。
- 插件请求超出候选 manifest 审查边界。
- Gatekeeper 或 Review Console 任一方为 `rejected`。
- 需要直接写 DailyNote 或 VCP 长期记忆。
- 需要把图片二进制写入 Git、DailyNote 或长期记忆。

## 当前结论

```yaml
preflight_decision:
  status: waiting_for_user_real_execution_authorization
  real_execution_allowed: false
  selected_plugin_for_execution: null
  max_plugin_calls_authorized: 0
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  file_write_performed: false
  image_file_created: false
```

## 用户授权模板

未来进入真实执行时，用户必须另发一条独立授权，至少包含：

```yaml
我授权 v0.7 Photo Studio OS 最小真实执行:
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
