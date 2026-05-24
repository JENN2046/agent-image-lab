# v0.6.37 Exact New-Trial 003 accepted_samples Registration Execution Preflight

```yaml
phase: v0_6_37_exact_new_trial_003_accepted_samples_registration_execution_preflight
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
execution_mode: accepted_samples_registration_execution_preflight_only
```

## Purpose

Combine the frozen shot_2 registration payload from `v0.6.35` and the exact
authorization wording from `v0.6.36` into one local go/no-go preflight.

This phase does not execute the metadata write. It determines whether the
future `accepted_samples` registration may proceed.

## Decision

```yaml
preflight_status: blocked
blocker: missing_human_approval_and_authorization_grant
target_sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
target_candidate_id: v0_3_3_exact_new_trial_003_shot_2
category: fashion_lookbook_portrait
human_approval_status: pending
approved_by: null
authorization_package_status: prepared_blocked_not_granted
authorization_granted_by_this_record: false
registration_preflight_draft_ready: true
execution_allowed_now: false
```

## Exact Future Write Scope

```yaml
allowed_files_after_approval:
  - accepted_samples/accepted_sample_registry.yaml
  - accepted_samples/categories/fashion_lookbook_portrait.yaml
forbidden_write_paths:
  - runs/real_generation/
  - failure_samples/
  - production_candidate/
  - DailyNote
  - VCP memory
```

## Required Before Execution

```yaml
required_before_execution:
  - Jenn human approval for the selected exact_new_trial_003 shot_2 candidate
  - exact accepted_samples metadata write authorization must be granted from the frozen v0.6.36 package wording
  - v0.6.35 registration preflight draft must still match artifact, review, and gate evidence
  - validators must pass before and after the metadata write
validation_required_before_execution:
  - git diff --check
  - node scripts/validate_exact_new_trial_003_accepted_samples_registration_execution_preflight.js
  - node scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js
  - node scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js
  - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```

## Guard

```yaml
preflight_only: true
accepted_samples_write_performed: false
category_index_write_performed: false
image_file_copy_performed: false
runs_source_image_modified: false
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

Current decision is blocked. This preflight is useful because it narrows the
future `accepted_samples` write to an exact two-file metadata operation, but it
does not approve the candidate or execute the registration.
