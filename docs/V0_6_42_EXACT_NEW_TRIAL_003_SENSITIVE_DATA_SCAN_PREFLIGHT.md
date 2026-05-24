# v0.6.42 Exact New-Trial 003 Sensitive-Data Scan Preflight

```yaml
phase: v0_6_42_exact_new_trial_003_sensitive_data_scan_preflight
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
execution_mode: exact_new_trial_sensitive_data_scan_preflight_only
```

## Purpose

Produce the first exact-new-trial 003 local sensitive-data scan preflight for
the selected `shot_2` memory-delta draft package.

This phase scans the local Chinese `memory_delta` draft package only. It does
not write `DailyNote`, write `VCP memory`, change `accepted_samples`, create
archive files, or promote the candidate into production.

## Decision

```yaml
scan_preflight_created: true
scan_ref: reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_sensitive_data_scan.json
report_ref: reports/visual_asset_eval_dry_run/v0_6_42_exact_new_trial_003_sensitive_data_scan_preflight.json
validator_ref: scripts/validate_exact_new_trial_003_sensitive_data_scan_preflight.js
target_sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
target_candidate_id: v0_3_3_exact_new_trial_003_shot_2
category: fashion_lookbook_portrait
memory_delta_draft_present: true
sensitive_data_scan_present: true
scan_status: passed_local_no_sensitive_content_detected
execution_allowed_now: false
```

## Scan Scope

```yaml
memory_delta_draft_ref: reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_memory_delta_draft.yaml
memory_authorization_preflight_ref: reports/visual_asset_eval_dry_run/v0_6_40_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_preflight.json
scan_targets:
  - daily_note_draft.title_cn
  - daily_note_draft.body_cn
  - vcp_memory_draft.summary_cn
  - vcp_memory_draft.lessons_cn
  - memory_safety.contains_secret
  - memory_safety.contains_private_path
  - memory_safety.contains_customer_private_data
  - memory_safety.contains_image_binary
  - memory_safety.raw_sensitive_content_saved
contains_secret: false
contains_private_path: false
contains_customer_private_data: false
contains_image_binary: false
raw_sensitive_content_saved: false
```

## Explicit Non-Authorization

```yaml
daily_note_write_authorized: false
vcp_memory_write_authorized: false
accepted_sample_registration_completed: false
durable_archive_ready: false
production_candidate_ready: false
write_command_permission: false
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

The exact-new-trial memory path now has a concrete local sensitive-data scan
record for the selected `shot_2` draft package. The route is still blocked from
execution because human approval, `accepted_samples` registration, durable
archive completion, production readiness, and exact DailyNote / VCP memory
authorization are still absent.
