# v7.6 VCPChat Review Console First Runtime Integration Scope Fill Gate

本文记录 v7.6 VCPChat Review Console First Runtime Integration Scope Fill Gate。该阶段只在 Agent Image Lab 内填写首次真实实现的候选 scope，不读取或修改真实 VCPChat / VCPToolBox，不保存真实本机路径，不创建 IPC/preload/renderer 实现代码，不调用插件、API、DailyNote，不写 VCP 记忆，不创建图片，也不发布 GitHub Release。

```yaml
status: completed_validated_project_local_v7_6_scope_fill_gate
version: v7.6
current_phase: "v7.6 vcpchat review console first runtime integration scope fill gate"
validation_file: scripts/validate_v7_6_to_v7_8_vcpchat_review_console_authorization_chain.js
current_head: d7aacb9
previous_phase: "v7.5 vcpchat review console runtime integration authorization gate"
previous_record: docs/157_v7_5_vcpchat_review_console_runtime_integration_authorization_gate.md
default_next_phase: "v7.7 VCPChat Review Console First Runtime Integration Scope Review Gate"
scope_fill_only: true
implementation_not_authorized_by_this_record: true
```

## Scope Basis

```yaml
scope_basis:
  source: prior_sanitized_agent_image_lab_records
  primary_record: docs/153_v7_1_vcpchat_preload_surface_read_only_intake.md
  no_new_vcpchat_read_performed: true
  no_new_vcpchat_write_performed: true
  raw_local_path_saved: false
  raw_source_code_copied: false
```

## Candidate Repository Target

```yaml
candidate_repository_target:
  repository_name: VCPChat
  local_root: "<VCPCHAT_LOCAL_ROOT_REDACTED>"
  branch_expected: main
  remote_write_allowed: false
  push_allowed: false
```

## Candidate Read Scope

```yaml
candidate_read_scope:
  repo_relative_files_only: true
  files_from_prior_sanitized_intake:
    - modules/services/preloadPaths.js
    - preloads/shared/apiFactory.js
    - preloads/shared/catalog.js
    - preloads/shared/roles.js
    - preloads/chat.js
  additional_read_needed_before_real_patch:
    - "<repo_relative_main_process_ipc_handler_candidate>"
    - "<repo_relative_renderer_mount_candidate>"
  env_or_secret_files_allowed: false
  config_env_allowed: false
  token_cookie_secret_read_allowed: false
```

## Candidate Write Scope

```yaml
candidate_write_scope:
  status: incomplete_until_v7_7_review
  exact_repo_relative_files_only: true
  candidate_files_from_prior_sanitized_intake:
    - preloads/chat.js
    - preloads/shared/apiFactory.js
    - preloads/shared/roles.js
  unresolved_required_files:
    main_process_ipc_handler_file: "<requires_future_authorized_read_only_source_lookup>"
    renderer_mount_file: "<requires_future_authorized_read_only_source_lookup>"
  directory_write_scope_allowed: false
  glob_write_scope_allowed: false
  implicit_neighbor_files_allowed: false
```

## Candidate Implementation Slices

```yaml
candidate_implementation_slices:
  preload_allowlist_slice:
    intent_cn: "增加或接入专用 imageLabReview allowlist。"
    candidate_files:
      - preloads/chat.js
      - preloads/shared/apiFactory.js
      - preloads/shared/roles.js
    implementation_allowed_now: false
  ipc_handler_slice:
    intent_cn: "增加 imageLabReview channel handler、sender 校验、payload 校验和 ack contract。"
    candidate_files:
      - "<repo_relative_main_process_ipc_handler_candidate>"
    implementation_allowed_now: false
  renderer_mount_slice:
    intent_cn: "把 Review Console runtime 挂载到隔离 surface，并只走 imageLabReview bridge。"
    candidate_files:
      - "<repo_relative_renderer_mount_candidate>"
    implementation_allowed_now: false
```

## Candidate Commands

```yaml
candidate_commands:
  allowed_readiness_commands:
    - git status --short --branch
    - git diff --check
    - node --check preloads/chat.js
    - node --check preloads/shared/apiFactory.js
    - node --check preloads/shared/roles.js
  agent_image_lab_validation:
    - powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
    - powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
  install_commands_allowed: false
  destructive_commands_allowed: false
```

## Rollback Candidate

```yaml
rollback_candidate:
  method: manual_reverse_patch_or_git_revert_after_commit
  destructive_rollback_allowed: false
  force_push_allowed: false
  git_reset_hard_allowed: false
  git_clean_allowed: false
```

## Boundary State

```yaml
boundary_state:
  scope_fill_added: true
  implementation_task_authorized: false
  implementation_allowed: false
  final_write_authorization_ready: false
  runtime_code_modified: false
  vcpchat_code_modified: false
  vcptoolbox_code_modified: false
  additional_vcpchat_read_performed: false
  real_vcptoolbox_source_read: false
  real_manifest_read: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  renderer_runtime_code_created: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  vcp_memory_written: false
  disk_write_runtime_performed: false
  image_file_created: false
```

## Acceptance Meaning

v7.6 表示首次真实实现的候选 scope 已经填入 Agent Image Lab，但 scope 仍不完整：主进程 IPC handler 文件和 renderer mount 文件尚未通过新的授权只读 source lookup 精确确认。因此 v7.6 不授权写真实 VCPChat。
