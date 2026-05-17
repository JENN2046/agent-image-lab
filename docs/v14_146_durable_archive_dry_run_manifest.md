# v14.146 Durable Archive Dry-Run Manifest

```yaml
phase: v14_146_durable_archive_dry_run_manifest
base_contract: AGENTS.md
mode: A4_8_safe_project_operator_rail
intent: local_implementation
risk_level: R2
source_phase: v14_145_sample_lifecycle_state_machine
status: completed_validated
```

## Purpose

This phase creates a local dry-run contract for a future durable archive write.
It proves that a recoverable accepted sample can be mapped to a planned archive
manifest without copying image binaries, creating an archive directory, or
promoting anything to `production_candidate`.

```yaml
durable_archive_dry_run_manifest_created: true
schema_ref: schemas/durable_archive_dry_run_manifest.schema.yaml
fixture_ref: tests/schema_examples/v14_146_durable_archive_dry_run_manifest.example.yaml
validator_ref: scripts/validate_v14_146_durable_archive_dry_run_manifest.js
source_sample_id: accepted_womens_resort_relaxed_knit_codex_v2_001
source_lifecycle_state: recoverable
planned_archive_root_ref: asset_archive/accepted/fashion_lookbook_portrait/accepted_womens_resort_relaxed_knit_codex_v2_001/
archive_ready: false
archive_dry_run_ready: true
```

## Boundary

```yaml
dry_run_only: true
authorization_granted_by_this_record: false
archive_manifest_written: false
image_binary_copy_performed: false
target_archive_directory_created: false
target_archive_artifact_created: false
runs_source_image_modified: false
accepted_samples_write_performed: false
failure_samples_write_performed: false
production_candidate_created: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
push_tag_release_deploy_performed: false
```

## Verified Evidence Chain

```yaml
registry_to_import_record_verified: true
registry_to_review_record_verified: true
registry_to_category_index_verified: true
human_approval_verified: true
artifact_sha256_verified: true
artifact_dimensions_verified: true
artifact_mime_verified: true
target_path_project_relative: true
target_path_inside_asset_archive: true
target_archive_does_not_exist: true
```

## Negative Cases

```yaml
negative_case_missing_recoverability_blocks_manifest: true
negative_case_hash_mismatch_blocks_manifest: true
negative_case_target_path_escape_blocks_manifest: true
negative_case_absolute_target_path_blocks_manifest: true
negative_case_existing_archive_target_requires_A5_review: true
```

## Validation

```text
node --check scripts/validate_v14_146_durable_archive_dry_run_manifest.js
node scripts/validate_v14_146_durable_archive_dry_run_manifest.js
```

## Commander Decision

```yaml
next_safe_cycle: v14_147_production_candidate_eligibility_preflight
reason: >
  The durable archive path now has a local dry-run manifest and validator. The
  next safe stage is a local production candidate eligibility preflight that
  still does not write production_candidate metadata.
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```
