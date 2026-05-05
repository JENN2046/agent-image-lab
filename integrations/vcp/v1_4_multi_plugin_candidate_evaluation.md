# v1.4 Multi-plugin Candidate Evaluation

本文定义 v1.4 多插件候选评估路线。当前阶段只扩展候选矩阵、脱敏审查模板、Gatekeeper 风险分类和 Review Console 审批路径，不批量读取真实 VCPToolBox / VCPChat，不自动调用任何插件。

## State Flow

```text
discovered
→ pending_manifest_review
→ manifest_reviewed_safe / rejected
→ dry_run_planned
→ dry_run_checked
→ real_execution_authorization_required
```

`tested` 不等于真实执行授权。任何真实执行仍必须单独授权插件、命令、模型、调用次数、输入引用、输出目录和回滚方案。

## Candidate Matrix Fields

```yaml
candidate:
  candidate_id: string
  display_name_summary_cn: string
  source_ref_redacted: string
  manifest_status: discovered | pending_manifest_review | manifest_reviewed_safe | rejected
  dry_run_status: not_planned | dry_run_planned | dry_run_checked
  real_execution_status: not_authorized | real_execution_authorization_required
  capability_summary_cn: string
  permission_risk_cn: string
  gatekeeper_notes_cn: string
```

## Candidate Decision Packet

每个候选进入 Review Console 前，必须先形成一个只含脱敏摘要的 decision packet。该 packet 仍然不是真实执行授权。

```yaml
candidate_decision_packet:
  candidate_id: string
  manifest_authorization:
    read_authorization_required: true
    read_authorized: false
    read_performed: false
    raw_manifest_saved: false
  sanitized_review_template:
    display_name_summary_cn: string
    command_summary_cn: string
    input_output_summary_cn: string
    permission_risk_cn: string
    gatekeeper_notes_cn: string
  gatekeeper_risk_classification:
    risk_level: low | medium | high | blocked
    risk_reason_cn: string
    blocked_until_human_review: boolean
  performance_scoring_dimensions:
    visual_fit: pending | weak | acceptable | strong
    controllability: pending | weak | acceptable | strong
    failure_recovery: pending | weak | acceptable | strong
    safety_boundary: pending | weak | acceptable | strong
  review_console_handoff:
    allowed_actions:
      - mark_candidate
      - reject_candidate
      - request_manifest_authorization
      - request_gatekeeper_review
      - request_memory_edit
    forbidden_actions:
      - execute_plugin
      - call_api
      - write_daily_note
      - save_image
      - read_manifest_without_authorization
```

字段规则：

- `read_authorized=false` 时，`read_performed` 必须为 `false`。
- `raw_manifest_saved` 必须始终为 `false`。
- `risk_level=blocked` 时，不得进入 `dry_run_planned`。
- `performance_scoring_dimensions` 只能记录维度和待评估状态，不得伪造真实插件表现。
- Review Console 的任何审批动作只生成草案或授权请求，不触发读取、执行或写入。

## Gatekeeper Risk Levels

| risk_level | 含义 | 当前允许动作 |
| --- | --- | --- |
| `low` | 脱敏摘要未见敏感字段，但仍未执行 | 允许进入人工候选确认 |
| `medium` | 需要复核权限、输出目录、调用次数或输入资产边界 | 请求 Gatekeeper 复查 |
| `high` | 存在潜在凭据、endpoint、私密路径、客户隐私或图片二进制风险 | 保持 `pending_manifest_review` |
| `blocked` | 无法脱敏、来源未授权或审计链不完整 | 标记 rejected 或请求重新授权 |

## Performance Scoring Dimensions

这些维度只在未来完成授权审查后作为评分表使用。v1.4 当前不得据此填写真实分数。

| dimension | 说明 |
| --- | --- |
| `visual_fit` | 是否适合 Photo Studio OS、产品摄影或图像精修任务 |
| `controllability` | 提示词、输入资产和参数是否可控 |
| `failure_recovery` | 失败时是否有清晰错误、回滚和重试边界 |
| `safety_boundary` | 是否能维持密钥、endpoint、路径、客户隐私和图片二进制边界 |

## Required Rules

- manifest 脱敏审查必须先于 dry-run 结论。
- 每个真实 manifest 读取都必须单独授权。
- 只保存中文脱敏摘要，不保存 raw manifest、endpoint 原文、密钥、私密路径或客户隐私。
- 多插件候选矩阵不得自动选择真实插件。
- Review Console 只能标记候选、拒绝候选、请求 manifest 授权、请求 Gatekeeper 复查或请求记忆修改。
- `dry_run_planned` 只能在 `manifest_reviewed_safe` 后出现。
- `real_execution_authorization_required` 只表示未来需要再次授权，不表示可以执行。

## Review Console Candidate Actions

允许动作：

- `mark_candidate`
- `reject_candidate`
- `request_manifest_authorization`
- `request_gatekeeper_review`
- `request_memory_edit`

禁止动作：

- `execute_plugin`
- `call_api`
- `write_daily_note`
- `save_image`
- `read_manifest_without_authorization`

## Acceptance

- 没有批量读取真实 VCPToolBox / VCPChat。
- 没有自动调用任何插件。
- 能力矩阵只记录脱敏能力摘要和风险分类。
- `manifest_reviewed_safe` 不代表 dry-run 已完成。
- `dry_run_checked` 不代表真实执行已授权。
