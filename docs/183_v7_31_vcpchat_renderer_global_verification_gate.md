# v7.31 VCPChat Renderer Global Verification Gate

本文记录 v7.31 VCPChat Renderer Global Verification Gate。目标是在 v7.30 窗口级 smoke 已通过之后，选择下一步 renderer `window.*` 全局验证方案。本阶段只在 Agent Image Lab 内记录方案评估和推荐，不启动 VCPChat，不修改 VCPChat，不创建 test harness，不打开 DevTools，不使用 remote debugging。

```yaml
status: completed_validated_v7_31_renderer_global_verification_gate
version: v7.31
current_phase: "v7.31 vcpchat renderer global verification gate"
validation_file: scripts/validate_v7_31_vcpchat_renderer_global_verification_gate.js
current_head: 241965b
previous_phase: "v7.30 vcpchat runtime smoke test partial execution record"
previous_record: docs/182_v7_30_vcpchat_runtime_smoke_test_partial_execution_record.md
default_next_phase: "v7.32 VCPChat One-time Remote Debug Runtime Verification Preflight"
```

## Current Evidence

```yaml
current_evidence:
  target_repository_name: VCPChat
  target_branch: main
  target_head_short: b320e39
  v7_30_window_level_smoke: passed
  v7_30_renderer_global_smoke: not_completed
  v7_30_startup_side_effect_observed:
    path: .vcp_ready
    restored_by_codex: true
    vcpchat_worktree_clean_after_restore: true
```

## Options Considered

```yaml
options_considered:
  manual_devtools:
    risk_level: medium
    reproducibility: low
    modifies_vcpchat: false
    requires_app_launch: true
    summary_cn: "人工打开 DevTools 后手动观察 window.imageLabReview / imageLabReviewRuntime。最少工具改动，但结果依赖人工截图或文字记录。"
  one_time_remote_debug:
    risk_level: medium
    reproducibility: high
    modifies_vcpchat: false
    requires_app_launch: true
    summary_cn: "一次性用 remote-debug 启动参数启动 Electron，再用本地只读脚本读取 renderer 全局。比人工 DevTools 可复现，且不需要修改 VCPChat。"
  reversible_local_test_harness:
    risk_level: high
    reproducibility: high
    modifies_vcpchat: true
    requires_app_launch: true
    summary_cn: "新增可回滚测试钩子或 harness，自动化程度最高，但会修改 VCPChat，当前不应作为下一步默认选择。"
```

## Recommended Choice

```yaml
recommended_choice:
  selected_strategy: one_time_remote_debug
  reason_cn: "一次性 remote-debug 启动参数在不修改 VCPChat 的前提下，能提供比人工 DevTools 更可复现的 renderer global 检查；风险低于新增 test harness。"
  not_selected:
    manual_devtools_reason_cn: "人工观察可用但复现性弱，难以形成稳定验收记录。"
    reversible_local_test_harness_reason_cn: "需要修改 VCPChat，风险和授权门槛高于当前需要。"
```

## Proposed Verification Scope

```yaml
proposed_verification_scope:
  target_globals:
    - window.imageLabReview
    - window.imageLabReview.loadSession
    - window.imageLabReview.previewDraft
    - window.imageLabReview.submitDraft
    - window.imageLabReview.cancel
    - document.getElementById("imageLabReviewMount")
    - window.imageLabReviewRuntime
    - window.imageLabReviewRuntime.createDraftBundle
  draft_checks:
    - review_session_draft
    - image_case_draft
    - memory_delta_draft
    - prototype_guard.api_called=false
    - prototype_guard.daily_note_called=false
    - prototype_guard.vcp_plugin_called=false
    - prototype_guard.disk_write_performed=false
    - prototype_guard.image_file_created=false
```

## Boundary For Next Phase

```yaml
next_phase_boundary:
  app_launch_performed_by_this_phase: false
  remote_debug_used_by_this_phase: false
  devtools_used_by_this_phase: false
  vcpchat_modified_by_this_phase: false
  test_harness_created_by_this_phase: false
  review_console_bridge_plugin_called: false
  review_console_bridge_api_called: false
  review_console_bridge_daily_note_called: false
  review_console_bridge_vcp_memory_written: false
  review_console_bridge_disk_write_performed: false
  review_console_bridge_image_created: false
  dependency_changed: false
  vcpchat_pushed: false
```

## Next Authorization Template

```yaml
next_authorization_template_cn: >
  我明确授权执行 v7.32，只允许在 VCPChat main@b320e39 使用一次性 remote-debug 启动参数启动
  npm run start:desktop:utf8 等价流程，并用本地只读脚本检查 renderer global：
  window.imageLabReview、imageLabReviewMount、window.imageLabReviewRuntime、review_session_draft、
  image_case_draft、memory_delta_draft 和 prototype_guard。允许 VCPChat 普通启动流程读取既有本地设置并尝试既有启动连接；
  禁止修改 VCPChat、禁止新增 test harness、禁止插件/API/DailyNote/VCP 记忆/图片/项目文件写入/依赖变更/远端推送。
```

## Acceptance Meaning

v7.31 表示已经选择下一步 renderer global 验证策略：推荐一次性 remote-debug。它不代表已经启动 VCPChat，不代表已经验证 renderer global，也不代表可以修改 VCPChat。
