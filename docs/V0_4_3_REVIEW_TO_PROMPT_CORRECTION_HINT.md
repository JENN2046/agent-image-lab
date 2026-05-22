# v0.4.3 Review to Prompt Correction Hint

base_contract: AGENTS.md
phase: v0_4_3_review_to_prompt_correction_hint
status: local_doc_schema_fixture_validator_gate

## Purpose

This gate converts v0.4.2 Visual Failure Taxonomy categories into structured
next-round prompt correction hints. The hints explain what a future prompt
should add, avoid, or adjust after a dry-run review identifies a failure.

This is not a generation gate. It does not create prompts for immediate
execution, generate images, call a provider, write memory, create a production
candidate, promote an accepted sample, or implement a real executor.

## Required Hint Fields

Every prompt correction hint must include:

- `prompt_constraints_to_add`
- `prompt_fragments_to_avoid`
- `lighting_adjustment`
- `composition_adjustment`
- `material_adjustment`

## Source Binding

The hint set must bind to:

- `schemas/visual_failure_taxonomy.schema.yaml`
- `tests/schema_examples/visual_failure_taxonomy.example.json`
- `reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json`

Every v0.4.2 taxonomy category must have exactly one correction hint:

- `composition_failure`
- `lighting_failure`
- `material_realism_failure`
- `product_fidelity_failure`
- `commercial_fitness_failure`
- `ai_artifact_failure`
- `registry_or_provenance_mismatch`

## Hint Contract

```yaml
visual_prompt_correction_hints:
  phase: v0_4_3_review_to_prompt_correction_hint
  source_failure_taxonomy_ref: tests/schema_examples/visual_failure_taxonomy.example.json
  source_review_pack_ref: reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json
  hint_mode: dry_run_no_generation
  hints:
    - taxonomy_category_id: composition_failure
      prompt_constraints_to_add: []
      prompt_fragments_to_avoid: []
      lighting_adjustment: string
      composition_adjustment: string
      material_adjustment: string
      generation_action_allowed: false
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

- missing hint for a required taxonomy category
- unknown taxonomy category
- duplicate taxonomy category hint
- missing `prompt_constraints_to_add`
- empty `prompt_constraints_to_add`
- missing `prompt_fragments_to_avoid`
- empty `prompt_fragments_to_avoid`
- missing `lighting_adjustment`
- missing `composition_adjustment`
- missing `material_adjustment`
- taxonomy source drift
- review pack source drift
- `generation_action_allowed: true`
- `image_generation_performed: true`
- `provider_call_performed: true`
- `VCP_memory_write_performed: true`
- `accepted_sample_auto_promotion: true`
- `production_candidate_created: true`
- raw local drive path or secret/env path references

## Non-Actions

This gate did not read image binaries, call a provider, generate an image, write
DailyNote, write VCP memory, perform runtime calls, read secrets, create a
production candidate, promote an accepted sample, promote a memory seed, change
dependencies, push, tag, release, or deploy.

Recommended next: v0.4.4 Sample Registry Dry Run.
