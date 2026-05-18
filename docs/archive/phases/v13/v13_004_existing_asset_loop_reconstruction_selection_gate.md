# v13.004 Existing Asset Loop Reconstruction Selection Gate

```yaml
phase: v13_004_existing_asset_loop_reconstruction_selection_gate
base_contract: AGENTS.md
mode: A4.8
intent: planning
risk_level: R1
source_phase: v13_003_visual_production_loop_canonical_model_static_review_gate
source_commit: f33eff521056884931a04b22594ba2738bb30535
commit_message: "docs: select existing asset for loop reconstruction"
```

## Purpose

This gate selects one existing accepted candidate for a docs-only Visual
Production Loop reconstruction. It does not read, copy, move, stage, or commit
image binaries.

## Candidates

| Candidate | Product | Source output | Current workspace availability | Selection result |
|---|---|---|---:|---|
| `ceramic_mug_v4` | matte ceramic mug | `runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg` | false | not selected |
| `sports_visor_v8_033` | multi-color mesh sports visor | `runs/real_generation/v8_033_multi_color_mesh_sports_visor_v2_after_persistence_fix_trial/native_doubao_1778748094308_0.jpg` | true | not selected |
| `premium_serum_bottle_v10_011` | cosmetic skincare bottle / premium serum bottle | `runs/real_generation/v10_010_premium_serum_bottle_first_trial/native_doubao_1778809662218_0.jpg` | true | selected |

Availability above is path existence only. No image binary was opened or read.

## Selected Asset

```yaml
selected_asset: premium_serum_bottle_v10_011
selected_product: cosmetic_skincare_bottle / premium_serum_bottle
source_output: runs/real_generation/v10_010_premium_serum_bottle_first_trial/native_doubao_1778809662218_0.jpg
source_output_available_in_current_workspace: true
reconstruction_scope: docs_only
image_binary_access: false
source_output_added_to_git: false
```

## Evidence Sources

- `prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml`
- `docs/v10_012_human_review_of_third_product_first_real_output.md`
- `reviews/v10_012_premium_serum_bottle_human_review.md`
- `docs/v10_014_third_product_accepted_candidate_evidence_package_gate.md`
- `docs/accepted_candidate_evidence_package_premium_serum_bottle_v1.md`
- `docs/v10_third_product_route_closeout_premium_serum_bottle.md`

These are cited as existing documentation references. This gate does not migrate
or modify them.

## Why This Asset

`premium_serum_bottle_v10_011` is the recommended reconstruction sample because:

- it is the most recent third-product route.
- it has prompt package, A5 one-shot generation, local persistence verification,
  human review, accepted candidate evidence, and route closeout records.
- its boundaries are clear: accepted candidate true, commercial delivery false,
  memory suitability deferred, accepted_samples not written, and
  production_candidate_002 not started.

## Why Not The Other Two

`ceramic_mug_v4` is not selected because it belongs to an earlier V7 loop and
the source output is not currently present in this workspace by path existence
check.

`sports_visor_v8_033` is not selected because it already served as the Route B
multi-product reuse proof. It remains a strong future reconstruction candidate,
but the serum bottle better represents the latest closed product route.

## Closeout

```yaml
closeout:
  phase: v13_004_existing_asset_loop_reconstruction_selection_gate
  selected_asset: premium_serum_bottle_v10_011
  selected_product: cosmetic_skincare_bottle / premium_serum_bottle
  source_output: runs/real_generation/v10_010_premium_serum_bottle_first_trial/native_doubao_1778809662218_0.jpg
  source_output_available_in_current_workspace: true
  reconstruction_scope: docs_only
  image_binary_access: false
  output_image_added_to_git: false
  recommended_next:
    phase: v13_005_existing_asset_loop_reconstruction_docs_only_gate
    auto_execution_allowed: true
  final_state:
    next_phase_started: false
```
