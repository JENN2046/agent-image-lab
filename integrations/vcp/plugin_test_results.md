# Plugin Test Results

本文是未来单插件候选评估与 dry-run 实测记录模板。

当前没有真实插件测试结果。所有条目均为占位模板，不代表任何真实 VCP 插件能力，不调用插件，不调用 API，不生成图片。

## 当前状态

| 项目 | 状态 |
|---|---|
| 真实插件名称 | 未选择 |
| manifest 读取 | 未授权 |
| 能力矩阵状态 | 待实测 |
| dry-run 实测 | 未开始 |
| 真实插件调用 | 0 |
| 外部 API 调用 | 0 |
| 图片文件创建 | 0 |
| DailyNote 写入 | 0 |
| VCPToolBox 修改 | 无 |
| VCPChat 修改 | 无 |

## 记录规则

任何候选插件测试记录必须遵守：

- 不记录真实 API key、token、cookie、密码。
- 不记录私密路径。
- 不记录客户隐私或客户未公开信息。
- 不保存 manifest 原文中的敏感字段。
- 不保存图片二进制。
- 不把占位能力写成真实能力。
- 不把偶发失败写成长期插件结论。
- 不把 `Review Console approved` 理解为真实执行批准。
- 不把 `memory_approval.status=approved` 理解为已写 DailyNote。

## 候选插件评估表模板

| 字段 | 填写要求 |
|---|---|
| candidate_id | 占位 ID，例如 `candidate-plugin-001` |
| plugin_display_name | 可脱敏名称；未授权前写 `待确认插件` |
| manifest_review_status | `not_started` / `pending_manifest_review` / `rejected` / `approved_for_dry_run_only` |
| capability_status | `待实测` / `pending_manifest_review` / `dry_run_checked` / `tested` / `rejected` |
| task_type_fit_cn | 中文说明适合的任务类型；未实测时写 `待读取 manifest 后确认` |
| input_mode_observed | `unknown` / `text` / `image` / `text_image` |
| output_mode_observed | `unknown` / `image` / `plan` / `review` |
| risk_level | `low` / `medium` / `high` / `critical` |
| gatekeeper_required | 必须为 `true` |
| review_console_required | 必须为 `true` |
| max_plugin_calls_allowed_in_test | dry-run 阶段必须为 `0` |
| external_api_allowed_in_test | dry-run 阶段必须为 `false` |
| file_write_allowed_in_test | dry-run 阶段必须为 `false` |
| image_binary_allowed_in_test | dry-run 阶段必须为 `false` |
| rejection_reason_cn | 如拒绝，写中文脱敏原因 |

## Dry-run 实测记录模板

```yaml
test_record:
  test_id: test-placeholder-001
  test_date: YYYY-MM-DD
  tester_role: human_reviewer
  candidate_id: candidate-plugin-001
  plugin_display_name_cn: "待确认插件"
  manifest_review_status: not_started
  capability_status_before: "待实测"
  capability_status_after: "待实测"
  task_id: task-placeholder-001
  dispatch_id: dispatch-placeholder-001
  mode: dry_run
  selected_plugin: null
  max_plugin_calls_allowed: 0
  max_plugin_calls_observed: 0
  external_api_allowed: false
  external_api_observed: false
  file_write_allowed: false
  file_write_observed: false
  image_binary_allowed: false
  image_binary_observed: false
  daily_note_write_observed: false
  vcp_toolbox_modified: false
  vcpchat_modified: false
  contains_secret: false
  contains_private_path: false
  contains_customer_private_data: false
  gatekeeper_result:
    status: needs_review
    risk_summary_cn: "仅记录 dry-run 候选评估，未执行真实插件。"
  review_console_result:
    status: not_approved_for_execution
    human_review_required: true
    note_cn: "本记录只用于人工评估候选插件，不触发真实执行。"
  audit_summary_cn: "未调用插件、API、DailyNote 或文件写入；能力保持待实测。"
```

## 人工复查清单

- [ ] 是否确认本轮只做 dry-run 候选评估。
- [ ] 是否确认没有真实插件调用。
- [ ] 是否确认没有外部 API 调用。
- [ ] 是否确认没有文件写入。
- [ ] 是否确认没有图片文件创建。
- [ ] 是否确认没有 DailyNote 写入。
- [ ] 是否确认没有修改真实 VCPToolBox。
- [ ] 是否确认没有修改真实 VCPChat。
- [ ] 是否确认没有复制 manifest 敏感原文。
- [ ] 是否确认没有 API key、token、cookie、密码。
- [ ] 是否确认没有私密路径。
- [ ] 是否确认没有客户隐私。
- [ ] 是否确认能力矩阵仍为 `待实测` 或 `pending_manifest_review`。
- [ ] 是否确认所有审计摘要为中文脱敏摘要。
- [ ] 是否确认真实执行需要另开任务并再次授权。

## 能力矩阵更新规则

候选插件状态只能按以下顺序推进：

```text
待实测
→ pending_manifest_review
→ dry_run_checked
→ tested
```

任何阶段发现敏感信息、越界执行、真实调用、未授权写入或客户隐私泄露风险，必须改为：

```text
rejected
```

`tested` 只表示人工确认过测试结果，不自动表示允许真实执行。

## 当前占位记录

```yaml
test_record:
  test_id: test-photo-studio-os-placeholder-001
  test_date: "未开始"
  tester_role: "未指定"
  candidate_id: candidate-plugin-placeholder-001
  plugin_display_name_cn: "待确认插件"
  manifest_review_status: not_started
  capability_status_before: "待实测"
  capability_status_after: "待实测"
  mode: dry_run
  selected_plugin: null
  max_plugin_calls_observed: 0
  external_api_observed: false
  file_write_observed: false
  image_binary_observed: false
  daily_note_write_observed: false
  audit_summary_cn: "占位记录；尚未读取 manifest，尚未运行 dry-run，尚未调用任何插件。"
```

## 不变量

- 本文件不保存真实测试产物。
- 本文件不保存真实图片。
- 本文件不保存真实插件输出。
- 本文件不授权真实执行。
- 本文件不升级任何插件能力结论。
