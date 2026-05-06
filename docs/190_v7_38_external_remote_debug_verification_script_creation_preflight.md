# v7.38 External Remote Debug Verification Script Creation Preflight

本文记录 v7.38 External Remote Debug Verification Script Creation Preflight。目标是在创建 `scripts/run_vcpchat_review_console_remote_debug_smoke.ps1` 之前完成最后一轮创建前复查，并判断是否可以进入真实脚本创建授权点。本阶段只写 preflight 记录、contract、样例和 validation checklist，不创建真实脚本，不启动 VCPChat，不访问 CDP，不修改 VCPChat。

```yaml
status: planned_validated_v7_38_external_remote_debug_verification_script_creation_preflight
version: v7.38
current_phase: "v7.38 external remote-debug verification script creation preflight"
validation_file: scripts/validate_v7_38_external_remote_debug_verification_script_creation_preflight.js
current_head: da18330
previous_phase: "v7.37 external remote-debug verification script authorization gate"
previous_record: docs/189_v7_37_external_remote_debug_verification_script_authorization_gate.md
default_next_phase: "v7.39 External Remote Debug Verification Script Creation Authorization Point"
```

## Preflight Scope

```yaml
preflight_scope:
  script_path_under_review: scripts/run_vcpchat_review_console_remote_debug_smoke.ps1
  script_exists_before_creation: false
  script_created_by_this_phase: false
  allowed_future_creation_scope:
    - scripts/run_vcpchat_review_console_remote_debug_smoke.ps1
  allowed_future_supporting_updates:
    - docs/191_v7_39_external_remote_debug_verification_script_creation_record.md
    - review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_record.md
    - tests/schema_examples/v7_39_external_remote_debug_verification_script_creation_record.example.yaml
    - scripts/validate_v7_39_external_remote_debug_verification_script_creation_record.js
    - tests/validation_checklist.md
  forbidden_future_creation_scope:
    - "任何 VCPChat 文件。"
    - "任何 VCPToolBox 文件。"
    - "任何依赖 manifest 或 lockfile。"
    - "任何图片文件。"
    - "任何真实 secret、token、cookie、密码或私密配置。"
```

## Script Creation Requirements

未来脚本创建阶段必须满足以下要求，否则不得创建脚本。

```yaml
script_creation_requirements:
  must_be_agent_image_lab_local_only: true
  must_not_modify_vcpchat: true
  must_not_modify_vcptoolbox: true
  must_not_auto_launch_vcpchat_on_creation: true
  must_not_access_cdp_on_creation: true
  must_not_call_bridge_methods_on_creation: true
  must_not_call_plugin_or_api_or_dailynote: true
  must_not_write_vcp_memory: true
  must_not_create_images: true
  must_not_install_dependencies: true
  must_not_embed_raw_local_paths: true
  must_not_embed_raw_cdp_endpoint: true
  must_not_embed_secret_or_config_content: true
  must_emit_sanitized_json_when_eventually_executed: true
  must_default_to_preflight_or_help_only: true
```

## Proposed Future Script Interface

```yaml
proposed_future_script_interface:
  command_name: scripts/run_vcpchat_review_console_remote_debug_smoke.ps1
  parameters:
    - name: VcpChatRoot
      required_for_execution: true
      storage_policy_cn: "只作为运行时参数使用，不写入仓库记录。"
    - name: ExpectedHead
      required_for_execution: true
      storage_policy_cn: "只保存短 hash 摘要，不保存外部路径。"
    - name: RemoteDebugPort
      default: 9222
      storage_policy_cn: "端口号可记录，CDP endpoint 原文不得记录。"
    - name: DryRun
      default: true
      meaning_cn: "只做静态 preflight，不启动应用，不访问 CDP。"
    - name: Execute
      default: false
      meaning_cn: "只有未来单独授权后才允许启动 VCPChat 和访问 CDP。"
  default_behavior:
    dry_run: true
    execute: false
    app_launch: false
    cdp_access: false
    bridge_method_invocation: false
```

## Creation Preflight Decision

```yaml
creation_preflight_decision:
  preflight_result: pass
  safe_to_request_script_creation_authorization: true
  safe_to_create_script_without_next_authorization: false
  safe_to_run_script_without_execution_authorization: false
  safe_to_start_vcpchat_now: false
  safe_to_access_cdp_now: false
  safe_to_modify_vcpchat_now: false
  decision_cn: "可以进入 v7.39 脚本创建授权点；v7.38 本身不创建脚本、不运行脚本、不启动 VCPChat。"
```

## Stop Conditions For Future Creation

```yaml
stop_conditions_for_future_creation:
  script_path_outside_agent_image_lab: stop
  script_would_auto_launch_app_on_creation: stop
  script_would_hardcode_local_vcpchat_root: stop
  script_would_hardcode_cdp_endpoint: stop
  script_would_read_env_or_secret: stop
  script_would_call_bridge_methods: stop
  script_would_modify_vcpchat: stop
  script_would_install_dependency: stop
  script_would_create_image: stop
  script_would_write_non_sanitized_log: stop
```

## This Phase Boundary

```yaml
this_phase_boundary:
  script_creation_preflight_performed: true
  script_creation_authorized_by_this_phase: false
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
  我明确授权进入 v7.39，只允许在 Agent Image Lab 中创建
  scripts/run_vcpchat_review_console_remote_debug_smoke.ps1 和对应记录文件；
  创建脚本后不得自动启动 VCPChat、不得访问 CDP、不得调用 bridge 方法、不得修改 VCPChat。
```

## Acceptance Meaning

v7.38 表示真实外部 remote-debug 验证脚本的创建前 preflight 已通过，可以进入 v7.39 的脚本创建授权点。它不代表脚本已创建，也不代表可以运行脚本、启动 VCPChat、访问 CDP、调用 bridge 方法或修改 VCPChat。
