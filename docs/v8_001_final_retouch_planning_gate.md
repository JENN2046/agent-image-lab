# v8.001 Final Retouch Planning Gate

```yaml
phase: v8_001_final_retouch_planning_gate
base_contract: AGENTS.md
mode: A4
intent: local_draft
risk_level: R1
source_phase: v8_route_selection_human_decision_gate
source_commit: 92d2eabcd76b8ed931621ea76616dec8b39caba3
selected_route: final_retouch_planning
selected_route_zh: 最终修图规划
```

## Purpose

This phase creates a non-executing final retouch plan for the v4 matte ceramic
mug accepted candidate. It moves the asset closer to commercial delivery planning
without generating a new image, contacting a provider, calling a plugin, writing
memory, moving the output image, or entering `production_candidate_002`.

## Current Best Candidate

```yaml
current_best_candidate: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
asset_status: accepted_candidate_with_minor_retouch
accepted_candidate: true
commercial_delivery_ready: false
memory_suitability: deferred
generation_stopped: true
```

## Image Quality Summary

v4 is the best current output because it keeps the successful product scale and
composition, restores handle credibility after v3, keeps the warm-gray premium
background direction, and reads as a cream-white matte ceramic mug. It still
needs minor local retouch for the upper handle attachment, handle/body join,
background lift, ceramic microtexture, and bottom shadow.

## Final Retouch Goal

Create an instruction package that can guide a later human or separately
authorized retouch process. The target is to move v4 closer to
`commercial_delivery_ready` while preserving its accepted-candidate identity.

## Retouch Work Items

- Clean the slight dark and soft area around the upper handle attachment.
- Improve the real ceramic structure of the handle/body connection.
- Lift the slightly dark background while keeping the premium warm-gray tone.
- Add only very subtle premium ceramic microtexture to the mug body.
- Refine the bottom contact shadow so it is cleaner and more grounded.
- Preserve current product scale, centered composition, and cream-white matte
  ceramic character.

## Forbidden Changes

- Do not change the product.
- Do not change the mug's basic shape.
- Do not change the main composition.
- Do not add logo, text, props, people, or lifestyle context.
- Do not turn the image into a lifestyle scene.
- Do not over-sharpen the product.
- Do not make the ceramic read as plastic or metal.
- Do not change the current accepted-candidate identity.

## Retouch Acceptance Criteria

```yaml
retouch_acceptance:
  handle_attachment_cleaned: required
  handle_body_connection_more_realistic: required
  background_lifted_without_flattening: required
  subtle_ceramic_microtexture_added: required
  bottom_shadow_refined: required
  product_identity_preserved: required
  composition_preserved: required
  accepted_candidate_identity_preserved: required
```

## Pre-Delivery Checklist

```yaml
pre_delivery_checklist:
  current_candidate_path_recorded: true
  retouch_plan_created: true
  forbidden_changes_recorded: true
  no_fifth_generation: true
  no_provider_contact: true
  no_plugin_call: true
  no_image_generation: true
  no_memory_write: true
  no_accepted_samples_write: true
  no_runs_output_commit: true
  production_candidate_002_not_started: true
```

## Why Fifth Generation Is Not Needed

The V7 loop has already produced a credible accepted candidate. The remaining
issues are local polish details rather than prompt exploration gaps. Another
generation would require a new explicit A5 authorization and could regress the
composition, handle geometry, material, or background. Final retouch planning is
the lower-risk path.

## Why Memory Is Not Written

`memory_suitability` remains `deferred`. This phase is not a memory authorization
gate and does not write DailyNote, VCP memory, or memory delta. Any future memory
summary must be planned and authorized separately.

## Explicit Non-Authorization

```yaml
provider_contact: false
plugin_call: false
image_generation: false
retry: false
DailyNote_write: false
VCP_memory_write: false
memory_write_path: false
accepted_samples_write: false
runs_output_git_add: false
production_candidate_002: false
Batch_005: false
dependency_change: false
package_json_modified: false
tag_release_deploy: false
runtime_execution: false
```

## Recommended Next

```yaml
phase: v8_002_retouch_acceptance_criteria_or_delivery_package_gate
auto_execution_allowed: false
purpose: "定义修图验收标准或交付包，不生成新图。"
```
