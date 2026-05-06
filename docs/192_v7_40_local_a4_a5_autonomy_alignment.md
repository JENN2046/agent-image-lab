# v7.40 Local A4/A5 Autonomy Mode Alignment

本文记录 v7.40 Local A4/A5 Autonomy Mode Alignment。目标是把项目根 `AGENTS.md` 中新的默认本地 A4 和生产级 A5 语义同步成可复查、可验证、可续跑的项目状态。

本阶段只做项目内文档、schema example、validator、索引和 `.agent_board` 对齐。不读取真实 VCPChat / VCPToolBox，不创建 remote-debug 脚本，不启动 VCPChat，不访问 CDP，不调用插件、API、DailyNote，不生成图片，不写 VCP 记忆，不执行 push、tag 或 release。

```yaml
status: planned_validated_v7_40_local_a4_a5_autonomy_alignment
version: v7.40
current_phase: "v7.40 local A4/A5 autonomy mode alignment"
validation_file: scripts/validate_v7_40_local_a4_a5_autonomy_alignment.js
current_head: 5a7f5ba
previous_phase: "v7.39 external remote-debug verification script creation authorization point"
previous_record: docs/191_v7_39_external_remote_debug_verification_script_creation_authorization_point.md
default_next_phase: "v7.41 External Remote Debug Verification Script Creation Record"
```

## Alignment Goal

```yaml
alignment_goal:
  root_agents_default_local_mode: "A4 — Sustained Local Autopilot"
  production_mode_name: "A5 — Autonomous Production Execution"
  a4_default_local_autopilot: true
  a5_real_production_execution: true
  a5_active_authorization_package_present: false
  a5_actions_authorized_now: false
  reason_cn: "v7.40 只把 A4/A5 权限语义对齐到项目轨道，不能被解释为进入真实生产执行。"
```

## A4 Meaning

```yaml
a4_meaning:
  local: true
  reversible: true
  project_root_only: true
  safe_project_surfaces:
    - documentation
    - schema
    - dry_run_contract
    - authorization_template
    - validation_checklist
    - static_prototype
    - agent_board
  can_continue_without_step_by_step_confirmation: true
  remote_write_allowed_by_a4: false
  real_external_read_allowed_by_a4: false
  real_plugin_call_allowed_by_a4: false
  daily_note_write_allowed_by_a4: false
  image_creation_allowed_by_a4: false
```

## A5 Meaning

```yaml
a5_meaning:
  production_grade_autonomous_execution: true
  requires_active_authorization_package: true
  examples:
    - read_real_vcpchat
    - read_real_vcptoolbox
    - analyze_real_source_code
    - modify_real_integration_code
    - create_real_ipc_preload_renderer
    - create_real_adapter_execution_entrypoint
    - read_real_plugin_manifest
    - call_real_vcp_plugin
    - generate_real_image
    - write_daily_note
    - write_vcp_memory
    - commit_production_changes
    - create_tags
    - push
    - generate_release_packages
  current_authorization:
    active: false
    authorized_by: null
    target_systems: []
    allowed_paths_or_objects: []
    allowed_commands_or_operations: []
    rollback_path: null
    reviewer: null
    stop_conditions: []
```

## Required A5 Authorization Package

未来进入任何 A5 动作前，授权包必须明确、可复查、范围足够窄。

```yaml
required_a5_authorization_package:
  authorization_id: "<required>"
  authorized_by: "<required>"
  authorized_at: "<required>"
  target_systems:
    - "<required>"
  exact_allowed_paths_or_objects:
    - "<required>"
  exact_allowed_commands_or_operations:
    - "<required>"
  forbidden_paths_or_operations:
    - "<required>"
  write_boundaries:
    - "<required>"
  validation_requirements:
    - "<required>"
  rollback_path: "<required>"
  reviewer: "<required>"
  stop_conditions:
    - "<required>"
```

## This Phase Boundary

```yaml
this_phase_boundary:
  a5_authorization_package_created: false
  a5_authorization_package_active: false
  real_vcpchat_read: false
  real_vcptoolbox_read: false
  real_manifest_read: false
  real_source_analyzed: false
  vcpchat_modified: false
  vcptoolbox_modified: false
  real_ipc_preload_renderer_created: false
  real_adapter_execution_entrypoint_created: false
  remote_debug_script_created: false
  app_launch_performed: false
  cdp_access_performed: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  production_commit_performed: false
  tag_created: false
  push_performed: false
  release_package_generated: false
  github_release_performed: false
```

## Acceptance Meaning

v7.40 表示项目的本地自动化默认值已经提升并固化为 A4，本地安全工作可以持续推进；同时 A5 被定义为真实生产级自动执行，必须依赖单独、明确、完整的授权包。

它不代表任何 A5 权限已经打开，不代表可以读取真实 VCPChat / VCPToolBox，不代表可以创建真实执行入口，不代表可以调用插件或写 DailyNote，也不代表可以 push、tag 或发布 release。
