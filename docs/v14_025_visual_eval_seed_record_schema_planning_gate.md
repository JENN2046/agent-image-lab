# V14.025 Visual Eval Seed Record Schema Planning Gate

```yaml
phase: v14_025_visual_eval_seed_record_schema_planning_gate
base_contract: AGENTS.md
mode: A4.8 docs-only product planning gate
intent: planning
risk_level: R1
source_phase: v14_024_visual_eval_minimal_seed_set_planning_gate
source_commit: 043f32843a9d990db85096dfb63034efed97a260
selected_product_route: B_visual_eval_and_failure_taxonomy_planning
```

## Purpose

V14.025 plans the future visual-evaluation seed record schema. It turns the
v14.024 seed record field vocabulary into a schema design contract, including
required fields, enum boundaries, redaction defaults, review status fields, and
validation expectations for a later implementation gate.

This is docs-only planning. It does not create schema files, eval sample files,
accepted/rejected registries, accepted_samples entries, image references, image
binary reads, memory writes, production routes, runtime paths, provider calls,
or image generation.

## Future Schema Target

```yaml
future_schema_target:
  proposed_schema_path: schemas/visual_eval_seed_record.schema.yaml
  proposed_example_path: tests/schema_examples/visual_eval_seed_record.example.yaml
  implementation_allowed_now: false
  schema_file_created_now: false
  example_file_created_now: false
```

The proposed paths are planning targets only. They are not authorized write
paths for this phase.

## Required Field Plan

Each future seed record should require the following fields.

```yaml
required_fields:
  - seed_id
  - source_type
  - intended_decision
  - seed_category
  - linked_rubric_dimensions
  - linked_failure_tags
  - review_note
  - redaction_status
  - memory_suitability_default
  - production_candidate_eligible_default
```

These fields keep every future seed record explicit about its purpose, review
meaning, redaction posture, memory boundary, and production boundary.

## Optional Field Plan

```yaml
optional_fields:
  - reviewer_id
  - reviewer_confidence
  - source_reference_id
  - asset_reference_redacted
  - provenance_note
  - created_from_phase
  - validation_notes
```

Optional fields may support traceability later, but they must not contain raw
private paths, customer material, tokens, cookies, secret-bearing config, or
image binary payloads.

## Enum Planning

```yaml
enum_planning:
  source_type:
    - accepted_reference
    - rejected_reference
    - synthetic_fixture
    - redacted_prior_case
  intended_decision:
    - accepted_candidate_reference
    - rejected_candidate_reference
    - archive_reference_only
    - human_review_required
  redaction_status:
    - redacted_metadata_only
    - needs_redaction_review
    - blocked_sensitive_source
  reviewer_confidence:
    - high
    - medium
    - low
    - not_reviewed
```

Enum values are deliberately narrow so later validators can reject ambiguous or
secret-bearing sample records.

## Default Value Plan

```yaml
default_values:
  memory_suitability_default: false
  production_candidate_eligible_default: false
  redaction_status: redacted_metadata_only
  reviewer_confidence: not_reviewed
```

The schema should make safety defaults easy to validate. Visual acceptance,
memory suitability, and production eligibility must remain separate decisions.

## Validation Rule Plan

```text
seed_id_must_be_unique_within_registry: true
linked_rubric_dimensions_must_be_non_empty: true
accepted_reference_must_not_include_failure_tags_by_default: true
rejected_reference_must_include_failure_or_archive_reason: true
memory_suitability_default_must_start_false: true
production_candidate_eligible_default_must_start_false: true
asset_reference_must_be_redacted_if_present: true
image_binary_path_must_not_be_required: true
raw_private_path_must_be_rejected: true
```

Future implementation should validate the record as metadata only. The schema
must not require image files, raw provider payloads, real VCP paths, or private
source material.

## Field Mapping From V14.024

| V14.024 field | V14.025 schema planning target | Notes |
|---|---|---|
| `seed_id` | required string identifier | Unique within the future seed registry. |
| `source_type` | required enum | Indicates accepted, rejected, synthetic, or redacted prior-case source. |
| `intended_decision` | required enum | Records the review meaning without authorizing promotion. |
| `linked_rubric_dimensions` | required non-empty list | Must map to the visual evaluation rubric vocabulary. |
| `linked_failure_tags` | required list | Empty is allowed for accepted references; rejected references should name a failure tag. |
| `review_note` | required redacted text | Must explain review value without raw private material. |
| `memory_suitability_default` | required boolean false by default | Memory write remains a separate future gate. |
| `production_candidate_eligible_default` | required boolean false by default | Production route remains blocked by default. |
| `redaction_requirement` | `redaction_status` enum plus redaction validation rules | All future records remain metadata-only unless separately authorized. |

## Blocked Boundaries

```text
prototype_files_modified: false
scripts_modified: false
schema_files_created: false
schema_files_modified: false
eval_samples_created: false
accepted_registry_created: false
rejected_registry_created: false
accepted_samples_written: false
image_references_created: false
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

## Future Handoff

```text
feeds_visual_eval_seed_record_schema_draft_later: true
feeds_future_seed_fixture_planning_later: true
feeds_review_console_seed_evidence_surface_later: true
schema_files_created_now: false
eval_samples_created_now: false
registries_created_now: false
image_binaries_read_now: false
```

## Recommended Next

```text
recommended_next: v14_026_visual_eval_seed_record_schema_draft_gate
docs_only_or_schema_draft_gate_only: true
runtime_provider_image_memory_production_batch: false
next_phase_started: false
```
