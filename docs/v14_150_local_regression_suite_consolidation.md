# v14.150 Local Regression Suite Consolidation

```yaml
phase: v14_150_local_regression_suite_consolidation
base_contract: AGENTS.md
mode: A4_8_safe_project_operator_rail
intent: local_implementation
risk_level: R2
source_phase: v14_149_authorization_package_compiler
status: completed_validated
```

## Purpose

This phase adds a local regression suite runner for v14.141-v14.149 artifact
lifecycle validators. It consolidates validator scheduling without weakening
the existing checks.

```yaml
local_regression_suite_consolidated: true
schema_ref: schemas/local_regression_suite.schema.yaml
manifest_ref: tests/schema_examples/v14_150_local_regression_suite_manifest.example.yaml
runner_ref: scripts/run_v14_local_regression_suite.js
validator_ref: scripts/validate_v14_150_local_regression_suite_consolidation.js
validator_count: 9
passed_count: 9
failed_count: 0
output_file_write_performed: false
```

## Included Validators

```yaml
included_phases:
  - v14_141_recoverability_core_extraction
  - v14_142_multi_accepted_sample_matrix
  - v14_143_import_review_registry_schema_hardening
  - v14_144_review_console_schema_binding
  - v14_145_sample_lifecycle_state_machine
  - v14_146_durable_archive_dry_run_manifest
  - v14_147_production_candidate_eligibility_preflight
  - v14_148_memory_delta_draft_package
  - v14_149_authorization_package_compiler
```

## Negative Cases

```yaml
negative_case_missing_validator_blocks_suite: true
negative_case_child_failure_blocks_suite: true
negative_case_output_file_write_blocks_suite: true
negative_case_external_action_flag_blocks_suite: true
```

## Explicit Non-Authorization

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
accepted_samples_write_performed: false
failure_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
push_tag_release_deploy_performed: false
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

## Validation

```text
node --check scripts/run_v14_local_regression_suite.js
node --check scripts/validate_v14_150_local_regression_suite_consolidation.js
node scripts/validate_v14_150_local_regression_suite_consolidation.js
```

## Commander Decision

```yaml
next_safe_cycle: v14_151_dry_run_vcp_adapter_contract_v1
reason: >
  The local validator suite now has a single runner for the artifact lifecycle
  chain. The next safe stage is a dry-run VCP adapter contract that still does
  not read real VCPChat, VCPToolBox, or manifest sources.
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```
