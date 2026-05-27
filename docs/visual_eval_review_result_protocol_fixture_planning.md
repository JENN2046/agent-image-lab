# Visual Eval Review Result Protocol Fixture Planning

```yaml
phase: p2_11_metadata_only_review_result_protocol_fixture_planning
source_commit: 1caa8da
mode: A0_read_only_then_docs_only
risk_level: R1
selected_route: metadata_only_review_result_protocol_fixture_planning
```

## Purpose

This planning slice defines a future synthetic fixture set for the metadata-only
Review Result contract. It covers one pass fixture, one patch fixture, and one
reject fixture. The fixtures are planned as text metadata only; this phase does
not create JSON/YAML examples, schemas, validators, image assets, accepted
sample records, memory records, provider receipts, or runtime bindings.

## Fixture Set

```yaml
fixture_set:
  future_fixture_target: tests/schema_examples/visual_eval_review_result_protocol.example.json
  fixture_creation_now: false
  schema_creation_now: false
  validator_creation_now: false
  outcomes_required:
    - pass
    - patch
    - reject
  shared_boundary:
    production_candidate_allowed_now: false
    accepted_samples_write_allowed_now: false
    memory_write_allowed_now: false
    provider_retry_allowed_now: false
    image_generation_allowed_now: false
```

## Shared Fixture Shape

Every future fixture record should follow the minimum contract from
`docs/visual_eval_review_result_protocol_contract_slice.md`.

```yaml
shared_fixture_shape:
  required_fields:
    - review_result_id
    - candidate_id
    - source_ref
    - outcome
    - confidence_band
    - summary
    - positive_reasons
    - watch_items
    - failure_tags
    - taxonomy_refs
    - route_guards
    - metadata_accumulation
  source_ref_rule: repo_relative_or_redacted_reference_only
  image_binary_allowed: false
  absolute_local_path_allowed: false
```

## Pass Fixture Plan

```yaml
pass_fixture:
  review_result_id: visual_eval_review_result_pass_synthetic_001
  candidate_id: synthetic_product_still_life_pass_001
  source_ref: tests/schema_examples/visual_eval_seed_record.example.yaml
  outcome: pass
  confidence_band: high
  summary: Synthetic candidate meets core product readability and has only non-blocking watch items.
  positive_reasons:
    - product_identity_preserved
    - commercial_readability_plausible
    - no_major_artifact_recorded
  watch_items:
    - minor_shadow_consistency_watch
  failure_tags: []
  taxonomy_refs: []
  required_contract_checks:
    - pass_reasons_non_empty
    - accepted_metadata_action_present
    - route_guards_all_false_for_writes
  metadata_accumulation:
    accepted_metadata_action: keep_as_metadata_candidate
    rejected_metadata_action: none
    archive_reference_action: archive_as_positive_reference
    next_review_action: queue_for_future_human_review
```

## Patch Fixture Plan

```yaml
patch_fixture:
  review_result_id: visual_eval_review_result_patch_synthetic_001
  candidate_id: synthetic_product_still_life_patch_001
  source_ref: tests/schema_examples/visual_eval_seed_record.example.yaml
  outcome: patch
  confidence_band: medium
  summary: Synthetic candidate has useful composition but requires bounded correction before pass.
  positive_reasons:
    - product_identity_mostly_preserved
    - composition_direction_useful
  watch_items:
    - material_realism_watch
    - lighting_consistency_watch
  failure_tags:
    - material_failed
    - lighting_failed
  taxonomy_refs:
    - docs/v14_020_visual_eval_and_failure_taxonomy_planning_gate.md#failure-taxonomy-draft
  required_contract_checks:
    - patch_reasons_non_empty
    - bounded_patch_scope_non_empty
    - blocking_watch_items_non_empty
    - route_guards_all_false_for_writes
  metadata_accumulation:
    accepted_metadata_action: none
    rejected_metadata_action: none
    archive_reference_action: metadata_only_reference
    next_review_action: write_patch_plan_only
```

## Reject Fixture Plan

```yaml
reject_fixture:
  review_result_id: visual_eval_review_result_reject_synthetic_001
  candidate_id: synthetic_product_still_life_reject_001
  source_ref: tests/schema_examples/visual_eval_seed_record.rejected.example.yaml
  outcome: reject
  confidence_band: high
  summary: Synthetic candidate fails product identity or commercial usability and must remain never-production.
  positive_reasons: []
  watch_items:
    - severe_subject_drift
    - commercial_unusable
  failure_tags:
    - subject_drift
    - commercial_unusable
  taxonomy_refs:
    - docs/v14_020_visual_eval_and_failure_taxonomy_planning_gate.md#failure-taxonomy-draft
  never_production_reason: subject drift and commercial unusability block production promotion.
  required_contract_checks:
    - reject_reasons_non_empty
    - failure_tags_non_empty
    - taxonomy_refs_non_empty
    - never_production_reason_present
    - route_guards_all_false_for_writes
  metadata_accumulation:
    accepted_metadata_action: none
    rejected_metadata_action: keep_as_failure_learning_metadata
    archive_reference_action: archive_as_negative_reference
    next_review_action: defer_until_taxonomy_update
```

## Negative Guard Planning

Future validation should include negative checks, but this phase does not create
the validator.

```yaml
negative_guard_planning:
  reject_missing_failure_tags: true
  reject_patch_without_blocking_watch_items: true
  reject_pass_with_production_candidate_allowed_now_true: true
  reject_any_memory_write_allowed_now_true: true
  reject_any_accepted_samples_write_allowed_now_true: true
  reject_any_provider_retry_allowed_now_true: true
  reject_any_image_generation_allowed_now_true: true
  reject_absolute_local_source_ref: true
```

## Future Implementation Task Book

```yaml
recommended_next_long_phase: metadata_only_review_result_protocol_fixture_draft
recommended_next_task:
  phase_name: p2_12_metadata_only_review_result_protocol_fixture_draft
  mode: A0_read_only_then_docs_only
  allowed_files:
    - tests/schema_examples/visual_eval_review_result_protocol.example.json
    - docs/visual_eval_review_result_protocol_fixture_draft.md
    - .agent_board/CHECKPOINT.md
  forbidden:
    - production_candidate_002
    - memory_write_path
    - image_generation
    - Batch_005
    - provider_contact
    - plugin_call
    - api_call
    - VCPToolBox_runtime
    - VCPChat_runtime
    - DailyNote_write
    - VCP_memory_write
    - accepted_samples_write
    - image_binary_read
    - package_json_change
    - dependency_change
    - git_add_dot
    - push_without_explicit_authorization
  validation_allowed:
    - git diff --check
    - git status --short
    - git diff --cached --check
```

## Boundary Confirmation

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
runtime_execution_performed: false
image_generation_performed: false
memory_written: false
DailyNote_written: false
VCP_memory_written: false
accepted_samples_written: false
Batch_005_started: false
production_candidate_002_started: false
package_json_modified: false
dependency_change_performed: false
push_performed: false
next_phase_started: false
```
