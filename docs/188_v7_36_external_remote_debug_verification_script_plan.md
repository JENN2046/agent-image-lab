# v7.36 External Remote Debug Verification Script Plan

本文记录 v7.36 External Remote Debug Verification Script Plan。目标是把 v7.33 已验证过的一次性 remote-debug runtime verification 整理成未来可实现的 Agent Image Lab 外部脚本规划。本阶段只写计划、contract、样例和 validation checklist，不创建真实 remote-debug 脚本，不启动 VCPChat，不访问 CDP，不修改 VCPChat。

```yaml
status: planned_validated_v7_36_external_remote_debug_verification_script_plan
version: v7.36
current_phase: "v7.36 external remote-debug verification script plan"
validation_file: scripts/validate_v7_36_external_remote_debug_verification_script_plan.js
current_head: a2fb6cb
previous_phase: "v7.35 vcpchat review console runtime followup planning"
previous_record: docs/187_v7_35_vcpchat_review_console_runtime_followup_planning.md
default_next_phase: "v7.37 External Remote Debug Verification Script Authorization Gate"
```

## Planning Goal

```yaml
planning_goal:
  recommended_script_candidate: scripts/run_vcpchat_review_console_remote_debug_smoke.ps1
  script_created_by_this_phase: false
  target_repository_name: VCPChat
  target_branch: main
  target_head_short: b320e39
  source_verification_record: docs/185_v7_33_vcpchat_one_time_remote_debug_runtime_verification_record.md
  closeout_record: docs/186_v7_34_vcpchat_review_console_runtime_verification_closeout.md
  followup_record: docs/187_v7_35_vcpchat_review_console_runtime_followup_planning.md
  purpose_cn: "规划未来外部脚本如何重复验证 Review Console bridge runtime surface。"
```

## Future Script Responsibilities

```yaml
future_script_responsibilities:
  preflight:
    - "确认 VCPChat 分支、HEAD 和工作树状态。"
    - "确认 remote-debug 端口没有被占用。"
    - "确认用户已对本次启动、CDP 只读检查和进程清理给出独立授权。"
    - "确认不会调用 bridge loadSession / previewDraft / submitDraft / cancel。"
  launch:
    - "使用一次性 remote-debug 启动 VCPChat。"
    - "记录启动进程 id 的脱敏摘要。"
    - "不修改 VCPChat 源码、依赖、manifest 或 lockfile。"
  cdp_read_only_checks:
    - "只允许 Runtime.evaluate。"
    - "只读取 window.imageLabReview 的 allowlist 方法名称。"
    - "只读取 imageLabReviewMount 和 window.imageLabReviewRuntime 的存在性与安全状态。"
    - "只读取 review_session_draft、image_case_draft、memory_delta_draft 和 prototype_guard 的脱敏布尔结果。"
  cleanup:
    - "关闭本次启动的进程树。"
    - "确认 remote-debug 端口未遗留。"
    - "若普通启动触碰 .vcp_ready，只按独立授权的恢复规则处理并记录。"
  output:
    - "输出脱敏 JSON 结果。"
    - "不写入真实本机路径、secret、token、cookie、密码、config.env 内容或源码大段原文。"
```

## Future Script Forbidden Actions

```yaml
future_script_forbidden_actions:
  bridge_load_session_called: false
  bridge_preview_draft_called: false
  bridge_submit_draft_called: false
  bridge_cancel_called: false
  dom_mutation_allowed: false
  navigation_allowed: false
  user_input_simulation_allowed: false
  plugin_call_allowed: false
  api_call_allowed: false
  daily_note_call_allowed: false
  vcp_memory_write_allowed: false
  image_creation_allowed: false
  dependency_change_allowed: false
  package_manifest_change_allowed: false
  lockfile_change_allowed: false
  vcpchat_remote_push_allowed: false
  github_release_allowed: false
```

## Script Output Shape

```yaml
script_output_shape:
  schema_name: v7_36_external_remote_debug_verification_result
  allowed_fields:
    - run_id
    - target_repo_summary
    - target_head_short
    - launch_attempted
    - runtime_evaluate_attempted
    - allowlist_methods_detected
    - mount_detected
    - runtime_detected
    - draft_bundle_detected
    - prototype_guard_summary
    - cleanup_summary_cn
    - side_effect_summary_cn
    - sanitized_audit_summary_cn
  forbidden_fields:
    - raw_local_root
    - raw_cdp_endpoint
    - raw_source_code
    - raw_config_content
    - secret
    - token
    - cookie
    - password
    - private_key
    - customer_private_data
```

## This Phase Boundary

```yaml
this_phase_boundary:
  app_launch_performed_by_this_phase: false
  remote_debug_used_by_this_phase: false
  cdp_endpoint_accessed_by_this_phase: false
  runtime_evaluate_performed_by_this_phase: false
  external_script_created_by_this_phase: false
  vcpchat_modified_by_this_phase: false
  vcpchat_formal_smoke_test_created_by_this_phase: false
  bridge_load_session_called: false
  bridge_preview_draft_called: false
  bridge_submit_draft_called: false
  bridge_cancel_called: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  dependency_changed: false
  package_manifest_changed: false
  lockfile_changed: false
  vcpchat_pushed: false
  github_release_performed: false
```

## Next Authorization Template

```yaml
next_authorization_template_cn: >
  我明确授权进入 v7.37，只在 Agent Image Lab 中补齐 external remote-debug verification script
  的实现授权门槛；仍不创建真实脚本、不启动 VCPChat、不访问 CDP、不修改 VCPChat。
```

## Acceptance Meaning

v7.36 只表示外部 remote-debug 验证脚本的职责、禁止动作、输出字段和后续授权门槛已经规划清楚。它不代表脚本已经存在，不代表可以启动 VCPChat，不代表可以访问 CDP，也不代表 VCPChat 已拥有正式 smoke test。
