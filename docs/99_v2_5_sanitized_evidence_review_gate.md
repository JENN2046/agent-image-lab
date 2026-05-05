# 99 v2.5 Sanitized Evidence Review Gate

本文定义 Agent Image Lab v2.5 第二阶段的“脱敏证据人工复核门”。该阶段只创建未来 sanitized evidence 的人工复核记录形态，不读取真实 VCPChat，不读取真实 VCPToolBox，不接收真实源码，不保存真实路径，不保存真实读取命令，不复制 raw source，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Review Gate Decision

```yaml
v2_5_sanitized_evidence_review_gate:
  status: sanitized_evidence_review_gate_template_only
  sanitized_evidence_review_required: true
  sanitized_evidence_review_requested: false
  sanitized_evidence_review_passed: false
  sanitized_evidence_summary_exists: false
  evidence_packet_created: false
  raw_evidence_retained: false
  raw_source_retained: false
  implementation_authorized: false
  memory_write_authorized: false
  daily_note_write_authorized: false
  real_execution_allowed: false
```

## Goal

本阶段把 v2.5 Patch 01 的“post-read 脱敏与证据处理链”推进到“脱敏证据人工复核门”。它用于未来确认：

- sanitized evidence 是否存在。
- sanitized evidence 是否仍不包含 raw source、真实路径、真实命令、endpoint 原文或客户隐私。
- evidence 风险标签是否足够支持人工判断。
- 是否应该拒绝、要求重新脱敏、进入设计讨论，或进入后续实现授权。
- 脱敏证据复核通过也不等于实现授权、记忆写入授权或 DailyNote 写入授权。

本阶段只补齐人工复核门模板，不处理真实 evidence，不批准实现，不写记忆。

## Non-goals

本阶段不做以下事项：

- 不读取真实 VCPChat。
- 不读取真实 VCPToolBox。
- 不保存真实 VCPChat 根目录。
- 不保存真实 allowlist 路径。
- 不保存真实读取命令、shell 片段或脚本内容。
- 不复制 raw source、完整函数体、配置原文、日志原文或 IPC payload 原文。
- 不读取 `.env`、`config.env`、credential、密钥文件或客户数据。
- 不修改 VCPChat 或 VCPToolBox。
- 不创建 IPC handler、preload、renderer 或 Adapter 执行入口。
- 不调用插件、API、DailyNote 或 VCP 记忆。
- 不创建图片文件。

## Required Review Inputs

```yaml
required_review_inputs:
  post_read_sanitization_chain_exists: true
  sanitized_evidence_summary_exists: false
  sanitized_evidence_review_required: true
  sanitized_evidence_review_requested: false
  sanitized_evidence_review_passed: false
  evidence_reviewer: null
  evidence_reviewed_at: null
  raw_evidence_retained: false
  raw_source_retained: false
```

本阶段样例仍保持没有 sanitized evidence、没有 evidence packet、没有人工复核通过。

## Review Gate Record Shape

```yaml
sanitized_evidence_review_gate:
  review_gate_id: string
  chain_id: string
  sanitized_evidence_review_required: true
  sanitized_evidence_review_requested: false
  sanitized_evidence_review_passed: false
  sanitized_evidence_summary_exists: false
  evidence_reviewer: null
  evidence_reviewed_at: null
  review_result: pending
  raw_evidence_retained: false
  raw_source_retained: false
  audit_summary_cn: string
```

`chain_id` 只能引用脱敏证据处理链记录，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Review Checks

未来脱敏证据人工复核前必须确认：

- sanitized evidence 不包含 raw source。
- sanitized evidence 不包含完整函数体或源码片段。
- sanitized evidence 不包含真实路径、真实命令、endpoint 原文或环境变量值。
- sanitized evidence 不包含 credential、密钥、token、cookie、密码或客户隐私。
- sanitized evidence 不包含 runtime log、IPC payload 或插件输出原文。
- 风险标签和中文摘要足以支持人类复核。
- 复核结果不得自动触发实现、DailyNote、VCP 记忆或资产写入。

## Review Outcomes

允许的复核结果：

- `pending`
- `reject_sensitive_content`
- `request_resanitization`
- `approve_for_design_discussion`
- `request_implementation_authorization`
- `request_memory_handoff_authorization`

当前样例必须保持 `pending`。

## Rejection Conditions

必须拒绝以下 review gate 记录：

- raw source、完整函数体或源码片段被写入仓库。
- 真实路径、真实读取命令或 endpoint 原文被写入仓库。
- 环境变量值、credential、密钥文件、token、cookie、密码或客户隐私进入任何摘要。
- runtime log、IPC payload 或插件输出以原文方式保留。
- 脱敏摘要包含足以还原私密路径、命令或客户信息的细节。
- review gate 暗示已经允许实现、写记忆、写 DailyNote 或写资产。

## Acceptance

- sanitized evidence review gate 文档存在。
- sanitized evidence review gate contract 存在。
- sanitized evidence review gate 样例存在。
- validation checklist 包含 v2.5 sanitized evidence review gate 检查项。
- 样例保持 `sanitized_evidence_review_requested=false`。
- 样例保持 `sanitized_evidence_review_passed=false`。
- 样例保持 `sanitized_evidence_summary_exists=false`。
- 样例保持 `evidence_packet_created=false`。
- 样例保持 `raw_evidence_retained=false`。
- 样例保持 `raw_source_retained=false`。
- 样例保持 `implementation_authorized=false`。
- 样例保持 `memory_write_authorized=false`。
- 样例保持 `daily_note_write_authorized=false`。
- 样例保持 `real_execution_allowed=false`。
- 样例不包含真实路径、真实读取命令、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_5_post_read_decision_routing
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - sanitized evidence review gate
    - manual review result
    - implementation boundary check
    - memory write boundary check
  forbidden_without_next_authorization:
    - write implementation code
    - create IPC handler
    - create preload code
    - call plugin
    - call API
    - call DailyNote
    - write VCP memory
    - store raw source
```

