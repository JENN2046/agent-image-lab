# Visual Eval Review Result Protocol Fixture Draft

```yaml
phase: p2_12_metadata_only_review_result_protocol_fixture_draft
source_commit: 1637c8d
mode: A0_read_only_then_docs_only
risk_level: R1
selected_route: metadata_only_review_result_protocol_fixture_draft
```

## Purpose

This phase creates the first synthetic metadata-only fixture draft for the
Visual Eval Review Result Protocol contract.

The fixture is intentionally limited to pass, patch, and reject metadata
records. It does not create a schema, validator, runtime path, provider call,
plugin call, API call, image generation, memory write, DailyNote write,
accepted sample write, production candidate, dependency change, or Batch 005
action.

## Created Fixture

```yaml
fixture_created: tests/schema_examples/visual_eval_review_result_protocol.example.json
fixture_type: metadata_only_visual_eval_review_result_protocol
outcomes_included:
  - pass
  - patch
  - reject
source_contract: docs/visual_eval_review_result_protocol_contract_slice.md
source_planning: docs/visual_eval_review_result_protocol_fixture_planning.md
```

## Pass Fixture

```yaml
review_result_id: visual_eval_review_result_pass_synthetic_001
candidate_id: synthetic_product_still_life_pass_001
source_ref: tests/schema_examples/visual_eval_seed_record.example.yaml
outcome: pass
confidence_band: high
accepted_metadata_action: keep_as_metadata_candidate
route_guards_all_false_for_writes: true
```

## Patch Fixture

```yaml
review_result_id: visual_eval_review_result_patch_synthetic_001
candidate_id: synthetic_product_still_life_patch_001
source_ref: tests/schema_examples/visual_eval_seed_record.example.yaml
outcome: patch
confidence_band: medium
failure_tags:
  - material_failed
  - lighting_failed
next_review_action: write_patch_plan_only
route_guards_all_false_for_writes: true
```

## Reject Fixture

```yaml
review_result_id: visual_eval_review_result_reject_synthetic_001
candidate_id: synthetic_product_still_life_reject_001
source_ref: tests/schema_examples/visual_eval_seed_record.rejected.example.yaml
outcome: reject
confidence_band: high
failure_tags:
  - subject_drift
  - commercial_unusable
rejected_metadata_action: keep_as_failure_learning_metadata
never_production_reason_present: true
route_guards_all_false_for_writes: true
```

## Future Validation Expectations

```yaml
future_validator_expectations:
  - outcome_set_exact_pass_patch_reject
  - all_route_guards_false_for_writes
  - pass_requires_pass_reasons
  - patch_requires_patch_reasons_and_blocking_watch_items
  - reject_requires_reject_reasons_failure_tags_taxonomy_refs_and_never_production_reason
  - absolute_local_paths_rejected
```

## Boundary Confirmation

```yaml
schema_created: false
validator_created: false
runtime_execution_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
memory_written: false
DailyNote_written: false
VCP_memory_written: false
accepted_samples_written: false
production_candidate_002_started: false
Batch_005_started: false
package_json_modified: false
dependency_change_performed: false
push_performed: false
next_phase_started: false
```

## Recommended Next

```yaml
recommended_next_long_phase: metadata_only_review_result_protocol_fixture_static_review
recommended_next_task: review the fixture against the contract before creating a validator or wiring it into MVP
```
