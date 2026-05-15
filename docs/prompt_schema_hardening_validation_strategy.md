# Prompt Schema Hardening Validation Strategy

```yaml
strategy_id: prompt_schema_hardening_validation_strategy_v1
route: V11 Prompt Schema Hardening
source_phase: v11_016_prompt_schema_hardening_validation_strategy_gate
source_inventory: docs/prompt_artifact_schema_inventory.md
mode: A4.8 docs-only validation strategy
machine_validator_implemented: false
```

This strategy consolidates the field-level validation plans drafted for the V11 canonical schemas. It is a validation design artifact only. It does not implement a validator, migrate existing documents, generate images, read secrets, write memory, or promote production.

## Validation Targets

| target | canonical schema | validation posture |
|---|---|---|
| Product brief | `docs/product_brief_canonical_schema.md` | Require stable product identity, structure, material, color, scene, text/logo, non-goal, and handoff fields for new briefs. Warn for legacy ceramic mug route without a dedicated brief. |
| Prompt package | `docs/prompt_package_canonical_schema.md` | Require runner-facing `prompt`, independent YAML block prompt fields, negative prompt, runner mapping, product identity, structure, material, scene, text/logo policy, and execution flags. |
| Static review | `docs/static_review_canonical_schema.md` | Require review target, source findings, checklist, verdict, A5 non-authorization, and recommended next fields. |
| A5 authorization | `docs/a5_authorization_canonical_schema.md` | Require separation of authorization draft, execution confirmation, and execution closeout; enforce one-call budgets, no retry, secret boundary, and local persistence success criteria. |
| Human review | `docs/human_review_canonical_schema.md` | Require reviewed output, product/prompt lineage, local persistence, asset status, accepted candidate decision, commercial delivery boundary, memory suitability, strengths, watch items, and safety. |
| Accepted candidate evidence package | `docs/accepted_candidate_evidence_package_canonical_schema.md` | Require source output, prompt package, lineage, human-review-backed accepted candidate decision, delivery/memory/production boundaries, rationale, strengths, and watch items. |

## Severity Model

```yaml
severity_model:
  fail:
    meaning: new or updated artifact violates canonical safety or required-field contract
    examples:
      - missing runner-facing prompt in new prompt package
      - accepted_candidate true without human review lineage
      - commercial_delivery_ready true in non-delivery evidence package
      - memory_write_performed true without separate memory authorization
      - runs_output_committed true in review or evidence package
      - provider_contact true in A4.8 docs-only gates
  warn:
    meaning: legacy artifact uses older but known route shape
    examples:
      - ceramic mug route lacks dedicated product brief artifact
      - accepted_candidate_path used instead of source_output in older evidence package
      - source_prompt_package used instead of prompt_package in older evidence package
      - older human review lacks local persistence fields
      - older prompt package omits positive_prompt but has runner-facing prompt
  info:
    meaning: context note without pass/fail impact
    examples:
      - score rubric varies by product route
      - delivery readiness was not attempted for serum bottle
      - machine validator implementation remains future work
```

## Required Fail Checks For New Artifacts

```yaml
new_artifact_fail_checks:
  all_artifacts:
    has_phase_or_schema_id: true
    has_source_phase: true
    has_recommended_next: true
    recommended_next_auto_execution_false_when_next_step_is_A5_or_risky: true
    provider_contact_false_for_A4_8_docs: true
    image_generation_false_for_A4_8_docs: true
    env_local_secret_value_read_false_for_A4_8_docs: true
    memory_write_false_without_memory_authorization: true
    production_candidate_002_false_without_production_authorization: true
    runs_output_committed_false: true
    accepted_samples_written_false: true

  product_brief:
    has_product_id: true
    has_product_identity_lock: true
    has_structure_lock: true
    has_material_constraints: true
    has_scene_strategy: true
    has_label_logo_text_policy: true
    has_non_goals: true

  prompt_package:
    has_prompt: true
    prompt_is_runner_facing_canonical_field: true
    prompt_literal_block_shape: true
    negative_prompt_literal_block_shape: true
    positive_prompt_when_present_synced_for_review: true
    has_runner_prompt_mapping: true
    has_product_identity: true
    has_structure_lock: true
    has_material_constraints: true
    has_text_logo_policy: true
    has_execution_flags: true

  static_review:
    has_review_target: true
    has_source_findings: true
    has_checklist: true
    has_result: true
    A5_authorization_created_false_unless_explicit_A5_gate: true

  A5_authorization:
    separates_authorization_execution_and_closeout: true
    has_provider_calls_max: true
    has_generation_attempts_max: true
    has_output_images_max: true
    auto_retry_false: true
    stop_after_generation_true: true
    success_requires_verified_local_file: true
    has_secret_read_boundary: true

  human_review:
    has_reviewed_output: true
    has_product: true
    has_prompt_package: true
    has_local_persistence: true
    has_asset_status: true
    has_accepted_candidate: true
    commercial_delivery_ready_separate: true
    memory_suitability_explicit: true
    has_strengths: true
    has_watch_items: true

  accepted_candidate_evidence_package:
    has_source_output: true
    has_prompt_package: true
    has_lineage: true
    accepted_candidate_true_only_after_human_review: true
    commercial_delivery_ready_false: true
    memory_suitability_deferred_by_default: true
    has_accepted_candidate_rationale: true
    has_key_strengths: true
    has_minor_watch_items: true
    output_image_added_to_git_false: true
    accepted_samples_written_false: true
    memory_write_performed_false: true
    production_candidate_002_started_false: true
```

## Legacy Warning Checks

```yaml
legacy_warning_checks:
  product_brief:
    ceramic_mug_route_missing_dedicated_brief: warn
  prompt_package:
    older_prompt_package_missing_positive_prompt: warn_if_prompt_present
  human_review:
    older_review_missing_local_persistence_fields: warn
    review_location_docs_vs_reviews_varies: warn
  evidence_package:
    accepted_candidate_path_used_instead_of_source_output: warn
    source_prompt_package_used_instead_of_prompt_package: warn
    local_persistence_fields_missing_from_older_records: warn
  delivery_readiness:
    premium_serum_bottle_delivery_readiness_not_created: info
```

## Non-Goals For This Strategy

```yaml
non_goals:
  implement_machine_validator_now: false
  migrate_existing_artifacts_now: false
  rewrite_historical_facts: false
  change_runner_behavior: false
  create_A5_authorization: false
  contact_provider: false
  generate_images: false
  write_memory: false
  create_accepted_samples: false
  promote_production_candidate_002: false
```

## Suggested Future Validator Shape

```yaml
future_validator:
  script_candidate: scripts/validate_prompt_workflow_schema_artifacts.js
  default_mode: report_only
  scan_roots:
    - briefs/
    - prompts/image_generation/
    - docs/
    - reviews/
  excluded_roots:
    - runs/
    - accepted_samples/
  output:
    fail_count: number
    warn_count: number
    info_count: number
    artifact_results: list
  safety:
    no_env_read: true
    no_provider_contact: true
    no_image_generation: true
    no_file_mutation_by_default: true
```

Implementation of the future validator requires a separate local code-change gate. This v11.016 strategy does not create or modify scripts.

## Route-Level Pass Condition

V11 Prompt Schema Hardening can be considered ready for route closeout when:

```yaml
route_level_pass_condition:
  prompt_package_schema_drafted_and_reviewed: true
  product_brief_schema_drafted_and_reviewed: true
  static_review_schema_drafted_and_reviewed: true
  A5_authorization_schema_drafted_and_reviewed: true
  human_review_schema_drafted_and_reviewed: true
  accepted_candidate_evidence_package_schema_drafted_and_reviewed: true
  validation_strategy_created: true
  machine_validator_implemented: false
  existing_artifacts_migrated: false
  provider_contact: false
  image_generation: false
  memory_write: false
  production_candidate_002: false
```
