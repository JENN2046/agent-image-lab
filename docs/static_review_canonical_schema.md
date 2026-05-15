# Static Review Canonical Schema

```yaml
schema_id: static_review_canonical_schema_v1
route: V11 Prompt Schema Hardening
source_phase: v11_008_static_review_schema_draft_gate
source_inventory: docs/prompt_artifact_schema_inventory.md
mode: A4.8 docs-only schema draft
```

This schema draft captures the fields that stabilized in prompt and schema static review gates. A static review record evaluates a draft artifact, records coverage and gaps, and routes to the next decision or draft gate. It is not an execution authorization and never performs provider contact, image generation, memory write, accepted_samples write, production promotion, output directory creation, or runtime work.

## Canonical Shape

```yaml
static_review:
  review_id: string_required
  review_type: prompt_package_static_review | schema_static_review | authorization_static_review | delivery_static_review
  review_status: draft_review | pass_for_static_review | pass_ready_for_authorization_decision | blocked_needs_revision
  source_phase: string_required
  source_commit: string_optional

  review_target:
    target_type: product_brief | prompt_package | static_review_schema | A5_authorization_schema | human_review_schema | evidence_package_schema | delivery_readiness_artifact
    target_path: string_required
    target_version: string_optional

  source_context:
    source_inventory: string_optional
    source_review: string_optional
    source_output: string_optional
    source_findings: list_required
    previous_watch_items: list_optional

  checklist:
    - check_id: string_required
      check_name: string_required
      expected_condition: string_required
      result: pass | pass_with_gap | fail | not_applicable
      evidence: string_required
      risk_if_missing: string_required

  review_result:
    verdict: pass_for_static_review | pass_ready_for_authorization_decision | blocked_needs_revision
    reason: string_required
    remaining_risks: list_required
    machine_validator_implemented: boolean_required

  authorization_boundary:
    A5_authorization_created: false
    provider_contact: false
    image_generation: false
    retry: false
    env_local_secret_value_read: false
    memory_write: false
    production_candidate_002: false
    accepted_samples_written: false
    runs_output_committed: false

  recommended_next:
    phase: string_required
    auto_execution_allowed: boolean_required
    purpose: string_required
```

## Field Rules

### Review Identity

`review_id`, `review_type`, `review_status`, and `source_phase` are required for every static review record.

`review_status` must describe review maturity only. It must not imply provider contact, image generation, memory write, production readiness, or commercial delivery readiness.

### Review Target

`review_target` must identify the exact artifact being reviewed. Static review must not silently switch prompt packages, product briefs, schemas, or route artifacts.

### Source Context

`source_context.source_findings` is required so the review records what problem set it is checking against.

Examples:

- Prompt v2 static review should reference prior human review watch items.
- Schema static review should reference the schema inventory or schema draft gate.
- Authorization static review should reference the approved product, prompt package, budgets, output directory, and no-retry boundary.

### Checklist

Each checklist item must be machine-addressable enough for later validation:

- stable `check_id`
- expected condition
- result
- concrete evidence
- risk if missing

Prose commentary may accompany the checklist, but it cannot replace the structured checklist.

### Review Result

`review_result.verdict` may indicate readiness for the next non-execution gate or for a future authorization decision. It must not create A5 authorization by itself.

`pass_ready_for_authorization_decision` means the artifact may proceed to a human decision gate, not to provider execution.

### Authorization Boundary

Static review records must keep execution flags false. A static review can recommend a future authorization decision gate, but it cannot perform or imply provider contact, image generation, `.env.local` read, memory write, accepted_samples write, production promotion, runs output creation, or runtime work.

### Recommended Next

`recommended_next.auto_execution_allowed` must be true only for safe A4.8 docs-only gates. It must be false for A5 authorization, provider execution, memory write, production, runtime, or external side-effect gates.

## Validation Strategy

Future machine validation should check:

```yaml
static_review_static_checks:
  has_review_id: true
  has_review_type: true
  has_review_status: true
  has_source_phase: true
  has_review_target: true
  has_source_context: true
  source_findings_non_empty: true
  checklist_non_empty: true
  checklist_items_have_check_id: true
  checklist_items_have_expected_condition: true
  checklist_items_have_result: true
  checklist_items_have_evidence: true
  checklist_items_have_risk_if_missing: true
  has_review_result: true
  verdict_allowed_value: true
  has_authorization_boundary: true
  A5_authorization_created_false: true
  provider_contact_false: true
  image_generation_false: true
  retry_false: true
  env_local_secret_value_read_false: true
  memory_write_false: true
  accepted_samples_written_false: true
  runs_output_committed_false: true
  recommended_next_present: true
  recommended_next_blocks_A5_auto_execution: true
```

Future validation should warn, not fail, when older static review artifacts use prose-led field names:

```yaml
legacy_warning_checks:
  prose_led_static_review_fields: warn
  review_record_split_between_docs_and_reviews: warn
  verdict_name_differs_but_semantics_match: warn
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
prompt_package_behavior_changed: false
A5_generation_authorization_created: false
```
