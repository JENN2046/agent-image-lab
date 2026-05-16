# V14.023 Visual Eval Failure Tag Mapping Planning Gate

```yaml
phase: v14_023_visual_eval_failure_tag_mapping_planning_gate
base_contract: AGENTS.md
mode: A4.8 docs-only product planning gate
intent: planning
risk_level: R1
source_phase: v14_022_visual_eval_decision_policy_planning_gate
source_commit: a327d67d58125fe435d1560b881a6b36704a8d8c
selected_product_route: B_visual_eval_and_failure_taxonomy_planning
```

## Purpose

V14.023 maps the v14.020 failure taxonomy to the v14.022 decision policy. It
defines which failure tags force `rejected_candidate` or `archive_reference_only`,
which tags can remain `patch_candidate`, and which tags require human review
escalation before any candidate state is recorded.

This is docs-only planning. It does not create schema files, eval sample files,
accepted/rejected registries, accepted_samples entries, memory writes,
production routes, runtime paths, provider calls, or image generation.

## Failure Tag Groups

### Hard Reject Tags

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

Hard reject tags override aggregate score and prevent `accepted_candidate`.
The default decision is `rejected_candidate`, unless the reviewer marks the
asset as useful for learning only, in which case the default becomes
`archive_reference_only`.

### Patch Candidate Tags

```text
fixable_lighting_issue
fixable_composition_issue
material_nearly_good_but_texture_needs_refinement
brand_style_fit_partial
crop_or_cleanup_needed
```

Patch candidate tags require a clear correction path. They do not authorize
image editing, provider retries, runtime execution, accepted_samples writes, or
production promotion. If the correction path requires real execution, a later
authorization gate must be created.

### Archive Reference Only Tags

```text
useful_failure_reference
useful_style_warning
useful_prompt_negative_example
useful_material_failure_example
```

Archive-only tags are evidence tags. They preserve learning value but do not
make the asset eligible for accepted_samples, memory write, production readiness,
or delivery lanes.

### Human Review Escalation Tags

```text
ambiguous_product_identity
ambiguous_material_realism
uncertain_brand_like_content
conflicting_rubric_scores
reviewer_confidence_low
```

Escalation tags pause automatic classification. A human reviewer must record a
reason before choosing accepted, patch, rejected, or archive-only state.

## Mapping Fields

Each future failure-tag record should be expressible with these fields.

```yaml
mapping_fields:
  - failure_tag
  - severity
  - default_decision
  - can_patch
  - can_human_override
  - memory_suitability_default
  - production_candidate_eligible
  - notes
```

The fields are planning vocabulary only. No schema files or registries are
created in this phase.

## Failure Tag Mapping Table

| Failure tag | Severity | Default decision | Can patch | Can human override | Memory suitability default | Production candidate eligible | Notes |
|---|---|---|---|---|---|---|---|
| `product_identity_wrong` | hard_reject | `rejected_candidate` | false | true_with_reason | false | false | Product category or required structure is wrong. |
| `material_unrealistic_or_plasticized` | hard_reject | `rejected_candidate` | false | true_with_reason | false | false | Material credibility fails the product brief. |
| `severe_subject_drift` | hard_reject | `rejected_candidate` | false | true_with_reason | false | false | Subject no longer matches the intended asset. |
| `broken_geometry_or_anatomy_if_human_present` | hard_reject | `rejected_candidate` | false | true_with_reason | false | false | Geometry or human anatomy creates low-trust output. |
| `unreadable_or_fake_text_logo` | hard_reject | `rejected_candidate` | false | true_with_reason | false | false | Fake text or logo artifact is visible. |
| `commercial_unusable_composition` | hard_reject | `rejected_candidate` | false | true_with_reason | false | false | Crop, dominance, or framing blocks commercial use. |
| `visible_high_risk_ai_artifact` | hard_reject | `rejected_candidate` | false | true_with_reason | false | false | Artifact risk is too visible to carry forward. |
| `unsafe_or_unlicensed_brand_like_content` | hard_reject | `rejected_candidate` | false | true_with_reason | false | false | Brand-like or unsafe content requires blocking. |
| `fixable_lighting_issue` | patch | `patch_candidate` | true | true_with_reason | false | false | Direction is valid, lighting needs correction. |
| `fixable_composition_issue` | patch | `patch_candidate` | true | true_with_reason | false | false | Product remains usable after bounded framing fix. |
| `material_nearly_good_but_texture_needs_refinement` | patch | `patch_candidate` | true | true_with_reason | false | false | Material is close but needs texture refinement. |
| `brand_style_fit_partial` | patch | `patch_candidate` | true | true_with_reason | false | false | Style direction is partial, not fully aligned. |
| `crop_or_cleanup_needed` | patch | `patch_candidate` | true | true_with_reason | false | false | Minor crop or cleanup could recover usability. |
| `useful_failure_reference` | archive_only | `archive_reference_only` | false | true_with_reason | false | false | Preserve as a failure lesson only. |
| `useful_style_warning` | archive_only | `archive_reference_only` | false | true_with_reason | false | false | Useful warning for future prompt/style planning. |
| `useful_prompt_negative_example` | archive_only | `archive_reference_only` | false | true_with_reason | false | false | Useful negative prompt reference only. |
| `useful_material_failure_example` | archive_only | `archive_reference_only` | false | true_with_reason | false | false | Useful material failure evidence only. |
| `ambiguous_product_identity` | escalation | human_review_required | false_until_reviewed | true_with_reason | false | false | Reviewer must decide whether this is drift or acceptable variation. |
| `ambiguous_material_realism` | escalation | human_review_required | false_until_reviewed | true_with_reason | false | false | Reviewer must decide whether material passes the brief. |
| `uncertain_brand_like_content` | escalation | human_review_required | false_until_reviewed | true_with_reason | false | false | Potential brand-like content must be reviewed. |
| `conflicting_rubric_scores` | escalation | human_review_required | false_until_reviewed | true_with_reason | false | false | Score conflict blocks automatic routing. |
| `reviewer_confidence_low` | escalation | human_review_required | false_until_reviewed | true_with_reason | false | false | Low confidence requires explicit reviewer rationale. |

## Policy Rules

```text
any_hard_reject_tag_forces_rejected_or_archive_only: true
patch_candidate_requires_clear_correction_path: true
archive_reference_only_does_not_allow_memory_write: true
human_override_requires_reason: true
accepted_candidate_requires_no_hard_reject_tags: true
```

### Hard Reject Rule

If any hard reject tag is present, the asset cannot become
`accepted_candidate`. The reviewer may choose `rejected_candidate` or
`archive_reference_only`, but any upgrade requires a documented human rationale.

### Patch Candidate Rule

Patch tags require bounded correction language. A patch candidate must name the
exact issue and the expected correction path. This phase does not execute the
patch.

### Archive Reference Rule

Archive-only decisions preserve learning value only. They do not authorize
memory write, accepted_samples write, production_candidate_002, delivery
readiness, provider contact, runtime, or image generation.

### Human Override Rule

Human override can change decision state only with a reason. It cannot open
blocked paths such as memory, production, runtime, provider calls, accepted
samples, or image editing.

### Accepted Candidate Rule

Accepted candidates require no hard reject tags, no unresolved escalation tags,
and a human reviewer acceptance record. Acceptance remains separate from memory
suitability and production readiness.

## Blocked Boundaries

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

## Future Handoff

```text
feeds_visual_eval_review_record_schema_later: true
feeds_minimal_eval_seed_planning_later: true
feeds_review_console_decision_surface_later: true
schema_files_created_now: false
eval_samples_created_now: false
registries_created_now: false
```

## Recommended Next

```text
recommended_next: v14_024_visual_eval_minimal_seed_set_planning_gate
docs_only_gate_creation_and_validation_only: true
runtime_provider_image_memory_production_batch: false
next_phase_started: false
```
