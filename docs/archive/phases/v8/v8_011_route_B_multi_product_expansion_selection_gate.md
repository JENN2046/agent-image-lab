# v8.011 Route B Multi-Product Expansion Selection Gate

```yaml
base_contract: AGENTS.md
phase: v8_011_route_B_multi_product_expansion_selection_gate
mode: A4.8
intent: local_implementation
risk_level: R1
```

## Purpose

Record the human route decision after A4.8 comprehensive validation.

```yaml
selected_route: multi_product_prompt_package_expansion
selected_route_zh: 多商品 prompt package 扩展
source_baseline: v7_matte_ceramic_mug_real_generation_loop
source_route_closeout: v8_004_final_retouch_route_closeout
A4_8_validation_source: v8_010_A4_8_comprehensive_validation_closeout
```

## Route Meaning

Route B expands Agent Image Lab from one completed matte ceramic mug loop into a reusable multi-product prompt package workflow.

The route tests whether the product workflow can generalize across product categories before spending more provider calls. It should create product briefs, prompt package drafts, static review criteria, and future authorization handoff material.

## Preserved Baseline

```yaml
current_best_candidate_remains: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
current_best_candidate_status: accepted_candidate_with_minor_retouch
commercial_delivery_ready: false
memory_suitability: deferred
Route_B_changes_v7_accepted_candidate_status: false
```

Route B does not replace, demote, promote, retouch, copy, move, stage, or commit the existing v7/v8 mug candidate.

## Route Boundary

```yaml
Route_B_allows_now:
  docs_only_product_planning: true
  product_brief_creation: true
  prompt_package_draft_creation: true
  prompt_static_review: true
  future_A5_authorization_draft_planning: true

Route_B_forbidden_now:
  A5_execution: true
  provider_contact: true
  plugin_call: true
  image_generation: true
  env_local_secret_value_read: true
  DailyNote_write: true
  VCP_memory_write: true
  memory_write_path: true
  production_candidate_002: true
  Batch_005: true
  runtime_execution: true
  accepted_samples_write: true
  runs_output_commit: true
  package_json_or_dependency_change: true
```

## Recommended Route B Sequence

```yaml
Route_B_sequence:
  - v8_012_second_product_candidate_and_brief_gate
  - v8_013_second_product_prompt_package_draft_gate
  - v8_014_second_product_prompt_static_review_gate
stop_after: v8_014_second_product_prompt_static_review_gate
must_not_auto_enter: v8_015_second_product_A5_authorization_decision_gate
```

## Second Product Candidate

```yaml
recommended_second_product: multi_color_mesh_sports_visor
display_name: multi-color breathable mesh sports visor / open-top sun visor
selection_status: recommended_for_next_gate
reason:
  - related to recent real product visual needs
  - has multi-color series requirements
  - tests fabric, mesh, curved brim, and soft product structure
  - differs from matte ceramic mug enough to test workflow transfer
```

## Closeout Template

```yaml
closeout:
  phase: v8_011_route_B_multi_product_expansion_selection_gate
  selected_route: multi_product_prompt_package_expansion
  selected_route_zh: 多商品 prompt package 扩展
  Route_B_changes_v7_accepted_candidate_status: false
  provider_contact: false
  image_generation: false
  memory_write: false
  production_candidate_002: false
  recommended_next: v8_012_second_product_candidate_and_brief_gate
```
