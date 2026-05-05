# 102 v2.6 Review Console Runtime Handoff Plan

本文定义 Agent Image Lab v2.6 第一阶段的 Review Console runtime handoff planning。该阶段把 v2.5 的 post-read 证据链和 route-specific authorization gate 转换为未来 runtime handoff 的规划记录，不读取真实 VCPChat，不读取真实 VCPToolBox，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不调用插件、API、DailyNote、VCP 记忆或文件系统。

## Handoff Status

```yaml
v2_6_review_console_runtime_handoff:
  status: runtime_handoff_plan_template_only
  runtime_handoff_planning_required: true
  runtime_handoff_planning_completed: false
  runtime_handoff_authorized: false
  route_specific_authorization_granted: false
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  renderer_runtime_code_created: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_file_created: false
  real_execution_allowed: false
```

## Goal

v2.6 的目标是把读取后证据链的结果，整理成未来 Review Console runtime 可以接收的 handoff planning 形态。它只回答：

- 哪些脱敏草案可以作为 handoff 输入。
- 哪些输出只能保持规划、映射和审计摘要。
- 哪些授权缺口必须在进入 runtime implementation 前补齐。
- route-specific authorization gate 未通过时，为什么不得进入真实 runtime handoff。
- 未来 implementation planning 需要哪些 schema mapping 与 Electron 边界复查。

本阶段只补齐 handoff plan，不实现 handoff，不接真实 VCPChat。

## Non-goals

本阶段不做以下事项：

- 不读取真实 VCPChat。
- 不读取真实 VCPToolBox。
- 不保存真实根目录、真实 allowlist 路径或真实读取命令。
- 不复制 raw source、完整函数体、配置原文、日志原文或 IPC payload 原文。
- 不读取环境文件、credential、密钥文件或客户数据。
- 不修改 VCPChat 或 VCPToolBox。
- 不创建 IPC handler、preload、renderer runtime 或 Adapter 执行入口。
- 不调用插件、API、DailyNote 或 VCP 记忆。
- 不写资产，不创建图片文件。

## Allowed Handoff Inputs

```yaml
allowed_handoff_inputs:
  review_session_draft:
    allowed: true
    raw_source_allowed: false
  image_case_draft:
    allowed: true
    image_binary_allowed: false
  memory_delta_draft:
    allowed: true
    preserved_original_allowed: false
  prototype_guard:
    allowed: true
    required_no_execution_fields: true
  route_specific_authorization_gate_ref:
    allowed: true
    route_specific_authorization_granted_required: true
```

所有输入都必须是脱敏草案或记录引用，不得包含真实路径、真实读取命令、endpoint 原文、secret、客户隐私、raw evidence 或 raw source。

## Allowed Handoff Outputs

```yaml
allowed_handoff_outputs:
  runtime_handoff_plan: map
  embed_boundary_notes: map
  schema_mapping_notes: map
  authorization_gap_list: list
  chinese_audit_summary: string
```

这些输出只用于规划和审计，不代表真实 runtime 已创建、真实 VCPChat 已修改、DailyNote 已写入、插件已调用或图片已创建。

## Required Mapping Notes

handoff planning 必须明确以下映射：

- `review_session_draft` 映射到 Review Console 会话草案。
- `image_case_draft` 映射到资产索引草案，不携带图片二进制。
- `memory_delta_draft` 映射到记忆申请草案，不等于 DailyNote 写入。
- `prototype_guard` 映射到 no-execution 证明字段。
- `route_specific_authorization_gate_ref` 只引用路线专属授权门记录，不携带原文。

## Authorization Gaps

进入任何 runtime implementation planning 前，必须另行解决：

- runtime handoff 是否被人工批准。
- 允许创建哪些候选 channel 名称。
- 是否允许写 IPC handler。
- 是否允许写 preload allowlist。
- 是否允许写 renderer runtime 适配层。
- 是否允许修改真实 VCPChat 文件。
- 回滚路径、验证命令和审查人。

本阶段不授予上述任何权限。

## Rejection Conditions

出现以下情况时必须拒绝 handoff planning 记录：

- `route_specific_authorization_granted=false` 却宣称可进入真实 runtime handoff。
- 草案包含 raw source、完整函数体、真实路径、真实读取命令或 endpoint 原文。
- 草案包含环境变量值、credential、密钥、token、cookie、密码或客户隐私。
- 输出宣称已经创建 IPC handler、preload、renderer runtime 或 Adapter 执行入口。
- 输出宣称已经调用插件、API、DailyNote、VCP 记忆或文件系统。
- 输出宣称已经写资产或创建图片。

## Acceptance

- Review Console runtime handoff plan 文档存在。
- Review Console runtime handoff contract 存在。
- Review Console runtime handoff 样例存在。
- validation checklist 包含 v2.6 handoff 检查项。
- 样例保持 `runtime_handoff_planning_required=true`。
- 样例保持 `runtime_handoff_planning_completed=false`。
- 样例保持 `runtime_handoff_authorized=false`。
- 样例保持 `route_specific_authorization_granted=false`。
- 样例保持 `real_vcpchat_source_read=false`。
- 样例保持 `real_vcpchat_modified=false`。
- 样例保持 `ipc_handler_created=false`。
- 样例保持 `preload_runtime_code_created=false`。
- 样例保持 `renderer_runtime_code_created=false`。
- 样例保持 `api_called=false`。
- 样例保持 `vcp_plugin_called=false`。
- 样例保持 `daily_note_called=false`。
- 样例保持 `vcp_memory_written=false`。
- 样例保持 `image_file_created=false`。
- 样例保持 `real_execution_allowed=false`。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_6_runtime_handoff_closeout_or_v2_7_runtime_implementation_planning
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - runtime handoff planning review
    - route-specific authorization status review
    - Electron boundary review
    - schema mapping review
  forbidden_without_next_authorization:
    - write implementation code
    - create IPC handler
    - create preload code
    - create renderer runtime code
    - modify VCPChat
    - call plugin
    - call API
    - call DailyNote
    - write VCP memory
```

