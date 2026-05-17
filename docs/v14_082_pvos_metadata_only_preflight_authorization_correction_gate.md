# V14.082 PVOS Metadata-Only Preflight Authorization Correction Gate

```yaml
phase: v14_082_pvos_metadata_only_preflight_authorization_correction_gate
base_contract: AGENTS.md
mode: A5_preflight_only_after_explicit_human_approval
intent: local_preflight
risk_level: R3
source_phase: v14_081_pvos_evidence_collector_blocker_exact_A5_authorization_package_gate
source_commit: bc74a6f
authorization_package_id: AUTH-PENDING-PVOS-EVIDENCE-BLOCKER-20260517-001
authorization_status: approved_for_metadata_only_preflight
approval_status: approved_for_preflight_only
active_A5_generation_authorization_created: false
execute_now_generation: false
```

## Purpose

This gate corrects the v14.081 package boundary so the approved preflight can
perform its actual job: prove that required local configuration fields exist
before any future real generation decision.

The correction is intentionally narrow. `.env.local` remains forbidden for
secret-value reading. It is allowed only as a metadata source for the runner's
`readEnvFieldNames()` preflight check, which confirms file existence and required
field names without returning, printing, retaining, copying, committing,
transmitting, or loading any value.

## Boundary Correction

```yaml
corrected_preflight_boundary:
  package_id: AUTH-PENDING-PVOS-EVIDENCE-BLOCKER-20260517-001
  corrected_from: v14_081
  corrected_by: v14_082
  .env.local_status_before: forbidden_path
  .env.local_status_after: metadata_only_preflight_allowed_path
  allowed_metadata:
    - env_file_exists_boolean
    - required_field_names_presence
    - env_fields_present_count
    - env_fields_total_count
    - missing_required_field_names
  forbidden_env_access:
    - read_secret_values
    - print_secret_values
    - retain_secret_values
    - copy_secret_values
    - write_secret_values_to_process_env
    - loadDotEnv
    - publish_or_commit_env_file
    - store_raw_env_lines
```

## Corrected Exact Authorization Package

```yaml
a5_authorization_package:
  authorization_package_id: AUTH-PENDING-PVOS-EVIDENCE-BLOCKER-20260517-001
  package_type: pvos_evidence_collector_blocker_to_native_doubao_metadata_only_preflight
  status: approved_for_metadata_only_preflight
  approval_status: approved_for_preflight_only
  reviewer: Jenn
  version: v2_metadata_only_preflight_correction

  target_systems:
    - agent_image_lab_project_local_native_doubao_generation_runner
    - pvos_evidence_collector_blocker_pipeline

  exact_allowed_paths:
    - kernel/pvos_evidence_collector_blocker_pipeline.js
    - schemas/pvos_evidence_collector_blocker_pipeline.schema.yaml
    - scripts/validate_pvos_evidence_collector_blocker_pipeline.js
    - tests/schema_examples/pvos_evidence_collector_blocker_pipeline.example.json
    - prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml
    - plugins/image_generation/native_doubao_image/plugin.profile.yaml
    - scripts/run_native_doubao_image_generation.js
    - .env.local
    - runs/real_generation/v14_081_pvos_premium_portable_led_camping_lantern_first_trial/

  env_metadata_only_allowed_paths:
    - .env.local

  env_metadata_only_allowed_operations:
    - readEnvFieldNames
    - check_env_file_exists
    - compare_required_field_names
    - return_env_field_counts
    - return_missing_required_field_names

  forbidden_paths:
    - .env
    - config.env
    - real_VCPChat_source
    - real_VCPToolBox_source
    - real_plugin_manifest
    - accepted_samples/
    - production_candidate_002
    - runs/real_generation/* except runs/real_generation/v14_081_pvos_premium_portable_led_camping_lantern_first_trial/

  forbidden_env_operations:
    - loadDotEnv
    - loadEnvLocal
    - process.env mutation
    - read value after equals sign as a secret
    - print value after equals sign
    - store raw env line
    - copy .env.local content
    - commit .env.local

  allowed_commands:
    - node scripts/run_native_doubao_image_generation.js --prompt-package-ref=prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml --plugin-profile-ref=plugins/image_generation/native_doubao_image/plugin.profile.yaml --output-directory=runs/real_generation/v14_081_pvos_premium_portable_led_camping_lantern_first_trial/ --model=doubao-seedream-5-0-260128 --max-plugin-calls=1 --max-images-created=1 --retry-allowed=false --dry-run=true --execution-authorized=false --a5-activation-ref=AUTH-PENDING-PVOS-EVIDENCE-BLOCKER-20260517-001

  forbidden_commands:
    - --dry-run=false
    - --execution-authorized=true
    - provider_contact
    - plugin_call
    - api_call
    - image_generation
    - env_value_read
    - output_directory_creation
    - DailyNote_write
    - VCP_memory_write
    - accepted_samples_write
    - production_candidate_write
    - real_manifest_read
    - VCPChat_runtime
    - VCPToolBox_runtime
    - push
    - tag
    - release
    - deploy

  selected_plugin_id: NativeDoubaoImage
  selected_plugin_command: generate
  selected_plugin_model: doubao-seedream-5-0-260128
  max_plugin_calls: 1
  max_images_created: 1
  retry_limit: 0
  retry_allowed: false
  input_reference: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml
  output_directory_ref: runs/real_generation/v14_081_pvos_premium_portable_led_camping_lantern_first_trial/
  overwrite_existing_files_allowed: false
  daily_note_direct_write_allowed: false
  memory_delta_only: true
```

## Explicit Non-Authorization

```yaml
not_authorized_by_v14_082:
  A5_generation_execution: false
  provider_contact: false
  plugin_call: false
  api_call: false
  image_generation: false
  runtime_execution: false
  env_value_read: false
  output_directory_creation: false
  output_write: false
  raw_stdout_or_stderr_capture: false
  raw_provider_payload_capture: false
  accepted_samples_write: false
  production_candidate_write: false
  DailyNote_write: false
  VCP_memory_write: false
  VCPChat_runtime: false
  VCPToolBox_runtime: false
  real_manifest_read: false
  real_VCPChat_read: false
  real_VCPToolBox_read: false
  CDP_or_bridge_or_MCP: false
  push_tag_release_deploy: false
```

## Preflight Result

```yaml
preflight_result:
  status: DRY_RUN_ONLY
  command_run: node scripts/run_native_doubao_image_generation.js --prompt-package-ref=prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml --plugin-profile-ref=plugins/image_generation/native_doubao_image/plugin.profile.yaml --output-directory=runs/real_generation/v14_081_pvos_premium_portable_led_camping_lantern_first_trial/ --model=doubao-seedream-5-0-260128 --max-plugin-calls=1 --max-images-created=1 --retry-allowed=false --dry-run=true --execution-authorized=false --a5-activation-ref=AUTH-PENDING-PVOS-EVIDENCE-BLOCKER-20260517-001
  preflight_passed: true
  issues: []
  env_file_exists: true
  env_file_ignored: true
  env_fields_present: 5
  env_fields_total: 5
  adapter_status: DRY_RUN_ONLY
  provider_contact_performed: false
  plugin_call_performed: false
  api_call_performed: false
  image_generation_performed: false
  image_count: 0
  env_value_read_performed: false
  api_key_value_printed: false
  output_directory_created: false
  output_file_written: false
  local_files_written_count: 0
  local_files_verified_count: 0
  DailyNote_write_performed: false
  VCP_memory_write_performed: false
```

## Validation Plan

```text
node --check scripts/validate_v14_082_pvos_metadata_only_preflight_authorization_correction.js
node scripts/validate_v14_082_pvos_metadata_only_preflight_authorization_correction.js
node scripts/validate_v14_081_pvos_exact_a5_authorization_package.js
node scripts/validate_native_doubao_sandbox.js
git diff --check
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```

## Recommended Next

```yaml
recommended_next:
  phase: wait_for_next_explicit_A5_decision
  zh: metadata-only dry-run preflight 已通过；等待下一次明确 A5 决策
  auto_execution_allowed: false
  hard_stop_after_preflight: true
```
