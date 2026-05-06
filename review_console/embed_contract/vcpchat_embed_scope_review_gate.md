# VCPChat Embed Scope Review Gate Contract

本文定义未来 VCPChat 嵌入最小 patch 的范围审查 contract。它只描述 scope request 的人工审查字段、通过路线和拒绝路线，不读取真实 VCPChat / VCPToolBox，不保存真实路径，不创建 IPC/preload/renderer 代码，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: vcpchat_embed_scope_review_gate
  version: v6.8-review-gate-contract
  status: review_gate_only
  source_contracts:
    - review_console/embed_contract/vcpchat_embed_minimal_patch_scope.md
    - review_console/embed_contract/vcpchat_embed_implementation_preflight.md
    - review_console/embed_contract/host_bridge_contract_v2.md
  implementation_authorization_granted: false
  implementation_allowed: false
  source_read_authorized: false
  source_read_performed: false
  real_target_paths_filled: false
  real_vcpchat_source_read: false
  real_vcptoolbox_source_read: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  renderer_runtime_code_created: false
```

## Review Result Shape

```yaml
review_result_shape:
  scope_request_id: string
  reviewer_role: Gatekeeper_Agent | ImageLab_Master | Human_Reviewer
  review_status: pending | revision_required | rejected | approved_for_authorization_request
  approval_to_implement: false
  approval_to_read_source: false
  sanitized_notes_cn: string
  rejection_reason_cn: string | null
```

## Required Checks

```yaml
required_checks:
  scope_is_minimal: required
  target_category_valid: required
  raw_private_path_absent: required
  no_secret_or_customer_data: required
  no_execution_path_added: required
  electron_boundary_preserved: required
  rollback_plan_present: required
  validation_plan_present: required
  user_owned_change_check_planned: required
```

## Route Semantics

```yaml
route_semantics:
  approved_for_authorization_request:
    approval_to_implement: false
    meaning_cn: "只允许进入下一阶段的实现授权请求，不允许当前创建代码。"
  revision_required:
    approval_to_implement: false
    meaning_cn: "需要缩小或补齐范围。"
  rejected:
    approval_to_implement: false
    meaning_cn: "范围包含越权风险，停止推进。"
```

## Acceptance

- 本 contract 可供 v6.9 实现授权请求模板引用。
- 本 contract 不授权读取真实 VCPChat / VCPToolBox。
- 本 contract 不授权填写或保存真实私密路径。
- 本 contract 不授权创建 IPC/preload/renderer 代码。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆、文件系统写入或图片创建。
