# v13.007 Next Product Visual Production Trial Planning Gate

```yaml
phase: v13_007_next_product_visual_production_trial_planning_gate
base_contract: AGENTS.md
mode: A4.8
intent: planning
risk_level: R2
source_phase: v13_006_visual_production_loop_foundation_closeout_or_next_route_decision_gate
source_commit: a17be5c9b3c6960cb7e59881a79e2768b2c66b1a
human_selected_option: next_product_visual_production_trial_planning
commit_message: "docs: plan next product visual production trial"
```

## Purpose

This gate applies the V13 Visual Production Loop foundation to the next product
planning lane. It selects a fourth product and drafts the planning objects needed
before any future prompt package or A5 generation decision.

This gate does not generate an image, contact a provider, create A5 execution
authorization, read `.env.local`, write memory, enter production, execute
retouch, execute delivery, modify `scripts/`, or modify `prompts/image_generation/`.

## Planning Artifact

- `docs/next_product_visual_production_trial_plan_v13_007.md`

## Selected Product

```yaml
selected_product: premium_portable_led_camping_lantern
selected_product_zh: 高端便携式 LED 露营灯
product_category: outdoor_lifestyle_electronics
recommended_for_future_generation: true
future_generation_authorized_now: false
provider_contact_allowed_now: false
image_generation_allowed_now: false
```

The lantern is recommended because it tests product qualities not yet covered by
the ceramic mug, sports visor, or serum bottle routes: emitted light, translucent
diffuser material, handle geometry, warm glow control, mixed outdoor/electronic
identity, and lifestyle context.

## Closeout

```yaml
closeout:
  phase: v13_007_next_product_visual_production_trial_planning_gate
  selected_product: premium_portable_led_camping_lantern
  product_brief_draft_created: true
  shot_plan_draft_created: true
  shot_list_created: true
  prompt_package_planning_requirements_created: true
  static_review_plan_created: true
  A5_decision_gate_prerequisites_created: true
  recommended_for_future_generation: true
  future_generation_authorized_now: false
  provider_contact: false
  image_generation: false
  memory_write: false
  production_candidate_002: false
  runtime_execution: false
  final_state:
    next_phase_started: false
```
