# v0.4.2 Visual Failure Taxonomy

base_contract: AGENTS.md
phase: v0_4_2_visual_failure_taxonomy
status: local_doc_schema_fixture_validator_gate

## Purpose

This gate defines the shared failure vocabulary that turns a dry-run review pack
into reusable visual judgment. The taxonomy is metadata-only and describes why
an existing reviewed asset should be patched, rejected, or kept for later human
review.

The taxonomy does not generate a new image, inspect image pixels, call a
provider, write memory, create a production candidate, promote an accepted
sample, or implement a real executor.

## Required Failure Categories

- `composition_failure`
- `lighting_failure`
- `material_realism_failure`
- `product_fidelity_failure`
- `commercial_fitness_failure`
- `ai_artifact_failure`
- `registry_or_provenance_mismatch`

## Category Contract

Each category must provide:

- `category_id`: one of the required category ids.
- `definition`: a non-empty explanation of the failure.
- `applies_to_dimensions`: one or more Visual Asset Eval dimensions.
- `severity_scale`: exactly `minor`, `moderate`, `major`, and `blocking`.
- `dry_run_detection_signals`: metadata-only signals a reviewer can cite.
- `reviewer_question`: the question this category asks during review.
- `correction_hint_bridge`: a non-executing bridge into the future v0.4.3 prompt
  correction hint.

## Boundary Contract

```yaml
visual_failure_taxonomy:
  phase: v0_4_2_visual_failure_taxonomy
  source_review_pack_ref: reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json
  required_categories_count: 7
  categories_exact_set:
    - composition_failure
    - lighting_failure
    - material_realism_failure
    - product_fidelity_failure
    - commercial_fitness_failure
    - ai_artifact_failure
    - registry_or_provenance_mismatch
  side_effects:
    provider_call_performed: false
    image_generation_performed: false
    VCP_memory_write_performed: false
    DailyNote_write_performed: false
    runtime_call_performed: false
    secret_value_read_performed: false
    production_candidate_created: false
    accepted_sample_auto_promotion: false
    memory_seed_promoted: false
```

## Negative Cases

The validator must fail closed for:

- missing category
- unknown category
- duplicate category
- empty category definition
- missing severity scale
- invalid severity scale
- missing detection signals
- missing correction hint bridge
- category not mapped to a review dimension
- review pack reference drift
- `accepted_sample_auto_promotion: true`
- `production_candidate_created: true`
- `VCP_memory_write_performed: true`
- `image_generation_performed: true`
- provider/runtime/secret side-effect drift
- raw local drive path or secret/env path references

## Non-Actions

This gate did not read image binaries, call a provider, generate an image, write
DailyNote, write VCP memory, perform runtime calls, read secrets, create a
production candidate, promote an accepted sample, promote a memory seed, change
dependencies, push, tag, release, or deploy.

Recommended next: v0.4.3 Review to Prompt Correction Hint.
