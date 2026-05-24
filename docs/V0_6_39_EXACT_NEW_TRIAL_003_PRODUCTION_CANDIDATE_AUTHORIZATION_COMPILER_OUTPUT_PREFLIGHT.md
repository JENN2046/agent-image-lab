# v0.6.39 Exact New-Trial 003 Production Candidate Authorization Compiler Output Preflight

```yaml
phase: v0_6_39_exact_new_trial_003_production_candidate_authorization_compiler_output_preflight
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
execution_mode: production_candidate_authorization_compiler_output_preflight_only
```

## Purpose

Produce the exact-new-trial 003 production-candidate compiler-output preflight
for the selected `shot_2` candidate.

This phase prepares the blocked production-candidate package shape only. It
does not write `production/`, create production candidate review files, read
image binaries, or treat local artifact recoverability as VCP runtime
integration.

## Decision

```yaml
package_type: production_candidate
package_status: draft_blocked_missing_accepted_sample_registration_archive_completion_and_production_candidate_authorization
blocker: missing_accepted_sample_registration_archive_completion_and_production_candidate_authorization
target_sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
target_candidate_id: v0_3_3_exact_new_trial_003_shot_2
category: fashion_lookbook_portrait
accepted_sample_registration_completed: false
durable_archive_ready: false
production_candidate_authorized: false
production_candidate_write_performed: false
eligibility_preflight_present: false
write_command_permission: false
execution_allowed_now: false
```

## Blocked Target Scope

```yaml
accepted_sample_registry_ref: accepted_samples/accepted_sample_registry.yaml
accepted_sample_category_ref: accepted_samples/categories/fashion_lookbook_portrait.yaml
durable_archive_preflight_ref: reports/visual_asset_eval_dry_run/v0_6_38_exact_new_trial_003_durable_archive_authorization_compiler_output_preflight.json
expected_production_candidate_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001_production_candidate_001
exact_allowed_write_paths: []
forbidden_write_paths:
  - production/
  - runs/real_generation/
  - accepted_samples/
  - failure_samples/
  - asset_archive/
  - DailyNote
  - VCP memory
```

## Required Before Execution

```yaml
required_before_execution:
  - Jenn human approval must already be captured through the exact_new_trial_003 shot_2 approval chain
  - exact accepted_samples registration for the selected shot_2 candidate must be completed first
  - durable archive execution for the selected shot_2 accepted sample must be completed first
  - Jenn exact A5 production_candidate authorization
  - exact allowed production write paths
  - rollback plan
  - reviewer
  - stop conditions
validation_required_before_execution:
  - git diff --check
  - node scripts/validate_exact_new_trial_003_production_candidate_authorization_compiler_output_preflight.js
  - node scripts/validate_exact_new_trial_003_durable_archive_authorization_compiler_output_preflight.js
  - node scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js
  - node scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js
  - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```

## Guard

```yaml
preflight_only: true
production_candidate_write_performed: false
durable_archive_copy_performed: false
image_file_copy_performed: false
runs_source_image_modified: false
accepted_samples_write_performed: false
failure_samples_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
staging_performed: false
commit_performed: false
push_tag_release_deploy_performed: false
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

## Closeout

The production-candidate package can now be compiled for exact-new-trial 003 as
a blocked local draft. It cannot execute until the selected candidate has
really entered `accepted_samples`, the durable archive has actually completed,
and Jenn grants exact production-candidate authorization with allowed write
paths, reviewer, rollback, validation, and stop conditions.
