# Task Panel Product Spec

本文定义 v1.5 Task Panel Status Backbone。Task Panel 只展示任务状态、审查状态、记忆状态、风险状态和下一授权点，不触发插件、API、DailyNote、文件写入或图片创建。

## Goal

Task Panel 是 Agent Image Lab 的状态总览层。它把现有 `task_envelope`、`dispatch_plan`、Review Console 草案、memory handoff、多插件候选评估和 Gatekeeper 风险信息汇总成一个只读状态对象，帮助人工判断下一步应该授权什么。

## Panels

### Task Status

- 任务 ID。
- 案例 ID。
- 当前阶段。
- 当前负责人或来源 Agent。
- 用户目标中文摘要。

### Dispatch Status

- dispatch plan 是否存在。
- 是否 dry-run only。
- 是否禁止真实执行。
- `max_plugin_calls` 是否为 0。
- 是否仍需人工审批。

### Review Status

- Review Console 草案是否存在。
- AI 评分是否仅为建议。
- human review 是否覆盖 AI review。
- 是否存在人工 approved。
- 未 approved 时是否禁止正式 accepted。

### Memory Status

- memory_delta 草案是否存在。
- `write_mode`。
- `approval_status`。
- 是否仍保持 DailyNote no-write。
- 是否需要 Archivist_Agent / ImageLab_Master 复查。

### Asset Status

- 资产引用。
- SHA256 是否存在。
- 资产状态。
- 人工审批状态。
- 是否只保存路径引用，不保存图片二进制。

### Plugin Candidate Status

- 候选插件数量。
- 是否有 manifest 授权。
- 是否读取真实 manifest。
- 是否处于 `pending_manifest_review`。
- 是否仍保持不选择真实插件。

### Gatekeeper Status

- 风险等级。
- 风险中文摘要。
- 是否阻止执行。
- 是否需要独立授权。

### Next Authorization Point

- 下一授权动作名称。
- 授权前必须满足的条件。
- 授权后允许进入的下一状态。
- 当前禁止动作。

## Hard Boundaries

- Task Panel 不实现真实 UI。
- Task Panel 不修改真实 VCPChat。
- Task Panel 不修改真实 VCPToolBox。
- Task Panel 不调用插件。
- Task Panel 不调用 API。
- Task Panel 不调用 DailyNote。
- Task Panel 不写文件。
- Task Panel 不创建图片。
- Task Panel 不读取真实 manifest。
- Task Panel 不保存密钥、token、cookie、密码、endpoint 原文、私密路径、客户隐私、raw manifest 或 raw 插件输出。

## Output Shape

Task Panel 输出一个 `task_panel_state` 草案。该草案只用于人工审查和未来 UI 显示，不代表任何真实执行。

```yaml
task_panel_state:
  panel_id: string
  task_status: map
  dispatch_status: map
  review_status: map
  memory_status: map
  asset_status: map
  plugin_candidate_status: map
  gatekeeper_status: map
  next_authorization_point: map
  no_execution_guard: map
```

## Acceptance

- 能从现有样例映射出完整状态总览。
- 能明确展示下一授权点。
- 能明确展示禁止动作。
- 所有正文说明为中文或中文为主。
- no-execution guard 全部保持 false / 0 / blocked。
- 不新增真实运行入口。
