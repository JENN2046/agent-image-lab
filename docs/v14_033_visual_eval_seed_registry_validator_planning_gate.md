# V14.033 Visual Eval Seed Registry Validator Planning Gate

```yaml
phase: v14_033_visual_eval_seed_registry_validator_planning_gate
base_contract: AGENTS.md
mode: A4.8 docs-only validator planning gate
intent: planning
risk_level: R1
source_phase: v14_032_visual_eval_seed_registry_schema_draft_gate
source_commit: 0d9620e04befc21a633153b60ff664c7ceec51c6
selected_product_route: B_visual_eval_and_failure_taxonomy_planning
```

## Purpose

V14.033 plans the local registry-validator contract for the metadata-only
visual-evaluation seed registry created in v14.032. The validator should prove
that the registry schema and example remain fixture-index records only: accepted
and rejected seed references are present, fixture refs stay under
`tests/schema_examples/`, safety defaults remain false, and no real image,
provider, manifest, memory, or production path is implied.

This is a planning gate only. It does not create or modify validator scripts,
change MVP wiring, alter schemas, alter examples, ingest seeds, write
`accepted_samples`, read image binaries, call providers, call plugins, call
APIs, write DailyNote, write VCP memory, start runtime, or promote any
production candidate.

## Future Validator Target

```yaml
future_validator_target:
  proposed_validator_path: scripts/validate_visual_eval_seed_registry_schema.js
  proposed_mvp_wiring_path: scripts/validate_mvp.ps1
  implementation_allowed_now: false
  validator_script_created_now: false
  validator_wiring_changed_now: false
  registry_schema_modified_now: false
  registry_example_modified_now: false
```

A dedicated registry validator is preferred over widening
`scripts/validate_visual_eval_seed_record_schema.js` because the registry has
cross-fixture reference checks that are distinct from a single seed-record
schema check.

## Planned Checks

```yaml
required_file_checks:
  - schemas/visual_eval_seed_registry.schema.yaml exists
  - tests/schema_examples/visual_eval_seed_registry.example.yaml exists
  - tests/schema_examples/visual_eval_seed_record.example.yaml exists
  - tests/schema_examples/visual_eval_seed_record.rejected.example.yaml exists

registry_shape_checks:
  - top_level_visual_eval_seed_registry_present
  - registry_id_present
  - registry_version_present
  - created_from_phase_present
  - selected_product_route_present
  - registry_scope_present
  - accepted_seed_records_non_empty
  - rejected_seed_records_non_empty
  - calibration_scope_present
  - safety_defaults_present
  - boundary_flags_present

fixture_reference_checks:
  - all_fixture_refs_repo_relative
  - all_fixture_refs_under_tests_schema_examples
  - no_fixture_ref_points_to_runs
  - no_fixture_ref_points_to_accepted_samples
  - referenced_fixture_files_exist
  - registry_seed_ids_match_fixture_seed_ids
  - accepted_fixture_ref_points_to_visual_eval_seed_record_example
  - rejected_fixture_ref_points_to_visual_eval_seed_record_rejected_example
```

## Safety Checks

```yaml
safety_default_checks:
  - memory_suitability_default_false
  - production_candidate_eligible_default_false
  - provider_contact_allowed_false
  - plugin_call_authorized_false
  - api_call_authorized_false
  - image_generation_authorized_false
  - daily_note_write_authorized_false
  - vcp_memory_write_authorized_false

boundary_flag_checks:
  - image_binary_included_false
  - real_provider_payload_included_false
  - private_path_included_false
  - external_manifest_included_false
  - runtime_execution_authorized_false
  - seed_ingestion_authorized_false
  - accepted_samples_write_authorized_false
  - memory_write_authorized_false
  - memory_write_path_included_false
  - production_candidate_authorized_false
  - plugin_call_authorized_false
  - api_call_authorized_false
  - daily_note_write_authorized_false
```

The validator should also scan schema and example text for private paths,
secret-bearing markers, image binary extensions, `runs/real_generation`, raw
provider payload wording as an included value, real manifest refs, VCPChat or
VCPToolBox refs, and external URL references.

## Decision Rules

```text
accepted_entries_may_have_empty_failure_tags: true
rejected_entries_must_have_non_empty_failure_tags: true
accepted_entries_must_use_accepted_reference_decision: true
rejected_entries_must_use_rejected_reference_decision: true
registry_must_not_authorize_seed_ingestion: true
registry_must_not_authorize_accepted_samples_write: true
registry_must_not_authorize_memory_or_production: true
registry_must_not_authorize_plugin_api_or_daily_note: true
```

## Blocked Boundaries

```text
validator_script_created: false
validator_script_modified: false
validator_wiring_modified: false
schema_files_modified: false
example_files_modified: false
seed_ingestion_created: false
accepted_samples_written: false
image_binaries_read: false
browser_preview_started: false
dev_server_started: false
live_server_started: false
localhost_runtime_started: false
runtime_execution: false
provider_contact: false
plugin_call: false
api_call: false
image_generation: false
retry: false
env_local_secret_value_read: false
DailyNote_write: false
VCP_memory_write: false
memory_write: false
runs_image_binary_read: false
runs_output_committed: false
production_candidate_002: false
memory_write_path: false
Batch_005: false
dependency_change: false
package_json_modified: false
package_lock_modified: false
```

## Future Handoff

```text
feeds_visual_eval_seed_registry_validator_implementation_later: true
validator_script_created_now: false
validator_modified_now: false
mvp_validator_wiring_changed_now: false
schema_files_modified_now: false
example_files_modified_now: false
seed_ingestion_created_now: false
real_samples_created_now: false
image_binaries_read_now: false
```

## Recommended Next

```text
recommended_next: v14_034_visual_eval_seed_registry_validator_implementation_gate
local_registry_validator_implementation_only: true
runtime_provider_image_memory_production_batch: false
next_phase_started: false
```
