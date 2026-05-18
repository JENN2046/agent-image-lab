# v8 Route Selection Human Decision Gate

```yaml
phase: v8_route_selection_human_decision_gate
base_contract: AGENTS.md
mode: A4
intent: local_draft
risk_level: R1
source_commit: 6bcf427582cf46d7dd507e442ce2a4bbcba8e426
source_phase: v7.285_v7_product_loop_closeout_and_v8_route_planning_gate
human_selection_completed: true
selected_route: final_retouch_planning
selected_route_zh: 最终修图规划
```

## Purpose

This gate records the human V8 route decision after the V7 product loop closeout.
It selects `final_retouch_planning` for the current best candidate and stops before
any execution stage. It is documentation-only and does not create an image,
contact a provider, call a plugin, retry generation, write memory, enter runtime,
or promote anything to `production_candidate_002`.

## Starting State

```yaml
branch: master
source_commit: 6bcf427582cf46d7dd507e442ce2a4bbcba8e426
v7_product_loop_closed: true
real_generation_chain_completed: true
total_real_generation_trials: 4
current_best_candidate: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
asset_status: accepted_candidate_with_minor_retouch
commercial_delivery_ready: false
memory_suitability: deferred
generation_status: stopped
```

## Route Selected

```yaml
selected_route: final_retouch_planning
selected_route_zh: 最终修图规划
next_phase: v8_001_final_retouch_planning_gate
auto_execution_allowed_for_next: false
```

The selected route keeps v4 as the current best accepted candidate and moves the
project toward a paper retouch instruction package. This is the lowest-risk next
step because v4 is already accepted as a candidate, but still needs local polish
before it can be treated as commercial delivery ready.

## Selection Rationale

- v4 is already an `accepted_candidate_with_minor_retouch`.
- v4 is not yet `commercial_delivery_ready`.
- Continuing generation has lower expected value than retouch planning.
- Final retouch planning is A4 docs-only and does not require provider contact.
- The route can improve delivery readiness without creating a fifth generation.
- Memory suitability remains `deferred`; no memory write is authorized.

## Routes Rejected Now

```yaml
fifth_generation:
  selected: false
  reason: "Requires a new explicit A5 authorization and has lower expected value than retouch planning."

memory_write:
  selected: false
  reason: "Memory suitability is deferred and independent memory authorization is required."

production_candidate_002:
  selected: false
  reason: "Commercial delivery readiness is still false."

runtime_or_review_console_implementation:
  selected: false
  reason: "Runtime implementation is outside this A4 docs-only route selection gate."

second_product_switch:
  selected: false
  reason: "Useful later, but current best value is finishing the v4 candidate path first."
```

## Explicit Non-Authorization

```yaml
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
tag_release_deploy: false
runtime_execution: false
```

## Next Phase Boundary

`v8_001_final_retouch_planning_gate` may create a retouch instruction package for
the v4 output. It must remain non-executing unless the next task explicitly
authorizes otherwise. It must not edit, copy, move, stage, commit, or transform
the `runs/` output image.

## Closeout Template

```yaml
closeout:
  phase: v8_route_selection_human_decision_gate
  selected_route: final_retouch_planning
  current_best_candidate: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
  generation_stopped: true
  fifth_generation_started: false
  memory_write_allowed: false
  production_candidate_002_allowed: false
  human_selection_completed: true
  recommended_next:
    phase: v8_001_final_retouch_planning_gate
    auto_execution_allowed: false
    purpose: "为 v4 当前最佳候选制定最终修图说明包，不生成新图。"
```
