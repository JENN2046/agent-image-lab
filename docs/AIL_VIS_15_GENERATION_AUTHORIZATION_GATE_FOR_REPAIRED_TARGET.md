# AIL-VIS-15 Generation Authorization Gate For Repaired Target

Base contract: `AGENTS.md`

Phase: `AIL-VIS-15_generation_authorization_gate_for_repaired_target`
Mode: `docs_only_generation_authorization_gate`
Risk: `medium`

## Purpose

This phase drafts the generation authorization gate for the repaired headphones
target.

It defines the future execution boundary only. It does not request A5, does not
call providers, does not generate images, does not create output directories,
does not promote samples, and does not write memory.

## Source Context

This gate follows the target repair phase:

- `AIL-VIS-14_target_identity_repair_gate`
  - commit: `31afc4364c25f1ca0a0a7a1e2a6ea8a37fd18cfc`
  - branch: `ail-vis-14-target-identity-repair`
  - status: `final_closed`
  - repaired target: `premium_black_wireless_headphones_product_hero`

The repaired planning artifacts are:

- `prompts/image_generation/visual_production_next_shot_plan.yaml`
- `prompts/image_generation/visual_production_next_prompt_package.yaml`

## Future Generation Boundary

```yaml
future_generation_boundary:
  selected_target: premium_black_wireless_headphones_product_hero
  selected_shot_id: visual_production_next_shot_black_headphones_hero_01
  material_detail_shot_authorized: false
  provider_or_model: TBD
  provider_calls_max: 1
  plugin_calls_max: 1
  api_calls_max: 0
  max_images: 1
  output_directory_policy:
    root: runs/real_generation/
    future_run_directory: runs/real_generation/<future-run-id>/
    must_be_new_directory: true
    overwrite_existing_files_allowed: false
    reuse_previous_run_directory_allowed: false
```

## Required False Fields

```yaml
required_false_fields:
  actual_generation_allowed_now: false
  provider_call_allowed_now: false
  plugin_call_allowed_now: false
  api_call_allowed_now: false
  runtime_execution_allowed_now: false
  output_directory_creation_allowed_now: false
  A5_authorization_requested: false
  memory_write_allowed_now: false
  accepted_sample_allowed_now: false
  production_candidate_002_allowed_now: false
  batch_005_allowed_now: false
```

## Why This Gate Exists

The target is repaired, but repair is not execution.

This phase creates a new future boundary so the next execution path cannot
reuse the earlier broad dark-tech authorization shape. Any future one-shot run
must reference the repaired headphones target, the repaired hero shot id, and a
new output directory.

## Output Directory Policy

The future output directory must live under:

- `runs/real_generation/`

The exact future run directory must be new:

- `runs/real_generation/<future-run-id>/`

This phase does not create that directory. It only records the policy.

## Review Requirement

Any future execution must be followed by visual review before sample promotion,
memory candidate creation, production candidate work, or batch routing can be
considered.

The review must check at minimum:

- headphone identity is clear
- no drift into lantern, speaker, camera lens, SSD, bottle, desk lamp, or
  generic tech object
- product is dominant and fully readable
- material finish reads as premium audio hardware
- no text, logos, watermarks, or brand marks are introduced
- no human, hand, face, or body content appears
- no output is promoted automatically

## Fail-Closed Conditions

Future execution should fail closed if:

- the target is not `premium_black_wireless_headphones_product_hero`
- the selected shot id is not `visual_production_next_shot_black_headphones_hero_01`
- the output directory already exists
- more than one image would be generated
- provider, plugin, or API counts exceed the defined budget
- the model produces a different product class
- the output contains text, logo, watermark, people, hands, or visible AI artifact
- any memory, accepted sample, production candidate, or Batch 005 path is opened

## Authorization Boundary

This phase does not authorize:

- image generation
- provider call
- plugin call
- API call
- runtime execution
- Review Console runtime launch
- output directory creation
- execution prompt authorization
- A5 authorization request
- accepted sample promotion
- memory candidate creation
- actual memory write
- DailyNote write
- VCP memory write
- codex-memory mutation
- production_candidate_002
- Batch 005
- copying generated images into repo
- deleting generated images
- dependency change
- package.json modification
- `git add .`

## Final State

```yaml
AIL_VIS_15_final_state:
  generation_authorization_gate_created: true
  generation_allowed_now: false
  A5_authorization_requested: false
  memory_write_allowed_now: false
  accepted_sample_allowed_now: false
  next_phase_started: false
```

## Selected Next Phase

The next phase should be a separate pre-execution static review and A5
authorization request only if the project chooses to pursue a future one-shot
headphones generation.

This phase does not start that next phase.

## Closeout Template

```yaml
AIL_VIS_15_closeout:
  phase_name: AIL-VIS-15_generation_authorization_gate_for_repaired_target
  mode: docs_only_generation_authorization_gate
  status: completed_validated_pushed
  selected_target: premium_black_wireless_headphones_product_hero
  selected_shot_id: visual_production_next_shot_black_headphones_hero_01
  generation_authorization_gate_created: true
  generation_allowed_now: false
  A5_authorization_requested: false
  memory_write_allowed_now: false
  accepted_sample_allowed_now: false
  next_phase_started: false
```
