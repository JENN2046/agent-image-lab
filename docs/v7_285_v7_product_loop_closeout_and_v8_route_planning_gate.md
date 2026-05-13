# v7.285 V7 Product Loop Closeout And V8 Route Planning Gate

```yaml
phase: v7.285_v7_product_loop_closeout_and_v8_route_planning_gate
base_contract: AGENTS.md
mode: A4
intent: local_draft
risk_level: R1
source_phase: v7.284_accepted_candidate_evidence_package
source_commit: d0add63f25a551d20ad17b3d0b17abde26b694b3
route_decision: keep_v4_and_stop_generation
```

## Purpose

This phase closes the first V7 real product-image loop and prepares the V8 route selection gate. It is a documentation and state-surface closeout only. It does not generate images, contact providers, call plugins, retry, write DailyNote, write VCP memory, enter `production_candidate_002`, start Batch 005, or copy/stage/commit any `runs/` output image.

Top-level state:

```yaml
v7_product_loop_closed: true
current_best_candidate_is_v4: true
generation_stopped: true
v8_route_selection_required: true
```

## 1. V7 Product Loop Closeout

V7 proved that Agent Image Lab can move from a pure A4 paper chain into a tightly bounded real generation chain without losing governance. The key turn was the sealed true A5 authorization request: prompt package, output directory, model/call budget, no-retry rule, human review requirement, and memory/write prohibitions were fixed before real provider contact.

The minimal real generation sequence then ran as four separate, explicitly bounded trials. Each trial used one prompt package, one provider call, one generation attempt, no retry, and an immediate stop for human review. The loop produced a usable review dataset instead of an uncontrolled batch.

The current best candidate is the v4 output:

```text
runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
```

v4 is `accepted_candidate_with_minor_retouch`, not `commercial_delivery_ready`. V7 can close because the loop produced real outputs, review decisions, prompt-learning evidence, one accepted candidate, one regression sample, and a clear stop decision. A fifth generation is not justified automatically because the remaining issues are local retouch and product-readiness questions, not broad prompt exploration needs.

## 2. Generation Trial Timeline

| Trial | Prompt package | Output | Review | Value |
|---|---|---|---|---|
| v1 / v7.269 | `product_still_life_matte_ceramic_mug_v1.yaml` | `runs/real_generation/v7_269_matte_ceramic_mug_trial/native_doubao_1778681238211_0.jpg` | `needs_revision` | Ran the first real generation chain and exposed composition, whitespace, lighting, background, rim, handle, and speck issues. |
| v2 / v7.274 | `product_still_life_matte_ceramic_mug_v2.yaml` | `runs/real_generation/v7_274_matte_ceramic_mug_v2_trial/native_doubao_1778685572407_0.jpg` | `accepted_candidate_with_minor_retouch` | Improved product scale, top whitespace, and ecommerce main-image feel; first effective accepted candidate. |
| v3 / v7.277 | `product_still_life_matte_ceramic_mug_v3.yaml` | `runs/real_generation/v7_277_matte_ceramic_mug_v3_trial/native_doubao_1778688750417_0.jpg` | `needs_revision` | Improved background and speck control, but regressed handle structure; valuable negative feedback sample. |
| v4 / v7.281 | `product_still_life_matte_ceramic_mug_v4.yaml` | `runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg` | `accepted_candidate_with_minor_retouch` | Current best candidate; restores handle credibility while preserving stronger background and product scale. |

## 3. Prompt Evolution Analysis

v1 established the product but left the subject too small, with too much top whitespace, flat lighting, weak background depth, and insufficient rim/handle detail. v2 showed that explicit composition and product-scale constraints work: the mug became larger, the top margin tightened, and the image started to feel like an ecommerce main-image candidate.

v3 confirmed that negative artifact constraints help with colored specks and background quality, but it also showed a product-structure risk: over-focusing on local refinement can damage handle geometry and reduce commercial credibility. v4 corrected that by using v2 as the stable base and applying conservative handle-geometry constraints instead of aggressive style exploration.

Prompt learning conclusions:

- `composition` constraints were effective.
- Product scale constraints were effective.
- Negative artifact constraints were effective.
- Handle geometry must be explicit but conservative.
- Over-strengthening local texture/detail can harm product-structure credibility.
- Continued generation now has lower expected value than closeout plus route selection.

## 4. Human Review Dataset Summary

V7 produced four real review records. The set includes `needs_revision` samples, accepted-candidate samples, and one clear prompt-regression sample. That is enough to support V7 closeout and V8 planning.

| Output | asset_status | accepted_candidate | commercial_delivery_ready | memory_suitability | Product value |
|---|---|---:|---:|---|---|
| v1 | `needs_revision` | false | false | deferred | First real sample; exposes baseline weaknesses. |
| v2 | `accepted_candidate_with_minor_retouch` | true | false | deferred | First effective accepted candidate. |
| v3 | `needs_revision` | false | false | deferred | Negative feedback sample for handle regression. |
| v4 | `accepted_candidate_with_minor_retouch` | true | false | deferred | Current best candidate and V7 closeout asset. |

## 5. Safety And Governance Closeout

```yaml
output_images_added_to_git: false
runs_ignored: true
env_local_entered_git: false
secret_values_printed: false
secret_values_recorded: false
secret_values_committed: false
DailyNote_write: false
VCP_memory_write: false
memory_write_path: false
production_candidate_002: false
Batch_005: false
accepted_samples_write: false
fifth_generation_started: false
provider_contact_in_this_phase: false
```

Known validation note:

```yaml
reviews_path_allowlist_gap_seen_previously: true
current_gap_treatment: existing_manual_review_warning_or_recorded_gap
production_blocker: false
A5_authorization_implied_by_validation_pass: false
```

The `reviews/` allowlist gap appeared in earlier review phases and has been treated as a validator-scope/manual-review issue, not a production blocker. Passing validators in this phase does not authorize A5, provider contact, memory write, or production candidate promotion.

## 6. V8 Route Planning

### Route A - Final Retouch Planning

Meaning: stop generation and create a retouch instruction package around the v4 accepted candidate.

Risk: low.

Value: moves the accepted candidate closer to commercial delivery without provider risk.

Recommendation: high.

### Route B - Multi-product Prompt Package Expansion

Meaning: apply the same workflow to a second product, such as a diffuser, cup-and-saucer, skincare bottle, or hat.

Risk: medium.

Value: tests whether Agent Image Lab can reuse the workflow across product categories.

Recommendation: high.

### Route C - Review Console Productization

Meaning: turn review results, asset status, memory suitability, and candidate evidence packages into Review Console product requirements.

Risk: medium to high.

Need: runtime planning before implementation.

Recommendation: medium.

### Route D - Memory Write Planning

Meaning: plan a future memory write package without actually writing memory.

Risk: medium to high.

Need: independent authorization before any memory write.

Recommendation: medium-low.

### Route E - Production Candidate 002 Readiness

Meaning: prepare a route to promote v4 or a future asset toward production candidate status.

Risk: high.

Need: independent production-candidate authorization and readiness gate.

Recommendation: not recommended now.

Recommended default route:

```yaml
recommended_default_route: final_retouch_planning
secondary_route: multi_product_prompt_package_expansion
human_selection_required: true
continue_generation_by_default: false
memory_write_by_default: false
production_candidate_002_by_default: false
```

## Closeout Template

```yaml
closeout:
  phase: v7.285_v7_product_loop_closeout_and_v8_route_planning_gate
  source_commit: d0add63f25a551d20ad17b3d0b17abde26b694b3
  product_loop_closed: true
  real_generation_chain_completed: true
  total_real_generation_trials: 4
  current_best_candidate: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
  accepted_candidate: true
  asset_status: accepted_candidate_with_minor_retouch
  commercial_delivery_ready: false
  memory_suitability: deferred
  generation_stopped: true
  recommended_default_route: final_retouch_planning
  next_phase_started: false
```
