# Accepted Candidate Evidence Package Canonical Schema

```yaml
schema_id: accepted_candidate_evidence_package_canonical_schema_v1
route: V11 Prompt Schema Hardening
source_phase: v11_014_accepted_candidate_evidence_package_schema_draft_gate
source_inventory: docs/prompt_artifact_schema_inventory.md
mode: A4.8 docs-only schema draft
```

This schema normalizes the accepted candidate evidence package fields that stabilized across the ceramic mug, sports visor, and premium serum bottle product routes. An evidence package proves why an existing local output can be treated as an accepted candidate. It does not copy the output image, write `accepted_samples/`, write memory, promote production, or mark the asset as commercial delivery ready.

## Canonical Shape

```yaml
accepted_candidate_evidence_package:
  package_id: string_required
  package_status: draft_evidence | completed_evidence_package
  source_phase: string_required
  route: string_required
  product: string_required

  candidate:
    source_output: string_required
    prompt_package: string_required
    source_generation_phase: string_required
    human_review_phase: string_required
    asset_status: string_required
    accepted_candidate: true
    commercial_delivery_ready: false
    memory_suitability: deferred
    local_files_verified_count: number_required
    local_persistence_success: boolean_required
    output_image_added_to_git: false
    accepted_samples_written: false
    memory_write_performed: false
    production_candidate_002_started: false

  lineage:
    product_brief: string_optional
    prompt_package: string_required
    static_review_gate: string_optional
    authorization_gate: string_optional
    execution_phase: string_required
    human_review_gate: string_required
    evidence_gate: string_required

  evidence_summary:
    product_identity_correct: boolean_required
    prompt_workflow_validated: boolean_required
    local_persistence_verified: boolean_required
    accepted_candidate_rationale: list_required
    key_strengths: list_required
    minor_watch_items: list_required

  boundaries:
    commercial_delivery_ready: false
    memory_suitability: deferred
    future_memory_write_requires_independent_authorization: true
    future_production_candidate_requires_independent_authorization: true
    real_retouch_execution_performed: false
    delivery_package_created: false
    runs_output_committed: false
    accepted_samples_written: false
    output_image_added_to_git: false

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
    dependency_change: false
    package_json_modified: false
    runs_output_committed: false
    accepted_samples_written: false

  recommended_next:
    phase: string_required
    auto_execution_allowed: false
    purpose: string_required
```

## Field Rules

### Candidate Source

`source_output` is the canonical field for the accepted candidate image path. Older records may use `accepted_candidate_path`; future evidence packages should normalize that value into `source_output` while preserving the original file path text.

`prompt_package` is the canonical field for the prompt package that produced the candidate. Older records may use `source_prompt_package`; future packages should normalize that value into `prompt_package`.

### Candidate Decision

`accepted_candidate: true` is allowed only when a prior human review has explicitly reached that conclusion.

`commercial_delivery_ready` remains separate and defaults to `false`. An evidence package can prove candidate value without proving final delivery readiness.

`memory_suitability` must be explicit and should remain `deferred` unless a separate memory planning or memory authorization phase changes it.

### Lineage

Evidence packages should preserve the route path from product brief and prompt package through static review, authorization, execution, human review, and evidence packaging. Legacy ceramic mug records may not have a dedicated product brief artifact; that should be recorded as optional lineage rather than backfilled.

### Evidence Summary

The evidence summary must explain why the output is an accepted candidate and what remains imperfect. `minor_watch_items` are required so delivery readiness, prompt revision, or retouch planning can continue without re-reading the entire route history.

### Boundary Fields

Evidence packages are proof records, not promotion records. They must keep:

```yaml
output_image_added_to_git: false
accepted_samples_written: false
runs_output_committed: false
memory_write_performed: false
production_candidate_002_started: false
commercial_delivery_ready: false
```

Future memory writes, production candidate promotion, real retouch execution, or delivery package creation require independent authorization and their own gate.

## Validation Strategy

Future machine validation should check:

```yaml
accepted_candidate_evidence_package_static_checks:
  has_package_id: true
  has_package_status: true
  has_source_phase: true
  has_product: true
  has_candidate: true
  has_source_output: true
  has_prompt_package: true
  accepted_candidate_true_only_after_human_review: true
  commercial_delivery_ready_false: true
  memory_suitability_present_and_not_auto_promoted: true
  output_image_added_to_git_false: true
  accepted_samples_written_false: true
  memory_write_performed_false: true
  production_candidate_002_started_false: true
  has_lineage: true
  has_evidence_summary: true
  has_accepted_candidate_rationale: true
  has_key_strengths: true
  has_minor_watch_items: true
  boundaries_keep_future_authorizations_explicit: true
  safety_provider_contact_false: true
  safety_image_generation_false: true
  safety_retry_false: true
  safety_runs_output_committed_false: true
  recommended_next_auto_execution_false: true
```

Future validation should warn, not fail, for legacy package key drift:

```yaml
legacy_warning_checks:
  accepted_candidate_path_used_instead_of_source_output: warn
  source_prompt_package_used_instead_of_prompt_package: warn
  product_brief_lineage_missing_for_legacy_ceramic_mug: warn
  local_persistence_fields_missing_from_older_records: warn
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
delivery_package_created: false
real_retouch_execution_performed: false
commercial_delivery_ready_changed: false
memory_write_performed: false
```
