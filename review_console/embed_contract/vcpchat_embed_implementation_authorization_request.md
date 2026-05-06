# VCPChat Embed Implementation Authorization Request Contract

本文定义未来 VCPChat 嵌入真实实现前的授权请求 contract。它只描述请求字段和硬停止条件，不读取真实 VCPChat / VCPToolBox，不保存真实路径，不创建 IPC/preload/renderer 代码，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: vcpchat_embed_implementation_authorization_request
  version: v6.9-authorization-request-contract
  status: authorization_template_only
  source_contracts:
    - review_console/embed_contract/vcpchat_embed_scope_review_gate.md
    - review_console/embed_contract/vcpchat_embed_minimal_patch_scope.md
    - review_console/embed_contract/vcpchat_embed_implementation_preflight.md
  request_submitted: false
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

## Request Shape

```yaml
request_shape:
  authorization_request_id: string
  requested_patch_name: string
  requested_target_categories: list
  requested_real_target_paths_redacted: list
  raw_real_paths_stored: false
  requested_commands: list
  requested_write_scope: list
  requested_validation_commands: list
  requested_rollback_method_cn: string
  implementation_authorization_granted: false
```

## Required Approval Text

```yaml
required_approval_text:
  must_explicitly_allow_code_creation: true
  must_explicitly_allow_named_files_only: true
  must_explicitly_confirm_no_secret_copy: true
  must_explicitly_confirm_no_plugin_api_daily_note_call: true
  must_explicitly_confirm_no_image_creation: true
  must_explicitly_confirm_rollback_plan: true
```

## Hard Stop

```yaml
hard_stop:
  next_phase_requires_explicit_hard_authorization: true
  current_contract_authorizes_code_creation: false
  current_contract_authorizes_source_read: false
  current_contract_authorizes_remote_release: false
```

## Acceptance

- 本 contract 可供 v7.0 硬授权点引用。
- 本 contract 不授权读取真实 VCPChat / VCPToolBox。
- 本 contract 不授权填写或保存真实私密路径。
- 本 contract 不授权创建 IPC/preload/renderer 代码。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆、文件系统写入或图片创建。
