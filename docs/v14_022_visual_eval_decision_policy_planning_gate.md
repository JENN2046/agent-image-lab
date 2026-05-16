# V14.022 Visual Eval Decision Policy Planning Gate

```yaml
phase: v14_022_visual_eval_decision_policy_planning_gate
base_contract: AGENTS.md
mode: A4.8 docs-only product planning gate
intent: planning
risk_level: R1
source_phase: v14_021b_rubric_phase_chain_reconciliation_closeout
source_commit: 088f3d5d3b0844041def2684243a91e5b1232492
selected_product_route: B_visual_eval_and_failure_taxonomy_planning
```

## Purpose

V14.022 defines the docs-only decision policy for visual evaluation. It maps
rubric scores and failure tags into review decisions without creating schema
files, eval samples, registries, accepted samples, memory writes, production
candidate routes, provider calls, runtime paths, or image generation.

## Decision Outputs

```text
accepted_candidate
patch_candidate
rejected_candidate
archive_reference_only
```

### accepted_candidate

The image can remain in the candidate lane for future delivery readiness or
product-route planning. This does not imply commercial readiness, memory write,
accepted_samples write, or production_candidate_002 promotion.

### patch_candidate

The image has a viable direction but requires bounded visual correction before
it can be treated as an accepted candidate or delivery-ready candidate.

### rejected_candidate

The image fails core identity, material, geometry, trust, or commercial-use
requirements. It should not be promoted without a new prompt/package or a new
explicit route.

### archive_reference_only

The image is useful as evidence, a lesson, or a failure reference, but not as a
candidate for delivery, memory write, or production readiness.

## Score Policy

```yaml
per_dimension_score_range: 0_to_10
aggregate_score_rule: mean_of_required_dimensions_with_hard_reject_override
minimum_acceptance_threshold:
  per_dimension_minimum: 7
  aggregate_minimum: 7.5
  hard_reject_count: 0
  confidence_required_for_acceptance: high_human_reviewer_confidence
patch_threshold:
  aggregate_minimum: 5.5
  hard_reject_count: 0
  fixable_dimension_failures_allowed: true
reject_threshold:
  aggregate_below: 5.5
  any_dimension_at_or_below: 2
  hard_reject_count_greater_than: 0
```

The score policy is advisory until a human reviewer confirms the decision.
Human review is required before any candidate state is treated as accepted.

## Hard Reject Conditions

```text
product_identity_wrong
material_unrealistic_or_plasticized
severe_subject_drift
broken_geometry_or_anatomy_if_human_present
unreadable_or_fake_text_logo
commercial_unusable_composition
visible_high_risk_ai_artifact
unsafe_or_unlicensed_brand_like_content
```

Any hard reject condition overrides aggregate score and forces either
`rejected_candidate` or `archive_reference_only`.

## Patch Conditions

```text
acceptable_direction_but_fixable_lighting_issue
acceptable_subject_but_composition_needs_adjustment
material_nearly_good_but_texture_needs_refinement
brand_style_fit_partial
commercial_use_possible_after_minor_crop_or_cleanup
```

Patch candidates must have a clear correction path. If the correction would
require a new provider call, runtime execution, image edit, or production route,
that work requires a separate future authorization gate.

## Accepted Conditions

```text
product_identity_stable
material_realism_passed
composition_commercially_usable
lighting_believable
ai_artifact_risk_low
brand_style_fit_sufficient
human_reviewer_accept_required
```

Accepted candidates are still planning outputs. They do not automatically become
commercial_delivery_ready, memory-suitable, accepted_samples entries, or
production candidates.

## Decision Mapping

| Decision | Score basis | Failure tag basis | Human rule |
|---|---|---|---|
| `accepted_candidate` | Aggregate >= 7.5 and every required dimension >= 7 | No hard reject tags and AI artifact risk is low | Human reviewer must accept |
| `patch_candidate` | Aggregate >= 5.5 with fixable dimension gaps | No hard reject tags; patch tags are bounded | Human reviewer must approve patch lane |
| `rejected_candidate` | Aggregate < 5.5, any required dimension <= 2, or hard reject present | One or more hard reject tags | Human reviewer can override only with documented rationale |
| `archive_reference_only` | Any score if useful as evidence only | Failure or learning tags useful for taxonomy | Human reviewer marks archive-only |

## Human Override Rules

```text
human_review_required_for_acceptance: true
human_override_may_downgrade_any_candidate: true
human_override_may_upgrade_only_with_reason: true
override_reason_required: true
override_must_not_authorize_memory_write: true
override_must_not_authorize_production_candidate_002: true
override_must_not_authorize_image_generation_or_runtime: true
```

Human override can change the recorded decision but cannot open memory, runtime,
provider, image generation, accepted_samples, or production paths.

## Memory Suitability Policy

```text
accepted_candidate_does_not_imply_memory_write: true
memory_suitability_default_false: true
memory_write_requires_separate_gate: true
```

Memory suitability remains separate from visual acceptance. A later memory gate
must explicitly define suitability, redaction, reviewer approval, and write
scope before any memory write can occur.

## Production Candidate Policy

```text
accepted_candidate_does_not_imply_production_candidate_002: true
production_candidate_002_default_blocked: true
production_readiness_requires_separate_A5_gate: true
```

Production readiness is not unlocked by this policy. Promotion to
production_candidate_002 remains blocked unless a future explicit gate authorizes
the route.

## Future Handoff

```text
feeds_visual_production_core_schema_planning_later: true
feeds_minimal_eval_seed_planning_later: true
schema_files_created: false
eval_samples_created: false
accepted_rejected_registries_created: false
accepted_samples_written: false
```

This phase gives the future schema route a decision-policy vocabulary, but it
does not create the schema or any sample registry.

## Boundaries

```text
prototype_files_modified: false
scripts_modified: false
schema_files_created: false
eval_samples_created: false
accepted_registry_created: false
rejected_registry_created: false
accepted_samples_written: false
browser_preview_started: false
dev_server_started: false
live_server_started: false
localhost_runtime_started: false
runtime_execution: false
provider_contact: false
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

## Recommended Next

```text
recommended_next: v14_023_visual_eval_failure_tag_mapping_planning_gate
docs_only_gate_creation_and_validation_only: true
runtime_provider_image_memory_production_batch: false
next_phase_started: false
```
