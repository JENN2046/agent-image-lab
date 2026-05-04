# VCP 工具请求示例

以下内容是示例仅用于格式说明，不代表真实执行，不含真实插件调用，不含密钥。

## dry-run 请求示例

```text
<<<[TOOL_REQUEST]>>>
tool_name:「始」AgentImageLabAdapter「末」,
command:「始」dry_run「末」,
task_id:「始」task-photo-studio-os-001「末」,
mode:「始」dry_run「末」
<<<[END_TOOL_REQUEST]>>>
```

## dry-run 请求载荷示例

```yaml
task_id: task-photo-studio-os-001
project: Photo Studio OS
task_type: photo_studio_os_review
mode: dry_run
prompt_package_ref: prompt-package-photo-studio-os-001
dry_run_controls:
  max_plugin_calls: 0
  allow_external_api: false
  allow_file_write: false
  allow_image_binary: false
  expected_command: dry_run
  execution_mode_allowed: false
approval_context:
  gatekeeper_required: true
  review_console_required: true
  human_approval_required_before_execution: true
  daily_note_direct_write_allowed: false
safety:
  contains_secret: false
  contains_private_path: false
  contains_customer_private_data: false
  contains_image_binary: false
```

## dry-run 返回示例

```yaml
dispatch_id: dispatch-photo-studio-os-001
task_id: task-photo-studio-os-001
mode: dry_run
selected_plugin: null
fallback_plugins: []
capability_matrix_status: placeholder
reason_cn: "MVP 阶段不选择真实插件，只返回 dry-run 调度草案。"
dry_run_required: true
approval_required: true
risk_level: medium
expected_outputs: 0
max_outputs: 0
overwrite_allowed: false
external_api_allowed: false
execution_blocked: true
gatekeeper_required: true
review_console_required: true
allow_file_write: false
allow_image_binary: false
max_plugin_calls: 0
preflight_result:
  status: pass
  checked_mode: dry_run
  checked_max_plugin_calls: 0
  checked_external_api_allowed: false
  checked_file_write_allowed: false
  checked_image_binary_allowed: false
  rejection_reason_cn: null
gatekeeper_handoff:
  required: true
  risk_summary_cn: "本次仅为 dry-run 草案，真实执行被阻止。"
  blocked_actions:
    - execute
    - generate
    - run
    - call_plugin
    - write_memory
    - write_image_file
review_console_handoff:
  required: true
  purpose_cn: "展示 dry-run 风险结论和人工审批入口。"
rollback_plan:
  dry_run_reversible: true
  rollback_action_cn: "丢弃当前 dispatch_plan 草案，回到上一份草案。"
  external_rollback_required: false
audit_record:
  audit_id: audit-photo-studio-os-001
  audit_summary_cn: "仅生成 dry-run 调度草案，未调用插件、API、DailyNote 或文件写入。"
  contains_sensitive_original: false
```

## 示例边界

- 示例仅用于格式说明。
- 不代表真实执行。
- 不含真实插件调用。
- 不含密钥。
- 不含 API key、token、cookie、密码或私密路径。
- 不包含客户隐私。
- 不会创建真实图片文件。
- 不会写入 VCP 记忆。
- Review Console 只能审批草案，不触发真实执行。
- Gatekeeper 只接收 dry-run 风险摘要，不接收敏感原文。

## 禁止示例

以下命令不得出现在 MVP-A 工具请求中：

```text
execute
generate
run
call_plugin
write_memory
```

## 未来执行前提

真实执行必须另开任务，并经过 Gatekeeper dry-run、Review Console 审批、插件 manifest 人工复查、回滚方案确认和执行审计。MVP-A 阶段 `external_api_allowed=false` 且 `execution_blocked=true`。

## Phase 4 no-execution 验收

- 请求中 `mode=dry_run`。
- 请求中 `dry_run_controls.max_plugin_calls=0`。
- 返回中 `selected_plugin=null`。
- 返回中 `execution_blocked=true`。
- 返回中 `external_api_allowed=false`。
- 返回中 `allow_file_write=false`。
- 返回中 `allow_image_binary=false`。
- 返回中 `rollback_plan.external_rollback_required=false`。
- 返回中 `audit_record.contains_sensitive_original=false`。
