# v0.6.35 Exact New-Trial 003 Post-Approval Registration Preflight Draft

```yaml
phase: v0_6_35_exact_new_trial_003_post_approval_registration_preflight_draft
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
execution_mode: accepted_samples_metadata_registration_preflight_draft_only
```

## Purpose

Prebuild the exact future `accepted_samples` metadata registration preflight for
the selected `exact_new_trial_003` `shot_2` candidate without pretending that
human approval has already been captured.

This phase does not capture approval, does not write `accepted_samples`, and
does not mark the candidate as registration-eligible yet.

## Current Draft Decision

```yaml
draft_status: blocked
blocker: human_approval_missing
candidate_attempt_id: v0_3_3_exact_new_trial_003_shot_2
proposed_sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
category: fashion_lookbook_portrait
approval_intake_package_ref: reports/visual_asset_eval_dry_run/v0_6_33_exact_new_trial_003_selected_candidate_human_approval_intake_package.json
post_approval_gate_alignment_ref: reports/visual_asset_eval_dry_run/v0_6_34_exact_new_trial_003_selected_candidate_post_approval_gate_alignment.json
human_approval_status: pending
approval_statement_source_is_user_submission: false
human_approval_captured_now: false
accepted_samples_registration_eligible: false
```

## Future Registration Payload

```yaml
proposed_registry_write_target:
  sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
  registry_ref: accepted_samples/accepted_sample_registry.yaml
  category_index_ref: accepted_samples/categories/fashion_lookbook_portrait.yaml
  category: fashion_lookbook_portrait
  artifact_locator_scope: project_relative_runs
  verification_mode: local_file_hash
  portable_after_clone: false
  image_files_committed_to_git: false
```

## Future Eligibility Requirements

```yaml
required_before_accepted_samples_write:
  - v0.6.29 selected candidate closeout evidence still matches artifact hash and dimensions
  - v0.6.32 human review still selects shot_2
  - v0.6.33 exact approval statement is used
  - v0.6.34 post-approval gate still requires Jenn-submitted approval capture
  - human approval must be submitted by Jenn rather than fixture-only local text
  - approval_statement_source_is_user_submission=true
  - human_approval_captured_now=true
  - registry duplicate remains absent
  - category duplicate remains absent
  - allowed write set remains exactly accepted_samples/accepted_sample_registry.yaml and accepted_samples/categories/fashion_lookbook_portrait.yaml
  - no image copy, no runs source image modification, no production_candidate, no failure_samples, no DailyNote, no VCP memory
```

## Guard

```yaml
accepted_samples_metadata_registration_preflight_draft_only: true
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
image_generation_performed: false
env_or_secret_read_performed: false
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

This phase freezes the exact future registration payload shape and proves the
current blocker is still external human approval, not missing local metadata
design. It does not execute any `accepted_samples` registration.
