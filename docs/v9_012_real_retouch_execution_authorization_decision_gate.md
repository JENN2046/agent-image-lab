# v9.012 Real Retouch Execution Authorization Decision Gate

```yaml
phase: v9_012_real_retouch_execution_authorization_decision_gate
base_contract: AGENTS.md
mode: A4.8_docs_only_authorization_decision_gate
source_phase: v9_011_real_retouch_execution_planning_gate
source_commit: 260adfccb94b1bd1ff4ed9fa89be63d8d5ca853d
selected_asset: ceramic_mug_v4
source_output: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
previous_review_result: needs_final_retouch
final_retouch_action_package_created: true
real_retouch_execution_planning_created: true
real_retouch_execution_performed: false
image_editing_performed: false
derivative_image_created: false
commercial_delivery_ready: false
memory_suitability: deferred
production_candidate_002_allowed_now: false
memory_write_allowed_now: false
human_decision_required: true
```

## Purpose

v9.012 records the human decision point after the real retouch execution plan was created for `ceramic_mug_v4`.

This gate does not authorize execution by itself. It presents the available routes and stops before real retouching, image editing, derivative creation, accepted sample writing, memory writing, production promotion, or runtime work.

## Current Evidence

```yaml
selected_asset: ceramic_mug_v4
source_output: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
previous_review_result: needs_final_retouch
final_retouch_action_package_created: true
real_retouch_execution_planning_created: true
commercial_delivery_ready: false
memory_suitability: deferred
production_candidate_002_allowed_now: false
memory_write_allowed_now: false
```

## Option A — Authorize Real Retouch Execution

Meaning: authorize a future phase to perform real retouch execution and create derivative retouch files.

Risk: medium to high.

Requirements:

- A separate v9.013 real retouch execution gate.
- Exact input file path.
- Exact derivative output directory.
- Exact maximum derivative output count.
- Clear derivative naming policy.
- No overwrite of the source image.
- No staging or committing of the original `runs/` output image.
- No provider generation.
- No `.env.local` read.
- No memory write.
- No production candidate promotion.

Use this option if the goal is to complete the `ceramic_mug_v4` commercial delivery preparation loop before switching lanes.

## Option B — Close Ceramic Mug v4 First Asset Delivery Lane

Meaning: close the ceramic mug first asset delivery readiness lane without executing retouch.

Risk: lowest.

Result:

- Preserve the `needs_final_retouch` conclusion.
- Preserve the final retouch action package.
- Preserve the real retouch execution plan.
- Do not create derivative images.
- Do not enter production or memory.

Use this option if the goal is to control V9 length and avoid extending the ceramic mug lane further.

## Option C — Switch To Sports Visor Delivery Readiness Lane

Meaning: pause further ceramic mug work and move to second asset delivery readiness for the sports visor candidate.

Risk: low to medium.

Boundary:

- No new image generation.
- No provider contact.
- No memory write.
- No production candidate promotion.
- No accepted samples write.

Use this option if the next useful V9 value is comparing the delivery readiness process across a second asset.

## Recommendation

```yaml
recommended_option: authorize_real_retouch_execution_or_close_lane_based_on_human_goal
recommendation_detail:
  if_goal_is_complete_ceramic_mug_delivery_preparation_loop: authorize_real_retouch_execution
  if_goal_is_control_v9_length: close_ceramic_mug_first_asset_delivery_lane
not_recommended:
  production_candidate_002: true
  memory_write: true
  provider_contact_or_image_generation: not_recommended
human_decision_required: true
```

Codex must not infer the Option A execution authorization from this decision document. A future v9.013 execution phase requires a separate explicit authorization.

## Safety Boundary

```yaml
provider_contact: false
image_generation: false
retry: false
env_local_secret_value_read: false
secret_value_printed: false
DailyNote_write: false
VCP_memory_write: false
memory_write_path: false
production_candidate_002: false
Batch_005: false
dependency_change: false
package_json_modified: false
runs_output_committed: false
image_editing_performed: false
derivative_image_created: false
real_commercial_delivery_execution: false
commercial_delivery_ready: false
accepted_samples_written: false
```

## Next Gate

```yaml
recommended_next:
  phase: pending_human_real_retouch_execution_selection
  auto_execution_allowed: false
  purpose: 等待人工选择 Option A/B/C；不得自动进入真实修图、production、memory 或 runtime。
final_state:
  next_phase_started: false
```

## Closeout Template

```yaml
closeout:
  phase: v9_012_real_retouch_execution_authorization_decision_gate
  source_commit: 260adfccb94b1bd1ff4ed9fa89be63d8d5ca853d
  decision_gate:
    selected_asset: ceramic_mug_v4
    source_output: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
    previous_review_result: needs_final_retouch
    final_retouch_action_package_created: true
    real_retouch_execution_planning_created: true
    commercial_delivery_ready: false
    options_presented:
      - authorize_real_retouch_execution
      - close_ceramic_mug_first_asset_delivery_lane
      - switch_to_sports_visor_delivery_readiness_lane
    recommended_option: authorize_real_retouch_execution_or_close_lane_based_on_human_goal
    human_decision_required: true
```
