# Visual Eval Review Result Protocol Hardening Plan

```yaml
phase: p2_9_visual_eval_review_result_protocol_hardening_plan
source_commit: e7fd5e8
mode: A0_read_only_then_docs_only
selected_route: B_review_result_protocol_hardening
risk_level: R1
```

## Purpose

This plan returns Agent Image Lab to the metadata-only visual workflow product
line after the provider evidence and resume-surface governance closeout. It
does not create a production candidate, generate images, write memory, call a
provider, call a plugin, call an API, or run VCPToolBox / VCPChat runtime.

The plan narrows the next product slice to the review result protocol: the
smallest structure that can explain why a reviewed visual candidate passes,
needs patching, or is rejected, and how that result connects to failure
taxonomy and accepted / rejected metadata accumulation.

## Current Evidence

```yaml
route_inputs:
  visual_eval_planning:
    file: docs/v14_020_visual_eval_and_failure_taxonomy_planning_gate.md
    facts:
      - visual review rubric dimensions exist
      - failure taxonomy exists
      - accepted, patch, rejected, and archive-reference outcomes are defined
      - no runtime, generation, memory, or production path is authorized
  seed_registry_closeout:
    file: docs/v14_036_visual_eval_seed_registry_closeout_or_expansion_route_gate.md
    facts:
      - seed registry foundation lane is locally closed
      - metadata-only accepted and rejected fixtures are indexed
      - further seed expansion requires a separate gate
  product_route_task_book:
    file: docs/visual_workflow_product_route_review_task_book.md
    facts:
      - selected route is visual_eval_and_failure_taxonomy_continuation
      - default next route is review_result_protocol_hardening
  existing_review_report_chain:
    files:
      - docs/v14_039_review_result_protocol_hardening_gate.md
      - docs/v14_067_review_report_contract_gate.md
      - docs/v14_074_review_report_route_summary_gate.md
      - docs/v14_079_review_report_final_local_closeout_gate.md
    facts:
      - review-result and ReviewReport concepts already exist locally
      - pass and reject routes have no-write and no-production guards
      - memory draft and production exclusion records are represented as metadata only
```

## Hardening Decision

The next product slice should not invent a new runtime or widen the existing
ReviewReport chain. It should define a compact minimum contract that later
metadata-only fixtures or validators can target.

```yaml
decision: harden_minimum_review_result_protocol
selected_scope:
  - minimum_review_result_structure
  - pass_patch_reject_fields
  - failure_taxonomy_binding
  - accepted_rejected_metadata_accumulation
not_selected:
  - production_candidate_002
  - memory_write_path
  - image_generation
  - provider_retry
  - runtime_binding
  - package_or_dependency_change
```

## Minimum Review Result Structure

```yaml
review_result_minimum_structure:
  identity:
    required:
      - review_result_id
      - candidate_id
      - source_ref
      - reviewed_at
      - reviewer_role
  verdict:
    required:
      - outcome
      - confidence_band
      - human_review_required
    allowed_outcomes:
      - pass
      - patch
      - reject
  rationale:
    required:
      - summary
      - positive_reasons
      - watch_items
      - failure_tags
      - taxonomy_refs
  route_guards:
    required:
      - production_candidate_allowed_now
      - accepted_samples_write_allowed_now
      - memory_write_allowed_now
      - provider_retry_allowed_now
      - image_generation_allowed_now
  metadata_accumulation:
    required:
      - accepted_metadata_action
      - rejected_metadata_action
      - archive_reference_action
      - next_review_action
```

## Pass / Patch / Reject Fields

```yaml
pass_result:
  required_fields:
    - pass_reasons
    - remaining_watch_items
    - accepted_metadata_action
    - production_candidate_allowed_now
    - memory_write_allowed_now
  required_values:
    outcome: pass
    production_candidate_allowed_now: false
    memory_write_allowed_now: false
    accepted_samples_write_allowed_now: false
  meaning: Candidate can remain a reviewable accepted-candidate metadata record, but cannot become production or memory automatically.

patch_result:
  required_fields:
    - patch_reasons
    - bounded_patch_scope
    - blocking_watch_items
    - next_review_action
  required_values:
    outcome: patch
    production_candidate_allowed_now: false
    memory_write_allowed_now: false
    accepted_samples_write_allowed_now: false
  meaning: Candidate is directionally useful but must stay in metadata-only patch planning until a separate authorized action exists.

reject_result:
  required_fields:
    - reject_reasons
    - failure_tags
    - taxonomy_refs
    - rejected_metadata_action
    - never_production_reason
  required_values:
    outcome: reject
    production_candidate_allowed_now: false
    memory_write_allowed_now: false
    accepted_samples_write_allowed_now: false
  meaning: Candidate is retained only as rejected metadata or failure-learning reference, never as production state.
```

## Failure Taxonomy Binding

```yaml
taxonomy_binding:
  source_taxonomy: docs/v14_020_visual_eval_and_failure_taxonomy_planning_gate.md
  required_for:
    - patch
    - reject
  optional_for:
    - pass
  required_behavior:
    - every reject must include at least one failure tag
    - every patch must include at least one watch item or bounded patch reason
    - unknown failure tags must route to memory_write_allowed_now false
    - text_or_logo_artifact must block production candidate promotion
    - subject_drift and commercial_unusable must block accepted sample writes now
```

## Accepted / Rejected Metadata Accumulation

```yaml
metadata_accumulation_policy:
  accepted_metadata:
    allowed_now: metadata_record_plan_only
    forbidden_now:
      - accepted_samples_write
      - production_candidate_write
      - memory_write
      - image_binary_copy
  rejected_metadata:
    allowed_now: failure_learning_metadata_plan_only
    required:
      - failure_tags
      - reject_reasons
      - never_production_reason
    forbidden_now:
      - production_candidate_write
      - accepted_samples_write
      - memory_write
      - provider_retry
  archive_reference:
    allowed_now: metadata_only_reference
    required:
      - reason_for_archive
      - prohibited_routes
```

## Next Product Step

```yaml
recommended_next_long_phase: metadata_only_review_result_protocol_contract_slice
recommended_next_task_book: docs/visual_eval_review_result_protocol_task_book.md
next_phase_started: false
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
Batch_005_started: false
production_candidate_002_started: false
package_json_modified: false
dependency_change_performed: false
push_performed: false
```
