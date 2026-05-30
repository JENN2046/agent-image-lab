# AIL-VIS-16 Pre-Execution Static Review And A5 Authorization Request

Base contract: `AGENTS.md`

Phase: `AIL-VIS-16_pre_execution_static_review_and_A5_authorization_request`
Mode: `docs_only_A5_request_gate`
Risk: `medium_high`

## Purpose

This phase prepares the pre-execution static review and exact A5 authorization
request for the repaired headphones hero shot.

It only writes the request gate. It does not generate images, does not call
providers, does not create output directories, does not promote samples, does
not write memory, and does not start an execution gate.

## Source Context

This request gate follows:

- `AIL-VIS-15_generation_authorization_gate_for_repaired_target`
  - commit: `485284917b6f6e925c7ce5d104e06f0211acd576`
  - branch: `ail-vis-15-generation-authorization-repaired-target`
  - status: `final_closed`
  - selected target: `premium_black_wireless_headphones_product_hero`
  - selected shot id: `visual_production_next_shot_black_headphones_hero_01`

The repaired planning artifacts remain:

- `prompts/image_generation/visual_production_next_shot_plan.yaml`
- `prompts/image_generation/visual_production_next_prompt_package.yaml`

## Static Review

The repaired route is specific enough to request future A5 authorization:

- target identity is locked to black wireless headphones
- hero shot id is locked to `visual_production_next_shot_black_headphones_hero_01`
- material detail shot remains unauthorized
- max images remains `1`
- provider/model remains to be named by explicit authorization
- output directory must be a new explicit directory
- sample promotion and memory remain blocked

This static review does not authorize execution.

## Required A5 Authorization Phrase

The user must provide an explicit authorization phrase in this shape before any
future execution gate can open:

```text
我明确授权 AIL-VIS-16 执行一次 one-shot visual generation，
目标为 premium black wireless headphones product hero shot，
provider/tool 为 <明确名称>，
model 为 <明确模型或默认路由说明>，
max provider/plugin calls 为 1，
max images 为 1，
输出目录为 <明确新目录>，
不允许 memory write，
不允许 accepted sample promotion，
不允许 production_candidate_002，
不允许 Batch 005。
```

## Request Packet

```yaml
AIL_VIS_16_A5_request_packet:
  selected_target: premium_black_wireless_headphones_product_hero
  selected_shot_id: visual_production_next_shot_black_headphones_hero_01
  material_detail_shot_authorized: false
  provider_or_model_status: requires_explicit_user_phrase
  provider_calls_max: 1
  plugin_calls_max: 1
  api_calls_max: 0
  max_images: 1
  output_directory_status: requires_explicit_new_directory
  accepted_sample_promotion_allowed: false
  memory_write_allowed: false
  production_candidate_002_allowed: false
  batch_005_allowed: false
```

## Required False Fields

```yaml
required_false_fields:
  A5_authorization_granted: false
  actual_generation_allowed_now: false
  output_directory_created: false
  provider_called: false
  plugin_called: false
  api_called: false
  runtime_execution_performed: false
  accepted_sample_created: false
  memory_candidate_created: false
  actual_memory_write_performed: false
  production_candidate_002_started: false
  batch_005_started: false
```

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
- actual A5 grant
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

## Why This Phase Exists

The target was repaired and a future authorization boundary was drafted, but
execution still requires an explicit A5 phrase from the owner.

This request gate keeps that phrase visible and separates:

- planning
- authorization boundary
- explicit user grant
- future execution
- review and promotion decisions

## Final State

```yaml
AIL_VIS_16_final_state:
  A5_request_packet_prepared: true
  A5_authorization_granted: false
  generation_allowed_now: false
  memory_write_allowed_now: false
  accepted_sample_allowed_now: false
  next_phase_started: false
```

## Selected Next Phase

The next phase should only start after a complete explicit A5 authorization
phrase is granted and a separate execution gate is opened.

This phase does not start that next phase.

## Closeout Template

```yaml
AIL_VIS_16_closeout:
  phase_name: AIL-VIS-16_pre_execution_static_review_and_A5_authorization_request
  mode: docs_only_A5_request_gate
  status: completed_validated_pushed
  selected_target: premium_black_wireless_headphones_product_hero
  selected_shot_id: visual_production_next_shot_black_headphones_hero_01
  A5_request_packet_prepared: true
  A5_authorization_granted: false
  generation_allowed_now: false
  memory_write_allowed_now: false
  accepted_sample_allowed_now: false
  next_phase_started: false
```
