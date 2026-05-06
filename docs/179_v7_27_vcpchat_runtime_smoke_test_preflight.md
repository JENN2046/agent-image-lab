# v7.27 VCPChat Runtime Smoke Test Preflight

本文记录 v7.27 VCPChat Runtime Smoke Test Preflight。该阶段只在 Agent Image Lab 内规划和复查 VCPChat Review Console bridge 的 runtime smoke test 条件；不启动 VCPChat 应用，不运行 Electron，不调用插件、API、DailyNote，不写 VCP 记忆，不创建图片，不修改依赖，不发布 release，不删除分支。

```yaml
status: completed_validated_v7_27_vcpchat_runtime_smoke_test_preflight
version: v7.27
current_phase: "v7.27 vcpchat runtime smoke test preflight"
validation_file: scripts/validate_v7_27_vcpchat_runtime_smoke_test_preflight.js
current_head: 5bdde3a
previous_phase: "v7.26 vcpchat local main sync execution record"
previous_record: docs/178_v7_26_vcpchat_local_main_sync_execution_record.md
default_next_phase: "v7.28 VCPChat Runtime Smoke Test Execution Record"
runtime_smoke_test_preflight_only: true
runtime_smoke_test_performed: false
app_launch_performed: false
```

## Current VCPChat Baseline

```yaml
current_vcpchat_baseline:
  target_repository_name: VCPChat
  current_local_branch: main
  current_local_head_short: b320e39
  local_main_head_short: b320e39
  local_origin_main_head_short: b320e39
  worktree_clean: true
  bridge_files_present: true
  bridge_files:
    - main.js
    - modules/ipc/imageLabReviewHandlers.js
    - preloads/chat.js
    - main.html
    - modules/renderer/imageLabReviewMount.js
```

## Available Launch Scripts Observed

```yaml
available_launch_scripts_observed:
  package_name: vcp-chat-desktop
  package_scripts_read_only_inspected: true
  candidate_launch_scripts:
    - npm run start:desktop:utf8
    - npm run start:desktop
    - npm run start:utf8
    - npm start
  recommended_future_launch_script: npm run start:desktop:utf8
  reason_cn: "start:desktop:utf8 明确使用 UTF-8 code page 且 desktop-only，比普通 start 更适合作为未来人工授权的本地 smoke test 入口。"
  script_execution_performed_by_this_phase: false
```

## Smoke Test Scope

```yaml
smoke_test_scope:
  goal_cn: "验证 VCPChat main 上的 Review Console bridge 是否能在运行时暴露最小 host bridge，并保持无插件、无 API、无 DailyNote、无图片创建边界。"
  smoke_test_layers:
    - static_syntax_check
    - app_launch_check
    - preload_bridge_presence_check
    - renderer_mount_presence_check
    - draft_generation_guard_check
    - ipc_ack_contract_check
  expected_runtime_assertions:
    - window.imageLabReview 存在
    - window.imageLabReview.loadSession 是函数
    - window.imageLabReview.previewDraft 是函数
    - window.imageLabReview.submitDraft 是函数
    - window.imageLabReview.cancel 是函数
    - imageLabReviewMount 节点存在
    - window.imageLabReviewRuntime 存在
    - draft bundle 包含 review_session_draft
    - draft bundle 包含 image_case_draft
    - draft bundle 包含 memory_delta_draft
    - prototype_guard.api_called 为 false
    - prototype_guard.daily_note_called 为 false
    - prototype_guard.vcp_plugin_called 为 false
    - prototype_guard.image_file_created 为 false
```

## Candidate Commands After Explicit Authorization

```yaml
candidate_commands_after_explicit_authorization:
  pre_launch_validation_commands:
    - node --check main.js
    - node --check modules\ipc\imageLabReviewHandlers.js
    - node --check preloads\chat.js
    - node --check modules\renderer\imageLabReviewMount.js
  launch_command_candidates:
    - npm run start:desktop:utf8
  post_launch_manual_checks_cn:
    - "确认主窗口打开。"
    - "确认页面未因 Review Console bridge 报错。"
    - "通过开发者工具或安全的本地检查确认 window.imageLabReview 只暴露四个 allowlist 方法。"
    - "确认未触发插件、API、DailyNote、VCP 记忆或图片创建。"
  app_launch_requires_explicit_authorization: true
```

## Stop Conditions

```yaml
stop_conditions:
  stop_if_worktree_dirty: true
  stop_if_current_branch_not_main: true
  stop_if_local_head_not_b320e39: true
  stop_if_required_bridge_file_missing: true
  stop_if_package_scripts_missing: true
  stop_if_launch_would_require_dependency_install: true
  stop_if_env_or_secret_file_needed: true
  stop_if_any_plugin_api_dailynote_or_image_action_required: true
```

## Side Effect Guard

```yaml
side_effect_guard:
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  dependency_changed: false
  package_manifest_changed: false
  lockfile_changed: false
  env_or_secret_file_read: false
  secret_value_copied: false
  raw_local_path_saved: false
  app_launch_performed: false
  runtime_smoke_test_performed: false
  renderer_devtools_used: false
  branch_deleted: false
  github_release_performed: false
  tag_created_by_this_phase: false
```

## Stop Point

```yaml
stop_point:
  stop_here: true
  reason_cn: "runtime smoke test 前置复查完成，但启动 Electron 应用可能触发运行时副作用，必须等待下一阶段明确授权。"
  next_safe_phase: "v7.28 VCPChat Runtime Smoke Test Execution Record"
  app_launch_blocked_until_explicit_authorization: true
  runtime_smoke_test_blocked_until_explicit_authorization: true
```

## Acceptance Meaning

v7.27 表示 runtime smoke test 的目标、候选命令、断言和停止条件已经明确，并确认当前 VCPChat 位于 `main@b320e39`。它不代表已经启动应用，不代表已执行 smoke test，不代表已发布 release，也不代表已清理 feature branch 或 backup branch。
