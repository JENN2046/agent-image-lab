# v0.3.15 Fifteen-Day Architecture Checkpoint

base_contract: AGENTS.md
phase: v0_3_15_fifteen_day_architecture_checkpoint
status: local_architecture_checkpoint

## Purpose

This checkpoint closes the 15-day architecture arc that began with the first
successful Push_L1 auto-push and returned the project to visual workflow
judgment. It records what is proven, what remains intentionally unproven, and
which route is safe to consider next.

This is a documentation and validator checkpoint only. It does not push, test
Push_L2, implement a real executor, call providers, generate images, write VCP
memory, write DailyNote, create production candidates, auto-promote accepted
samples, or change dependencies.

## Requirement Audit

### Push Safety Lane

```yaml
Push_L1_green_auto:
  status: proven_and_regression_guarded
  proven_commit: f26e9478c94c7a3dcfc4ba93b6a3efac806ebece
  proven_scope:
    - exactly_one_commit_ahead
    - six_status_surface_files_only
    - worktree_clean
    - fast_forward_only
    - no_assets
    - no_runs
    - no_images
    - no_package_files
    - no_runtime_code
    - no_provider_image_memory_runtime_secret_side_effects
    - validation_passed
    - remote_head_verified
  regression_guarded_by:
    - docs/PUSH_L1_USAGE_RULE.md
    - docs/PUSH_L1_REGRESSION_CASES.md
    - tests/schema_examples/push_l1_status_sync_pass.example.json
    - tests/schema_examples/push_l1_forbidden_paths_fail.example.json
    - scripts/validate_smart_v3_push_safety_lane.js
Push_L2_amber_auto_guarded:
  status: still_defined_not_proven
  exercised_in_15_day_cycle: false
Push_L3_red_manual:
  preserved: true
```

Push_L1 success must not be generalized to broad docs changes, assets, runs,
image files, package files, runtime code, provider/image/memory/runtime side
effects, Push_L2, or real executor changes.

### Visual Workflow

Visual Asset Eval v0.1 is now defined as the minimum visual judgment layer.

```yaml
visual_asset_eval_v0_1:
  status: defined
  doc_ref: docs/VISUAL_ASSET_EVAL_V0_1.md
  schema_ref: schemas/visual_asset_review_report.schema.yaml
  fixture_ref: tests/schema_examples/visual_asset_review_report.example.json
  validator_ref: scripts/validate_visual_asset_eval_v0_1.js
  evaluates:
    - composition
    - lighting
    - material_realism
    - product_fidelity
    - commercial_fitness
    - AI_artifact_risk
    - memory_suitability
  answers:
    - why_did_it_pass
    - why_was_it_rejected
    - failed_dimension
    - commercial_use_suitability
    - accepted_sample_eligibility
    - memory_seed_eligibility
```

The project now has a minimum validator-backed way to explain why an image
passes, why it is rejected, which visual dimension failed, whether it is
commercially usable, whether it can enter accepted_sample review, and whether
it can enter memory_seed review.

### Accepted / Rejected Sample Memory Structure

```yaml
sample_memory_v0_1:
  status: schema_only_defined
  policy_ref: docs/VISUAL_SAMPLE_MEMORY_POLICY.md
  accepted_sample_record_schema_ref: schemas/accepted_sample_record.schema.yaml
  rejected_sample_record_schema_ref: schemas/rejected_sample_record.schema.yaml
  accepted_sample_requires:
    - accepted_gate_id
    - human_accepted: true
    - review_report_ref
    - visual_traits
    - reuse_conditions
  rejected_sample_requires:
    - rejection_reason
    - failure_taxonomy
    - correction_hint
    - do_not_reuse_conditions
```

These records are schema-only. They do not write VCP memory, write DailyNote,
auto-promote accepted_sample, create accepted registry entries, or create
production candidates.

### Bounded L4

```yaml
bounded_l4:
  executor_preflight_contract: defined
  executor_preflight_contract_ref: docs/V0_3_7_BOUNDED_L4_EXECUTOR_PREFLIGHT_CONTRACT_GATE.md
  real_executor_implemented_now: false
  no_op_executor_simulator_next_only_if_reviewed: true
```

The project has a Bounded L4 preflight contract, but a real executor remains
unimplemented. The next possible executor-related step is only a reviewed no-op
executor simulator, not a real action loop.

## Boundaries Preserved

```yaml
Push_L2_auto_push_test_performed: false
real_executor_implemented_now: false
provider_call_performed: false
image_generation_performed: false
VCP_memory_write_performed: false
DailyNote_write_performed: false
production_candidate_created: false
accepted_sample_auto_promotion: false
package_dependency_change_performed: false
Push_L1_widened_to_broad_docs: false
```

## Result

```yaml
target_state_after_15_days:
  Push_Safety_Lane:
    Push_L1_green_auto: proven_and_regression_guarded
    Push_L2_amber_auto_guarded: still_defined_not_proven
    Push_L3_red_manual: preserved
  Visual_Workflow:
    visual_asset_eval_v0_1: defined
    review_report_schema: defined
    accepted_rejected_sample_schema: defined
    memory_write: still_blocked
  Bounded_L4:
    executor_preflight_contract: defined
    real_executor: still_not_implemented
    next_step: no-op executor simulator only if reviewed
```
