# v8.035 Route B Second Product Accepted Candidate Evidence Package

```yaml
phase: v8_035_route_B_second_product_accepted_candidate_evidence_package
base_contract: AGENTS.md
mode: A4.8
intent: accepted_candidate_evidence_package
risk_level: R1
source_phase: v8_034_human_review_of_second_product_post_persistence_fix_output
source_commit: 5295f77d95c5f6a9ce8b6b3f8e6637661bc8ea67
```

## 中文说明

本阶段的中文意思是：只把 Route B 第二商品从商品选择、prompt、失败、修复、再次生成、落盘验证到 accepted candidate 的证据链封存成文档包。

本阶段不生成图片，不调用 provider，不 retry，不读取 `.env.local`，不写 memory，不写 `accepted_samples/`，不进入 `production_candidate_002`。

## Accepted Candidate Snapshot

```yaml
product: multi_color_mesh_sports_visor
accepted_candidate_path: runs/real_generation/v8_033_multi_color_mesh_sports_visor_v2_after_persistence_fix_trial/native_doubao_1778748094308_0.jpg
asset_status: accepted_candidate_with_minor_watch_items
accepted_candidate: true
commercial_delivery_ready: false
memory_suitability: deferred
local_files_verified_count: 1
local_persistence_success: true
route_B_cross_product_reuse_validated: true
output_image_added_to_git: false
accepted_samples_written: false
memory_write_performed: false
production_candidate_002_started: false
```

## Evidence Chain Summary

1. Second product selection: v8.012 selected `multi_color_mesh_sports_visor` because it tests soft goods, fabric texture, open-top visor structure, mesh visibility, curved brim geometry, and multi-color collection control beyond the earlier ceramic mug loop.
2. Prompt v1 creation: v8.013 created `prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v1.yaml` as a draft prompt package, with product identity, structure, material, color collection, composition, environment, positive prompt, constraints, and review checklist.
3. Prompt v1 static review: v8.014 reviewed v1 as `pass_with_minor_watch_items` and confirmed it was only a prompt package draft, not an execution request.
4. First real trial failure: v8.016 consumed one authorized provider call and failed with `failed_http_400`; no image was created.
5. Failure review: v8.017 recorded the failure as sanitized categories only, without inventing provider raw error details.
6. Canonical prompt mapping fix: v8.018 added or confirmed runner-facing `prompt: |`, retained `positive_prompt: |`, and documented `prompt` as the Native Doubao canonical field.
7. First reviewable output: v8.021 succeeded after the mapping fix and produced `runs/real_generation/v8_021_multi_color_mesh_sports_visor_second_trial/native_doubao_1778733554203_0.jpg`.
8. First output review: v8.022 marked that output `needs_revision`, because color coverage, lifestyle context, mesh detail, and product hierarchy were not yet strong enough.
9. Prompt v2 revision: v8.023 created `prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml` to require six visible colors, brighter turquoise or pink highlights, urban sports lifestyle context, and stronger mesh / stitching / brim detail.
10. Prompt v2 static review: v8.024 reviewed v2 as `pass_ready_for_authorization_decision`.
11. Output persistence anomaly: v8.027 consumed one authorized provider call and reported HTTP 200 / generated, but local verification found zero output files.
12. Anomaly review: v8.028 separated provider success evidence from local artifact persistence evidence and marked the result `failed_no_local_output_file`.
13. Timestamp evidence policy: v8.029 recorded provider API platform time and local artifact time as separate evidence surfaces; cross-source time deltas are not strict causal proof.
14. Output persistence guard fix: v8.030 tightened Native Doubao result normalization so local success requires `local_files_verified_count > 0`.
15. Post-fix generation: v8.033 generated one image and verified one local file with `local_files_verified_count: 1`.
16. Accepted candidate review: v8.034 reviewed the v8.033 output as `accepted_candidate_with_minor_watch_items`.

## Why This Is Accepted Candidate Evidence

The accepted candidate is strong enough to prove Route B cross-product reuse:

- The product reads as an open-top sports visor / sun visor, not a baseball cap, cycling cap, or full-crown hat.
- The target color collection appears: turquoise blue, soft pink, warm white, deep navy, black, and muted olive green.
- Turquoise and pink act as visual highlights while dark colors support the composition.
- The scene now has an urban lifestyle surface with wood table, glass building, greenery, and pale concrete.
- Product scale remains dominant in the frame.
- Mesh panels, stitching, curved brim, and rear adjustment structure are visible.
- The local artifact chain is verified after the v8.030 persistence guard fix.

## Why It Is Not Commercial Delivery Ready

```yaml
commercial_delivery_ready: false
reasons:
  - sports_context_could_be_stronger
  - campaign_hero_feel_could_be_stronger
  - turquoise_should_be_clearer_hero_color
  - mesh_and_honeycomb_detail_not_premium_closeup_quality
  - black_and_navy_detail_readability_is_lower
  - light_retouch_or_delivery_polish_still_needed
```

The candidate validates the workflow and can anchor future review or polish, but it should not be treated as final commercial delivery without a separate delivery review or retouch route.

## Why Memory Is Deferred

```yaml
memory_suitability: deferred
memory_write_performed: false
future_memory_write_requires_independent_authorization: true
```

The image is an accepted candidate, but memory write is a separate production memory action. This phase only packages evidence. It does not write DailyNote, VCP memory, `memory_write_path`, or any memory surface.

## Why Production Candidate 002 Is Not Started

```yaml
production_candidate_002_started: false
future_production_candidate_002_requires_independent_authorization: true
```

The evidence package proves the second-product workflow can reach an accepted candidate. It does not promote the image into production candidate handling, accepted sample storage, or delivery execution.

## Route B Proof Value

```yaml
route_B_cross_product_reuse_validated: true
proof_value:
  - workflow_transferred_from_ceramic_mug_to_soft_goods
  - prompt_package_iteration_supported_new_product_geometry
  - failure_review_and_static_fix_loop_improved_execution
  - output_persistence_guard_prevented_false_success_accounting
  - final_output_reached_accepted_candidate_status
```

Route B now has concrete evidence that Agent Image Lab can generalize beyond the matte ceramic mug loop into a fabric / mesh / multi-color product family while preserving review, safety, and artifact accounting.

## Boundary Confirmation

```yaml
safety:
  provider_contact: false
  image_generation: false
  retry: false
  env_local_secret_value_read: false
  secret_value_printed: false
  DailyNote_write: false
  VCP_memory_write: false
  memory_write_path: false
  production_candidate_002: false
  Batch_005: false
  dependency_change: false
  package_json_modified: false
  runs_output_committed: false
  accepted_samples_written: false
```

## Recommended Next

```yaml
phase: v8_036_route_B_multi_product_expansion_closeout
auto_execution_allowed: false
purpose: 封存 Route B 多商品 prompt package 扩展结果，决定 V8 是否关闭或进入下一路线。
```
