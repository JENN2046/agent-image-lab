# v13.006 Visual Production Loop Foundation Closeout Or Next Route Decision Gate

```yaml
phase: v13_006_visual_production_loop_foundation_closeout_or_next_route_decision_gate
base_contract: AGENTS.md
mode: A4.8
intent: planning
risk_level: R1
source_phase: v13_005_existing_asset_loop_reconstruction_docs_only_gate
source_commit: 9fb10d57fd1586eab2bab79d3418c37af501b01a
commit_message: "docs: close visual production loop foundation"
```

## Purpose

This gate closes the V13 foundational lane and presents the next route choices.
It does not enter real execution.

## Foundation Result

```yaml
v13_foundation_closed: true
canonical_model_created: true
state_machine_created: true
static_review_completed: true
existing_asset_reconstruction_completed: true
selected_asset: premium_serum_bottle_v10_011
real_generation_not_performed: true
provider_not_contacted: true
memory_not_written: true
retouch_not_executed: true
delivery_not_executed: true
accepted_samples_not_written: true
runs_output_not_committed: true
```

## Next Route Options

### Option A — one_more_existing_asset_reconstruction

Reconstruct `ceramic_mug_v4` or `sports_visor_v8_033` as a second sample.

Risk: low.

Value: tests whether the canonical model remains stable across product
categories.

### Option B — next_product_visual_production_trial_planning

Select a fourth product and create brief / shot / prompt / static review plan.

Risk: medium.

Boundary: no image generation in the planning gate.

Recommendation: primary.

### Option C — retouch_delivery_entry_criteria_gate

Define entry criteria for moving accepted candidates into real retouch or
delivery readiness planning.

Risk: medium.

Boundary: no real retouch and no real delivery.

### Option D — visual_memory_policy_gate

Define visual memory suitability and write-policy gates.

Risk: medium to high.

Boundary: no memory write.

### Option E — close_v13_foundation_and_stop

Close the V13 foundation and wait for a broader human route choice.

Risk: lowest.

## Recommendation

```yaml
recommended_option: next_product_visual_production_trial_planning
backup_option: one_more_existing_asset_reconstruction
human_decision_required: true
```

Option B is recommended because the foundation now has a canonical model and one
reconstruction sample; the next useful product value is planning the next visual
production trial without running generation. Option A is the safest backup if
the project wants one more reconstruction before a new product lane.

## Closeout

```yaml
closeout:
  phase: v13_006_visual_production_loop_foundation_closeout_or_next_route_decision_gate
  v13_foundation_closed: true
  canonical_model_created: true
  state_machine_created: true
  static_review_completed: true
  existing_asset_reconstruction_completed: true
  selected_asset: premium_serum_bottle_v10_011
  provider_contact: false
  image_generation: false
  memory_write: false
  real_retouch_execution: false
  real_commercial_delivery_execution: false
  accepted_samples_written: false
  runs_output_committed: false
  options_presented:
    - one_more_existing_asset_reconstruction
    - next_product_visual_production_trial_planning
    - retouch_delivery_entry_criteria_gate
    - visual_memory_policy_gate
    - close_v13_foundation_and_stop
  recommended_option: next_product_visual_production_trial_planning
  backup_option: one_more_existing_asset_reconstruction
  human_decision_required: true
  recommended_next:
    phase: pending_human_v13_next_route_selection
    auto_execution_allowed: false
  final_state:
    next_phase_started: false
```
