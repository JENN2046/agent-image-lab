# v14.142 Multi Accepted Sample Matrix

```yaml
phase: v14_142_multi_accepted_sample_matrix
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
status: completed_validated
source_phase: v14_141_recoverability_core_extraction
validator_created: scripts/validate_v14_142_multi_accepted_sample_matrix.js
recoverability_core_ref: scripts/lib/artifact_recoverability_core.js
mvp_validator_updated: scripts/validate_mvp.ps1
accepted_samples_write_performed: false
image_binary_copy_performed: false
runs_source_image_modified: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
failure_samples_write_performed: false
production_candidate_created: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
push_tag_release_deploy_performed: false
vcp_runtime_integration_proven: false
artifact_recoverability_is_not_vcp_runtime_integration: true
```

## Purpose

v14.142 turns the v14.141 single-record recoverability core into a local
multi-sample matrix over the existing `accepted_samples` registry.

This phase does not register new accepted samples, copy image binaries, update
source images, promote a production candidate, write memory, read VCP runtime
systems, or call providers/plugins/APIs/MCP. It only reads project-local
metadata and local artifact files.

## Matrix Result

```yaml
multi_sample_matrix_created: true
registry_sample_count: 9
matrix_row_count: 9
category_count: 3
local_artifact_sample_count: 9
complete_recoverable_sample_count: 4
complete_recoverable_sample_ids:
  - accepted_womens_resort_relaxed_knit_codex_v2_001
  - accepted_fashion_lifestyle_woven_crossbody_bag_codex_v14_161_001
  - accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001
  - accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
legacy_partial_artifact_sample_count: 3
legacy_partial_artifact_sample_ids:
  - accepted_french_summer_rattan_bucket_bag_002_shot_1
  - accepted_french_summer_rattan_bucket_bag_003_shot_2
  - accepted_french_summer_rattan_bucket_bag_004_shot_3
full_recoverability_count_is_currently_four: true
```

The matrix deliberately keeps the old v7 accepted entries as partial, not full,
recoverability rows. Their image files exist locally, but they do not yet have
the v14.131+ import record / verified metadata / approval chain required for
full recoverability. This is a standards-preserving result: older samples are
visible to the matrix, but they are not silently upgraded.

## Core Extension

```yaml
recoverability_core_extensions:
  read_jpeg_dimensions: true
  read_image_metadata_png_or_jpeg: true
  list_registry_sample_blocks: true
  extract_scalar_registry_field: true
  extract_category_index_samples: true
```

These helpers support current PNG Codex-session samples and legacy JPG accepted
artifacts without adding dependencies or reading outside the repository.

## Negative Cases

```yaml
negative_case_artifact_missing_fails: true
negative_case_hash_mismatch_fails: true
negative_case_dimensions_mismatch_fails: true
negative_case_mime_mismatch_fails: true
negative_case_review_record_missing_fails: true
negative_case_human_approval_missing_fails: true
negative_case_category_index_missing_fails: true
negative_case_registry_category_mismatch_fails: true
```

## Boundary

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
accepted_samples_write_performed: false
image_binary_copy_performed: false
runs_source_image_modified: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
failure_samples_write_performed: false
production_candidate_created: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
push_tag_release_deploy_performed: false
vcp_runtime_integration_proven: false
artifact_recoverability_is_not_vcp_runtime_integration: true
```

## Next

```yaml
recommended_next: v14_143_import_review_registry_schema_hardening
recommended_next_auto_execution_allowed: true_after_v14_142_local_commit
```
