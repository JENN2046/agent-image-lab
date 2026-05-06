# VCPChat Review Console Runtime Integration Authorization Gate Contract

本文定义 v7.5 Review Console runtime integration authorization gate contract。它只整理首次真实实现前的授权门槛；不修改真实 VCPChat / VCPToolBox，不创建 IPC/preload/renderer 代码，不调用插件、API、DailyNote 或文件系统写入。

## Contract Status

```yaml
contract:
  name: vcpchat_review_console_runtime_integration_authorization_gate
  version: v7.5-runtime-integration-authorization-gate-contract
  status: authorization_gate_only
  source_contracts:
    - review_console/embed_contract/vcpchat_review_console_preload_design_gate.md
    - review_console/embed_contract/vcpchat_review_console_ipc_handler_design_gate.md
    - review_console/embed_contract/vcpchat_review_console_renderer_mount_design_gate.md
  implementation_allowed: false
  vcpchat_code_modified: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  renderer_runtime_code_created: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  image_file_created: false
```

## Required Authorization Fields

```yaml
required_authorization_fields:
  authorization_request_id: required
  target_repository_ref: required_sanitized
  target_branch_ref: required
  target_commit_before_patch: required
  implementation_task_id: required
  implementation_summary_cn: required
  allowed_read_scope: required_repo_relative_files
  allowed_write_scope: required_exact_repo_relative_files
  exact_commands_allowed: required
  validation_commands: required
  rollback_plan: required
  safety_confirmations: required
```

## Scope Rules

```yaml
scope_rules:
  write_scope_must_be_exact_file_list: true
  directory_write_scope_allowed: false
  glob_write_scope_allowed: false
  raw_absolute_path_in_agent_image_lab_docs_allowed: false
  env_or_secret_files_allowed: false
  remote_write_allowed_by_default: false
```

## Runtime Contract Requirements

```yaml
runtime_contract_requirements:
  preload_global_name: imageLabReview
  channel_allowlist:
    - imageLabReview.loadSession
    - imageLabReview.previewDraft
    - imageLabReview.submitDraft
    - imageLabReview.cancel
  sender_validation_required: true
  payload_validation_required: true
  ack_contract_required: true
  renderer_mount_isolated_surface_required: true
  prototype_guard_required: true
```

## Stop Conditions

```yaml
stop_conditions:
  unlisted_file_needed: stop
  secret_encountered: stop
  dependency_change_needed: stop
  package_manifest_change_needed: stop
  plugin_call_needed: stop
  api_call_needed: stop
  daily_note_write_needed: stop
  image_file_creation_needed: stop
  user_owned_changes_detected: stop
```

## Acceptance

- 本 contract 可供 v7.6 scope fill gate 引用。
- 本 contract 不授权修改真实 VCPChat / VCPToolBox。
- 本 contract 不授权创建 renderer mount、preload bridge 或 `ipcMain.handle`。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆、文件系统写入或图片创建。
