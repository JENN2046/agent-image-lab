# V14.024 Visual Eval Minimal Seed Set Planning Gate

```yaml
phase: v14_024_visual_eval_minimal_seed_set_planning_gate
base_contract: AGENTS.md
mode: A4.8 docs-only product planning gate
intent: planning
risk_level: R1
source_phase: v14_023_visual_eval_failure_tag_mapping_planning_gate
source_commit: 97311f9c72c3faa8875f15151a0f232f9edc3f4c
selected_product_route: B_visual_eval_and_failure_taxonomy_planning
```

## Purpose

V14.024 plans the minimal future visual-evaluation seed set. It defines the
accepted and rejected example categories that will be needed later, maps those
seed targets to rubric dimensions and failure tags, and keeps all sample
ingestion behind a later gate.

This is docs-only planning. It does not create schema files, eval sample files,
accepted/rejected registries, accepted_samples entries, memory writes, image
binary reads, production routes, runtime paths, provider calls, or image
generation.

## Seed Set Targets

```yaml
seed_set_targets:
  accepted_examples_target: 10
  rejected_examples_target: 10
  recurring_failure_types_target: 5
```

The target set is the smallest useful planning baseline for future rubric
calibration. It is not an authorization to collect, ingest, copy, read, or
generate the actual images.

## Accepted Seed Categories

```text
strong_product_identity
convincing_material_realism
commercial_hero_shot
clean_detail_shot
brand_style_fit
low_ai_artifact_risk
```

Accepted seed categories describe future positive references. They may support
rubric calibration later, but they do not imply accepted_samples writes,
production readiness, memory suitability, or delivery eligibility.

## Rejected Seed Categories

```text
product_identity_wrong
material_unrealistic_or_plasticized
severe_subject_drift
commercial_unusable_composition
visible_high_risk_ai_artifact
fake_text_or_logo
over_stylized_low_trust_result
```

Rejected seed categories describe future negative references. They map to known
failure-tag planning vocabulary where possible and keep every future rejection
record non-executing, redacted, and reviewable.

## Seed Record Fields Planning

Each future seed record should be expressible with these fields.

```yaml
seed_record_fields_planning:
  - seed_id
  - source_type
  - intended_decision
  - linked_rubric_dimensions
  - linked_failure_tags
  - review_note
  - memory_suitability_default
  - production_candidate_eligible_default
  - redaction_requirement
```

The fields are planning vocabulary only. No schema files, eval sample files, or
registries are created in this phase.

## Accepted Seed Mapping

| Seed category | Intended decision | Linked rubric dimensions | Linked failure tags | Memory suitability default | Production candidate eligible | Notes |
|---|---|---|---|---|---|---|
| `strong_product_identity` | `accepted_candidate_reference` | `product_identity`, `brief_alignment` | none | false | false | Product category, shape, and required structure remain clear. |
| `convincing_material_realism` | `accepted_candidate_reference` | `material_realism`, `texture_quality` | none | false | false | Material reads credibly without plasticized or fake texture. |
| `commercial_hero_shot` | `accepted_candidate_reference` | `commercial_composition`, `visual_hierarchy` | none | false | false | Hero composition is usable as a positive framing reference. |
| `clean_detail_shot` | `accepted_candidate_reference` | `detail_integrity`, `artifact_control` | none | false | false | Detail view remains clean enough to support future scoring examples. |
| `brand_style_fit` | `accepted_candidate_reference` | `style_fit`, `brief_alignment` | none | false | false | Style aligns with the requested visual language without overclaiming brand approval. |
| `low_ai_artifact_risk` | `accepted_candidate_reference` | `artifact_control`, `trustworthiness` | none | false | false | Artifact risk is low enough for a positive review example. |

## Rejected Seed Mapping

| Seed category | Intended decision | Linked rubric dimensions | Linked failure tags | Memory suitability default | Production candidate eligible | Notes |
|---|---|---|---|---|---|---|
| `product_identity_wrong` | `rejected_candidate_reference` | `product_identity`, `brief_alignment` | `product_identity_wrong` | false | false | Product identity failure should block acceptance. |
| `material_unrealistic_or_plasticized` | `rejected_candidate_reference` | `material_realism`, `texture_quality` | `material_unrealistic_or_plasticized` | false | false | Material failure should remain a hard reject example. |
| `severe_subject_drift` | `rejected_candidate_reference` | `subject_integrity`, `brief_alignment` | `severe_subject_drift` | false | false | Subject drift makes the output unsuitable for acceptance. |
| `commercial_unusable_composition` | `rejected_candidate_reference` | `commercial_composition`, `visual_hierarchy` | `commercial_unusable_composition` | false | false | Framing or dominance makes the image commercially unusable. |
| `visible_high_risk_ai_artifact` | `rejected_candidate_reference` | `artifact_control`, `trustworthiness` | `visible_high_risk_ai_artifact` | false | false | Artifact visibility is high enough to block candidate use. |
| `fake_text_or_logo` | `rejected_candidate_reference` | `text_logo_integrity`, `artifact_control` | `unreadable_or_fake_text_logo` | false | false | Fake text or logo evidence must remain blocked and redacted. |
| `over_stylized_low_trust_result` | `rejected_candidate_reference` | `style_fit`, `trustworthiness` | `useful_style_warning` | false | false | Style can be useful as a warning, not as an accepted reference. |

## Recurring Failure Types

The first recurring-failure seed plan should cover at least five repeatable
failure types.

```text
product_identity_wrong
material_unrealistic_or_plasticized
commercial_unusable_composition
visible_high_risk_ai_artifact
unreadable_or_fake_text_logo
```

Future recurring-failure examples should use redacted metadata only and should
not promote a single plugin failure into a durable rule without review.

## Policy Rules

```text
seed_planning_does_not_create_seed_files: true
accepted_seed_does_not_imply_accepted_samples_write: true
rejected_seed_does_not_imply_memory_write: true
seed_ingestion_requires_separate_future_gate: true
image_binaries_remain_blocked: true
all_future_samples_require_redacted_metadata_only: true
```

### Seed Planning Rule

This phase defines targets and fields only. It does not create seed files,
fixtures, sample registries, image references, or binary asset records.

### Accepted Seed Rule

Accepted seed planning can identify positive reference categories, but it cannot
write `accepted_samples`, mark assets production-ready, or bypass human review.

### Rejected Seed Rule

Rejected seed planning can identify failure-reference categories, but it cannot
write DailyNote, VCP memory, or long-term style memory.

### Future Ingestion Rule

Actual seed ingestion requires a later gate with exact file allowlists,
redaction rules, sample provenance policy, and validation checks.

### Redaction Rule

All future seed examples must use redacted metadata only. Image binaries, raw
customer material, secret-bearing paths, and private source payloads remain
blocked.

## Blocked Boundaries

```text
prototype_files_modified: false
scripts_modified: false
schema_files_created: false
eval_samples_created: false
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
feeds_visual_eval_seed_record_schema_planning_later: true
feeds_future_seed_ingestion_authorization_later: true
feeds_review_console_decision_surface_later: true
schema_files_created_now: false
eval_samples_created_now: false
registries_created_now: false
image_binaries_read_now: false
```

## Recommended Next

```text
recommended_next: v14_025_visual_eval_seed_record_schema_planning_gate
docs_only_gate_creation_and_validation_only: true
runtime_provider_image_memory_production_batch: false
next_phase_started: false
```
