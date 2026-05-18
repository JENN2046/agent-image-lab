# v14.143 Import Review Registry Schema Hardening

```yaml
phase: v14_143_import_review_registry_schema_hardening
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
status: completed_validated
source_phase: v14_142_multi_accepted_sample_matrix
validator_created: scripts/validate_v14_143_import_review_registry_schema_hardening.js
mvp_validator_updated: scripts/validate_mvp.ps1
import_schema_recoverability_contract_hardened: true
review_schema_artifact_link_fields_hardened: true
accepted_registry_schema_created: true
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

v14.143 hardens the local schema contracts that sit under recoverability:

- `schemas/codex_session_image_import.schema.yaml` now declares the
  project-relative artifact locator and verified local file requirements.
- `schemas/local_review_record.schema.yaml` now declares artifact link fields
  and states that pending human review is not approval.
- `schemas/accepted_sample_registry.schema.yaml` now defines full
  recoverability metadata, category index metadata, legacy partial policy, and
  non-authorization boundaries.

This is schema hardening only. It does not modify `accepted_samples/`, copy
images, generate images, call providers/plugins/APIs/MCP, write memory, promote
production candidates, or read real VCP systems.

## Validation Evidence

```yaml
real_import_record_contract_verified: true
real_review_record_contract_verified: true
registry_full_recoverability_metadata_verified: true
category_index_full_recoverability_metadata_verified: true
v14_142_matrix_validator_still_passes: true
v14_142_negative_matrix_still_covers_schema_failures: true
full_recoverability_count_is_currently_two: true
```

## Negative Coverage

v14.143 delegates the actual recoverability failure matrix to the v14.142
validator and verifies it remains active:

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

## Next

```yaml
recommended_next: v14_144_review_console_schema_binding
recommended_next_auto_execution_allowed: true_after_v14_143_local_commit
```
