# v7.11 VCPChat Review Console Exact Patch Authorization Request

本文记录 v7.11 VCPChat Review Console Exact Patch Authorization Request。该阶段只在 Agent Image Lab 内生成首次真实 VCPChat Review Console patch 的硬授权请求；不读取或修改真实 VCPChat / VCPToolBox，不创建 IPC/preload/renderer 实现代码，不调用插件、API、DailyNote，不写 VCP 记忆，不创建图片。

```yaml
status: completed_validated_project_local_v7_11_exact_patch_authorization_request
version: v7.11
current_phase: "v7.11 vcpchat review console exact patch authorization request"
validation_file: scripts/validate_v7_11_vcpchat_review_console_exact_patch_authorization_request.js
current_head: 76c27eb
previous_phase: "v7.10 vcpchat review console file-level write authorization review"
previous_record: docs/162_v7_10_vcpchat_review_console_file_level_write_authorization_review.md
default_next_phase: "v7.12 VCPChat Review Console Exact Patch Execution Preflight"
authorization_request_record_only: true
implementation_not_authorized_by_this_record: true
```

## Authorization Request Status

```yaml
authorization_request_status:
  exact_patch_authorization_request_ready: true
  awaiting_user_explicit_approval: true
  real_vcpchat_write_authorized: false
  implementation_allowed: false
  vcpchat_code_modified: false
  additional_vcpchat_read_performed: false
  request_summary_cn: "本记录把首次真实 VCPChat patch 的文件级写入范围、命令范围、验证范围和停止条件固定下来，等待用户明确授权。"
```

## Exact Target

```yaml
exact_target:
  target_repository_name: VCPChat
  target_local_root_redacted: "<VCPCHAT_LOCAL_ROOT_REDACTED>"
  target_branch_required: main
  target_head_before_patch_required: c97ff0c
  remote_write_allowed: false
  vcpchat_worktree_must_be_clean_before_patch: true
  protect_user_owned_changes: true
```

## Exact Allowed Write Scope

```yaml
exact_allowed_write_scope:
  exact_repo_relative_files_only: true
  directories_allowed_as_write_scope: false
  glob_patterns_allowed: false
  implicit_adjacent_files_allowed: false
  files:
    - path: main.js
      file_state: existing
      allowed_operations:
        - minimal_import
        - minimal_initialize_registration
      allowed_change_summary_cn: "只允许引入并注册专用 imageLabReview handler。不得修改既有聊天、Agent、插件、DailyNote、设置、分发或窗口生命周期逻辑。"
    - path: modules/ipc/imageLabReviewHandlers.js
      file_state: new_file_expected
      allowed_operations:
        - create_new_file
        - define_dedicated_ipc_handler
        - add_sender_validation
        - add_payload_validation
        - add_ack_contract
        - keep_side_effect_guard_false
      allowed_change_summary_cn: "只允许创建专用 Review Console IPC handler，不得调用插件、API、DailyNote、文件写入或 VCP 记忆。"
    - path: preloads/chat.js
      file_state: existing
      allowed_operations:
        - expose_minimal_imageLabReview_allowlist
      allowed_change_summary_cn: "只允许暴露 imageLabReview.loadSession / previewDraft / submitDraft / cancel。不得扩大 broad electronAPI / chatAPI 能力。"
    - path: main.html
      file_state: existing
      allowed_operations:
        - add_isolated_review_console_mount_container
        - add_dedicated_renderer_module_script
      allowed_change_summary_cn: "只允许增加隔离 mount 容器和专用 module script。不得重排主聊天 DOM，不得引入图片资产。"
    - path: modules/renderer/imageLabReviewMount.js
      file_state: new_file_expected
      allowed_operations:
        - create_new_file
        - mount_review_console_runtime
        - bind_host_bridge_mock_or_imageLabReview_bridge
        - emit_draft_records_only
      allowed_change_summary_cn: "只允许创建 Review Console runtime mount glue，输出草案对象和 prototype_guard。不得调用插件、API、DailyNote 或文件系统。"
```

## Explicitly Excluded Files

```yaml
explicitly_excluded_files:
  require_new_authorization_before_write:
    - preloads/shared/apiFactory.js
    - preloads/shared/catalog.js
    - preloads/shared/roles.js
    - renderer.js
    - package.json
    - package-lock.json
    - pnpm-lock.yaml
    - yarn.lock
    - electron-builder.yml
    - config.env
    - .env
  excluded_reason_cn: "这些文件不属于首次默认 patch。若实现过程中发现必须修改其中任何一个文件，必须停止并回到授权点。"
```

## Allowed Commands For Future Patch

```yaml
allowed_commands_for_future_patch:
  read_and_status:
    - git status --short --branch
    - git log --oneline --decorate -5
    - Get-Content main.js
    - Get-Content preloads/chat.js
    - Get-Content main.html
    - Get-ChildItem modules/ipc
    - Get-ChildItem modules/renderer
    - Select-String main.js preloads/chat.js main.html
  edit_scope:
    - apply_patch only for exact_allowed_write_scope files
  validation:
    - git diff --check -- main.js modules/ipc/imageLabReviewHandlers.js preloads/chat.js main.html modules/renderer/imageLabReviewMount.js
    - node --check main.js
    - node --check modules/ipc/imageLabReviewHandlers.js
    - node --check preloads/chat.js
    - node --check modules/renderer/imageLabReviewMount.js
    - git status --short --branch
  agent_image_lab_return_validation:
    - node scripts/validate_v7_11_vcpchat_review_console_exact_patch_authorization_request.js
    - powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
    - powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
```

## Forbidden Commands And Actions

```yaml
forbidden_commands_and_actions:
  destructive_commands:
    - git reset --hard
    - git clean -fd
    - git clean -fdx
    - git push --force
    - Remove-Item -Recurse
  scope_expansion:
    - modify_unlisted_files
    - add_dependency
    - update_lockfile
    - change_package_scripts
    - alter_existing_plugin_flow
    - alter_daily_note_flow
    - alter_vcp_memory_flow
  external_side_effects:
    - call_plugin
    - call_external_api
    - call_daily_note
    - write_vcp_memory
    - create_image_file
    - push_vcpchat_remote
    - publish_release
  sensitive_data:
    - read_env_or_secret_files
    - copy_secret
    - copy_token
    - copy_cookie
    - copy_password
    - save_raw_local_path_to_repo_docs
```

## Stop Conditions

```yaml
stop_conditions:
  must_stop_if:
    - target_branch_is_not_main
    - target_head_before_patch_is_not_c97ff0c
    - vcpchat_worktree_is_dirty
    - user_owned_uncommitted_changes_exist
    - implementation_requires_file_outside_exact_allowed_write_scope
    - implementation_requires_dependency_change
    - implementation_requires_secret_or_env_read
    - implementation_requires_plugin_api_daily_note_or_vcp_memory_call
    - validation_failure_requires_non_obvious_design_decision
    - generated_diff_contains_secret_or_raw_private_path
  stop_result_cn: "停止后只报告脱敏原因，不继续写 VCPChat。"
```

## Required User Approval Phrase

```yaml
required_user_approval_phrase:
  approval_is_required_before_real_write: true
  example_cn: "我明确授权执行 v7.12，只允许修改 VCPChat 的 main.js、modules/ipc/imageLabReviewHandlers.js、preloads/chat.js、main.html、modules/renderer/imageLabReviewMount.js；禁止插件/API/DailyNote/VCP 记忆/图片创建/依赖变更/远端推送。"
  ambiguous_continue_is_not_enough: true
```

## Rollback Plan

```yaml
rollback_plan:
  preferred_method: manual_reverse_patch_before_commit
  after_commit_method: git_revert_normal_commit_only
  destructive_rollback_allowed: false
  force_push_allowed: false
  rollback_must_remain_within_allowed_write_scope: true
```

## Boundary State

```yaml
boundary_state:
  exact_patch_authorization_request_created: true
  exact_allowed_write_scope_confirmed_as_request: true
  real_vcpchat_write_authorized: false
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
  adapter_execution_entrypoint_created: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  vcp_memory_written: false
  disk_write_runtime_performed: false
  image_file_created: false
```

## Stop Point

```yaml
stop_point:
  stop_here: true
  reason_cn: "硬授权请求已准备好，但真实 VCPChat 写入必须等待用户明确批准 v7.12。"
  next_safe_phase: "v7.12 VCPChat Review Console Exact Patch Execution Preflight"
  real_write_phase_blocked: true
```

## Acceptance Meaning

v7.11 表示真实 VCPChat 首次 patch 的硬授权请求已准备好。它不是真实写入授权，不代表可以进入 VCPChat 修改，也不代表可以创建 IPC/preload/renderer 代码。

默认下一步是等待用户明确授权 v7.12。只有用户明确批准并重复确认 exact allowed write scope 后，才可进入真实 VCPChat patch preflight。
