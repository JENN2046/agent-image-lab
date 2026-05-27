# P2.8 Visual Workflow Product Route Review Task Book

```yaml
phase: p2_8_visual_workflow_product_route_task_book
source_commit: d048170
mode: A0_read_only_then_docs_only
intent: planning
risk_level: R1
selected_route: visual_eval_and_failure_taxonomy_continuation
```

## Purpose

This task book reviews the current visual workflow / visual evaluation product
route and selects the next safe local task after the provider evidence integrity
closeout chain. It does not enter production, generate images, write memory,
start Batch 005, contact providers, call plugins, call APIs, or run runtime
paths.

## Route Review

The current route can return to product-line work, but only through a
metadata-only visual-evaluation lane.

```yaml
route_findings:
  provider_evidence_integrity_chain:
    sealed_remote_commit: d048170
    status: remote_synced
  visual_eval_foundation:
    planning_gate: docs/v14_020_visual_eval_and_failure_taxonomy_planning_gate.md
    closeout_gate: docs/v14_036_visual_eval_seed_registry_closeout_or_expansion_route_gate.md
    foundation_lane_closed: true
    registry_schema_exists: true
    registry_example_exists: true
    accepted_seed_fixture_indexed: true
    rejected_seed_fixture_indexed: true
    dedicated_registry_validator_exists: true
    mvp_wiring_exists: true
  immediate_metadata_expansion_selected: false
  metadata_expansion_requires_new_gate: true
```

## Route Decision

```yaml
decision: continue_product_line_without_opening_production
selected_next_route: visual_eval_and_failure_taxonomy_continuation
not_selected:
  production_candidate_002: false
  memory_write_path: false
  image_generation: false
  Batch_005: false
reason:
  - v14_036 closed the seed registry foundation lane instead of expanding it immediately.
  - The repository has enough metadata-only review infrastructure to choose the next product planning slice.
  - The next useful step is a narrow task book, not a provider retry, production candidate, or memory write path.
```

## Next Continuous Task Book

```yaml
phase_name: p2_9_visual_eval_next_slice_selection_gate
source_commit: d048170
mode: A0_read_only_then_docs_only

goal:
  - select one narrow metadata-only visual workflow product slice
  - decide between seed fixture expansion, review-result protocol hardening, or review-console binding readiness
  - produce a concrete implementation task book for the selected slice

route_options:
  A_seed_fixture_expansion_planning:
    description: Plan the next metadata-only accepted/rejected seed fixture expansion gate.
    value: broadens visual eval coverage without reading image binaries or writing accepted_samples.
    risk: low
  B_review_result_protocol_hardening:
    description: Review the existing review-result protocol chain and select the next contract-hardening slice.
    value: improves product decision repeatability before any runtime or production candidate.
    risk: low
  C_review_console_binding_readiness:
    description: Review whether static review-console surfaces are ready for a future non-runtime binding task.
    value: moves visual judgment closer to product workflow UX without starting runtime.
    risk: low_to_moderate

recommended_default: B_review_result_protocol_hardening

allowed_scope:
  read_only_first:
    - README.md
    - docs/v14_020_visual_eval_and_failure_taxonomy_planning_gate.md
    - docs/v14_036_visual_eval_seed_registry_closeout_or_expansion_route_gate.md
    - docs/v14_039_review_result_protocol_hardening_gate.md
    - docs/v14_040_review_protocol_static_adapter_or_console_binding_gate.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/HANDOFF.md
    - .agent_board/CHECKPOINT.md
  docs_only_patch_allowed:
    - docs/visual_eval_next_slice_selection_task_book.md
    - .agent_board/CHECKPOINT.md

forbidden:
  - production_candidate_002
  - memory_write_path
  - image_generation
  - Batch_005
  - provider_contact
  - plugin_call
  - api_call
  - runtime_execution
  - dependency_change
  - package_json_change
  - git_add_dot
  - push_without_explicit_authorization

validation_allowed:
  - git diff --check
  - git status --short
  - git diff --cached --check

commit_allowed: true
commit_message: "docs: add visual eval next slice task book"
push_allowed: false

closeout_required:
  patch_performed: true|false
  files_changed: []
  validation_performed: true
  validation_results: []
  commit_hash: "<local_commit_or_none>"
  push_performed: false
  next_phase_started: false
  production_candidate_002_started: false
  memory_written: false
  image_generation_performed: false
  batch_005_started: false
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
Batch_005_started: false
production_candidate_002_started: false
dependency_change_performed: false
push_performed: false
next_phase_started: false
```
