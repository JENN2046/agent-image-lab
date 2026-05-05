# Asset Index Policy

本文定义 v1.6 Asset Index 的记录边界。Asset Index 只记录资产引用和人工验收信息，不保存图片二进制，不保存 raw 插件输出，不代表真实插件执行授权。

## Purpose

Asset Index 用于长期追踪 Agent Image Lab 的图片资产状态：

- 资产路径引用或占位引用。
- SHA256。
- 评分。
- 状态。
- 人工审批。
- 已知视觉偏差。
- 关联 Review Console、image_case 和 memory_delta 草案。

## Allowed Fields

- `asset_id`
- `asset_ref`
- `asset_sha256`
- `asset_status`
- `source_case_id`
- `source_task_id`
- `review_session_id`
- `final_score`
- `human_approval`
- `known_visual_deviation_cn`
- `review_summary_cn`
- `memory_refs`
- `lineage_refs`
- `no_binary_guard`

## Hard Boundaries

- 不保存图片二进制。
- 不保存 raw 插件输出。
- 不保存 runtime log 原文。
- 不保存 endpoint 原文。
- 不保存 API key、token、cookie、密码。
- 不保存私密路径、客户隐私或客户未公开信息。
- 不把 `asset_status=accepted` 解释为插件可真实执行。
- 不把资产引用解释为图片文件已存在。

## Approval Rules

- `asset_status=accepted` 必须有 `human_approval.approved=true`。
- `asset_status=accepted` 必须有 `approved_by` 和 `approved_at`。
- AI 的 archive recommendation 不能替代人工审批。
- 未人工审批时，状态只能是 `draft`、`candidate` 或 `rejected`。

## SHA256 Rules

- `asset_sha256` 可以为空，表示当前只有占位引用或尚未读取资产文件。
- 如果未来记录真实 SHA256，只能记录哈希值，不记录图片二进制。
- 计算 SHA256 不等于授权读取敏感路径；读取真实资产仍必须遵守授权边界。

## Memory Boundary

- Asset Index 可以关联 `memory_delta` ID。
- Asset Index 不写 DailyNote。
- Asset Index 不写 VCP 长期记忆。
- 图片二进制永不进入 memory_delta、DailyNote 或 VCP 长期记忆。

## Acceptance

- 每条资产记录必须包含 no-binary guard。
- 每条资产记录必须说明是否有人工作为最终批准来源。
- 每条资产记录必须能回链到 task / case / review。
- 所有问题摘要和审批说明为中文或中文为主。
