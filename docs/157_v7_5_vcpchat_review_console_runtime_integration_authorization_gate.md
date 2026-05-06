# v7.5 VCPChat Review Console Runtime Integration Authorization Gate

本文记录 v7.5 VCPChat Review Console Runtime Integration Authorization Gate。该阶段只在 Agent Image Lab 内整理首次真实实现前的精确授权门槛；不读取或修改真实 VCPChat / VCPToolBox，不保存真实本机路径，不创建 IPC/preload/renderer 实现代码，不调用插件、API、DailyNote，不写 VCP 记忆，不创建图片，也不发布 GitHub Release。

```yaml
status: completed_validated_project_local_v7_5_vcpchat_review_console_runtime_integration_authorization_gate
version: v7.5
current_phase: "v7.5 vcpchat review console runtime integration authorization gate"
validation_file: scripts/validate_v7_5_vcpchat_review_console_runtime_integration_authorization_gate.js
current_head: 2fa9ab3
previous_phase: "v7.4 vcpchat review console renderer mount design gate"
previous_record: docs/156_v7_4_vcpchat_review_console_renderer_mount_design_gate.md
default_next_phase: "v7.6 VCPChat Review Console First Runtime Integration Scope Fill Gate"
authorization_gate_only: true
implementation_not_authorized_by_this_record: true
```

## Gate Goal

```yaml
gate_goal:
  summary_cn: "把首次真实实现前必须填写的授权字段、停止条件、验证命令和回退方式固化为硬门槛。"
  primary_question_cn: "下一次如果要写真实 VCPChat，必须先给出哪些精确授权，才允许进入文件级实现。"
  no_runtime_code_change_required: true
  no_external_read_required: true
  no_vcpchat_write_allowed: true
```

## Evidence Scope

```yaml
evidence_scope:
  preload_design_gate: docs/154_v7_2_vcpchat_review_console_preload_design_gate.md
  ipc_handler_design_gate: docs/155_v7_3_vcpchat_review_console_ipc_handler_design_gate.md
  renderer_mount_design_gate: docs/156_v7_4_vcpchat_review_console_renderer_mount_design_gate.md
  preload_design_contract: review_console/embed_contract/vcpchat_review_console_preload_design_gate.md
  ipc_handler_design_contract: review_console/embed_contract/vcpchat_review_console_ipc_handler_design_gate.md
  renderer_mount_design_contract: review_console/embed_contract/vcpchat_review_console_renderer_mount_design_gate.md
  runtime_guard: review_console/runtime_prototype/runtime_guard.js
  runtime_field_mapping: review_console/runtime_prototype/FIELD_MAPPING.md
```

## Required Authorization Request Shape

```yaml
required_authorization_request_shape:
  authorization_request_id: required
  requested_phase: "v7.6 VCPChat Review Console First Runtime Integration Scope Fill Gate"
  target_repository_ref: required_sanitized_repository_name
  target_branch_ref: required_branch_name
  target_commit_before_patch: required_commit_hash
  implementation_task_id: required
  implementation_summary_cn: required
  allowed_read_scope:
    required: true
    rule: "必须列出 repo-relative 文件；不得使用真实本机绝对路径；不得读取 .env、config.env、token、cookie、密钥或私密配置。"
  allowed_write_scope:
    required: true
    rule: "必须精确到 repo-relative 文件；不得写目录、glob、未列出文件或真实 VCPToolBox。"
    default_until_filled: []
  exact_files_to_modify:
    required: true
    allowed_placeholders_until_filled:
      - "<vcpchat_repo_relative_preload_allowlist_file>"
      - "<vcpchat_repo_relative_ipc_handler_file>"
      - "<vcpchat_repo_relative_renderer_mount_file>"
  exact_commands_allowed:
    required: true
    default_safe_commands:
      - git status --short --branch
      - git diff --check
      - node --check <authorized_js_file>
  validation_commands:
    required: true
    must_include_agent_image_lab_validation: true
  rollback_plan:
    required: true
    destructive_rollback_allowed: false
    force_push_allowed: false
```

## Implementation Authorization Minimum

```yaml
implementation_authorization_minimum:
  can_read_real_vcpchat: requires_explicit_user_authorization
  can_modify_real_vcpchat: requires_explicit_user_authorization
  can_create_ipc_handler: requires_explicit_user_authorization
  can_create_preload_bridge: requires_explicit_user_authorization
  can_create_renderer_mount: requires_explicit_user_authorization
  can_run_vcpchat_validation: requires_explicit_user_authorization
  can_push_vcpchat_remote: false
  can_publish_release: false
  can_call_plugin: false
  can_call_external_api: false
  can_call_daily_note: false
  can_write_vcp_memory: false
  can_create_image_file: false
```

## Exact Scope Requirements

```yaml
exact_scope_requirements:
  repository:
    must_be_named: true
    raw_local_absolute_path_allowed_in_repo_docs: false
    remote_write_allowed_by_default: false
  branch:
    must_be_named: true
    must_check_before_edit: true
  files:
    repo_relative_paths_only: true
    directories_as_write_scope_allowed: false
    glob_write_scope_allowed: false
    implicit_neighbor_files_allowed: false
  commands:
    must_be_listed_before_run: true
    install_commands_allowed_by_default: false
    destructive_commands_allowed: false
  validation:
    must_run_before_commit: true
    validation_gap_must_be_reported: true
  rollback:
    manual_reverse_patch_allowed: true
    git_revert_allowed_after_commit: true
    git_reset_hard_allowed: false
    git_clean_allowed: false
```

## Required Safety Confirmations

```yaml
required_safety_confirmations:
  contextIsolation_must_remain_true: true
  nodeIntegration_must_remain_false: true
  preload_exposes_only_imageLabReview: true
  broad_electronAPI_reuse_for_review_console: false
  broad_chatAPI_exposure_for_review_console: false
  sender_validation_required: true
  payload_validation_required: true
  ack_contract_required: true
  prototype_guard_required: true
  memory_preview_chinese_required: true
  accepted_requires_human_approval: true
  memory_approval_not_approved_keeps_draft: true
```

## Required Stop Conditions

```yaml
required_stop_conditions:
  unlisted_file_needed: stop_and_request_scope_update
  secret_or_env_file_encountered: stop_and_report_sanitized
  raw_private_path_needed_in_doc: stop_and_redact
  dependency_install_needed: stop_and_request_authorization
  package_manifest_change_needed: stop_and_request_authorization
  lockfile_change_needed: stop_and_request_authorization
  plugin_call_needed: stop_and_request_separate_authorization
  api_call_needed: stop_and_request_separate_authorization
  daily_note_write_needed: stop_and_request_separate_authorization
  image_file_creation_needed: stop_and_request_separate_authorization
  vcpchat_user_owned_changes_detected: stop_and_report
```

## Implementation Boundary For This Record

```yaml
implementation_boundary_for_this_record:
  authorization_template_added: true
  implementation_task_authorized: false
  implementation_allowed: false
  runtime_code_modified: false
  vcpchat_code_modified: false
  vcptoolbox_code_modified: false
  additional_vcpchat_read_performed: false
  real_vcptoolbox_source_read: false
  real_manifest_read: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  renderer_runtime_code_created: false
  adapter_execution_entrypoint_created: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  vcp_memory_written: false
  disk_write_runtime_performed: false
  image_file_created: false
```

## Acceptance Meaning

v7.5 表示首次真实实现前的授权门槛已经整理完成。它不代表真实 VCPChat 已修改，不代表任何文件级实现已获授权，不代表 `imageLabReview` preload、IPC handler 或 renderer mount 已创建。

默认下一步是 `v7.6 VCPChat Review Console First Runtime Integration Scope Fill Gate`，由用户或后续记录填写精确 repo-relative 读写文件、允许命令、验证命令和回退方式；在该信息未填齐前，不得写真实 VCPChat。
