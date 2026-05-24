# v0.6.57 Exact New-Trial 003 Durable Archive Metadata Preflight After Accepted Sample Registration

```yaml
phase: v0_6_57_exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R1
execution_mode: durable_archive_metadata_preflight_only
```

## Purpose

Compile the local durable archive metadata preflight for the accepted
exact-new-trial 003 `shot_2` sample now that accepted-sample registration is
complete.

This phase does not read, copy, or write the image binary. It does not create an
archive manifest, production candidate, DailyNote entry, or VCP memory entry.

## Decision

```yaml
package_type: durable_archive_metadata_preflight
package_status: metadata_preflight_ready_archive_write_not_authorized
target_sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
target_candidate_id: v0_3_3_exact_new_trial_003_shot_2
category: fashion_lookbook_portrait
accepted_sample_registration_completed: true
archive_metadata_preflight_compiled: true
archive_write_authorized: false
archive_write_performed: false
image_binary_read_performed: false
image_file_copy_performed: false
overwrite_existing_files_allowed: false
execution_allowed_now: false
```

## Future Archive Target Metadata

```yaml
source_artifact_ref: runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png
source_artifact_hash_ref: 8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b
source_dimensions:
  width: 941
  height: 1672
verified_mime: image/png
target_archive_manifest_path: asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001/manifest.json
target_archive_original_path: asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001/original.png
target_archive_preview_path: asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001/preview.webp
exact_future_write_paths:
  - asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001/manifest.json
  - asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001/original.png
  - asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001/preview.webp
```

## Required Before Archive Write

```yaml
required_before_archive_write:
  - exact durable archive write authorization
  - target archive paths must not already exist unless overwrite is explicitly authorized
  - hash verification must be run against the source artifact during the archive write gate
  - rollback cleanup plan for the exact target archive directory
  - post-write manifest validation
  - human approval boundary must remain linked to Jenn approval evidence
```

## Guard

```yaml
preflight_only: true
durable_archive_manifest_write_performed: false
durable_archive_copy_performed: false
image_binary_read_performed: false
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
secret_value_read_performed: false
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

## Closeout

The archive metadata preflight is ready for a future exact archive write gate.
The next safe step is to prepare the exact durable archive write authorization
package; it must still not copy the image or write `asset_archive/` until that
future gate explicitly permits execution and validation.
