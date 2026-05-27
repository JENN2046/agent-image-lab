# Visual Eval Review Result Protocol Contract Slice

```yaml
phase: p2_10_metadata_only_review_result_protocol_contract_slice
source_commit: beaf46c
mode: A0_read_only_then_docs_only
risk_level: R1
selected_route: B_review_result_protocol_hardening
```

## Purpose

This slice defines the metadata-only minimum Review Result contract for visual
evaluation work. It is a product skeleton contract, not an executable runtime
contract.

It keeps Agent Image Lab on the visual eval / failure taxonomy / review result
product route while explicitly blocking production, memory writes, provider
calls, plugin calls, API calls, image generation, runtime execution, dependency
changes, and Batch 005.

## Minimum Review Result Object

```yaml
minimum_review_result_object:
  review_result_id:
    type: string
    required: true
    meaning: Stable local identifier for this metadata-only review result.
  candidate_id:
    type: string
    required: true
    meaning: Candidate being reviewed; may refer to a synthetic fixture or already-recorded metadata reference.
  source_ref:
    type: string
    required: true
    rule: repo_relative_or_redacted_reference_only
  outcome:
    type: enum
    required: true
    allowed:
      - pass
      - patch
      - reject
  confidence_band:
    type: enum
    required: true
    allowed:
      - low
      - medium
      - high
  summary:
    type: string
    required: true
  positive_reasons:
    type: array
    required: true
  watch_items:
    type: array
    required: true
  failure_tags:
    type: array
    required: true
  taxonomy_refs:
    type: array
    required: true
  route_guards:
    type: object
    required: true
  metadata_accumulation:
    type: object
    required: true
```

## Pass Result Contract

A `pass` result means the candidate is strong enough to stay in an
accepted-candidate metadata lane. It does not authorize production, memory, or
accepted sample writes.

```yaml
pass_result_contract:
  outcome: pass
  required_fields:
    - pass_reasons
    - remaining_watch_items
    - accepted_metadata_action
  pass_reasons:
    min_items: 1
    meaning: Why the result is good enough for reviewable accepted metadata.
  remaining_watch_items:
    min_items: 0
    meaning: Non-blocking concerns that must remain visible.
  accepted_metadata_action:
    allowed:
      - keep_as_metadata_candidate
      - queue_for_future_human_review
      - archive_as_positive_reference
  route_guards:
    production_candidate_allowed_now: false
    accepted_samples_write_allowed_now: false
    memory_write_allowed_now: false
    provider_retry_allowed_now: false
    image_generation_allowed_now: false
```

## Patch Result Contract

A `patch` result means the direction is useful but not settled. The candidate
must stay in metadata-only patch planning until a separate future authorization
exists.

```yaml
patch_result_contract:
  outcome: patch
  required_fields:
    - patch_reasons
    - bounded_patch_scope
    - blocking_watch_items
    - next_review_action
  patch_reasons:
    min_items: 1
    meaning: Why the candidate is worth improving instead of rejecting.
  bounded_patch_scope:
    min_items: 1
    meaning: Exact local planning scope for a future patch or prompt revision.
  blocking_watch_items:
    min_items: 1
    meaning: Issues that block pass status now.
  next_review_action:
    allowed:
      - write_patch_plan_only
      - request_future_generation_authorization
      - defer_until_more_seed_coverage
  route_guards:
    production_candidate_allowed_now: false
    accepted_samples_write_allowed_now: false
    memory_write_allowed_now: false
    provider_retry_allowed_now: false
    image_generation_allowed_now: false
```

## Reject Result Contract

A `reject` result means the candidate must not continue toward delivery,
production, memory admission, or accepted sample writes. It may remain useful
as failure-learning metadata.

```yaml
reject_result_contract:
  outcome: reject
  required_fields:
    - reject_reasons
    - failure_tags
    - taxonomy_refs
    - rejected_metadata_action
    - never_production_reason
  reject_reasons:
    min_items: 1
    meaning: Human-readable reasons the candidate failed.
  failure_tags:
    min_items: 1
    meaning: Machine-checkable failure categories from the visual eval taxonomy.
  taxonomy_refs:
    min_items: 1
    meaning: References to known visual eval failure taxonomy entries.
  rejected_metadata_action:
    allowed:
      - keep_as_failure_learning_metadata
      - archive_as_negative_reference
      - defer_until_taxonomy_update
  never_production_reason:
    required: true
    meaning: Why this rejected candidate cannot be promoted to production.
  route_guards:
    production_candidate_allowed_now: false
    accepted_samples_write_allowed_now: false
    memory_write_allowed_now: false
    provider_retry_allowed_now: false
    image_generation_allowed_now: false
```

## Failure Taxonomy Binding

```yaml
failure_taxonomy_binding:
  taxonomy_source: docs/v14_020_visual_eval_and_failure_taxonomy_planning_gate.md
  known_tags:
    - material_failed
    - composition_failed
    - lighting_failed
    - subject_drift
    - text_or_logo_artifact
    - commercial_unusable
    - over_stylized
    - low_trust_ai_look
  binding_rules:
    pass:
      failure_tags_required: false
      taxonomy_refs_required_when_watch_items_present: true
    patch:
      failure_tags_required: false
      watch_items_or_patch_reasons_required: true
      taxonomy_refs_required_when_failure_tags_present: true
    reject:
      failure_tags_required: true
      taxonomy_refs_required: true
  hard_blocks:
    text_or_logo_artifact:
      production_candidate_allowed_now: false
    subject_drift:
      accepted_samples_write_allowed_now: false
    commercial_unusable:
      accepted_samples_write_allowed_now: false
    unknown_failure_tag:
      memory_write_allowed_now: false
      production_candidate_allowed_now: false
```

## Accepted Metadata Accumulation Policy

```yaml
accepted_metadata_accumulation_policy:
  allowed_now:
    - keep_as_metadata_candidate
    - queue_for_future_human_review
    - archive_as_positive_reference
  required_metadata:
    - candidate_id
    - review_result_id
    - pass_reasons
    - remaining_watch_items
    - route_guards
  forbidden_now:
    - accepted_samples_write
    - production_candidate_write
    - memory_write
    - DailyNote_write
    - VCP_memory_write
    - image_binary_copy
    - provider_retry
```

## Rejected Metadata Accumulation Policy

```yaml
rejected_metadata_accumulation_policy:
  allowed_now:
    - keep_as_failure_learning_metadata
    - archive_as_negative_reference
    - defer_until_taxonomy_update
  required_metadata:
    - candidate_id
    - review_result_id
    - reject_reasons
    - failure_tags
    - taxonomy_refs
    - never_production_reason
    - route_guards
  forbidden_now:
    - accepted_samples_write
    - production_candidate_write
    - memory_write
    - DailyNote_write
    - VCP_memory_write
    - image_binary_copy
    - provider_retry
```

## No-Write Guardrails

```yaml
no_write_guardrails:
  production_candidate_002_started: false
  production_candidate_created: false
  accepted_samples_written: false
  memory_written: false
  DailyNote_written: false
  VCP_memory_written: false
  image_generation_performed: false
  provider_contact_performed: false
  plugin_call_performed: false
  api_call_performed: false
  runtime_execution_performed: false
  VCPToolBox_runtime_performed: false
  VCPChat_runtime_performed: false
  Batch_005_started: false
  package_json_modified: false
  dependency_change_performed: false
```

## Future Validator Requirements

```yaml
future_validator_requirements:
  validate_minimum_object:
    - review_result_id present
    - candidate_id present
    - outcome is pass, patch, or reject
    - route_guards present
    - metadata_accumulation present
  validate_pass:
    - pass_reasons non-empty
    - production_candidate_allowed_now false
    - accepted_samples_write_allowed_now false
    - memory_write_allowed_now false
  validate_patch:
    - patch_reasons non-empty
    - bounded_patch_scope non-empty
    - blocking_watch_items non-empty
    - production_candidate_allowed_now false
    - accepted_samples_write_allowed_now false
    - memory_write_allowed_now false
  validate_reject:
    - reject_reasons non-empty
    - failure_tags non-empty
    - taxonomy_refs non-empty
    - never_production_reason present
    - production_candidate_allowed_now false
    - accepted_samples_write_allowed_now false
    - memory_write_allowed_now false
  validate_boundary:
    - no provider/API/plugin/image/runtime/memory/production flags are true
    - no absolute local path is required
    - no package or dependency change is required
```

## Recommended Next

```yaml
recommended_next_long_phase: metadata_only_review_result_protocol_fixture_planning
recommended_next_task: plan a synthetic fixture for pass, patch, and reject review results using this contract
next_phase_started: false
```
