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

## Required Rules

- manifest 脱敏审查必须先于 dry-run 结论。
- 每个真实 manifest 读取都必须单独授权。
- 只保存中文脱敏摘要，不保存 raw manifest、endpoint 原文、密钥、私密路径或客户隐私。
- 多插件候选矩阵不得自动选择真实插件。
- Review Console 只能标记候选、拒绝候选、请求 manifest 授权、请求 Gatekeeper 复查或请求记忆修改。

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

