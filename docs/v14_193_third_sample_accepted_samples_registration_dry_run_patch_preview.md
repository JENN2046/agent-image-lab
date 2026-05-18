# v14.193 Third Sample accepted_samples Registration Dry-run Patch Preview

```yaml
phase: v14_193_third_sample_accepted_samples_registration_dry_run_patch_preview
base_contract: AGENTS.md
mode: A4.8
intent: local_draft
risk_level: R2
execution_mode: accepted_samples_registration_dry_run_patch_preview_only
```

## Purpose

Prepare the exact dry-run metadata patch that would register the lamp candidate
as the third accepted sample after Jenn approval and a separate exact
authorization. This phase does not write `accepted_samples` metadata and does
not treat the lamp candidate as accepted.

## Dry-run Status

```yaml
dry_run_status: blocked_pending_human_approval
target_sample_id: accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001
target_candidate_id: v14_166_lamp_v3_generated_candidate_001
category: product_still_life
source_import_record_ref: tests/schema_examples/v14_166_lamp_v3_generated_candidate_import_record.json
source_review_record_ref: docs/v14_166_lamp_v3_generated_candidate_readiness.md
source_authorization_package_ref: tests/schema_examples/v14_190_third_sample_accepted_samples_registration_authorization_package_draft.example.json
artifact_ref: runs/real_generation/v14_166_codex_session_premium_portable_led_camping_lantern_v3_generation_trial/codex_session_v14_166_premium_portable_led_camping_lantern_v3_candidate_001.png
verified_sha256: eaa52095be5af66854f80ba3f6a0b94c93bc1105e6e7ecf984b8dfb3dfff275c
verified_dimensions: 1254x1254
verified_mime: image/png
human_approval_status: pending
approved_by: null
registration_executable_now: false
```

## Would Modify After Approval

```yaml
would_modify_files:
  - accepted_samples/accepted_sample_registry.yaml
  - accepted_samples/categories/product_still_life.yaml
sample_count_delta_after_execution: 1
category_index_sample_count_after_execution: 2
```

## Guard

```yaml
dry_run_only: true
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
push_tag_release_deploy_performed: false
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

## Closeout

This phase narrows the future write set and proposed metadata but does not
grant authorization, approve the candidate, write `accepted_samples`, copy image
files, promote production_candidate, write memory, or prove VCP runtime
integration.
