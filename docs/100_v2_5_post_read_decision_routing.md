# 100 v2.5 Post-read Decision Routing

本文定义 Agent Image Lab v2.5 第三阶段的“读取后决策路由”。该阶段只创建未来 sanitized evidence 人工复核后的路由记录形态，不读取真实 VCPChat，不读取真实 VCPToolBox，不接收真实源码，不保存真实路径，不保存真实读取命令，不复制 raw source，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Routing Decision

```yaml
v2_5_post_read_decision_routing:
  status: post_read_decision_routing_template_only
  post_read_decision_routing_required: true
  post_read_decision_routing_requested: false
  post_read_decision_routing_performed: false
  sanitized_evidence_review_passed: false
  selected_route: pending
  implementation_authorized: false
  memory_handoff_authorized: false
  daily_note_write_authorized: false
  asset_write_authorized: false
  real_execution_allowed: false
```

## Goal

本阶段把 v2.5 Patch 02 的“脱敏证据人工复核门”推进到“post-read decision routing”。它用于未来确认：

- 脱敏证据人工复核结果如何进入下一步。
- 允许的下一步只能是“请求”某个授权，而不是直接执行。
- 拒绝、重新脱敏、设计讨论、实现授权请求、记忆交接授权请求必须清晰分流。
- 任何路由都不得自动写实现、写 DailyNote、写 VCP 记忆或写资产。
- 所有路由记录必须继续保持无 raw source、无真实路径、无真实命令、无客户隐私。

本阶段只补齐决策路由模板，不处理真实 evidence，不批准实现，不写记忆。

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

## Required Routing Inputs

```yaml
required_routing_inputs:
  sanitized_evidence_review_gate_exists: true
  sanitized_evidence_review_passed: false
  sanitized_evidence_review_result: pending
  post_read_decision_routing_required: true
  post_read_decision_routing_requested: false
  post_read_decision_routing_performed: false
  selected_route: pending
  routing_reviewer: null
  routed_at: null
```

本阶段样例仍保持脱敏证据未通过复核、未选择路由、未授权任何后续动作。

## Decision Routing Record Shape

```yaml
post_read_decision_routing:
  routing_id: string
  review_gate_id: string
  post_read_decision_routing_required: true
  post_read_decision_routing_requested: false
  post_read_decision_routing_performed: false
  selected_route: pending
  routing_reviewer: null
  routed_at: null
  implementation_authorized: false
  memory_handoff_authorized: false
  daily_note_write_authorized: false
  asset_write_authorized: false
  audit_summary_cn: string
```

`review_gate_id` 只能引用脱敏证据人工复核门记录，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Allowed Routes

允许的路由：

- `pending`
- `reject_sensitive_content`
- `request_resanitization`
- `approve_for_design_discussion`
- `request_implementation_authorization`
- `request_memory_handoff_authorization`
- `request_archive_rejection_record`

当前样例必须保持 `pending`。

## Routing Rules

未来决策路由必须遵守：

- `reject_sensitive_content` 只保留中文脱敏拒绝摘要。
- `request_resanitization` 只能返回脱敏链，不得保留 raw evidence。
- `approve_for_design_discussion` 只允许进入讨论，不允许实现。
- `request_implementation_authorization` 只表示请求后续实现授权，不等于授权实现。
- `request_memory_handoff_authorization` 只表示请求后续记忆交接授权，不等于写 DailyNote 或 VCP 记忆。
- `request_archive_rejection_record` 只允许写脱敏拒绝记录草案，不允许保存原文。
- 任何路由都不得自动触发插件、API、DailyNote、VCP 记忆、文件写入或资产写入。

## Rejection Conditions

必须拒绝以下 decision routing 记录：

- raw source、完整函数体或源码片段被写入仓库。
- 真实路径、真实读取命令或 endpoint 原文被写入仓库。
- 环境变量值、credential、密钥文件、token、cookie、密码或客户隐私进入任何摘要。
- runtime log、IPC payload 或插件输出以原文方式保留。
- selected route 暗示已经允许实现、写记忆、写 DailyNote 或写资产。
- routing 记录绕过后续授权门直接进入实现或写入。

## Acceptance

- post-read decision routing 文档存在。
- post-read decision routing contract 存在。
- post-read decision routing 样例存在。
- validation checklist 包含 v2.5 post-read decision routing 检查项。
- 样例保持 `post_read_decision_routing_requested=false`。
- 样例保持 `post_read_decision_routing_performed=false`。
- 样例保持 `sanitized_evidence_review_passed=false`。
- 样例保持 `selected_route=pending`。
- 样例保持 `implementation_authorized=false`。
- 样例保持 `memory_handoff_authorized=false`。
- 样例保持 `daily_note_write_authorized=false`。
- 样例保持 `asset_write_authorized=false`。
- 样例保持 `real_execution_allowed=false`。
- 样例不包含真实路径、真实读取命令、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_5_route_specific_authorization_gate
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - post-read decision routing
    - selected route
    - route-specific boundary check
    - human authorization
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

