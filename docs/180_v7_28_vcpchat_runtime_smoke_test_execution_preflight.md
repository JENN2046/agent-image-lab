# v7.28 VCPChat Runtime Smoke Test Execution Preflight

本文记录 v7.28 VCPChat Runtime Smoke Test Execution Preflight。该阶段只整理未来一次 runtime smoke test 的执行前授权门槛、候选命令、观察断言和停止条件；不启动 VCPChat，不运行 Electron，不打开 DevTools，不调用插件、API、DailyNote，不写 VCP 记忆，不创建图片，不改依赖，不推送 VCPChat。

```yaml
status: completed_validated_v7_28_vcpchat_runtime_smoke_test_execution_preflight
version: v7.28
current_phase: "v7.28 vcpchat runtime smoke test execution preflight"
validation_file: scripts/validate_v7_28_vcpchat_runtime_smoke_test_execution_preflight.js
current_head: 683ff22
previous_phase: "v7.27 vcpchat runtime smoke test preflight"
previous_record: docs/179_v7_27_vcpchat_runtime_smoke_test_preflight.md
default_next_phase: "v7.29 VCPChat Runtime Smoke Test Execution Record"
runtime_smoke_test_execution_preflight_only: true
runtime_smoke_test_authorized_by_this_phase: false
runtime_smoke_test_performed: false
app_launch_authorized_by_this_phase: false
app_launch_performed: false
```

## Required Hard Authorization

```yaml
required_hard_authorization:
  authorization_required_before_launch: true
  authorization_required_before_devtools: true
  authorization_required_before_runtime_interaction: true
  minimum_authorization_fields:
    - target_repository_name
    - target_branch
    - target_head_short
    - allowed_launch_command
    - allowed_manual_checks
    - allowed_observation_window_cn
    - abort_conditions
    - no_plugin_api_dailynote_memory_image_confirmation
  current_authorization_state:
    target_repository_name: VCPChat
    target_branch: main
    target_head_short: b320e39
    allowed_launch_command: null
    authorization_granted: false
```

## Preconditions To Recheck Immediately Before Launch

```yaml
pre_launch_recheck:
  target_repository_name: VCPChat
  expected_branch: main
  expected_head_short: b320e39
  require_worktree_clean: true
  require_origin_main_synced: true
  require_bridge_files_present:
    - main.js
    - modules/ipc/imageLabReviewHandlers.js
    - preloads/chat.js
    - main.html
    - modules/renderer/imageLabReviewMount.js
  require_no_dependency_install: true
  require_no_env_or_secret_file_read: true
  require_no_branch_change: true
  require_no_file_write: true
```

## Candidate Commands After Explicit Authorization

```yaml
candidate_commands_after_explicit_authorization:
  static_checks:
    - node --check main.js
    - node --check modules\ipc\imageLabReviewHandlers.js
    - node --check preloads\chat.js
    - node --check modules\renderer\imageLabReviewMount.js
  launch_command:
    command: npm run start:desktop:utf8
    reason_cn: "该脚本使用 UTF-8 code page 且 desktop-only，更适合本地人工 smoke test。"
  command_execution_performed_by_this_phase: false
```

## Runtime Observation Assertions

```yaml
runtime_observation_assertions:
  manual_window_check_cn:
    - "VCPChat 主窗口可以打开。"
    - "页面未因 Review Console bridge 报错。"
  host_bridge_check_cn:
    - "window.imageLabReview 存在。"
    - "window.imageLabReview.loadSession 是函数。"
    - "window.imageLabReview.previewDraft 是函数。"
    - "window.imageLabReview.submitDraft 是函数。"
    - "window.imageLabReview.cancel 是函数。"
    - "没有暴露额外文件系统、插件、API、DailyNote 或 VCP 记忆方法。"
  renderer_mount_check_cn:
    - "imageLabReviewMount 节点存在。"
    - "window.imageLabReviewRuntime 存在。"
    - "runtime 输出仍是草案，不是正式写入。"
  draft_guard_check_cn:
    - "review_session_draft 存在。"
    - "image_case_draft 存在。"
    - "memory_delta_draft 存在。"
    - "prototype_guard.api_called 为 false。"
    - "prototype_guard.daily_note_called 为 false。"
    - "prototype_guard.vcp_plugin_called 为 false。"
    - "prototype_guard.disk_write_performed 为 false。"
    - "prototype_guard.image_file_created 为 false。"
```

## Abort Conditions

```yaml
abort_conditions:
  abort_if_target_branch_not_main: true
  abort_if_target_head_not_b320e39: true
  abort_if_vcpchat_worktree_dirty: true
  abort_if_dependency_install_required: true
  abort_if_env_or_secret_prompt_appears: true
  abort_if_plugin_api_dailynote_or_memory_action_requested: true
  abort_if_image_creation_or_file_export_requested: true
  abort_if_runtime_requires_unlisted_command: true
  abort_if_window_launches_unexpected_external_flow: true
  abort_if_any_secret_or_private_content_is_visible: true
```

## Side Effect Guard

```yaml
side_effect_guard:
  runtime_smoke_test_authorized_by_this_phase: false
  runtime_smoke_test_performed: false
  app_launch_authorized_by_this_phase: false
  app_launch_performed: false
  renderer_devtools_used: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  disk_write_performed: false
  image_created: false
  dependency_changed: false
  package_manifest_changed: false
  lockfile_changed: false
  env_or_secret_file_read: false
  secret_value_copied: false
  raw_local_path_saved: false
  vcpchat_pushed: false
  github_release_performed: false
```

## Stop Point

```yaml
stop_point:
  stop_here: true
  reason_cn: "执行前授权门槛已经写清楚，但启动 Electron 应用仍是硬授权动作。"
  next_safe_phase: "v7.29 VCPChat Runtime Smoke Test Execution Record"
  requires_explicit_app_launch_authorization: true
  suggested_authorization_phrase_cn: "我明确授权执行 v7.29，只允许在 VCPChat main@b320e39 运行 npm run start:desktop:utf8 并做 runtime smoke test；禁止插件/API/DailyNote/VCP 记忆/图片创建/依赖变更/远端推送。"
```

## Acceptance Meaning

v7.28 表示 runtime smoke test 的执行前授权门槛已经收敛：目标、命令、断言、停止条件和副作用边界都已明确。它不代表已经启动应用，不代表已经执行 smoke test，不代表 bridge 运行时通过，也不代表可以自动进入真实运行。
