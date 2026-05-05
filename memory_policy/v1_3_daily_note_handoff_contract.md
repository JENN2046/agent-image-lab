# v1.3 DailyNote / VCP Memory Handoff Contract

本文定义 v1.3 DailyNote / VCP Memory Handoff 的前置设计。当前阶段不执行 DailyNote 写入，不写 VCP 长期记忆，只补齐审批链、写入申请样例、回滚记录和拒绝边界。

## Handoff Flow

```text
memory_delta
→ 权限检查
→ Review Console 审批
→ Archivist_Agent 复查
→ ImageLab_Master 复核
→ DailyNote 写入前授权
→ 写入执行审计
```

## Required Invariants

- `final_decision.should_write_to_vcp=true` 只表示写入申请已批准，不表示已经写入。
- `write_mode=confirmed` 只表示满足审批不变量，不代表调用 DailyNote。
- 真正 DailyNote 写入必须有独立授权、执行记录和失败回滚记录。
- `daily_note_called=false` 必须保持到真实写入授权点。
- `actual_write_performed=false` 必须保持到真实写入授权点。
- 图片二进制永不进入 Git、DailyNote 或 VCP 长期记忆。
- 敏感内容只能保留中文脱敏拒绝摘要和安全标记。

## Approval Chain

```yaml
approval_chain:
  review_console:
    role: human_review_and_memory_preview_approval
    required: true
  archivist_agent:
    role: archive_and_style_memory_safety_review
    required: true
  imagelab_master:
    role: final_project_memory_gate
    required: true
  daily_note_write_authorization:
    role: separate_explicit_user_authorization
    required: true
```

## Record Set

v1.3 至少需要保留以下记录形态。它们都只能作为草案、审批记录或审计占位，不代表 DailyNote 已经写入。

| record | 用途 | 必须保持 |
| --- | --- | --- |
| `memory_write_request` | 从 `memory_delta` 生成写入申请 | `actual_write_performed=false` |
| `review_console_approval_record` | 人工确认中文正文和安全摘要 | 未 approved 时不得进入后续复查 |
| `archivist_review_record` | 复查归档价值、风格记忆污染和图片二进制风险 | 不复制敏感原文 |
| `imagelab_master_review_record` | 项目级最终记忆门控 | 不直接调用 DailyNote |
| `daily_note_write_preflight` | 未来真实写入前的独立授权检查 | `daily_note_write_authorized=false`，直到用户单独授权 |
| `write_execution_audit_stub` | 真实写入执行审计的占位模板 | `daily_note_called=false`、`actual_write_performed=false` |
| `rollback_or_revoke_plan` | 写入失败或撤销时的回滚说明 | 当前只保留撤销路径 |
| `rejection_audit_record` | 敏感或不合规内容的拒绝摘要 | 只保留中文脱敏原因 |

## No-write Guard

任何 v1.3 样例和审计记录都必须保留：

```yaml
daily_note_write_authorized: false
daily_note_called: false
vcp_memory_written: false
actual_write_performed: false
image_binary_saved_to_memory: false
raw_sensitive_content_saved: false
```

如果未来用户单独授权真实写入，必须生成新的执行记录，且不能复用本阶段的 no-write 样例作为执行证明。

## Rejection Boundary

必须拒绝写入长期记忆的情况：

- 出现密钥、token、cookie、密码。
- 出现私密路径、endpoint 原文、客户隐私或客户未公开信息。
- 需要保存 raw 插件输出或运行日志。
- 需要把图片二进制写入记忆。
- 审批链缺少人工审批人、审批时间或中文正文。

拒绝原因必须脱敏，例如：

```text
本条记忆因涉及敏感配置风险被拒绝写入，仅保留安全审计摘要。
```
