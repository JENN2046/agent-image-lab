# v0.6.34 Exact New-Trial 003 Selected Candidate Post-Approval Gate Alignment

```yaml
phase: v0_6_34_exact_new_trial_003_selected_candidate_post_approval_gate_alignment
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
execution_mode: post_approval_gate_alignment_only
```

## Purpose

Lock the future `accepted_samples` registration gate for the selected
`exact_new_trial_003` `shot_2` candidate before any write is allowed.

This phase does not capture human approval, does not write
`accepted_samples`, and does not treat the candidate as already accepted.

## Current Decision

```yaml
gate_status: blocked
blocker: human_approval_missing
candidate_attempt_id: v0_3_3_exact_new_trial_003_shot_2
proposed_sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
category: fashion_lookbook_portrait
approval_intake_package_ref: reports/visual_asset_eval_dry_run/v0_6_33_exact_new_trial_003_selected_candidate_human_approval_intake_package.json
approval_intake_validator_ref: scripts/validate_exact_new_trial_003_selected_candidate_human_approval_intake_package.js
approval_statement_matches_v0_6_33: true
approval_statement_source_is_user_submission: false
human_approval_captured_now: false
registration_unlocks_only_after_external_user_approval: true
accepted_samples_registration_ready_now: false
```

## Future Registration Gate

```yaml
required_before_accepted_samples_write:
  - v0.6.32 selected candidate still remains shot_2
  - v0.6.29 selected candidate closeout evidence still matches artifact hash and dimensions
  - v0.6.33 exact approval statement is used
  - future approval capture must come from Jenn rather than fixture-only local text
  - future approval capture reports approval_statement_source_is_user_submission=true
  - future approval capture reports human_approval_captured_now=true
  - allowed write set remains exactly accepted_samples/accepted_sample_registry.yaml and accepted_samples/categories/fashion_lookbook_portrait.yaml
  - no image copy, no runs source image modification, no production_candidate, no failure_samples, no DailyNote, no VCP memory
```

## Guard

```yaml
post_approval_gate_alignment_only: true
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

This phase narrows the future registration gate to one exact selected candidate,
one exact sample id, one exact category file, and one exact human-approval
capture condition. It does not execute any accepted-sample registration or
prove VCP runtime integration.
