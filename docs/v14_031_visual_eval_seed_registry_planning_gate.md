# V14.031 Visual Eval Seed Registry Planning Gate

```yaml
phase: v14_031_visual_eval_seed_registry_planning_gate
base_contract: AGENTS.md
mode: A4.8 registry planning gate
intent: planning
risk_level: R1
source_phase: v14_030_visual_eval_rejected_seed_fixture_implementation_gate
source_commit: 118699a9ecef2a78ef9b13b77252e1d8f993eb10
selected_product_route: B_visual_eval_and_failure_taxonomy_planning
```

## Purpose

V14.031 plans a metadata-only visual-evaluation seed registry. The registry is
a future index of accepted and rejected seed-record examples for calibration
and validator coverage. It should reference seed IDs and fixture file refs, not
real image binaries, private source paths, provider payloads, or production
assets.

This is a planning gate only. It does not create registry files, modify schemas,
modify validators, ingest seed records, read image binaries, write
`accepted_samples`, call providers, call plugins, call APIs, write DailyNote,
write VCP memory, start runtime, or promote any production candidate.

## Future Registry Target

```yaml
future_registry_target:
  proposed_schema_path: schemas/visual_eval_seed_registry.schema.yaml
  proposed_example_path: tests/schema_examples/visual_eval_seed_registry.example.yaml
  proposed_validator_path: scripts/validate_visual_eval_seed_record_schema.js
  implementation_allowed_now: false
  registry_schema_created_now: false
  registry_example_created_now: false
  validator_modified_now: false
  mvp_validator_wiring_changed_now: false
```

The proposed registry files are future local metadata targets only. They are
not created by this phase.

## Registry Field Plan

```yaml
required_registry_fields:
  - registry_id
  - registry_version
  - created_from_phase
  - accepted_seed_records
  - rejected_seed_records
  - calibration_scope
  - safety_defaults
```

The registry should separate accepted and rejected seed references so validators
can require at least one of each without changing the seed-record schema.

## Seed Reference Plan

```yaml
seed_reference_fields:
  - seed_id
  - fixture_ref
  - intended_decision
  - linked_rubric_dimensions
  - linked_failure_tags
  - redaction_status
```

Future fixture refs must point only to repository-local synthetic metadata
fixtures under `tests/schema_examples/`. They must not point to `runs/`, image
files, external manifests, real VCPChat paths, real VCPToolBox paths, or private
local paths.

## Registry Validation Plan

```text
accepted_seed_records_must_be_non_empty: true
rejected_seed_records_must_be_non_empty: true
all_fixture_refs_must_stay_under_tests_schema_examples: true
all_seed_ids_must_match_fixture_seed_ids: true
accepted_entries_must_not_require_failure_tags: true
rejected_entries_must_include_failure_tags: true
safety_defaults_must_remain_false: true
image_binary_paths_must_be_absent: true
provider_payloads_must_be_absent: true
memory_write_authorization_must_be_absent: true
production_candidate_authorization_must_be_absent: true
```

## Blocked Boundaries

```text
registry_schema_created: false
registry_example_created: false
validator_script_modified: false
validator_wiring_modified: false
seed_ingestion_created: false
accepted_registry_created: false
rejected_registry_created: false
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
feeds_visual_eval_seed_registry_schema_draft_later: true
registry_schema_created_now: false
registry_example_created_now: false
validator_modified_now: false
mvp_validator_wiring_changed_now: false
seed_ingestion_created_now: false
real_samples_created_now: false
image_binaries_read_now: false
```

## Recommended Next

```text
recommended_next: v14_032_visual_eval_seed_registry_schema_draft_gate
local_registry_schema_and_example_only: true
runtime_provider_image_memory_production_batch: false
next_phase_started: false
```
