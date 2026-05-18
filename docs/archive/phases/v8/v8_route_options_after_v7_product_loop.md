# V8 Route Options After V7 Product Loop

```yaml
route_options_id: v8_route_options_after_v7_product_loop
source_phase: v7.285_v7_product_loop_closeout_and_v8_route_planning_gate
human_selection_required: true
auto_execution_allowed: false
```

## Starting Point

V7 closes with v4 as the current accepted candidate:

```text
runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
```

The asset is `accepted_candidate_with_minor_retouch`, not `commercial_delivery_ready`. Generation is stopped. Memory write, DailyNote write, VCP memory write, `production_candidate_002`, Batch 005, and fifth generation are not authorized.

## Route A - Final Retouch Planning

Meaning: do not generate a new image. Create a retouch instruction package for the v4 output, focused on handle attachment cleanup, background transparency, ceramic surface refinement, and bottom shadow polish.

Risk: low.

Value: moves the accepted candidate closer to commercial delivery while avoiding provider/regression risk.

Recommendation: high.

Next phase if selected:

```text
v8_final_retouch_planning_gate
```

## Route B - Multi-product Prompt Package Expansion

Meaning: reuse the V7 prompt/review workflow on a second product, such as a diffuser, cup-and-saucer, skincare bottle, or hat.

Risk: medium.

Value: tests whether Agent Image Lab can generalize from one product loop into a reusable production workflow.

Recommendation: high.

Next phase if selected:

```text
v8_multi_product_prompt_package_selection_gate
```

## Route C - Review Console Productization

Meaning: convert review decisions, asset status, memory suitability, and evidence package fields into Review Console product requirements.

Risk: medium to high.

Need: runtime planning and strict no-write / no-provider boundaries before implementation.

Recommendation: medium.

Next phase if selected:

```text
v8_review_console_productization_planning_gate
```

## Route D - Memory Write Planning

Meaning: create a memory write planning package from the V7 loop without writing memory.

Risk: medium to high.

Need: independent authorization before any DailyNote or VCP memory write.

Recommendation: medium-low.

Next phase if selected:

```text
v8_memory_write_planning_gate
```

## Route E - Production Candidate 002 Readiness

Meaning: prepare a readiness review for promoting v4 or a future output toward `production_candidate_002`.

Risk: high.

Need: independent production-candidate authorization, commercial delivery readiness criteria, asset handling boundary, and human approval.

Recommendation: not recommended now.

Next phase if selected:

```text
v8_production_candidate_002_readiness_gate
```

## Recommended Default

```yaml
recommended_default_route: final_retouch_planning
secondary_recommended_route: multi_product_prompt_package_expansion
do_not_default_to_generation: true
do_not_default_to_memory_write: true
do_not_default_to_production_candidate_002: true
human_selection_required: true
```

Route A is the safest next step because v4 is already accepted but not final commercial ready. Route B is the strongest expansion path if the owner wants to test cross-product reuse before commercial finishing.
