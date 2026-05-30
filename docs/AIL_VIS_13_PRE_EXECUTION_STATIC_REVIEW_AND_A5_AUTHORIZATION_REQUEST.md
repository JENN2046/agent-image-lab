# AIL-VIS-13 Pre-Execution Static Review And A5 Authorization Request

Base contract: `AGENTS.md`

Phase: `AIL-VIS-13_pre_execution_static_review_and_A5_authorization_request`
Mode: `docs_only_A5_request_gate`
Risk: `medium_high`

## Purpose

This phase prepares the pre-execution static review and exact A5 authorization
request for the premium dark tech product still-life hero shot.

It does not generate images, does not call providers, does not create output
directories, does not request runtime, and does not write memory.

## Source Context

This request gate follows the remote-verified closeout of:

- `AIL-VIS-12_visual_generation_authorization_gate`
  - commit: `74cd00063482025c837c304ae9a398853fe19cb5`
  - branch: `ail-vis-12-generation-authorization-gate`
  - status: `remote_verified_closed`
  - selected target: `premium_dark_tech_product_still_life`
  - selected shot id: `visual_production_next_shot_dark_tech_hero_01`

The planning gate that fed this request remains:

- `AIL-VIS-11_shot_plan_and_prompt_package_planning`
  - commit: `501d16abd4c4448690f2518322ac1b5224b7d0bf`
  - branch: `ail-vis-11-shot-plan-prompt-planning`
  - status: `final_closed`

The LED lantern cycle remains held as review evidence only.

## Current Route State

- `AIL-VIS-09_visual_eval_failure_taxonomy_hardening`
  - hardened review language
  - `pass_with_warnings` does not imply promotion

- `AIL-VIS-10_next_visual_target_selection_gate`
  - selected target: `premium_dark_tech_product_still_life`

- `AIL-VIS-11_shot_plan_and_prompt_package_planning`
  - shot plan created
  - prompt package created

- `AIL-VIS-12_visual_generation_authorization_gate`
  - future execution boundary locked

This phase converts those planning artifacts into the exact A5 request package
needed before a future execution gate can open.

## Why The LED Lantern Cycle Is Held

The previous LED lantern route is still held as review evidence and is not the
next execution target.

The review evidence already captured:

- studio packshot tendency instead of the intended route scene
- diffuser material mismatch risk
- control layout mismatch risk
- shot role underrepresentation
- modern LED identity ambiguity

Because those issues are now documented and hardened into the rubric, this
request gate advances the dark tech still-life route instead of reopening the
lantern route.

## Required Execution Request Packet

```yaml
AIL_VIS_13_execution_request_packet:
  selected_target: premium_dark_tech_product_still_life
  selected_shot_id: visual_production_next_shot_dark_tech_hero_01
  material_detail_shot_authorized: false
  provider_or_model_status: TBD
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
  actual_generation_allowed_now: false
```

## Required A5 Authorization Phrase

This phase must record the exact A5 authorization wording needed from the user.

```yaml
A5_authorization_required_from_user:
  required_phrase_shape: >
    我明确授权 AIL-VIS-13 执行一次 one-shot visual generation，
    目标为 premium dark tech product still life hero shot，
    provider/tool 为 <明确名称>，
    model 为 <明确模型或默认路由说明>，
    max provider/plugin calls 为 1，
    max images 为 1，
    输出目录为 <明确新目录>，
    不允许 memory write，
    不允许 accepted sample promotion，
    不允许 production_candidate_002，
    不允许 Batch 005。
  status: not_granted
```

Only this level of explicit authorization can open a later execution gate.
Without it, this phase remains a request-only boundary.

## Authorization Boundary

This phase does not authorize:

- image generation
- provider call
- plugin call
- API call
- runtime execution
- Review Console runtime launch
- output directory creation
- actual memory write
- DailyNote write
- VCP memory write
- codex-memory mutation
- accepted sample promotion
- memory candidate creation
- production_candidate_002
- Batch 005
- dependency change
- `package.json` modification
- `git add .`

## Why This Phase Exists

The project needs a final request gate before any real one-shot execution for
the dark tech still-life route.

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

- `AIL-VIS-14_visual_generation_execution_gate`

## Forbidden Actions

This phase forbids:

- image generation
- provider call
- plugin call
- API call
- runtime execution
- Review Console runtime launch
- output directory creation
- actual memory write
- DailyNote write
- VCP memory write
- codex-memory mutation
- production_candidate_002
- Batch 005
- dependency change
- `package.json` modification
- `git add .`

## Closeout Template

```yaml
AIL_VIS_13_closeout:
  phase: AIL-VIS-13_pre_execution_static_review_and_A5_authorization_request
  mode: docs_only_A5_request_gate
  status: completed_validated_pushed
  source_phase: AIL-VIS-12_visual_generation_authorization_gate
  commit_hash: 74cd00063482025c837c304ae9a398853fe19cb5
  branch: ail-vis-13-pre-execution-a5-request
  selected_target: premium_dark_tech_product_still_life
  selected_shot_id: visual_production_next_shot_dark_tech_hero_01
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
