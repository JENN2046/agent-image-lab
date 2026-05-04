# v0.6 Real Plugin Manifest Sanitized Review

本文记录一次已获用户授权的单一真实生图插件 manifest 只读脱敏审查。记录只保存中文脱敏摘要、风险分类和状态结论，不保存 raw manifest 原文、密钥、token、cookie、密码、endpoint 原文、私密路径、客户隐私、运行日志或真实插件输出。

## 授权摘要

```yaml
authorization_scope:
  phase: v0.6
  candidate_id: DoubaoGen
  target_manifest_ref: user_authorized_single_vcptoolbox_plugin_manifest
  read_method: read_only
  single_manifest_only: true
  repository_wide_scan_allowed: false
  real_execution_authorized: false
```

## 读取范围

```yaml
source_scope:
  single_manifest_read_performed: true
  repository_wide_scan_performed: false
  vcpchat_read_performed: false
  runtime_data_read_performed: false
  config_env_read_performed: false
  plugin_execution_performed: false
  api_call_performed: false
  file_write_performed: false
  daily_note_write_performed: false
  image_file_created: false
```

## 中文脱敏审查摘要

```yaml
sanitized_review:
  plugin_display_name_summary_cn: "候选为 VCPToolBox 中一个图像生成类插件；本记录仅使用候选 ID，不保存显示名原文。"
  command_summary_cn: "manifest 声明 1 个图像生成类调用命令，语义为根据受控输入生成图像；未保存命令描述原文。"
  input_output_summary_cn: "输入模式提及提示词、分辨率、种子以及图像相关字段；输出模式提及图像引用类结果。manifest 文本中存在二进制或内联图像相关字样，后续必须由 Gatekeeper 确认真实执行时不得把图片二进制写入 Git 或长期记忆。"
  permission_risk_cn: "manifest 声明同步 stdio 进程入口和超时；配置 schema 中存在凭据类配置声明和服务地址类配置声明，但本记录未复制字段名、值或 endpoint 原文。"
  gatekeeper_notes_cn: "进入任何 dry-run 或真实执行前，必须复查凭据注入方式、服务地址脱敏、输出目录、图片二进制禁止写入长期记忆、最大调用次数和回滚方案。"
  sanitized_review_summary_cn: "本轮只完成单一 manifest 的只读脱敏审查，可进入后续 dry-run 评估规划；不代表插件已选择、已调用、已测试或可真实执行。"
```

## 安全结果

```yaml
safety_result:
  raw_manifest_saved: false
  raw_manifest_copied: false
  secret_value_copied: false
  credential_field_name_copied: false
  endpoint_raw_copied: false
  private_path_copied: false
  customer_private_data_copied: false
  runtime_log_copied: false
  real_plugin_output_copied: false
  image_binary_copied: false
  credential_like_config_declaration_observed: true
  endpoint_like_config_declaration_observed: true
  raw_url_like_reference_observed: true
  private_path_like_reference_observed: false
```

## 状态结论

```yaml
state_decision:
  previous_state: pending_manifest_review
  next_state: manifest_reviewed_safe
  allowed_next_step: dry_run_evaluation_planning
  real_execution_allowed: false
  plugin_selected_for_real_execution: false
  dry_run_completed: false
  tested: false
  decision_reason_cn: "manifest 可用中文脱敏摘要表达，未复制敏感原文；仍需 Gatekeeper 和 Review Console 在后续阶段复查真实执行边界。"
```

## No-Execution Guard

```yaml
no_execution_guard:
  selected_plugin: null
  max_plugin_calls: 0
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  file_write_performed: false
  image_file_created: false
  real_execution_allowed: false
```

## 下一步边界

v0.6 只允许把候选从 `pending_manifest_review` 推进到 `manifest_reviewed_safe`。进入 v0.7 前必须重新获得授权，且授权必须明确真实插件、最大调用次数、输入引用、输出目录、回滚方案、Gatekeeper 风险边界和 Review Console 人工审批结果。
