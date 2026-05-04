# 11 ImageLab Review Console 设计

## 目的

ImageLab Review Console 是运行在 VCPChat 子窗口体系里的审片台，用于图片评审、人工审批、评论批注、资产入库和 VCP 记忆写入审批。

## MVP 功能范围

- 打开 `review_session`。
- 展示图片引用或占位路径，不加载真实大文件。
- 展示 AI 评分与分项说明。
- 允许人工评分覆盖 AI 评分。
- 允许中文文本评论。
- 选择资产状态：`accepted`、`candidate`、`rejected`、`changes_required`。
- 展示中文 `memory_preview`。
- 批准、拒绝或要求修改记忆写入。
- 输出更新后的 `review_session`。
- 生成 `image_case` 草案。

## 页面区域

```text
顶部：任务信息 / 当前状态
左侧：图片预览 / 版本列表
中间：AI 评分 / 人工评分 / 评论
右侧：审批动作 / 记忆写入预览
底部：下一轮迭代建议 / 操作日志
```

## 用户流程

1. 用户打开待审任务。
2. Review Console 读取 `review_session`。
3. 用户查看 AI 评分和图片版本。
4. 用户填写人工评分与中文评论。
5. 用户选择归档动作或要求继续迭代。
6. 用户查看并编辑中文 `memory_preview`。
7. 用户批准、拒绝或要求修改记忆写入。
8. 系统输出更新后的 `review_session`、`image_case` 和 `memory_delta` 状态。

## AI 评分与人工评分关系

- 人工评分覆盖 AI 评分。
- 人工审批覆盖 Agent 建议。
- 人工评论优先于自动摘要。
- 如果人工评分存在，最终分数采用人工评分。

## 评论模型

MVP 只做文本评论和区域标签。评论至少包含作者、目标区域、严重程度、中文评论、状态和创建时间。不做复杂坐标绘制。

## 记忆写入预览

记忆预览必须展示：

- 目标记忆本。
- 中文日记标题。
- 中文日记正文。
- 原始英文提示词及中文解释。
- 标签。
- 安全检查。
- 审批状态。

## 审批动作

- `approve_archive`
- `reject_archive`
- `mark_candidate`
- `request_iteration`
- `approve_memory_write`
- `reject_memory_write`
- `request_memory_edit`
- `mark_style_rule_candidate`

## v0.7 真实执行前审批边界

v0.7 前置包要求 Review Console 展示 Gatekeeper 风险边界、候选 manifest 脱敏摘要、最大调用次数、输入引用、输出目录引用、回滚方案和停止条件。当前阶段只定义审批记录，不实现真实执行按钮。

默认状态必须保持：

- `execution_approval_status=pending`
- `real_execution_allowed=false`
- `selected_plugin_for_execution=null`
- `max_plugin_calls_authorized=0`
- `daily_note_called=false`

没有新的用户真实执行授权前，Review Console 不得调用插件、API、DailyNote 或保存图片。

## VCPChat 接入说明

未来可在 VCPChat 中新增或改造：

- `VCPChat/ImageLabmodules/review.html`
- `VCPChat/ImageLabmodules/review.js`
- `VCPChat/ImageLabmodules/review.css`
- `VCPChat/modules/ipc/imageLabReviewHandlers.js`

本 MVP 不修改 VCPChat。Phase 2 的 `review_console/static_prototype/` 只是隔离静态原型，不是 VCPChat 子窗口实现。Phase 3 只写接入设计和迁移清单，不创建真实 IPC handler。

未来子窗口只能接收受控 `review_session` 草案对象，并返回 `review_session_draft`、`image_case_draft`、`memory_delta_draft`。renderer 不得直接保存、入库、写 DailyNote、调用 VCP 插件或写磁盘资产。

## 安全边界

- `contextIsolation: true`。
- `nodeIntegration: false`。
- 不在 URL query 中传 key、token、私密路径。
- 不在 URL query、hash 或窗口标题中传 cookie、密码、客户隐私。
- renderer 不直接调用 DailyNote。
- renderer 不直接写文件。
- renderer 不直接调用 VCP 插件。
- renderer 不发起外部 API 请求。
- 所有写入动作走 IPC handler。
- 必须校验 IPC sender。
- IPC handler 返回错误时只返回脱敏中文摘要。

## 不建议 MVP 做的功能

多人审批、外部分享、复杂图上绘制、像素级对比、overlay diff、批量审片、资产搜索、客户门户、自动邮件通知、复杂权限系统、真实插件执行按钮、DailyNote 自动无审批写入。
