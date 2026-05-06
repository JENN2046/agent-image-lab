# v7.30 VCPChat Runtime Smoke Test Partial Execution Record

本文记录 v7.30 VCPChat Runtime Smoke Test 的部分执行结果。本阶段在用户明确允许 VCPChat 普通启动流程读取既有本地设置并尝试既有启动连接的边界下，启动了 VCPChat `main@b320e39` 的 `npm run start:desktop:utf8`。结果：应用启动并出现 VCPChat 窗口，窗口级 smoke 通过；但当前没有安全的无侵入 DevTools / remote-debug / test harness 钩子来自动读取 renderer `window.*` 全局，因此 JS global 自动验证未完成。

```yaml
status: partial_pass_window_smoke_only
version: v7.30
current_phase: "v7.30 vcpchat runtime smoke test partial execution record"
validation_file: scripts/validate_v7_30_vcpchat_runtime_smoke_test_partial_execution_record.js
current_head: 3a23e51
previous_phase: "v7.29 vcpchat runtime smoke test execution record"
previous_record: docs/181_v7_29_vcpchat_runtime_smoke_test_execution_record.md
default_next_phase: "v7.31 VCPChat Renderer Global Verification Gate"
```

## Revised Authorization Applied

```yaml
revised_authorization_applied:
  app_launch_authorized_by_user: true
  normal_vcpchat_startup_settings_read_allowed: true
  normal_vcpchat_startup_existing_connection_attempt_allowed: true
  review_console_bridge_plugin_call_allowed: false
  review_console_bridge_api_call_allowed: false
  review_console_bridge_daily_note_call_allowed: false
  review_console_bridge_vcp_memory_write_allowed: false
  review_console_bridge_image_creation_allowed: false
  review_console_bridge_project_file_write_allowed: false
  dependency_change_allowed: false
  vcpchat_remote_push_allowed: false
```

## Pre-launch Checks

```yaml
pre_launch_checks:
  target_repository_name: VCPChat
  target_branch_is_main: true
  target_head_is_b320e39: true
  origin_main_head_is_b320e39: true
  vcpchat_worktree_clean_before_launch: true
  electron_dependency_present: true
  required_bridge_files_present: true
  dependency_install_performed: false
  env_or_secret_file_read_by_codex: false
```

## Static Checks Performed

```yaml
static_checks_performed:
  node_check_main_js: passed
  node_check_image_lab_review_handlers: passed
  node_check_chat_preload: passed
  node_check_image_lab_review_mount: passed
```

## Runtime Window Smoke

```yaml
runtime_window_smoke:
  launch_command_executed: npm run start:desktop:utf8
  app_launch_performed: true
  electron_process_observed: true
  main_window_observed: true
  observed_window_titles:
    - VCPdesktop
    - VCPChat
  launcher_process_tree_closed_after_observation: true
```

## Renderer Global Verification

```yaml
renderer_global_verification:
  automatic_verification_performed: false
  reason_cn: "当前启动命令未开启 remote debugging，且没有现成无侵入 test harness 可读取 renderer window 全局；为避免新增调试入口或修改 VCPChat，本阶段不伪造 JS global 检查结果。"
  window_image_lab_review_checked: false
  image_lab_review_mount_checked: false
  window_image_lab_review_runtime_checked: false
  review_session_draft_checked: false
  image_case_draft_checked: false
  memory_delta_draft_checked: false
  prototype_guard_checked: false
```

## Startup Side Effect Observed

```yaml
startup_side_effect_observed:
  vcpchat_worktree_dirty_after_launch: true
  changed_path: .vcp_ready
  observed_change_cn: "VCPChat 普通启动流程删除了 tracked readiness 文件 .vcp_ready。"
  restored_by_codex: true
  vcpchat_worktree_clean_after_restore: true
  attribution_cn: "本阶段未与 Review Console bridge 交互，未执行 bridge draft / submit / cancel；该副作用记录为普通应用启动副作用，而非 Review Console bridge 触发。"
```

## Review Console Bridge Side Effect Guard

```yaml
review_console_bridge_side_effect_guard:
  bridge_load_session_called: false
  bridge_preview_draft_called: false
  bridge_submit_draft_called: false
  bridge_cancel_called: false
  review_console_bridge_plugin_called: false
  review_console_bridge_api_called: false
  review_console_bridge_daily_note_called: false
  review_console_bridge_vcp_memory_written: false
  review_console_bridge_disk_write_performed: false
  review_console_bridge_image_created: false
```

## General Guard

```yaml
general_guard:
  dependency_changed: false
  package_manifest_changed: false
  lockfile_changed: false
  secret_value_copied: false
  raw_local_path_saved: false
  vcpchat_pushed: false
  branch_deleted: false
  github_release_performed: false
```

## Result

```yaml
result:
  window_level_smoke: passed
  renderer_global_smoke: not_completed
  repository_cleanliness_restored: true
  overall_runtime_smoke_result: partial
  reason_cn: "VCPChat 能启动并显示窗口，但 Review Console runtime global 尚未通过自动化验证。"
```

## Next Gate

```yaml
next_gate:
  next_safe_phase: "v7.31 VCPChat Renderer Global Verification Gate"
  recommendation_cn: "下一阶段应选择一种明确授权的 renderer global 观察方式：人工 DevTools 观察、一次性 remote-debug launch 参数、或新增可回滚的本地 test harness。"
```

## Acceptance Meaning

v7.30 表示 VCPChat `main@b320e39` 在授权边界下可以启动并显示窗口；它不代表 `window.imageLabReview`、`imageLabReviewMount`、`window.imageLabReviewRuntime` 或草案输出已经被 runtime 验证。它也记录了一个重要风险：普通启动会触碰 `.vcp_ready`，需要在后续运行测试中持续关注并恢复仓库干净状态。
