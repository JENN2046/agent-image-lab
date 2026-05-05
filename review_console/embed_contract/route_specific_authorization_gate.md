# Route-specific Authorization Gate Contract

本文定义 route-specific authorization gate contract。它只描述未来 post-read decision routing 选择路线后，如何进入路线专属人工授权门，不读取真实源码，不保存真实路径，不保存真实命令，不保存 raw source，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: route_specific_authorization_gate
  version: v2.5-route-specific-authorization-gate-template
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

## Required Gate Shape

```yaml
required_gate_shape:
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

真实路径、真实读取命令、shell 文本、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 gate shape。

## Gate Preconditions

```yaml
route_specific_authorization_preconditions:
  required_before_route_authorization:
    - post_read_decision_routing_record
    - selected_route_review
    - route_boundary_policy
    - no_git_storage_for_raw_values
    - human_route_authorizer
  still_not_allowed:
    - implementation_code_created
    - ipc_handler_created
    - preload_runtime_code_created
    - renderer_runtime_code_created
    - api_called
    - daily_note_called
    - vcp_memory_written
```

本阶段样例不得把 `route_specific_authorization_requested`、`route_specific_authorization_granted`、`implementation_authorized`、`memory_handoff_authorized` 或 `daily_note_write_authorized` 设为 `true`。未来即使某条路线获得授权，也只允许进入该路线的下一受控阶段，仍不得自动调用外部系统。

## Forbidden Gate Content

```yaml
forbidden_gate_content:
  - real_local_path
  - raw_allowlist_path
  - raw_read_command
  - shell_command_text
  - raw_source_code
  - complete_function_body
  - endpoint_raw_value
  - env_value
  - secret_raw_value
  - private_path_raw_value
  - customer_private_data
  - raw_runtime_log
  - raw_ipc_payload
  - raw_plugin_output
  - image_binary
```

## Boundary After Gate

route-specific authorization gate 记录完成后也不得自动进入：

- VCPChat 修改。
- IPC handler 创建。
- preload 或 renderer 代码创建。
- 插件调用。
- API 调用。
- DailyNote 写入。
- VCP 长期记忆写入。
- 图片创建或资产写入。

## Acceptance

- 本 contract 只定义路线专属授权门。
- 本 contract 不读取真实源码。
- 本 contract 不保存真实路径。
- 本 contract 不保存真实读取命令。
- 本 contract 不保留 raw source。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。

