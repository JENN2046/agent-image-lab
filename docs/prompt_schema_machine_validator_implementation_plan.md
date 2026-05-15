# Prompt Schema Machine Validator Implementation Plan

```yaml
plan_id: prompt_schema_machine_validator_implementation_plan_v1
route: V12 Prompt Schema Machine Validator Implementation Planning
source_phase: v12_002_prompt_schema_machine_validator_implementation_planning_gate
source_route: V11 Prompt Schema Hardening
mode: A4.8 docs-only implementation planning
machine_validator_implemented: false
existing_artifacts_migrated: false
scripts_modified: false
dependency_change: false
```

This plan translates the V11 canonical schema documents into a future machine validator implementation path. It is not the implementation. It does not create a validator script, modify `scripts/`, add dependencies, migrate artifacts, modify prompt packages, contact providers, generate images, read `.env.local`, write memory, enter production, or run runtime code.

## Validator Scope

The future validator should be a local, read-only repository validator. Its first useful version should inspect schema-bearing docs and prompt package YAML files without mutating them.

```yaml
validator_scope:
  execution_model: local_read_only
  mutation_allowed: false
  remote_access_allowed: false
  provider_contact_allowed: false
  image_generation_allowed: false
  env_local_secret_value_read_allowed: false
  dependency_install_required: false
  initial_cli_shape: future_only
  future_script_candidate: scripts/validate_prompt_schema_artifacts.js
```

## Schema-to-Validator Mapping

| schema | canonical source | future validator module | first-pass behavior |
|---|---|---|---|
| `prompt_package_schema_v1` | `docs/schemas/prompt_package_schema_v1.md` | prompt package shape validator | Fail new packages missing runner-facing `prompt`, independent literal prompt blocks, negative prompt, product identity, constraints, or execution boundary flags. |
| `product_brief_schema` | `docs/product_brief_canonical_schema.md` | product brief validator | Fail new briefs missing identity, structure, material, scene, text/logo, acceptance, known risk, or handoff fields; warn for legacy ceramic mug brief absence. |
| `static_review_schema` | `docs/static_review_canonical_schema.md` | static review validator | Fail reviews missing target, source findings, checklist, verdict, authorization boundary, or recommended next. |
| `A5_authorization_schema` | `docs/a5_authorization_canonical_schema.md` | A5 authorization validator | Fail records that collapse authorization draft, execution confirmation, and execution closeout, or loosen one-call/no-retry/secret/local-persistence rules. |
| `human_review_schema` | `docs/human_review_canonical_schema.md` | human review validator | Fail reviews missing output lineage, local persistence evidence, accepted candidate split, memory suitability, watch items, or safety fields. |
| `accepted_candidate_evidence_package_schema` | `docs/accepted_candidate_evidence_package_canonical_schema.md` | evidence package validator | Fail evidence packages missing source output, prompt lineage, human review backing, accepted/commercial split, memory boundary, or output commit boundary. |
| `route_level_validation_strategy` | `docs/prompt_schema_hardening_validation_strategy.md` | severity and orchestration layer | Apply fail/warn/info policy and legacy compatibility rules consistently across artifact classes. |

## Rule Groups

```yaml
rule_groups:
  yaml_shape:
    purpose: verify literal block fields and required YAML keys where artifacts are YAML or YAML-like markdown blocks
    examples:
      - prompt: | independent line
      - positive_prompt: | independent line
      - negative_prompt: | independent line
  canonical_identity:
    purpose: verify product identity and selected product fields do not drift
    examples:
      - product_identity exists
      - selected_product exists
      - locked_structure exists
  constraints:
    purpose: verify material, structure, scene, forbidden elements, and acceptance criteria
  execution_boundary:
    purpose: prevent docs-only artifacts from implying provider contact, image generation, memory write, or production promotion
  review_decision_split:
    purpose: keep accepted_candidate, commercial_delivery_ready, and memory_suitability separate
  persistence_and_output_safety:
    purpose: require local persistence evidence where relevant and forbid runs output commits or accepted_samples writes
  legacy_compatibility:
    purpose: warn rather than fail known older route shapes unless they loosen safety
```

## Fixture Strategy

The future validator should use small, purpose-built fixtures rather than the entire historical repository as the only test bed.

```yaml
fixture_strategy:
  fixture_root_future: tests/fixtures/prompt_schema_validator/
  positive_fixtures:
    - minimal_valid_prompt_package_v1.yaml
    - minimal_valid_product_brief_v1.yaml
    - minimal_valid_static_review_v1.md
    - minimal_valid_A5_authorization_record_v1.md
    - minimal_valid_human_review_v1.md
    - minimal_valid_evidence_package_v1.md
  negative_fixtures:
    - prompt_package_missing_prompt.yaml
    - prompt_package_embedded_positive_prompt.yaml
    - prompt_positive_mismatch.yaml
    - prompt_package_missing_negative_prompt.yaml
    - brief_missing_structure_lock.md
    - static_review_missing_authorization_boundary.md
    - A5_record_allows_retry.md
    - human_review_commercial_delivery_equals_accepted.md
    - evidence_package_runs_output_committed.md
  legacy_fixtures:
    - ceramic_mug_no_dedicated_brief_warn_only.md
    - older_evidence_package_accepted_candidate_path_warn_only.md
```

Fixtures should be added only in a later fixture planning or implementation gate. This phase creates no fixture files.

## Pass / Fail / Warning Policy

```yaml
severity_policy:
  fail:
    applies_to:
      - new artifact missing canonical required field
      - new artifact loosening provider/image/memory/production/runtime boundary
      - prompt package missing runner-facing canonical prompt field
      - prompt and positive_prompt mismatch in schema-conforming packages
      - accepted_candidate treated as commercial_delivery_ready
      - memory_suitability auto-inferred or memory write implied
      - runs_output_commit_allowed true
      - accepted_samples_write_allowed true
  warn:
    applies_to:
      - known legacy artifact shape without safety loosening
      - older field name that has a clear canonical equivalent
      - legacy ceramic mug brief absence
      - historical review missing local persistence fields before guard existed
  info:
    applies_to:
      - route context
      - product-specific scoring differences
      - machine validator still future work
```

## Legacy Artifact Compatibility Policy

Legacy artifacts must not be bulk-rewritten by the first validator implementation. The first validator should distinguish new canonical artifacts from older route records.

```yaml
legacy_policy:
  migration_now: false
  validator_should_support_legacy_warn_list: true
  legacy_warning_allowed_only_if_safety_preserved: true
  legacy_fail_if_boundary_loosened: true
  historical_fact_rewrite_allowed: false
  existing_artifact_migration_requires_separate_gate: true
```

## Implementation Phase Plan

```yaml
implementation_phase_plan:
  v12_003_prompt_schema_validator_rule_specification_gate:
    purpose: produce exact rule spec and fixture matrix
    implementation: false
  v12_004_prompt_schema_validator_fixture_planning_gate:
    purpose: define fixture file names, positive and negative cases, and expected results
    implementation: false
  v12_005_prompt_schema_validator_implementation_authorization_gate:
    purpose: decide whether to allow scripts/ validator implementation
    implementation: false
  future_implementation_gate:
    purpose: create validator script only after explicit authorization
    implementation: true_only_if_authorized
```

## Risk Matrix

| risk | impact | mitigation |
|---|---|---|
| Over-failing legacy records | Blocks useful validation with historical drift noise | Use warn policy for known legacy shapes and fail only on safety loosening. |
| Under-failing new artifacts | Allows schema drift to return | Make new artifact mode strict for required fields and safety flags. |
| Prompt parsing brittleness | False positives around YAML literal blocks | Use structured YAML parser when available in future implementation; keep regex only for line-shape checks. |
| Validator mutates files | Damages historical records | Future validator must be read-only by default. |
| Hidden dependency churn | Changes package files | Prefer Node standard library and existing repo patterns unless separately authorized. |
| Safety boundary dilution | Validator starts treating docs as execution authorization | Keep provider/image/memory/production flags as hard fail checks. |

## Implementation Readiness Conditions

The future implementation gate should require all of:

```yaml
implementation_readiness:
  rule_spec_completed: true
  fixture_matrix_completed: true
  write_set_authorized:
    - scripts/ future validator path
    - tests/fixtures/ future fixture path
  package_json_change_authorized: false
  no_dependency_addition_expected: true
  legacy_policy_approved: true
  validator_read_only_default: true
  provider_contact_allowed: false
  image_generation_allowed: false
  memory_write_allowed: false
  production_candidate_002_allowed: false
```
