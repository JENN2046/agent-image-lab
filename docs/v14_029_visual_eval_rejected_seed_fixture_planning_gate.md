# V14.029 Visual Eval Rejected Seed Fixture Planning Gate

```yaml
phase: v14_029_visual_eval_rejected_seed_fixture_planning_gate
base_contract: AGENTS.md
mode: A4.8 fixture planning gate
intent: planning
risk_level: R1
source_phase: v14_028_visual_eval_seed_record_validator_implementation_gate
source_commit: 5a096473a83a5a4cd0ef796725c91141c7c7421a
selected_product_route: B_visual_eval_and_failure_taxonomy_planning
```

## Purpose

V14.029 plans a rejected-reference synthetic fixture for the visual-evaluation
seed record schema. The accepted-reference fixture proves the positive seed
shape; the rejected-reference fixture should prove failure-tag and rejection
note coverage without using real images, customer material, provider payloads,
or private paths.

This is a planning gate only. It does not create fixture files, modify the
validator, ingest seed records, read image binaries, create accepted or rejected
registries, write `accepted_samples`, call providers, call plugins, call APIs,
write DailyNote, write VCP memory, start runtime, or promote any production
candidate.

## Future Fixture Target

```yaml
future_fixture_target:
  proposed_example_path: tests/schema_examples/visual_eval_seed_record.rejected.example.yaml
  proposed_validator_path: scripts/validate_visual_eval_seed_record_schema.js
  implementation_allowed_now: false
  fixture_file_created_now: false
  validator_modified_now: false
  mvp_validator_wiring_changed_now: false
```

The proposed fixture path is a future local synthetic example target only. It
is not created by this phase.

## Rejected Fixture Requirements

```text
source_type: synthetic_fixture
intended_decision: rejected_candidate_reference
seed_category: known_failure_pattern
linked_rubric_dimensions_must_be_non_empty: true
linked_failure_tags_must_be_non_empty: true
review_note_must_explain_rejection_without_private_material: true
redaction_status: redacted_metadata_only
memory_suitability_default: false
production_candidate_eligible_default: false
boundary_flags_must_remain_false: true
```

The rejected fixture should be useful for calibration while remaining
metadata-only. It should name a generic failure pattern such as product identity
loss, composition obstruction, text/logo artifact, material mismatch, or
geometry defect.

## Future Validator Extension

```yaml
future_validator_extension:
  accepted_fixture_still_required: true
  rejected_fixture_required: true
  rejected_fixture_failure_tags_non_empty_check: true
  rejected_fixture_rejection_note_check: true
  rejected_fixture_safe_defaults_check: true
  rejected_fixture_boundary_flags_check: true
  sensitive_material_absence_check: true
```

Future implementation should keep the validator dependency-free and read-only.
It may extend the existing script to validate both accepted and rejected
fixtures.

## Blocked Boundaries

```text
fixture_file_created: false
validator_script_modified: false
validator_wiring_modified: false
schema_files_modified: false
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
feeds_visual_eval_rejected_seed_fixture_implementation_later: true
fixture_file_created_now: false
validator_modified_now: false
mvp_validator_wiring_changed_now: false
seed_ingestion_created_now: false
real_samples_created_now: false
registries_created_now: false
image_binaries_read_now: false
```

## Recommended Next

```text
recommended_next: v14_030_visual_eval_rejected_seed_fixture_implementation_gate
local_fixture_and_validator_extension_only: true
runtime_provider_image_memory_production_batch: false
next_phase_started: false
```
