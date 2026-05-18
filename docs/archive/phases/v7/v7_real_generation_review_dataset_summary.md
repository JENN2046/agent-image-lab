# V7 Real Generation Review Dataset Summary

```yaml
dataset_id: v7_real_generation_review_dataset_summary
source_phase: v7.285_v7_product_loop_closeout_and_v8_route_planning_gate
product: matte_ceramic_mug
total_real_generation_trials: 4
```

## Dataset Overview

V7 produced four real matte ceramic mug outputs and four human review records. This is enough to support a product-loop closeout because the set includes failed/revision samples, accepted-candidate samples, and one prompt-regression sample.

## Review Records

| Trial | Output | asset_status | accepted_candidate | commercial_delivery_ready | memory_suitability |
|---|---|---|---:|---:|---|
| v1 | `runs/real_generation/v7_269_matte_ceramic_mug_trial/native_doubao_1778681238211_0.jpg` | `needs_revision` | false | false | deferred |
| v2 | `runs/real_generation/v7_274_matte_ceramic_mug_v2_trial/native_doubao_1778685572407_0.jpg` | `accepted_candidate_with_minor_retouch` | true | false | deferred |
| v3 | `runs/real_generation/v7_277_matte_ceramic_mug_v3_trial/native_doubao_1778688750417_0.jpg` | `needs_revision` | false | false | deferred |
| v4 | `runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg` | `accepted_candidate_with_minor_retouch` | true | false | deferred |

## Main Defects By Output

v1 defects:

- Product scale too small.
- Excessive top whitespace.
- Flat lighting.
- Weak background depth.
- Rim and handle detail insufficient.
- Tiny colored speck.

v2 defects:

- Tiny top-left colored speck.
- Cup rim slightly rough.
- Handle attachment slightly soft.
- Background line still visible.
- Rim light and shadow could be more premium.

v3 defects:

- Upper handle attachment had a blocky or missing-joint feel.
- Lower handle attachment was soft.
- Handle/body connection was not credible ceramic structure.
- Background became dark and dull.

v4 defects:

- Upper handle attachment still has slight dark/soft area.
- Handle/body join is not final retouch-grade realistic.
- Background could be more transparent.
- Mug surface microtexture is conservative.
- Bottom shadow could be more refined.

## Product Value

v1 gave the baseline failure map. v2 showed the first accepted candidate. v3 showed an important prompt regression pattern: local polishing can harm product geometry. v4 became the current best candidate and demonstrates that conservative geometry repair can recover product credibility.

## Dataset Closeout

```yaml
needs_revision_samples_present: true
accepted_candidate_samples_present: true
prompt_regression_sample_present: true
commercial_delivery_ready_samples_present: false
memory_suitability_all_deferred: true
dataset_sufficient_for_v7_closeout: true
```

This dataset should not be treated as memory-ready by default. Any future memory write needs independent planning and authorization.
