# v0.6.56 - Exact New-Trial 003 Accepted Samples Metadata Registration

```yaml
gate_template:
  phase: v0_6_56_exact_new_trial_003_accepted_samples_metadata_registration
  base_contract: AGENTS.md
  mode: A5
  intent: local_implementation
  risk_level: R2
  lane: Amber_E_exact_production_metadata_write
  allowed_files:
    - accepted_samples/accepted_sample_registry.yaml
    - accepted_samples/categories/fashion_lookbook_portrait.yaml
    - docs/V0_6_56_EXACT_NEW_TRIAL_003_ACCEPTED_SAMPLES_METADATA_REGISTRATION.md
    - reports/visual_asset_eval_dry_run/v0_6_56_exact_new_trial_003_accepted_samples_metadata_registration.json
    - tests/schema_examples/exact_new_trial_003_accepted_samples_metadata_registration.example.json
    - tests/schema_examples/exact_new_trial_003_accepted_samples_metadata_registration_fail.example.json
    - scripts/validate_exact_new_trial_003_accepted_samples_metadata_registration.js
  forbidden_files:
    - runs/**
    - asset_archive/**
    - production_candidates/**
    - failure_samples/**
    - .env
    - config.env
  allowed_actions:
    - append one exact accepted-sample metadata entry
    - append one exact category index reference
    - validate duplicate absence, approval evidence, and downstream write locks
  forbidden_actions:
    - image binary copy or modification
    - archive write
    - production candidate write
    - DailyNote write
    - VCP memory write
    - provider/API/plugin call
    - secret read
    - commit, push, tag, release, deploy
  validation:
    required:
      - node --check scripts/validate_exact_new_trial_003_accepted_samples_metadata_registration.js
      - node scripts/validate_exact_new_trial_003_accepted_samples_metadata_registration.js
      - npm run validate:mvp
      - git diff --check
    forbidden:
      - provider/API/plugin execution
      - DailyNote/VCP memory write
      - archive or production candidate write
  commit:
    allowed: false
    message: null
  push:
    allowed: false
```

## Phase Difference

This phase performs the exact accepted-sample metadata registration unlocked by
v0.6.55. It adds only local metadata for:

```text
sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
candidate_id: v0_3_3_exact_new_trial_003_shot_2
category: fashion_lookbook_portrait
artifact_sha256: 8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b
approved_by: Jenn
```

It does not copy or read image binaries. It uses the prior provider receipt hash
and the v0.6.55 approval evidence as the registration evidence chain.

## Amber Receipt

```yaml
task_id: v0_6_56_exact_new_trial_003_accepted_samples_metadata_registration
lane: Amber_E_exact_production_metadata_write
envelope_id: smart_standing_authorization_v3_default_envelope
action_performed: appended one accepted sample metadata record and category index reference
target_systems:
  - local_accepted_samples_registry
calls_used:
  provider: 0
  plugin: 0
  api: 0
  image_generation: 0
files_written:
  - accepted_samples/accepted_sample_registry.yaml
  - accepted_samples/categories/fashion_lookbook_portrait.yaml
dependency_actions_used: 0
validation_run:
  - node scripts/validate_exact_new_trial_003_accepted_samples_metadata_registration.js
validation_result: pending_until_validator_run
rollback_or_cleanup_available: true
next_auto_step_allowed: true
stop_reason: null
```

## Boundary State

```text
phase: v0_6_56_exact_new_trial_003_accepted_samples_metadata_registration
status: completed_validated_accepted_samples_metadata_registration_only
source_phase: v0_6_55_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture
active_current_phase: v0_3_3_first_live_generation_pilot
resume_guard_source_phase: v0_3_2_live_candidate_action_packet
next_red_decision: inspect_failed_provider_tool_attempt_or_authorize_new_trial
target_candidate_id: v0_3_3_exact_new_trial_003_shot_2
target_sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
category: fashion_lookbook_portrait
approved_by: Jenn
artifact_sha256: 8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b
accepted_samples_metadata_registered: true
category_index_updated: true
image_file_copy_performed: false
runs_source_image_modified: false
archive_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
provider_contact_performed: false
image_generation_performed: false
secret_value_read_performed: false
push_allowed: false
```

Recommended next:

```text
prepare_exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration
```
