# v0.6.58 Exact New-Trial 003 Durable Archive Write Authorization Package After Metadata Preflight

```yaml
phase: v0_6_58_exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R1
execution_mode: durable_archive_write_authorization_package_only
```

## Purpose

Convert the v0.6.57 archive metadata preflight into a precise local durable
archive write authorization package for the accepted exact-new-trial 003
`shot_2` sample.

This phase prepares the execution envelope only. It does not read the image
binary, copy the image, write `asset_archive/`, generate a preview, create a
production candidate, write DailyNote, or write VCP memory.

## Authorization Package

```yaml
package_type: durable_archive_write_authorization
package_status: authorization_package_ready_execution_not_performed
authorization_model: smart_standing_authorization_v3_default_real_class_allowed
target_sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
target_candidate_id: v0_3_3_exact_new_trial_003_shot_2
category: fashion_lookbook_portrait
accepted_sample_registration_completed: true
archive_metadata_preflight_compiled: true
archive_write_authorization_package_prepared: true
archive_write_authorized_next: true
execution_allowed_now: false
```

## Exact Future Execution Scope

```yaml
source_artifact_ref: runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png
source_artifact_hash_ref: 8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b
source_dimensions:
  width: 941
  height: 1672
verified_mime: image/png
exact_allowed_write_paths:
  - asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001/manifest.json
  - asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001/original.png
  - asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001/preview.webp
overwrite_existing_files_allowed: false
max_write_files: 3
max_image_binary_reads: 1
max_runtime_probe_minutes: 10
```

## Validation And Rollback

```yaml
validation_required_for_future_execution:
  - target archive paths must be absent before write
  - source image sha256 must equal 8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b
  - manifest must bind sample id, candidate id, approval evidence, source hash, source dimensions, and generated archive file refs
  - archive validator must pass after write
  - git diff --check must pass
  - npm run validate:mvp must pass
rollback_or_cleanup_plan:
  - remove only the exact new asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001/ directory if future execution fails before validation
  - do not remove or modify accepted_samples registry entries
  - do not modify runs/real_generation source artifacts
stop_conditions:
  - any target archive path already exists
  - source hash mismatch
  - preview generation requires new dependency or broad runtime change
  - more than three archive files would be written
  - secret/private path exposure
  - production candidate, DailyNote, or VCP memory scope expansion
```

## Guard

```yaml
authorization_package_only: true
archive_write_performed: false
durable_archive_manifest_write_performed: false
durable_archive_copy_performed: false
image_binary_read_performed: false
image_file_copy_performed: false
preview_generation_performed: false
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
secret_value_read_performed: false
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

## Closeout

The exact archive write authorization package is prepared. The next safe task is
an execution preflight that checks target path absence and source hash before
any actual archive write. This phase itself performed no archive write.
