# v0.6.41 Exact New-Trial 003 Memory Delta Draft Package

```yaml
phase: v0_6_41_exact_new_trial_003_memory_delta_draft_package
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
execution_mode: exact_new_trial_memory_delta_draft_package_only
```

## Purpose

Produce the first exact-new-trial 003 local `memory_delta` draft package for
the selected `shot_2` candidate.

This phase creates a Chinese draft-only package for future DailyNote and VCP
memory writes. It does not write `DailyNote`, write `VCP memory`, change
`accepted_samples`, create archive files, or promote the candidate into
production.

## Decision

```yaml
memory_delta_draft_package_created: true
draft_package_ref: reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_memory_delta_draft.yaml
fixture_ref: tests/schema_examples/exact_new_trial_003_memory_delta_draft_package.example.yaml
validator_ref: scripts/validate_exact_new_trial_003_memory_delta_draft_package.js
target_sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
target_candidate_id: v0_3_3_exact_new_trial_003_shot_2
category: fashion_lookbook_portrait
memory_suitability_status: deferred
daily_note_draft_language: zh-CN
vcp_memory_draft_language: zh-CN
write_mode: draft
approval_required: true
approval_status: pending
should_write_to_vcp: false
execution_allowed_now: false
```

## Draft Source Chain

```yaml
human_review_ref: reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json
shot_2_closeout_ref: reports/visual_asset_eval_dry_run/v0_6_29_exact_new_trial_003_shot_2_execution_closeout.json
prompt_package_ref: prompts/image_generation/safe_adult_editorial_portrait_v1.yaml
production_candidate_preflight_ref: reports/visual_asset_eval_dry_run/v0_6_39_exact_new_trial_003_production_candidate_authorization_compiler_output_preflight.json
memory_authorization_preflight_ref: reports/visual_asset_eval_dry_run/v0_6_40_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_preflight.json
accepted_sample_registration_completed: false
durable_archive_ready: false
production_candidate_ready: false
daily_note_write_authorized: false
vcp_memory_write_authorized: false
```

## Verified Draft Content

```yaml
daily_note_draft_cn_present: true
vcp_memory_draft_cn_present: true
selection_rationale_reflected: true
watch_items_reflected: true
memory_delta_source_chain_verified: true
memory_authorization_preflight_still_passes: true
production_candidate_preflight_still_passes: true
exact_new_trial_human_review_still_passes: true
```

## Negative Cases

```yaml
negative_case_non_chinese_daily_note_body_blocks_package: true
negative_case_should_write_to_vcp_true_without_authorization_blocks_package: true
negative_case_approval_granted_without_A5_blocks_package: true
negative_case_raw_sensitive_content_blocks_package: true
negative_case_image_binary_reference_blocks_package: true
negative_case_execution_allowed_now_true_blocks_package: true
```

## Explicit Non-Authorization

```yaml
authorization_granted_by_this_package: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
direct_memory_write_performed: false
accepted_samples_write_performed: false
failure_samples_write_performed: false
archive_write_performed: false
production_candidate_write_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
image_binary_included: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
push_tag_release_deploy_performed: false
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

## Closeout

The exact-new-trial memory path now has a concrete Chinese draft-only package
for the selected `shot_2` candidate. It still cannot write DailyNote or VCP
memory because approval, `accepted_samples` registration, archive completion,
production readiness, and the future sensitive-data scan remain incomplete.
