# Human Review Canonical Schema

```yaml
schema_id: human_review_canonical_schema_v1
route: V11 Prompt Schema Hardening
source_phase: v11_012_human_review_schema_draft_gate
source_inventory: docs/prompt_artifact_schema_inventory.md
mode: A4.8 docs-only schema draft
```

This schema draft captures the human review fields that stabilized across the ceramic mug, sports visor, and premium serum bottle lanes. A human review record evaluates an existing local output reference. It does not generate another image, write memory, write accepted samples, promote production, or mark commercial delivery readiness unless a separate delivery review explicitly does so.

## Canonical Shape

```yaml
human_review:
  review_id: string_required
  review_status: draft_review | completed_human_review
  source_phase: string_required
  source_execution_phase: string_optional

  review_target:
    reviewed_output: string_required
    product: string_required
    prompt_package: string_required
    output_image_added_to_git: false
    accepted_samples_written: false

  local_persistence:
    local_persistence_verified: boolean_required
    local_files_verified_count: number_required
    local_persistence_success: boolean_required
    reviewable_sample: boolean_required

  decision:
    asset_status: string_required
    accepted_candidate: boolean_required
    commercial_delivery_ready: false
    memory_suitability: deferred | not_suitable | candidate_for_future_authorized_memory
    production_candidate_started: false

  findings:
    strengths: list_required
    watch_items: list_required
    revision_focus_if_any: list_optional
    key_findings: map_optional

  scores:
    product_accuracy: number_optional
    composition: number_optional
    material_texture: number_optional
    lifestyle_context: number_optional
    commercial_polish: number_optional
    overall: number_optional

  safety:
    provider_contact: false
    image_generation: false
    retry: false
    env_local_secret_value_read: false
    DailyNote_write: false
    VCP_memory_write: false
    memory_write_path: false
    production_candidate_002: false
    Batch_005: false
    runs_output_committed: false
    accepted_samples_written: false

  recommended_next:
    phase: string_required
    auto_execution_allowed: false
    purpose: string_required
```

## Field Rules

### Review Target

`reviewed_output` must reference an existing generation output path as a record, but the review schema does not add that output to Git and does not copy it into `accepted_samples/`.

### Local Persistence

Human review should only be marked `reviewable_sample: true` when local persistence is verified. When no local file exists, the correct route is a failed trial or persistence anomaly review rather than visual review.

### Decision Fields

`accepted_candidate` and `commercial_delivery_ready` are separate decisions.

`accepted_candidate: true` may coexist with `commercial_delivery_ready: false`, as shown by ceramic mug, sports visor, and serum bottle accepted candidates.

`memory_suitability` must not be auto-promoted to memory write. The default for accepted candidates is `deferred` unless a separate memory planning or memory authorization phase changes it.

### Findings And Scores

Strengths and watch items are required because they feed later prompt revision, evidence package, or delivery readiness planning. Numeric scores are optional because older review records do not always use the same score rubric.

### Safety Boundary

Human review is documentation only. It cannot authorize another generation, retry, memory write, accepted_samples write, production promotion, or commercial delivery.

## Validation Strategy

Future machine validation should check:

```yaml
human_review_static_checks:
  has_review_id: true
  has_review_status: true
  has_source_phase: true
  has_review_target: true
  has_reviewed_output: true
  has_product: true
  has_prompt_package: true
  output_image_added_to_git_false: true
  accepted_samples_written_false: true
  has_local_persistence: true
  reviewable_sample_requires_local_persistence_success: true
  has_decision: true
  has_asset_status: true
  has_accepted_candidate: true
  commercial_delivery_ready_separate_and_false_by_default: true
  memory_suitability_present: true
  memory_write_not_implied: true
  has_strengths: true
  has_watch_items: true
  has_safety: true
  provider_contact_false: true
  image_generation_false: true
  retry_false: true
  runs_output_committed_false: true
  recommended_next_auto_execution_false: true
```

Future validation should warn, not fail, when older reviews lack newer local persistence fields:

```yaml
legacy_warning_checks:
  older_review_missing_local_persistence_fields: warn
  review_location_docs_vs_reviews_varies: warn
  score_rubric_varies_by_product_lane: warn
```

## Non-Authorization

```yaml
provider_contact: false
image_generation: false
retry: false
env_local_secret_value_read: false
DailyNote_write: false
VCP_memory_write: false
memory_write_path: false
production_candidate_002: false
Batch_005: false
accepted_samples_written: false
runs_output_committed: false
runtime_execution: false
review_artifact_migration_performed: false
commercial_delivery_ready_changed: false
memory_write_performed: false
```
