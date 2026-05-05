# Plugin Performance Score Policy

本文定义 v1.7 插件表现评分口径。当前阶段只建立评分 schema、policy 和样例，不新增真实执行，不读取真实 VCPToolBox / VCPChat，不调用插件、API 或 DailyNote。

## Purpose

Plugin Performance Score 用于把候选插件的表现记录成可审查的中文脱敏摘要：

- 成功率。
- 视觉偏差类型。
- 失败类型。
- 可控性。
- 稳定性。
- 权限风险。
- Gatekeeper 备注。
- 人工验收结果。

## State Rules

- `tested` 不等于真实执行授权。
- `dry_run_checked` 不等于真实执行授权。
- `manifest_reviewed_safe` 不等于 dry-run 已完成。
- 真实执行必须再次单独授权，并限定插件、命令、模型、调用次数、输入引用、输出目录和回滚方案。
- 没有人工复核和 Gatekeeper 审查时，不得把一次失败写成长期插件结论。

## Sensitive Boundary

评分记录不得保存：

- raw 插件输出。
- endpoint 原文。
- API key、token、cookie、密码。
- 私密路径。
- 客户隐私或客户未公开信息。
- runtime log 原文。
- 图片二进制。

允许保存：

- 中文脱敏显示名摘要。
- 中文命令摘要。
- 中文输入输出模式摘要。
- 中文风险摘要。
- 记录 ID 或占位引用。
- SHA256 或资产索引引用，但不保存图片二进制。

## Score Interpretation

| 字段 | 说明 | 注意 |
| --- | --- | --- |
| `success_rate_status` | 成功率是否已测量 | 未授权执行时只能是 `unknown` 或 `not_measured` |
| `visual_deviation_types_cn` | 视觉偏差类型 | 必须是中文摘要 |
| `failure_types_cn` | 失败类型 | 不得复制 raw 错误或凭据片段 |
| `permission_risk_level` | 权限风险等级 | high / blocked 时不得推进真实执行 |
| `accepted_by_human` | 人工接受结果 | 不等于插件可自动执行 |

## Acceptance

- 评分记录包含 no-sensitive-storage guard。
- 评分记录包含 no-execution guard。
- 所有说明正文为中文或中文为主。
- 不把 `tested`、`accepted_by_human` 或 `dry_run_checked` 解释为真实执行授权。
- 不修改真实插件能力矩阵的当前真实状态，除非另有单独授权。
