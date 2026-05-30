# AIL-VIS-09 Visual Eval Failure Taxonomy Hardening

Base contract: `AGENTS.md`

Phase: `AIL-VIS-09_visual_eval_failure_taxonomy_hardening`
Mode: `docs_only_protocol_hardening`
Risk: `low_to_medium`

## Source Context

This phase hardens the review language based on the first one-shot visual
review evidence.

The source review gate is:

- `AIL-VIS-08_retry_or_route_decision_gate`
  - commit: `199f4854395890ce255204f43179d1aae23b0d3d`
  - branch: `ail-vis-08-retry-or-route-decision-gate`
  - selected route: `route_A_hold_as_review_evidence`
  - image status: `review_evidence_only`

The underlying human review closeout is:

- `AIL-VIS-07_human_visual_review_closeout`
  - commit: `dcb36a1115008f339de15d54c87187b76f0f4e0d`
  - branch: `ail-vis-07-human-review-closeout`
  - decision: `pass_with_warnings`
  - score: `78`

## Observed Review Gaps From AIL-VIS-07

The first one-shot review exposed four reusable gaps:

- the image reads as a studio packshot rather than the intended outdoor /
  blue-hour lifestyle route
- the diffuser material reads more transparent than frosted
- visible controls do not fully match the shot plan and prompt intent
- the image is commercially usable, but not strong enough for promotion
  without further review or a new route decision

These gaps are not generation errors alone. They are review language gaps that
need clearer rubric and taxonomy coverage.

## Reason For Hardening

The previous rubric was good enough to classify the image as
`pass_with_warnings`, but it did not say strongly enough:

- how to separate a technically usable product packshot from the intended
  lifestyle shot role
- how to distinguish clean-looking material from material that matches the
  prompt intent
- how to keep `pass_with_warnings` from being mistaken for an automatic
  promotion signal

This phase therefore strengthens the reusable review language before the next
visual cycle.

## Rubric Updates

### Scene Intent Match

Add explicit guidance that a clean studio-looking result is not sufficient when
the route requires an outdoor / lifestyle / blue-hour scene.

The review should ask:

- does the image satisfy the intended scene role?
- does it merely satisfy the product hero role?
- is the route goal represented, or only the product itself?

### Material Surface Match

Add explicit guidance that material realism includes the intended surface
character, not just plausibility.

The review should ask:

- does the diffuser read frosted when the route expects frosted?
- is translucency aligned with the prompt, or only visually clean?
- does the material support the product identity instead of softening it into a
  generic lamp surface?

### Control Layout Compliance

Add explicit guidance that visible controls must match the shot plan and prompt
constraints.

The review should ask:

- are visible controls placed where the shot plan expects them?
- do knobs / switches / dials reinforce the intended model?
- do the controls create a mismatch with the route or product story?

### Shot Role Adherence

Add explicit guidance that a technically usable image can still fail the route
if it does not satisfy the intended shot role.

The review should ask:

- is the image merely usable, or is it the right shot for this phase?
- does it satisfy the exact route purpose, not just the product category?

### Product Identity Strength

Add explicit guidance that product identity must remain specific.

The review should ask:

- does the asset clearly read as a modern LED lantern?
- does it drift toward generic lantern / retro lamp / decorative light?
- is the intended product family unambiguous at a glance?

### Promotion Threshold Clarification

Add explicit guidance that `pass_with_warnings` does not automatically mean:

- accepted sample
- memory candidate
- retry authorization
- production candidate

It means the result is usable review evidence with warnings that must be carried
forward into the next decision.

## Failure Taxonomy Updates

Add or clarify the following review tags in the taxonomy and use them when the
gap is specific:

- `scene_intent_mismatch`
  - use when the image is technically usable but does not match the intended
    scene role
- `material_surface_mismatch`
  - use when the surface reads clean but not as the intended material
- `control_layout_mismatch`
  - use when visible controls conflict with the shot plan or prompt intent
- `shot_role_underrepresented`
  - use when the image is valid evidence but not strong enough for the intended
    route role
- `product_identity_ambiguity`
  - use when the product reads generically rather than as the intended modern
    LED identity

Retain the existing broader tags for cross-case consistency:

- `subject_drift`
- `material_fake_or_plastic`
- `lighting_inconsistent`
- `composition_unusable`
- `commercial_unfit`
- `background_noise`
- `detail_distortion`
- `text_logo_or_brand_risk`
- `human_or_hand_anomaly`
- `ai_artifact_visible`
- `provenance_or_trace_missing`
- `memory_unsuitable`

## Pass With Warnings Policy

`pass_with_warnings` means:

- the image is valid review evidence
- the image can be held as reference evidence
- the image is not automatically promoted
- the image does not unlock accepted-sample status
- the image does not unlock memory write
- the image does not unlock retry by itself
- the image does not unlock production candidate promotion

This is a review result, not an execution authorization.

## Future Review Usage

Use this hardened language in future review rounds so the team can record
precise reasons for:

- why a result is review evidence only
- why a result is close but not promotable
- why a result needs a new route instead of a blind retry

## Forbidden Actions

This phase forbids:

- retry generation
- second image
- image editing
- provider call
- plugin call
- API call
- runtime execution
- Review Console runtime launch
- accepted sample promotion
- memory candidate creation
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
AIL_VIS_09_taxonomy_hardening_closeout:
  phase_name: AIL-VIS-09_visual_eval_failure_taxonomy_hardening
  source_phase: AIL-VIS-08_retry_or_route_decision_gate
  source_commit: 199f4854395890ce255204f43179d1aae23b0d3d
  source_route: route_A_hold_as_review_evidence
  decision: hardened_review_language_only
  visual_eval_hardened: true
  pass_with_warnings_policy: clarified
  retry_allowed_now: false
  generation_allowed_now: false
  memory_write_allowed_now: false
  accepted_sample_allowed_now: false
  next_phase_started: false
```
