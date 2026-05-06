# v7.39 External Remote Debug Verification Script Creation Authorization Point

本文记录 v7.39 External Remote Debug Verification Script Creation Authorization Point。目标是明确是否创建 `scripts/run_vcpchat_review_console_remote_debug_smoke.ps1`。本阶段结论是：建议创建该 Agent Image Lab 外部验证脚本，但创建动作必须进入下一阶段的受控创建记录；v7.39 本身不创建脚本，不启动 VCPChat，不访问 CDP，不修改 VCPChat。

```yaml
status: planned_validated_v7_39_external_remote_debug_verification_script_creation_authorization_point
version: v7.39
current_phase: "v7.39 external remote-debug verification script creation authorization point"
validation_file: scripts/validate_v7_39_external_remote_debug_verification_script_creation_authorization_point.js
current_head: 374294b
previous_phase: "v7.38 external remote-debug verification script creation preflight"
previous_record: docs/190_v7_38_external_remote_debug_verification_script_creation_preflight.md
default_next_phase: "v7.40 External Remote Debug Verification Script Creation Record"
```

## Creation Decision

```yaml
creation_decision:
  script_path_under_review: scripts/run_vcpchat_review_console_remote_debug_smoke.ps1
  should_create_script: true
  create_in_this_phase: false
  script_created_by_this_phase: false
  decision_scope: "authorize_next_creation_phase_only"
  requires_next_phase_creation_record: true
  safe_to_create_in_next_phase_after_boundary_check: true
  safe_to_run_after_creation: false
  safe_to_start_vcpchat_after_creation: false
  safe_to_access_cdp_after_creation: false
  decision_cn: "建议创建外部验证脚本，但创建动作必须在 v7.40 单独记录；脚本创建后仍不得自动启动 VCPChat 或访问 CDP。"
```

## Authorized Next Creation Scope

```yaml
authorized_next_creation_scope:
  allowed_file_to_create:
    - scripts/run_vcpchat_review_console_remote_debug_smoke.ps1
  allowed_record_files:
    - docs/192_v7_40_external_remote_debug_verification_script_creation_record.md
    - review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_record.md
    - tests/schema_examples/v7_40_external_remote_debug_verification_script_creation_record.example.yaml
    - scripts/validate_v7_40_external_remote_debug_verification_script_creation_record.js
    - tests/validation_checklist.md
  forbidden_files:
    - "任何 VCPChat 文件。"
    - "任何 VCPToolBox 文件。"
    - "任何 package manifest 或 lockfile。"
    - "任何图片文件。"
    - "任何 config.env、.env、token、cookie、secret 或私密配置。"
```

## Required Script Creation Properties

```yaml
required_script_creation_properties:
  script_must_default_to_dry_run: true
  script_must_require_explicit_execute_switch_for_future_runtime: true
  script_must_not_launch_vcpchat_without_execute_authorization: true
  script_must_not_access_cdp_without_execute_authorization: true
  script_must_not_call_bridge_methods: true
  script_must_not_modify_vcpchat: true
  script_must_not_modify_vcptoolbox: true
  script_must_not_install_dependencies: true
  script_must_not_call_plugin_or_api_or_dailynote: true
  script_must_not_write_vcp_memory: true
  script_must_not_create_images: true
  script_must_not_embed_raw_local_paths: true
  script_must_not_persist_raw_cdp_endpoint: true
  script_must_emit_sanitized_json: true
```

## Future Script Allowed Interface

```yaml
future_script_allowed_interface:
  script_path: scripts/run_vcpchat_review_console_remote_debug_smoke.ps1
  allowed_parameters:
    - VcpChatRoot
    - ExpectedHead
    - RemoteDebugPort
    - DryRun
    - Execute
    - OutputJson
  default_parameter_values:
    DryRun: true
    Execute: false
    RemoteDebugPort: 9222
  safe_creation_behavior:
    help_or_dry_run_only: true
    app_launch_on_creation: false
    cdp_access_on_creation: false
    bridge_method_invocation_on_creation: false
```

## Creation Stop Conditions

```yaml
creation_stop_conditions:
  target_file_already_exists_with_unknown_content: stop
  required_output_would_include_raw_local_path: stop
  required_output_would_include_raw_cdp_endpoint: stop
  script_would_auto_launch_vcpchat: stop
  script_would_access_cdp_during_creation: stop
  script_would_call_bridge_methods: stop
  script_would_modify_vcpchat: stop
  script_would_modify_vcptoolbox: stop
  script_would_install_dependency: stop
  script_would_create_image: stop
  secret_or_private_config_needed: stop
```

## This Phase Boundary

```yaml
this_phase_boundary:
  creation_authorization_point_recorded: true
  should_create_script: true
  create_in_this_phase: false
  script_created_by_this_phase: false
  script_run_by_this_phase: false
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
  我明确授权进入 v7.40，只允许在 Agent Image Lab 中创建
  scripts/run_vcpchat_review_console_remote_debug_smoke.ps1 和对应记录文件；
  脚本必须默认 DryRun=true、Execute=false，创建后不得自动启动 VCPChat、
  不得访问 CDP、不得调用 bridge 方法、不得修改 VCPChat。
```

## Acceptance Meaning

v7.39 表示已经明确建议创建外部 remote-debug 验证脚本，并把创建范围、脚本默认行为、停止条件和禁止事项固定下来。它不代表脚本已创建，也不代表可以运行脚本、启动 VCPChat、访问 CDP、调用 bridge 方法或修改 VCPChat。
