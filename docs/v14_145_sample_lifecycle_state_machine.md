# v14.145 Sample Lifecycle State Machine

```yaml
phase: v14_145_sample_lifecycle_state_machine
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
status: completed_validated
source_phase: v14_144_review_console_schema_binding
schema_ref: schemas/sample_lifecycle_state_machine.schema.yaml
validator_created: scripts/validate_v14_145_sample_lifecycle_state_machine.js
mvp_validator_updated: scripts/validate_mvp.ps1
sample_lifecycle_state_machine_created: true
current_sample_id: accepted_womens_resort_relaxed_knit_codex_v2_001
current_sample_state: recoverable
archive_ready: false
production_candidate_pending: false
accepted_sample_is_not_production_candidate: true
negative_case_missing_human_approval_blocks_accepted_metadata_registered: true
negative_case_missing_recoverability_blocks_archive_ready: true
negative_case_skip_archive_to_production_candidate_fails: true
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

## Lifecycle

```text
imported -> reviewed -> accepted_metadata_registered -> recoverable -> archive_ready -> production_candidate_pending
```

The current v14.105 accepted sample reaches `recoverable`. It does not reach
`archive_ready` because no durable archive manifest or archive execution exists.
It does not reach `production_candidate_pending` because production candidate
promotion still requires a separate A5 authorization.

## Guards

```yaml
reviewed_to_accepted_metadata_registered_requires_human_approval: true
accepted_metadata_registered_to_recoverable_requires_hash_dimensions_mime: true
recoverable_to_archive_ready_requires_durable_archive_manifest_or_A5_authorization: true
archive_ready_to_production_candidate_pending_requires_separate_A5_authorization: true
accepted_sample_direct_to_production_candidate_forbidden: true
```

## Next

```yaml
recommended_next: v14_146_durable_archive_dry_run_manifest
recommended_next_auto_execution_allowed: true_after_v14_145_local_commit
```
