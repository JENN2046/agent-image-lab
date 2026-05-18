# v7.253 Static Review Surface Mockup Spec Gate

```yaml
gate_template:
  phase: v7.253_static_review_surface_mockup_spec_gate
  phase_zh: 静态审片台 mockup 规格门
  base_contract: AGENTS.md
  mode: A4
  intent: local_implementation
  risk_level: R1
  allowed_files:
    - docs/v7_253_static_review_surface_mockup_spec_gate.md
    - docs/static_review_surface_mockup_spec.md
    - README.md
    - docs/00_project_roadmap.md
    - PROJECT_MASTER_PLAN.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/BLOCKERS.md
    - .agent_board/VALIDATION_LOG.md
    - scripts/validate_current_state_alignment.js
  validation:
    required:
      - git status -sb
      - git diff --check
      - node scripts/validate_agent_board_state.js
      - node --check scripts/validate_current_state_alignment.js
      - node scripts/validate_current_state_alignment.js
  explicit_non_authorization:
    generation: false
    plugin_call: false
    provider_contact: false
    runtime: false
    memory_write: false
    DailyNote_write: false
```

## Executive Verdict

```yaml
overall_status: pass
current_status: failed_no_image_repeated_quota_or_rate_limit
route_3_meaning_zh: 继续停止生成
screen_regions_defined: true
static_fixture_shape_defined: true
copy_rules_defined: true
disabled_action_reasons_defined: true
acceptance_mapping_defined: true
ready_for_offline_static_mockup_file: true
ready_for_runtime_implementation: false
A5_execution_allowed_now: false
provider_contact_allowed_now: false
plugin_call_allowed_now: false
image_generation_allowed_now: false
runtime_execution_allowed_now: false
memory_write_allowed_now: false
recommended_next: v7.254_static_review_surface_mockup_file_gate
recommended_next_zh: 静态审片台 mockup 文件门
```

## What This Defines

v7.253 defines the paper specification for the next static Review Surface
mockup file. It fixes regions, fixture shape, copy rules, and disabled action
reasons before any actual static file is created.

中文意思：

```text
这一步只写“静态界面稿说明书”。下一步才可以创建离线静态 HTML 文件。
现在仍然不写 HTML，不接 runtime，不生成图片。
```

## Required Mockup Scope

```yaml
mockup_scope:
  file_type_next: standalone_offline_static_html
  external_assets_allowed: false
  scripts_allowed_next: inline_static_only
  runtime_import_allowed: false
  provider_or_plugin_button_enabled: false
  memory_write_button_enabled: false
```

## Closeout Template

```yaml
closeout:
  phase: v7.253_static_review_surface_mockup_spec_gate
  screen_regions_defined: true
  static_fixture_shape_defined: true
  copy_rules_defined: true
  disabled_action_reasons_defined: true
  acceptance_mapping_defined: true
  route_3_continued_stop_preserved: true
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  runtime_execution: false
  memory_write: false
  recommended_next: v7.254_static_review_surface_mockup_file_gate
```
