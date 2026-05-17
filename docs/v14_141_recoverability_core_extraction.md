# V14.141 Recoverability Core Extraction

```yaml
phase: v14_141_recoverability_core_extraction
base_contract: AGENTS.md
mode: A4_8_safe_project_operator_rail
intent: local_implementation
risk_level: R2
source_phase: v14_140_two_week_regression_closeout
status: completed_validated
```

## Purpose

Extract the v14.131 real artifact recoverability checks into a reusable local
core module so later phases can validate multiple accepted samples without
copying single-sample logic into every stage validator.

This is local validator infrastructure only. It does not create images, copy
image binaries, read external manifests, call providers or plugins, write
DailyNote, write VCP memory, or create production candidates.

## Extraction Result

```yaml
recoverability_core_extracted: true
recoverability_core_ref: scripts/lib/artifact_recoverability_core.js
v14_131_validator_uses_recoverability_core: true
core_positive_chain_passes: true
core_negative_hash_mismatch_fails: true
core_negative_missing_artifact_fails: true
core_negative_missing_human_approval_fails: true
multi_sample_matrix_started: false
next_phase: v14_142_multi_accepted_sample_matrix
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

## Core Responsibilities

```yaml
core_exports:
  - createRecoverabilityCore
core_functions:
  - repoPath
  - exists
  - read
  - parseJson
  - sha256File
  - readPngDimensions
  - extractRegistrySampleBlock
  - validateRecordChain
validated_chain_fields:
  - import_id
  - provider_id
  - import_mode
  - prompt_package_ref
  - artifact_relative_path
  - artifact_sha256
  - artifact_file_exists
  - artifact_file_sha256_matches_record
  - artifact_width_height
  - artifact_mime
  - review_record_ref
  - image_case_id
  - human_approval_present
  - no_execution_guard_false_flags
```

## Explicit Non-Authorization

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
image_binary_copy_performed: false
runs_source_image_modified: false
accepted_samples_write_performed: false
failure_samples_write_performed: false
production_candidate_created: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
push_tag_release_deploy_performed: false
```

## Validation

```text
node --check scripts/lib/artifact_recoverability_core.js
node --check scripts/validate_v14_131_real_artifact_validation_and_accepted_sample_recoverability.js
node scripts/validate_v14_131_real_artifact_validation_and_accepted_sample_recoverability.js
node --check scripts/validate_v14_141_recoverability_core_extraction.js
node scripts/validate_v14_141_recoverability_core_extraction.js
git diff --check
node scripts/validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
```
