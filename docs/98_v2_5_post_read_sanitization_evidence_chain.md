# 98 v2.5 Post-read Sanitization and Evidence Chain

本文定义 Agent Image Lab v2.5 第一阶段的“真实 VCPChat 一次性读取后的脱敏与证据处理链”。该阶段只创建未来 post-read 处理的记录形态，不读取真实 VCPChat，不读取真实 VCPToolBox，不接收真实源码，不保存真实路径，不保存真实读取命令，不复制 raw source，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Sanitization Chain Decision

```yaml
v2_5_post_read_sanitization_evidence_chain:
  status: post_read_sanitization_chain_template_only
  post_read_sanitization_required: true
  post_read_sanitization_requested: false
  post_read_sanitization_performed: false
  evidence_packet_created: false
  sanitized_evidence_summary_created: false
  raw_evidence_retained: false
  raw_source_retained: false
  source_read_performed: false
  real_vcpchat_source_read: false
  real_execution_allowed: false
```

## Goal

本阶段把 v2.4 的“真实读取运行前 dry-run readiness”之后的处理链补齐。它用于未来确认：

- 读取后的任何材料必须先进入脱敏处理。
- Git 中不得保存 raw source、真实路径、真实命令、endpoint 原文或 runtime log 原文。
- evidence 只能形成脱敏摘要、字段级风险标记和人工复核结论。
- 任何脱敏摘要都不能直接触发实现、记忆写入、DailyNote 写入或资产写入。
- 读取失败、拒绝、越界或敏感命中都必须只保留中文脱敏审计摘要。

本阶段只补齐 post-read 脱敏与证据处理模板，不处理真实 evidence，不批准真实读取，不执行读取命令。

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

## Required Chain Inputs

```yaml
required_chain_inputs:
  real_read_run_record_exists: false
  post_read_sanitization_required: true
  post_read_sanitization_requested: false
  post_read_sanitization_performed: false
  evidence_packet_created: false
  sanitized_evidence_summary_created: false
  raw_evidence_retained: false
  raw_source_retained: false
  source_read_performed: false
  real_vcpchat_source_read: false
```

本阶段样例仍保持未读取、未接收 evidence、未脱敏、未创建证据包。

## Evidence Chain Record Shape

```yaml
post_read_sanitization_evidence_chain:
  chain_id: string
  read_run_id: null
  post_read_sanitization_required: true
  post_read_sanitization_requested: false
  post_read_sanitization_performed: false
  evidence_packet_created: false
  sanitized_evidence_summary_created: false
  raw_evidence_retained: false
  raw_source_retained: false
  source_read_performed: false
  real_vcpchat_source_read: false
  audit_summary_cn: string
```

`read_run_id` 在当前模板中必须为 `null`。未来若存在真实读取记录，也只能引用脱敏运行记录，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Sanitization Rules

未来 post-read 处理必须遵守：

- raw source 不进入 Git。
- raw source 不进入 memory_delta。
- raw source 不进入 DailyNote。
- raw source 不进入 Review Console 草案。
- raw source 不进入审计日志正文。
- 真实路径、endpoint、环境变量值、credential、密钥、客户隐私必须被拒绝或脱敏。
- 证据只允许保留中文脱敏摘要、风险标签、字段级发现计数和人工复核结论。
- 敏感命中时只保留拒绝摘要，不保留原文。
- 脱敏证据摘要不得直接触发实现或写入长期记忆。

## Evidence Categories

允许的脱敏证据类别：

- `sanitized_file_role_summary_cn`
- `sanitized_ipc_surface_summary_cn`
- `sanitized_window_boundary_summary_cn`
- `sanitized_security_note_cn`
- `risk_tag_list`
- `review_required_reason_cn`
- `rejection_summary_cn`
- `manual_review_result_cn`

禁止的证据类别：

- `raw_source_code`
- `complete_function_body`
- `real_local_path`
- `raw_read_command`
- `endpoint_raw_value`
- `env_value`
- `secret_raw_value`
- `customer_private_data`
- `raw_runtime_log`
- `raw_ipc_payload`
- `raw_plugin_output`
- `image_binary`

## Rejection Conditions

必须拒绝以下 evidence chain 记录：

- raw source、完整函数体或源码片段被写入仓库。
- 真实路径、真实读取命令或 endpoint 原文被写入仓库。
- 环境变量值、credential、密钥文件、token、cookie、密码或客户隐私进入任何摘要。
- runtime log、IPC payload 或插件输出以原文方式保留。
- 脱敏摘要包含足以还原私密路径、命令或客户信息的细节。
- evidence chain 暗示已经允许实现、写记忆、写 DailyNote 或写资产。

## Acceptance

- post-read sanitization and evidence chain 文档存在。
- post-read sanitization and evidence chain contract 存在。
- post-read sanitization and evidence chain 样例存在。
- validation checklist 包含 v2.5 post-read sanitization 检查项。
- 样例保持 `post_read_sanitization_requested=false`。
- 样例保持 `post_read_sanitization_performed=false`。
- 样例保持 `evidence_packet_created=false`。
- 样例保持 `sanitized_evidence_summary_created=false`。
- 样例保持 `raw_evidence_retained=false`。
- 样例保持 `raw_source_retained=false`。
- 样例保持 `source_read_performed=false`。
- 样例保持 `real_vcpchat_source_read=false`。
- 样例保持 `real_execution_allowed=false`。
- 样例不包含真实路径、真实读取命令、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_5_sanitized_evidence_review_gate
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - post-read sanitization evidence chain
    - sanitized evidence categories
    - manual safety review
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

