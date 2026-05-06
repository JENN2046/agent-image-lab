# v7.37 External Remote Debug Verification Script Authorization Gate

本文记录 v7.37 External Remote Debug Verification Script Authorization Gate。目标是把未来创建 Agent Image Lab 外部 remote-debug 验证脚本之前的硬授权门槛写清楚。本阶段只写授权门槛、contract、样例和 validation checklist，不创建真实脚本，不启动 VCPChat，不访问 CDP，不修改 VCPChat。

```yaml
status: planned_validated_v7_37_external_remote_debug_verification_script_authorization_gate
version: v7.37
current_phase: "v7.37 external remote-debug verification script authorization gate"
validation_file: scripts/validate_v7_37_external_remote_debug_verification_script_authorization_gate.js
current_head: dcf35ce
previous_phase: "v7.36 external remote-debug verification script plan"
previous_record: docs/188_v7_36_external_remote_debug_verification_script_plan.md
default_next_phase: "v7.38 External Remote Debug Verification Script Creation Preflight"
```

## Authorization Principle

```yaml
authorization_principle:
  gate_name: external_remote_debug_verification_script_authorization_gate
  recommended_script_candidate: scripts/run_vcpchat_review_console_remote_debug_smoke.ps1
  script_creation_authorized_by_this_phase: false
  script_created_by_this_phase: false
  app_launch_authorized_by_this_phase: false
  cdp_access_authorized_by_this_phase: false
  runtime_evaluate_authorized_by_this_phase: false
  vcpchat_modification_authorized_by_this_phase: false
  reason_cn: "v7.37 只把创建脚本前的硬边界写清楚，不能被解释为创建脚本或运行验证。"
```

## Required Future Authorization Fields

未来进入真实脚本创建或执行前，授权记录必须明确填写以下字段。未填写或含糊填写时，必须停止。

```yaml
required_future_authorization_fields:
  authorization_id: "<required>"
  authorized_by: "<required>"
  authorized_at: "<required>"
  target_repository_name: VCPChat
  target_branch: main
  target_head_short: "<required before execution>"
  target_root_ref: "<sanitized-placeholder-only-before-execution>"
  script_path_to_create: scripts/run_vcpchat_review_console_remote_debug_smoke.ps1
  allowed_script_actions:
    - preflight_target_branch_head_worktree
    - check_remote_debug_port
    - launch_one_time_remote_debug_after_execution_authorization
    - read_cdp_runtime_evaluate_only
    - verify_review_console_renderer_globals
    - close_launched_process_tree
    - restore_known_vcp_ready_side_effect_if_authorized
    - emit_sanitized_json_result
  forbidden_script_actions:
    - call_bridge_loadSession
    - call_bridge_previewDraft
    - call_bridge_submitDraft
    - call_bridge_cancel
    - call_plugin
    - call_api
    - call_DailyNote
    - write_vcp_memory
    - create_image
    - modify_vcpchat_source
    - modify_dependencies
    - modify_package_manifest
    - modify_lockfile
    - push_vcpchat_remote
    - publish_release
  allowed_output_fields:
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
  forbidden_output_fields:
    - raw_local_root
    - raw_cdp_endpoint
    - raw_source_code
    - raw_config_content
    - env_value
    - secret
    - token
    - cookie
    - password
    - private_key
    - customer_private_data
```

## Stop Conditions

```yaml
stop_conditions:
  missing_target_head: stop
  dirty_vcpchat_worktree: stop
  unexpected_vcpchat_branch: stop
  remote_debug_port_occupied: stop
  dependency_install_required: stop
  env_or_secret_read_required: stop
  login_or_credential_prompt_seen: stop
  bridge_method_invocation_required: stop
  api_or_plugin_or_dailynote_required: stop
  raw_local_path_would_be_persisted: stop
  raw_cdp_endpoint_would_be_persisted: stop
  vcpchat_source_modification_required: stop
  image_creation_required: stop
```

## Creation Gate Decision

```yaml
creation_gate_decision:
  can_create_script_now: false
  can_run_script_now: false
  can_start_vcpchat_now: false
  can_access_cdp_now: false
  can_modify_vcpchat_now: false
  next_allowed_action_cn: "下一阶段只能做脚本创建 preflight 或在明确授权后创建 Agent Image Lab 内的外部验证脚本。"
  required_before_script_creation:
    - "确认脚本路径仍限定在 Agent Image Lab 项目内。"
    - "确认脚本不会在创建时自动启动 VCPChat。"
    - "确认脚本默认 dry-run 或 help-only，不自动访问 CDP。"
    - "确认脚本输出只保存脱敏摘要。"
```

## This Phase Boundary

```yaml
this_phase_boundary:
  script_creation_authorized_by_this_phase: false
  script_created_by_this_phase: false
  app_launch_authorized_by_this_phase: false
  app_launch_performed_by_this_phase: false
  remote_debug_authorized_by_this_phase: false
  remote_debug_used_by_this_phase: false
  cdp_access_authorized_by_this_phase: false
  cdp_endpoint_accessed_by_this_phase: false
  runtime_evaluate_authorized_by_this_phase: false
  runtime_evaluate_performed_by_this_phase: false
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
  vcpchat_modified_by_this_phase: false
  vcpchat_pushed: false
  github_release_performed: false
```

## Next Authorization Template

```yaml
next_authorization_template_cn: >
  我明确授权进入 v7.38，只在 Agent Image Lab 中创建外部 remote-debug 验证脚本文件；
  脚本创建后不得自动启动 VCPChat、不得访问 CDP、不得调用 bridge 方法、不得修改 VCPChat。
```

## Acceptance Meaning

v7.37 表示外部 remote-debug 验证脚本的创建前授权门槛已经固化。它不代表脚本已创建，不代表可以运行脚本，不代表可以启动 VCPChat，也不代表可以访问 CDP 或调用任何 Review Console bridge 方法。
