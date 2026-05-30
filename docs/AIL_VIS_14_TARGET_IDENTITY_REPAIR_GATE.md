# AIL-VIS-14 Target Identity Repair Gate

Base contract: `AGENTS.md`

Phase: `AIL-VIS-14_target_identity_repair_gate`
Mode: `docs_only_target_identity_repair`
Risk: `medium`

## Purpose

This phase repairs the visual target identity after the broad dark tech still-
life route produced ambiguous outputs.

The repaired target is a concrete product object:

- `premium_black_wireless_headphones_product_hero`

This phase updates the planning artifacts so the next generation authorization
can only proceed against one locked product identity.

This phase does not generate images, does not request A5, does not promote
samples, and does not write memory.

## Source Context

This repair follows the reconciliation closeout of:

- `AIL-VIS-13_authorized_generation_reconciliation_and_evidence_review`
  - commit: `a9b0b487ce2b1f3303195af989a8bdcf7ade1cc8`
  - branch: `ail-vis-13-authorized-generation-reconciliation`
  - status: `final_closed`
  - route_blocked: `true`

The reconciliation established that:

- the generation was owner-authorized
- no formal `AIL-VIS-14` execution gate had been opened
- the broad target produced two ambiguous outputs
- the route must be repaired before any new generation authorization

## Repaired Target

```yaml
target_repair:
  old_target: premium_dark_tech_product_still_life
  old_target_status: too_broad
  repaired_target: premium_black_wireless_headphones_product_hero
  reason: >
    The prior broad target allowed arbitrary dark tech objects.
    The headphone output exposed a concrete usable object class.
    Repairing to headphones preserves the dark premium tech direction while
    giving the model a locked product identity.
```

## Updated Planning Artifacts

### Shot Plan

```yaml
shot_plan:
  selected_product: premium_black_wireless_headphones_product_hero
  selected_product_category: premium_audio_product
  primary_shot_id: visual_production_next_shot_black_headphones_hero_01
  secondary_shot_id: visual_production_next_shot_black_headphones_material_detail_01
  generation_allowed_now: false
```

### Prompt Package

```yaml
prompt_package:
  selected_product: premium_black_wireless_headphones_product_hero
  target_shot_id: visual_production_next_shot_black_headphones_hero_01
  must_not_be:
    - lantern
    - speaker
    - camera lens
    - SSD
    - bottle
    - desk lamp
    - generic tech object
  model_or_provider: TBD
  provider_call_allowed_now: false
  image_generation_allowed_now: false
  memory_write_allowed_now: false
```

## Why This Repair Is Needed

The previous broad target:

- `premium_dark_tech_product_still_life`

was too open-ended. It let the model drift into different product identities
instead of staying on one concrete object class.

The headphone evidence makes the object class explicit enough to lock down.
Repairing the target identity now is safer than trying to widen the prompt
space again.

## Why No Generation Now

This phase is a repair gate, not a generation gate.

No generation should happen here because:

- the route is still blocked
- the target identity needed repair
- the planning artifacts must be updated first
- the next execution authorization has not been opened here

## Final State

```yaml
AIL_VIS_14_repair_final_state:
  target_identity_repaired: true
  generation_allowed_now: false
  memory_write_allowed_now: false
  accepted_sample_allowed_now: false
  next_phase_started: false
```

## Authorization Boundary

This phase does not authorize:

- image generation
- retry generation
- third image
- image editing
- provider call
- plugin call
- API call
- runtime execution
- Review Console runtime launch
- output directory creation
- A5 authorization request
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
- `package.json` modification
- `git add .`

## Why This Phase Exists

This phase exists so the next visual generation step has a concrete product
identity instead of a broad category that can drift.

The repair makes the future route more testable, more reviewable, and less
likely to split into unrelated products.

## Selected Next Phase

The next phase is only a future generation authorization gate after this repair
is accepted and the route is reopened.

This phase does not open that gate.

## Forbidden Actions

This phase forbids:

- image generation
- retry generation
- third image
- image editing
- provider call
- plugin call
- API call
- runtime execution
- Review Console runtime launch
- output directory creation
- A5 authorization request
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
- `package.json` modification
- `git add .`

## Closeout Template

```yaml
AIL_VIS_14_repair_closeout:
  phase_name: AIL-VIS-14_target_identity_repair_gate
  mode: docs_only_target_identity_repair
  status: completed_validated_pushed
  source_phase: AIL-VIS-13_authorized_generation_reconciliation_and_evidence_review
  commit_hash: a9b0b487ce2b1f3303195af989a8bdcf7ade1cc8
  branch: ail-vis-14-target-identity-repair
  repaired_target:
    old_target: premium_dark_tech_product_still_life
    new_target: premium_black_wireless_headphones_product_hero
    target_identity_repaired: true
  generation_allowed_now: false
  memory_write_allowed_now: false
  accepted_sample_allowed_now: false
  next_phase_started: false
```
