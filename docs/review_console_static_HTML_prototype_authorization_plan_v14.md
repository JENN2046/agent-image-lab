# Review Console Static HTML Prototype Authorization Plan v14

```yaml
plan_id: review_console_static_HTML_prototype_authorization_plan_v14
source_phase: v14_009_review_console_static_HTML_prototype_authorization_planning_gate
source_commit: 942719ecdf60a79df034071b03c6860e4d092a10
selected_option: static_HTML_prototype_authorization_planning
status: docs_only_authorization_plan
```

## Authorization Purpose

This plan defines the future authorization boundary for an isolated static HTML
prototype of the Review Console.

It does not authorize static HTML creation now.

## Future Exact File Allowlist

```yaml
future_exact_file_allowlist_proposal:
  html: review_console/static_prototype/review_console_v14.html
  css: review_console/static_prototype/review_console_v14.css
  js: review_console/static_prototype/review_console_v14.js
  fixture: review_console/static_prototype/review_console_v14_fixture.json
```

Future implementation must stage these exact files only plus explicitly allowed
status docs. `git add .` remains forbidden.

## Static-Only Boundary

```yaml
static_only_boundary:
  static_only: true
  runtime_integration: false
  CDP: false
  bridge: false
  MCP: false
  external_API: false
  provider_call: false
  image_generation: false
  memory_write: false
  accepted_samples_write: false
  runs_image_binary_read: false
  dependency_addition: false
  package_json_change: false
  package_lock_change: false
```

The prototype may render fixture text into cards, tables, filters, and panels.
It must not execute project workflows.

## Fixture Policy

```yaml
fixture_policy:
  file: review_console/static_prototype/review_console_v14_fixture.json
  allowed_record_ids:
    - premium_portable_led_camping_lantern_v13_013
    - premium_serum_bottle_v10_011
  source_basis:
    - docs/review_console_rendered_console_fixture_v14.md
    - docs/review_console_rendered_console_v14.md
  synthetic_text_only: true
  includes_image_binary: false
  copies_source_output: false
  contains_secrets: false
  runtime_data: false
  includes_safety_boundary_fields: true
```

Allowed fixture values include text references to `source_output` paths. Those
paths must remain strings only.

## Required Safety Fields

```yaml
required_safety_fields:
  provider_contact: false
  image_generation: false
  retry: false
  env_local_secret_value_read: false
  memory_write: false
  accepted_samples_written: false
  runs_output_committed: false
  runs_image_binary_read: false
  real_retouch_execution: false
  production_candidate_002: false
```

## Forbidden Sources and Actions

```yaml
forbidden:
  read_runs_image_binary: true
  copy_runs_output: true
  stage_runs_output: true
  read_env_local: true
  print_secret: true
  call_provider: true
  call_external_API: true
  generate_image: true
  write_memory: true
  write_accepted_samples: true
  execute_retouch: true
  execute_delivery: true
  modify_scripts: true
  modify_prompt_package: true
  modify_package_json_or_lockfile: true
  add_dependency: true
  start_runtime: true
```

## Future Validation Plan

```yaml
future_validation_plan:
  static_file_checks:
    - git diff --check
    - exact diff review
    - no forbidden staged paths
    - node --check review_console/static_prototype/review_console_v14.js
  boundary_checks:
    - no package.json / package-lock.json change
    - no scripts change
    - no prompt package change
    - no image binary read
    - no provider contact
  project_checks:
    - node scripts/validate_agent_board_state.js
    - node scripts/validate_current_state_alignment.js
    - node scripts/validate_native_doubao_sandbox.js
    - node scripts/validate_prompt_schema.js --manifest tests/fixtures/prompt_schema_validator/manifest.json
    - powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
    - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```

## Human Route Options

```yaml
options_presented:
  - authorize_static_HTML_prototype_creation
  - stop_before_static_HTML_prototype
  - accepted_samples_entry_policy_planning
  - visual_memory_suitability_planning
recommended_option: authorize_static_HTML_prototype_creation
backup_option: accepted_samples_entry_policy_planning
human_decision_required: true
```

## Current Non-Authorization

```yaml
current_non_authorization:
  static_HTML_created: false
  CSS_created: false
  JS_created: false
  frontend_files_created: false
  UI_implementation_started: false
  runtime_execution: false
  runs_image_binary_read: false
```
