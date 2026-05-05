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

