# v7.42 External Remote Debug Verification Script Creation Authorization Package

本文记录 v7.42 External Remote Debug Verification Script Creation Authorization Package。目标是把未来创建 `scripts/run_vcpchat_review_console_remote_debug_smoke.ps1` 前必须具备的授权包字段、默认行为、验证要求、回滚路径和停止条件固化下来。

本阶段只创建未激活的授权包模板和验证记录。不创建真实 remote-debug 脚本，不启动 VCPChat，不访问 CDP，不调用 bridge 方法，不修改 VCPChat / VCPToolBox，不进入 A5 production execution。

```yaml
status: planned_validated_v7_42_external_remote_debug_verification_script_creation_authorization_package
version: v7.42
current_phase: "v7.42 external remote-debug verification script creation authorization package"
validation_file: scripts/validate_v7_42_external_remote_debug_verification_script_creation_authorization_package.js
current_head_before_batch: 0326150
origin_master_short: 5a7f5ba
previous_phase: "v7.41 external remote-debug verification script creation record"
previous_record: docs/193_v7_41_external_remote_debug_verification_script_creation_record.md
default_next_phase: "BLOCKED until explicit script creation authorization"
```

## Authorization Package State

```yaml
authorization_package_state:
  package_record_created: true
  package_template_only: true
  package_active: false
  user_approved_script_creation_now: false
  active_a5_authorization_package_present: false
  active_script_creation_authorization_package_present: false
  exact_target_confirmed_now: false
  executable_script_creation_allowed_now: false
  safe_to_create_script_now: false
  safe_to_run_script_now: false
  safe_to_start_vcpchat_now: false
  safe_to_access_cdp_now: false
  safe_to_modify_vcpchat_now: false
```

## Required Authorization Package

未来真正创建脚本前，用户需要把以下字段具体化。占位符不构成授权。

```yaml
required_authorization_package:
  authorization_id: "<required-explicit-id>"
  authorized_by: "<required-human>"
  authorized_at: "<required-absolute-time>"
  allowed_file_to_create:
    - scripts/run_vcpchat_review_console_remote_debug_smoke.ps1
  allowed_support_files:
    - docs/<creation-execution-record>.md
    - tests/schema_examples/<creation-execution-record>.example.yaml
    - scripts/validate_<creation-execution-record>.js
    - tests/validation_checklist.md
    - .agent_board/*
  forbidden_files:
    - "任何 VCPChat 文件。"
    - "任何 VCPToolBox 文件。"
    - "任何 .env / config.env / secret / token / cookie / password 文件。"
    - "任何 package manifest 或 lockfile。"
    - "任何图片、运行日志或客户资产文件。"
  allowed_creation_actions:
    - create_agent_image_lab_local_script_file
    - create_sanitized_creation_record
    - add_validator_for_created_script
    - run_static_syntax_or_policy_checks
  forbidden_creation_actions:
    - launch_vcpchat
    - access_cdp_endpoint
    - call_bridge_loadSession
    - call_bridge_previewDraft
    - call_bridge_submitDraft
    - call_bridge_cancel
    - read_vcpchat_source
    - modify_vcpchat_source
    - modify_vcptoolbox_source
    - call_plugin
    - call_api
    - call_dailynote
    - write_vcp_memory
    - create_image
    - install_dependency
    - push_or_tag_or_release
  required_default_behavior:
    dry_run: true
    execute: false
    app_launch: false
    cdp_access: false
    bridge_method_invocation: false
    writes_outside_workspace: false
  validation_requirements:
    - git_status_short_branch
    - git_diff_check
    - powershell_syntax_check_if_script_created
    - no_secret_scan
    - no_raw_local_path_scan
    - no_execution_flag_true_scan
    - v7_42_authorization_package_validator
  rollback_path:
    - "删除本次新增的 Agent Image Lab 本地脚本和记录文件。"
    - "不触碰 VCPChat / VCPToolBox。"
    - "不执行远端回滚，除非未来有单独 remote authorization。"
  reviewer: "<required-human-reviewer>"
  stop_conditions:
    - target_file_already_exists_with_unknown_content
    - script_would_auto_launch_vcpchat
    - script_would_access_cdp_without_execute_authorization
    - script_would_call_bridge_methods
    - script_would_read_or_modify_vcpchat
    - script_would_read_or_modify_vcptoolbox
    - script_would_read_env_or_secret
    - script_would_persist_raw_local_path_or_cdp_endpoint
    - dependency_change_required
    - remote_write_required
```

## Approval Request Text

如果用户要进入真实脚本创建，最小批准语句应该类似：

```text
我明确授权创建 Agent Image Lab 本地脚本 scripts/run_vcpchat_review_console_remote_debug_smoke.ps1。
只允许创建该脚本和对应记录/validator/checklist/agent_board 更新。
脚本必须默认 DryRun=true、Execute=false。
创建后不得启动 VCPChat、不得访问 CDP、不得调用 bridge 方法、不得读取或修改 VCPChat/VCPToolBox、不得调用插件/API/DailyNote、不得写 VCP memory、不得创建图片、不得 push/tag/release。
```

## This Phase Boundary

```yaml
this_phase_boundary:
  package_record_created: true
  package_active: false
  script_creation_authorized_by_this_phase: false
  remote_debug_script_created: false
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
  vcptoolbox_modified_by_this_phase: false
  tag_created: false
  push_performed: false
  github_release_performed: false
```

## Acceptance Meaning

v7.42 只表示真实 remote-debug 脚本创建前的授权包模板已经准备好，并且下一步创建真实脚本已经到达需要明确审批的边界。它不代表授权包已经激活，也不代表脚本已创建、可运行、可启动 VCPChat、可访问 CDP，或可进入 A5 production execution。
