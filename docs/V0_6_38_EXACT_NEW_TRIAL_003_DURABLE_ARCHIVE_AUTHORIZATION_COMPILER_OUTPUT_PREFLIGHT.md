# v0.6.38 Exact New-Trial 003 Durable Archive Authorization Compiler Output Preflight

```yaml
phase: v0_6_38_exact_new_trial_003_durable_archive_authorization_compiler_output_preflight
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
execution_mode: durable_archive_authorization_compiler_output_preflight_only
```

## Purpose

Produce the exact-new-trial 003 durable archive compiler-output preflight for
the selected `shot_2` candidate.

This phase prepares the blocked archive package shape only. It does not copy
the PNG, write any archive manifest, or promote the candidate into
`accepted_samples`.

## Decision

```yaml
package_type: durable_archive
package_status: draft_blocked_missing_accepted_sample_registration_and_archive_copy_authorization
blocker: missing_accepted_sample_registration_and_archive_copy_authorization
target_sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
target_candidate_id: v0_3_3_exact_new_trial_003_shot_2
category: fashion_lookbook_portrait
accepted_sample_registration_completed: false
archive_copy_authorized: false
archive_copy_performed: false
target_archive_path_provided: false
write_command_permission: false
execution_allowed_now: false
```

## Blocked Target Scope

```yaml
source_artifact_ref: runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png
source_artifact_hash_ref: 8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b
accepted_sample_registry_ref: accepted_samples/accepted_sample_registry.yaml
accepted_sample_category_ref: accepted_samples/categories/fashion_lookbook_portrait.yaml
target_archive_path: null
hash_verification_required: true
exact_allowed_write_paths: []
forbidden_write_paths:
  - runs/real_generation/
  - accepted_samples/
  - failure_samples/
  - production_candidate/
  - DailyNote
  - VCP memory
```

## Required Before Execution

```yaml
required_before_execution:
  - Jenn human approval must already be captured through the exact_new_trial_003 shot_2 approval chain
  - exact accepted_samples registration for the selected shot_2 candidate must be completed first
  - Jenn exact A5 durable archive copy authorization
  - exact target archive path
  - hash verification requirement
  - rollback plan
  - reviewer
  - stop conditions
validation_required_before_execution:
  - git diff --check
  - node scripts/validate_exact_new_trial_003_durable_archive_authorization_compiler_output_preflight.js
  - node scripts/validate_exact_new_trial_003_accepted_samples_registration_execution_preflight.js
  - node scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js
  - node scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js
  - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```

## Guard

```yaml
preflight_only: true
durable_archive_copy_performed: false
image_file_copy_performed: false
runs_source_image_modified: false
accepted_samples_write_performed: false
category_index_write_performed: false
failure_samples_write_performed: false
production_candidate_write_performed: false
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

The durable archive package can now be compiled for exact-new-trial 003 as a
blocked local draft. It cannot execute until the selected candidate has really
entered `accepted_samples` and Jenn grants exact archive-copy authorization
with source artifact, target archive path, hash verification, rollback,
reviewer, validation, and stop conditions.
