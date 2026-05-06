# v7.10 VCPChat Review Console File-level Write Authorization Review

本文记录 v7.10 VCPChat Review Console File-level Write Authorization Review。该阶段只在 Agent Image Lab 内基于 v7.9 的脱敏只读 lookup 结果收敛未来真实 VCPChat patch 的最终 `allowed_write_scope`；不读取或修改真实 VCPChat / VCPToolBox，不创建 IPC/preload/renderer 实现代码，不调用插件、API、DailyNote，不写 VCP 记忆，不创建图片。

```yaml
status: completed_validated_project_local_v7_10_file_level_write_authorization_review
version: v7.10
current_phase: "v7.10 vcpchat review console file-level write authorization review"
validation_file: scripts/validate_v7_10_vcpchat_review_console_file_level_write_authorization_review.js
current_head: 1298fef
previous_phase: "v7.9 vcpchat review console authorized source lookup for missing files"
previous_record: docs/161_v7_9_vcpchat_review_console_authorized_source_lookup_for_missing_files.md
default_next_phase: "v7.11 VCPChat Review Console Exact Patch Authorization Request"
authorization_review_record_only: true
implementation_not_authorized_by_this_record: true
```

## Scope Decision

```yaml
scope_decision:
  decision_status: final_allowed_write_scope_candidate_ready
  source_record: docs/161_v7_9_vcpchat_review_console_authorized_source_lookup_for_missing_files.md
  source_lookup_reused_from_v7_9: true
  additional_vcpchat_read_performed: false
  source_write_performed: false
  vcpchat_code_modified: false
  final_allowed_write_scope_ready_for_user_authorization: true
  real_vcpchat_write_authorized: false
  implementation_allowed: false
  reason_cn: "v7.9 已确认缺失文件，v7.10 只把候选范围收敛成真实写入授权请求的文件级边界。"
```

## Final Allowed Write Scope Candidate

```yaml
final_allowed_write_scope_candidate:
  exact_repo_relative_files_only: true
  directories_allowed_as_write_scope: false
  glob_patterns_allowed: false
  implicit_adjacent_files_allowed: false
  files:
    - path: main.js
      file_state: existing
      allowed_change_summary_cn: "只允许新增专用 imageLabReview handler 的引入与初始化注册，不允许改动既有 chat / agent / plugin / DailyNote 流程。"
    - path: modules/ipc/imageLabReviewHandlers.js
      file_state: new_file_expected
      allowed_change_summary_cn: "只允许创建专用 Review Console IPC handler，包含 sender 校验、payload 校验、ack contract 和 no-side-effect guard。"
    - path: preloads/chat.js
      file_state: existing
      allowed_change_summary_cn: "只允许暴露最小 imageLabReview allowlist，不允许复用或扩大 broad electronAPI / chatAPI 能力。"
    - path: main.html
      file_state: existing
      allowed_change_summary_cn: "只允许加入隔离的 Review Console mount 容器和专用 renderer module script，不允许重排主聊天 DOM。"
    - path: modules/renderer/imageLabReviewMount.js
      file_state: new_file_expected
      allowed_change_summary_cn: "只允许创建 Review Console runtime mount glue，输出 review_session_draft / image_case_draft / memory_delta_draft / prototype_guard。"
```

## Excluded And Conditional Files

```yaml
excluded_from_default_write_scope:
  conditional_files_require_separate_authorization:
    - preloads/shared/apiFactory.js
    - preloads/shared/catalog.js
    - preloads/shared/roles.js
    - renderer.js
  read_only_reference_files:
    - modules/ipc/chatHandlers.js
    - modules/services/preloadPaths.js
    - preloads/shared/apiFactory.js
    - preloads/shared/catalog.js
    - preloads/shared/roles.js
    - renderer.js
  exclusion_reason_cn: "这些文件可作为实现参考或条件候选，但默认实现不应触碰；若后续发现必须修改，必须回到授权点单独追加。"
```

## Future Implementation Command Gate

```yaml
future_implementation_command_gate:
  target_repository_name: VCPChat
  target_branch_required: main
  target_head_before_patch_required: c97ff0c
  allowed_commands_for_future_patch:
    - git status --short --branch
    - git diff --check -- main.js modules/ipc/imageLabReviewHandlers.js preloads/chat.js main.html modules/renderer/imageLabReviewMount.js
    - node --check main.js
    - node --check modules/ipc/imageLabReviewHandlers.js
    - node --check preloads/chat.js
    - node --check modules/renderer/imageLabReviewMount.js
  forbidden_commands_or_actions:
    - modify_unlisted_files
    - read_env_or_secret_files
    - install_or_change_dependencies
    - call_plugin
    - call_external_api
    - call_daily_note
    - write_vcp_memory
    - create_image_file
    - push_vcpchat_remote
    - publish_release
    - destructive_git_or_file_commands
  rollback_plan:
    method: manual_reverse_patch_or_git_revert_after_commit
    destructive_rollback_allowed: false
    force_push_allowed: false
```

## Required User Authorization Template

```yaml
required_user_authorization_template:
  target_repository: VCPChat
  target_branch: main
  target_commit_before_patch: c97ff0c
  allowed_read_scope:
    - main.js
    - modules/ipc/chatHandlers.js
    - modules/services/preloadPaths.js
    - preloads/chat.js
    - preloads/shared/apiFactory.js
    - preloads/shared/catalog.js
    - preloads/shared/roles.js
    - main.html
    - renderer.js
    - modules/renderer/
  allowed_write_scope:
    - main.js
    - modules/ipc/imageLabReviewHandlers.js
    - preloads/chat.js
    - main.html
    - modules/renderer/imageLabReviewMount.js
  allowed_commands:
    - git status --short --branch
    - git diff --check -- main.js modules/ipc/imageLabReviewHandlers.js preloads/chat.js main.html modules/renderer/imageLabReviewMount.js
    - node --check main.js
    - node --check modules/ipc/imageLabReviewHandlers.js
    - node --check preloads/chat.js
    - node --check modules/renderer/imageLabReviewMount.js
  safety_confirmations:
    no_plugin_call: true
    no_api_call: true
    no_daily_note_call: true
    no_vcp_memory_write: true
    no_image_creation: true
    no_secret_copy: true
    protect_user_owned_changes: true
  explicit_user_approval_required_before_real_write: true
```

## Boundary State

```yaml
boundary_state:
  file_level_write_scope_review_completed: true
  final_allowed_write_scope_candidate_ready: true
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
  reason_cn: "最终候选写入范围已收敛，但真实 VCPChat 写入仍必须等用户在下一授权点明确确认。"
  next_safe_phase: "v7.11 VCPChat Review Console Exact Patch Authorization Request"
  real_write_phase_blocked: true
```

## Acceptance Meaning

v7.10 表示文件级写入授权审查已经收敛：未来默认真实 patch 只允许触碰 `main.js`、`modules/ipc/imageLabReviewHandlers.js`、`preloads/chat.js`、`main.html`、`modules/renderer/imageLabReviewMount.js`。它不是真实 VCPChat 写入授权，不代表可以创建 IPC/preload/renderer 代码。

默认下一步是 `v7.11 VCPChat Review Console Exact Patch Authorization Request`：把上述范围转成可由用户直接批准或拒绝的硬授权请求。v7.11 仍应先只写 Agent Image Lab，除非用户明确授权真实 VCPChat 写入。
