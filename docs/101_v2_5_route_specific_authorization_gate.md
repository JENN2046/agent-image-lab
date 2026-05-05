# 101 v2.5 Route-specific Authorization Gate

本文定义 Agent Image Lab v2.5 第四阶段的“路线专属授权门”。该阶段接在 post-read decision routing 之后，只说明未来某个路由被选择后，还必须再次获得针对该路由的独立人工授权。本文不读取真实 VCPChat，不读取真实 VCPToolBox，不接收真实源码，不保存真实路径，不保存真实读取命令，不复制 raw source，不创建 IPC handler，不调用插件、API、DailyNote、VCP 记忆或文件系统。

## Gate Status

```yaml
v2_5_route_specific_authorization_gate:
  status: route_specific_authorization_gate_template_only
  route_specific_authorization_required: true
  route_specific_authorization_requested: false
  route_specific_authorization_granted: false
  selected_route: pending
  post_read_decision_routing_performed: false
  implementation_authorized: false
  memory_handoff_authorized: false
  daily_note_write_authorized: false
  asset_write_authorized: false
  design_discussion_authorized: false
  archive_rejection_record_authorized: false
  real_execution_allowed: false
```

## Goal

本阶段把 v2.5 Patch 03 的 post-read decision routing 收束到 route-specific authorization gate。它用于未来确认：

- 路由选择不等于授权执行。
- 每条路由都必须有自己的边界、审批人、拒绝条件和输出限制。
- `request_implementation_authorization` 只是请求实现授权，不是实现授权。
- `request_memory_handoff_authorization` 只是请求记忆交接授权，不是 DailyNote 或 VCP 记忆写入授权。
- `request_archive_rejection_record` 只能生成脱敏拒绝记录草案，不得保留原文。
- 即使未来进入某条路线，也不得自动写实现、写 DailyNote、写 VCP 记忆或写资产。

本阶段只补齐路线专属授权门模板，不选择真实路线，不批准实现，不写记忆。

## Non-goals

本阶段不做以下事项：

- 不读取真实 VCPChat。
- 不读取真实 VCPToolBox。
- 不保存真实 VCPChat 根目录。
- 不保存真实 allowlist 路径。
- 不保存真实读取命令、shell 片段或脚本内容。
- 不复制 raw source、完整函数体、配置原文、日志原文或 IPC payload 原文。
- 不读取环境文件、credential、密钥文件或客户数据。
- 不修改 VCPChat 或 VCPToolBox。
- 不创建 IPC handler、preload、renderer 或 Adapter 执行入口。
- 不调用插件、API、DailyNote 或 VCP 记忆。
- 不创建图片文件。

## Required Gate Inputs

```yaml
required_gate_inputs:
  post_read_decision_routing_record_exists: true
  post_read_decision_routing_performed: false
  selected_route: pending
  route_specific_authorization_required: true
  route_specific_authorization_requested: false
  route_specific_authorization_granted: false
  route_authorizer: null
  route_authorized_at: null
```

当前样例仍保持未完成路由、未选择路线、未请求路线专属授权、未授予任何后续动作。

## Authorization Record Shape

```yaml
route_specific_authorization_gate:
  gate_id: string
  routing_id: string
  selected_route: pending
  route_specific_authorization_required: true
  route_specific_authorization_requested: false
  route_specific_authorization_granted: false
  route_authorizer: null
  route_authorized_at: null
  implementation_authorized: false
  memory_handoff_authorized: false
  daily_note_write_authorized: false
  asset_write_authorized: false
  design_discussion_authorized: false
  archive_rejection_record_authorized: false
  audit_summary_cn: string
```

`routing_id` 只能引用 post-read decision routing 记录，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Allowed Route Names

允许出现在 route-specific gate 的路线名：

- `pending`
- `reject_sensitive_content`
- `request_resanitization`
- `approve_for_design_discussion`
- `request_implementation_authorization`
- `request_memory_handoff_authorization`
- `request_archive_rejection_record`

当前样例必须保持 `pending`。

## Route-specific Rules

未来路线专属授权必须遵守：

- `reject_sensitive_content` 只允许生成中文脱敏拒绝摘要，不得保存原文。
- `request_resanitization` 只允许要求重新脱敏，不得恢复 raw evidence。
- `approve_for_design_discussion` 只允许进入设计讨论，不允许创建实现代码。
- `request_implementation_authorization` 只允许进入后续实现授权申请，不等于授权实现。
- `request_memory_handoff_authorization` 只允许进入后续记忆交接授权申请，不等于写 DailyNote 或 VCP 记忆。
- `request_archive_rejection_record` 只允许生成脱敏拒绝记录草案，不允许保留 `preserved_original`。
- 任何路线都不得自动触发插件、API、DailyNote、VCP 记忆、文件写入或资产写入。

## Rejection Conditions

必须拒绝以下 route-specific authorization gate 记录：

- raw source、完整函数体或源码片段被写入仓库。
- 真实路径、真实读取命令或 endpoint 原文被写入仓库。
- 环境变量值、credential、密钥文件、token、cookie、密码或客户隐私进入任何摘要。
- runtime log、IPC payload 或插件输出以原文方式保留。
- selected route 暗示已经允许实现、写记忆、写 DailyNote 或写资产。
- route-specific gate 绕过后续授权门直接进入实现或写入。

## Acceptance

- route-specific authorization gate 文档存在。
- route-specific authorization gate contract 存在。
- route-specific authorization gate 样例存在。
- validation checklist 包含 v2.5 route-specific authorization gate 检查项。
- 样例保持 `route_specific_authorization_required=true`。
- 样例保持 `route_specific_authorization_requested=false`。
- 样例保持 `route_specific_authorization_granted=false`。
- 样例保持 `selected_route=pending`。
- 样例保持 `post_read_decision_routing_performed=false`。
- 样例保持 `implementation_authorized=false`。
- 样例保持 `memory_handoff_authorized=false`。
- 样例保持 `daily_note_write_authorized=false`。
- 样例保持 `asset_write_authorized=false`。
- 样例保持 `real_execution_allowed=false`。
- 样例不包含真实路径、真实读取命令、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_5_route_specific_closeout_or_v2_6_runtime_planning
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - route-specific authorization gate review
    - no raw source confirmation
    - no execution confirmation
    - human decision for next phase
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

