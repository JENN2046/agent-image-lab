# AIL-VIS-12 Visual Generation Authorization Gate

Base contract: `AGENTS.md`

Phase: `AIL-VIS-12_visual_generation_authorization_gate`
Mode: `docs_only_generation_authorization_gate`
Risk: `medium`

## Purpose

This phase defines the strict future execution boundary for the selected dark
tech still-life hero shot.

It does not request A5, does not call providers, does not generate images, does
not create output files, does not promote samples, and does not write memory.

## Source Context

This gate follows the selected target and planning artifacts from:

- `AIL-VIS-11_shot_plan_and_prompt_package_planning`
  - commit: `501d16abd4c4448690f2518322ac1b5224b7d0bf`
  - branch: `ail-vis-11-shot-plan-prompt-planning`
  - status: `final_closed`
  - selected target: `premium_dark_tech_product_still_life`

The planning phase already established the two-shot structure and the hardened
review language. This gate only locks the future generation boundary.

## Future Generation Boundary

- selected target: `premium_dark_tech_product_still_life`
- selected shot id: `visual_production_next_shot_dark_tech_hero_01`
- material detail shot authorized: `false`
- provider / model: `TBD`
- provider calls max: `1`
- plugin calls max: `1`
- API calls max: `0`
- max images: `1`

### Output Directory Policy

- root: `runs/real_generation/`
- future run directory: `runs/real_generation/<future-run-id>/`
- must be new directory: `true`
- overwrite existing files allowed: `false`
- reuse previous run directory allowed: `false`

This phase does not create the output directory. It only defines the policy for
a future generation gate.

## Required False Fields

- `actual_generation_allowed_now: false`
- `provider_call_allowed_now: false`
- `plugin_call_allowed_now: false`
- `api_call_allowed_now: false`
- `runtime_execution_allowed_now: false`
- `memory_write_allowed_now: false`
- `accepted_sample_allowed_now: false`
- `production_candidate_002_allowed_now: false`
- `batch_005_allowed_now: false`
- `A5_authorization_requested: false`

## Why This Boundary Is Strict

The current planning route is good enough to define the future execution limits,
but it is not an execution authorization.

The gate must stay fail-closed so that:

- no output directory is created early
- no provider/model is contacted early
- no image is generated early
- no memory path is opened early
- no promotion path is implied early

## Boundary Checks

- `image_generated: false`
- `provider_called: false`
- `plugin_called: false`
- `api_called: false`
- `runtime_execution_performed: false`
- `review_console_runtime_launched: false`
- `output_directory_created: false`
- `execution_prompt_authorized: false`
- `A5_authorization_requested: false`
- `accepted_sample_created: false`
- `memory_candidate_created: false`
- `actual_memory_write_performed: false`
- `daily_note_written: false`
- `vcp_memory_written: false`
- `codex_memory_mutated: false`
- `production_candidate_002_started: false`
- `batch_005_started: false`
- `dependency_changed: false`
- `package_json_modified: false`
- `git_add_dot_used: false`

## Forbidden Actions

This phase forbids:

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
- dependency change
- `package.json` modification
- `git add .`

## Next Safe Step

The next safe step is a separate execution gate only after an explicit A5
authorization is granted.

That execution gate is not started here.

## Closeout Template

```yaml
AIL_VIS_12_generation_authorization_closeout:
  phase_name: AIL-VIS-12_visual_generation_authorization_gate
  source_phase: AIL-VIS-11_shot_plan_and_prompt_package_planning
  source_commit: 501d16abd4c4448690f2518322ac1b5224b7d0bf
  selected_target: premium_dark_tech_product_still_life
  selected_shot_id: visual_production_next_shot_dark_tech_hero_01
  material_detail_shot_authorized: false
  provider_or_model: TBD
  provider_calls_max: 1
  plugin_calls_max: 1
  api_calls_max: 0
  max_images: 1
  decision: future_boundary_locked_only
  actual_generation_allowed_now: false
  provider_call_allowed_now: false
  plugin_call_allowed_now: false
  api_call_allowed_now: false
  runtime_execution_allowed_now: false
  memory_write_allowed_now: false
  accepted_sample_allowed_now: false
  production_candidate_002_allowed_now: false
  batch_005_allowed_now: false
  A5_authorization_requested: false
  next_phase_started: false
```
