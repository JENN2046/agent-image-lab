# v8.002 Retouch Acceptance Criteria Or Delivery Package Gate

```yaml
phase: v8_002_retouch_acceptance_criteria_or_delivery_package_gate
base_contract: AGENTS.md
mode: A4
intent: local_draft
risk_level: R1
source_phase: v8_001_final_retouch_planning_gate
source_commit: 5ce86e0f5297f8a25b2195746f286c7eca0ba5e7
current_best_candidate: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
```

## Purpose

This phase defines how the v4 accepted candidate should be judged after future
retouch and what fields a delivery package must contain before commercial
delivery review. It is A4 docs-only and does not generate, retouch, move, stage,
or commit an image.

## Created Artifacts

```yaml
retouch_acceptance_criteria_ref: docs/retouch_acceptance_criteria_matte_ceramic_mug_v4.md
delivery_package_spec_ref: docs/delivery_package_spec_matte_ceramic_mug_v4.md
retouch_plan_ref: docs/final_retouch_plan_matte_ceramic_mug_v4.md
```

## Acceptance Coverage

The acceptance criteria cover:

- handle attachment cleanup;
- rim edge cleanup;
- background brightness and transparency improvement;
- bottom shadow refinement;
- matte ceramic microtexture preservation;
- no logo, no text, no props, no people;
- no over-sharpening;
- no product shape drift;
- no plastic or metallic material drift.

## Decision Outcomes

```yaml
decision_outcomes:
  pass:
    meaning: "All required retouch criteria pass; asset may enter commercial delivery review."
    commercial_delivery_ready: "candidate_for_review"

  needs_rework:
    meaning: "Retouch is directionally useful but still needs bounded local correction."
    commercial_delivery_ready: false

  fail:
    meaning: "Retouch damages product identity, material, composition, or forbidden boundary."
    commercial_delivery_ready: false
```

## Delivery Package Structure

The delivery package must include source candidate path, optional future
retouched asset reference, current asset status, target review status, retouch
plan reference, acceptance criteria reference, human reviewer, review decision,
commercial delivery readiness flag, and memory suitability state.

## Why Memory Remains Deferred

`memory_suitability` remains `deferred` because this phase only defines retouch
acceptance and delivery-package structure. It does not decide that the image loop
should enter memory, does not draft DailyNote body text, and does not authorize
VCP memory write.

## Why Production Candidate 002 Remains Blocked

The current asset is not commercial delivery ready. A paper delivery package is
not a production promotion. `production_candidate_002` requires an independent
authorization and a later human readiness decision after retouch review.

## Explicit Non-Authorization

```yaml
fifth_generation: false
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
runtime_execution: false
```

## Recommended Next

```yaml
phase: v8_003_delivery_package_closeout_or_retouch_handoff_gate
auto_execution_allowed: false
purpose: "封存修图交付包，或进入人工修图交接说明；不生成新图。"
```
