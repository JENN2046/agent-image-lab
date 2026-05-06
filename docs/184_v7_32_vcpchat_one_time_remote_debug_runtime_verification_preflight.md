# v7.32 VCPChat One-time Remote Debug Runtime Verification Preflight

本文记录 v7.32 VCPChat One-time Remote Debug Runtime Verification Preflight。目标是在 v7.31 选定 `one_time_remote_debug` 方案之后，收敛下一次 renderer global 自动验证的执行前门槛。本阶段只写 preflight，不启动 VCPChat，不打开 remote-debug 端口，不连接 Chrome DevTools Protocol，不修改 VCPChat，不创建 test harness。

```yaml
status: completed_validated_v7_32_one_time_remote_debug_runtime_verification_preflight
version: v7.32
current_phase: "v7.32 vcpchat one-time remote-debug runtime verification preflight"
validation_file: scripts/validate_v7_32_vcpchat_one_time_remote_debug_runtime_verification_preflight.js
current_head: 49ffae2
previous_phase: "v7.31 vcpchat renderer global verification gate"
previous_record: docs/183_v7_31_vcpchat_renderer_global_verification_gate.md
default_next_phase: "v7.33 VCPChat One-time Remote Debug Runtime Verification Execution"
```

## Target Baseline

```yaml
target_baseline:
  target_repository_name: VCPChat
  target_branch: main
  target_head_short: b320e39
  require_vcpchat_worktree_clean: true
  require_origin_main_synced: true
  require_no_dependency_install: true
  require_no_vcpchat_file_modification: true
```

## Candidate One-time Launch Command

```yaml
candidate_launch_command:
  command: cmd /d /s /c "chcp 65001 >nul && .\node_modules\electron\dist\electron.exe --remote-debugging-port=9222 . --desktop-only"
  reason_cn: "沿用 start:desktop:utf8 的 UTF-8 与 desktop-only 语义，只增加一次性 remote-debug 端口，避免修改 package.json。"
  command_execution_performed_by_this_phase: false
  remote_debug_port: 9222
  remote_debug_port_opened_by_this_phase: false
```

## Pre-launch Port Gate

```yaml
pre_launch_port_gate:
  require_port_9222_free_before_launch: true
  stop_if_port_9222_in_use: true
  stop_if_existing_debug_target_present: true
  stop_if_debug_endpoint_exposes_unrelated_app: true
  port_probe_allowed_next_phase: true
  port_probe_performed_by_this_phase: false
```

## Proposed CDP Read-only Probe

```yaml
proposed_cdp_read_only_probe:
  local_debug_endpoint: http://127.0.0.1:9222/json
  endpoint_access_allowed_next_phase: true
  endpoint_access_performed_by_this_phase: false
  allowed_cdp_methods_next_phase:
    - Runtime.evaluate
  forbidden_cdp_methods_next_phase:
    - Page.navigate
    - Runtime.callFunctionOn with side-effectful calls
    - DOM.setAttributeValue
    - Input.dispatchKeyEvent
    - Input.dispatchMouseEvent
  read_only_expression_policy_cn:
    - "只读取 window.imageLabReview 是否存在。"
    - "只读取四个 allowlist 方法是否为 function。"
    - "只读取 imageLabReviewMount 是否存在。"
    - "只读取 window.imageLabReviewRuntime 是否存在。"
    - "只调用纯草案构造或只读检查；不得调用 bridge loadSession / previewDraft / submitDraft / cancel。"
```

## Verification Assertions

```yaml
verification_assertions:
  host_bridge:
    - window.imageLabReview 存在
    - window.imageLabReview.loadSession 是函数
    - window.imageLabReview.previewDraft 是函数
    - window.imageLabReview.submitDraft 是函数
    - window.imageLabReview.cancel 是函数
  renderer_mount:
    - document.getElementById("imageLabReviewMount") 存在
    - window.imageLabReviewRuntime 存在
  draft_bundle:
    - review_session_draft 存在
    - image_case_draft 存在
    - memory_delta_draft 存在
  prototype_guard:
    - api_called=false
    - daily_note_called=false
    - vcp_plugin_called=false
    - disk_write_performed=false
    - image_file_created=false
```

## Side Effect Guard

```yaml
side_effect_guard:
  app_launch_performed_by_this_phase: false
  remote_debug_used_by_this_phase: false
  cdp_endpoint_accessed_by_this_phase: false
  runtime_evaluate_performed_by_this_phase: false
  vcpchat_modified_by_this_phase: false
  test_harness_created_by_this_phase: false
  review_console_bridge_load_session_called: false
  review_console_bridge_preview_draft_called: false
  review_console_bridge_submit_draft_called: false
  review_console_bridge_cancel_called: false
  review_console_bridge_plugin_called: false
  review_console_bridge_api_called: false
  review_console_bridge_daily_note_called: false
  review_console_bridge_vcp_memory_written: false
  review_console_bridge_disk_write_performed: false
  review_console_bridge_image_created: false
  dependency_changed: false
  package_manifest_changed: false
  lockfile_changed: false
  vcpchat_pushed: false
  branch_deleted: false
  github_release_performed: false
```

## Cleanup Requirements For Next Phase

```yaml
cleanup_requirements_next_phase:
  close_launched_process_tree: true
  restore_vcpchat_worktree_if_startup_touches_known_readiness_file: true
  verify_vcpchat_worktree_clean_after_cleanup: true
  record_any_startup_side_effect_cn: true
```

## Stop Conditions

```yaml
stop_conditions_next_phase:
  stop_if_vcpchat_head_not_b320e39: true
  stop_if_vcpchat_worktree_dirty_before_launch: true
  stop_if_port_9222_in_use: true
  stop_if_dependency_install_required: true
  stop_if_remote_debug_endpoint_unavailable_after_launch: true
  stop_if_runtime_evaluate_requires_side_effectful_calls: true
  stop_if_review_console_bridge_call_would_trigger_ipc: true
  stop_if_secret_or_private_content_visible: true
```

## Next Authorization Template

```yaml
next_authorization_template_cn: >
  我明确授权执行 v7.33，只允许在 VCPChat main@b320e39 使用一次性 remote-debug 启动命令
  cmd /d /s /c "chcp 65001 >nul && .\node_modules\electron\dist\electron.exe --remote-debugging-port=9222 . --desktop-only"，
  并用本地只读 CDP Runtime.evaluate 检查 window.imageLabReview、四个 allowlist 方法、imageLabReviewMount、
  window.imageLabReviewRuntime、review_session_draft、image_case_draft、memory_delta_draft 和 prototype_guard。
  允许 VCPChat 普通启动流程读取既有本地设置并尝试既有启动连接；禁止修改 VCPChat、禁止新增 test harness、
  禁止调用 bridge loadSession/previewDraft/submitDraft/cancel、禁止插件/API/DailyNote/VCP 记忆/图片/项目文件写入/
  依赖变更/远端推送。测试后必须关闭启动进程树并恢复 VCPChat 工作树干净。
```

## Acceptance Meaning

v7.32 表示一次性 remote-debug runtime verification 的命令、端口门槛、CDP 只读范围、断言和清理要求已经明确。它不代表已经启动 VCPChat，也不代表 renderer global 已验证。
