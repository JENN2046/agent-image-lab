# AIL-VIS-05 Pre-Execution Static Review And A5 Authorization Request

Base contract: `AGENTS.md`

Phase: `AIL-VIS-05_pre_execution_static_review_and_A5_authorization_request`
Mode: `A5_authorization_request_gate`
Risk: `medium_high`

## Purpose

This phase prepares the final one-shot visual generation execution request for
the premium portable LED camping lantern hero shot.

It is a static review and authorization request only. It does not generate
images, call a provider, call a plugin, call an API, open runtime, or open any
memory write path.

## Source Context

This phase follows the remote-verified closeout of:

- `AIL-VIS-04_visual_generation_authorization_gate`

That prior gate is now closed and remote-verified on:

- commit: `cfbde3132bb878eefd0d88b0ad012fe7c59ccc75`
- branch: `ail-vis-04-generation-authorization-gate`

The planning assets used by this request remain:

- `docs/AIL_VIS_03_VISUAL_PROMPT_PACKAGE_AND_SHOT_PLAN_REFRESH.md`
- `prompts/image_generation/visual_production_next_shot_plan.yaml`
- `prompts/image_generation/visual_production_next_prompt_package.yaml`
- `docs/AIL_VIS_04_VISUAL_GENERATION_AUTHORIZATION_GATE.md`

## Selected Visual Target

The selected visual target remains:

- `premium_portable_led_camping_lantern`

The only shot being requested for future execution is:

- `visual_production_next_shot_hero_01`

The material detail shot remains unapproved for execution by this request.

## Pre-Execution Packet

```yaml
AIL_VIS_05_pre_execution_packet:
  source_commit_and_branch:
    phase: AIL-VIS-04_visual_generation_authorization_gate
    commit: cfbde3132bb878eefd0d88b0ad012fe7c59ccc75
    branch: ail-vis-04-generation-authorization-gate
    remote_status: verified_closed
  selected_visual_target: premium_portable_led_camping_lantern
  selected_shot_id: visual_production_next_shot_hero_01
  prompt_package_ref: prompts/image_generation/visual_production_next_prompt_package.yaml
  shot_plan_ref: prompts/image_generation/visual_production_next_shot_plan.yaml
  exact_future_output_directory_policy:
    root: runs/real_generation/
    future_run_directory: runs/real_generation/<future-run-id>/
    must_be_new_directory: true
    overwrite_existing_files_allowed: false
    reuse_previous_run_directory_allowed: false
  exact_future_filename_policy:
    primary_image: codex_session_premium_portable_led_camping_lantern_hero_01.png
    metadata_files: only if explicitly named in the execution gate
  max_provider_calls: 1
  max_plugin_calls: 1
  max_api_calls: 0
  max_images: 1
  provider_or_model_status: TBD
  fail_closed_conditions:
    - provider or model is not explicitly selected
    - output directory is not new or clean
    - filename policy would overwrite existing files
    - more images would be created than authorized
    - any memory write is requested
    - any production candidate is requested
    - any runtime / provider / plugin / API call is attempted in this phase
  human_review_requirement_after_generation: true
  memory_write_blocked: true
  production_candidate_002_blocked: true
  actual_generation_allowed_now: false
```

## Required A5 Authorization Phrase

This phase must record the exact A5 authorization wording needed from the user.

```yaml
A5_authorization_required_from_user:
  required_phrase_shape: >
    我明确授权 AIL-VIS-05 执行一次 one-shot visual generation，
    目标为 premium portable LED camping lantern hero shot，
    provider/model 为 <明确名称>，
    max provider/plugin calls 为 1，
    max images 为 1，
    输出目录为 <明确新目录>，
    不允许 memory write，
    不允许 production_candidate_002，
    不允许 Batch 005。
  status: not_granted
```

Only this level of explicit authorization can open a later execution gate.
Without it, this phase remains a request-only boundary.

## Static Review Summary

This phase confirms the future execution packet is constrained as follows:

- one shot only
- hero shot only
- new output directory only
- overwrite forbidden
- provider/model still TBD unless the user explicitly names one
- memory write blocked
- production candidate blocked
- no runtime or provider work in this phase

## Authorization Boundary

This phase does not authorize:

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

## Why This Phase Exists

The project needs a final request gate before any real one-shot execution.

This request gate separates:

- planning artifacts
- remote-verified authorization boundaries
- explicit user authorization
- future execution

That separation keeps the generation path closed until the required A5
authorization phrase is granted.

## Selected Next Phase

The next phase after this request gate should only start if the user grants the
explicit A5 authorization phrase and a separate execution gate is opened.

Suggested next phase:

- `AIL-VIS-06_visual_generation_execution_gate`

## Forbidden Actions

This phase forbids:

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
AIL_VIS_05_closeout:
  phase: AIL-VIS-05_pre_execution_static_review_and_A5_authorization_request
  mode: A5_authorization_request_gate
  status: completed_validated_pushed
  source_phase: AIL-VIS-04_visual_generation_authorization_gate
  commit_hash: <full_sha>
  branch: ail-vis-05-pre-execution-a5-request
  selected_visual_target: premium_portable_led_camping_lantern
  selected_shot_id: visual_production_next_shot_hero_01
  prompt_package_ref: prompts/image_generation/visual_production_next_prompt_package.yaml
  shot_plan_ref: prompts/image_generation/visual_production_next_shot_plan.yaml
  provider_or_model_status: TBD
  max_provider_calls: 1
  max_plugin_calls: 1
  max_api_calls: 0
  max_images: 1
  A5_authorization_requested: true
  A5_authorization_granted: false
  actual_generation_allowed_now: false
  memory_write_allowed_now: false
  production_candidate_002_allowed_now: false
```
