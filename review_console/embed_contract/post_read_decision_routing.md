# Post-read Decision Routing Contract

本文定义读取后决策路由 contract。它只描述未来 sanitized evidence 人工复核结果如何进入下一步授权请求，不读取真实源码，不保存真实路径，不保存真实命令，不保存 raw source，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: post_read_decision_routing
  version: v2.5-post-read-decision-routing-template
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

## Required Routing Shape

```yaml
required_routing_shape:
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

真实路径、真实读取命令、shell 文本、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 routing shape。

## Routing Preconditions

```yaml
post_read_decision_routing_preconditions:
  required_before_routing:
    - sanitized_evidence_review_gate
    - manual_review_result
    - route_boundary_policy
    - no_git_storage_for_raw_values
    - route_specific_authorization_gate
  still_not_allowed:
    - implementation_code_created
    - ipc_handler_created
    - preload_runtime_code_created
    - api_called
    - daily_note_called
    - vcp_memory_written
```

本阶段样例不得把 `post_read_decision_routing_performed`、`implementation_authorized`、`memory_handoff_authorized` 或 `daily_note_write_authorized` 设为 `true`。未来即使完成路由，也只允许进入下一独立 route-specific authorization gate。

## Forbidden Routing Content

```yaml
forbidden_routing_content:
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

## Boundary After Routing

post-read decision routing 记录完成后也不得自动进入：

- VCPChat 修改。
- IPC handler 创建。
- preload 或 renderer 代码创建。
- 插件调用。
- API 调用。
- DailyNote 写入。
- VCP 长期记忆写入。
- 图片创建或资产写入。

## Acceptance

- 本 contract 只定义读取后决策路由。
- 本 contract 不读取真实源码。
- 本 contract 不保存真实路径。
- 本 contract 不保存真实读取命令。
- 本 contract 不保留 raw source。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。

