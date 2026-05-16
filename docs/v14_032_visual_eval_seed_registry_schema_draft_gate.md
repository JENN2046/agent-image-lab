# V14.032 Visual Eval Seed Registry Schema Draft Gate

```yaml
phase: v14_032_visual_eval_seed_registry_schema_draft_gate
base_contract: AGENTS.md
mode: A4.8 local schema draft gate
intent: local_implementation
risk_level: R1
source_phase: v14_031_visual_eval_seed_registry_planning_gate
source_commit: 1fa581b1333763d638fcd70747584cb59dfd7630
selected_product_route: B_visual_eval_and_failure_taxonomy_planning
```

## Purpose

V14.032 creates a metadata-only registry schema draft and one synthetic registry
example for visual-evaluation seed fixtures. The registry indexes accepted and
rejected seed-record fixtures by `seed_id` and repository-local fixture refs so
future validators can check calibration coverage without reading image binaries,
provider payloads, private paths, or production assets.

This phase does not ingest real seed records, modify validators, change MVP
validator wiring, write `accepted_samples`, read image binaries, call providers,
call plugins, call APIs, write DailyNote, write VCP memory, start runtime, or
promote any production candidate.

## Created Files

```yaml
created_files:
  registry_schema: schemas/visual_eval_seed_registry.schema.yaml
  registry_example: tests/schema_examples/visual_eval_seed_registry.example.yaml
  phase_record: docs/v14_032_visual_eval_seed_registry_schema_draft_gate.md
modified_status_surfaces:
  - README.md
  - docs/00_project_roadmap.md
  - PROJECT_MASTER_PLAN.md
  - .agent_board/HANDOFF.md
  - .agent_board/RUN_STATE.md
  - .agent_board/TASK_QUEUE.md
  - .agent_board/CHECKPOINT.md
validator_script_modified: false
validator_wiring_modified: false
```

## Registry Contract

```yaml
registry_required_fields:
  - registry_id
  - registry_version
  - created_from_phase
  - selected_product_route
  - accepted_seed_records
  - rejected_seed_records
  - calibration_scope
  - safety_defaults
  - boundary_flags
```

The registry separates accepted and rejected seed references so future validators
can require at least one of each. Each seed reference remains metadata-only and
points only to a synthetic fixture under `tests/schema_examples/`.

## Seed Reference Contract

```yaml
seed_reference_fields:
  - seed_id
  - fixture_ref
  - intended_decision
  - linked_rubric_dimensions
  - linked_failure_tags
  - redaction_status
  - validation_role
```

`fixture_ref` must remain repository-relative and local to
`tests/schema_examples/`. It must not point to `runs/`, image files, external
manifests, real VCPChat paths, real VCPToolBox paths, private local paths, or
provider payloads.

## Example Coverage

```yaml
example_registry:
  accepted_seed_records_count: 1
  rejected_seed_records_count: 1
  accepted_fixture_ref: tests/schema_examples/visual_eval_seed_record.example.yaml
  rejected_fixture_ref: tests/schema_examples/visual_eval_seed_record.rejected.example.yaml
  accepted_failure_tags_empty_allowed: true
  rejected_failure_tags_required: true
  memory_suitability_default: false
  production_candidate_eligible_default: false
```

The example is a fixture index only. It does not contain raw images, image
binary paths, private paths, provider payloads, secret-bearing values, or live
execution instructions.

## Validation Scope

```text
git diff --check: required
node scripts/validate_visual_eval_seed_record_schema.js: required_existing_validator_regression_check
node scripts/validate_agent_board_state.js: required
scripts/validate_mvp.ps1: required
scripts/validate-agent-image-lab-local.ps1: required
registry_validator_created_now: false
registry_validator_wired_now: false
```

The existing seed-record validator remains a regression check for the existing
schema and accepted/rejected fixtures. A future gate may extend or add a
registry-aware validator.

## Blocked Boundaries

```text
validator_script_modified: false
validator_wiring_modified: false
seed_ingestion_created: false
accepted_registry_from_real_samples_created: false
rejected_registry_from_real_samples_created: false
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
feeds_visual_eval_seed_registry_validator_planning_later: true
registry_schema_created_now: true
registry_example_created_now: true
validator_modified_now: false
mvp_validator_wiring_changed_now: false
seed_ingestion_created_now: false
real_samples_created_now: false
image_binaries_read_now: false
```

## Recommended Next

```text
recommended_next: v14_033_visual_eval_seed_registry_validator_planning_gate
local_registry_validator_planning_only: true
runtime_provider_image_memory_production_batch: false
next_phase_started: false
```
