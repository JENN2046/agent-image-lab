# AIL-VIS-04 Visual Generation Authorization Gate

Base contract: `AGENTS.md`

Phase: `AIL-VIS-04_visual_generation_authorization_gate`
Mode: `docs_only_generation_authorization_gate`
Risk: `low_to_medium`

## Purpose

This phase turns the approved visual planning surfaces from `AIL-VIS-03`
into a strict generation authorization boundary.

It does not generate images, call providers, open runtime paths, or open any
memory write path. It only records what must be true before future execution is
allowed.

## Source Context From AIL-VIS-03

`AIL-VIS-03_visual_prompt_package_and_shot_plan_refresh` prepared the next
visual production planning artifacts for the premium portable LED camping
lantern route.

Those artifacts are:

- `docs/AIL_VIS_03_VISUAL_PROMPT_PACKAGE_AND_SHOT_PLAN_REFRESH.md`
- `prompts/image_generation/visual_production_next_shot_plan.yaml`
- `prompts/image_generation/visual_production_next_prompt_package.yaml`

The planning step defined two shots, but this gate authorizes only the hero
shot first.

## Selected Visual Target

The selected product remains:

- `premium_portable_led_camping_lantern`

The authorized shot for the next future execution gate is:

- `visual_production_next_shot_hero_01`

The material detail shot remains planned evidence, but it is not authorized by
this gate.

## Future Generation Authorization Packet

```yaml
future_generation_authorization:
  phase: AIL-VIS-04_visual_generation_authorization_gate
  selected_product: premium_portable_led_camping_lantern
  selected_shot_id: visual_production_next_shot_hero_01
  source_prompt_package_ref: prompts/image_generation/visual_production_next_prompt_package.yaml
  source_shot_plan_ref: prompts/image_generation/visual_production_next_shot_plan.yaml
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
  filename_policy:
    primary_image: codex_session_premium_portable_led_camping_lantern_hero_01.png
    metadata_files: only if explicitly named by the future execution gate
  review_requirements:
    - static review of the exact prompt package and shot plan
    - explicit confirmation of the selected provider or model before execution
    - clean worktree at execution time
    - exact output directory verification
  acceptance_criteria:
    - product remains premium portable LED camping lantern
    - hero shot remains readable and campaign-usable
    - no visible AI artifact, text, logo, or subject drift
    - only the explicitly authorized output is produced
  rejection_criteria:
    - subject drift
    - material_fake_or_plastic
    - lighting_inconsistent
    - composition_unusable
    - commercial_unfit
    - ai_artifact_visible
    - provenance_or_trace_missing
    - memory_unsuitable
  fail_closed_conditions:
    - provider or model is not explicitly selected
    - output directory is not new or clean
    - filename policy would overwrite existing files
    - more images would be created than authorized
    - any memory write is requested
    - any production candidate is requested
```

## Authorization Boundary

This gate authorizes only a future, separately reviewed execution step.

It does not authorize:

- image generation
- provider call
- plugin call
- API call
- runtime execution
- Review Console runtime launch
- actual memory write
- DailyNote write
- VCP memory write
- codex-memory mutation
- production_candidate_002
- Batch 005
- dependency change
- `package.json` modification
- `git add .`

## Memory And Production Boundaries

Memory remains blocked unless a separate gate explicitly opens the write path.

- `actual_memory_write_performed: false`
- `daily_note_written: false`
- `vcp_memory_written: false`
- `codex_memory_mutated: false`
- `production_candidate_002_started: false`
- `batch_005_started: false`

This gate only records that the visual route has reached a safe
pre-execution boundary. It does not start generation.

## Why This Gate Exists Now

The prompt package and shot plan are ready enough to define the next execution
boundary, but they should not be used as an implicit license to generate.

This gate makes the future boundary explicit:

- the target is known
- the hero shot is the only shot authorized for the next execution gate
- the output directory policy is new-directory-only
- overwrite is forbidden
- memory remains blocked
- future execution requires separate explicit authorization

## Selected Next Phase

The next phase should be a separate execution gate and must not start until it
is explicitly authorized.

Suggested next phase:

- `AIL-VIS-05_visual_generation_execution_gate`

## Forbidden Actions

This gate forbids:

- image generation
- provider call
- plugin call
- API call
- runtime execution
- Review Console runtime launch
- actual memory write
- DailyNote write
- VCP memory write
- codex-memory mutation
- production_candidate_002
- Batch 005
- dependency change
- `package.json` modification
- `git add .`

## Closeout YAML Template

```yaml
AIL_VIS_04_closeout:
  phase: AIL-VIS-04_visual_generation_authorization_gate
  mode: docs_only_generation_authorization_gate
  status: completed_validated_docs_only
  selected_product: premium_portable_led_camping_lantern
  selected_shot_id: visual_production_next_shot_hero_01
  source_phase: AIL-VIS-03_visual_prompt_package_and_shot_plan_refresh
  provider_or_model: TBD
  provider_calls_max: 1
  plugin_calls_max: 1
  api_calls_max: 0
  max_images: 1
  actual_generation_allowed_now: false
  provider_call_allowed_now: false
  image_generation_allowed_now: false
  memory_write_allowed_now: false
  selected_next_phase: AIL-VIS-05_visual_generation_execution_gate
```
