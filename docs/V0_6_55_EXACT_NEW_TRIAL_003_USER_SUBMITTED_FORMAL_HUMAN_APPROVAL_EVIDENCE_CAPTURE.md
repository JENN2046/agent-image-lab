# v0.6.55 - Exact New-Trial 003 User-Submitted Formal Human Approval Evidence Capture

```yaml
gate_template:
  phase: v0_6_55_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture
  base_contract: AGENTS.md
  mode: A5
  intent: local_implementation
  risk_level: R2
  lane: Amber_E_production_metadata_evidence_capture
  allowed_files:
    - docs/V0_6_55_EXACT_NEW_TRIAL_003_USER_SUBMITTED_FORMAL_HUMAN_APPROVAL_EVIDENCE_CAPTURE.md
    - reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_user_submitted_formal_human_approval_evidence.json
    - reports/visual_asset_eval_dry_run/v0_6_55_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture.json
    - tests/schema_examples/exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture.example.json
    - tests/schema_examples/exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture_fail.example.json
    - scripts/validate_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture.js
  forbidden_files:
    - accepted_samples/**
    - asset_archive/**
    - production_candidates/**
    - memory/**
    - .env
    - config.env
  allowed_actions:
    - capture the current user-submitted Jenn approval evidence as structured local metadata
    - validate the evidence binding to the exact candidate, sample id, and artifact hash
    - unlock only the next accepted-sample metadata registration task
  forbidden_actions:
    - archive write
    - production candidate write
    - DailyNote write
    - VCP memory write
    - provider contact
    - plugin/API call
    - image generation
    - secret read
    - commit, push, tag, release, deploy
  validation:
    required:
      - node --check scripts/validate_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture.js
      - node scripts/validate_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture.js
      - npm run validate:mvp
      - git diff --check
    forbidden:
      - provider/API/plugin execution
      - DailyNote/VCP memory write
      - accepted-sample registration in this phase
  commit:
    allowed: false
    message: null
  push:
    allowed: false
  explicit_non_authorization:
    generation: false
    plugin_call: false
    provider_contact: false
    runtime: false
    memory_write: false
    DailyNote_write: false
    archive_write: false
    production_candidate_write: false
```

## Phase Difference

This phase captures the real Jenn approval evidence supplied in the current
thread and binds it to selected `shot_2`:

- `candidate_id: v0_3_3_exact_new_trial_003_shot_2`
- `sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001`
- `artifact_sha256: 8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b`
- `submitted_by: Jenn`

The capture resolves the v0.6.54 blocker:

```text
approval_submission_present_now: true
approval_statement_source_is_user_submission: true
formal_human_approval_captured_now: true
accepted_samples_registration_ready_now: true
registration_unlock_allowed_now: true
next_write_action_allowed_now: true
next_write_scope: accepted_samples_metadata_registration_only
```

It does not perform the next write. The accepted-sample metadata registration is
the next safe task, not part of this phase.

## Amber Envelope

```yaml
task_id: v0_6_55_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture
intent: capture real user-submitted formal approval evidence
target_systems:
  - local_repository_metadata
exact_allowed_paths_or_objects:
  - reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_user_submitted_formal_human_approval_evidence.json
  - reports/visual_asset_eval_dry_run/v0_6_55_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture.json
forbidden_paths_or_objects:
  - accepted_samples/**
  - asset_archive/**
  - production_candidates/**
  - DailyNote
  - VCP memory
allowed_commands_or_operations:
  - local file write for structured approval evidence
  - local validator execution
max_write_count: 6
max_provider_calls: 0
max_plugin_calls: 0
max_api_calls: 0
max_image_candidates: 0
input_reference: current user message containing Jenn approval evidence
output_directory_or_write_target: reports/human_approval_evidence
overwrite_existing_files_allowed: false
secret_value_read_allowed: false
raw_private_data_print_allowed: false
rollback_or_cleanup_plan: remove the v0.6.55 added local files before any commit
validation_required: true
stop_conditions:
  - target id mismatch
  - sample id mismatch
  - artifact hash mismatch
  - reviewer mismatch
  - attempted accepted_samples/archive/production/DailyNote/VCP memory write
  - provider/API/plugin call
  - secret read
  - validation failure requiring judgment
evidence_to_record:
  - structured approval evidence JSON
  - phase report JSON
  - validator output
```

## Receipt

```yaml
task_id: v0_6_55_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture
lane: Amber_E_production_metadata_evidence_capture
envelope_id: smart_standing_authorization_v3_default_envelope
action_performed: captured structured local Jenn approval evidence from current user submission
target_systems:
  - local_repository_metadata
calls_used:
  provider: 0
  plugin: 0
  api: 0
  image_generation: 0
files_read:
  - reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_formal_human_approval_evidence_ingestion_packet.json
files_written:
  - reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_user_submitted_formal_human_approval_evidence.json
  - reports/visual_asset_eval_dry_run/v0_6_55_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture.json
dependency_actions_used: 0
validation_run:
  - node scripts/validate_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture.js
validation_result: pending_until_validator_run
rollback_or_cleanup_available: true
next_auto_step_allowed: true
stop_reason: null
```

## Boundary State

```text
phase: v0_6_55_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture
status: completed_validated_user_submitted_formal_human_approval_evidence_captured_pending_accepted_sample_registration
source_phase: v0_6_54_exact_new_trial_003_formal_human_approval_evidence_ingestion_packet
active_current_phase: v0_3_3_first_live_generation_pilot
target_candidate_id: v0_3_3_exact_new_trial_003_shot_2
target_sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
required_reviewer: Jenn
submitted_by: Jenn
artifact_sha256: 8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b
approval_submission_present_now: true
approval_statement_source_is_user_submission: true
formal_human_approval_captured_now: true
accepted_samples_registration_ready_now: true
registration_unlock_allowed_now: true
next_write_action_allowed_now: true
next_write_scope: accepted_samples_metadata_registration_only
accepted_samples_write_performed: false
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
execute_exact_new_trial_003_accepted_samples_metadata_registration_only
```
