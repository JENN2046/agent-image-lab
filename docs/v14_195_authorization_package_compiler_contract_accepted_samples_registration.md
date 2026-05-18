# v14.195 Authorization Package Compiler Contract for accepted_samples Registration

```yaml
phase: v14_195_authorization_package_compiler_contract_accepted_samples_registration
base_contract: AGENTS.md
mode: A4.8
intent: local_draft
risk_level: R2
execution_mode: authorization_package_compiler_contract_only
```

## Purpose

Define the first local contract for an authorization package compiler. This
phase uses the blocked v14.194 execution preflight, the v14.193 dry-run patch
preview, and the v14.190 authorization draft as source evidence for one future
accepted_samples metadata registration package.

This phase does not grant the authorization package and does not write
accepted_samples metadata.

## Compiler Contract

```yaml
compiler_status: contract_ready_execution_blocked
package_type: accepted_samples_metadata_registration
source_preflight_ref: tests/schema_examples/v14_194_third_sample_accepted_samples_registration_execution_preflight.example.json
source_dry_run_patch_ref: tests/schema_examples/v14_193_third_sample_accepted_samples_registration_dry_run_patch_preview.example.json
source_authorization_draft_ref: tests/schema_examples/v14_190_third_sample_accepted_samples_registration_authorization_package_draft.example.json
compiled_package_id: AUTH-PENDING-LAMP-V14-166-ACCEPTED-SAMPLES-REGISTRATION-20260518-001
compiled_package_status: blocked_not_granted
execution_allowed_now: false
human_approval_status: pending
authorization_granted_by_this_record: false
```

## Target

```yaml
sample_id: accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001
candidate_id: v14_166_lamp_v3_generated_candidate_001
category: product_still_life
allowed_files_after_approval:
  - accepted_samples/accepted_sample_registry.yaml
  - accepted_samples/categories/product_still_life.yaml
```

## Required Before Execution

```yaml
required_before_execution:
  - Jenn human approval for lamp candidate
  - exact accepted_samples metadata write authorization
  - source preflight must remain blocked until approval
  - source dry-run patch must still match import/review/artifact evidence
  - validators must pass before and after the metadata write
```

## Guard

```yaml
compiler_only: true
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

This contract is ready as a local compiler input and validation target, but the
compiled package remains blocked. The next actual accepted_samples write still
requires Jenn human approval plus the exact authorization statement.
