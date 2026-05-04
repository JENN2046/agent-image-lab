# Codex Task 05 — Write Review Console Spec

## 目标

设计 ImageLab Review Console 审片台的 MVP 规格。只写产品规格、数据结构和 VCPChat 接入说明，不实现真实 UI。

## 工作范围

只允许修改项目根目录下：

```text
review_console/
docs/11_review_console_design.md
```

不得修改 `codex/00_MASTER_TASK.md`、VCPToolBox 或 VCPChat。

## MVP 必须设计

- 打开 `review_session`。
- 显示当前图片引用。
- 显示 AI 评分。
- 允许人工评分覆盖。
- 允许写中文评论。
- 允许选择资产状态。
- 显示中文 `memory_preview`。
- 允许批准、拒绝或要求修改记忆写入。
- 输出更新后的 `review_session`。
- 生成 `image_case` 草案。

## 安全规则

- `contextIsolation: true`
- `nodeIntegration: false`
- 不在 URL query 中传 key、token、私密路径。
- renderer 不直接调用 DailyNote。
- renderer 不直接写文件。
- 所有写入动作走 IPC handler。
- 必须校验 IPC sender。

## 不建议 MVP 做

多人审批、外部分享、完整图上绘制、像素级差异对比、overlay diff、批量审片、资产搜索、客户门户、自动邮件通知、复杂权限系统、真实插件执行按钮、DailyNote 自动无审批写入。

## Definition of Done

开发者能理解第一版审片台如何展示、评分、评论、审批和预览记忆，但不会误以为现在已经需要实现 UI。
