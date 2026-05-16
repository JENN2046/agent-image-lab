# V14.030 Visual Eval Rejected Seed Fixture Implementation Gate

```yaml
phase: v14_030_visual_eval_rejected_seed_fixture_implementation_gate
base_contract: AGENTS.md
mode: A4.8 local fixture and validator extension gate
intent: local_implementation
risk_level: R2
source_phase: v14_029_visual_eval_rejected_seed_fixture_planning_gate
source_commit: 91391b909bf9a27feb18de17c9198485d0b04e55
selected_product_route: B_visual_eval_and_failure_taxonomy_planning
```

## Purpose

V14.030 implements the rejected-reference synthetic fixture planned by v14.029
and extends the visual-evaluation seed record validator to check both accepted
and rejected seed examples. This gives the schema draft coverage for positive
calibration records and failure-pattern calibration records.

This gate does not ingest real seed records, read image binaries, create
accepted or rejected registries, write `accepted_samples`, call providers, call
plugins, call APIs, write DailyNote, write VCP memory, start runtime, or promote
any production candidate.

## Implemented Files

```text
tests/schema_examples/visual_eval_seed_record.rejected.example.yaml
scripts/validate_visual_eval_seed_record_schema.js
scripts/validate_mvp.ps1
```

The rejected fixture is synthetic metadata only. It uses generic failure tags
and redacted references, not a real asset path or image binary.

## Validator Coverage Added

```yaml
validator_coverage_added:
  accepted_example_still_checked: true
  rejected_example_file_checked: true
  rejected_source_type_checked: true
  rejected_intended_decision_checked: true
  rejected_failure_tags_non_empty_checked: true
  rejected_review_note_context_checked: true
  rejected_safe_defaults_checked: true
  rejected_boundary_flags_checked: true
  sensitive_material_absence_checked: true
```

## Blocked Boundaries

```text
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

## Required Validation

```text
node --check scripts/validate_visual_eval_seed_record_schema.js
node scripts/validate_visual_eval_seed_record_schema.js
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
node scripts/validate_agent_board_state.js
git diff --check
```

## Future Handoff

```text
feeds_future_seed_registry_planning_later: true
rejected_fixture_created_now: true
validator_extended_now: true
mvp_validator_wiring_changed_now: true
seed_ingestion_created_now: false
real_samples_created_now: false
registries_created_now: false
image_binaries_read_now: false
```

## Recommended Next

```text
recommended_next: v14_031_visual_eval_seed_registry_planning_gate
docs_only_registry_planning_only: true
runtime_provider_image_memory_production_batch: false
next_phase_started: false
```
