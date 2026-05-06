# VCPChat Read-only Intake Sanitized Record Contract

本文定义 v7.0 VCPChat 只读 intake 脱敏记录 contract。它只保存结构摘要、边界状态和下一步只读范围，不保存真实本机路径，不复制源码大段内容，不创建 IPC/preload/renderer 代码，不调用插件、API、DailyNote 或文件系统写入。

## Contract Status

```yaml
contract:
  name: vcpchat_read_only_intake_sanitized_record
  version: v7.0-sanitized-record-contract
  status: sanitized_record_only
  source_contracts:
    - review_console/embed_contract/vcpchat_embed_implementation_authorization_request.md
    - review_console/embed_contract/vcpchat_embed_scope_review_gate.md
  raw_local_path_saved: false
  raw_source_code_copied: false
  source_write_performed: false
  implementation_allowed: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  renderer_runtime_code_created: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  image_file_created: false
```

## Allowed Record Shape

```yaml
allowed_record_shape:
  target_repository_name: string
  target_local_root_redacted: string
  target_branch_observed: string
  target_head_short: string
  sanitized_structure_findings: map
  electron_boundary_observed: map
  preload_surface_candidates: map
  sanitization_guard: map
```

## Forbidden Record Content

```yaml
forbidden_record_content:
  raw_private_path: forbidden
  env_value: forbidden
  token_or_cookie_value: forbidden
  password_or_key_value: forbidden
  raw_source_block: forbidden
  customer_private_data: forbidden
  plugin_output_raw: forbidden
  image_binary: forbidden
```

## Acceptance

- 本 contract 可供 v7.1 preload surface 只读 intake 引用。
- 本 contract 不授权修改真实 VCPChat / VCPToolBox。
- 本 contract 不授权创建 IPC/preload/renderer 代码。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆、文件系统写入或图片创建。
